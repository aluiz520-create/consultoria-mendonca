"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIAS_ESTOQUE, UNIDADES_ESTOQUE } from "@/lib/estoque";

interface Produto {
  id: string;
  nome: string;
}

interface Plantio {
  id: string;
  label: string;
}

interface Categoria {
  id: string;
  nome: string;
}

export function NovaCompraForm({
  produtos,
  plantios,
  categorias,
}: {
  produtos: Produto[];
  plantios: Plantio[];
  categorias: Categoria[];
}) {
  const router = useRouter();
  const [fornecedorNome, setFornecedorNome] = useState("");

  const [produtoId, setProdutoId] = useState(produtos[0]?.id ?? "");
  const [criandoProduto, setCriandoProduto] = useState(produtos.length === 0);
  const [novoProdutoNome, setNovoProdutoNome] = useState("");
  const [novoProdutoCategoria, setNovoProdutoCategoria] = useState(CATEGORIAS_ESTOQUE[0].value);
  const [novoProdutoUnidade, setNovoProdutoUnidade] = useState(UNIDADES_ESTOQUE[0].value);

  const [plantioId, setPlantioId] = useState(plantios[0]?.id ?? "");
  const [categoriaId, setCategoriaId] = useState(categorias[0]?.id ?? "");
  const [quantidade, setQuantidade] = useState("");
  const [precoUnitario, setPrecoUnitario] = useState("");
  const [dataCompra, setDataCompra] = useState(new Date().toISOString().slice(0, 10));
  const [jaPago, setJaPago] = useState(true);
  const [dataVencimento, setDataVencimento] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const valorTotal =
    quantidade && precoUnitario ? (Number(quantidade) * Number(precoUnitario)).toFixed(2) : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    let produtoIdFinal = produtoId;

    if (criandoProduto) {
      if (!novoProdutoNome) {
        setCarregando(false);
        setErro("Informe o nome do produto.");
        return;
      }
      const res = await fetch("/api/produtos-estoque", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: novoProdutoNome,
          categoria: novoProdutoCategoria,
          unidade_medida: novoProdutoUnidade,
        }),
      });
      if (!res.ok) {
        setCarregando(false);
        const { error } = await res.json();
        setErro(error ?? "Não foi possível criar o produto.");
        return;
      }
      const { produto } = await res.json();
      produtoIdFinal = produto.id;
    }

    const res = await fetch("/api/compras", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fornecedor_nome: fornecedorNome,
        produto_id: produtoIdFinal,
        plantio_id: plantioId,
        categoria_id: categoriaId,
        quantidade: Number(quantidade),
        preco_unitario: Number(precoUnitario),
        data_compra: dataCompra,
        ja_pago: jaPago,
        data_vencimento: jaPago ? null : dataVencimento || null,
        observacoes,
      }),
    });

    setCarregando(false);

    if (!res.ok) {
      const { error } = await res.json();
      setErro(error ?? "Não foi possível registrar a compra.");
      return;
    }

    setFornecedorNome("");
    setQuantidade("");
    setPrecoUnitario("");
    setObservacoes("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-black/5 p-5 space-y-4 max-w-2xl">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Fornecedor</label>
          <input
            required
            value={fornecedorNome}
            onChange={(e) => setFornecedorNome(e.target.value)}
            placeholder="Ex: Casa Agrícola São Luiz"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Produto</label>
          {!criandoProduto ? (
            <div className="flex gap-2">
              <select
                value={produtoId}
                onChange={(e) => setProdutoId(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                {produtos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setCriandoProduto(true)}
                className="text-xs text-green-700 font-medium whitespace-nowrap"
              >
                + novo
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  value={novoProdutoNome}
                  onChange={(e) => setNovoProdutoNome(e.target.value)}
                  placeholder="Nome do produto"
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                {produtos.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCriandoProduto(false)}
                    className="text-xs text-gray-500 whitespace-nowrap"
                  >
                    cancelar
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <select
                  value={novoProdutoCategoria}
                  onChange={(e) => setNovoProdutoCategoria(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 px-2 py-1.5 text-xs"
                >
                  {CATEGORIAS_ESTOQUE.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <select
                  value={novoProdutoUnidade}
                  onChange={(e) => setNovoProdutoUnidade(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 px-2 py-1.5 text-xs"
                >
                  {UNIDADES_ESTOQUE.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Plantio (safra · fazenda · cultura · talhão)</label>
          <select
            value={plantioId}
            onChange={(e) => setPlantioId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            {plantios.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Categoria de custo</label>
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
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
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
        <div>
          <label className="block text-sm font-medium mb-1">Valor total</label>
          <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
            {valorTotal ? `R$ ${valorTotal}` : "—"}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Data da compra</label>
          <input
            type="date"
            value={dataCompra}
            onChange={(e) => setDataCompra(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <label className="flex items-center gap-2 text-sm pb-2.5">
          <input type="checkbox" checked={jaPago} onChange={(e) => setJaPago(e.target.checked)} />
          Já foi pago (à vista)
        </label>
        {!jaPago && (
          <div>
            <label className="block text-sm font-medium mb-1">Vencimento</label>
            <input
              type="date"
              value={dataVencimento}
              onChange={(e) => setDataVencimento(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
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
        {carregando ? "Salvando..." : "Registrar compra"}
      </button>
      <p className="text-xs text-gray-500">
        Registra a entrada no estoque e a conta a pagar automaticamente, em um só lançamento.
      </p>
    </form>
  );
}
