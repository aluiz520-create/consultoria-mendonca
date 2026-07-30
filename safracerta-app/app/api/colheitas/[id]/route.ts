import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { error } = await supabase.from("colheitas").delete().eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const body = await request.json();
  const { data, peso_liquido_kg, umidade, sacas, armazem_id } = body as {
    data?: string;
    peso_liquido_kg?: number;
    umidade?: number;
    sacas?: number;
    armazem_id?: string;
  };

  const updates: Record<string, any> = {};
  if (data) updates.data = data;
  if (peso_liquido_kg) updates.peso_liquido_kg = peso_liquido_kg;
  if (umidade !== undefined) updates.umidade = umidade;
  if (sacas) updates.sacas = sacas;
  if (armazem_id) updates.armazem_id = armazem_id;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nenhum campo para atualizar." }, { status: 400 });
  }

  const { error } = await supabase.from("colheitas").update(updates).eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
