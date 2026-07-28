export function custoPorHectare(custoTotal: number, areaHa: number): number {
  if (!areaHa) return 0;
  return custoTotal / areaHa;
}

export function custoPorSaca(custoTotal: number, areaHa: number, produtividadeScHa: number): number {
  const totalSacas = areaHa * produtividadeScHa;
  if (!totalSacas) return 0;
  return custoTotal / totalSacas;
}
