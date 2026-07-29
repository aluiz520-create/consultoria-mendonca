import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = createClient();
  const body = await request.json();
  const { fazenda_id, nome, area_ha, tipo_solo } = body;

  if (!fazenda_id || !nome) {
    return NextResponse.json({ error: "Informe a fazenda e o nome do talhão." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("talhoes")
    .insert({ fazenda_id, nome, area_ha: area_ha || null, tipo_solo: tipo_solo || null })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ talhao: data }, { status: 201 });
}
