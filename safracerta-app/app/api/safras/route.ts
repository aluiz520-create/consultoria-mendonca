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
  const { nome, data_inicio, data_fim } = body as {
    nome: string;
    data_inicio?: string;
    data_fim?: string;
  };

  if (!nome) return NextResponse.json({ error: "Informe o nome da safra (ex: 2025/2026)." }, { status: 400 });

  // Verifica se safra já existe
  const { data: safraExistente } = await supabase
    .from("safras")
    .select("id, nome")
    .eq("account_id", perfil.account_id)
    .ilike("nome", nome.trim())
    .single();

  if (safraExistente) {
    return NextResponse.json({ safra: safraExistente }, { status: 200 });
  }

  const { data, error } = await supabase
    .from("safras")
    .insert({
      account_id: perfil.account_id,
      nome: nome.trim(),
      data_inicio: data_inicio || null,
      data_fim: data_fim || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ safra: data }, { status: 201 });
}
