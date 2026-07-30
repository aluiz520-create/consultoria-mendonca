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

  const [{ data: plantio }, { data: lancamentos }, { data: operacoes }, { data: colheitas }] =
    await Promise.all([
      supabase
        .from("plantios")
        .select(
          "id, area_plantada_ha, producao_colhida_sc, umidade_colheita, culturas(nome), safras(nome), fazendas(nome), talhoes(nome)"
        )
        .eq("id", plantioId)
        .single(),
      supabase
        .from("lancamentos_custo")
        .select("id, descricao, valor, data, categorias_custo(nome), centros_resultado(nome)")
        .eq("plantio_id", plantioId)
        .order("data", { ascending: false }),
      supabase
        .from("operacoes_agricolas")
        .select(
          "id, tipo, data, area_executada_ha, horas, funcionarios(nome), maquinas(nome), implementos(nome)"
        )
        .eq("plantio_id", plantioId)
        .order("data", { ascending: false }),
      supabase
        .from("colheitas")
        .select("id, data, peso_liquido_kg, umidade, sacas, armazens(nome)")
        .eq("plantio_id", plantioId)
        .order("data", { ascending: false }),
    ]);

  if (!plantio) {
    return <p className="text-gray-500 p-8">Plantio não encontrado.</p>;
  }

  const custoTotal = (lancamentos ?? []).reduce((acc, l) => acc + Number(l.valor), 0);
  const custoPorHectare = plantio.area_plantada_ha ? custoTotal / plantio.area_plantada_ha : 0;
  const custoPorSaca = plantio.producao_colhida_sc ? custoTotal / plantio.producao_colhida_sc : 0;

  const custosPorCategoria = (lancamentos ?? []).reduce(
    (acc, l) => {
      const categoria = (l.categorias_custo as any)?.nome || "Sem categoria";
      acc[categoria] = (acc[categoria] || 0) + Number(l.valor);
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <>
      <BotaoImprimir />
      <div className="max-w-4xl mx-auto p-8 bg-white">
        {/* Cabeçalho */}
      <div className="mb-8 pb-8 border-b-2 border-green-900">
        <h1 className="text-3xl font-bold text-green-900 mb-2">RELATÓRIO DE PLANTIO</h1>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p className="font-semibold text-gray-900">Fazenda</p>
            <p>{(plantio.fazendas as any)?.nome}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Talhão</p>
            <p>{(plantio.talhoes as any)?.nome || "—"}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Cultura</p>
            <p>{(plantio.culturas as any)?.nome}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Safra</p>
            <p>{(plantio.safras as any)?.nome}</p>
          </div>
        </div>
      </div>

      {/* Resumo Executivo */}
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

      {/* Colheita */}
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
                {(plantio.producao_colhida_sc! / plantio.area_plantada_ha).toFixed(1) || "—"} sc/ha
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
                <th className="p-2 text-left">Armazém</th>
              </tr>
            </thead>
            <tbody>
              {colheitas.map((c) => (
                <tr key={c.id} className="border border-gray-300">
                  <td className="p-2">{formatarData(c.data)}</td>
                  <td className="p-2 text-right">{c.peso_liquido_kg}</td>
                  <td className="p-2 text-right">{Number(c.sacas).toFixed(1)}</td>
                  <td className="p-2 text-right">{c.umidade?.toFixed(1) || "—"}%</td>
                  <td className="p-2">{(c.armazens as any)?.nome || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Custos por Categoria */}
      {lancamentos && lancamentos.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-green-900 mb-4">CUSTOS POR CATEGORIA</h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-200 border border-gray-300">
                <th className="p-2 text-left">Categoria</th>
                <th className="p-2 text-right">Quantidade</th>
                <th className="p-2 text-right">Total (R$)</th>
                <th className="p-2 text-right">% do Total</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(custosPorCategoria)
                .sort(([, a], [, b]) => b - a)
                .map(([categoria, valor]) => (
                  <tr key={categoria} className="border border-gray-300">
                    <td className="p-2">{categoria}</td>
                    <td className="p-2 text-right">
                      {(
                        lancamentos.filter(
                          (l) => (l.categorias_custo as any)?.nome === categoria
                        ).length || 0
                      )}
                    </td>
                    <td className="p-2 text-right font-semibold">{formatarReais(valor)}</td>
                    <td className="p-2 text-right text-gray-600">
                      {((valor / custoTotal) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              <tr className="bg-green-100 border border-gray-300 font-bold">
                <td colSpan={2} className="p-2">
                  TOTAL
                </td>
                <td className="p-2 text-right">{formatarReais(custoTotal)}</td>
                <td className="p-2 text-right">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Operações Agrícolas */}
      {operacoes && operacoes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-green-900 mb-4">OPERAÇÕES AGRÍCOLAS</h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-200 border border-gray-300">
                <th className="p-2 text-left">Data</th>
                <th className="p-2 text-left">Tipo</th>
                <th className="p-2 text-right">Área (ha)</th>
                <th className="p-2 text-right">Horas</th>
                <th className="p-2 text-left">Recursos</th>
              </tr>
            </thead>
            <tbody>
              {operacoes.map((o) => (
                <tr key={o.id} className="border border-gray-300">
                  <td className="p-2">{formatarData(o.data)}</td>
                  <td className="p-2">{o.tipo}</td>
                  <td className="p-2 text-right">{o.area_executada_ha || "—"}</td>
                  <td className="p-2 text-right">{o.horas || "—"}</td>
                  <td className="p-2 text-xs">
                    {(o.funcionarios as any)?.nome && (
                      <div>{(o.funcionarios as any).nome}</div>
                    )}
                    {(o.maquinas as any)?.nome && <div>{(o.maquinas as any).nome}</div>}
                    {(o.implementos as any)?.nome && (
                      <div>{(o.implementos as any).nome}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Lançamentos Detalhados */}
      {lancamentos && lancamentos.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-green-900 mb-4">DETALHAMENTO DE CUSTOS</h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-200 border border-gray-300">
                <th className="p-2 text-left">Data</th>
                <th className="p-2 text-left">Categoria</th>
                <th className="p-2 text-left">Descrição</th>
                <th className="p-2 text-left">Centro</th>
                <th className="p-2 text-right">Valor (R$)</th>
              </tr>
            </thead>
            <tbody>
              {lancamentos.map((l) => (
                <tr key={l.id} className="border border-gray-300">
                  <td className="p-2">{formatarData(l.data)}</td>
                  <td className="p-2">{(l.categorias_custo as any)?.nome}</td>
                  <td className="p-2">{l.descricao || "—"}</td>
                  <td className="p-2 text-xs">{(l.centros_resultado as any)?.nome || "—"}</td>
                  <td className="p-2 text-right font-semibold">{formatarReais(Number(l.valor))}</td>
                </tr>
              ))}
              <tr className="bg-green-100 border border-gray-300 font-bold">
                <td colSpan={4} className="p-2 text-right">
                  TOTAL
                </td>
                <td className="p-2 text-right">{formatarReais(custoTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Rodapé */}
      <div className="mt-12 pt-8 border-t-2 border-gray-300 text-xs text-gray-500 text-center">
        <p>Relatório gerado em {new Date().toLocaleDateString("pt-BR")}</p>
        <p>SafraCerta - Sistema de Gestão Agrícola</p>
      </div>

        {/* Estilos de Impressão */}
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
