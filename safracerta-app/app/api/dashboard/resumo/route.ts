import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { custoPorHectare, custoPorSaca } from "@/lib/calculos/custoPorHectare";

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const safraId = searchParams.get("safraId");

  if (!safraId) return NextResponse.json({ error: "Informe safraId." }, { status: 400 });

  const { data: safra, error: erroSafra } = await supabase
    .from("safras")
    .select("id, cultura, ano, area_plantada_ha, produtividade_esperada_sc_ha")
    .eq("id", safraId)
    .single();

  if (erroSafra || !safra) return NextResponse.json({ error: "Safra não encontrada." }, { status: 404 });

  const { data: lancamentos, error: erroLancamentos } = await supabase
    .from("lancamentos_custo")
    .select("valor")
    .eq("safra_id", safraId);

  if (erroLancamentos) return NextResponse.json({ error: erroLancamentos.message }, { status: 400 });

  const custoTotal = (lancamentos ?? []).reduce((acc, l) => acc + Number(l.valor), 0);

  return NextResponse.json({
    safra,
    custoTotal,
    custoPorHectare: custoPorHectare(custoTotal, safra.area_plantada_ha),
    custoPorSaca: safra.produtividade_esperada_sc_ha
      ? custoPorSaca(custoTotal, safra.area_plantada_ha, safra.produtividade_esperada_sc_ha)
      : null,
  });
}
