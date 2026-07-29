"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Categoria {
  id: string;
  nome: string;
}

export function NovoLancamentoForm({ plantioId, categorias }: { plantioId: string; categorias: Categoria[] }) {
  const router = useRouter();
  const [categoriaId, setCategoriaId] = useState(categorias[0]?.id ?? "");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));
  const [jaPago, setJaPago] = useState(true);
  const [dataVencimento, setDataVencimento] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const res = await fetch("/api/custos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plantio_id: plantioId,
        categoria_id: categoriaId,
        descricao,
        valor: Number(valor),
        data,
        data_pagamento: jaPago ? data : null,
        data_vencimento: jaPago ? null : dataVencimento || null,
      }),
    });

    setCarregando(false);

    if (!res.ok) {
      const { error } = await res.json();
      setErro(error ?? "Não foi possível salvar o lançamento.");
      return;
    }

    setDescricao("");
    setValor("");
    setDataVencimento("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-black/5 p-5 space-y-4">
      <h3 className="font-semibold text-green-900">Nova operação</h3>
      <div className="grid sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Categoria</label>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Descrição</label>
          <input
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: adubo NPK, 20 sacas"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Valor (R$)</label>
          <input
            required
            type="number"
            step="0.01"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Data</label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <label className="flex items-center gap-2 text-sm pb-2.5">
          <input type="checkbox" checked={jaPago} onChange={(e) => setJaPago(e.target.checked)} />
          Já foi pago (à vista)
        </label>

        {!jaPago && (
          <div>
            <label className="block text-sm font-medium mb-1">Vencimento</label>
            <input
              type="date"
              value={dataVencimento}
              onChange={(e) => setDataVencimento(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={carregando || !categoriaId}
          className="rounded-lg bg-green-600 text-white text-sm font-medium px-4 py-2 hover:bg-green-700 disabled:opacity-60"
        >
          {carregando ? "Salvando..." : "Lançar custo"}
        </button>
      </div>

      {erro && <p className="text-sm text-red-600">{erro}</p>}
    </form>
  );
}
