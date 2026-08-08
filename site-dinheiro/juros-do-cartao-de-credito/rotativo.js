/* ============================================================
   Juros do cartão de crédito — o que o saldo vira com o tempo
   Tudo roda no navegador. Nenhum valor sai do aparelho.
   ============================================================ */
(function () {
  "use strict";

  /* O mínimo da fatura no Brasil é definido por cada emissor; 15% do total é a
     referência mais comum e é o que usamos quando a pessoa não informa quanto
     consegue pagar. Fica dito na tela para não parecer número oficial. */
  var MINIMO_PCT = 0.15;
  var LIMITE_MESES = 600;

  var BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

  var elSaldo = document.getElementById("saldo");
  var elTaxa = document.getElementById("taxa");
  var elPagamento = document.getElementById("pagamento");
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

  function plural(n, um, muitos) {
    return n + " " + (n === 1 ? um : muitos);
  }

  function tempo(meses) {
    var anos = Math.floor(meses / 12);
    var resto = meses % 12;
    if (anos === 0) return plural(meses, "mês", "meses");
    if (resto === 0) return plural(anos, "ano", "anos");
    return plural(anos, "ano", "anos") + " e " + plural(resto, "mês", "meses");
  }

  /* Quanto tempo e quanto de juros até zerar, pagando um valor por mês.
     Se `pctMinimo` vier preenchido, a parcela é recalculada todo mês como um
     percentual do saldo — é assim que funciona o mínimo da fatura. */
  function amortizar(saldo, taxa, parcelaFixa, pctMinimo) {
    var juros = 0;
    var mes = 0;
    while (saldo > 0.005 && mes < LIMITE_MESES) {
      mes++;
      var j = saldo * taxa;
      saldo += j;
      juros += j;
      var parcela = pctMinimo ? Math.max(saldo * pctMinimo, 1) : parcelaFixa;
      // Com pagamento menor que os juros do mês, a dívida cresce para sempre.
      if (parcela <= j && !pctMinimo) return { quita: false, meses: LIMITE_MESES, juros: juros };
      saldo -= Math.min(parcela, saldo);
    }
    return { quita: saldo <= 0.005, meses: mes, juros: juros };
  }

  function calcular() {
    var saldo = numero(elSaldo.value);
    var taxa = numero(elTaxa.value) / 100;
    var pagamento = numero(elPagamento.value);

    if (saldo <= 0 || taxa <= 0) { elResultado.hidden = true; return; }

    /* --- Se nada for pago --- */
    var em3 = saldo * Math.pow(1 + taxa, 3);
    var em6 = saldo * Math.pow(1 + taxa, 6);
    var em12 = saldo * Math.pow(1 + taxa, 12);
    document.getElementById("m3").textContent = BRL.format(em3);
    document.getElementById("m6").textContent = BRL.format(em6);
    document.getElementById("m12").textContent = BRL.format(em12);

    var aoAno = (Math.pow(1 + taxa, 12) - 1) * 100;
    document.getElementById("notaBola").innerHTML =
      "Em doze meses a dívida vira <b>" + (em12 / saldo).toFixed(1).replace(".", ",") +
      " vezes</b> o que é hoje. A taxa de " + String(numero(elTaxa.value)).replace(".", ",") +
      "% ao mês equivale a <b>" + aoAno.toFixed(0) + "% ao ano</b> — é o mesmo número, lido do jeito " +
      "que o seu bolso sente.";

    /* --- Pagando o mínimo --- */
    var min = amortizar(saldo, taxa, 0, MINIMO_PCT);
    var estrela = document.getElementById("rEstrela");
    var frase = document.getElementById("rFrase");

    if (min.quita) {
      estrela.textContent = tempo(min.meses);
      frase.innerHTML = "Considerando um mínimo de " + (MINIMO_PCT * 100) + "% do saldo — a prática " +
        "mais comum do mercado — você pagaria <b>" + BRL.format(min.juros) + " de juros</b> para " +
        "quitar " + BRL.format(saldo) + ". É <b>" + Math.round((min.juros / saldo) * 100) +
        "%</b> a mais do que você deve hoje, e nada disso volta para você.";
    } else {
      estrela.textContent = "nunca";
      frase.innerHTML = "Com um mínimo de " + (MINIMO_PCT * 100) + "% do saldo e uma taxa de " +
        String(numero(elTaxa.value)).replace(".", ",") + "% ao mês, o pagamento não vence os juros: " +
        "a dívida <b>cresce todo mês mesmo pagando</b>. Esse é o ponto em que a única saída é " +
        "renegociar ou trocar a dívida por uma mais barata.";
    }

    /* --- Pagando o valor informado --- */
    var bloco = document.getElementById("blocoPagando");
    if (pagamento > 0) {
      var r = amortizar(saldo, taxa, pagamento, 0);
      bloco.hidden = false;
      if (r.quita) {
        document.getElementById("pTempo").textContent = tempo(r.meses);
        document.getElementById("pTempoNota").textContent =
          "Pagando " + BRL.format(pagamento) + " todo mês, sem nenhuma compra nova.";
        document.getElementById("pJuros").textContent = BRL.format(r.juros);
        document.getElementById("pJurosNota").textContent =
          "Total pago: " + BRL.format(saldo + r.juros) + " por uma dívida de " + BRL.format(saldo) + ".";
      } else {
        document.getElementById("pTempo").textContent = "não quita";
        document.getElementById("pTempoNota").textContent =
          BRL.format(pagamento) + " por mês é menos que os " + BRL.format(saldo * taxa) +
          " de juros do primeiro mês. A dívida cresce mesmo com o pagamento.";
        document.getElementById("pJuros").textContent = "—";
        document.getElementById("pJurosNota").textContent =
          "Para começar a abater, a parcela precisa passar de " + BRL.format(saldo * taxa) + ".";
      }
    } else {
      bloco.hidden = true;
    }

    /* --- O peso do juro no mês --- */
    var jurosMes = saldo * taxa;
    document.getElementById("vTitulo").textContent =
      "Todo mês somem " + BRL.format(jurosMes) + " sem abater nada";
    document.getElementById("vTexto").innerHTML =
      "Esse é o valor que sai da sua renda só para a dívida <b>ficar do mesmo tamanho</b>. " +
      "Qualquer pagamento abaixo disso aumenta o saldo. É o número que vale a pena levar para a " +
      "conversa de renegociação — porque é ele, e não o saldo, que decide se você consegue sair.";

    elResultado.hidden = false;

    if (!jaMediu) {
      jaMediu = true;
      medir("rotativo_calculado", {
        faixa_saldo: saldo < 1000 ? "ate 1000" : saldo < 5000 ? "1000 a 5000" :
                     saldo < 15000 ? "5000 a 15000" : "acima de 15000",
        taxa_mes: numero(elTaxa.value),
        quita_no_minimo: min.quita,
        informou_pagamento: pagamento > 0
      });
    }
  }

  document.getElementById("btnCopiar").addEventListener("click", function () {
    var botao = this;
    var linhas = [
      "O QUE O ROTATIVO ESTÁ ME CUSTANDO",
      "",
      "Saldo hoje: " + BRL.format(numero(elSaldo.value)),
      "Taxa: " + elTaxa.value + "% ao mês",
      "",
      "Se nada for pago:",
      "  em 3 meses: " + document.getElementById("m3").textContent,
      "  em 6 meses: " + document.getElementById("m6").textContent,
      "  em 12 meses: " + document.getElementById("m12").textContent,
      "",
      "Pagando só o mínimo: " + document.getElementById("rEstrela").textContent,
      "Some por mês só em juros: " + BRL.format(numero(elSaldo.value) * numero(elTaxa.value) / 100),
      "",
      "Faça a sua conta: " + location.href.split("#")[0]
    ];
    function aviso(ok) {
      botao.textContent = ok ? "Copiado!" : "Não consegui copiar";
      setTimeout(function () { botao.textContent = "Copiar esta conta"; }, 2200);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(linhas.join("\n"))
        .then(function () { aviso(true); medir("copiou_rotativo"); }, function () { aviso(false); });
    } else { aviso(false); }
  });

  [elSaldo, elTaxa, elPagamento].forEach(function (el) {
    el.addEventListener("input", calcular);
  });
  calcular();
})();
