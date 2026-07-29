export function statusRecebimentoVenda(
  valorLiquido: number,
  valorRecebido: number
): { label: string; className: string } {
  if (valorRecebido <= 0) return { label: "A receber", className: "bg-blue-100 text-blue-700" };
  if (valorRecebido >= valorLiquido) return { label: "Pago", className: "bg-green-100 text-green-700" };
  return { label: "Parcial", className: "bg-amber-100 text-amber-700" };
}
