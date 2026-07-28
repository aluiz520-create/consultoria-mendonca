import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { custoPorHectare, custoPorSaca } from "@/lib/calculos/custoPorHectare";
import { calcularBreakEven } from "@/lib/calculos/breakEven";
import {
  CustoPorCategoriaChart,
  EvolucaoMensalChart,
  ComparativoFazendasChart,
} from "@/components/charts/CustoCharts";

function formatarReais(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { safraId?: string };
}) {
  const supabase = createClient();

  const { data: safras } = await supabase
    .from("safras")
    .select("id, cultura, ano, area_plantada_ha, produtividade_esperada_sc_ha, preco_referencia_sc, fazenda_id, fazendas(nome)")
    .order("created_at", { ascending: false });

  if (!safras?.length) {
    return (
      <div className="bg-white rounded-2xl border border-black/5 p-10 text-center text-gray-500">
        Cadastre uma fazenda e uma safra para ver o seu dashboard.
        <div className="mt-4">
          <Link href="/app/fazendas/nova" className="text-green-700 font-medium">
            + Nova fazenda
          </Link>
        </div>
      </div>
    );
  }

  const safraAtual = safras.find((s) => s.id === searchParams.safraId) ?? safras[0];

  const { data: lancamentos } = await supabase
    .from("lancamentos_custo")
    .select("valor, data, categorias_custo(nome)")
    .eq("safra_id", safraAtual.id);

  const custoTotal = (lancamentos ?? []).reduce((acc, l) => acc + Number(l.valor), 0);
  const cPorHa = custoPorHectare(custoTotal, safraAtual.area_plantada_ha);
  const cPorSaca = safraAtual.produtividade_esperada_sc_ha
    ? custoPorSaca(custoTotal, safraAtual.area_plantada_ha, safraAtual.produtividade_esperada_sc_ha)
    : null;

  const breakEven =
    safraAtual.produtividade_esperada_sc_ha && safraAtual.preco_referencia_sc
      ? calcularBreakEven(
          custoTotal,
          safraAtual.area_plantada_ha,
          safraAtual.produtividade_esperada_sc_ha,
          safraAtual.preco_referencia_sc
        )
      : null;

  const porCategoria = Object.values(
    (lancamentos ?? []).reduce<Record<string, { categoria: string; valor: number }>>((acc, l) => {
      const nome = (l.categorias_custo as any)?.nome ?? "Outros";
      acc[nome] = acc[nome] ?? { categoria: nome, valor: 0 };
      acc[nome].valor += Number(l.valor);
      return acc;
    }, {})
  );

  const porMes = Object.values(
    (lancamentos ?? []).reduce<Record<string, { mes: string; valor: number }>>((acc, l) => {
      const mes = new Date(l.data).toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
      acc[mes] = acc[mes] ?? { mes, valor: 0 };
      acc[mes].valor += Number(l.valor);
      return acc;
    }, {})
  );

  const { data: todasSafras } = await supabase
    .from("safras")
    .select("fazenda_id, area_plantada_ha, fazendas(nome)");

  const comparativoFazendas = await Promise.all(
    Array.from(new Set((todasSafras ?? []).map((s) => s.fazenda_id))).map(async (fazendaId) => {
      const safrasDaFazenda = (todasSafras ?? []).filter((s) => s.fazenda_id === fazendaId);
      const areaTotal = safrasDaFazenda.reduce((acc, s) => acc + Number(s.area_plantada_ha), 0);
      const { data: safraIds } = await supabase.from("safras").select("id").eq("fazenda_id", fazendaId);
      const ids = (safraIds ?? []).map((s) => s.id);
      const { data: custosFazenda } = ids.length
        ? await supabase.from("lancamentos_custo").select("valor").in("safra_id", ids)
        : { data: [] };
      const total = (custosFazenda ?? []).reduce((acc, l) => acc + Number(l.valor), 0);
      return {
        nome: (safrasDaFazenda[0]?.fazendas as any)?.nome ?? "Fazenda",
        custoPorHa: custoPorHectare(total, areaTotal),
      };
    })
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-green-900">Dashboard</h1>
          <p className="text-sm text-gray-500">
            {(safraAtual.fazendas as any)?.nome} · {safraAtual.cultura} {safraAtual.ano}
          </p>
        </div>
        <form className="flex items-center gap-2">
          <select
            name="safraId"
            defaultValue={safraAtual.id}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            {safras.map((s) => (
              <option key={s.id} value={s.id}>
                {(s.fazendas as any)?.nome} — {s.cultura} {s.ano}
              </option>
            ))}
          </select>
          <button type="submit" className="text-sm text-green-700 font-medium">
            Ver
          </button>
        </form>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-black/5 p-4">
          <p className="text-xs text-gray-500">Custo total</p>
          <p className="text-lg font-semibold text-green-900">{formatarReais(custoTotal)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-black/5 p-4">
          <p className="text-xs text-gray-500">Custo / hectare</p>
          <p className="text-lg font-semibold text-green-900">{formatarReais(cPorHa)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-black/5 p-4">
          <p className="text-xs text-gray-500">Custo / saca</p>
          <p className="text-lg font-semibold text-green-900">
            {cPorSaca !== null ? formatarReais(cPorSaca) : "—"}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-black/5 p-4">
          <p className="text-xs text-gray-500">Margem / saca (break-even)</p>
          <p
            className={`text-lg font-semibold ${
              breakEven && breakEven.margemPorSaca < 0 ? "text-red-600" : "text-green-900"
            }`}
          >
            {breakEven ? formatarReais(breakEven.margemPorSaca) : "—"}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-2xl border border-black/5 p-5">
          <h3 className="text-sm font-semibold text-green-900 mb-2">Custo por categoria</h3>
          <CustoPorCategoriaChart data={porCategoria} />
        </div>
        <div className="bg-white rounded-2xl border border-black/5 p-5">
          <h3 className="text-sm font-semibold text-green-900 mb-2">Evolução mensal</h3>
          <EvolucaoMensalChart data={porMes} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 p-5">
        <h3 className="text-sm font-semibold text-green-900 mb-2">Custo por hectare entre fazendas</h3>
        <ComparativoFazendasChart data={comparativoFazendas} />
      </div>
    </div>
  );
}
