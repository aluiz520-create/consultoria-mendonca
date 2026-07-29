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
  const { contrato_venda_id, valor, data, forma_pagamento, observacoes } = body as {
    contrato_venda_id: string;
    valor: number;
    data?: string;
    forma_pagamento?: string;
    observacoes?: string;
  };

  if (!contrato_venda_id || !valor) {
    return NextResponse.json({ error: "Selecione o contrato e informe o valor recebido." }, { status: 400 });
  }

  const { data: recebimento, error } = await supabase
    .from("recebimentos_venda")
    .insert({
      account_id: perfil.account_id,
      contrato_venda_id,
      valor,
      data: data || new Date().toISOString().slice(0, 10),
      forma_pagamento,
      observacoes,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ recebimento }, { status: 201 });
}
