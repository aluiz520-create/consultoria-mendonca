import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "@/components/delete-button";
import { VoltarButton } from "@/components/voltar-button";
import { NovoFuncionarioForm } from "./novo-funcionario-form";
import { NovaMaquinaForm } from "./nova-maquina-form";
import { NovoImplementoForm } from "./novo-implemento-form";

function formatarReais(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function RecursosPage() {
  const supabase = createClient();

  const [{ data: funcionarios }, { data: maquinas }, { data: implementos }] = await Promise.all([
    supabase.from("funcionarios").select("id, nome, funcao, custo_hora").order("nome"),
    supabase.from("maquinas").select("id, nome, tipo, custo_hora").order("nome"),
    supabase.from("implementos").select("id, nome, tipo").order("nome"),
  ]);

  return (
    <div>
      <VoltarButton />
      <h1 className="text-2xl font-semibold text-green-900 mb-1">Funcionários, Máquinas e Implementos</h1>
      <p className="text-sm text-gray-500 mb-8">
        Cadastro usado nas operações agrícolas — quem trabalhou, com qual máquina e implemento.
      </p>

      <h2 className="text-lg font-semibold text-green-900 mb-3">Funcionários</h2>
      <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5 mb-4 max-w-2xl">
        {!funcionarios?.length && <p className="p-5 text-sm text-gray-500">Nenhum funcionário cadastrado ainda.</p>}
        {funcionarios?.map((f) => (
          <div key={f.id} className="flex items-center justify-between px-5 py-3 text-sm">
            <div>
              <p className="font-medium text-green-900">{f.nome}</p>
              <p className="text-gray-500">
                {f.funcao ?? "—"}
                {f.custo_hora ? ` · ${formatarReais(Number(f.custo_hora))}/h` : ""}
              </p>
            </div>
            <DeleteButton
              url={`/api/funcionarios/${f.id}`}
              confirmMessage={`Apagar o funcionário "${f.nome}"?`}
            />
          </div>
        ))}
      </div>
      <div className="mb-8">
        <NovoFuncionarioForm />
      </div>

      <h2 className="text-lg font-semibold text-green-900 mb-3">Máquinas</h2>
      <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5 mb-4 max-w-2xl">
        {!maquinas?.length && <p className="p-5 text-sm text-gray-500">Nenhuma máquina cadastrada ainda.</p>}
        {maquinas?.map((m) => (
          <div key={m.id} className="flex items-center justify-between px-5 py-3 text-sm">
            <div>
              <p className="font-medium text-green-900">{m.nome}</p>
              <p className="text-gray-500">
                {m.tipo ?? "—"}
                {m.custo_hora ? ` · ${formatarReais(Number(m.custo_hora))}/h` : ""}
              </p>
            </div>
            <DeleteButton url={`/api/maquinas/${m.id}`} confirmMessage={`Apagar a máquina "${m.nome}"?`} />
          </div>
        ))}
      </div>
      <div className="mb-8">
        <NovaMaquinaForm />
      </div>

      <h2 className="text-lg font-semibold text-green-900 mb-3">Implementos</h2>
      <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5 mb-4 max-w-2xl">
        {!implementos?.length && <p className="p-5 text-sm text-gray-500">Nenhum implemento cadastrado ainda.</p>}
        {implementos?.map((i) => (
          <div key={i.id} className="flex items-center justify-between px-5 py-3 text-sm">
            <div>
              <p className="font-medium text-green-900">{i.nome}</p>
              {i.tipo && <p className="text-gray-500">{i.tipo}</p>}
            </div>
            <DeleteButton url={`/api/implementos/${i.id}`} confirmMessage={`Apagar o implemento "${i.nome}"?`} />
          </div>
        ))}
      </div>
      <NovoImplementoForm />
    </div>
  );
}
