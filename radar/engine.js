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
        riscos.unshift(Object.assign({}, itemBase, { titulo: 'Operação com margem negativa', texto: 'No período ' + (last.periodo || 'informado') + ', as despesas superaram a receita em ' +
