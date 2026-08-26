/**
 * RADAR FINANCEIRO — CONTROLLER DO AGRO (FASE 0, V1)
 * ====================================================
 * Motor 100% determinístico (aritmética simples sobre os números que a
 * pessoa informou) — de propósito, NÃO usa um modelo de IA para gerar
 * números. Isso cumpre ao pé da letra a regra de segurança da missão:
 * "a IA não pode inventar números, economia, lucro, riscos...". Aqui não
 * há o que inventar porque não há geração de texto livre — só contas.
 *
 * Entrada esperada (CSV ou XLSX), uma linha por período (ex.: por mês):
 *   periodo, receita, despesas, dividas, contas_pagar, contas_receber,
 *   producao, preco, area, estoque
 * Todas as colunas são opcionais, exceto "periodo" — o motor calcula o que
 * der para calcular com o que foi informado e marca o resto como
 * DADO INSUFICIENTE. Números podem usar vírgula ou ponto decimal.
 *
 * Exportado como window.RadarEngine.compute(rows) -> objeto de resultado.
 */
(function (global) {
  'use strict';

  var CONF = {
    CONFIRMADO: 'CONFIRMADO',
    PROVAVEL: 'PROVÁVEL',
    ESTIMATIVA: 'ESTIMATIVA',
    NECESSITA_VALIDACAO: 'NECESSITA VALIDAÇÃO',
    DADO_INSUFICIENTE: 'DADO INSUFICIENTE'
  };

  function num(v) {
    if (v === undefined || v === null || v === '') return null;
    if (typeof v === 'number') return isFinite(v) ? v : null;
    var s = String(v).trim().replace(/\./g, '').replace(',', '.');
    // se não tinha milhar com ponto, o replace acima pode ter comido o
    // separador decimal de números tipo "1234.56" digitados em padrão US;
    // tenta as duas formas e usa a que parsear.
    var a = parseFloat(s);
    var b = parseFloat(String(v).trim());
    if (!isNaN(a)) return a;
    if (!isNaN(b)) return b;
    return null;
  }

  function pct(a, b) { return (a !== null && b !== null && b !== 0) ? (a / b) * 100 : null; }

  function normalizeRow(r) {
    return {
      periodo: r.periodo || r.período || r.mes || r.mês || '',
      receita: num(r.receita),
      despesas: num(r.despesas),
      dividas: num(r.dividas || r.dívidas),
      contas_pagar: num(r.contas_pagar),
      contas_receber: num(r.contas_receber),
      producao: num(r.producao || r.produção),
      preco: num(r.preco || r.preço),
      area: num(r.area || r.área),
      estoque: num(r.estoque)
    };
  }

  function achado(secao, titulo, texto, evidencia, calculo, premissas, confianca) {
    return { secao: secao, titulo: titulo, texto: texto, evidencia: evidencia, calculo: calculo, premissas: premissas, confianca: confianca };
  }

  function compute(rawRows) {
    if (!rawRows || !rawRows.length) {
      return { erro: 'Nenhuma linha de dado encontrada no arquivo.' };
    }
    var rows = rawRows.map(normalizeRow);
    var last = rows[rows.length - 1];
    var prev = rows.length > 1 ? rows[rows.length - 2] : null;

    var riscos = [], oportunidades = [], alertas = [], impacto = [], decisoes = [];
    var subscores = []; // {chave, valor0a100, peso, motivo}

    // ---------------- Margem operacional ----------------
    if (last.receita !== null && last.despesas !== null) {
      var margem = pct(last.receita - last.despesas, last.receita);
      var margemArred = Math.round(margem * 10) / 10;
      var itemBase = achado('financeiro', 'Margem operacional do período',
        'Margem operacional de ' + margemArred + '% no período ' + (last.periodo || 'informado') + '.',
        'receita=' + last.receita + ', despesas=' + last.despesas,
        '(receita - despesas) / receita × 100 = (' + last.receita + ' - ' + last.despesas + ') / ' + last.receita + ' × 100',
        'Considera receita e despesas exatamente como informadas na planilha — não inclui impostos ou custos não declarados.',
        CONF.CONFIRMADO);
      if (margem < 0) {
        riscos.unshift(Object.assign({}, itemBase, { titulo: 'Operação com margem negativa', texto: 'No período ' + (last.periodo || 'informado') + ', as despesas superaram a receita em ' + Math.abs(margemArred) + ' pontos percentuais — a operação está consumindo caixa, não gerando.' }));
        impacto.push({ item: 'Perda operacional no período', valor: (last.despesas - last.receita), confianca: CONF.CONFIRMADO, base: 'despesas − receita informadas' });
      } else if (margem < 10) {
        riscos.push(Object.assign({}, itemBase, { titulo: 'Margem operacional apertada', texto: 'Margem de ' + margemArred + '% deixa pouca folga — qualquer aumento de custo ou queda de preço pode levar a operação a prejuízo. (Leitura de que uma margem abaixo de 10% é apertada segue uma referência geral de gestão, não um padrão específico do seu setor/região — confira com seu contador.)', confianca: CONF.PROVAVEL }));
      } else {
        oportunidades.push(Object.assign({}, itemBase, { titulo: 'Margem operacional saudável', texto: 'Margem de ' + margemArred + '% no período — acima da faixa considerada apertada. Bom momento para negociar prazos melhores ou investir em controle para preservar essa margem.', confianca: CONF.PROVAVEL }));
      }
      subscores.push({ chave: 'margem', valor: Math.max(0, Math.min(100, margem + 30)), peso: 3, motivo: 'margem operacional' });
    } else {
      alertas.push(achado('financeiro', 'Margem não calculável', 'Faltou receita e/ou despesas do período — não dá para calcular a margem operacional.', 'receita=' + last.receita + ', despesas=' + last.despesas, '—', '—', CONF.DADO_INSUFICIENTE));
    }

    // ---------------- Liquidez (contas a receber x pagar) ----------------
    if (last.contas_receber !== null && last.contas_pagar !== null) {
      var liquidez = last.contas_pagar !== 0 ? (last.contas_receber / last.contas_pagar) : null;
      if (liquidez !== null) {
        var liqArred = Math.round(liquidez * 100) / 100;
        var base2 = { evidencia: 'contas_receber=' + last.contas_receber + ', contas_pagar=' + last.contas_pagar, calculo: 'contas_receber / contas_pagar = ' + liqArred, premissas: 'Não considera prazo de vencimento de cada conta, só o total — duas contas com o mesmo total e vencimentos muito diferentes dão o mesmo índice aqui.' };
        if (liquidez < 1) {
          riscos.push(achado('financeiro', 'Contas a pagar maiores que a receber', 'Para cada R$1 a pagar, há R$' + liqArred + ' a receber — se os prazos não estiverem bem alinhados, há risco de aperto de caixa de curto prazo. (Leitura de risco baseada em regra geral — o vencimento real de cada conta pode mudar essa conclusão.)', base2.evidencia, base2.calculo, base2.premissas, CONF.PROVAVEL));
        } else {
          oportunidades.push(achado('financeiro', 'Folga entre contas a receber e a pagar', 'Contas a receber cobrem ' + liqArred + 'x as contas a pagar do período — folga de curto prazo, considerando os totais informados.', base2.evidencia, base2.calculo, base2.premissas, CONF.PROVAVEL));
        }
        subscores.push({ chave: 'liquidez', valor: Math.max(0, Math.min(100, liquidez * 50)), peso: 2, motivo: 'contas a receber / contas a pagar' });
      }
    } else {
      alertas.push(achado('financeiro', 'Liquidez de curto prazo não calculável', 'Faltou informar contas a pagar e/ou contas a receber do período.', '', '', '', CONF.DADO_INSUFICIENTE));
    }

    // ---------------- Endividamento ----------------
    if (last.dividas !== null && last.receita !== null && last.receita !== 0) {
      var endivid = pct(last.dividas, last.receita);
      var endArred = Math.round(endivid) / 1;
      var base3 = { evidencia: 'dividas=' + last.dividas + ', receita=' + last.receita, calculo: 'dividas / receita × 100 = ' + Math.round(endivid * 10) / 10 + '%', premissas: 'Compara a dívida total ao faturamento de UM período (o período informado) — se a receita informada for mensal e a dívida for de longo prazo, esse percentual não é comparável a um índice anualizado. Trate como referência de porte, não como índice financeiro padronizado, sem confirmar o horizonte de tempo de cada número.' };
      riscos.push(achado('financeiro', 'Dívida em relação à receita do período', 'A dívida informada equivale a ' + Math.round(endivid) + '% da receita do período — o significado exato disso depende de saber se a dívida é de curto ou longo prazo, e se a receita informada é mensal ou anual.', base3.evidencia, base3.calculo, base3.premissas, CONF.NECESSITA_VALIDACAO));
    }

    // ---------------- Consistência preço × produção × receita ----------------
    if (last.preco !== null && last.producao !== null && last.receita !== null) {
      var receitaEsperada = last.preco * last.producao;
      var diff = last.receita !== 0 ? Math.abs(receitaEsperada - last.receita) / last.receita * 100 : null;
      if (diff !== null && diff > 15) {
        alertas.push(achado('anomalia', 'Receita não bate com preço × produção informados',
          'Preço × produção informados dariam R$' + Math.round(receitaEsperada).toLocaleString('pt-BR') + ', mas a receita informada foi R$' + Math.round(last.receita).toLocaleString('pt-BR') + ' — diferença de ' + Math.round(diff) + '%. Pode ser venda parcial da produção, preço médio diferente do informado, ou erro de digitação em um dos três campos.',
          'preco=' + last.preco + ', producao=' + last.producao + ', receita=' + last.receita,
          'preco × producao = ' + Math.round(receitaEsperada) + '; diferença = |esperado − informado| / informado × 100',
          'Compara só os três números informados — não sabe se parte da produção foi estocada, vendida em outro período, ou vendida a preços diferentes ao longo do tempo.',
          CONF.CONFIRMADO));
      }
    }

    // ---------------- Custo por hectare / por unidade produzida ----------------
    if (last.despesas !== null && last.area !== null && last.area > 0) {
      var custoHa = last.despesas / last.area;
      impacto.push({ item: 'Custo por hectare no período', valor: Math.round(custoHa), confianca: CONF.CONFIRMADO, base: 'despesas informadas / área informada' });
    }
    if (last.despesas !== null && last.producao !== null && last.producao > 0) {
      var custoUnid = last.despesas / last.producao;
      impacto.push({ item: 'Custo por unidade produzida no período', valor: Math.round(custoUnid * 100) / 100, confianca: CONF.CONFIRMADO, base: 'despesas informadas / produção informada' });
    }

    // ---------------- Estoque — cobertura aproximada ----------------
    if (last.estoque !== null && last.despesas !== null && last.despesas > 0) {
      var coberturaMeses = last.estoque / last.despesas;
      alertas.push(achado('anomalia', 'Cobertura de estoque aproximada',
        'No ritmo de despesas do período informado, o estoque informado equivaleria a cerca de ' + (Math.round(coberturaMeses * 10) / 10) + ' período(s) de despesas — é uma referência grosseira, não uma projeção de ruptura ou excesso real.',
        'estoque=' + last.estoque + ', despesas=' + last.despesas,
        'estoque / despesas = ' + (Math.round(coberturaMeses * 100) / 100),
        'Assume que o estoque é consumido no mesmo ritmo das despesas totais, o que raramente é verdade — é só uma ordem de grandeza, não uma projeção de ruptura.',
        CONF.ESTIMATIVA));
    }

    // ---------------- Tendência (se houver 2+ períodos) ----------------
    if (prev && last.receita !== null && prev.receita !== null && prev.receita !== 0) {
      var cresc = pct(last.receita - prev.receita, prev.receita);
      var crescArred = Math.round(cresc * 10) / 10;
      var itemT = achado('tendencia', 'Variação de receita entre períodos',
        'Receita variou ' + (cresc >= 0 ? '+' : '') + crescArred + '% de ' + (prev.periodo || 'período anterior') + ' para ' + (last.periodo || 'período atual') + '.',
        'receita anterior=' + prev.receita + ', receita atual=' + last.receita,
        '(atual − anterior) / anterior × 100',
        'Compara só dois pontos — não indica se é tendência sustentada ou variação pontual (ex.: sazonalidade da safra).',
        CONF.CONFIRMADO);
      if (cresc < -10) riscos.push(Object.assign({}, itemT, { titulo: 'Queda de receita entre períodos' }));
      else if (cresc > 10) oportunidades.push(Object.assign({}, itemT, { titulo: 'Crescimento de receita entre períodos' }));
    } else if (rows.length < 2) {
      alertas.push(achado('tendencia', 'Tendência não calculável', 'Só há um período nesta planilha — para ver evolução (crescimento/queda), envie ao menos dois períodos (ex.: dois meses).', '', '', '', CONF.DADO_INSUFICIENTE));
    }

    // ---------------- Saúde financeira 0–100 ----------------
    var saude = null, formulaSaude = 'Sem sub-índices suficientes para compor a saúde financeira.';
    if (subscores.length) {
      var somaPesos = subscores.reduce(function (s, x) { return s + x.peso; }, 0);
      var soma = subscores.reduce(function (s, x) { return s + x.valor * x.peso; }, 0);
      saude = Math.round(soma / somaPesos);
      saude = Math.max(0, Math.min(100, saude));
      formulaSaude = 'Média ponderada de ' + subscores.map(function (x) { return x.motivo + ' (peso ' + x.peso + ')'; }).join(', ') + '.';
    }

    // ---------------- 5 decisões prioritárias ----------------
    var candidatas = riscos.concat(alertas.filter(function (a) { return a.confianca !== CONF.DADO_INSUFICIENTE; }));
    var vistos = {};
    candidatas.slice(0, 8).forEach(function (c) {
      var chave = c.secao + ':' + c.titulo;
      if (vistos[chave]) return; vistos[chave] = true;
      if (decisoes.length >= 5) return;
      decisoes.push({
        titulo: 'Investigar: ' + c.titulo,
        texto: c.texto,
        confianca: c.confianca
      });
    });
    if (decisoes.length < 5) {
      decisoes.push({ titulo: 'Confirmar completude dos dados', texto: 'Vários cálculos ficaram como DADO INSUFICIENTE nesta análise — preencher os campos faltantes (dívidas, contas a pagar/receber, produção, área, estoque) destrava mais achados e uma leitura de saúde financeira mais confiável.', confianca: CONF.NECESSITA_VALIDACAO });
    }

    return {
      periodo_analisado: last.periodo || '(não informado)',
      periodos_recebidos: rows.length,
      saude_financeira: saude,
      formula_saude: formulaSaude,
      riscos: riscos,
      oportunidades: oportunidades,
      alertas: alertas,
      impacto_financeiro: impacto,
      decisoes: decisoes.slice(0, 5),
      aviso: 'Todo número acima vem de conta simples sobre o que foi informado no arquivo. Nada foi estimado por um modelo de IA. Onde a leitura depende de contexto que a planilha não tem, o rótulo diz isso explicitamente.'
    };
  }

  global.RadarEngine = { compute: compute, CONF: CONF, _normalizeRow: normalizeRow };
})(typeof window !== 'undefined' ? window : this);
