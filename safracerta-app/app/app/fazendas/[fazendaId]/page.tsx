import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NovaSafraForm } from "./nova-safra-form";

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

  const { data: safras } = await supabase
    .from("safras")
    .select("id, cultura, ano, area_plantada_ha, produtividade_esperada_sc_ha")
    .eq("fazenda_id", params.fazendaId)
    .order("created_at", { ascending: false });

  return (
    <div>
      <Link href="/app/fazendas" className="text-sm text-green-700">
        ← Fazendas
      </Link>
      <h1 className="text-2xl font-semibold text-green-900 mt-2">{fazenda.nome}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {[fazenda.municipio, fazenda.uf].filter(Boolean).join(" · ")}
        {fazenda.area_total_ha ? ` · ${fazenda.area_total_ha} ha` : ""}
      </p>

      <h2 className="text-lg font-semibold text-green-900 mb-3">Safras</h2>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        {safras?.map((s) => (
          <Link
            key={s.id}
            href={`/app/custos?safraId=${s.id}`}
            className="block bg-white rounded-2xl border border-black/5 p-4 hover:shadow-sm transition-shadow"
          >
            <h3 className="font-semibold text-green-900">
              {s.cultura} — {s.ano}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{s.area_plantada_ha} ha plantados</p>
            {s.produtividade_esperada_sc_ha && (
              <p className="text-sm text-gray-500">{s.produtividade_esperada_sc_ha} sc/ha esperado</p>
            )}
            <p className="text-xs text-green-700 mt-2">Ver custos →</p>
          </Link>
        ))}
      </div>

      <NovaSafraForm fazendaId={fazenda.id} />
    </div>
  );
}
