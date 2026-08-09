/* ============================================================
   Qual conta pagar primeiro — ordem pelo custo do atraso
   Tudo roda no navegador. Nenhum valor sai do aparelho.
   ============================================================ */
(function () {
  "use strict";

  /* nivel 1 = voce perde um bem  ·  2 = corta servico essencial
     nivel 3 = cobra caro         ·  4 = fica so o registro do nome
     `ordem` desempata dentro do mesmo nivel. */
  var CONTAS = [
    { id: "imovel",    nome: "Financiamento do imóvel",    nivel: 1, ordem: 1,
      risco: "Atraso pode levar à perda da moradia. É a conta mais cara de atrasar do Brasil.",
      plano: "Ligue ao banco antes do vencimento e peça pausa ou renegociação. Financiamento habitacional costuma ter mais flexibilidade do que se imagina." },
    { id: "veiculo",   nome: "Financiamento do veículo",   nivel: 1, ordem: 2,
      risco: "Costuma ter alienação fiduciária: pode haver busca e apreensão e você ainda continuar devendo a diferença.",
      plano: "Procure o banco antes de atrasar. Alongamento de prazo é comum e evita a apreensão." },
    { id: "aluguel",   nome: "Aluguel",                    nivel: 1, ordem: 3,
      risco: "Atraso abre caminho para ação de despejo, além de multa contratual.",
      plano: "Fale com o proprietário ou a imobiliária antes do vencimento e proponha data. Acordo direto quase sempre é aceito." },
    { id: "luz",       nome: "Conta de luz",               nivel: 2, ordem: 1,
      risco: "Corte de serviço essencial, e a religação costuma ter custo próprio.",
      plano: "Peça parcelamento à distribuidora e verifique se você tem direito à Tarifa Social de Energia Elétrica (CadÚnico)." },
    { id: "agua",      nome: "Conta de água",              nivel: 2, ordem: 2,
      risco: "Corte de serviço essencial, com taxa de religação.",
      plano: "Praticamente toda companhia parcela débito residencial. Ligue antes do corte." },
    { id: "gas",       nome: "Gás",                        nivel: 2, ordem: 3,
      risco: "Sem gás, a casa para de funcionar — e o botijão avulso sai mais caro.",
      plano: "Se for encanado, peça parcelamento. Se for botijão, priorize a compra." },
    { id: "saude",     nome: "Plano de saúde em uso",      nivel: 2, ordem: 4,
      risco: "Cancelamento faz perder carência já cumprida — recontratar depois custa muito mais.",
      plano: "Ligue à operadora: existe prazo antes do cancelamento e costuma haver acordo." },
    { id: "escola",    nome: "Escola ou creche",           nivel: 2, ordem: 5,
      risco: "Risco de perder a vaga e interromper a rotina das crianças.",
      plano: "Converse com a secretaria. Escola prefere acordo a vaga vazia." },
    { id: "cartao",    nome: "Cartão de crédito",          nivel: 3, ordem: 1,
      risco: "Entra no rotativo, a linha de crédito mais cara do mercado, e a dívida cresce rápido.",
      plano: "Pague ao menos o mínimo se puder, e peça o parcelamento da fatura — é direito seu depois de uma fatura no rotativo." },
    { id: "especial",  nome: "Cheque especial",            nivel: 3, ordem: 2,
      risco: "Juros altos que consomem o próximo salário assim que ele cai na conta.",
      plano: "Peça ao banco a troca por uma linha mais barata antes que o saldo cresça." },
    { id: "emprestimo",nome: "Empréstimo ou crediário",    nivel: 3, ordem: 3,
      risco: "Multa, juros de mora e vencimento antecipado das demais parcelas em alguns contratos.",
      plano: "Ligue antes de atrasar e peça para pular a parcela para o fim do contrato." },
    { id: "condominio",nome: "Condomínio",                 nivel: 3, ordem: 4,
      risco: "Juros, multa e ação de cobrança — que em último caso alcança o imóvel.",
      plano: "Procure o síndico ou a administradora e proponha parcelamento por escrito." },
    { id: "impostos",  nome: "IPTU, IPVA ou imposto",      nivel: 3, ordem: 5,
      risco: "Multa, juros e possibilidade de protesto e inscrição em dívida ativa.",
      plano: "Prefeituras e estados têm parcelamento próprio, com adesão pela internet." },
    { id: "internet",  nome: "Internet ou celular",        nivel: 3, ordem: 6,
      risco: "Corte do serviço e possível multa de fidelidade.",
      plano: "Considere migrar para um plano mais barato em vez de atrasar." },
    { id: "loja",      nome: "Carnê de loja",              nivel: 4, ordem: 1,
      risco: "Juros e registro em cadastro de inadimplentes.",
      plano: "É a fila do fim. Negocie quando o essencial estiver resolvido." },
    { id: "assinatura",nome: "Assinaturas e streaming",    nivel: 4, ordem: 2,
      risco: "Cancelamento do serviço, e só.",
      plano: "Aqui a ação não é pagar depois: é cancelar agora. É dinheiro que volta todo mês." }
  ];

  var NIVEIS = {
    1: "você perde um bem",
    2: "corta um serviço essencial",
    3: "cobra caro",
    4: "fica só o registro do nome"
  };

  var BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

  var lista = document.getElementById("listaContas");
  var elDisponivel = document.getElementById("disponivel");
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

  function escapar(t) {
    var d = document.createElement("div");
    d.textContent = t;
    return d.innerHTML;
  }

  /* ---------- Montagem da lista ---------- */

  CONTAS.forEach(function (c) {
    var linha = document.createElement("div");
    linha.className = "linha-valor";
    linha.innerHTML =
      '<span class="rot">' + escapar(c.nome) +
      "<small>" + escapar(NIVEIS[c.nivel]) + "</small></span>" +
      '<div class="caixa-valor"><span class="moeda">R$</span>' +
      '<input type="text" inputmode="numeric" placeholder="0" data-conta="' + c.id + '"></div>';
    linha.querySelector("input").addEventListener("input", calcular);
    lista.appendChild(linha);
  });

  function lerContas() {
    return CONTAS.map(function (c) {
      var el = lista.querySelector('[data-conta="' + c.id + '"]');
      return { conta: c, valor: numero(el.value) };
    }).filter(function (x) { return x.valor > 0; })
      .sort(function (a, b) {
        return a.conta.nivel - b.conta.nivel || a.conta.ordem - b.conta.ordem;
      });
  }

  /* ---------- Cálculo ---------- */

  function calcular() {
    var itens = lerContas();
    var caixa = numero(elDisponivel.value);

    if (itens.length < 2) { elResultado.hidden = true; return; }

    var total = itens.reduce(function (s, i) { return s + i.valor; }, 0);
    var restante = caixa;
    var pagas = [];
    var fora = [];

    /* Dinheiro alocado na ordem do custo do atraso. Uma conta que não cabe
       inteira não trava a fila: o que sobrar tenta cobrir as seguintes, porque
       pagamento parcial de conta cara vale mais que dinheiro parado. */
    itens.forEach(function (i) {
      if (restante >= i.valor) {
        restante -= i.valor;
        pagas.push({ item: i, parcial: 0 });
      } else if (restante > 0) {
        pagas.push({ item: i, parcial: restante });
        restante = 0;
      } else {
        fora.push(i);
      }
    });

    /* --- Veredito --- */
    var cx = document.getElementById("veredito");
    var estrela = document.getElementById("rEstrela");
    var frase = document.getElementById("rFrase");
    var falta = total - caixa;
    var inteiras = pagas.filter(function (p) { return !p.parcial; }).length;

    document.getElementById("rChapeu").textContent = caixa >= total
      ? "Com o que você tem, dá para cobrir" : "Com o que você tem, dá para cobrir";

    if (caixa >= total) {
      cx.className = "veredito bom";
      estrela.textContent = "tudo";
      frase.innerHTML = "As " + itens.length + " contas somam <b>" + BRL.format(total) +
        "</b> e você tem <b>" + BRL.format(caixa) + "</b>. Pague na ordem abaixo mesmo assim — " +
        "se algo der errado no meio do mês, o essencial já estará resolvido.";
    } else {
      cx.className = inteiras >= 2 ? "veredito atencao" : "veredito ruim";
      estrela.textContent = inteiras + " de " + itens.length;
      frase.innerHTML = "As contas somam <b>" + BRL.format(total) + "</b> e faltam <b>" +
        BRL.format(falta) + "</b>. Isso não é falta de organização — é falta de dinheiro, e " +
        "a única decisão que resta é <b>qual atraso custa menos</b>. A ordem abaixo responde isso.";
    }

    /* --- Ordem de pagamento --- */
    var ordem = document.getElementById("ordem");
    ordem.innerHTML = "";
    pagas.forEach(function (p) {
      var li = document.createElement("li");
      var extra = p.parcial
        ? " · <b>só dá para pagar " + BRL.format(p.parcial) + " desta</b> — ligue e proponha o resto para depois"
        : "";
      li.innerHTML = "<b>" + escapar(p.item.conta.nome) + " · " + BRL.format(p.item.valor) +
        "</b><span>" + escapar(p.item.conta.risco) + extra + "</span>";
      ordem.appendChild(li);
    });

    /* --- O que fica de fora --- */
    var blocoFora = document.getElementById("blocoFora");
    var listaFora = document.getElementById("fora");
    listaFora.innerHTML = "";
    if (fora.length) {
      blocoFora.hidden = false;
      fora.forEach(function (i) {
        var li = document.createElement("li");
        li.innerHTML = "<b>" + escapar(i.conta.nome) + " · " + BRL.format(i.valor) +
          "</b><span>" + escapar(i.conta.plano) + "</span>";
        listaFora.appendChild(li);
      });
    } else {
      blocoFora.hidden = true;
    }

    /* --- A conta mais perigosa da lista --- */
    var pior = itens[0];
    document.getElementById("vTitulo").textContent =
      "A conta que não pode atrasar: " + pior.conta.nome;
    document.getElementById("vTexto").innerHTML =
      escapar(pior.conta.risco) + " Por isso ela vem antes de qualquer dívida de juros alto — " +
      "<b>o custo do atraso aqui não é dinheiro</b>. Se nem ela couber, é o momento de ligar " +
      "para o credor hoje, antes do vencimento: credor avisado negocia, credor surpreendido cobra.";

    elResultado.hidden = false;

    if (!jaMediu) {
      jaMediu = true;
      medir("ordem_contas_pronta", {
        qtd_contas: itens.length,
        cobre_tudo: caixa >= total,
        contas_fora: fora.length,
        tem_nivel_1: itens.some(function (i) { return i.conta.nivel === 1; })
      });
    }
  }

  document.getElementById("btnCopiar").addEventListener("click", function () {
    var botao = this;
    var linhas = ["MINHA ORDEM DE PAGAMENTO", ""];
    Array.prototype.forEach.call(document.querySelectorAll("#ordem li"), function (li, i) {
      linhas.push((i + 1) + ". " + li.querySelector("b").textContent);
    });
    var f = document.querySelectorAll("#fora li");
    if (f.length) {
      linhas.push("", "FICA PARA DEPOIS (ligar e negociar):");
      Array.prototype.forEach.call(f, function (li) {
        linhas.push("- " + li.querySelector("b").textContent);
        linhas.push("  " + li.querySelector("span").textContent);
      });
    }
    linhas.push("", "Monte a sua: " + location.href.split("#")[0]);

    function aviso(ok) {
      botao.textContent = ok ? "Copiado!" : "Não consegui copiar";
      setTimeout(function () { botao.textContent = "Copiar minha ordem"; }, 2200);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(linhas.join("\n"))
        .then(function () { aviso(true); medir("copiou_ordem_contas"); }, function () { aviso(false); });
    } else { aviso(false); }
  });

  elDisponivel.addEventListener("input", calcular);
})();
