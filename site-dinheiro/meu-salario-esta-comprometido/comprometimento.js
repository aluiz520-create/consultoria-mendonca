/* ============================================================
   Quanto do meu salário está comprometido
   Tudo roda no navegador. Nenhum valor sai do aparelho.
   ============================================================ */
(function () {
  "use strict";

  var CHECKOUT = "https://pay.kiwify.com.br/BhOeiGG";
  var DIAS = 30;

  /* Faixas de leitura. São referências de planejamento, ditas como tal na
     página — o teto de 30% é limite de concessão de crédito do banco, não
     indicação de conforto para quem paga. */
  var FAIXAS = [
    { ate: 10,  classe: "bom",     rotulo: "há folga real" },
    { ate: 30,  classe: "atencao", rotulo: "funciona enquanto nada dá errado" },
    { ate: 50,  classe: "ruim",    rotulo: "sem capacidade de absorver imprevisto" },
    { ate: 999, classe: "ruim",    rotulo: "o problema está nos compromissos assinados" }
  ];

  var BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  var BRL2 = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2, maximumFractionDigits: 2 });

  var elRenda = document.getElementById("renda");
  var elDividas = Array.prototype.slice.call(document.querySelectorAll("[data-divida]"));
  var elFixos = Array.prototype.slice.call(document.querySelectorAll("[data-fixo]"));
  var elResultado = document.getElementById("resultado");
  var jaMediu = false;

  function medir(nome, params) {
    if (typeof window.medir === "function") window.medir(nome, params);
  }

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

  function somar(lista) {
    return lista.reduce(function (s, el) { return s + numero(el.value); }, 0);
  }

  function faixaDe(pct) {
    for (var i = 0; i < FAIXAS.length; i++) if (pct <= FAIXAS[i].ate) return FAIXAS[i];
    return FAIXAS[FAIXAS.length - 1];
  }

  function barra(nome, valor, renda, referencia) {
    var pct = (valor / renda) * 100;
    var fora = pct > referencia;
    return '<div class="trilha">' +
      '<div class="trilha-topo"><b>' + nome + '</b><span class="v">' +
      BRL.format(valor) + " · " + pct.toFixed(0) + "%</span></div>" +
      '<div class="calha"><div class="enche' + (fora ? " fora" : "") +
      '" style="width:' + Math.min(100, pct) + '%"></div></div>' +
      '<p class="ref' + (fora ? " fora" : "") + '">' +
      (fora ? "acima da referência de " + referencia + "%" : "dentro da referência de " + referencia + "%") +
      "</p></div>";
  }

  function calcular() {
    var renda = numero(elRenda.value);
    var dividas = somar(elDividas);
    var fixos = somar(elFixos);

    if (renda <= 0 || dividas + fixos <= 0) { elResultado.hidden = true; return; }

    var pctBanco = (dividas / renda) * 100;
    var pctReal = ((dividas + fixos) / renda) * 100;
    var sobra = renda - dividas - fixos;
    var faixa = faixaDe(pctBanco);

    /* --- Veredito: o número principal é o do banco, porque é o que a busca
       procura. O da vida aparece logo ao lado, e a página explica a diferença. --- */
    document.getElementById("veredito").className = "veredito " + faixa.classe;
    document.getElementById("rEstrela").textContent = pctBanco.toFixed(0) + "%";

    var frase = document.getElementById("rFrase");
    if (pctBanco <= 10) {
      frase.innerHTML = "Contando só as parcelas, <b>" + faixa.rotulo + "</b>. O trabalho aqui " +
        "não é cortar: é dar destino à sobra antes que ela vire gasto sem lembrança.";
    } else if (pctBanco <= 30) {
      frase.innerHTML = "Contando só as parcelas, você está abaixo do teto de 30% que os bancos " +
        "usam — mas <b>" + faixa.rotulo + "</b>. Vale construir reserva antes de assumir " +
        "qualquer parcela nova.";
    } else if (pctBanco <= 50) {
      frase.innerHTML = "Você passou do teto de 30% que os bancos usam para conceder crédito. " +
        "Na prática significa duas coisas ao mesmo tempo: <b>crédito novo fica caro ou negado</b>, " +
        "e o orçamento perdeu a capacidade de absorver imprevisto.";
    } else {
      frase.innerHTML = "Mais da metade da renda já está prometida em parcelas antes de o mês " +
        "começar. Nessa faixa, <b>cortar gasto de consumo dificilmente resolve</b> — o problema " +
        "está nos compromissos já assinados, e o caminho é renegociar prazo e taxa.";
    }

    /* --- Os dois números --- */
    document.getElementById("fBanco").textContent = pctBanco.toFixed(0) + "%";
    document.getElementById("fBancoNota").textContent =
      BRL.format(dividas) + " por mês em parcelas de dívida.";

    document.getElementById("fReal").textContent = pctReal.toFixed(0) + "%";
    document.getElementById("fRealNota").textContent = fixos > 0
      ? "Somando moradia, contas e mensalidades: " + BRL.format(dividas + fixos) + " obrigatórios."
      : "Igual ao do banco, porque você não informou gastos fixos.";

    /* --- O número que não engana --- */
    var fDia = document.getElementById("fDia");
    fDia.textContent = (sobra >= 0 ? "" : "− ") + BRL2.format(Math.abs(sobra) / DIAS);
    fDia.className = "val " + (sobra >= 0 ? "" : "ruim");
    document.getElementById("fDiaNota").textContent = sobra >= 0
      ? "É o que sobra por dia para comida, transporte, farmácia e tudo o mais — " +
        BRL.format(sobra) + " no mês."
      : "O obrigatório já passa da renda em " + BRL.format(Math.abs(sobra)) +
        ". Não sobra nada para comida e transporte: a diferença está saindo de crédito.";

    /* --- Barras --- */
    var trilhas = document.getElementById("trilhas");
    var html = barra("Parcelas de dívida", dividas, renda, 10);
    if (fixos > 0) html += barra("Moradia e contas fixas", fixos, renda, 38);
    if (sobra > 0) html += barra("O que sobra para viver", sobra, renda, 52);
    trilhas.innerHTML = html;

    /* --- Leitura final --- */
    var vTitulo = document.getElementById("vTitulo");
    var vTexto = document.getElementById("vTexto");

    if (pctReal >= 100) {
      vTitulo.textContent = "O obrigatório já é maior que a renda";
      vTexto.innerHTML = "Antes de qualquer escolha sua, a conta já não fecha em <b>" +
        BRL.format(Math.abs(sobra)) + "</b>. Isso não se resolve com disciplina — se resolve " +
        "reduzindo parcela ou aumentando renda. Enquanto não mudar, a diferença sai de cartão " +
        "todo mês, o que aumenta a parcela do mês seguinte.";
    } else if (pctBanco > 30) {
      var alvo = renda * 0.30;
      vTitulo.textContent = "Para voltar aos 30%, a parcela precisa cair " + BRL.format(dividas - alvo);
      vTexto.innerHTML = "Hoje você paga <b>" + BRL.format(dividas) + "</b> por mês em parcelas; " +
        "o teto de 30% seria <b>" + BRL.format(alvo) + "</b>. Existem três caminhos: alongar " +
        "prazo (baixa a parcela, sobe o total), reduzir taxa (baixa os dois) ou quitar uma dívida " +
        "inteira para tirar a parcela do mês. <b>Qual quitar primeiro depende dos seus números.</b>";
    } else {
      vTitulo.textContent = "Quanto ainda cabe sem passar dos 30%";
      var espaco = renda * 0.30 - dividas;
      vTexto.innerHTML = "Pelo critério dos bancos, ainda haveria espaço para <b>" +
        BRL.format(espaco) + "</b> de parcela nova. <b>Isso não é uma recomendação de usar esse " +
        "espaço</b> — é o limite de risco que o banco aceita, não o que sobra bem para você. " +
        "Com " + BRL2.format(sobra / DIAS) + " por dia para viver hoje, cada parcela nova sai daí.";
    }

    elResultado.hidden = false;

    if (!jaMediu) {
      jaMediu = true;
      medir("comprometimento_calculado", {
        faixa: pctBanco <= 10 ? "ate 10" : pctBanco <= 30 ? "10 a 30" :
               pctBanco <= 50 ? "30 a 50" : "acima de 50",
        acima_do_teto: pctBanco > 30,
        obrigatorio_maior_que_renda: pctReal >= 100
      });
    }
  }

  document.getElementById("btnCopiar").addEventListener("click", function () {
    var botao = this;
    var linhas = [
      "COMPROMETIMENTO DA MINHA RENDA",
      "",
      "Comprometimento que o banco vê: " + document.getElementById("fBanco").textContent,
      "Comprometimento que a vida sente: " + document.getElementById("fReal").textContent,
      "Sobra por dia para viver: " + document.getElementById("fDia").textContent,
      "",
      document.getElementById("vTitulo").textContent,
      "",
      "Faça a sua conta: " + location.href.split("#")[0]
    ];
    function aviso(ok) {
      botao.textContent = ok ? "Copiado!" : "Não consegui copiar";
      setTimeout(function () { botao.textContent = "Copiar este número"; }, 2200);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(linhas.join("\n"))
        .then(function () { aviso(true); medir("copiou_comprometimento"); }, function () { aviso(false); });
    } else { aviso(false); }
  });

  var btnPago = document.getElementById("btnPago");
  if (CHECKOUT) {
    btnPago.href = CHECKOUT;
    btnPago.target = "_blank";
    btnPago.rel = "noopener";
    btnPago.addEventListener("click", function () {
      medir("clique_plano", { preco: 19.9, origem: "meu-salario-esta-comprometido" });
    });
  } else {
    btnPago.textContent = "Plano completo em breve";
    btnPago.setAttribute("aria-disabled", "true");
    btnPago.style.opacity = ".62";
    btnPago.style.cursor = "default";
    btnPago.addEventListener("click", function (e) { e.preventDefault(); });
  }

  [elRenda].concat(elDividas, elFixos).forEach(function (el) {
    el.addEventListener("input", calcular);
  });
})();
