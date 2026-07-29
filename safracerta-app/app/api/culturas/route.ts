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

  const { data, error } = await supabase
    .from("culturas")
    .insert({ account_id: perfil.account_id, nome })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ cultura: data }, { status: 201 });
}
