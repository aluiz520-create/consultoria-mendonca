import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { error } = await supabase.from("contratos_venda").delete().eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const body = await request.json();
  const {
    cliente_id,
    comprador_nome,
    quantidade,
    preco_unitario,
    frete,
    desconto,
    forma_pagamento,
    data_contrato,
    data_entrega,
    status,
    observacoes,
  } = body as {
    cliente_id?: string | null;
    comprador_nome?: string;
    quantidade?: number;
    preco_unitario?: number;
    frete?: number;
    desconto?: number;
    forma_pagamento?: string;
    data_contrato?: string;
    data_entrega?: string;
    status?: string;
    observacoes?: string;
  };

  const updates: Record<string, any> = {};
  if (cliente_id !== undefined) updates.cliente_id = cliente_id;
  if (comprador_nome) updates.comprador_nome = comprador_nome;
  if (quantidade) updates.quantidade = quantidade;
  if (preco_unitario) updates.preco_unitario = preco_unitario;
  if (frete !== undefined) updates.frete = frete;
  if (desconto !== undefined) updates.desconto = desconto;
  if (forma_pagamento !== undefined) updates.forma_pagamento = forma_pagamento;
  if (data_contrato) updates.data_contrato = data_contrato;
  if (data_entrega !== undefined) updates.data_entrega = data_entrega;
  if (status) {
    if (!["firmado", "entregue", "cancelado"].includes(status)) {
      return NextResponse.json({ error: "Status inválido." }, { status: 400 });
    }
    updates.status = status;
  }
  if (observacoes !== undefined) updates.observacoes = observacoes;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nenhum campo para atualizar." }, { status: 400 });
  }

  const { error } = await supabase.from("contratos_venda").update(updates).eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
