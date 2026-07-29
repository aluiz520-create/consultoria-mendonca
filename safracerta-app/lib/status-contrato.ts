export function statusContrato(dataFim: string, status: string): { label: string; className: string } {
  if (status === "encerrado") return { label: "Encerrado antecipadamente", className: "bg-gray-200 text-gray-700" };

  const dias = Math.ceil((new Date(dataFim).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (dias < 0) return { label: "Vencido", className: "bg-red-100 text-red-700" };
  if (dias <= 30) return { label: `Vence em ${dias} dias`, className: "bg-amber-100 text-amber-700" };
  return { label: "Ativo", className: "bg-green-100 text-green-700" };
}
