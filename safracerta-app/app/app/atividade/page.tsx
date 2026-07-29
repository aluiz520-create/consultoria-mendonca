import { createClient } from "@/lib/supabase/server";
import { descreverEvento, resumoEvento } from "@/lib/auditoria";

export default async function AtividadePage() {
  const supabase = createClient();

  const { data: eventos } = await supabase
    .from("auditoria_eventos")
    .select("id, tabela, acao, dados_antigos, dados_novos, created_at, users(nome)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-green-900 mb-1">Atividade</h1>
      <p className="text-sm text-gray-500 mb-6">
        Histórico de criações, alterações e exclusões — quem fez o quê e quando.
      </p>

      <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5 max-w-2xl">
        {!eventos?.length && <p className="p-5 text-sm text-gray-500">Nenhuma atividade registrada ainda.</p>}
        {eventos?.map((e) => {
          const resumo = resumoEvento(e.dados_antigos as any, e.dados_novos as any);
          const autor = (e.users as any)?.nome ?? "Alguém";
          return (
            <div key={e.id} className="px-5 py-3 text-sm flex items-center justify-between">
              <div>
                <p className="text-green-900">
                  <span className="font-medium">{autor}</span> {descreverEvento(e.tabela, e.acao)}
                  {resumo ? <span className="text-gray-600"> — {resumo}</span> : null}
                </p>
              </div>
              <p className="text-xs text-gray-400 whitespace-nowrap ml-4">
                {new Date(e.created_at).toLocaleString("pt-BR")}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
