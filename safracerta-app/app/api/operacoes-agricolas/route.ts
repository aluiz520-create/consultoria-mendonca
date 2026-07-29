import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type SupabaseClient = ReturnType<typeof createClient>;

async function saldoECustoMedio(supabase: SupabaseClient, produtoId: string) {
  const { data } = await supabase
    .from("estoque_movimentacoes")
    .select("tipo, quantidade, preco_unitario")
    .eq("produto_id", produtoId);

  let saldo = 0;
  let totalEntradaValor = 0;
  let totalEntradaQtd = 0;
  for (const m of data ?? []) {
    const qtd = Number(m.quantidade);
    if (m.tipo === "entrada") {
      saldo += qtd;
      totalEntradaQtd += qtd;
      totalEntradaValor += qtd * Number(m.preco_unitario ?? 0);
    } else {
      saldo -= qtd;
    }
  }
  return { saldo, custoMedio: totalEntradaQtd > 0 ? totalEntradaValor / totalEntradaQtd : 0 };
}

async function encontrarCategoria(supabase: SupabaseClient, accountId: string, padrao: string) {
  const { data } = await supabase
    .from("categorias_custo")
    .select("id, centro_resultado_id")
    .eq("account_id", accountId)
    .ilike("nome", `%${padrao}%`)
    .limit(1)
    .maybeSingle();
  if (data) return data;

  const { data: fallback } = await supabase
    .from("categorias_custo")
    .select("id, centro_resultado_id")
    .eq("account_id", accountId)
    .order("nome")
    .limit(1)
    .maybeSingle();
  return fallback;
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
  const {
    plantio_id,
    tipo,
    data: dataOperacao,
    area_executada_ha,
    funcionario_id,
    maquina_id,
    implemento_id,
    horas,
    observacoes,
    produtos,
  } = body as {
    plantio_id: string;
    tipo: string;
    data?: string;
    area_executada_ha?: number;
    funcionario_id?: string;
    maquina_id?: string;
    implemento_id?: string;
    horas?: number;
    observacoes?: string;
    produtos?: { produto_id: string; quantidade: number }[];
  };

  if (!plantio_id || !tipo) {
    return NextResponse.json({ error: "Selecione o plantio e o tipo de operação." }, { status: 400 });
  }

  const dataFinal = dataOperacao || new Date().toISOString().slice(0, 10);
  const produtosUsados = (produtos ?? []).filter((p) => p.produto_id && Number(p.quantidade) > 0);

  const custosPorProduto: { produto_id: string; quantidade: number; custoMedio: number }[] = [];
  for (const p of produtosUsados) {
    const { saldo, custoMedio } = await saldoECustoMedio(supabase, p.produto_id);
    if (Number(p.quantidade) > saldo) {
      return NextResponse.json(
        { error: `Estoque insuficiente para um dos produtos. Saldo atual: ${saldo}.` },
        { status: 400 }
      );
    }
    custosPorProduto.push({ produto_id: p.produto_id, quantidade: Number(p.quantidade), custoMedio });
  }

  const { data: operacao, error: erroOperacao } = await supabase
    .from("operacoes_agricolas")
    .insert({
      account_id: perfil.account_id,
      plantio_id,
      tipo,
      data: dataFinal,
      area_executada_ha: area_executada_ha || null,
      funcionario_id: funcionario_id || null,
      maquina_id: maquina_id || null,
      implemento_id: implemento_id || null,
      horas: horas || null,
      observacoes,
      created_by: user.id,
    })
    .select()
    .single();

  if (erroOperacao) return NextResponse.json({ error: erroOperacao.message }, { status: 400 });

  async function cancelar(mensagem: string) {
    await supabase.from("operacoes_agricolas").delete().eq("id", operacao.id);
    return NextResponse.json({ error: mensagem }, { status: 400 });
  }

  for (const p of custosPorProduto) {
    const { error: erroLinha } = await supabase.from("operacao_produtos").insert({
      operacao_id: operacao.id,
      produto_id: p.produto_id,
      quantidade: p.quantidade,
      preco_unitario: p.custoMedio,
    });
    if (erroLinha) return cancelar(erroLinha.message);

    const { error: erroMovimentacao } = await supabase.from("estoque_movimentacoes").insert({
      account_id: perfil.account_id,
      produto_id: p.produto_id,
      tipo: "saida",
      quantidade: p.quantidade,
      data: dataFinal,
      observacao: `Uso em operação agrícola`,
      created_by: user.id,
      operacao_id: operacao.id,
    });
    if (erroMovimentacao) return cancelar(erroMovimentacao.message);
  }

  const valorProdutos = custosPorProduto.reduce((acc, p) => acc + p.quantidade * p.custoMedio, 0);
  if (valorProdutos > 0) {
    const categoriaInsumos = await encontrarCategoria(supabase, perfil.account_id, "insumo");
    if (categoriaInsumos) {
      const { error: erroLancamento } = await supabase.from("lancamentos_custo").insert({
        plantio_id,
        categoria_id: categoriaInsumos.id,
        descricao: `Produtos usados na operação (${produtosUsados.length} item(ns))`,
        valor: valorProdutos,
        data: dataFinal,
        data_pagamento: dataFinal,
        centro_resultado_id: categoriaInsumos.centro_resultado_id,
        created_by: user.id,
        operacao_id: operacao.id,
      });
      if (erroLancamento) return cancelar(erroLancamento.message);
    }
  }

  if (funcionario_id && horas) {
    const { data: funcionario } = await supabase
      .from("funcionarios")
      .select("nome, custo_hora")
      .eq("id", funcionario_id)
      .single();
    if (funcionario?.custo_hora) {
      const categoriaMaoDeObra = await encontrarCategoria(supabase, perfil.account_id, "mão de obra");
      if (categoriaMaoDeObra) {
        const { error: erroLancamento } = await supabase.from("lancamentos_custo").insert({
          plantio_id,
          categoria_id: categoriaMaoDeObra.id,
          descricao: `Mão de obra: ${funcionario.nome} — ${horas}h`,
          valor: Number(horas) * Number(funcionario.custo_hora),
          data: dataFinal,
          data_pagamento: dataFinal,
          centro_resultado_id: categoriaMaoDeObra.centro_resultado_id,
          created_by: user.id,
          operacao_id: operacao.id,
        });
        if (erroLancamento) return cancelar(erroLancamento.message);
      }
    }
  }

  if (maquina_id && horas) {
    const { data: maquina } = await supabase
      .from("maquinas")
      .select("nome, custo_hora")
      .eq("id", maquina_id)
      .single();
    if (maquina?.custo_hora) {
      const categoriaMaquinario = await encontrarCategoria(supabase, perfil.account_id, "maquinário");
      if (categoriaMaquinario) {
        const { error: erroLancamento } = await supabase.from("lancamentos_custo").insert({
          plantio_id,
          categoria_id: categoriaMaquinario.id,
          descricao: `Maquinário: ${maquina.nome} — ${horas}h`,
          valor: Number(horas) * Number(maquina.custo_hora),
          data: dataFinal,
          data_pagamento: dataFinal,
          centro_resultado_id: categoriaMaquinario.centro_resultado_id,
          created_by: user.id,
          operacao_id: operacao.id,
        });
        if (erroLancamento) return cancelar(erroLancamento.message);
      }
    }
  }

  return NextResponse.json({ operacao }, { status: 201 });
}
