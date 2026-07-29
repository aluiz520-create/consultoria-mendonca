import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { VoltarButton } from "@/components/voltar-button";
import { labelCategoria, labelUnidade, calcularSaldos } from "@/lib/estoque";
import { NovoProdutoForm } from "./novo-produto-form";

export default async function EstoquePage() {
  const supabase = createClient();

  const [{ data: produtos }, { data: movimentacoes }] = await Promise.all([
    supabase.from("produtos_estoque").select("id, nome, categoria, unidade_medida").order("nome"),
    supabase.from("estoque_movimentacoes").select("produto_id, tipo, quantidade"),
  ]);

  const saldos = calcularSaldos(movimentacoes ?? []);

  return (
    <div>
      <VoltarButton />
      <h1 className="text-2xl font-semibold text-green-900 mb-1">Estoque</h1>
      <p className="text-sm text-gray-500 mb-6">
        Todo produto entra primeiro no estoque. O saldo é calculado automaticamente pelas entradas e
        saídas — a saída nunca pode passar do que existe em estoque.
      </p>

      <div className="mb-6">
        <NovoProdutoForm />
      </div>

      <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5 max-w-2xl">
        {!produtos?.length && <p className="p-5 text-sm text-gray-500">Nenhum produto cadastrado ainda.</p>}
        {produtos?.map((p) => {
          const saldo = saldos.get(p.id) ?? 0;
          return (
            <Link
              key={p.id}
              href={`/app/estoque/${p.id}`}
              className="flex items-center justify-between px-5 py-3 text-sm hover:bg-gray-50"
            >
              <div>
                <p className="font-medium text-green-900">{p.nome}</p>
                <p className="text-gray-500">{labelCategoria(p.categoria)}</p>
              </div>
              <p className={`font-medium ${saldo <= 0 ? "text-red-600" : "text-green-900"}`}>
                {saldo} {labelUnidade(p.unidade_medida)}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
