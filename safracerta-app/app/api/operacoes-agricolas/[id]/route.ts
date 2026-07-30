import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { error } = await supabase.from("operacoes_agricolas").delete().eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const body = await request.json();
  const { tipo, data, area_executada_ha, horas, observacoes, funcionario_id, maquina_id, implemento_id } = body as {
    tipo?: string;
    data?: string;
    area_executada_ha?: number;
    horas?: number;
    observacoes?: string;
    funcionario_id?: string | null;
    maquina_id?: string | null;
    implemento_id?: string | null;
  };

  const updates: Record<string, any> = {};
  if (tipo) updates.tipo = tipo;
  if (data) updates.data = data;
  if (area_executada_ha) updates.area_executada_ha = area_executada_ha;
  if (horas) updates.horas = horas;
  if (observacoes !== undefined) updates.observacoes = observacoes;
  if (funcionario_id !== undefined) updates.funcionario_id = funcionario_id;
  if (maquina_id !== undefined) updates.maquina_id = maquina_id;
  if (implemento_id !== undefined) updates.implemento_id = implemento_id;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nenhum campo para atualizar." }, { status: 400 });
  }

  const { error } = await supabase.from("operacoes_agricolas").update(updates).eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
