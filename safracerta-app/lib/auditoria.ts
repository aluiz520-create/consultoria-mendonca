const TABELA_LABEL: Record<string, string> = {
  fazendas: "Fazenda",
  safras: "Safra",
  lancamentos_custo: "Lançamento de custo",
  contratos: "Contrato",
  contrato_aditivos: "Aditivo de contrato",
  despesas_rateadas: "Rateio de despesa",
};

const ACAO_LABEL: Record<string, string> = {
  insert: "criou",
  update: "alterou",
  delete: "apagou",
};

export function descreverEvento(tabela: string, acao: string): string {
  const tabelaLabel = TABELA_LABEL[tabela] ?? tabela;
  const acaoLabel = ACAO_LABEL[acao] ?? acao;
  return `${acaoLabel} ${tabelaLabel.toLowerCase()}`;
}

function nomeAmigavel(dados: Record<string, unknown> | null): string | null {
  if (!dados) return null;
  return (
    (dados.nome as string) ||
    (dados.contraparte_nome as string) ||
    (dados.descricao as string) ||
    (dados.cultura ? `${dados.cultura} ${dados.ano ?? ""}`.trim() : null) ||
    null
  );
}

export function resumoEvento(dadosAntigos: Record<string, unknown> | null, dadosNovos: Record<string, unknown> | null) {
  return nomeAmigavel(dadosNovos) ?? nomeAmigavel(dadosAntigos);
}
