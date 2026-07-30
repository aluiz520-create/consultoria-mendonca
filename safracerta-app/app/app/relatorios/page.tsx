import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { VoltarButton } from "@/components/voltar-button";

export default async function RelatoriosPage() {
  const supabase = createClient();

  const { data: plantios } = await supabase
    .from("plantios")
    .select(
      "id, area_plantada_ha, culturas(nome), safras(nome), fazendas(nome), talhoes(nome)"
    )
    .order("created_at", { ascending: false });

  return (
    <div>
      <VoltarButton />
      <h1 className="text-2xl font-semibold text-green-900 mb-1">Relatórios</h1>
      <p className="text-sm text-gray-500 mb-8">
        Gere relatórios detalhados por plantio para visualizar e imprimir em PDF.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {!plantios?.length && (
          <div className="col-span-2 bg-white rounded-2xl border border-black/5 p-10 text-center text-gray-500">
            <p>Nenhum plantio cadastrado ainda.</p>
            <Link href="/app/fazendas" className="text-green-700 font-medium mt-2 inline-block">
              Ir para Fazendas →
            </Link>
          </div>
        )}

        {plantios?.map((plantio) => (
          <div
            key={plantio.id}
            className="bg-white rounded-2xl border border-black/5 p-5 hover:shadow-md transition"
          >
            <div className="mb-4">
              <h3 className="font-semibold text-green-900 text-lg">
                {(plantio.culturas as any)?.nome} — {(plantio.safras as any)?.nome}
              </h3>
              <p className="text-sm text-gray-500">
                {(plantio.fazendas as any)?.nome}
                {(plantio.talhoes as any)?.nome ? ` · ${(plantio.talhoes as any).nome}` : ""} ·{" "}
                {plantio.area_plantada_ha} ha
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/app/relatorios/plantio-pdf?plantioId=${plantio.id}`}
                target="_blank"
                className="flex-1 rounded-lg bg-green-600 text-white text-sm font-medium px-4 py-2 hover:bg-green-700 text-center"
              >
                Visualizar Relatório
              </Link>
              <button
                onClick={() => {
                  const url = `/app/relatorios/plantio-pdf?plantioId=${plantio.id}`;
                  window.open(url, "_blank");
                  setTimeout(() => {
                    window.print();
                  }, 500);
                }}
                className="rounded-lg bg-blue-600 text-white text-sm font-medium px-4 py-2 hover:bg-blue-700"
              >
                Imprimir/PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
