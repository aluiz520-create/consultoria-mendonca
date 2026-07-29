import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { custoPorHectare, custoPorSaca } from "@/lib/calculos/custoPorHectare";

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const plantioId = searchParams.get("plantioId");

  if (!plantioId) return NextResponse.json({ error: "Informe plantioId." }, { status: 400 });

  const { data: plantio, error: erroPlantio } = await supabase
    .from("plantios")
    .select("id, cultura_id, culturas(nome), area_plantada_ha, produtividade_esperada_sc_ha")
    .eq("id", plantioId)
    .single();

  if (erroPlantio || !plantio) return NextResponse.json({ error: "Plantio não encontrado." }, { status: 404 });

  const { data: lancamentos, error: erroLancamentos } = await supabase
    .from("lancamentos_custo")
    .select("valor")
    .eq("plantio_id", plantioId);

  if (erroLancamentos) return NextResponse.json({ error: erroLancamentos.message }, { status: 400 });

  const custoTotal = (lancamentos ?? []).reduce((acc, l) => acc + Number(l.valor), 0);

  return NextResponse.json({
    plantio,
    custoTotal,
    custoPorHectare: custoPorHectare(custoTotal, plantio.area_plantada_ha),
    custoPorSaca: plantio.produtividade_esperada_sc_ha
      ? custoPorSaca(custoTotal, plantio.area_plantada_ha, plantio.produtividade_esperada_sc_ha)
      : null,
  });
}
