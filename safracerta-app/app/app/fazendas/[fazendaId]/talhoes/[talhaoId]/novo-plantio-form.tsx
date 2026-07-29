"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Opcao {
  id: string;
  nome: string;
}

export function NovoPlantioForm({
  fazendaId,
  talhaoId,
  safrasCiclo,
  culturas,
}: {
  fazendaId: string;
  talhaoId: string;
  safrasCiclo: Opcao[];
  culturas: Opcao[];
}) {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);

  const [safraId, setSafraId] = useState(safrasCiclo[0]?.id ?? "");
  const [criandoSafra, setCriandoSafra] = useState(safrasCiclo.length === 0);
  const [novaSafraNome, setNovaSafraNome] = useState("2025/2026");

  const [culturaId, setCulturaId] = useState(culturas[0]?.id ?? "");
  const [criandoCultura, setCriandoCultura] = useState(culturas.length === 0);
  const [novaCulturaNome, setNovaCulturaNome] = useState("");

  const [areaPlantadaHa, setAreaPlantadaHa] = useState("");
  const [produtividade, setProdutividade] = useState("");
  const [precoReferencia, setPrecoReferencia] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    let safraIdFinal = safraId;
    if (criandoSafra) {
      if (!novaSafraNome) {
        setCarregando(false);
        setErro("Informe o nome da safra.");
        return;
      }
      const res = await fetch("/api/safras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: novaSafraNome }),
      });
      if (!res.ok) {
        setCarregando(false);
        const { error } = await res.json();
        setErro(error ?? "Não foi possível criar a safra.");
        return;
      }
      const { safra } = await res.json();
      safraIdFinal = safra.id;
    }

    let culturaIdFinal = culturaId;
    if (criandoCultura) {
      if (!novaCulturaNome) {
        setCarregando(false);
        setErro("Informe o nome da cultura.");
        return;
      }
      const res = await fetch("/api/culturas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: novaCulturaNome }),
      });
      if (!res.ok) {
        setCarregando(false);
        const { error } = await res.json();
        setErro(error ?? "Não foi possível criar a cultura.");
        return;
      }
      const { cultura } = await res.json();
      culturaIdFinal = cultura.id;
    }

    const res = await fetch("/api/plantios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fazenda_id: fazendaId,
        talhao_id: talhaoId,
        safra_id: safraIdFinal,
        cultura_id: culturaIdFinal,
        area_plantada_ha: Number(areaPlantadaHa),
        produtividade_esperada_sc_ha: produtividade ? Number(produtividade) : null,
        preco_referencia_sc: precoReferencia ? Number(precoReferencia) : null,
      }),
    });

    setCarregando(false);

    if (!res.ok) {
      const { error } = await res.json();
      setErro(error ?? "Não foi possível salvar o plantio.");
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
        + Novo plantio
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-black/5 p-5 space-y-4 max-w-lg">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Safra</label>
          {!criandoSafra ? (
            <div className="flex gap-2">
              <select
                value={safraId}
                onChange={(e) => setSafraId(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                {safrasCiclo.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nome}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setCriandoSafra(true)}
                className="text-xs text-green-700 font-medium whitespace-nowrap"
              >
                + nova
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                value={novaSafraNome}
                onChange={(e) => setNovaSafraNome(e.target.value)}
                placeholder="Ex: 2025/2026"
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              {safrasCiclo.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCriandoSafra(false)}
                  className="text-xs text-gray-500 whitespace-nowrap"
                >
                  cancelar
                </button>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cultura</label>
          {!criandoCultura ? (
            <div className="flex gap-2">
              <select
                value={culturaId}
                onChange={(e) => setCulturaId(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                {culturas.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setCriandoCultura(true)}
                className="text-xs text-green-700 font-medium whitespace-nowrap"
              >
                + nova
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                value={novaCulturaNome}
                onChange={(e) => setNovaCulturaNome(e.target.value)}
                placeholder="Ex: Soja"
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              {culturas.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCriandoCultura(false)}
                  className="text-xs text-gray-500 whitespace-nowrap"
                >
                  cancelar
                </button>
              )}
            </div>
          )}
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
          {carregando ? "Salvando..." : "Salvar plantio"}
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
