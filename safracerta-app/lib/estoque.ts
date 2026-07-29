export const CATEGORIAS_ESTOQUE = [
  { value: "sementes", label: "Sementes" },
  { value: "fertilizantes", label: "Fertilizantes" },
  { value: "defensivos", label: "Defensivos" },
  { value: "combustiveis", label: "Combustíveis" },
  { value: "lubrificantes", label: "Lubrificantes" },
  { value: "pecas", label: "Peças" },
  { value: "epis", label: "EPIs" },
  { value: "materiais", label: "Materiais" },
  { value: "outros", label: "Outros" },
];

export const UNIDADES_ESTOQUE = [
  { value: "kg", label: "kg" },
  { value: "l", label: "litro" },
  { value: "saca", label: "saca" },
  { value: "ton", label: "tonelada" },
  { value: "un", label: "unidade" },
];

export function labelCategoria(valor: string) {
  return CATEGORIAS_ESTOQUE.find((c) => c.value === valor)?.label ?? valor;
}

export function labelUnidade(valor: string) {
  return UNIDADES_ESTOQUE.find((u) => u.value === valor)?.label ?? valor;
}

export function calcularSaldos(movimentacoes: { produto_id: string; tipo: string; quantidade: number }[]) {
  const saldos = new Map<string, number>();
  for (const m of movimentacoes) {
    const atual = saldos.get(m.produto_id) ?? 0;
    saldos.set(m.produto_id, atual + (m.tipo === "entrada" ? Number(m.quantidade) : -Number(m.quantidade)));
  }
  return saldos;
}
