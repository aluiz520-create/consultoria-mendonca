"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DeleteButton } from "@/components/delete-button";
import { statusRecebimentoVenda } from "@/lib/status-recebimento-venda";

interface Recebimento {
  id: string;
  valor: number;
  data: string;
  forma_pagamento: string | null;
}

function formatarReais(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function RecebimentosVenda({
  contratoVendaId,
  valorLiquido,
  recebimentos,
}: {
  contratoVendaId: string;
  valorLiquido: number;
  recebimentos: Recebimento[];
}) {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const [valor, setValor] = useState("");
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));
  const [formaPagamento, setFormaPagamento] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const valorRecebido = recebimentos.reduce((acc, r) => acc + Number(r.valor), 0);
  const saldo = valorLiquido - valorRecebido;
  const status = statusRecebimentoVenda(valorLiquido, valorRecebido);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const res = await fetch("/api/recebimentos-venda", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contrato_venda_id: contratoVendaId,
        valor: Number(valor),
        data,
        forma_pagamento: formaPagamento || null,
      }),
    });

    setCarregando(false);

    if (!res.ok) {
      const { error } = await res.json();
      setErro(error ?? "Não foi possível registrar o recebimento.");
      return;
    }

    setValor("");
    setAberto(false);
    router.refresh();
  }

  return (
    <div className="mt-2 border-t border-black/5 pt-2">
      <div className="flex items-center gap-2 text-xs">
        <span className={`font-medium px-2 py-0.5 rounded-full ${status.className}`}>{status.label}</span>
        <span className="text-gray-500">
          Recebido {formatarReais(valorRecebido)} de {formatarReais(valorLiquido)}
          {saldo > 0 ? ` · saldo ${formatarReais(saldo)}` : ""}
        </span>
        <button onClick={() => setAberto(!aberto)} className="text-green-700 font-medium">
          {aberto ? "fechar" : "+ registrar recebimento"}
        </button>
      </div>

      {!!recebimentos.length && (
        <div className="mt-1 space-y-0.5">
          {recebimentos.map((r) => (
            <div key={r.id} className="flex items-center justify-between text-xs text-gray-500">
              <span>
                {new Date(r.data).toLocaleDateString("pt-BR")} — {formatarReais(Number(r.valor))}
                {r.forma_pagamento ? ` (${r.forma_pagamento})` : ""}
              </span>
              <DeleteButton url={`/api/recebimentos-venda/${r.id}`} confirmMessage="Apagar este recebimento?" />
            </div>
          ))}
        </div>
      )}

      {aberto && (
        <form onSubmit={handleSubmit} className="mt-2 flex flex-wrap items-end gap-2">
          <div>
            <label className="block text-xs font-medium mb-1">Valor (R$)</label>
            <input
              required
              type="number"
              step="0.01"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="w-28 rounded-lg border border-gray-300 px-2 py-1.5 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Data</label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="rounded-lg border border-gray-300 px-2 py-1.5 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Forma</label>
            <input
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value)}
              placeholder="Pix, boleto..."
              className="w-28 rounded-lg border border-gray-300 px-2 py-1.5 text-xs"
            />
          </div>
          <button
            type="submit"
            disabled={carregando}
            className="rounded-lg bg-green-600 text-white text-xs font-medium px-3 py-1.5 hover:bg-green-700 disabled:opacity-60"
          >
            {carregando ? "Salvando..." : "Salvar"}
          </button>
          {erro && <p className="text-xs text-red-600 w-full">{erro}</p>}
        </form>
      )}
    </div>
  );
}
