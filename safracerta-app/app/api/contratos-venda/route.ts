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
    plantio_id,
    comprador_nome,
    cultura,
    quantidade,
    unidade_medida,
    preco_unitario,
    forma_pagamento,
    data_contrato,
    data_entrega,
    observacoes,
  } = body;

  if (!comprador_nome || !quantidade || !preco_unitario) {
    return NextResponse.json(
      { error: "Preencha comprador, quantidade e preço por unidade." },
      { status: 400 }
    );
  }

  const { data: centroComercial } = await supabase
    .from("centros_resultado")
    .select("id")
    .eq("account_id", perfil.account_id)
    .eq("nome", "Comercial")
    .single();

  const { data, error } = await supabase
    .from("contratos_venda")
    .insert({
      account_id: perfil.account_id,
      plantio_id: plantio_id || null,
      centro_resultado_id: centroComercial?.id ?? null,
      comprador_nome,
      cultura,
      quantidade,
      unidade_medida: unidade_medida || "saca",
      preco_unitario,
      forma_pagamento,
      data_contrato: data_contrato || new Date().toISOString().slice(0, 10),
      data_entrega: data_entrega || null,
      observacoes,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ contratoVenda: data }, { status: 201 });
}
