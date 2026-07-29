import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function calcularSaldo(supabase: ReturnType<typeof createClient>, produtoId: string) {
  const { data } = await supabase.from("estoque_movimentacoes").select("tipo, quantidade").eq("produto_id", produtoId);

  return (data ?? []).reduce(
    (acc, m) => acc + (m.tipo === "entrada" ? Number(m.quantidade) : -Number(m.quantidade)),
    0
  );
}

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { data: perfil } = await supabase.from("users").select("account_id").eq("id", user.id).single();
  if (!perfil) return NextResponse.json({ error: "Conta não encontrada." }, { status: 400 });

  const body = await request.json();
  const { produto_id, tipo, quantidade, preco_unitario, data, talhao_id, observacao } = body as {
    produto_id: string;
    tipo: "entrada" | "saida";
    quantidade: number;
    preco_unitario?: number;
    data?: string;
    talhao_id?: string;
    observacao?: string;
  };

  if (!produto_id || !tipo || !quantidade) {
    return NextResponse.json({ error: "Preencha produto, tipo e quantidade." }, { status: 400 });
  }

  if (tipo === "saida") {
    const saldoAtual = await calcularSaldo(supabase, produto_id);
    if (Number(quantidade) > saldoAtual) {
      return NextResponse.json(
        { error: `Estoque insuficiente. Saldo atual: ${saldoAtual}.` },
        { status: 400 }
      );
    }
  }

  const { data: movimentacao, error } = await supabase
    .from("estoque_movimentacoes")
    .insert({
      account_id: perfil.account_id,
      produto_id,
      tipo,
      quantidade,
      preco_unitario: tipo === "entrada" ? preco_unitario || null : null,
      data: data || new Date().toISOString().slice(0, 10),
      talhao_id: talhao_id || null,
      observacao,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ movimentacao }, { status: 201 });
}
