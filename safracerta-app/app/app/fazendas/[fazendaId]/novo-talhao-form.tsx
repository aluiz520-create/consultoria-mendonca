"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function NovoTalhaoForm({ fazendaId }: { fazendaId: string }) {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [areaHa, setAreaHa] = useState("");
  const [tipoSolo, setTipoSolo] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const res = await fetch("/api/talhoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fazenda_id: fazendaId,
        nome,
        area_ha: areaHa ? Number(areaHa) : null,
        tipo_solo: tipoSolo || null,
      }),
    });

    setCarregando(false);

    if (!res.ok) {
      const { error } = await res.json();
      setErro(error ?? "Não foi possível salvar o talhão.");
      return;
    }

    setAberto(false);
    setNome("");
    setAreaHa("");
    setTipoSolo("");
    router.refresh();
  }

  if (!aberto) {
    return (
      <button
        onClick={() => setAberto(true)}
        className="rounded-lg border border-green-600 text-green-700 text-sm font-medium px-4 py-2 hover:bg-green-50"
      >
        + Novo talhão
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-black/5 p-5 space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium mb-1">Nome do talhão</label>
        <input
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: Talhão 1, Área da Sede..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Área (ha)</label>
          <input
            type="number"
            step="0.01"
            value={areaHa}
            onChange={(e) => setAreaHa(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tipo de solo</label>
          <input
            value={tipoSolo}
            onChange={(e) => setTipoSolo(e.target.value)}
            placeholder="Ex: argiloso"
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
          {carregando ? "Salvando..." : "Salvar talhão"}
        </button>
        <button
          type="button"
          onClick={() => setAberto(false)}
          className="rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-100"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
