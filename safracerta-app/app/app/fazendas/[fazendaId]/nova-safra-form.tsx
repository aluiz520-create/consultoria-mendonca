"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CULTURAS = ["Soja", "Milho", "Feijão"];

interface Talhao {
  id: string;
  nome: string;
}

export function NovaSafraForm({ fazendaId, talhoes }: { fazendaId: string; talhoes: Talhao[] }) {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const [talhaoId, setTalhaoId] = useState("");
  const [criandoTalhao, setCriandoTalhao] = useState(false);
  const [novoTalhaoNome, setNovoTalhaoNome] = useState("");
  const [novoTalhaoArea, setNovoTalhaoArea] = useState("");
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

    let talhaoIdFinal = talhaoId || null;

    if (criandoTalhao && novoTalhaoNome) {
      const resTalhao = await fetch("/api/talhoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fazenda_id: fazendaId,
          nome: novoTalhaoNome,
          area_ha: novoTalhaoArea ? Number(novoTalhaoArea) : null,
        }),
      });

      if (!resTalhao.ok) {
        setCarregando(false);
        const { error } = await resTalhao.json();
        setErro(error ?? "Não foi possível criar o talhão.");
        return;
      }

      const { talhao } = await resTalhao.json();
      talhaoIdFinal = talhao.id;
    }

    const res = await fetch("/api/safras", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fazenda_id: fazendaId,
        talhao_id: talhaoIdFinal,
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
        + Nova safra
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

      <div>
        <label className="block text-sm font-medium mb-1">Talhão (opcional)</label>
        {!criandoTalhao ? (
          <div className="flex gap-2">
            <select
              value={talhaoId}
              onChange={(e) => setTalhaoId(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Toda a fazenda / sem talhão específico</option>
              {talhoes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                setCriandoTalhao(true);
                setTalhaoId("");
              }}
              className="text-sm text-green-700 font-medium whitespace-nowrap"
            >
              + novo talhão
            </button>
          </div>
        ) : (
          <div className="flex gap-2 items-start">
            <input
              value={novoTalhaoNome}
              onChange={(e) => setNovoTalhaoNome(e.target.value)}
              placeholder="Nome do talhão"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <input
              type="number"
              step="0.01"
              value={novoTalhaoArea}
              onChange={(e) => setNovoTalhaoArea(e.target.value)}
              placeholder="Área (ha)"
              className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => {
                setCriandoTalhao(false);
                setNovoTalhaoNome("");
                setNovoTalhaoArea("");
              }}
              className="text-xs text-gray-500 whitespace-nowrap mt-2.5"
            >
              cancelar
            </button>
          </div>
        )}
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
