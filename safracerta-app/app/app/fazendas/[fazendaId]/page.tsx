import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "@/components/delete-button";
import { NovaSafraForm } from "./nova-safra-form";
import { NovoTalhaoForm } from "./novo-talhao-form";

export default async function FazendaDetalhePage({
  params,
}: {
  params: { fazendaId: string };
}) {
  const supabase = createClient();

  const { data: fazenda } = await supabase
    .from("fazendas")
    .select("id, nome, municipio, uf, area_total_ha")
    .eq("id", params.fazendaId)
    .single();

  if (!fazenda) notFound();

  const [{ data: talhoes }, { data: safras }] = await Promise.all([
    supabase
      .from("talhoes")
      .select("id, nome, area_ha, tipo_solo")
      .eq("fazenda_id", params.fazendaId)
      .order("nome"),
    supabase
      .from("safras")
      .select("id, cultura, ano, area_plantada_ha, produtividade_esperada_sc_ha, talhoes(nome)")
      .eq("fazenda_id", params.fazendaId)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div>
      <Link href="/app/fazendas" className="text-sm text-green-700">
        ← Fazendas
      </Link>
      <div className="flex items-center justify-between mt-2">
        <h1 className="text-2xl font-semibold text-green-900">{fazenda.nome}</h1>
        <DeleteButton
          url={`/api/fazendas/${fazenda.id}`}
          confirmMessage={`Apagar a fazenda "${fazenda.nome}"? Isso também apaga todos os talhões, safras e custos lançados nela.`}
          label="Apagar fazenda"
          redirectTo="/app/fazendas"
        />
      </div>
      <p className="text-sm text-gray-500 mb-6">
        {[fazenda.municipio, fazenda.uf].filter(Boolean).join(" · ")}
        {fazenda.area_total_ha ? ` · ${fazenda.area_total_ha} ha` : ""}
      </p>

      <h2 className="text-lg font-semibold text-green-900 mb-3">Talhões</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-4">
        {talhoes?.map((t) => (
          <div key={t.id} className="relative bg-white rounded-2xl border border-black/5 p-4">
            <div className="absolute top-3 right-3">
              <DeleteButton
                url={`/api/talhoes/${t.id}`}
                confirmMessage={`Apagar o talhão "${t.nome}"? Safras já lançadas nele ficam sem talhão associado.`}
              />
            </div>
            <h3 className="font-semibold text-green-900 pr-14">{t.nome}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {t.area_ha ? `${t.area_ha} ha` : "Área não informada"}
              {t.tipo_solo ? ` · ${t.tipo_solo}` : ""}
            </p>
          </div>
        ))}
      </div>
      <div className="mb-6">
        <NovoTalhaoForm fazendaId={fazenda.id} />
      </div>

      <h2 className="text-lg font-semibold text-green-900 mb-3">Safras</h2>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        {safras?.map((s) => (
          <div
            key={s.id}
            className="relative block bg-white rounded-2xl border border-black/5 p-4 hover:shadow-sm transition-shadow"
          >
            <div className="absolute top-3 right-3">
              <DeleteButton
                url={`/api/safras/${s.id}`}
                confirmMessage={`Apagar a safra "${s.cultura} — ${s.ano}"? Isso também apaga os custos lançados nela.`}
              />
            </div>
            <Link href={`/app/custos?safraId=${s.id}`} className="block pr-14">
              <h3 className="font-semibold text-green-900">
                {s.cultura} — {s.ano}
              </h3>
              {(s.talhoes as any)?.nome && (
                <p className="text-xs text-green-700 mt-0.5">{(s.talhoes as any).nome}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">{s.area_plantada_ha} ha plantados</p>
              {s.produtividade_esperada_sc_ha && (
                <p className="text-sm text-gray-500">{s.produtividade_esperada_sc_ha} sc/ha esperado</p>
              )}
              <p className="text-xs text-green-700 mt-2">Ver custos →</p>
            </Link>
          </div>
        ))}
      </div>

      <NovaSafraForm fazendaId={fazenda.id} talhoes={talhoes ?? []} />
    </div>
  );
}
