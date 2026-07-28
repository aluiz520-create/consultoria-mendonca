import { custoPorSaca } from "./custoPorHectare";

export interface ResultadoBreakEven {
  custoPorSaca: number;
  precoReferencia: number;
  margemPorSaca: number;
  resultadoTotal: number;
}

export function calcularBreakEven(
  custoTotal: number,
  areaHa: number,
  produtividadeScHa: number,
  precoReferenciaSc: number
): ResultadoBreakEven {
  const cSaca = custoPorSaca(custoTotal, areaHa, produtividadeScHa);
  const margemPorSaca = precoReferenciaSc - cSaca;
  const totalSacas = areaHa * produtividadeScHa;

  return {
    custoPorSaca: cSaca,
    precoReferencia: precoReferenciaSc,
    margemPorSaca,
    resultadoTotal: margemPorSaca * totalSacas,
  };
}
