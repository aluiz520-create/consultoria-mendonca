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

  const { nome, documento, telefone } = (await request.json()) as {
    nome: string;
    documento?: string;
    telefone?: string;
  };

  if (!nome) return NextResponse.json({ error: "Informe o nome do cliente." }, { status: 400 });

  const { data: cliente, error } = await supabase
    .from("clientes")
    .insert({ account_id: perfil.account_id, nome, documento, telefone })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ cliente }, { status: 201 });
}
