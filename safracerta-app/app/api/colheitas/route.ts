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
  const { plantio_id, armazem_id, data: dataColheita, peso_liquido_kg, umidade, observacoes } = body as {
    plantio_id: string;
    armazem_id?: string;
    data?: string;
    peso_liquido_kg: number;
    umidade?: number;
    observacoes?: string;
  };

  if (!plantio_id || !peso_liquido_kg) {
    return NextResponse.json({ error: "Selecione o plantio e informe o peso líquido." }, { status: 400 });
  }

  const { data: colheita, error } = await supabase
    .from("colheitas")
    .insert({
      account_id: perfil.account_id,
      plantio_id,
      armazem_id: armazem_id || null,
      data: dataColheita || new Date().toISOString().slice(0, 10),
      peso_liquido_kg,
      umidade: umidade ?? null,
      observacoes,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ colheita }, { status: 201 });
}
