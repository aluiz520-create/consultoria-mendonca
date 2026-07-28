import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function FazendasPage() {
  const supabase = createClient();
  const { data: fazendas } = await supabase
    .from("fazendas")
    .select("id, nome, municipio, uf, area_total_ha")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-green-900">Fazendas</h1>
          <p className="text-sm text-gray-500">Cadastre as fazendas para lançar custos e contratos.</p>
        </div>
        <Link
          href="/app/fazendas/nova"
          className="rounded-lg bg-green-600 text-white text-sm font-medium px-4 py-2 hover:bg-green-700"
        >
          + Nova fazenda
        </Link>
      </div>

      {!fazendas?.length ? (
        <div className="bg-white rounded-2xl border border-black/5 p-10 text-center text-gray-500">
          Nenhuma fazenda cadastrada ainda.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fazendas.map((f) => (
            <Link
              key={f.id}
              href={`/app/fazendas/${f.id}`}
              className="block bg-white rounded-2xl border border-black/5 p-5 hover:shadow-sm transition-shadow"
            >
              <h3 className="font-semibold text-green-900">{f.nome}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {[f.municipio, f.uf].filter(Boolean).join(" · ") || "Localização não informada"}
              </p>
              {f.area_total_ha && (
                <p className="text-sm text-gray-500 mt-1">{f.area_total_ha} ha</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
