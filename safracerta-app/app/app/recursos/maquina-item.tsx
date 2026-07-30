"use client";

import { useState } from "react";
import { DeleteButton } from "@/components/delete-button";
import { EditarMaquinaForm } from "./editar-maquina-form";

interface MaquinaItemProps {
  maquina: {
    id: string;
    nome: string;
    tipo: string | null;
    custo_hora: number | null;
  };
}

function formatarReais(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function MaquinaItem({ maquina }: MaquinaItemProps) {
  const [editando, setEditando] = useState(false);

  if (editando) {
    return (
      <div className="px-5 py-3">
        <EditarMaquinaForm
          id={maquina.id}
          nome={maquina.nome}
          tipo={maquina.tipo}
          custo_hora={maquina.custo_hora}
          onClose={() => setEditando(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-5 py-3 text-sm">
      <div>
        <p className="font-medium text-green-900">{maquina.nome}</p>
        <p className="text-gray-500">
          {maquina.tipo ?? "—"}
          {maquina.custo_hora ? ` · ${formatarReais(Number(maquina.custo_hora))}/h` : ""}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setEditando(true)}
          className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
        >
          Editar
        </button>
        <DeleteButton url={`/api/maquinas/${maquina.id}`} confirmMessage={`Apagar a máquina "${maquina.nome}"?`} />
      </div>
    </div>
  );
}
