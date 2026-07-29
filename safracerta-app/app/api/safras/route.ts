import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = createClient();
  const body = await request.json();
  const {
    fazenda_id,
    talhao_id,
    cultura,
    ano,
    area_plantada_ha,
    produtividade_esperada_sc_ha,
    preco_referencia_sc,
  } = body;

  if (!fazenda_id || !cultura || !ano || !area_plantada_ha) {
    return NextResponse.json({ error: "Preencha fazenda, cultura, safra e área plantada." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("safras")
    .insert({
      fazenda_id,
      talhao_id: talhao_id || null,
      cultura,
      ano,
      area_plantada_ha,
      produtividade_esperada_sc_ha,
      preco_referencia_sc,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ safra: data }, { status: 201 });
}
