"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RegistrarProducaoForm({
  plantioId,
  producaoAtual,
  umidadeAtual,
}: {
  plantioId: string;
  producaoAtual: number | null;
  umidadeAtual: number | null;
}) {
  const router = useRouter();
  const [editando, setEditando] = useState(false);
  const [producao, setProducao] = useState(producaoAtual?.toString() ?? "");
  const [umidade, setUmidade] = useState(umidadeAtual?.toString() ?? "");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const res = await fetch(`/api/plantios/${plantioId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        producao_colhida_sc: Number(producao),
        umidade_colheita: umidade ? Number(umidade) : null,
      }),
    });

    setCarregando(false);

    if (!res.ok) {
      const { error } = await res.json();
      setErro(error ?? "Não foi possível salvar a produção colhida.");
      return;
    }

    setEditando(false);
    router.refresh();
  }

  if (!editando) {
    return (
      <div className="bg-white rounded-2xl border border-black/5 p-4">
        <p className="text-xs text-gray-500">Produção colhida</p>
        {producaoAtual != null ? (
          <>
            <p className="text-lg font-semibold text-green-900">{producaoAtual} sc</p>
            {umidadeAtual != null && <p className="text-xs text-gray-500">Umidade: {umidadeAtual}%</p>}
          </>
        ) : (
          <p className="text-sm text-gray-400">Ainda não colhida</p>
        )}
        <button onClick={() => setEditando(true)} className="text-xs text-green-700 font-medium mt-1">
          {producaoAtual != null ? "Editar" : "+ Registrar colheita"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-black/5 p-4 space-y-3">
      <p className="text-xs text-gray-500">Produção colhida</p>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium mb-1">Sacas colhidas</label>
          <input
            required
            type="number"
            step="0.01"
            value={producao}
            onChange={(e) => setProducao(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Umidade (%)</label>
          <input
            type="number"
            step="0.1"
            value={umidade}
            onChange={(e) => setUmidade(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
          />
        </div>
      </div>

      {erro && <p className="text-xs text-red-600">{erro}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={carregando}
          className="rounded-lg bg-green-600 text-white text-xs font-medium px-3 py-1.5 hover:bg-green-700 disabled:opacity-60"
        >
          {carregando ? "Salvando..." : "Salvar"}
        </button>
        <button
          type="button"
          onClick={() => setEditando(false)}
          className="rounded-lg px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
