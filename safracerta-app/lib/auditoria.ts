const TABELA_LABEL: Record<string, string> = {
  fazendas: "Fazenda",
  talhoes: "Talhão",
  culturas: "Cultura",
  safras: "Safra",
  plantios: "Plantio",
  lancamentos_custo: "Operação",
  contratos: "Contrato",
  contrato_aditivos: "Aditivo de contrato",
  contratos_venda: "Contrato de venda",
  despesas_rateadas: "Rateio de despesa",
  funcionarios: "Funcionário",
  maquinas: "Máquina",
  implementos: "Implemento",
  produtos_estoque: "Produto de estoque",
  estoque_movimentacoes: "Movimentação de estoque",
  compras: "Compra",
  operacoes_agricolas: "Operação agrícola",
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
    (dados.comprador_nome as string) ||
    (dados.descricao as string) ||
    null
  );
}

export function resumoEvento(dadosAntigos: Record<string, unknown> | null, dadosNovos: Record<string, unknown> | null) {
  return nomeAmigavel(dadosNovos) ?? nomeAmigavel(dadosAntigos);
}
