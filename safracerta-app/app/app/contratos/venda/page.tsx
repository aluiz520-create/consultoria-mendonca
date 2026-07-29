import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "@/components/delete-button";
import { statusContratoVenda } from "@/lib/status-contrato-venda";
import { NovoContratoVendaForm } from "./novo-contrato-venda-form";
import { MarcarEntregueButton } from "./marcar-entregue-button";
import { RecebimentosVenda } from "./recebimentos-venda";

function formatarReais(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const UNIDADE_LABEL: Record<string, string> = { saca: "sc", tonelada: "t", kg: "kg" };

export default async function ContratosVendaPage() {
  const supabase = createClient();

  const [{ data: contratos }, { data: plantios }, { data: clientes }] = await Promise.all([
    supabase
      .from("contratos_venda")
      .select(
        "id, comprador_nome, cultura, quantidade, unidade_medida, preco_unitario, valor_total, frete, desconto, valor_liquido, forma_pagamento, data_contrato, data_entrega, status, recebimentos_venda(id, valor, data, forma_pagamento)"
      )
      .order("data_entrega", { ascending: true, nullsFirst: false }),
    supabase
      .from("plantios")
      .select("id, culturas(nome), safras(nome), fazendas(nome)")
      .order("created_at", { ascending: false }),
    supabase.from("clientes").select("id, nome").eq("ativo", true).order("nome"),
  ]);

  const plantiosOpcoes = (plantios ?? []).map((p) => ({
    id: p.id,
    cultura: (p.culturas as any)?.nome ?? "",
    label: `${(p.fazendas as any)?.nome ?? "Fazenda"} — ${(p.culturas as any)?.nome} ${(p.safras as any)?.nome}`,
  }));

  return (
    <div>
      <Link href="/app/contratos" className="text-sm text-green-700">
        ← Contratos
      </Link>
      <h1 className="text-2xl font-semibold text-green-900 mt-2">Venda de Produção</h1>
      <p className="text-sm text-gray-500 mb-6">
        Contratos de comercialização da safra — comprador, quantidade, preço e entrega.
      </p>

      <div className="mb-6">
        <NovoContratoVendaForm plantios={plantiosOpcoes} clientes={clientes ?? []} />
      </div>

      <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5">
        {!contratos?.length && (
          <p className="p-5 text-sm text-gray-500">Nenhum contrato de venda cadastrado ainda.</p>
        )}
        {contratos?.map((c) => {
          const status = statusContratoVenda(c.status, c.data_entrega);
          const temFreteOuDesconto = Number(c.frete) > 0 || Number(c.desconto) > 0;
          return (
            <div key={c.id} className="px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-green-900">
                    {c.comprador_nome}
                    {c.cultura ? ` — ${c.cultura}` : ""}
                  </p>
                  <p className="text-sm text-gray-500">
                    {c.quantidade} {UNIDADE_LABEL[c.unidade_medida] ?? c.unidade_medida} ×{" "}
                    {formatarReais(Number(c.preco_unitario))} ={" "}
                    <span className="font-medium text-green-900">{formatarReais(Number(c.valor_total))}</span>
                    {temFreteOuDesconto && (
                      <>
                        {" "}
                        (frete {formatarReais(Number(c.frete))} · desconto {formatarReais(Number(c.desconto))} ·
                        líquido{" "}
                        <span className="font-medium text-green-900">
                          {formatarReais(Number(c.valor_liquido))}
                        </span>
                        )
                      </>
                    )}
                    {c.data_entrega
                      ? ` · entrega ${new Date(c.data_entrega).toLocaleDateString("pt-BR")}`
                      : ""}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}>
                    {status.label}
                  </span>
                  {c.status === "firmado" && <MarcarEntregueButton id={c.id} />}
                  <DeleteButton
                    url={`/api/contratos-venda/${c.id}`}
                    confirmMessage={`Apagar o contrato de venda com "${c.comprador_nome}"?`}
                  />
                </div>
              </div>
              <RecebimentosVenda
                contratoVendaId={c.id}
                valorLiquido={Number(c.valor_liquido)}
                recebimentos={(c.recebimentos_venda as any) ?? []}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
