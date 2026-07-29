export const TIPOS_OPERACAO = [
  { value: "plantio", label: "Plantio" },
  { value: "adubacao", label: "Adubação" },
  { value: "pulverizacao", label: "Pulverização" },
  { value: "cultivo", label: "Cultivo/Capina" },
  { value: "irrigacao", label: "Irrigação" },
  { value: "colheita", label: "Colheita" },
  { value: "outro", label: "Outro" },
];

export function labelTipoOperacao(valor: string) {
  return TIPOS_OPERACAO.find((t) => t.value === valor)?.label ?? valor;
}
