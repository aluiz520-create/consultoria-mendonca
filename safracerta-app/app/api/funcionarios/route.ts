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
  const { nome, funcao, custo_hora } = body as { nome: string; funcao?: string; custo_hora?: number };

  if (!nome) return NextResponse.json({ error: "Informe o nome do funcionário." }, { status: 400 });

  const { data, error } = await supabase
    .from("funcionarios")
    .insert({ account_id: perfil.account_id, nome, funcao: funcao || null, custo_hora: custo_hora || null })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ funcionario: data }, { status: 201 });
}
