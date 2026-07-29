import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { custoPorHectare } from "@/lib/calculos/custoPorHectare";
import { CustoPorCategoriaChart } from "@/components/charts/CustoCharts";

function formatarReais(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function bucketDe(categoriaNome: string, centroNome: string | undefined) {
  const nome = categoriaNome.toLowerCase();
  if (nome.includes("arrendamento")) return "arrendamento" as const;
  if (nome.includes("financeir")) return "financeiras" as const;
  if (centroNome === "Administrativo") return "administrativas" as const;
  return "operacionais" as const;
}

export default async function ResultadoPage({
  searchParams,
}: {
  searchParams: { safraId?: string };
}) {
  const supabase = createClient();

  const { data: safras } = await supabase.from("safras").select("id, nome").order("nome", { ascending: false });

  if (!safras?.length) {
    return (
      <div className="bg-white rounded-2xl border border-black/5 p-10 text-center text-gray-500">
        Cadastre uma fazenda, um talhão e um plantio para ver o resultado da safra.
        <div className="mt-4">
          <Link href="/app/fazendas/nova" className="text-green-700 font-medium">
            + Nova fazenda
          </Link>
        </div>
      </div>
    );
  }

  const safraAtual = safras.find((s) => s.id === searchParams.safraId) ?? safras[0];

  const { data: plantios } = await supabase
    .from("plantios")
    .select("id, area_plantada_ha, produtividade_esperada_sc_ha, producao_colhida_sc")
    .eq("safra_id", safraAtual.id);

  const plantioIds = (plantios ?? []).map((p) => p.id);

  const [{ data: lancamentos }, { data: vendas }] = await Promise.all([
    plantioIds.length
      ? supabase
          .from("lancamentos_custo")
          .select("valor, categorias_custo(nome, centros_resultado(nome))")
          .in("plantio_id", plantioIds)
      : Promise.resolve({ data: [] as any[] }),
    plantioIds.length
      ? supabase
          .from("contratos_venda")
          .select("valor_total, frete, desconto, valor_liquido")
          .in("plantio_id", plantioIds)
          .neq("status", "cancelado")
      : Promise.resolve({ data: [] as any[] }),
  ]);

  const buckets = { operacionais: 0, administrativas: 0, arrendamento: 0, financeiras: 0 };
  for (const l of lancamentos ?? []) {
    const categoriaNome = (l.categorias_custo as any)?.nome ?? "";
    const centroNome = (l.categorias_custo as any)?.centros_resultado?.nome;
    buckets[bucketDe(categoriaNome, centroNome)] += Number(l.valor);
  }
  const custoTotal = buckets.operacionais + buckets.administrativas + buckets.arrendamento + buckets.financeiras;

  const receitaBruta = (vendas ?? []).reduce((acc, v) => acc + Number(v.valor_total), 0);
  const freteTotal = (vendas ?? []).reduce((acc, v) => acc + Number(v.frete), 0);
  const descontoTotal = (vendas ?? []).reduce((acc, v) => acc + Number(v.desconto), 0);
  const receitaLiquida = receitaBruta - freteTotal - descontoTotal;

  const lucroBruto = receitaLiquida - buckets.operacionais;
  const lucroLiquido = lucroBruto - buckets.administrativas - buckets.arrendamento - buckets.financeiras;

  const areaTotal = (plantios ?? []).reduce((acc, p) => acc + Number(p.area_plantada_ha), 0);
  let temEstimativa = false;
  const producaoTotal = (plantios ?? []).reduce((acc, p) => {
    if (p.producao_colhida_sc != null) return acc + Number(p.producao_colhida_sc);
    if (p.produtividade_esperada_sc_ha) {
      temEstimativa = true;
      return acc + Number(p.area_plantada_ha) * Number(p.produtividade_esperada_sc_ha);
    }
    return acc;
  }, 0);

  const porBucket = [
    { categoria: "Operacional", valor: buckets.operacionais },
    { categoria: "Administrativo", valor: buckets.administrativas },
    { categoria: "Arrendamento", valor: buckets.arrendamento },
    { categoria: "Financeiras", valor: buckets.financeiras },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-green-900">Resultado (DRE)</h1>
          <p className="text-sm text-gray-500">Safra {safraAtual.nome} — todas as fazendas e plantios</p>
        </div>
        <form className="flex items-center gap-2">
          <select
            name="safraId"
            defaultValue={safraAtual.id}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            {safras.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nome}
              </option>
            ))}
          </select>
          <button type="submit" className="text-sm text-green-700 font-medium">
            Ver
          </button>
        </form>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-black/5 p-5">
          <h3 className="text-sm font-semibold text-green-900 mb-3">Demonstração de Resultado</h3>
          <dl className="text-sm divide-y divide-black/5">
            <div className="flex justify-between py-1.5">
              <dt className="text-gray-600">Receita bruta de vendas</dt>
              <dd className="font-medium">{formatarReais(receitaBruta)}</dd>
            </div>
            <div className="flex justify-between py-1.5">
              <dt className="text-gray-600">(-) Frete</dt>
              <dd>{formatarReais(freteTotal)}</dd>
            </div>
            <div className="flex justify-between py-1.5">
              <dt className="text-gray-600">(-) Desconto</dt>
              <dd>{formatarReais(descontoTotal)}</dd>
            </div>
            <div className="flex justify-between py-1.5 font-medium text-green-900">
              <dt>Receita líquida</dt>
              <dd>{formatarReais(receitaLiquida)}</dd>
            </div>
            <div className="flex justify-between py-1.5">
              <dt className="text-gray-600">(-) Custos operacionais (produção + máquinas)</dt>
              <dd>{formatarReais(buckets.operacionais)}</dd>
            </div>
            <div
              className={`flex justify-between py-1.5 font-medium ${
                lucroBruto < 0 ? "text-red-600" : "text-green-900"
              }`}
            >
              <dt>Lucro bruto</dt>
              <dd>{formatarReais(lucroBruto)}</dd>
            </div>
            <div className="flex justify-between py-1.5">
              <dt className="text-gray-600">(-) Despesas administrativas</dt>
              <dd>{formatarReais(buckets.administrativas)}</dd>
            </div>
            <div className="flex justify-between py-1.5">
              <dt className="text-gray-600">(-) Arrendamento</dt>
              <dd>{formatarReais(buckets.arrendamento)}</dd>
            </div>
            <div className="flex justify-between py-1.5">
              <dt className="text-gray-600">(-) Despesas financeiras</dt>
              <dd>{formatarReais(buckets.financeiras)}</dd>
            </div>
            <div
              className={`flex justify-between py-2 font-semibold text-base ${
                lucroLiquido < 0 ? "text-red-600" : "text-green-900"
              }`}
            >
              <dt>Lucro líquido</dt>
              <dd>{formatarReais(lucroLiquido)}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 p-5">
          <h3 className="text-sm font-semibold text-green-900 mb-2">Custos por natureza</h3>
          <CustoPorCategoriaChart data={porBucket} />
        </div>
      </div>

      <h3 className="text-sm font-semibold text-green-900 mb-3">Indicadores</h3>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-black/5 p-4">
          <p className="text-xs text-gray-500">Área total</p>
          <p className="text-lg font-semibold text-green-900">{areaTotal.toFixed(1)} ha</p>
        </div>
        <div className="bg-white rounded-2xl border border-black/5 p-4">
          <p className="text-xs text-gray-500">Produção total</p>
          <p className="text-lg font-semibold text-green-900">{producaoTotal.toFixed(1)} sc</p>
          {temEstimativa && <p className="text-xs text-gray-400 mt-0.5">inclui estimativa</p>}
        </div>
        <div className="bg-white rounded-2xl border border-black/5 p-4">
          <p className="text-xs text-gray-500">Custo total</p>
          <p className="text-lg font-semibold text-green-900">{formatarReais(custoTotal)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-black/5 p-4">
          <p className="text-xs text-gray-500">Receita líquida / ha</p>
          <p className="text-lg font-semibold text-green-900">{formatarReais(custoPorHectare(receitaLiquida, areaTotal))}</p>
        </div>
        <div className="bg-white rounded-2xl border border-black/5 p-4">
          <p className="text-xs text-gray-500">Custo total / ha</p>
          <p className="text-lg font-semibold text-green-900">{formatarReais(custoPorHectare(custoTotal, areaTotal))}</p>
        </div>
        <div className="bg-white rounded-2xl border border-black/5 p-4">
          <p className="text-xs text-gray-500">Lucro líquido / ha</p>
          <p className={`text-lg font-semibold ${lucroLiquido < 0 ? "text-red-600" : "text-green-900"}`}>
            {formatarReais(custoPorHectare(lucroLiquido, areaTotal))}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-black/5 p-4">
          <p className="text-xs text-gray-500">Receita líquida / saca</p>
          <p className="text-lg font-semibold text-green-900">
            {producaoTotal ? formatarReais(custoPorHectare(receitaLiquida, producaoTotal)) : "—"}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-black/5 p-4">
          <p className="text-xs text-gray-500">Custo total / saca</p>
          <p className="text-lg font-semibold text-green-900">
            {producaoTotal ? formatarReais(custoPorHectare(custoTotal, producaoTotal)) : "—"}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-black/5 p-4">
          <p className="text-xs text-gray-500">Lucro líquido / saca</p>
          <p className={`text-lg font-semibold ${lucroLiquido < 0 ? "text-red-600" : "text-green-900"}`}>
            {producaoTotal ? formatarReais(custoPorHectare(lucroLiquido, producaoTotal)) : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
