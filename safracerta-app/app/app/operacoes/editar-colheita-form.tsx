"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface EditarColheitaFormProps {
  id: string;
  data: string;
  peso_liquido_kg: number;
  umidade: number | null;
  armazem_id: string | null;
  armazens: { id: string; nome: string }[];
  onClose: () => void;
}

export function EditarColheitaForm({
  id,
  data: dataInicial,
  peso_liquido_kg: pesoInicial,
  umidade: umidadeInicial,
  armazem_id: armazemIdInicial,
  armazens,
  onClose,
}: EditarColheitaFormProps) {
  const router = useRouter();
  const [data, setData] = useState(dataInicial);
  const [peso, setPeso] = useState(pesoInicial.toString());
  const [umidade, setUmidade] = useState(umidadeInicial?.toString() ?? "");
  const [armazemId, setArmazemId] = useState(armazemIdInicial ?? "");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const res = await fetch(`/api/colheitas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data,
        peso_liquido_kg: Number(peso),
        umidade: umidade ? Number(umidade) : null,
        armazem_id: armazemId || null,
      }),
    });

    setCarregando(false);

    if (!res.ok) {
      const { error } = await res.json();
      setErro(error ?? "Não foi possível salvar a colheita.");
      return;
    }

    onClose();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-black/5 p-5 space-y-4 max-w-2xl">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Data</label>
          <input
            required
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Peso líquido (kg)</label>
          <input
            required
            type="number"
            step="0.01"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Umidade (%)</label>
          <input
            type="number"
            step="0.1"
            value={umidade}
            onChange={(e) => setUmidade(e.target.value)}
            placeholder="Opcional"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Armazém</label>
          <select
            value={armazemId}
            onChange={(e) => setArmazemId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Selecione um armazém</option>
            {armazens.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={carregando}
          className="rounded-lg bg-green-600 text-white text-sm font-medium px-4 py-2 hover:bg-green-700 disabled:opacity-60"
        >
          {carregando ? "Salvando..." : "Salvar alterações"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-100"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
