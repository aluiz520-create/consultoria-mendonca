import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { statusContrato } from "@/lib/status-contrato";
import { NovoAditivoForm } from "./novo-aditivo-form";
import { EncerrarContratoButton } from "./encerrar-contrato-button";

const TIPO_LABEL: Record<string, string> = {
  reajuste: "Reajuste de valor",
  prorrogacao: "Prorrogação de prazo",
  mudanca_valor: "Mudança de valor",
  mudanca_area: "Mudança de área",
  outro: "Outro",
};

function formatarReais(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function ContratoDetalhePage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: contrato } = await supabase
    .from("contratos")
    .select(
      "id, tipo, contraparte_nome, area_ha, data_inicio, data_fim, forma_pagamento, valor_referencia, status, data_encerramento, motivo_encerramento, fazendas(nome)"
    )
    .eq("id", params.id)
    .single();

  if (!contrato) notFound();

  const { data: aditivos } = await supabase
    .from("contrato_aditivos")
    .select("id, tipo, descricao, data_aditivo, valor_anterior, valor_novo, data_fim_anterior, data_fim_nova")
    .eq("contrato_id", params.id)
    .order("data_aditivo", { ascending: false });

  const status = statusContrato(contrato.data_fim, contrato.status);

  return (
    <div>
      <Link href="/app/contratos" className="text-sm text-green-700">
        ← Contratos
      </Link>

      <div className="flex items-center justify-between mt-2">
        <h1 className="text-2xl font-semibold text-green-900">
          {contrato.tipo === "arrendamento" ? "Arrendamento" : "Parceria"} — {contrato.contraparte_nome}
        </h1>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}>{status.label}</span>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 p-5 mt-4 mb-6 grid sm:grid-cols-2 gap-4 text-sm max-w-2xl">
        <div>
          <p className="text-gray-500">Fazenda</p>
          <p className="font-medium text-green-900">{(contrato.fazendas as any)?.nome ?? "Sem fazenda"}</p>
        </div>
        <div>
          <p className="text-gray-500">Área</p>
          <p className="font-medium text-green-900">{contrato.area_ha ?? "—"} ha</p>
        </div>
        <div>
          <p className="text-gray-500">Vigência</p>
          <p className="font-medium text-green-900">
            {new Date(contrato.data_inicio).toLocaleDateString("pt-BR")} a{" "}
            {new Date(contrato.data_fim).toLocaleDateString("pt-BR")}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Valor de referência atual</p>
          <p className="font-medium text-green-900">
            {contrato.valor_referencia ? formatarReais(Number(contrato.valor_referencia)) : "—"}
            {contrato.forma_pagamento ? ` (${contrato.forma_pagamento.replaceAll("_", " ")})` : ""}
          </p>
        </div>
        {contrato.status === "encerrado" && (
          <div className="sm:col-span-2 bg-gray-50 rounded-lg p-3">
            <p className="text-gray-500">Encerrado em {new Date(contrato.data_encerramento).toLocaleDateString("pt-BR")}</p>
            <p className="text-gray-700 mt-1">{contrato.motivo_encerramento}</p>
          </div>
        )}
      </div>

      {contrato.status !== "encerrado" && (
        <div className="mb-6">
          <EncerrarContratoButton contratoId={contrato.id} />
        </div>
      )}

      <h2 className="text-lg font-semibold text-green-900 mb-3">Aditivos e reajustes</h2>

      <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5 mb-6 max-w-2xl">
        {!aditivos?.length && <p className="p-5 text-sm text-gray-500">Nenhum aditivo registrado ainda.</p>}
        {aditivos?.map((a) => (
          <div key={a.id} className="px-5 py-4 text-sm">
            <p className="font-medium text-green-900">
              {TIPO_LABEL[a.tipo] ?? a.tipo} — {new Date(a.data_aditivo).toLocaleDateString("pt-BR")}
            </p>
            {a.descricao && <p className="text-gray-600 mt-1">{a.descricao}</p>}
            <div className="text-gray-500 mt-1 space-y-0.5">
              {a.valor_novo != null && (
                <p>
                  Valor: {a.valor_anterior ? formatarReais(Number(a.valor_anterior)) : "—"} →{" "}
                  <span className="font-medium text-green-900">{formatarReais(Number(a.valor_novo))}</span>
                </p>
              )}
              {a.data_fim_nova && (
                <p>
                  Vencimento: {new Date(a.data_fim_anterior).toLocaleDateString("pt-BR")} →{" "}
                  <span className="font-medium text-green-900">
                    {new Date(a.data_fim_nova).toLocaleDateString("pt-BR")}
                  </span>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {contrato.status !== "encerrado" && <NovoAditivoForm contratoId={contrato.id} />}
    </div>
  );
}
