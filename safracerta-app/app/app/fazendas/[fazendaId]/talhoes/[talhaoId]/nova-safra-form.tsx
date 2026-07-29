"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CULTURAS = ["Soja", "Milho", "Feijão"];

export function NovaSafraForm({ fazendaId, talhaoId }: { fazendaId: string; talhaoId: string }) {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const [cultura, setCultura] = useState(CULTURAS[0]);
  const [ano, setAno] = useState("2025/2026");
  const [areaPlantadaHa, setAreaPlantadaHa] = useState("");
  const [produtividade, setProdutividade] = useState("");
  const [precoReferencia, setPrecoReferencia] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const res = await fetch("/api/safras", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fazenda_id: fazendaId,
        talhao_id: talhaoId,
        cultura,
        ano,
        area_plantada_ha: Number(areaPlantadaHa),
        produtividade_esperada_sc_ha: produtividade ? Number(produtividade) : null,
        preco_referencia_sc: precoReferencia ? Number(precoReferencia) : null,
      }),
    });

    setCarregando(false);

    if (!res.ok) {
      const { error } = await res.json();
      setErro(error ?? "Não foi possível salvar a safra.");
      return;
    }

    setAberto(false);
    router.refresh();
  }

  if (!aberto) {
    return (
      <button
        onClick={() => setAberto(true)}
        className="rounded-lg bg-green-600 text-white text-sm font-medium px-4 py-2 hover:bg-green-700"
      >
        + Nova safra neste talhão
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-black/5 p-5 space-y-4 max-w-lg">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Cultura</label>
          <select
            value={cultura}
            onChange={(e) => setCultura(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            {CULTURAS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Safra (ano)</label>
          <input
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Área plantada (ha)</label>
          <input
            required
            type="number"
            step="0.01"
            value={areaPlantadaHa}
            onChange={(e) => setAreaPlantadaHa(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Produtiv. (sc/ha)</label>
          <input
            type="number"
            step="0.01"
            value={produtividade}
            onChange={(e) => setProdutividade(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Preço ref. (R$/sc)</label>
          <input
            type="number"
            step="0.01"
            value={precoReferencia}
            onChange={(e) => setPrecoReferencia(e.target.value)}
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
          {carregando ? "Salvando..." : "Salvar safra"}
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
