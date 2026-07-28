"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Fazenda {
  id: string;
  nome: string;
}

export function NovoContratoForm({ fazendas }: { fazendas: Fazenda[] }) {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const [tipo, setTipo] = useState("arrendamento");
  const [fazendaId, setFazendaId] = useState(fazendas[0]?.id ?? "");
  const [contraparteNome, setContraparteNome] = useState("");
  const [areaHa, setAreaHa] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("sacas_por_ha");
  const [valorReferencia, setValorReferencia] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const res = await fetch("/api/contratos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fazenda_id: fazendaId || null,
        tipo,
        contraparte_nome: contraparteNome,
        area_ha: areaHa ? Number(areaHa) : null,
        data_inicio: dataInicio,
        data_fim: dataFim,
        forma_pagamento: formaPagamento,
        valor_referencia: valorReferencia ? Number(valorReferencia) : null,
      }),
    });

    setCarregando(false);

    if (!res.ok) {
      const { error } = await res.json();
      setErro(error ?? "Não foi possível salvar o contrato.");
      return;
    }

    setAberto(false);
    setContraparteNome("");
    router.refresh();
  }

  if (!aberto) {
    return (
      <button
        onClick={() => setAberto(true)}
        className="rounded-lg bg-green-600 text-white text-sm font-medium px-4 py-2 hover:bg-green-700"
      >
        + Novo contrato
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-black/5 p-5 space-y-4 max-w-2xl">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="arrendamento">Arrendamento</option>
            <option value="parceria">Parceria</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Fazenda</label>
          <select
            value={fazendaId}
            onChange={(e) => setFazendaId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            {fazendas.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Nome da contraparte</label>
        <input
          required
          value={contraparteNome}
          onChange={(e) => setContraparteNome(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="grid sm:grid-cols-4 gap-3">
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
          <label className="block text-sm font-medium mb-1">Início</label>
          <input
            required
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Fim / vencimento</label>
          <input
            required
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Forma de pagamento</label>
          <select
            value={formaPagamento}
            onChange={(e) => setFormaPagamento(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="sacas_por_ha">Sacas / ha</option>
            <option value="valor_fixo">Valor fixo</option>
            <option value="percentual_producao">% da produção</option>
          </select>
        </div>
      </div>

      <div className="max-w-xs">
        <label className="block text-sm font-medium mb-1">Valor de referência</label>
        <input
          type="number"
          step="0.01"
          value={valorReferencia}
          onChange={(e) => setValorReferencia(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={carregando}
          className="rounded-lg bg-green-600 text-white text-sm font-medium px-4 py-2 hover:bg-green-700 disabled:opacity-60"
        >
          {carregando ? "Salvando..." : "Salvar contrato"}
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
