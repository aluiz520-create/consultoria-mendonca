import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const TIPOS_VALIDOS = new Set(["reajuste", "prorrogacao", "mudanca_valor", "mudanca_area", "outro"]);

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const body = await request.json();
  const { tipo, descricao, data_aditivo, valor_novo, data_fim_nova } = body as {
    tipo: string;
    descricao?: string;
    data_aditivo?: string;
    valor_novo?: number;
    data_fim_nova?: string;
  };

  if (!TIPOS_VALIDOS.has(tipo)) {
    return NextResponse.json({ error: "Tipo de aditivo inválido." }, { status: 400 });
  }

  const { data: contrato, error: erroContrato } = await supabase
    .from("contratos")
    .select("id, valor_referencia, data_fim")
    .eq("id", params.id)
    .single();

  if (erroContrato || !contrato) {
    return NextResponse.json({ error: "Contrato não encontrado." }, { status: 404 });
  }

  const { data: aditivo, error: erroAditivo } = await supabase
    .from("contrato_aditivos")
    .insert({
      contrato_id: params.id,
      tipo,
      descricao,
      data_aditivo: data_aditivo || new Date().toISOString().slice(0, 10),
      valor_anterior: contrato.valor_referencia,
      valor_novo: valor_novo ?? null,
      data_fim_anterior: contrato.data_fim,
      data_fim_nova: data_fim_nova || null,
      created_by: user.id,
    })
    .select()
    .single();

  if (erroAditivo) return NextResponse.json({ error: erroAditivo.message }, { status: 400 });

  const atualizacoes: Record<string, unknown> = {};
  if (valor_novo != null) atualizacoes.valor_referencia = valor_novo;
  if (data_fim_nova) atualizacoes.data_fim = data_fim_nova;

  if (Object.keys(atualizacoes).length > 0) {
    const { error: erroUpdate } = await supabase.from("contratos").update(atualizacoes).eq("id", params.id);
    if (erroUpdate) return NextResponse.json({ error: erroUpdate.message }, { status: 400 });
  }

  return NextResponse.json({ aditivo }, { status: 201 });
}
