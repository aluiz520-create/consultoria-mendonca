"use client";

import { useState } from "react";
import { DeleteButton } from "@/components/delete-button";
import { EditarFuncionarioForm } from "./editar-funcionario-form";

interface FuncionarioItemProps {
  funcionario: {
    id: string;
    nome: string;
    funcao: string | null;
    custo_hora: number | null;
  };
}

function formatarReais(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function FuncionarioItem({ funcionario }: FuncionarioItemProps) {
  const [editando, setEditando] = useState(false);

  if (editando) {
    return (
      <div className="px-5 py-3">
        <EditarFuncionarioForm
          id={funcionario.id}
          nome={funcionario.nome}
          funcao={funcionario.funcao}
          custo_hora={funcionario.custo_hora}
          onClose={() => setEditando(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-5 py-3 text-sm">
      <div>
        <p className="font-medium text-green-900">{funcionario.nome}</p>
        <p className="text-gray-500">
          {funcionario.funcao ?? "—"}
          {funcionario.custo_hora ? ` · ${formatarReais(Number(funcionario.custo_hora))}/h` : ""}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setEditando(true)}
          className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
        >
          Editar
        </button>
        <DeleteButton
          url={`/api/funcionarios/${funcionario.id}`}
          confirmMessage={`Apagar o funcionário "${funcionario.nome}"?`}
        />
      </div>
    </div>
  );
}
