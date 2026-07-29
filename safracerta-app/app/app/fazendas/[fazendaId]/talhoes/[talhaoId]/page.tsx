import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "@/components/delete-button";
import { NovoPlantioForm } from "./novo-plantio-form";

export default async function TalhaoDetalhePage({
  params,
}: {
  params: { fazendaId: string; talhaoId: string };
}) {
  const supabase = createClient();

  const { data: talhao } = await supabase
    .from("talhoes")
    .select("id, nome, area_ha, tipo_solo, fazendas(id, nome, account_id)")
    .eq("id", params.talhaoId)
    .single();

  if (!talhao) notFound();

  const accountId = (talhao.fazendas as any)?.account_id;

  const [{ data: plantios }, { data: safrasCiclo }, { data: culturas }] = await Promise.all([
    supabase
      .from("plantios")
      .select(
        "id, area_plantada_ha, produtividade_esperada_sc_ha, producao_colhida_sc, culturas(nome), safras(nome)"
      )
      .eq("talhao_id", params.talhaoId)
      .order("created_at", { ascending: false }),
    supabase.from("safras").select("id, nome").eq("account_id", accountId).order("nome", { ascending: false }),
    supabase.from("culturas").select("id, nome").eq("account_id", accountId).order("nome"),
  ]);

  return (
    <div>
      <Link href={`/app/fazendas/${params.fazendaId}`} className="text-sm text-green-700">
        ← {(talhao.fazendas as any)?.nome ?? "Fazenda"}
      </Link>
      <div className="flex items-center justify-between mt-2">
        <h1 className="text-2xl font-semibold text-green-900">{talhao.nome}</h1>
        <DeleteButton
          url={`/api/talhoes/${talhao.id}`}
          confirmMessage={`Apagar o talhão "${talhao.nome}"? Isso também apaga os plantios e custos lançados nele.`}
          label="Apagar talhão"
          redirectTo={`/app/fazendas/${params.fazendaId}`}
        />
      </div>
      <p className="text-sm text-gray-500 mb-6">
        {talhao.area_ha ? `${talhao.area_ha} ha` : "Área não informada"}
        {talhao.tipo_solo ? ` · ${talhao.tipo_solo}` : ""}
      </p>

      <h2 className="text-lg font-semibold text-green-900 mb-3">Plantios</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        {plantios?.map((p) => (
          <div
            key={p.id}
            className="relative block bg-white rounded-2xl border border-black/5 p-4 hover:shadow-sm transition-shadow"
          >
            <div className="absolute top-3 right-3">
              <DeleteButton
                url={`/api/plantios/${p.id}`}
                confirmMessage={`Apagar este plantio? Isso também apaga os custos lançados nele.`}
              />
            </div>
            <Link href={`/app/operacoes?plantioId=${p.id}`} className="block pr-14">
              <h3 className="font-semibold text-green-900">
                {(p.culturas as any)?.nome} — {(p.safras as any)?.nome}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{p.area_plantada_ha} ha plantados</p>
              {p.produtividade_esperada_sc_ha && (
                <p className="text-sm text-gray-500">{p.produtividade_esperada_sc_ha} sc/ha esperado</p>
              )}
              {p.producao_colhida_sc != null && (
                <p className="text-xs text-green-700 mt-1">{p.producao_colhida_sc} sc colhidas</p>
              )}
              <p className="text-xs text-green-700 mt-2">Ver operações →</p>
            </Link>
          </div>
        ))}
        {!plantios?.length && (
          <p className="text-sm text-gray-400 italic">Nenhum plantio lançado neste talhão ainda.</p>
        )}
      </div>

      <NovoPlantioForm
        fazendaId={params.fazendaId}
        talhaoId={params.talhaoId}
        safrasCiclo={safrasCiclo ?? []}
        culturas={culturas ?? []}
      />
    </div>
  );
}
