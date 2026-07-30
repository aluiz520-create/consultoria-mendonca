"use client";

import { useState } from "react";
import { DeleteButton } from "@/components/delete-button";
import { EditarColheitaForm } from "./editar-colheita-form";

interface ColheitaItemProps {
  colheita: {
    id: string;
    data: string;
    peso_liquido_kg: number;
    umidade: number | null;
    sacas: number;
    armazens: { nome: string } | null;
  };
  armazens: { id: string; nome: string }[];
}

export function ColheitaItem({ colheita, armazens }: ColheitaItemProps) {
  const [editando, setEditando] = useState(false);

  if (editando) {
    return (
      <div className="px-5 py-3">
        <EditarColheitaForm
          id={colheita.id}
          data={colheita.data}
          peso_liquido_kg={colheita.peso_liquido_kg}
          umidade={colheita.umidade}
          armazem_id={colheita.armazens ? armazens.find((a) => a.nome === colheita.armazens?.nome)?.id ?? null : null}
          armazens={armazens}
          onClose={() => setEditando(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-4 py-2.5 text-sm">
      <div>
        <p className="font-medium text-green-900">
          {Number(colheita.sacas).toFixed(1)} sc — {colheita.armazens?.nome ?? "Sem armazém"}
        </p>
        <p className="text-gray-500 text-xs">
          {new Date(colheita.data).toLocaleDateString("pt-BR")}
          {colheita.umidade != null ? ` · umidade ${colheita.umidade}%` : ""} · {colheita.peso_liquido_kg} kg
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setEditando(true)}
          className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
        >
          Editar
        </button>
        <DeleteButton url={`/api/colheitas/${colheita.id}`} confirmMessage="Apagar esta carga de colheita?" />
      </div>
    </div>
  );
}
