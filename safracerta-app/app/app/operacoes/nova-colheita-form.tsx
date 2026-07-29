"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Armazem {
  id: string;
  nome: string;
}

export function NovaColheitaForm({ plantioId, armazens }: { plantioId: string; armazens: Armazem[] }) {
  const router = useRouter();
  const [armazemId, setArmazemId] = useState(armazens[0]?.id ?? "");
  const [criandoArmazem, setCriandoArmazem] = useState(armazens.length === 0);
  const [novoArmazemNome, setNovoArmazemNome] = useState("");
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));
  const [pesoLiquido, setPesoLiquido] = useState("");
  const [umidade, setUmidade] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const sacas = pesoLiquido ? (Number(pesoLiquido) / 60).toFixed(1) : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    let armazemIdFinal = armazemId || null;

    if (criandoArmazem && novoArmazemNome) {
      const res = await fetch("/api/armazens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: novoArmazemNome }),
      });
      if (!res.ok) {
        setCarregando(false);
        const { error } = await res.json();
        setErro(error ?? "Não foi possível criar o armazém.");
        return;
      }
      const { armazem } = await res.json();
      armazemIdFinal = armazem.id;
    }

    const res = await fetch("/api/colheitas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plantio_id: plantioId,
        armazem_id: armazemIdFinal,
        data,
        peso_liquido_kg: Number(pesoLiquido),
        umidade: umidade ? Number(umidade) : null,
        observacoes,
      }),
    });

    setCarregando(false);

    if (!res.ok) {
      const { error } = await res.json();
      setErro(error ?? "Não foi possível registrar a colheita.");
      return;
    }

    setPesoLiquido("");
    setUmidade("");
    setObservacoes("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-black/5 p-4 space-y-3">
      <p className="text-xs text-gray-500">Registrar carga de colheita</p>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1">Armazém</label>
          {!criandoArmazem ? (
            <div className="flex gap-2">
              <select
                value={armazemId}
                onChange={(e) => setArmazemId(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
              >
                {armazens.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nome}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setCriandoArmazem(true)}
                className="text-xs text-green-700 font-medium whitespace-nowrap"
              >
                + novo
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                value={novoArmazemNome}
                onChange={(e) => setNovoArmazemNome(e.target.value)}
                placeholder="Nome do armazém"
                className="flex-1 rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
              />
              {armazens.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCriandoArmazem(false)}
                  className="text-xs text-gray-500 whitespace-nowrap"
                >
                  cancelar
                </button>
              )}
            </div>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Data</label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-xs font-medium mb-1">Peso líquido (kg)</label>
          <input
            required
            type="number"
            step="0.01"
            value={pesoLiquido}
            onChange={(e) => setPesoLiquido(e.target.value)}
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
        <div>
          <label className="block text-xs font-medium mb-1">Sacas (60kg)</label>
          <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-sm text-gray-700">
            {sacas ?? "—"}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">Observações</label>
        <input
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>

      {erro && <p className="text-xs text-red-600">{erro}</p>}

      <button
        type="submit"
        disabled={carregando}
        className="rounded-lg bg-green-600 text-white text-xs font-medium px-3 py-1.5 hover:bg-green-700 disabled:opacity-60"
      >
        {carregando ? "Salvando..." : "Registrar carga"}
      </button>
    </form>
  );
}
