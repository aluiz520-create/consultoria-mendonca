"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NovaFazendaPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [uf, setUf] = useState("GO");
  const [areaTotalHa, setAreaTotalHa] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const res = await fetch("/api/fazendas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        municipio,
        uf,
        area_total_ha: areaTotalHa ? Number(areaTotalHa) : null,
      }),
    });

    setCarregando(false);

    if (!res.ok) {
      const { error } = await res.json();
      setErro(error ?? "Não foi possível salvar a fazenda.");
      return;
    }

    router.push("/app/fazendas");
    router.refresh();
  }

  return (
    <div className="max-w-lg">
      <button
        onClick={() => router.back()}
        className="text-sm text-green-700 hover:text-green-800 font-medium mb-2 inline-flex items-center gap-1"
      >
        ← Voltar
      </button>
      <h1 className="text-2xl font-semibold text-green-900 mb-6">Nova fazenda</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-black/5 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nome da fazenda</label>
          <input
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Município</label>
            <input
              value={municipio}
              onChange={(e) => setMunicipio(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">UF</label>
            <input
              value={uf}
              maxLength={2}
              onChange={(e) => setUf(e.target.value.toUpperCase())}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Área total (ha)</label>
          <input
            type="number"
            step="0.01"
            value={areaTotalHa}
            onChange={(e) => setAreaTotalHa(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <button
          type="submit"
          disabled={carregando}
          className="rounded-lg bg-green-600 text-white text-sm font-medium px-4 py-2 hover:bg-green-700 disabled:opacity-60"
        >
          {carregando ? "Salvando..." : "Salvar fazenda"}
        </button>
      </form>
    </div>
  );
}
