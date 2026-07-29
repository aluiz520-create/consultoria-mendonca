import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "@/components/delete-button";
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

  const { data: talhoes } = await supabase
    .from("talhoes")
    .select("id, nome, area_ha, tipo_solo, plantios(id)")
    .eq("fazenda_id", params.fazendaId)
    .order("nome");

  return (
    <div>
      <Link href="/app/fazendas" className="text-sm text-green-700">
        ← Fazendas
      </Link>
      <div className="flex items-center justify-between mt-2">
        <h1 className="text-2xl font-semibold text-green-900">{fazenda.nome}</h1>
        <DeleteButton
          url={`/api/fazendas/${fazenda.id}`}
          confirmMessage={`Apagar a fazenda "${fazenda.nome}"? Isso também apaga todos os talhões, plantios e custos lançados nela.`}
          label="Apagar fazenda"
          redirectTo="/app/fazendas"
        />
      </div>
      <p className="text-sm text-gray-500 mb-8">
        {[fazenda.municipio, fazenda.uf].filter(Boolean).join(" · ")}
        {fazenda.area_total_ha ? ` · ${fazenda.area_total_ha} ha` : ""}
      </p>

      <h2 className="text-lg font-semibold text-green-900 mb-3">Talhões</h2>
      <p className="text-sm text-gray-500 mb-4">
        Cada talhão guarda seus próprios plantios, custos e colheita. Se não quiser dividir a fazenda,
        cadastre um único talhão representando a área toda.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        {talhoes?.map((t) => (
          <Link
            key={t.id}
            href={`/app/fazendas/${fazenda.id}/talhoes/${t.id}`}
            className="block bg-white rounded-2xl border border-black/5 p-4 hover:shadow-sm transition-shadow"
          >
            <h3 className="font-semibold text-green-900">{t.nome}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {t.area_ha ? `${t.area_ha} ha` : "Área não informada"}
              {t.tipo_solo ? ` · ${t.tipo_solo}` : ""}
            </p>
            <p className="text-xs text-green-700 mt-2">
              {(t.plantios as any[])?.length ?? 0} plantio(s) →
            </p>
          </Link>
        ))}
        {!talhoes?.length && (
          <p className="text-sm text-gray-400 italic">Nenhum talhão cadastrado ainda.</p>
        )}
      </div>

      <NovoTalhaoForm fazendaId={fazenda.id} />
    </div>
  );
}
