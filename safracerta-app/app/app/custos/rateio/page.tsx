import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NovoRateioForm } from "./novo-rateio-form";

function formatarReais(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function RateioDespesasPage() {
  const supabase = createClient();

  const [{ data: categorias }, { data: safras }, { data: despesas }] = await Promise.all([
    supabase.from("categorias_custo").select("id, nome").order("nome"),
    supabase
      .from("safras")
      .select("id, cultura, ano, fazendas(nome)")
      .order("created_at", { ascending: false }),
    supabase
      .from("despesas_rateadas")
      .select("id, descricao, valor_total, data, categorias_custo(nome), lancamentos_custo(id, valor, safras(cultura, ano, fazendas(nome)))")
      .order("data", { ascending: false })
      .limit(20),
  ]);

  const safrasOpcoes = (safras ?? []).map((s) => ({
    id: s.id,
    label: `${(s.fazendas as any)?.nome ?? "Fazenda"} — ${s.cultura} ${s.ano}`,
  }));

  if (safrasOpcoes.length < 2) {
    return (
      <div className="bg-white rounded-2xl border border-black/5 p-10 text-center text-gray-500 max-w-2xl">
        Cadastre pelo menos duas safras (podem ser de fazendas diferentes) em{" "}
        <Link href="/app/fazendas" className="text-green-700 font-medium">
          Fazendas
        </Link>{" "}
        para conseguir ratear uma despesa entre elas.
      </div>
    );
  }

  return (
    <div>
      <Link href="/app/custos" className="text-sm text-green-700">
        ← Custos
      </Link>
      <h1 className="text-2xl font-semibold text-green-900 mt-2">Ratear despesa entre safras</h1>
      <p className="text-sm text-gray-500 mb-6">
        Para uma compra que atende mais de uma fazenda ou safra ao mesmo tempo (ex: insumo, frete,
        maquinário compartilhado) — o valor é dividido automaticamente por percentual.
      </p>

      <div className="mb-8">
        <NovoRateioForm categorias={categorias ?? []} safras={safrasOpcoes} />
      </div>

      <h2 className="text-lg font-semibold text-green-900 mb-3">Últimos rateios</h2>
      <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5 max-w-2xl">
        {!despesas?.length && <p className="p-5 text-sm text-gray-500">Nenhum rateio feito ainda.</p>}
        {despesas?.map((d) => (
          <div key={d.id} className="px-5 py-4 text-sm">
            <div className="flex items-center justify-between">
              <p className="font-medium text-green-900">
                {(d.categorias_custo as any)?.nome}
                {d.descricao ? ` — ${d.descricao}` : ""}
              </p>
              <p className="font-medium">{formatarReais(Number(d.valor_total))}</p>
            </div>
            <p className="text-gray-500 mt-1">{new Date(d.data).toLocaleDateString("pt-BR")}</p>
            <ul className="mt-2 space-y-0.5 text-gray-600">
              {(d.lancamentos_custo as any[])?.map((l) => (
                <li key={l.id}>
                  {(l.safras?.fazendas as any)?.nome} — {l.safras?.cultura} {l.safras?.ano}:{" "}
                  <span className="font-medium">{formatarReais(Number(l.valor))}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
