"use client";

import { useState } from "react";
import { DeleteButton } from "@/components/delete-button";
import { MarcarPagoButton } from "@/components/marcar-pago-button";
import { statusPagamento } from "@/lib/status-pagamento";
import { EditarLancamentoForm } from "./editar-lancamento-form";

interface LancamentoItemProps {
  lancamento: any;
  categorias: { id: string; nome: string }[];
}

function formatarReais(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function LancamentoItem({ lancamento, categorias }: LancamentoItemProps) {
  const [editando, setEditando] = useState(false);
  const status = statusPagamento(lancamento.data_vencimento, lancamento.data_pagamento);

  if (editando) {
    return (
      <div className="px-5 py-3">
        <EditarLancamentoForm
          id={lancamento.id}
          descricao={lancamento.descricao}
          valor={lancamento.valor}
          data={lancamento.data}
          data_vencimento={lancamento.data_vencimento}
          data_pagamento={lancamento.data_pagamento}
          categoria_id={lancamento.categoria_id}
          categorias={categorias}
          onClose={() => setEditando(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-5 py-3 text-sm">
      <div>
        <p className="font-medium text-green-900">
          {lancamento.categorias_custo?.nome}
          {lancamento.descricao ? ` — ${lancamento.descricao}` : ""}
        </p>
        <p className="text-gray-500">
          {new Date(lancamento.data).toLocaleDateString("pt-BR")}
          {lancamento.centros_resultado?.nome ? ` · ${lancamento.centros_resultado.nome}` : ""}
          {lancamento.data_vencimento && !lancamento.data_pagamento
            ? ` · vencimento ${new Date(lancamento.data_vencimento).toLocaleDateString("pt-BR")}`
            : ""}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.className}`}>
          {status.label}
        </span>
        <p className="font-medium">{formatarReais(Number(lancamento.valor))}</p>
        <button
          onClick={() => setEditando(true)}
          className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
        >
          Editar
        </button>
        {!lancamento.data_pagamento && <MarcarPagoButton id={lancamento.id} />}
        <DeleteButton url={`/api/custos/${lancamento.id}`} confirmMessage="Apagar esta operação?" />
      </div>
    </div>
  );
}
