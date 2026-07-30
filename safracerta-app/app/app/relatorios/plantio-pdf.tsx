import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { BotaoImprimir } from "@/components/botao-imprimir";

function formatarReais(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarData(data: string) {
  return new Date(data).toLocaleDateString("pt-BR");
}

export default async function RelatorioPDF({
  searchParams,
}: {
  searchParams: { plantioId?: string };
}) {
  const supabase = createClient();
  const plantioId = searchParams.plantioId;

  if (!plantioId) {
    return (
      <div className="p-8">
        <Link href="/app/fazendas" className="text-green-700 font-medium">
          ← Voltar para Fazendas
        </Link>
        <div className="bg-white rounded-2xl border border-black/5 p-10 text-center text-gray-500 mt-4">
          Selecione um plantio para gerar o relatório
        </div>
      </div>
    );
  }

  const plantioResult = await supabase
    .from("plantios")
    .select("id, area_plantada_ha, producao_colhida_sc, umidade_colheita, cultura_id, safra_id, talhao_id")
    .eq("id", plantioId)
    .single();

  const plantio = plantioResult.data;

  if (!plantio) {
    return <p className="text-gray-500 p-8">Plantio não encontrado.</p>;
  }

  const [culturaRes, safraRes, talhaoRes] = await Promise.all([
    supabase.from("culturas").select("nome").eq("id", plantio.cultura_id).single(),
    supabase.from("safras").select("nome").eq("id", plantio.safra_id).single(),
    supabase.from("talhoes").select("nome, fazenda_id").eq("id", plantio.talhao_id).single(),
  ]);

  const fazendaRes = talhaoRes.data?.fazenda_id
    ? await supabase.from("fazendas").select("nome").eq("id", talhaoRes.data.fazenda_id).single()
    : null;

  const cultura = culturaRes.data;
  const safra = safraRes.data;
  const talhao = talhaoRes.data;
  const fazenda = fazendaRes?.data;

  const lancamentosRes = await supabase
    .from("lancamentos_custo")
    .select("id, descricao, valor, data")
    .eq("plantio_id", plantioId)
    .order("data", { ascending: false });

  const colheitasRes = await supabase
    .from("colheitas")
    .select("id, data, peso_liquido_kg, umidade, sacas")
    .eq("plantio_id", plantioId)
    .order("data", { ascending: false });

  const lancamentos = lancamentosRes.data ?? [];
  const colheitas = colheitasRes.data ?? [];

  const custoTotal = lancamentos.reduce((acc, l) => acc + Number(l.valor), 0);
  const custoPorHectare = plantio.area_plantada_ha ? custoTotal / plantio.area_plantada_ha : 0;
  const custoPorSaca = plantio.producao_colhida_sc ? custoTotal / plantio.producao_colhida_sc : 0;

  return (
    <>
      <BotaoImprimir />
      <div className="max-w-4xl mx-auto p-8 bg-white">
        <div className="mb-8 pb-8 border-b-2 border-green-900">
          <h1 className="text-3xl font-bold text-green-900 mb-2">RELATÓRIO DE PLANTIO</h1>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p className="font-semibold text-gray-900">Fazenda</p>
              <p>{fazenda?.nome || "—"}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Talhão</p>
              <p>{talhao?.nome || "—"}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Cultura</p>
              <p>{cultura?.nome || "—"}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Safra</p>
              <p>{safra?.nome || "—"}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-green-900 mb-4">RESUMO EXECUTIVO</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded border border-green-200">
              <p className="text-xs text-gray-600">Área (ha)</p>
              <p className="text-2xl font-bold text-green-900">{plantio.area_plantada_ha}</p>
            </div>
            <div className="bg-green-50 p-4 rounded border border-green-200">
              <p className="text-xs text-gray-600">Custo Total</p>
              <p className="text-lg font-bold text-green-900">{formatarReais(custoTotal)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded border border-green-200">
              <p className="text-xs text-gray-600">Custo/ha</p>
              <p className="text-lg font-bold text-green-900">{formatarReais(custoPorHectare)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded border border-green-200">
              <p className="text-xs text-gray-600">Custo/saca</p>
              <p className="text-lg font-bold text-green-900">{formatarReais(custoPorSaca)}</p>
            </div>
          </div>
        </div>

        {colheitas && colheitas.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-green-900 mb-4">COLHEITA</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded border border-blue-200">
                <p className="text-xs text-gray-600">Total Colhido</p>
                <p className="text-2xl font-bold text-blue-900">
                  {plantio.producao_colhida_sc?.toFixed(1) || "—"} sc
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded border border-blue-200">
                <p className="text-xs text-gray-600">Umidade Média</p>
                <p className="text-2xl font-bold text-blue-900">
                  {plantio.umidade_colheita?.toFixed(1) || "—"}%
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded border border-blue-200">
                <p className="text-xs text-gray-600">Produtividade</p>
                <p className="text-2xl font-bold text-blue-900">
                  {plantio.producao_colhida_sc && plantio.area_plantada_ha
                    ? (plantio.producao_colhida_sc / plantio.area_plantada_ha).toFixed(1)
                    : "—"} sc/ha
                </p>
              </div>
            </div>
            <table className="w-full mt-4 text-sm border-collapse">
              <thead>
                <tr className="bg-gray-200 border border-gray-300">
                  <th className="p-2 text-left">Data</th>
                  <th className="p-2 text-right">Peso (kg)</th>
                  <th className="p-2 text-right">Sacas</th>
                  <th className="p-2 text-right">Umidade</th>
                </tr>
              </thead>
              <tbody>
                {colheitas.map((c) => (
                  <tr key={c.id} className="border border-gray-300">
                    <td className="p-2">{formatarData(c.data)}</td>
                    <td className="p-2 text-right">{c.peso_liquido_kg}</td>
                    <td className="p-2 text-right">{Number(c.sacas).toFixed(1)}</td>
                    <td className="p-2 text-right">{c.umidade?.toFixed(1) || "—"}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {lancamentos && lancamentos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-green-900 mb-4">DETALHAMENTO DE CUSTOS</h2>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-200 border border-gray-300">
                  <th className="p-2 text-left">Data</th>
                  <th className="p-2 text-left">Descrição</th>
                  <th className="p-2 text-right">Valor (R$)</th>
                </tr>
              </thead>
              <tbody>
                {lancamentos.map((l) => (
                  <tr key={l.id} className="border border-gray-300">
                    <td className="p-2">{formatarData(l.data)}</td>
                    <td className="p-2">{l.descricao || "—"}</td>
                    <td className="p-2 text-right font-semibold">{formatarReais(Number(l.valor))}</td>
                  </tr>
                ))}
                <tr className="bg-green-100 border border-gray-300 font-bold">
                  <td colSpan={2} className="p-2 text-right">
                    TOTAL
                  </td>
                  <td className="p-2 text-right">{formatarReais(custoTotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-12 pt-8 border-t-2 border-gray-300 text-xs text-gray-500 text-center">
          <p>Relatório gerado em {new Date().toLocaleDateString("pt-BR")}</p>
          <p>SafraCerta - Sistema de Gestão Agrícola</p>
        </div>

        <style jsx>{`
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .no-print {
              display: none;
            }
            div {
              page-break-inside: avoid;
            }
            table {
              page-break-inside: avoid;
            }
          }
        `}</style>
      </div>
    </>
  );
}
