import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { error } = await supabase.from("plantios").delete().eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const body = await request.json();
  const { producao_colhida_sc, umidade_colheita } = body as {
    producao_colhida_sc?: number;
    umidade_colheita?: number;
  };

  if (producao_colhida_sc == null) {
    return NextResponse.json({ error: "Informe a quantidade colhida." }, { status: 400 });
  }

  const { error } = await supabase
    .from("plantios")
    .update({ producao_colhida_sc, umidade_colheita: umidade_colheita ?? null })
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
