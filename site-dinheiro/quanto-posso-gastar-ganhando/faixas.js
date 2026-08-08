/* ============================================================
   Quanto posso gastar ganhando X — tetos por faixa de renda
   Tudo roda no navegador. Nenhum valor sai do aparelho.
   ============================================================ */
(function () {
  "use strict";

  var FAIXAS = [1621, 2000, 2500, 3000, 4000, 5000];

  /* Referências de planejamento, em % da renda da casa. As mesmas usadas no
     diagnóstico da página inicial, para os dois números conversarem. */
  var TETOS = [
    { nome: "Moradia",            pct: 30, nota: "Aluguel ou prestação, condomínio e IPTU dividido por 12" },
    { nome: "Alimentação",        pct: 20, nota: "Mercado e comida fora de casa" },
    { nome: "Transporte",         pct: 15, nota: "Combustível, ônibus, aplicativo e prestação do carro" },
    { nome: "Parcelas e dívidas", pct: 10, nota: "Cartão parcelado, empréstimo, crediário" },
    { nome: "Reserva",            pct: 10, nota: "O que separa um imprevisto de uma dívida nova" },
    { nome: "Contas de casa",     pct:  8, nota: "Luz, água, gás, internet" },
    { nome: "Saúde",              pct:  8, nota: "Plano, farmácia, consultas" },
    { nome: "Filhos e educação",  pct: 10, nota: "Escola, creche, material — some ao teto se houver crianças" },
    { nome: "Assinaturas",        pct:  4, nota: "Celular, streaming, academia, aplicativos" }
  ];

  /* Piso do DIEESE — mesma base do diagnóstico principal.
     Ao atualizar a pesquisa do mês, mude aqui e no app.js da raiz. */
  var DIEESE_POR_EQUIVALENTE = 8110.92 / 2.8;
  var EQ_CRIANCA_DIEESE = 0.4;

  var BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

  var casa = { adultos: 1, criancas: 0 };
  var elRenda = document.getElementById("renda");
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

  /* ---------- Botões de faixa ---------- */

  var caixaFaixas = document.getElementById("faixas");
  FAIXAS.forEach(function (v) {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = BRL.format(v);
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", function () {
      elRenda.value = String(v);
      marcarFaixa(v);
      calcular();
      medir("escolheu_faixa", { renda: v });
    });
    caixaFaixas.appendChild(b);
  });

  function marcarFaixa(valor) {
    Array.prototype.forEach.call(caixaFaixas.children, function (b, i) {
      b.setAttribute("aria-pressed", FAIXAS[i] === valor ? "true" : "false");
    });
  }

  /* ---------- Contadores de pessoas ---------- */

  Array.prototype.forEach.call(document.querySelectorAll(".contador"), function (grupo) {
    var chave = grupo.dataset.conta;
    grupo.addEventListener("click", function (e) {
      var botao = e.target.closest("button");
      if (!botao) return;
      var minimo = chave === "adultos" ? 1 : 0;
      casa[chave] = Math.max(minimo, Math.min(12, casa[chave] + Number(botao.dataset.passo)));
      atualizarContadores();
      calcular();
    });
  });

  function atualizarContadores() {
    document.getElementById("qtdAdultos").textContent = casa.adultos;
    document.getElementById("qtdCriancas").textContent = casa.criancas;
    Array.prototype.forEach.call(document.querySelectorAll(".contador"), function (grupo) {
      var chave = grupo.dataset.conta;
      var minimo = chave === "adultos" ? 1 : 0;
      grupo.querySelector('[data-passo="-1"]').disabled = casa[chave] <= minimo;
      grupo.querySelector('[data-passo="1"]').disabled = casa[chave] >= 12;
    });
  }

  /* ---------- Cálculo ---------- */

  function calcular() {
    var renda = numero(elRenda.value);
    if (renda <= 0) { elResultado.hidden = true; return; }

    var pessoas = casa.adultos + casa.criancas;
    var eqDieese = casa.adultos + EQ_CRIANCA_DIEESE * casa.criancas;
    var piso = DIEESE_POR_EQUIVALENTE * eqDieese;
    var razao = renda / piso;

    /* --- Veredito --- */
    var cx = document.getElementById("veredito");
    var estrela = document.getElementById("rEstrela");
    var frase = document.getElementById("rFrase");
    document.getElementById("rChapeu").textContent =
      "Para " + pessoas + " pessoa" + (pessoas > 1 ? "s" : "") + ", essa renda cobre";

    estrela.textContent = Math.round(razao * 100) + "% do piso";

    if (razao >= 1) {
      cx.className = "veredito bom";
      frase.innerHTML = "A renda da casa passa o piso que o DIEESE calcula para " + pessoas +
        " pessoa" + (pessoas > 1 ? "s" : "") + " em <b>" + BRL.format(renda - piso) + "</b>. " +
        "Os tetos abaixo são alcançáveis — o que decide o resultado agora é para onde essa folga vai.";
    } else if (razao >= 0.6) {
      cx.className = "veredito atencao";
      frase.innerHTML = "Faltam <b>" + BRL.format(piso - renda) + "</b> para alcançar o piso do " +
        "DIEESE para uma casa desse tamanho. Os tetos abaixo continuam úteis como ordem de " +
        "prioridade, mas espere que <b>moradia e alimentação estourem</b> — é o que acontece nessa faixa.";
    } else {
      cx.className = "veredito ruim";
      frase.innerHTML = "A renda está a <b>" + BRL.format(piso - renda) + "</b> do piso calculado " +
        "para " + pessoas + " pessoa" + (pessoas > 1 ? "s" : "") + ". Nessa distância, os " +
        "percentuais de referência <b>não são atingíveis</b> e insistir neles produz culpa, não " +
        "resultado. A conta que muda a vida aqui é a da renda, não a do corte.";
    }

    /* --- Tetos --- */
    var caixa = document.getElementById("tetos");
    caixa.innerHTML = "";
    TETOS.forEach(function (t) {
      if (t.nome === "Filhos e educação" && casa.criancas === 0) return;
      var div = document.createElement("div");
      div.className = "trilha";
      div.innerHTML =
        '<div class="trilha-topo"><b>' + t.nome + "</b>" +
        '<span class="v">até ' + BRL.format(renda * t.pct / 100) + "</span></div>" +
        '<div class="calha"><div class="enche" style="width:' + (t.pct * 2) + '%"></div></div>' +
        '<p class="ref">' + t.pct + "% da renda · " + t.nota + "</p>";
      caixa.appendChild(div);
    });

    /* --- Piso --- */
    document.getElementById("fDieese").textContent = BRL.format(piso);
    document.getElementById("fDieeseNota").textContent = razao >= 1
      ? "A renda da casa já passa desse piso em " + BRL.format(renda - piso) + "."
      : "A casa recebe " + BRL.format(piso - renda) + " menos que esse piso — " +
        Math.round(razao * 100) + "% dele.";

    /* --- O número que quase ninguém mostra --- */
    var quantasPessoas = renda / DIEESE_POR_EQUIVALENTE;
    document.getElementById("vTitulo").textContent =
      "Essa renda sustenta cerca de " + quantasPessoas.toFixed(1).replace(".", ",") +
      " adulto" + (quantasPessoas >= 2 ? "s" : "") + " no piso do DIEESE";
    document.getElementById("vTexto").innerHTML =
      "É o número que falta em toda matéria sobre como dividir salário: <b>" + BRL.format(renda) +
      "</b> não significa nada sozinho. Dividido por 1 pessoa é uma realidade; dividido por " +
      pessoas + " é outra completamente diferente. Hoje essa renda é dividida por <b>" +
      (casa.adultos + " adulto" + (casa.adultos > 1 ? "s" : "")) +
      (casa.criancas ? " e " + casa.criancas + " criança" + (casa.criancas > 1 ? "s" : "") : "") +
      "</b> — e é por isso que comparar o seu caso com uma média nacional não ajuda.";

    elResultado.hidden = false;

    if (!jaMediu) {
      jaMediu = true;
      medir("tetos_calculados", {
        faixa_renda: renda < 2000 ? "ate 2000" : renda < 3000 ? "2000 a 3000" :
                     renda < 5000 ? "3000 a 5000" : "acima de 5000",
        pessoas: pessoas,
        acima_do_piso: razao >= 1
      });
    }
  }

  elRenda.addEventListener("input", function () {
    marcarFaixa(numero(elRenda.value));
    calcular();
  });

  atualizarContadores();
})();
