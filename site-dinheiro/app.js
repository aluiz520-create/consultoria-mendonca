/* ============================================================
   Para onde foi meu dinheiro? — lógica do diagnóstico
   Tudo roda no navegador. Nenhum valor sai do aparelho.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Configuração do proprietário ---------- */

  // Medição. Deixe vazio para não medir nada.
  var ID_ANALYTICS = "";

  // Checkout do plano de R$ 19,90 — ativo desde 08/08/2026.
  // O produto existe: PDF de 9 páginas + planilha de 3 abas, entregues pela Kiwify.
  // Se esvaziar, o botão volta a ficar desabilitado sozinho.
  var CHECKOUT = "https://pay.kiwify.com.br/BhOeiGG";

  // Conversa de apoio quando não há checkout. Vazio esconde o botão de pagamento.
  var WHATSAPP = "";

  /* ---------- Constantes do cálculo ---------- */

  var RESERVA = 0.10;      // folga que consideramos saudável na conta inversa
  var DIAS = 30;           // mês comercial, para custo diário
  // Escala de equivalência modificada da OCDE
  var EQ_ADULTO_EXTRA = 0.5;
  var EQ_CRIANCA = 0.3;

  /* Piso oficial — metodologia do DIEESE.
     O instituto calcula o salário mínimo necessário como:
       cesta básica mais cara entre as capitais × 3 (alimentação = 1/3 do orçamento, art. 7º da
       Constituição) × adultos-equivalentes, contando cada criança como 0,4 de adulto.
     A família de referência é 2 adultos + 2 crianças, ou seja 2,8 equivalentes.
     Ancoramos no número publicado para que a família de referência devolva exatamente ele.
     Para atualizar: troque os três valores abaixo quando sair a pesquisa do mês. */
  var DIEESE = {
    mes: "junho de 2026",
    necessario_familia_referencia: 8110.92,
    equivalentes_referencia: 2.8,
    cesta_media_capitais: 779.95
  };
  var DIEESE_POR_EQUIVALENTE = DIEESE.necessario_familia_referencia / DIEESE.equivalentes_referencia;
  var EQ_CRIANCA_DIEESE = 0.4;

  // Referências de planejamento, em % da renda da casa. Bússola, não regra.
  var REFERENCIA = {
    "Moradia": 30,
    "Contas de casa": 8,
    "Alimentação": 20,
    "Transporte": 15,
    "Dívidas": 10,
    "Filhos e educação": 10,
    "Saúde": 8,
    "Assinaturas": 4,
    "Outros": 5
  };

  var BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  var BRL2 = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2, maximumFractionDigits: 2 });

  var casa = { adultos: 1, pequenas: 0, grandes: 0 };
  var jaMediu = false;

  var elRendas = Array.prototype.slice.call(document.querySelectorAll("[data-renda]"));
  var elGastos = Array.prototype.slice.call(document.querySelectorAll("[data-gasto]"));
  var elRotativo = document.getElementById("rotativo");
  var elEspecial = document.getElementById("especial");
  var elTaxa = document.getElementById("taxa");
  var elResultado = document.getElementById("resultado");

  /* ---------- Utilidades ---------- */

  function medir(nome, params) {
    if (typeof window.gtag === "function") window.gtag("event", nome, params || {});
  }

  // O ponto é ambíguo em pt-BR: em "1.800" é milhar, em "1200.50" é decimal.
  // Critério: se todo grupo depois de um ponto tem exatamente 3 dígitos, é milhar.
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

  function pessoas() {
    return casa.adultos + casa.pequenas + casa.grandes;
  }

  function adultoEquivalente() {
    var extras = Math.max(0, casa.adultos - 1);
    return 1 + extras * EQ_ADULTO_EXTRA + (casa.pequenas + casa.grandes) * EQ_CRIANCA;
  }

  /* ---------- Contadores de pessoas ---------- */

  Array.prototype.forEach.call(document.querySelectorAll(".contador"), function (grupo) {
    var chave = grupo.dataset.conta;
    grupo.addEventListener("click", function (e) {
      var botao = e.target.closest("button");
      if (!botao) return;
      var passo = Number(botao.dataset.passo);
      var minimo = chave === "adultos" ? 1 : 0;
      casa[chave] = Math.max(minimo, Math.min(12, casa[chave] + passo));
      atualizarContadores();
      calcular();
    });
  });

  function atualizarContadores() {
    document.getElementById("qtdAdultos").textContent = casa.adultos;
    document.getElementById("qtdPequenas").textContent = casa.pequenas;
    document.getElementById("qtdGrandes").textContent = casa.grandes;
    Array.prototype.forEach.call(document.querySelectorAll(".contador"), function (grupo) {
      var chave = grupo.dataset.conta;
      var minimo = chave === "adultos" ? 1 : 0;
      grupo.querySelector('[data-passo="-1"]').disabled = casa[chave] <= minimo;
      grupo.querySelector('[data-passo="1"]').disabled = casa[chave] >= 12;
    });
  }

  /* ---------- Barra fixa de progresso ---------- */

  function atualizarBarra(renda, custo, preenchidos) {
    var rot = document.getElementById("barraRot");
    var num = document.getElementById("barraNum");
    var traco = document.getElementById("aroTraco");
    var txt = document.getElementById("aroTxt");

    // 1 ponto pela renda + até 5 campos de gasto = diagnóstico liberado
    var alvo = 6;
    var feitos = Math.min(alvo, (renda > 0 ? 1 : 0) + Math.min(5, preenchidos));
    var pct = Math.round((feitos / alvo) * 100);
    var circunferencia = 2 * Math.PI * 19;

    traco.style.strokeDashoffset = String(circunferencia * (1 - pct / 100));
    txt.textContent = pct + "%";

    if (renda <= 0) {
      rot.textContent = "Comece pela renda";
      num.textContent = BRL.format(0);
      num.className = "barra-num";
      return;
    }
    if (preenchidos < 3) {
      rot.textContent = "Faltam " + (3 - preenchidos) + " valores para o seu resultado";
      num.textContent = BRL.format(custo);
      num.className = "barra-num";
      return;
    }
    var saldo = renda - custo;
    rot.textContent = saldo >= 0 ? "Sobra no mês" : "Falta no mês";
    num.textContent = (saldo >= 0 ? "" : "− ") + BRL.format(Math.abs(saldo));
    num.className = "barra-num " + (saldo >= 0 ? "pos" : "neg");
  }

  /* ---------- Cálculo ---------- */

  function calcular() {
    var renda = elRendas.reduce(function (s, el) { return s + numero(el.value); }, 0);

    var itens = elGastos.map(function (el) {
      return { nome: el.dataset.gasto, grupo: el.dataset.grupo, valor: numero(el.value) };
    });
    var preenchidos = itens.filter(function (i) { return i.valor > 0; }).length;
    var custo = itens.reduce(function (s, i) { return s + i.valor; }, 0);

    atualizarBarra(renda, custo, preenchidos);

    // Só mostra o diagnóstico quando há material suficiente para ele significar algo.
    if (renda <= 0 || preenchidos < 3) { elResultado.hidden = true; return; }

    var saldo = renda - custo;
    var custoDia = custo / DIAS;
    var diaQueAcaba = custoDia > 0 ? Math.floor(renda / custoDia) : DIAS;
    var precisa = custo / (1 - RESERVA);
    var eq = adultoEquivalente();
    var qtdPessoas = pessoas();

    /* --- Veredito --- */
    var chapeu = document.getElementById("rChapeu");
    var estrela = document.getElementById("rEstrela");
    var frase = document.getElementById("rFrase");
    var cx = document.getElementById("veredito");
    var classe;

    if (diaQueAcaba >= DIAS) {
      var pctSobra = (saldo / renda) * 100;
      if (pctSobra >= 5) {
        classe = "bom";
        chapeu.textContent = "O seu dinheiro cobre o mês inteiro";
        estrela.textContent = "Sobram " + BRL.format(saldo);
        frase.innerHTML = "A sua vida cabe no que entra. O próximo passo é decidir para onde essa sobra vai — " +
          "<b>sobra sem destino vira gasto sem lembrança</b>.";
      } else {
        classe = "atencao";
        chapeu.textContent = "O seu dinheiro cobre o mês, no limite";
        estrela.textContent = "Sobram " + BRL.format(saldo);
        frase.innerHTML = "Você fecha o mês, mas sem folga. <b>Qualquer imprevisto vira parcelamento</b>, " +
          "porque não existe reserva para absorver susto.";
      }
    } else {
      classe = "ruim";
      chapeu.textContent = "O seu salário acaba no dia";
      estrela.textContent = String(Math.max(1, diaQueAcaba));
      frase.innerHTML = "A partir daí você gasta o que ainda não tem — e é por isso que o cartão " +
        "entra na conta todo mês. O buraco é de <b>" + BRL.format(Math.abs(saldo)) + "</b> e não é " +
        "falta de disciplina: é matemática.";
    }
    cx.className = "veredito " + classe;

    /* --- Calendário visual --- */
    var cal = document.getElementById("rCalendario");
    var cobertos = Math.max(0, Math.min(DIAS, diaQueAcaba));
    cal.innerHTML = "";
    for (var d = 1; d <= DIAS; d++) {
      var q = document.createElement("i");
      if (d > cobertos) q.className = "vazio";
      cal.appendChild(q);
    }
    document.getElementById("rCalendarioLeg").textContent = cobertos >= DIAS
      ? "Os 30 dias do mês estão cobertos."
      : cobertos + " dias cobertos · " + (DIAS - cobertos) + " dias no vermelho";

    /* --- Fichas --- */
    document.getElementById("fCusto").textContent = BRL.format(custo);
    document.getElementById("fCustoNota").textContent =
      BRL.format(custoDia) + " por dia, somando tudo que sai.";

    var fSaldo = document.getElementById("fSaldo");
    fSaldo.textContent = (saldo >= 0 ? "" : "− ") + BRL.format(Math.abs(saldo));
    fSaldo.className = "val " + (saldo >= 0 ? "" : "ruim");
    document.getElementById("fSaldoNota").textContent = saldo >= 0
      ? "Equivale a " + ((saldo / renda) * 100).toFixed(0) + "% da renda da casa."
      : "Some " + ((Math.abs(saldo) / renda) * 100).toFixed(0) + "% além do que entra.";

    document.getElementById("fPessoaMes").textContent = BRL.format(custo / qtdPessoas);
    document.getElementById("fPessoaDia").textContent = BRL2.format(custo / qtdPessoas / DIAS);

    var comida = itens.filter(function (i) { return i.grupo === "Alimentação"; })
                      .reduce(function (s, i) { return s + i.valor; }, 0);
    document.getElementById("fComidaDia").textContent = comida > 0
      ? BRL2.format(comida / qtdPessoas / DIAS) : "—";

    document.getElementById("fPreciso").textContent = BRL.format(precisa);
    var diferenca = precisa - renda;
    document.getElementById("fPrecisoNota").textContent = diferenca > 0
      ? "São " + BRL.format(diferenca) + " a mais do que entra hoje — " +
        ((diferenca / renda) * 100).toFixed(0) + "% de aumento."
      : "A casa já recebe isso. A folga existe; falta destino para ela.";

    /* --- Piso oficial do DIEESE para esta composição de casa --- */
    var eqDieese = casa.adultos + EQ_CRIANCA_DIEESE * (casa.pequenas + casa.grandes);
    var pisoDieese = DIEESE_POR_EQUIVALENTE * eqDieese;
    document.getElementById("fDieese").textContent = BRL.format(pisoDieese);
    document.getElementById("fDieeseMes").textContent = DIEESE.mes;

    var faltaPiso = pisoDieese - renda;
    document.getElementById("fDieeseNota").textContent = faltaPiso > 0
      ? "A casa recebe " + BRL.format(Math.abs(faltaPiso)) + " menos que esse piso — " +
        ((renda / pisoDieese) * 100).toFixed(0) + "% dele."
      : "A renda da casa já passa desse piso em " + BRL.format(Math.abs(faltaPiso)) + ".";

    /* --- Trilhas por grupo --- */
    var porGrupo = {};
    itens.forEach(function (i) {
      if (i.valor <= 0) return;
      porGrupo[i.grupo] = (porGrupo[i.grupo] || 0) + i.valor;
    });

    var trilhas = document.getElementById("trilhas");
    trilhas.innerHTML = "";
    var listaGrupos = Object.keys(porGrupo).map(function (g) {
      return { nome: g, valor: porGrupo[g], ref: REFERENCIA[g] || 5 };
    }).sort(function (a, b) { return b.valor - a.valor; });

    listaGrupos.forEach(function (g) {
      var pct = (g.valor / renda) * 100;
      var fora = pct > g.ref;
      var div = document.createElement("div");
      div.className = "trilha";
      div.innerHTML =
        '<div class="trilha-topo"><b>' + escapar(g.nome) + "</b>" +
        '<span class="v">' + BRL.format(g.valor) + " · " + pct.toFixed(0) + "%</span></div>" +
        '<div class="calha"><div class="enche' + (fora ? " fora" : "") +
        '" style="width:' + Math.min(100, pct) + '%"></div></div>' +
        '<p class="ref' + (fora ? " fora" : "") + '">' +
        (fora ? "acima da referência de " + g.ref + "%" : "dentro da referência de " + g.ref + "%") +
        "</p>";
      trilhas.appendChild(div);
    });

    /* --- Juros --- */
    var saldoCartao = numero(elRotativo.value) + numero(elEspecial.value);
    var taxa = numero(elTaxa.value);
    var bj = document.getElementById("blocoJuros");
    if (saldoCartao > 0 && taxa > 0) {
      var jMes = saldoCartao * (taxa / 100);
      var jAno = saldoCartao * (Math.pow(1 + taxa / 100, 12) - 1);
      document.getElementById("jMes").textContent = BRL.format(jMes);
      document.getElementById("jAno").textContent = BRL.format(jAno);
      document.getElementById("jNota").textContent =
        "É " + ((jMes / renda) * 100).toFixed(1) + "% da renda saindo sem abater a dívida.";
      bj.hidden = false;
    } else {
      bj.hidden = true;
    }

    /* --- Maior peso --- */
    var acima = listaGrupos.filter(function (g) { return (g.valor / renda) * 100 > g.ref; })
      .sort(function (a, b) {
        return ((b.valor / renda) * 100 - b.ref) - ((a.valor / renda) * 100 - a.ref);
      });

    var vTitulo = document.getElementById("vTitulo");
    var vTexto = document.getElementById("vTexto");

    if (acima.length === 0) {
      vTitulo.textContent = "Nenhuma categoria fora da curva";
      vTexto.innerHTML = "Todas as fatias estão dentro da referência. Quando isso acontece e mesmo " +
        "assim falta dinheiro, o problema geralmente <b>não é o gasto</b> — é a renda ser baixa " +
        "demais para o custo de vida de " + qtdPessoas + " pessoa" + (qtdPessoas > 1 ? "s" : "") +
        " na sua cidade.";
    } else {
      var v = acima[0];
      var excedente = v.valor - (renda * v.ref / 100);
      vTitulo.textContent = "O que mais pesa: " + v.nome;
      vTexto.innerHTML = escapar(v.nome) + " consome <b>" + ((v.valor / renda) * 100).toFixed(0) +
        "%</b> da renda da casa, contra uma referência de " + v.ref + "%. São <b>" +
        BRL.format(excedente) + "</b> por mês acima do que essa fatia costuma pesar. " +
        (acima.length === 1 ? "É a única categoria fora da referência."
          : acima.length === 2 ? "Outra categoria também está acima."
          : "Outras " + (acima.length - 1) + " categorias também estão acima.");
    }

    /* --- Compartilhamento --- */
    var resumo = diaQueAcaba >= DIAS
      ? "Fiz as contas da casa: custa " + BRL.format(custo) + " por mês e o dinheiro cobre os 30 dias."
      : "Fiz as contas da casa: o dinheiro acaba no dia " + Math.max(1, diaQueAcaba) + ". A vida aqui custa " + BRL.format(custo) + " por mês.";
    document.getElementById("btnZap").href = "https://wa.me/?text=" +
      encodeURIComponent(resumo + "\n\nFaz o seu: " + location.href.split("#")[0]);

    elResultado.hidden = false;

    if (!jaMediu) {
      jaMediu = true;
      medir("diagnostico_pronto", {
        situacao: classe,
        dia_que_acaba: Math.max(1, diaQueAcaba),
        pessoas: qtdPessoas,
        adulto_equivalente: eq,
        comprometimento: Math.round((custo / renda) * 100),
        tem_rotativo: saldoCartao > 0
      });
    }
  }

  /* ---------- Botões de saída ---------- */

  function textoDiagnostico() {
    var linhas = ["PARA ONDE FOI MEU DINHEIRO", ""];
    linhas.push("Casa: " + casa.adultos + " adulto(s), " +
      (casa.pequenas + casa.grandes) + " criança(s)");
    linhas.push("");
    elGastos.forEach(function (el) {
      var v = numero(el.value);
      if (v > 0) linhas.push(el.dataset.gasto + ": " + BRL.format(v));
    });
    linhas.push("");
    linhas.push("A vida aqui custa: " + document.getElementById("fCusto").textContent);
    linhas.push("Por pessoa ao dia: " + document.getElementById("fPessoaDia").textContent);
    linhas.push(document.getElementById("rChapeu").textContent + " " +
      document.getElementById("rEstrela").textContent);
    linhas.push("Para sobrar 10%: " + document.getElementById("fPreciso").textContent);
    linhas.push("Piso do DIEESE p/ esta casa: " + document.getElementById("fDieese").textContent);
    linhas.push("");
    linhas.push("Faça o seu: " + location.href.split("#")[0]);
    return linhas.join("\n");
  }

  document.getElementById("btnCopiar").addEventListener("click", function () {
    var botao = this;
    function aviso(ok) {
      botao.textContent = ok ? "Copiado!" : "Não consegui copiar";
      setTimeout(function () { botao.textContent = "Copiar meu diagnóstico"; }, 2200);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textoDiagnostico())
        .then(function () { aviso(true); medir("copiou_diagnostico"); },
              function () { aviso(false); });
    } else { aviso(false); }
  });

  document.getElementById("btnZap").addEventListener("click", function () {
    medir("compartilhou");
  });

  var btnPago = document.getElementById("btnPago");
  var btnAtalho = document.getElementById("btnPagoAtalho");

  // O atalho do fim do texto usa o mesmo destino do bloco principal.
  if (btnAtalho) {
    if (CHECKOUT || WHATSAPP) {
      btnAtalho.href = CHECKOUT || ("https://wa.me/" + WHATSAPP + "?text=" +
        encodeURIComponent("Olá! Quero o plano completo de 90 dias."));
      btnAtalho.target = "_blank";
      btnAtalho.rel = "noopener";
      btnAtalho.addEventListener("click", function () {
        medir("clique_plano", { preco: 19.9, origem: "atalho", via: CHECKOUT ? "checkout" : "whatsapp" });
      });
    } else {
      btnAtalho.textContent = "Plano completo em breve";
      btnAtalho.setAttribute("aria-disabled", "true");
      btnAtalho.style.opacity = ".62";
      btnAtalho.style.cursor = "default";
      btnAtalho.addEventListener("click", function (e) { e.preventDefault(); });
    }
  }

  if (CHECKOUT) {
    btnPago.href = CHECKOUT;
    btnPago.target = "_blank";
    btnPago.rel = "noopener";
  } else if (WHATSAPP) {
    btnPago.href = "https://wa.me/" + WHATSAPP + "?text=" +
      encodeURIComponent("Olá! Fiz o diagnóstico e quero o plano completo de 90 dias.");
    btnPago.target = "_blank";
    btnPago.rel = "noopener";
  } else {
    // Sem checkout e sem contato configurado: não fingimos que há o que comprar.
    btnPago.textContent = "Plano completo em breve";
    btnPago.setAttribute("aria-disabled", "true");
    btnPago.style.opacity = ".62";
    btnPago.style.cursor = "default";
  }
  btnPago.addEventListener("click", function (e) {
    if (!CHECKOUT && !WHATSAPP) { e.preventDefault(); return; }
    medir("clique_plano", { preco: 19.9, via: CHECKOUT ? "checkout" : "whatsapp" });
  });

  /* ---------- Ligações ---------- */

  elRendas.concat(elGastos, [elRotativo, elEspecial, elTaxa]).forEach(function (el) {
    el.addEventListener("input", calcular);
  });

  atualizarContadores();
  calcular();

  /* ---------- Medição opcional ---------- */

  if (ID_ANALYTICS) {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + ID_ANALYTICS;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", ID_ANALYTICS);
  }
})();
