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
  const { nome } = body as { nome: string };

  if (!nome) return NextResponse.json({ error: "Informe o nome da cultura." }, { status: 400 });

  const nomeLower = nome.trim().toUpperCase();

  // Verifica se cultura já existe
  const { data: culturaExistente } = await supabase
    .from("culturas")
    .select("id, nome")
    .eq("account_id", perfil.account_id)
    .ilike("nome", nomeLower)
    .single();

  if (culturaExistente) {
    return NextResponse.json({ cultura: culturaExistente }, { status: 200 });
  }

  const { data, error } = await supabase
    .from("culturas")
    .insert({ account_id: perfil.account_id, nome: nomeLower })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ cultura: data }, { status: 201 });
}
