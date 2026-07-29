"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PlantioOpcao {
  id: string;
  label: string;
  cultura: string;
}

interface ClienteOpcao {
  id: string;
  nome: string;
}

export function NovoContratoVendaForm({
  plantios,
  clientes,
}: {
  plantios: PlantioOpcao[];
  clientes: ClienteOpcao[];
}) {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const [plantioId, setPlantioId] = useState("");
  const [clienteId, setClienteId] = useState(clientes[0]?.id ?? "");
  const [criandoCliente, setCriandoCliente] = useState(clientes.length === 0);
  const [novoClienteNome, setNovoClienteNome] = useState("");
  const [cultura, setCultura] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [unidadeMedida, setUnidadeMedida] = useState("saca");
  const [precoUnitario, setPrecoUnitario] = useState("");
  const [frete, setFrete] = useState("");
  const [desconto, setDesconto] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("a_vista");
  const [dataContrato, setDataContrato] = useState(new Date().toISOString().slice(0, 10));
  const [dataEntrega, setDataEntrega] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const valorLiquido =
    quantidade && precoUnitario
      ? (
          Number(quantidade) * Number(precoUnitario) -
          (Number(frete) || 0) -
          (Number(desconto) || 0)
        ).toFixed(2)
      : null;

  function handlePlantioChange(id: string) {
    setPlantioId(id);
    const plantio = plantios.find((p) => p.id === id);
    if (plantio) setCultura(plantio.cultura);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    let clienteIdFinal = clienteId || null;

    if (criandoCliente && novoClienteNome) {
      const res = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: novoClienteNome }),
      });
      if (!res.ok) {
        setCarregando(false);
        const { error } = await res.json();
        setErro(error ?? "Não foi possível criar o cliente.");
        return;
      }
      const { cliente } = await res.json();
      clienteIdFinal = cliente.id;
    }

    const res = await fetch("/api/contratos-venda", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plantio_id: plantioId || null,
        cliente_id: clienteIdFinal,
        cultura,
        quantidade: Number(quantidade),
        unidade_medida: unidadeMedida,
        preco_unitario: Number(precoUnitario),
        frete: frete ? Number(frete) : 0,
        desconto: desconto ? Number(desconto) : 0,
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
    setQuantidade("");
    setPrecoUnitario("");
    setFrete("");
    setDesconto("");
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
          <label className="block text-sm font-medium mb-1">Plantio (opcional)</label>
          <select
            value={plantioId}
            onChange={(e) => handlePlantioChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Sem vínculo com plantio específico</option>
            {plantios.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Cliente</label>
          {!criandoCliente ? (
            <div className="flex gap-2">
              <select
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setCriandoCliente(true)}
                className="text-xs text-green-700 font-medium whitespace-nowrap"
              >
                + novo
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                required
                value={novoClienteNome}
                onChange={(e) => setNovoClienteNome(e.target.value)}
                placeholder="Ex: Cerealista São João"
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              {clientes.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCriandoCliente(false)}
                  className="text-xs text-gray-500 whitespace-nowrap"
                >
                  cancelar
                </button>
              )}
            </div>
          )}
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
          <label className="block text-sm font-medium mb-1">Frete (R$)</label>
          <input
            type="number"
            step="0.01"
            value={frete}
            onChange={(e) => setFrete(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Desconto (R$)</label>
          <input
            type="number"
            step="0.01"
            value={desconto}
            onChange={(e) => setDesconto(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Valor líquido</label>
          <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
            {valorLiquido ? `R$ ${valorLiquido}` : "—"}
          </div>
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
