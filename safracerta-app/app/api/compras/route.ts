import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { data: perfil } = await supabase.from("users").select("account_id").eq("id", user.id).single();
  if (!perfil) return NextResponse.json({ error: "Conta não encontrada." }, { status: 400 });

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
    ja_pago,
    observacoes,
  } = body as {
    fornecedor_nome: string;
    produto_id: string;
    plantio_id: string;
    categoria_id: string;
    quantidade: number;
    preco_unitario: number;
    data_compra?: string;
    data_vencimento?: string;
    ja_pago?: boolean;
    observacoes?: string;
  };

  if (!fornecedor_nome || !produto_id || !plantio_id || !categoria_id || !quantidade || !preco_unitario) {
    return NextResponse.json(
      { error: "Preencha fornecedor, produto, plantio, categoria, quantidade e preço." },
      { status: 400 }
    );
  }

  const dataCompra = data_compra || new Date().toISOString().slice(0, 10);

  const { data: produto } = await supabase
    .from("produtos_estoque")
    .select("nome, unidade_medida")
    .eq("id", produto_id)
    .single();

  const { data: categoria } = await supabase
    .from("categorias_custo")
    .select("centro_resultado_id")
    .eq("id", categoria_id)
    .single();

  const { data: compra, error: erroCompra } = await supabase
    .from("compras")
    .insert({
      account_id: perfil.account_id,
      fornecedor_nome,
      produto_id,
      plantio_id,
      categoria_id,
      quantidade,
      preco_unitario,
      data_compra: dataCompra,
      data_vencimento: ja_pago ? null : data_vencimento || null,
      observacoes,
      created_by: user.id,
    })
    .select()
    .single();

  if (erroCompra) return NextResponse.json({ error: erroCompra.message }, { status: 400 });

  const { error: erroMovimentacao } = await supabase.from("estoque_movimentacoes").insert({
    account_id: perfil.account_id,
    produto_id,
    tipo: "entrada",
    quantidade,
    preco_unitario,
    data: dataCompra,
    observacao: `Compra de ${fornecedor_nome}`,
    created_by: user.id,
    compra_id: compra.id,
  });

  if (erroMovimentacao) {
    await supabase.from("compras").delete().eq("id", compra.id);
    return NextResponse.json({ error: erroMovimentacao.message }, { status: 400 });
  }

  const { error: erroLancamento } = await supabase.from("lancamentos_custo").insert({
    plantio_id,
    categoria_id,
    descricao: `Compra: ${quantidade} ${produto?.unidade_medida ?? ""} de ${produto?.nome ?? "produto"} — ${fornecedor_nome}`,
    valor: compra.valor_total,
    data: dataCompra,
    data_pagamento: ja_pago ? dataCompra : null,
    data_vencimento: ja_pago ? null : data_vencimento || null,
    centro_resultado_id: categoria?.centro_resultado_id ?? null,
    created_by: user.id,
    compra_id: compra.id,
  });

  if (erroLancamento) {
    await supabase.from("compras").delete().eq("id", compra.id);
    return NextResponse.json({ error: erroLancamento.message }, { status: 400 });
  }

  return NextResponse.json({ compra }, { status: 201 });
}
