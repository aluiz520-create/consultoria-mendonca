import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "@/components/delete-button";
import { VoltarButton } from "@/components/voltar-button";
import { NovaCompraForm } from "./nova-compra-form";

function formatarReais(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function ComprasPage() {
  const supabase = createClient();

  const [{ data: produtos }, { data: plantios }, { data: categorias }, { data: compras }] = await Promise.all([
    supabase.from("produtos_estoque").select("id, nome").order("nome"),
    supabase
      .from("plantios")
      .select("id, culturas(nome), safras(nome), fazendas(nome)")
      .order("created_at", { ascending: false }),
    supabase.from("categorias_custo").select("id, nome").order("nome"),
    supabase
      .from("compras")
      .select(
        "id, fornecedor_nome, quantidade, preco_unitario, valor_total, data_compra, produtos_estoque(nome, unidade_medida), plantios(culturas(nome), safras(nome), fazendas(nome))"
      )
      .order("data_compra", { ascending: false })
      .limit(30),
  ]);

  const plantiosOpcoes = (plantios ?? []).map((p) => ({
    id: p.id,
    label: `${(p.fazendas as any)?.nome ?? "Fazenda"} — ${(p.culturas as any)?.nome} ${(p.safras as any)?.nome}`,
  }));

  if (!plantiosOpcoes.length) {
    return (
      <div>
        <VoltarButton />
        <div className="bg-white rounded-2xl border border-black/5 p-10 text-center text-gray-500 max-w-2xl">
          Cadastre uma fazenda, um talhão e um plantio em{" "}
          <Link href="/app/fazendas" className="text-green-700 font-medium">
            Fazendas
          </Link>{" "}
          antes de registrar uma compra.
        </div>
      </div>
    );
  }

  return (
    <div>
      <VoltarButton />
      <h1 className="text-2xl font-semibold text-green-900 mb-1">Compras</h1>
      <p className="text-sm text-gray-500 mb-6">
        Toda compra gera automaticamente a entrada no estoque e a conta a pagar — um só lançamento.
      </p>

      <div className="mb-8">
        <NovaCompraForm produtos={produtos ?? []} plantios={plantiosOpcoes} categorias={categorias ?? []} />
      </div>

      <h2 className="text-lg font-semibold text-green-900 mb-3">Últimas compras</h2>
      <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5 max-w-3xl">
        {!compras?.length && <p className="p-5 text-sm text-gray-500">Nenhuma compra registrada ainda.</p>}
        {compras?.map((c) => (
          <div key={c.id} className="flex items-center justify-between px-5 py-3 text-sm">
            <div>
              <p className="font-medium text-green-900">
                {(c.produtos_estoque as any)?.nome} — {c.fornecedor_nome}
              </p>
              <p className="text-gray-500">
                {(c.plantios as any)?.fazendas?.nome} · {(c.plantios as any)?.culturas?.nome}{" "}
                {(c.plantios as any)?.safras?.nome} · {new Date(c.data_compra).toLocaleDateString("pt-BR")}
              </p>
              <p className="text-gray-500">
                {c.quantidade} {(c.produtos_estoque as any)?.unidade_medida} ×{" "}
                {formatarReais(Number(c.preco_unitario))}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-medium">{formatarReais(Number(c.valor_total))}</p>
              <DeleteButton
                url={`/api/compras/${c.id}`}
                confirmMessage="Apagar esta compra? Isso também desfaz a entrada no estoque e a conta a pagar geradas por ela."
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
