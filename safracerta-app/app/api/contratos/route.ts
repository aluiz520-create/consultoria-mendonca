import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { data: perfil } = await supabase
    .from("users")
    .select("account_id")
    .eq("id", user.id)
    .single();

  if (!perfil) return NextResponse.json({ error: "Conta não encontrada." }, { status: 400 });

  const body = await request.json();
  const { fazenda_id, tipo, contraparte_nome, area_ha, data_inicio, data_fim, forma_pagamento, valor_referencia } =
    body;

  if (!tipo || !contraparte_nome || !data_inicio || !data_fim) {
    return NextResponse.json(
      { error: "Preencha tipo, contraparte, início e fim do contrato." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("contratos")
    .insert({
      account_id: perfil.account_id,
      fazenda_id: fazenda_id || null,
      tipo,
      contraparte_nome,
      area_ha,
      data_inicio,
      data_fim,
      forma_pagamento,
      valor_referencia,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ contrato: data }, { status: 201 });
}
