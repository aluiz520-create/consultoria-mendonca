"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Categoria {
  id: string;
  nome: string;
}

interface SafraOpcao {
  id: string;
  label: string;
}

interface Linha {
  safra_id: string;
  percentual: string;
}

export function NovoRateioForm({ categorias, safras }: { categorias: Categoria[]; safras: SafraOpcao[] }) {
  const router = useRouter();
  const [categoriaId, setCategoriaId] = useState(categorias[0]?.id ?? "");
  const [descricao, setDescricao] = useState("");
  const [valorTotal, setValorTotal] = useState("");
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));
  const [linhas, setLinhas] = useState<Linha[]>([
    { safra_id: safras[0]?.id ?? "", percentual: "" },
    { safra_id: safras[1]?.id ?? "", percentual: "" },
  ]);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const somaPercentuais = linhas.reduce((acc, l) => acc + (Number(l.percentual) || 0), 0);

  function atualizarLinha(index: number, campo: keyof Linha, valor: string) {
    setLinhas((prev) => prev.map((l, i) => (i === index ? { ...l, [campo]: valor } : l)));
  }

  function adicionarLinha() {
    setLinhas((prev) => [...prev, { safra_id: safras[0]?.id ?? "", percentual: "" }]);
  }

  function removerLinha(index: number) {
    setLinhas((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (Math.abs(somaPercentuais - 100) > 0.5) {
      setErro(`Os percentuais precisam somar 100%. Soma atual: ${somaPercentuais.toFixed(1)}%.`);
      return;
    }

    setCarregando(true);

    const res = await fetch("/api/despesas-rateadas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoria_id: categoriaId,
        descricao,
        valor_total: Number(valorTotal),
        data,
        rateios: linhas.map((l) => ({ safra_id: l.safra_id, percentual: Number(l.percentual) })),
      }),
    });

    setCarregando(false);

    if (!res.ok) {
      const { error } = await res.json();
      setErro(error ?? "Não foi possível ratear a despesa.");
      return;
    }

    setDescricao("");
    setValorTotal("");
    setLinhas([
      { safra_id: safras[0]?.id ?? "", percentual: "" },
      { safra_id: safras[1]?.id ?? "", percentual: "" },
    ]);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-black/5 p-5 space-y-4 max-w-2xl">
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Categoria</label>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Valor total (R$)</label>
          <input
            required
            type="number"
            step="0.01"
            value={valorTotal}
            onChange={(e) => setValorTotal(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Data</label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descrição</label>
        <input
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Ex: adubação compartilhada entre as duas fazendas"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Como dividir entre as safras</p>
        <div className="space-y-2">
          {linhas.map((linha, index) => (
            <div key={index} className="flex gap-2 items-center">
              <select
                value={linha.safra_id}
                onChange={(e) => atualizarLinha(index, "safra_id", e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                {safras.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                step="0.1"
                placeholder="%"
                value={linha.percentual}
                onChange={(e) => atualizarLinha(index, "percentual", e.target.value)}
                className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              {linhas.length > 2 && (
                <button
                  type="button"
                  onClick={() => removerLinha(index)}
                  className="text-xs text-red-600 font-medium"
                >
                  remover
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={adicionarLinha} className="text-sm text-green-700 font-medium mt-2">
          + adicionar safra
        </button>
        <p className={`text-xs mt-2 ${Math.abs(somaPercentuais - 100) > 0.5 ? "text-red-600" : "text-gray-500"}`}>
          Soma dos percentuais: {somaPercentuais.toFixed(1)}%
        </p>
      </div>

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      <button
        type="submit"
        disabled={carregando}
        className="rounded-lg bg-green-600 text-white text-sm font-medium px-4 py-2 hover:bg-green-700 disabled:opacity-60"
      >
        {carregando ? "Salvando..." : "Ratear despesa"}
      </button>
    </form>
  );
}
