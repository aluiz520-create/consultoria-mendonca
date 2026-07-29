import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "@/components/delete-button";
import { VoltarButton } from "@/components/voltar-button";
import { statusContrato } from "@/lib/status-contrato";
import { NovoContratoForm } from "./novo-contrato-form";

export default async function ContratosPage() {
  const supabase = createClient();

  const [{ data: contratos }, { data: fazendas }] = await Promise.all([
    supabase
      .from("contratos")
      .select("id, tipo, contraparte_nome, area_ha, data_inicio, data_fim, forma_pagamento, status, fazendas(nome)")
      .order("data_fim", { ascending: true }),
    supabase.from("fazendas").select("id, nome"),
  ]);

  return (
    <div>
      <VoltarButton />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-green-900">Contratos</h1>
          <p className="text-sm text-gray-500">Arrendamentos e parcerias, com alerta de vencimento.</p>
        </div>
      </div>

      <div className="mb-6">
        <NovoContratoForm fazendas={fazendas ?? []} />
      </div>

      <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5">
        {!contratos?.length && <p className="p-5 text-sm text-gray-500">Nenhum contrato cadastrado ainda.</p>}
        {contratos?.map((c) => {
          const status = statusContrato(c.data_fim, c.status);
          return (
            <div key={c.id} className="flex items-center justify-between px-5 py-4">
              <Link href={`/app/contratos/${c.id}`} className="flex-1">
                <p className="font-medium text-green-900">
                  {c.tipo === "arrendamento" ? "Arrendamento" : "Parceria"} — {c.contraparte_nome}
                </p>
                <p className="text-sm text-gray-500">
                  {(c.fazendas as any)?.nome ?? "Sem fazenda"}
                  {c.area_ha ? ` · ${c.area_ha} ha` : ""} ·{" "}
                  {new Date(c.data_inicio).toLocaleDateString("pt-BR")} a{" "}
                  {new Date(c.data_fim).toLocaleDateString("pt-BR")}
                </p>
              </Link>
              <div className="flex items-center gap-4">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}>
                  {status.label}
                </span>
                <DeleteButton
                  url={`/api/contratos/${c.id}`}
                  confirmMessage={`Apagar o contrato com "${c.contraparte_nome}"?`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
