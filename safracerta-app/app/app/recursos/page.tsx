import { createClient } from "@/lib/supabase/server";
import { VoltarButton } from "@/components/voltar-button";
import { NovoFuncionarioForm } from "./novo-funcionario-form";
import { NovaMaquinaForm } from "./nova-maquina-form";
import { NovoImplementoForm } from "./novo-implemento-form";
import { FuncionarioItem } from "./funcionario-item";
import { MaquinaItem } from "./maquina-item";
import { ImplementoItem } from "./implemento-item";

export default async function RecursosPage() {
  const supabase = createClient();

  const [{ data: funcionarios }, { data: maquinas }, { data: implementos }] = await Promise.all([
    supabase.from("funcionarios").select("id, nome, funcao, custo_hora").order("nome"),
    supabase.from("maquinas").select("id, nome, tipo, custo_hora").order("nome"),
    supabase.from("implementos").select("id, nome, tipo, custo_hora").order("nome"),
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
          <FuncionarioItem key={f.id} funcionario={f} />
        ))}
      </div>
      <div className="mb-8">
        <NovoFuncionarioForm />
      </div>

      <h2 className="text-lg font-semibold text-green-900 mb-3">Máquinas</h2>
      <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5 mb-4 max-w-2xl">
        {!maquinas?.length && <p className="p-5 text-sm text-gray-500">Nenhuma máquina cadastrada ainda.</p>}
        {maquinas?.map((m) => (
          <MaquinaItem key={m.id} maquina={m} />
        ))}
      </div>
      <div className="mb-8">
        <NovaMaquinaForm />
      </div>

      <h2 className="text-lg font-semibold text-green-900 mb-3">Implementos</h2>
      <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5 mb-4 max-w-2xl">
        {!implementos?.length && <p className="p-5 text-sm text-gray-500">Nenhum implemento cadastrado ainda.</p>}
        {implementos?.map((i) => (
          <ImplementoItem key={i.id} implemento={i} />
        ))}
      </div>
      <NovoImplementoForm />
    </div>
  );
}
