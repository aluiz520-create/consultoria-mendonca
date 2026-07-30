"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface EditarMaquinaFormProps {
  id: string;
  nome: string;
  tipo: string | null;
  custo_hora: number | null;
  onClose: () => void;
}

export function EditarMaquinaForm({ id, nome: nomeInicial, tipo: tipoInicial, custo_hora: custoHoraInicial, onClose }: EditarMaquinaFormProps) {
  const router = useRouter();
  const [nome, setNome] = useState(nomeInicial);
  const [tipo, setTipo] = useState(tipoInicial ?? "");
  const [custoHora, setCustoHora] = useState(custoHoraInicial?.toString() ?? "");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const res = await fetch(`/api/maquinas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        tipo: tipo || null,
        custo_hora: custoHora ? Number(custoHora) : null,
      }),
    });

    setCarregando(false);

    if (!res.ok) {
      const { error } = await res.json();
      setErro(error ?? "Não foi possível salvar a máquina.");
      return;
    }

    onClose();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-black/5 p-5 space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium mb-1">Nome</label>
        <input
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Tipo</label>
          <input
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            placeholder="Ex: Trator"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Custo/hora (R$)</label>
          <input
            type="number"
            step="0.01"
            value={custoHora}
            onChange={(e) => setCustoHora(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
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
