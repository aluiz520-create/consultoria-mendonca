import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "@/components/delete-button";
import { NovaSafraForm } from "./nova-safra-form";
import { NovoTalhaoForm } from "./novo-talhao-form";

interface SafraResumo {
  id: string;
  cultura: string;
  ano: string;
  area_plantada_ha: number;
  produtividade_esperada_sc_ha: number | null;
  talhao_id: string | null;
}

function SafraCard({ safra }: { safra: SafraResumo }) {
  return (
    <div className="relative block bg-white rounded-2xl border border-black/5 p-4 hover:shadow-sm transition-shadow">
      <div className="absolute top-3 right-3">
        <DeleteButton
          url={`/api/safras/${safra.id}`}
          confirmMessage={`Apagar a safra "${safra.cultura} — ${safra.ano}"? Isso também apaga os custos lançados nela.`}
        />
      </div>
      <Link href={`/app/custos?safraId=${safra.id}`} className="block pr-14">
        <h3 className="font-semibold text-green-900">
          {safra.cultura} — {safra.ano}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{safra.area_plantada_ha} ha plantados</p>
        {safra.produtividade_esperada_sc_ha && (
          <p className="text-sm text-gray-500">{safra.produtividade_esperada_sc_ha} sc/ha esperado</p>
        )}
        <p className="text-xs text-green-700 mt-2">Ver custos →</p>
      </Link>
    </div>
  );
}

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
      .select("id, cultura, ano, area_plantada_ha, produtividade_esperada_sc_ha, talhao_id")
      .eq("fazenda_id", params.fazendaId)
      .order("created_at", { ascending: false }),
  ]);

  const safrasPorTalhao = new Map<string, SafraResumo[]>();
  const safrasSemTalhao: SafraResumo[] = [];
  for (const s of safras ?? []) {
    if (s.talhao_id) {
      const lista = safrasPorTalhao.get(s.talhao_id) ?? [];
      lista.push(s);
      safrasPorTalhao.set(s.talhao_id, lista);
    } else {
      safrasSemTalhao.push(s);
    }
  }

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
      <p className="text-sm text-gray-500 mb-8">
        {[fazenda.municipio, fazenda.uf].filter(Boolean).join(" · ")}
        {fazenda.area_total_ha ? ` · ${fazenda.area_total_ha} ha` : ""}
      </p>

      {talhoes?.map((t) => (
        <div key={t.id} className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-semibold text-green-900">{t.nome}</h2>
              <p className="text-xs text-gray-500">
                {t.area_ha ? `${t.area_ha} ha` : "Área não informada"}
                {t.tipo_solo ? ` · ${t.tipo_solo}` : ""}
              </p>
            </div>
            <DeleteButton
              url={`/api/talhoes/${t.id}`}
              confirmMessage={`Apagar o talhão "${t.nome}"? Safras já lançadas nele ficam sem talhão associado.`}
              label="Apagar talhão"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(safrasPorTalhao.get(t.id) ?? []).map((s) => (
              <SafraCard key={s.id} safra={s} />
            ))}
            {!safrasPorTalhao.get(t.id)?.length && (
              <p className="text-sm text-gray-400 italic">Nenhuma safra lançada neste talhão ainda.</p>
            )}
          </div>
        </div>
      ))}

      <div className="mb-3">
        <h2 className="text-lg font-semibold text-green-900">
          {talhoes?.length ? "Sem talhão específico" : "Safras"}
        </h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        {safrasSemTalhao.map((s) => (
          <SafraCard key={s.id} safra={s} />
        ))}
        {!safrasSemTalhao.length && !talhoes?.length && (
          <p className="text-sm text-gray-400 italic">Nenhuma safra lançada ainda.</p>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <NovaSafraForm fazendaId={fazenda.id} talhoes={talhoes ?? []} />
        <NovoTalhaoForm fazendaId={fazenda.id} />
      </div>
    </div>
  );
}
