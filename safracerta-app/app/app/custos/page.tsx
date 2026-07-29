import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { custoPorHectare, custoPorSaca } from "@/lib/calculos/custoPorHectare";
import { DeleteButton } from "@/components/delete-button";
import { NovoLancamentoForm } from "./novo-lancamento-form";

function formatarReais(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function CustosPage({
  searchParams,
}: {
  searchParams: { safraId?: string };
}) {
  const supabase = createClient();
  const safraId = searchParams.safraId;

  if (!safraId) {
    return (
      <div className="bg-white rounded-2xl border border-black/5 p-10 text-center text-gray-500">
        Selecione uma fazenda e uma safra em{" "}
        <Link href="/app/fazendas" className="text-green-700 font-medium">
          Fazendas
        </Link>{" "}
        para lançar custos, ou{" "}
        <Link href="/app/custos/rateio" className="text-green-700 font-medium">
          rateie uma despesa entre várias safras
        </Link>
        .
      </div>
    );
  }

  const [{ data: safra }, { data: lancamentos }, { data: categorias }] = await Promise.all([
    supabase
      .from("safras")
      .select("id, cultura, ano, area_plantada_ha, produtividade_esperada_sc_ha, fazendas(nome)")
      .eq("id", safraId)
      .single(),
    supabase
      .from("lancamentos_custo")
      .select("id, descricao, valor, data, categorias_custo(nome)")
      .eq("safra_id", safraId)
      .order("data", { ascending: false }),
    supabase.from("categorias_custo").select("id, nome").order("nome"),
  ]);

  if (!safra) {
    return <p className="text-gray-500">Safra não encontrada.</p>;
  }

  const custoTotal = (lancamentos ?? []).reduce((acc, l) => acc + Number(l.valor), 0);
  const cPorHa = custoPorHectare(custoTotal, safra.area_plantada_ha);
  const cPorSaca = safra.produtividade_esperada_sc_ha
    ? custoPorSaca(custoTotal, safra.area_plantada_ha, safra.produtividade_esperada_sc_ha)
    : null;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-green-900">
        {safra.cultura} — {safra.ano}
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        {(safra.fazendas as any)?.nome} · {safra.area_plantada_ha} ha
      </p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-black/5 p-4">
          <p className="text-xs text-gray-500">Custo total</p>
          <p className="text-lg font-semibold text-green-900">{formatarReais(custoTotal)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-black/5 p-4">
          <p className="text-xs text-gray-500">Custo por hectare</p>
          <p className="text-lg font-semibold text-green-900">{formatarReais(cPorHa)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-black/5 p-4">
          <p className="text-xs text-gray-500">Custo por saca</p>
          <p className="text-lg font-semibold text-green-900">
            {cPorSaca !== null ? formatarReais(cPorSaca) : "—"}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <NovoLancamentoForm safraId={safraId} categorias={categorias ?? []} />
        <Link href="/app/custos/rateio" className="text-sm text-green-700 font-medium mt-2 inline-block">
          Ou ratear uma despesa entre esta e outras safras →
        </Link>
      </div>

      <h2 className="text-lg font-semibold text-green-900 mb-3">Lançamentos</h2>
      <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5">
        {!lancamentos?.length && (
          <p className="p-5 text-sm text-gray-500">Nenhum lançamento ainda.</p>
        )}
        {lancamentos?.map((l) => (
          <div key={l.id} className="flex items-center justify-between px-5 py-3 text-sm">
            <div>
              <p className="font-medium text-green-900">
                {(l.categorias_custo as any)?.nome}
                {l.descricao ? ` — ${l.descricao}` : ""}
              </p>
              <p className="text-gray-500">{new Date(l.data).toLocaleDateString("pt-BR")}</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-medium">{formatarReais(Number(l.valor))}</p>
              <DeleteButton url={`/api/custos/${l.id}`} confirmMessage="Apagar este lançamento de custo?" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
