export function statusPagamento(
  dataVencimento: string | null,
  dataPagamento: string | null
): { label: string; className: string } {
  if (dataPagamento) return { label: "Pago", className: "bg-green-100 text-green-700" };

  if (dataVencimento) {
    const dias = Math.ceil((new Date(dataVencimento).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (dias < 0) return { label: "Vencido", className: "bg-red-100 text-red-700" };
    if (dias <= 7) return { label: `Vence em ${dias}d`, className: "bg-amber-100 text-amber-700" };
  }

  return { label: "A vencer", className: "bg-blue-100 text-blue-700" };
}
