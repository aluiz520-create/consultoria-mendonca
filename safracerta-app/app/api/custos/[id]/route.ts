import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { error } = await supabase.from("lancamentos_custo").delete().eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const body = await request.json();
  const {
    categoria_id,
    descricao,
    valor,
    data,
    data_vencimento,
    data_pagamento,
  } = body as {
    categoria_id?: string;
    descricao?: string;
    valor?: number;
    data?: string;
    data_vencimento?: string;
    data_pagamento?: string | null;
  };

  const updates: Record<string, any> = {};
  if (categoria_id) updates.categoria_id = categoria_id;
  if (descricao !== undefined) updates.descricao = descricao;
  if (valor) updates.valor = valor;
  if (data) updates.data = data;
  if (data_vencimento !== undefined) updates.data_vencimento = data_vencimento;
  if (data_pagamento !== undefined)
    updates.data_pagamento = data_pagamento || new Date().toISOString().slice(0, 10);

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nenhum campo para atualizar." }, { status: 400 });
  }

  const { error } = await supabase.from("lancamentos_custo").update(updates).eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
