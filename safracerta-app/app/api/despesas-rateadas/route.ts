import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RateioInput {
  plantio_id: string;
  percentual: number;
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
  const { categoria_id, descricao, valor_total, data, rateios } = body as {
    categoria_id: string;
    descricao?: string;
    valor_total: number;
    data?: string;
    rateios: RateioInput[];
  };

  if (!categoria_id || !valor_total || !rateios?.length) {
    return NextResponse.json({ error: "Preencha categoria, valor total e ao menos um plantio no rateio." }, { status: 400 });
  }

  const somaPercentuais = rateios.reduce((acc, r) => acc + Number(r.percentual), 0);
  if (Math.abs(somaPercentuais - 100) > 0.5) {
    return NextResponse.json(
      { error: `Os percentuais precisam somar 100%. Soma atual: ${somaPercentuais.toFixed(1)}%.` },
      { status: 400 }
    );
  }

  const dataLancamento = data || new Date().toISOString().slice(0, 10);

  const { data: despesa, error: erroDespesa } = await supabase
    .from("despesas_rateadas")
    .insert({
      account_id: perfil.account_id,
      categoria_id,
      descricao,
      valor_total,
      data: dataLancamento,
      created_by: user.id,
    })
    .select()
    .single();

  if (erroDespesa) return NextResponse.json({ error: erroDespesa.message }, { status: 400 });

  const lancamentos = rateios.map((r) => ({
    plantio_id: r.plantio_id,
    categoria_id,
    descricao: descricao ? `${descricao} (rateio ${r.percentual}%)` : `Rateio de despesa (${r.percentual}%)`,
    valor: Number((valor_total * (Number(r.percentual) / 100)).toFixed(2)),
    data: dataLancamento,
    created_by: user.id,
    despesa_rateada_id: despesa.id,
  }));

  const { error: erroLancamentos } = await supabase.from("lancamentos_custo").insert(lancamentos);

  if (erroLancamentos) {
    // desfaz a despesa se nao conseguiu criar os lancamentos rateados
    await supabase.from("despesas_rateadas").delete().eq("id", despesa.id);
    return NextResponse.json({ error: erroLancamentos.message }, { status: 400 });
  }

  return NextResponse.json({ despesa }, { status: 201 });
}
