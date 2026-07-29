"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TIPOS_OPERACAO } from "@/lib/operacoes-agricolas";

interface Opcao {
  id: string;
  nome: string;
}

interface ProdutoOpcao extends Opcao {
  saldo: number;
  unidade_medida: string;
}

interface ItemProduto {
  produtoId: string;
  quantidade: string;
}

export function NovaOperacaoForm({
  plantioId,
  funcionarios,
  maquinas,
  implementos,
  produtos,
}: {
  plantioId: string;
  funcionarios: Opcao[];
  maquinas: Opcao[];
  implementos: Opcao[];
  produtos: ProdutoOpcao[];
}) {
  const router = useRouter();
  const [tipo, setTipo] = useState(TIPOS_OPERACAO[0].value);
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));
  const [areaExecutada, setAreaExecutada] = useState("");
  const [funcionarioId, setFuncionarioId] = useState("");
  const [maquinaId, setMaquinaId] = useState("");
  const [implementoId, setImplementoId] = useState("");
  const [horas, setHoras] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [itens, setItens] = useState<ItemProduto[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  function adicionarItem() {
    setItens([...itens, { produtoId: produtos[0]?.id ?? "", quantidade: "" }]);
  }

  function atualizarItem(index: number, campo: keyof ItemProduto, valor: string) {
    setItens(itens.map((it, i) => (i === index ? { ...it, [campo]: valor } : it)));
  }

  function removerItem(index: number) {
    setItens(itens.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const produtosValidos = itens
      .filter((it) => it.produtoId && Number(it.quantidade) > 0)
      .map((it) => ({ produto_id: it.produtoId, quantidade: Number(it.quantidade) }));

    const res = await fetch("/api/operacoes-agricolas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plantio_id: plantioId,
        tipo,
        data,
        area_executada_ha: areaExecutada ? Number(areaExecutada) : null,
        funcionario_id: funcionarioId || null,
        maquina_id: maquinaId || null,
        implemento_id: implementoId || null,
        horas: horas ? Number(horas) : null,
        observacoes,
        produtos: produtosValidos,
      }),
    });

    setCarregando(false);

    if (!res.ok) {
      const { error } = await res.json();
      setErro(error ?? "Não foi possível registrar a operação.");
      return;
    }

    setAreaExecutada("");
    setHoras("");
    setObservacoes("");
    setItens([]);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-black/5 p-5 space-y-4">
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Tipo de operação</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            {TIPOS_OPERACAO.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
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
        <div>
          <label className="block text-sm font-medium mb-1">Área executada (ha)</label>
          <input
            type="number"
            step="0.01"
            value={areaExecutada}
            onChange={(e) => setAreaExecutada(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Funcionário</label>
          <select
            value={funcionarioId}
            onChange={(e) => setFuncionarioId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Nenhum</option>
            {funcionarios.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Máquina</label>
          <select
            value={maquinaId}
            onChange={(e) => setMaquinaId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Nenhuma</option>
            {maquinas.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Implemento</label>
          <select
            value={implementoId}
            onChange={(e) => setImplementoId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Nenhum</option>
            {implementos.map((i) => (
              <option key={i.id} value={i.id}>
                {i.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Horas trabalhadas</label>
          <input
            type="number"
            step="0.1"
            value={horas}
            onChange={(e) => setHoras(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium">Produtos usados</label>
          {produtos.length > 0 && (
            <button type="button" onClick={adicionarItem} className="text-xs text-green-700 font-medium">
              + adicionar produto
            </button>
          )}
        </div>
        {!produtos.length && (
          <p className="text-xs text-gray-500">Cadastre produtos em Estoque para registrar o uso aqui.</p>
        )}
        {itens.length > 0 && (
          <div className="space-y-2">
            {itens.map((item, index) => {
              const produto = produtos.find((p) => p.id === item.produtoId);
              return (
                <div key={index} className="flex items-center gap-2">
                  <select
                    value={item.produtoId}
                    onChange={(e) => atualizarItem(index, "produtoId", e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    {produtos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome} (saldo: {p.saldo} {p.unidade_medida})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Quantidade"
                    value={item.quantidade}
                    onChange={(e) => atualizarItem(index, "quantidade", e.target.value)}
                    className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                  {produto && <span className="text-xs text-gray-400 w-10">{produto.unidade_medida}</span>}
                  <button
                    type="button"
                    onClick={() => removerItem(index)}
                    className="text-xs text-red-600 whitespace-nowrap"
                  >
                    remover
                  </button>
                </div>
              );
            })}
          </div>
        )}
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

      <button
        type="submit"
        disabled={carregando}
        className="rounded-lg bg-green-600 text-white text-sm font-medium px-4 py-2 hover:bg-green-700 disabled:opacity-60"
      >
        {carregando ? "Salvando..." : "Registrar operação"}
      </button>
      <p className="text-xs text-gray-500">
        Baixa o estoque dos produtos usados e gera o custo de mão de obra, maquinário e insumos automaticamente.
      </p>
    </form>
  );
}
