import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "@/components/delete-button";
import { NovaSafraForm } from "./nova-safra-form";

export default async function TalhaoDetalhePage({
  params,
}: {
  params: { fazendaId: string; talhaoId: string };
}) {
  const supabase = createClient();

  const { data: talhao } = await supabase
    .from("talhoes")
    .select("id, nome, area_ha, tipo_solo, fazendas(id, nome)")
    .eq("id", params.talhaoId)
    .single();

  if (!talhao) notFound();

  const { data: safras } = await supabase
    .from("safras")
    .select("id, cultura, ano, area_plantada_ha, produtividade_esperada_sc_ha, producao_colhida_sc")
    .eq("talhao_id", params.talhaoId)
    .order("created_at", { ascending: false });

  return (
    <div>
      <Link href={`/app/fazendas/${params.fazendaId}`} className="text-sm text-green-700">
        ← {(talhao.fazendas as any)?.nome ?? "Fazenda"}
      </Link>
      <div className="flex items-center justify-between mt-2">
        <h1 className="text-2xl font-semibold text-green-900">{talhao.nome}</h1>
        <DeleteButton
          url={`/api/talhoes/${talhao.id}`}
          confirmMessage={`Apagar o talhão "${talhao.nome}"? Isso também apaga as safras e custos lançados nele.`}
          label="Apagar talhão"
          redirectTo={`/app/fazendas/${params.fazendaId}`}
        />
      </div>
      <p className="text-sm text-gray-500 mb-6">
        {talhao.area_ha ? `${talhao.area_ha} ha` : "Área não informada"}
        {talhao.tipo_solo ? ` · ${talhao.tipo_solo}` : ""}
      </p>

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
              <p className="text-sm text-gray-500 mt-1">{s.area_plantada_ha} ha plantados</p>
              {s.produtividade_esperada_sc_ha && (
                <p className="text-sm text-gray-500">{s.produtividade_esperada_sc_ha} sc/ha esperado</p>
              )}
              {s.producao_colhida_sc != null && (
                <p className="text-xs text-green-700 mt-1">{s.producao_colhida_sc} sc colhidas</p>
              )}
              <p className="text-xs text-green-700 mt-2">Ver custos →</p>
            </Link>
          </div>
        ))}
        {!safras?.length && (
          <p className="text-sm text-gray-400 italic">Nenhuma safra lançada neste talhão ainda.</p>
        )}
      </div>

      <NovaSafraForm fazendaId={params.fazendaId} talhaoId={params.talhaoId} />
    </div>
  );
}
