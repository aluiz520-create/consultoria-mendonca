"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function NovaMovimentacaoForm({ produtoId }: { produtoId: string }) {
  const router = useRouter();
  const [tipo, setTipo] = useState<"entrada" | "saida">("entrada");
  const [quantidade, setQuantidade] = useState("");
  const [precoUnitario, setPrecoUnitario] = useState("");
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));
  const [observacao, setObservacao] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const res = await fetch("/api/estoque-movimentacoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        produto_id: produtoId,
        tipo,
        quantidade: Number(quantidade),
        preco_unitario: tipo === "entrada" && precoUnitario ? Number(precoUnitario) : null,
        data,
        observacao,
      }),
    });

    setCarregando(false);

    if (!res.ok) {
      const { error } = await res.json();
      setErro(error ?? "Não foi possível registrar a movimentação.");
      return;
    }

    setQuantidade("");
    setPrecoUnitario("");
    setObservacao("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-black/5 p-5 space-y-4 max-w-lg">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTipo("entrada")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${
            tipo === "entrada" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          Entrada
        </button>
        <button
          type="button"
          onClick={() => setTipo("saida")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${
            tipo === "saida" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          Saída
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Quantidade</label>
          <input
            required
            type="number"
            step="0.01"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        {tipo === "entrada" && (
          <div>
            <label className="block text-sm font-medium mb-1">Preço/unidade (R$)</label>
            <input
              type="number"
              step="0.01"
              value={precoUnitario}
              onChange={(e) => setPrecoUnitario(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        )}
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
        <label className="block text-sm font-medium mb-1">Observação</label>
        <input
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      <button
        type="submit"
        disabled={carregando}
        className={`rounded-lg text-white text-sm font-medium px-4 py-2 disabled:opacity-60 ${
          tipo === "entrada" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {carregando ? "Salvando..." : tipo === "entrada" ? "Registrar entrada" : "Registrar saída"}
      </button>
    </form>
  );
}
