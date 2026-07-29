import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { custoPorHectare, custoPorSaca } from "@/lib/calculos/custoPorHectare";
import { DeleteButton } from "@/components/delete-button";
import { VoltarButton } from "@/components/voltar-button";
import { MarcarPagoButton } from "@/components/marcar-pago-button";
import { statusPagamento } from "@/lib/status-pagamento";
import { NovoLancamentoForm } from "./novo-lancamento-form";
import { RegistrarProducaoForm } from "./registrar-producao-form";

function formatarReais(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function OperacoesPage({
  searchParams,
}: {
  searchParams: { plantioId?: string };
}) {
  const supabase = createClient();
  const plantioId = searchParams.plantioId;

  if (!plantioId) {
    return (
      <div>
        <VoltarButton />
        <div className="bg-white rounded-2xl border border-black/5 p-10 text-center text-gray-500">
          Selecione uma fazenda, um talhão e um plantio em{" "}
          <Link href="/app/fazendas" className="text-green-700 font-medium">
            Fazendas
          </Link>{" "}
          para lançar operações, ou{" "}
          <Link href="/app/operacoes/rateio" className="text-green-700 font-medium">
            rateie uma despesa entre vários plantios
          </Link>
          .
        </div>
      </div>
    );
  }

  const [{ data: plantio }, { data: lancamentos }, { data: categorias }] = await Promise.all([
    supabase
      .from("plantios")
      .select(
        "id, area_plantada_ha, produtividade_esperada_sc_ha, producao_colhida_sc, umidade_colheita, culturas(nome), safras(nome), fazendas(nome), talhoes(nome)"
      )
      .eq("id", plantioId)
      .single(),
    supabase
      .from("lancamentos_custo")
      .select("id, descricao, valor, data, data_vencimento, data_pagamento, categorias_custo(nome)")
      .eq("plantio_id", plantioId)
      .order("data", { ascending: false }),
    supabase.from("categorias_custo").select("id, nome").order("nome"),
  ]);

  if (!plantio) {
    return <p className="text-gray-500">Plantio não encontrado.</p>;
  }

  const custoTotal = (lancamentos ?? []).reduce((acc, l) => acc + Number(l.valor), 0);
  const cPorHa = custoPorHectare(custoTotal, plantio.area_plantada_ha);
  const cPorSaca = plantio.producao_colhida_sc
    ? custoTotal / plantio.producao_colhida_sc
    : plantio.produtividade_esperada_sc_ha
    ? custoPorSaca(custoTotal, plantio.area_plantada_ha, plantio.produtividade_esperada_sc_ha)
    : null;
  const produtividadeRealizada = plantio.producao_colhida_sc
    ? plantio.producao_colhida_sc / plantio.area_plantada_ha
    : null;

  return (
    <div>
      <VoltarButton />
      <h1 className="text-2xl font-semibold text-green-900">
        {(plantio.culturas as any)?.nome} — {(plantio.safras as any)?.nome}
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        {(plantio.fazendas as any)?.nome}
        {(plantio.talhoes as any)?.nome ? ` · ${(plantio.talhoes as any).nome}` : ""} ·{" "}
        {plantio.area_plantada_ha} ha
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
          {plantio.producao_colhida_sc == null && plantio.produtividade_esperada_sc_ha && (
            <p className="text-xs text-gray-400 mt-0.5">estimado (produção ainda não colhida)</p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <RegistrarProducaoForm
          plantioId={plantioId}
          producaoAtual={plantio.producao_colhida_sc}
          umidadeAtual={plantio.umidade_colheita}
        />
        {plantio.produtividade_esperada_sc_ha && (
          <div className="bg-white rounded-2xl border border-black/5 p-4">
            <p className="text-xs text-gray-500">Produtividade — esperada × realizada</p>
            <p className="text-lg font-semibold text-green-900">
              {plantio.produtividade_esperada_sc_ha} sc/ha
              {produtividadeRealizada !== null && (
                <>
                  {" "}
                  →{" "}
                  <span
                    className={
                      produtividadeRealizada >= plantio.produtividade_esperada_sc_ha
                        ? "text-green-700"
                        : "text-red-600"
                    }
                  >
                    {produtividadeRealizada.toFixed(1)} sc/ha
                  </span>
                </>
              )}
            </p>
          </div>
        )}
      </div>

      <div className="mb-6">
        <NovoLancamentoForm plantioId={plantioId} categorias={categorias ?? []} />
        <Link href="/app/operacoes/rateio" className="text-sm text-green-700 font-medium mt-2 inline-block">
          Ou ratear uma despesa entre este e outros plantios →
        </Link>
      </div>

      <h2 className="text-lg font-semibold text-green-900 mb-3">Operações</h2>
      <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5">
        {!lancamentos?.length && (
          <p className="p-5 text-sm text-gray-500">Nenhuma operação lançada ainda.</p>
        )}
        {lancamentos?.map((l) => {
          const status = statusPagamento(l.data_vencimento, l.data_pagamento);
          return (
            <div key={l.id} className="flex items-center justify-between px-5 py-3 text-sm">
              <div>
                <p className="font-medium text-green-900">
                  {(l.categorias_custo as any)?.nome}
                  {l.descricao ? ` — ${l.descricao}` : ""}
                </p>
                <p className="text-gray-500">
                  {new Date(l.data).toLocaleDateString("pt-BR")}
                  {l.data_vencimento && !l.data_pagamento
                    ? ` · vencimento ${new Date(l.data_vencimento).toLocaleDateString("pt-BR")}`
                    : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.className}`}>
                  {status.label}
                </span>
                <p className="font-medium">{formatarReais(Number(l.valor))}</p>
                {!l.data_pagamento && <MarcarPagoButton id={l.id} />}
                <DeleteButton url={`/api/custos/${l.id}`} confirmMessage="Apagar esta operação?" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
