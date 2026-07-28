import { createClient } from "@/lib/supabase/server";
import { NovoContratoForm } from "./novo-contrato-form";

function statusContrato(dataFim: string): { label: string; className: string } {
  const dias = Math.ceil((new Date(dataFim).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (dias < 0) return { label: "Vencido", className: "bg-red-100 text-red-700" };
  if (dias <= 30) return { label: `Vence em ${dias} dias`, className: "bg-amber-100 text-amber-700" };
  return { label: "Ativo", className: "bg-green-100 text-green-700" };
}

export default async function ContratosPage() {
  const supabase = createClient();

  const [{ data: contratos }, { data: fazendas }] = await Promise.all([
    supabase
      .from("contratos")
      .select("id, tipo, contraparte_nome, area_ha, data_inicio, data_fim, forma_pagamento, fazendas(nome)")
      .order("data_fim", { ascending: true }),
    supabase.from("fazendas").select("id, nome"),
  ]);

  return (
    <div>
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
          const status = statusContrato(c.data_fim);
          return (
            <div key={c.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-medium text-green-900">
                  {c.tipo === "arrendamento" ? "Arrendamento" : "Parceria"} — {c.contraparte_nome}
                </p>
                <p className="text-sm text-gray-500">
                  {(c.fazendas as any)?.nome ?? "Sem fazenda"}
                  {c.area_ha ? ` · ${c.area_ha} ha` : ""} ·{" "}
                  {new Date(c.data_inicio).toLocaleDateString("pt-BR")} a{" "}
                  {new Date(c.data_fim).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}>
                {status.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
