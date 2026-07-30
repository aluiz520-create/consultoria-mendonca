"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface EditarLancamentoFormProps {
  id: string;
  descricao: string | null;
  valor: number;
  data: string;
  data_vencimento: string | null;
  data_pagamento: string | null;
  categoria_id: string;
  categorias: { id: string; nome: string }[];
  onClose: () => void;
}

export function EditarLancamentoForm({
  id,
  descricao: descricaoInicial,
  valor: valorInicial,
  data: dataInicial,
  data_vencimento: dataVencimentoInicial,
  data_pagamento: dataPagamentoInicial,
  categoria_id: categoriaIdInicial,
  categorias,
  onClose,
}: EditarLancamentoFormProps) {
  const router = useRouter();
  const [descricao, setDescricao] = useState(descricaoInicial ?? "");
  const [valor, setValor] = useState(valorInicial.toString());
  const [data, setData] = useState(dataInicial);
  const [dataVencimento, setDataVencimento] = useState(dataVencimentoInicial ?? "");
  const [dataPagamento, setDataPagamento] = useState(dataPagamentoInicial ?? "");
  const [categoriaId, setCategoriaId] = useState(categoriaIdInicial);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const res = await fetch(`/api/custos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        descricao: descricao || null,
        valor: Number(valor),
        data,
        data_vencimento: dataVencimento || null,
        data_pagamento: dataPagamento || null,
        categoria_id: categoriaId,
      }),
    });

    setCarregando(false);

    if (!res.ok) {
      const { error } = await res.json();
      setErro(error ?? "Não foi possível salvar o lançamento.");
      return;
    }

    onClose();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-black/5 p-5 space-y-4 max-w-2xl">
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
        <label className="block text-sm font-medium mb-1">Descrição</label>
        <input
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Opcional"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Valor (R$)</label>
          <input
            required
            type="number"
            step="0.01"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
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
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Vencimento</label>
          <input
            type="date"
            value={dataVencimento}
            onChange={(e) => setDataVencimento(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Data de Pagamento</label>
          <input
            type="date"
            value={dataPagamento}
            onChange={(e) => setDataPagamento(e.target.value)}
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
