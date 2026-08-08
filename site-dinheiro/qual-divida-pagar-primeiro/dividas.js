/* ============================================================
   Qual dívida pagar primeiro? — simulação dos dois métodos
   Tudo roda no navegador. Nenhum valor sai do aparelho.
   ============================================================ */
(function () {
  "use strict";

  var CHECKOUT = "https://pay.kiwify.com.br/BhOeiGG";

  /* Taxas médias de mercado ao mês, usadas só como sugestão inicial e sempre
     editáveis. A pessoa é instruída na página a conferir na própria fatura,
     porque a taxa real varia muito por banco, por perfil e por contrato. */
  var TIPOS = [
    { nome: "Cartão de crédito (rotativo)", taxa: 14 },
    { nome: "Cartão de crédito (parcelado)", taxa: 7 },
    { nome: "Cheque especial",               taxa: 8 },
    { nome: "Crediário / carnê de loja",     taxa: 6 },
    { nome: "Empréstimo pessoal",            taxa: 5 },
    { nome: "Empréstimo consignado",         taxa: 1.8 },
    { nome: "Financiamento de veículo",      taxa: 1.8 },
    { nome: "Financiamento imobiliário",     taxa: 0.9 },
    { nome: "Conta atrasada (luz, água)",    taxa: 2 },
    { nome: "Outra dívida",                  taxa: 5 }
  ];

  var LIMITE_MESES = 600;   // 50 anos: além disso tratamos como "não quita"

  var BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

  var lista = document.getElementById("listaDividas");
  var elOrcamento = document.getElementById("orcamento");
  var elResultado = document.getElementById("resultado");
  var elAviso = document.getElementById("aviso");
  var jaMediu = false;
  var seq = 0;

  /* ---------- Utilidades ---------- */

  function medir(nome, params) {
    if (typeof window.medir === "function") window.medir(nome, params);
  }

  // O ponto é ambíguo em pt-BR: em "1.800" é milhar, em "1200.50" é decimal.
  function numero(texto) {
    if (!texto) return 0;
    var limpo = String(texto).replace(/[^\d,.]/g, "");
    if (limpo.indexOf(",") > -1) {
      limpo = limpo.replace(/\./g, "").replace(",", ".");
    } else if (limpo.indexOf(".") > -1) {
      var partes = limpo.split(".");
      if (partes.slice(1).every(function (p) { return p.length === 3; })) limpo = partes.join("");
    }
    var n = parseFloat(limpo);
    return isFinite(n) && n > 0 ? n : 0;
  }

  function escapar(t) {
    var d = document.createElement("div");
    d.textContent = t;
    return d.innerHTML;
  }

  function plural(n, um, muitos) {
    return n + " " + (n === 1 ? um : muitos);
  }

  function tempo(meses) {
    if (meses >= LIMITE_MESES) return "nunca";
    var anos = Math.floor(meses / 12);
    var resto = meses % 12;
    if (anos === 0) return plural(meses, "mês", "meses");
    if (resto === 0) return plural(anos, "ano", "anos");
    return plural(anos, "ano", "anos") + " e " + plural(resto, "mês", "meses");
  }

  /* ---------- Linhas de dívida ---------- */

  function opcoesTipo() {
    return TIPOS.map(function (t, i) {
      return '<option value="' + i + '">' + escapar(t.nome) + "</option>";
    }).join("");
  }

  function adicionarDivida(tipoIndice) {
    seq++;
    var div = document.createElement("div");
    div.className = "divida";
    div.innerHTML =
      '<div class="divida-topo"><b>Dívida ' + seq + "</b>" +
      '<button type="button" class="divida-remover">remover</button></div>' +
      '<div class="divida-campos">' +
        '<div class="campo divida-nome">' +
          '<label>O que é</label>' +
          '<select class="d-tipo">' + opcoesTipo() + "</select>" +
        "</div>" +
        '<div class="campo">' +
          "<label>Quanto você deve (R$)</label>" +
          '<input type="text" inputmode="numeric" class="d-saldo" placeholder="0">' +
        "</div>" +
        '<div class="campo">' +
          "<label>Juros ao mês (%)</label>" +
          '<input type="text" inputmode="decimal" class="d-taxa">' +
        "</div>" +
        '<div class="campo divida-nome">' +
          "<label>Parcela mínima por mês (R$)</label>" +
          '<input type="text" inputmode="numeric" class="d-minimo" placeholder="0">' +
        "</div>" +
      "</div>";

    var seletor = div.querySelector(".d-tipo");
    var campoTaxa = div.querySelector(".d-taxa");
    seletor.value = String(tipoIndice || 0);
    campoTaxa.value = String(TIPOS[tipoIndice || 0].taxa).replace(".", ",");

    // Trocar o tipo só reescreve a taxa se a pessoa ainda não a editou.
    var taxaTocada = false;
    campoTaxa.addEventListener("input", function () { taxaTocada = true; calcular(); });
    seletor.addEventListener("change", function () {
      if (!taxaTocada) campoTaxa.value = String(TIPOS[Number(seletor.value)].taxa).replace(".", ",");
      calcular();
    });

    div.querySelector(".d-saldo").addEventListener("input", calcular);
    div.querySelector(".d-minimo").addEventListener("input", calcular);
    div.querySelector(".divida-remover").addEventListener("click", function () {
      div.remove();
      renumerar();
      calcular();
    });

    lista.appendChild(div);
  }

  function renumerar() {
    Array.prototype.forEach.call(lista.querySelectorAll(".divida"), function (d, i) {
      d.querySelector(".divida-topo b").textContent = "Dívida " + (i + 1);
    });
    seq = lista.querySelectorAll(".divida").length;
  }

  function lerDividas() {
    return Array.prototype.map.call(lista.querySelectorAll(".divida"), function (d) {
      var i = Number(d.querySelector(".d-tipo").value);
      return {
        nome: TIPOS[i].nome,
        saldo: numero(d.querySelector(".d-saldo").value),
        taxa: numero(d.querySelector(".d-taxa").value) / 100,
        minimo: numero(d.querySelector(".d-minimo").value)
      };
    }).filter(function (d) { return d.saldo > 0; });
  }

  /* ---------- Simulação ----------
     A cada mês: os juros incidem sobre o saldo, pagam-se os mínimos de todas as
     dívidas e todo o dinheiro que sobra do orçamento vai para a dívida-alvo do
     método. Quando uma dívida zera, a parcela dela inteira passa a engrossar o
     extra — é o efeito que acelera as seguintes. */

  function simular(dividas, orcamento, criterio) {
    var estado = dividas.map(function (d) {
      return { nome: d.nome, saldo: d.saldo, taxa: d.taxa, minimo: d.minimo };
    });

    var totalJuros = 0;
    var mes = 0;
    var quitacoes = [];

    while (mes < LIMITE_MESES) {
      var ativas = estado.filter(function (d) { return d.saldo > 0.005; });
      if (!ativas.length) break;
      mes++;

      ativas.forEach(function (d) {
        var juros = d.saldo * d.taxa;
        d.saldo += juros;
        totalJuros += juros;
      });

      var caixa = orcamento;

      // Mínimos primeiro, nunca acima do saldo devedor.
      ativas.forEach(function (d) {
        var pago = Math.min(d.minimo, d.saldo, caixa);
        d.saldo -= pago;
        caixa -= pago;
      });

      // O que sobrou vai para a dívida-alvo e cascateia para a próxima.
      var fila = ativas.filter(function (d) { return d.saldo > 0.005; }).sort(criterio);
      for (var i = 0; i < fila.length && caixa > 0.005; i++) {
        var pago2 = Math.min(fila[i].saldo, caixa);
        fila[i].saldo -= pago2;
        caixa -= pago2;
      }

      ativas.forEach(function (d) {
        if (d.saldo <= 0.005 && !d.quitadaEm) {
          d.quitadaEm = mes;
          quitacoes.push({ nome: d.nome, mes: mes });
        }
      });
    }

    var quitou = estado.every(function (d) { return d.saldo <= 0.005; });
    return {
      quitou: quitou,
      meses: quitou ? mes : LIMITE_MESES,
      juros: totalJuros,
      quitacoes: quitacoes
    };
  }

  var porTaxa  = function (a, b) { return b.taxa - a.taxa || a.saldo - b.saldo; };
  var porSaldo = function (a, b) { return a.saldo - b.saldo || b.taxa - a.taxa; };

  /* ---------- Cálculo e tela ---------- */

  function calcular() {
    var dividas = lerDividas();
    var orcamento = numero(elOrcamento.value);
    var somaMinimos = dividas.reduce(function (s, d) { return s + d.minimo; }, 0);

    if (dividas.length < 2 || orcamento <= 0) {
      elResultado.hidden = true;
      elAviso.hidden = true;
      return;
    }

    // Sem cobrir os mínimos, comparar métodos é conversa fora de lugar:
    // o problema deixou de ser a ordem e virou renegociação.
    if (orcamento < somaMinimos) {
      elResultado.hidden = true;
      elAviso.hidden = false;
      document.getElementById("avisoTexto").innerHTML =
        "As parcelas mínimas somam <b>" + BRL.format(somaMinimos) + "</b> e você informou <b>" +
        BRL.format(orcamento) + "</b> disponíveis. Faltam <b>" +
        BRL.format(somaMinimos - orcamento) + "</b> por mês só para não atrasar. " +
        "Nesse ponto nenhuma ordem de pagamento resolve — o caminho é <b>renegociar prazo e taxa</b> " +
        "antes de escolher método. A orientação é gratuita no Procon e nos mutirões de renegociação, " +
        "e a Lei 14.181/2021 garante repactuação preservando o mínimo existencial.";
      return;
    }
    elAviso.hidden = true;

    var av = simular(dividas, orcamento, porTaxa);
    var bn = simular(dividas, orcamento, porSaldo);

    if (!av.quitou && !bn.quitou) {
      elResultado.hidden = true;
      elAviso.hidden = false;
      document.getElementById("avisoTexto").innerHTML =
        "Com <b>" + BRL.format(orcamento) + "</b> por mês, os juros crescem mais rápido do que o " +
        "pagamento e a dívida não fecha por nenhum dos dois métodos. Isso não é falha sua: é o que " +
        "acontece quando a taxa é alta demais para o valor disponível. O caminho aqui é " +
        "<b>renegociar a taxa</b> ou trocar a dívida cara por uma mais barata — não mudar a ordem. " +
        "Procure o Procon da sua cidade; o atendimento é gratuito.";
      return;
    }

    /* --- Veredito --- */
    var economia = bn.juros - av.juros;
    var chapeu = document.getElementById("rChapeu");
    var estrela = document.getElementById("rEstrela");
    var frase = document.getElementById("rFrase");
    var cx = document.getElementById("veredito");

    var primeiraAvalanche = dividas.slice().sort(porTaxa)[0];
    var primeiraNeve = dividas.slice().sort(porSaldo)[0];
    var mesmaDivida = primeiraAvalanche.nome === primeiraNeve.nome &&
                      primeiraAvalanche.saldo === primeiraNeve.saldo;

    chapeu.textContent = "Comece pagando";
    estrela.textContent = primeiraAvalanche.nome;

    if (mesmaDivida) {
      cx.className = "veredito bom";
      frase.innerHTML = "Os dois métodos apontam para a <b>mesma dívida</b>: ela é ao mesmo tempo a " +
        "mais cara e a menor. Não há dilema aqui — ataque essa primeiro e siga a ordem abaixo.";
    } else if (economia < 50) {
      cx.className = "veredito bom";
      frase.innerHTML = "A avalanche economiza apenas <b>" + BRL.format(economia) + "</b> em relação " +
        "à bola de neve. A diferença é pequena o bastante para o critério passar a ser outro: " +
        "escolha <b>o método que você consegue seguir até o fim</b>. Se quitar " +
        escapar(primeiraNeve.nome) + " rápido te mantém no plano, comece por ela.";
    } else {
      cx.className = "veredito atencao";
      frase.innerHTML = "Atacar primeiro a de maior taxa economiza <b>" + BRL.format(economia) +
        "</b> de juros em relação a começar pela menor dívida, e termina " +
        (bn.meses - av.meses > 0 ? plural(bn.meses - av.meses, "mês", "meses") + " antes" : "no mesmo prazo") +
        ". Se você precisa de uma vitória rápida para não desistir, começar por " +
        escapar(primeiraNeve.nome) + " custa esses " + BRL.format(economia) + ".";
    }

    /* --- Duelo --- */
    document.getElementById("avMeses").textContent = tempo(av.meses);
    document.getElementById("avJuros").textContent = av.quitou
      ? BRL.format(av.juros) + " de juros no total" : "não fecha com esse valor";
    document.getElementById("bnMeses").textContent = tempo(bn.meses);
    document.getElementById("bnJuros").textContent = bn.quitou
      ? BRL.format(bn.juros) + " de juros no total" : "não fecha com esse valor";

    document.getElementById("ladoAvalanche").className = "lado" + (av.juros <= bn.juros ? " vence" : "");
    document.getElementById("ladoNeve").className = "lado" + (bn.juros < av.juros ? " vence" : "");

    document.getElementById("diferenca").innerHTML = economia > 0
      ? "A diferença entre os dois caminhos é de <b>" + BRL.format(economia) + "</b> — é o preço da " +
        "motivação, e só você sabe se ele vale."
      : "Nos seus números os dois caminhos custam praticamente o mesmo. Escolha pelo que for mais " +
        "fácil de manter.";

    /* --- Ordem de quitação (pelo método mais barato) --- */
    var melhor = av.juros <= bn.juros ? av : bn;
    var ordem = document.getElementById("ordem");
    ordem.innerHTML = "";
    melhor.quitacoes.forEach(function (q, i) {
      var d = dividas.filter(function (x) { return x.nome === q.nome; })[0] || {};
      var li = document.createElement("li");
      li.innerHTML = "<b>" + escapar(q.nome) + "</b><span>" +
        BRL.format(d.saldo || 0) + " a " + String((d.taxa * 100).toFixed(1)).replace(".", ",") +
        "% ao mês · quitada por volta do mês " + q.mes +
        (i === 0 ? " · <b>é aqui que vai todo o dinheiro extra</b>" : "") + "</span>";
      ordem.appendChild(li);
    });

    /* --- O que mais pesa --- */
    var maisCara = dividas.slice().sort(porTaxa)[0];
    var jurosMesDela = maisCara.saldo * maisCara.taxa;
    var jurosMesTodas = dividas.reduce(function (s, d) { return s + d.saldo * d.taxa; }, 0);
    document.getElementById("vTitulo").textContent = "O que está te custando mais: " + maisCara.nome;
    document.getElementById("vTexto").innerHTML =
      "Só de juros, essa dívida consome <b>" + BRL.format(jurosMesDela) + " por mês</b> — " +
      Math.round((jurosMesDela / jurosMesTodas) * 100) + "% de todo o juro que você paga, " +
      "com apenas " + Math.round((maisCara.saldo / dividas.reduce(function (s, d) { return s + d.saldo; }, 0)) * 100) +
      "% do valor total devido. Enquanto ela existir, é ela que segura o plano.";

    elResultado.hidden = false;

    if (!jaMediu) {
      jaMediu = true;
      medir("plano_dividas_pronto", {
        qtd_dividas: dividas.length,
        meses_avalanche: av.meses,
        meses_bola_de_neve: bn.meses,
        economia_faixa: economia < 50 ? "quase nula" : economia < 500 ? "ate 500" :
                        economia < 2000 ? "500 a 2000" : "acima de 2000",
        quita: av.quitou
      });
    }
  }

  /* ---------- Saídas ---------- */

  document.getElementById("btnAdicionar").addEventListener("click", function () {
    adicionarDivida(9);
    lista.lastElementChild.querySelector(".d-saldo").focus();
  });

  document.getElementById("btnCopiar").addEventListener("click", function () {
    var botao = this;
    var linhas = ["MINHA ORDEM DE QUITAÇÃO", ""];
    Array.prototype.forEach.call(document.querySelectorAll("#ordem li"), function (li, i) {
      linhas.push((i + 1) + ". " + li.querySelector("b").textContent);
      linhas.push("   " + li.querySelector("span").textContent.replace(/\s+/g, " "));
    });
    linhas.push("");
    linhas.push("Avalanche: " + document.getElementById("avMeses").textContent +
                " · " + document.getElementById("avJuros").textContent);
    linhas.push("Bola de neve: " + document.getElementById("bnMeses").textContent +
                " · " + document.getElementById("bnJuros").textContent);
    linhas.push("");
    linhas.push("Monte o seu: " + location.href.split("#")[0]);

    function aviso(ok) {
      botao.textContent = ok ? "Copiado!" : "Não consegui copiar";
      setTimeout(function () { botao.textContent = "Copiar meu plano"; }, 2200);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(linhas.join("\n"))
        .then(function () { aviso(true); medir("copiou_plano_dividas"); },
              function () { aviso(false); });
    } else { aviso(false); }
  });

  var btnPago = document.getElementById("btnPago");
  if (CHECKOUT) {
    btnPago.href = CHECKOUT;
    btnPago.target = "_blank";
    btnPago.rel = "noopener";
    btnPago.addEventListener("click", function () {
      medir("clique_plano", { preco: 19.9, origem: "qual-divida-pagar-primeiro" });
    });
  } else {
    btnPago.textContent = "Plano completo em breve";
    btnPago.setAttribute("aria-disabled", "true");
    btnPago.style.opacity = ".62";
    btnPago.style.cursor = "default";
    btnPago.addEventListener("click", function (e) { e.preventDefault(); });
  }

  /* ---------- Início ---------- */

  elOrcamento.addEventListener("input", calcular);

  // Duas linhas já abertas: com uma dívida só não existe pergunta a responder.
  adicionarDivida(0);
  adicionarDivida(4);
})();
