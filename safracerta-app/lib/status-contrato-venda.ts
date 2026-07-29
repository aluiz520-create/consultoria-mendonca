export function statusContratoVenda(
  status: string,
  dataEntrega: string | null
): { label: string; className: string } {
  if (status === "cancelado") return { label: "Cancelado", className: "bg-gray-200 text-gray-700" };
  if (status === "entregue") return { label: "Entregue", className: "bg-green-100 text-green-700" };

  if (dataEntrega) {
    const dias = Math.ceil((new Date(dataEntrega).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (dias < 0) return { label: "Entrega atrasada", className: "bg-red-100 text-red-700" };
    if (dias <= 15) return { label: `Entrega em ${dias} dias`, className: "bg-amber-100 text-amber-700" };
  }

  return { label: "Aguardando entrega", className: "bg-blue-100 text-blue-700" };
}
