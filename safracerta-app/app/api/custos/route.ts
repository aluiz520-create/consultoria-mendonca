import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const plantioId = searchParams.get("plantioId");

  if (!plantioId) return NextResponse.json({ error: "Informe plantioId." }, { status: 400 });

  const { data, error } = await supabase
    .from("lancamentos_custo")
    .select("id, descricao, valor, data, data_vencimento, data_pagamento, categorias_custo(nome, grupo)")
    .eq("plantio_id", plantioId)
    .order("data", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ lancamentos: data });
}

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const body = await request.json();
  const { plantio_id, categoria_id, descricao, valor, data, data_vencimento, data_pagamento } = body;

  if (!plantio_id || !categoria_id || !valor) {
    return NextResponse.json({ error: "Preencha plantio, categoria e valor." }, { status: 400 });
  }

  const dataLancamento = data || new Date().toISOString().slice(0, 10);

  const { data: lancamento, error } = await supabase
    .from("lancamentos_custo")
    .insert({
      plantio_id,
      categoria_id,
      descricao,
      valor,
      data: dataLancamento,
      data_vencimento: data_vencimento || null,
      data_pagamento: data_pagamento || null,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ lancamento }, { status: 201 });
}
