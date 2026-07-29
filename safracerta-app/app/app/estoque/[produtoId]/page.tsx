import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "@/components/delete-button";
import { labelCategoria, labelUnidade, calcularSaldos } from "@/lib/estoque";
import { NovaMovimentacaoForm } from "./nova-movimentacao-form";

function formatarReais(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function ProdutoEstoquePage({ params }: { params: { produtoId: string } }) {
  const supabase = createClient();

  const { data: produto } = await supabase
    .from("produtos_estoque")
    .select("id, nome, categoria, unidade_medida")
    .eq("id", params.produtoId)
    .single();

  if (!produto) notFound();

  const { data: movimentacoes } = await supabase
    .from("estoque_movimentacoes")
    .select("id, tipo, quantidade, preco_unitario, data, observacao, talhoes(nome)")
    .eq("produto_id", params.produtoId)
    .order("data", { ascending: false });

  const saldo = calcularSaldos(
    (movimentacoes ?? []).map((m) => ({ produto_id: params.produtoId, tipo: m.tipo, quantidade: m.quantidade }))
  ).get(params.produtoId) ?? 0;

  return (
    <div>
      <Link href="/app/estoque" className="text-sm text-green-700">
        ← Estoque
      </Link>
      <div className="flex items-center justify-between mt-2">
        <h1 className="text-2xl font-semibold text-green-900">{produto.nome}</h1>
        <DeleteButton
          url={`/api/produtos-estoque/${produto.id}`}
          confirmMessage={`Apagar o produto "${produto.nome}"? Isso também apaga o histórico de movimentações.`}
          label="Apagar produto"
          redirectTo="/app/estoque"
        />
      </div>
      <p className="text-sm text-gray-500 mb-6">{labelCategoria(produto.categoria)}</p>

      <div className="bg-white rounded-2xl border border-black/5 p-4 mb-6 max-w-xs">
        <p className="text-xs text-gray-500">Saldo atual</p>
        <p className={`text-2xl font-semibold ${saldo <= 0 ? "text-red-600" : "text-green-900"}`}>
          {saldo} {labelUnidade(produto.unidade_medida)}
        </p>
      </div>

      <div className="mb-8">
        <NovaMovimentacaoForm produtoId={produto.id} />
      </div>

      <h2 className="text-lg font-semibold text-green-900 mb-3">Movimentações</h2>
      <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5">
        {!movimentacoes?.length && (
          <p className="p-5 text-sm text-gray-500">Nenhuma movimentação registrada ainda.</p>
        )}
        {movimentacoes?.map((m) => (
          <div key={m.id} className="flex items-center justify-between px-5 py-3 text-sm">
            <div>
              <p className="font-medium text-green-900">
                {m.tipo === "entrada" ? "Entrada" : "Saída"}
                {m.observacao ? ` — ${m.observacao}` : ""}
              </p>
              <p className="text-gray-500">
                {new Date(m.data).toLocaleDateString("pt-BR")}
                {(m.talhoes as any)?.nome ? ` · ${(m.talhoes as any).nome}` : ""}
                {m.preco_unitario ? ` · ${formatarReais(Number(m.preco_unitario))}/un` : ""}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className={`font-medium ${m.tipo === "entrada" ? "text-green-700" : "text-red-600"}`}>
                {m.tipo === "entrada" ? "+" : "-"}
                {m.quantidade} {labelUnidade(produto.unidade_medida)}
              </p>
              <DeleteButton
                url={`/api/estoque-movimentacoes/${m.id}`}
                confirmMessage="Apagar esta movimentação?"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
