import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { error } = await supabase.from("implementos").delete().eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const body = await request.json();
  const { nome, tipo, custo_hora, ativo } = body as {
    nome?: string;
    tipo?: string;
    custo_hora?: number;
    ativo?: boolean;
  };

  const updates: Record<string, any> = {};
  if (nome) updates.nome = nome;
  if (tipo !== undefined) updates.tipo = tipo;
  if (custo_hora !== undefined) updates.custo_hora = custo_hora;
  if (ativo !== undefined) updates.ativo = ativo;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nenhum campo para atualizar." }, { status: 400 });
  }

  const { error } = await supabase.from("implementos").update(updates).eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
