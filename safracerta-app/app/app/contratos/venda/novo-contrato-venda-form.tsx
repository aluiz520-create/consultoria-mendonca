"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SafraOpcao {
  id: string;
  label: string;
  cultura: string;
}

export function NovoContratoVendaForm({ safras }: { safras: SafraOpcao[] }) {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const [safraId, setSafraId] = useState("");
  const [compradorNome, setCompradorNome] = useState("");
  const [cultura, setCultura] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [unidadeMedida, setUnidadeMedida] = useState("saca");
  const [precoUnitario, setPrecoUnitario] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("a_vista");
  const [dataContrato, setDataContrato] = useState(new Date().toISOString().slice(0, 10));
  const [dataEntrega, setDataEntrega] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  function handleSafraChange(id: string) {
    setSafraId(id);
    const safra = safras.find((s) => s.id === id);
    if (safra) setCultura(safra.cultura);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const res = await fetch("/api/contratos-venda", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        safra_id: safraId || null,
        comprador_nome: compradorNome,
        cultura,
        quantidade: Number(quantidade),
        unidade_medida: unidadeMedida,
        preco_unitario: Number(precoUnitario),
        forma_pagamento: formaPagamento,
        data_contrato: dataContrato,
        data_entrega: dataEntrega || null,
        observacoes,
      }),
    });

    setCarregando(false);

    if (!res.ok) {
      const { error } = await res.json();
      setErro(error ?? "Não foi possível salvar o contrato de venda.");
      return;
    }

    setAberto(false);
    setCompradorNome("");
    setQuantidade("");
    setPrecoUnitario("");
    setDataEntrega("");
    setObservacoes("");
    router.refresh();
  }

  if (!aberto) {
    return (
      <button
        onClick={() => setAberto(true)}
        className="rounded-lg bg-green-600 text-white text-sm font-medium px-4 py-2 hover:bg-green-700"
      >
        + Novo contrato de venda
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-black/5 p-5 space-y-4 max-w-2xl">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Safra (opcional)</label>
          <select
            value={safraId}
            onChange={(e) => handleSafraChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Sem vínculo com safra específica</option>
            {safras.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Comprador</label>
          <input
            required
            value={compradorNome}
            onChange={(e) => setCompradorNome(e.target.value)}
            placeholder="Ex: Cerealista São João"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Cultura</label>
          <input
            value={cultura}
            onChange={(e) => setCultura(e.target.value)}
            placeholder="Soja"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
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
        <div>
          <label className="block text-sm font-medium mb-1">Unidade</label>
          <select
            value={unidadeMedida}
            onChange={(e) => setUnidadeMedida(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="saca">Saca</option>
            <option value="tonelada">Tonelada</option>
            <option value="kg">Kg</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Preço/unidade (R$)</label>
          <input
            required
            type="number"
            step="0.01"
            value={precoUnitario}
            onChange={(e) => setPrecoUnitario(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Forma de pagamento</label>
          <select
            value={formaPagamento}
            onChange={(e) => setFormaPagamento(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="a_vista">À vista</option>
            <option value="prazo">A prazo</option>
            <option value="barter">Barter (troca por insumo)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Data do contrato</label>
          <input
            type="date"
            value={dataContrato}
            onChange={(e) => setDataContrato(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Previsão de entrega</label>
          <input
            type="date"
            value={dataEntrega}
            onChange={(e) => setDataEntrega(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Observações</label>
        <input
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
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
