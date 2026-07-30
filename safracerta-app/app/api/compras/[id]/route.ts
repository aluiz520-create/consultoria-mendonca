import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { error } = await supabase.from("compras").delete().eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const body = await request.json();
  const {
    fornecedor_nome,
    produto_id,
    plantio_id,
    categoria_id,
    quantidade,
    preco_unitario,
    data_compra,
    data_vencimento,
    observacoes,
  } = body as {
    fornecedor_nome?: string;
    produto_id?: string;
    plantio_id?: string;
    categoria_id?: string;
    quantidade?: number;
    preco_unitario?: number;
    data_compra?: string;
    data_vencimento?: string | null;
    observacoes?: string;
  };

  const updates: Record<string, any> = {};
  if (fornecedor_nome) updates.fornecedor_nome = fornecedor_nome;
  if (produto_id) updates.produto_id = produto_id;
  if (plantio_id) updates.plantio_id = plantio_id;
  if (categoria_id) updates.categoria_id = categoria_id;
  if (quantidade) updates.quantidade = quantidade;
  if (preco_unitario) updates.preco_unitario = preco_unitario;
  if (data_compra) updates.data_compra = data_compra;
  if (data_vencimento !== undefined) updates.data_vencimento = data_vencimento;
  if (observacoes !== undefined) updates.observacoes = observacoes;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nenhum campo para atualizar." }, { status: 400 });
  }

  const { error } = await supabase.from("compras").update(updates).eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
