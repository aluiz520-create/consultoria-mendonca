import { createClient } from "@/lib/supabase/server";
import { MarcarPagoButton } from "@/components/marcar-pago-button";
import { statusPagamento } from "@/lib/status-pagamento";
import { VoltarButton } from "@/components/voltar-button";

function formatarReais(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function FinanceiroPage() {
  const supabase = createClient();

  const [{ data: emAberto }, { data: pagosRecentes }] = await Promise.all([
    supabase
      .from("lancamentos_custo")
      .select(
        "id, descricao, valor, data, data_vencimento, categorias_custo(nome), plantios(culturas(nome), safras(nome), fazendas(nome))"
      )
      .is("data_pagamento", null)
      .order("data_vencimento", { ascending: true, nullsFirst: false }),
    supabase
      .from("lancamentos_custo")
      .select(
        "id, descricao, valor, data_pagamento, categorias_custo(nome), plantios(culturas(nome), safras(nome), fazendas(nome))"
      )
      .not("data_pagamento", "is", null)
      .order("data_pagamento", { ascending: false })
      .limit(15),
  ]);

  const totalEmAberto = (emAberto ?? []).reduce((acc, l) => acc + Number(l.valor), 0);
  const totalVencido = (emAberto ?? [])
    .filter((l) => l.data_vencimento && new Date(l.data_vencimento) < new Date())
    .reduce((acc, l) => acc + Number(l.valor), 0);

  return (
    <div>
      <VoltarButton />
      <h1 className="text-2xl font-semibold text-green-900 mb-1">Financeiro</h1>
      <p className="text-sm text-gray-500 mb-6">Controle de fluxo de pagamento das despesas lançadas.</p>

      <div className="grid grid-cols-2 gap-4 mb-6 max-w-md">
        <div className="bg-white rounded-2xl border border-black/5 p-4">
          <p className="text-xs text-gray-500">Total em aberto</p>
          <p className="text-lg font-semibold text-green-900">{formatarReais(totalEmAberto)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-black/5 p-4">
          <p className="text-xs text-gray-500">Vencido</p>
          <p className={`text-lg font-semibold ${totalVencido > 0 ? "text-red-600" : "text-green-900"}`}>
            {formatarReais(totalVencido)}
          </p>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-green-900 mb-3">Em aberto</h2>
      <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5 mb-8 max-w-3xl">
        {!emAberto?.length && <p className="p-5 text-sm text-gray-500">Nada em aberto — tudo pago.</p>}
        {emAberto?.map((l) => {
          const status = statusPagamento(l.data_vencimento, null);
          return (
            <div key={l.id} className="flex items-center justify-between px-5 py-3 text-sm">
              <div>
                <p className="font-medium text-green-900">
                  {(l.categorias_custo as any)?.nome}
                  {l.descricao ? ` — ${l.descricao}` : ""}
                </p>
                <p className="text-gray-500">
                  {(l.plantios as any)?.fazendas?.nome} · {(l.plantios as any)?.culturas?.nome}{" "}
                  {(l.plantios as any)?.safras?.nome}
                  {l.data_vencimento ? ` · vencimento ${new Date(l.data_vencimento).toLocaleDateString("pt-BR")}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.className}`}>
                  {status.label}
                </span>
                <p className="font-medium">{formatarReais(Number(l.valor))}</p>
                <MarcarPagoButton id={l.id} />
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="text-lg font-semibold text-green-900 mb-3">Pagos recentemente</h2>
      <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5 max-w-3xl">
        {!pagosRecentes?.length && <p className="p-5 text-sm text-gray-500">Nenhum pagamento registrado ainda.</p>}
        {pagosRecentes?.map((l) => (
          <div key={l.id} className="flex items-center justify-between px-5 py-3 text-sm">
            <div>
              <p className="font-medium text-green-900">
                {(l.categorias_custo as any)?.nome}
                {l.descricao ? ` — ${l.descricao}` : ""}
              </p>
              <p className="text-gray-500">
                {(l.plantios as any)?.fazendas?.nome} · pago em{" "}
                {new Date(l.data_pagamento).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <p className="font-medium">{formatarReais(Number(l.valor))}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
