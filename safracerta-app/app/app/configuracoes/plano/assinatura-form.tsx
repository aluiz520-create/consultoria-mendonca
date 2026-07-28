"use client";

import { useState } from "react";

const PLANOS = [
  { id: "starter", nome: "Starter", preco: "R$ 97/mês", descricao: "1 fazenda, custos e break-even." },
  { id: "pro", nome: "Pro", preco: "R$ 297/mês", descricao: "Até 5 fazendas, contratos e alertas." },
];

export function AssinaturaForm({
  planoAtual,
  nomeInicial,
  emailInicial,
}: {
  planoAtual: string;
  nomeInicial: string;
  emailInicial: string;
}) {
  const [plano, setPlano] = useState(planoAtual === "cerealista" ? "pro" : planoAtual);
  const [nome, setNome] = useState(nomeInicial);
  const [email, setEmail] = useState(emailInicial);
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const res = await fetch("/api/assinatura/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plano, nome, cpfCnpj, email }),
    });

    const json = await res.json();
    setCarregando(false);

    if (!res.ok) {
      setErro(json.error ?? "Não foi possível iniciar a assinatura.");
      return;
    }

    window.location.href = json.checkoutUrl;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-black/5 p-6 space-y-4 max-w-md">
      <div className="grid grid-cols-2 gap-3">
        {PLANOS.map((p) => (
          <button
            type="button"
            key={p.id}
            onClick={() => setPlano(p.id)}
            className={`text-left rounded-xl border p-3 ${
              plano === p.id ? "border-green-600 bg-green-50" : "border-gray-200"
            }`}
          >
            <p className="font-semibold text-green-900">{p.nome}</p>
            <p className="text-sm text-gray-600">{p.preco}</p>
            <p className="text-xs text-gray-500 mt-1">{p.descricao}</p>
          </button>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Nome completo / razão social</label>
        <input
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">E-mail de cobrança</label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">CPF ou CNPJ</label>
        <input
          required
          value={cpfCnpj}
          onChange={(e) => setCpfCnpj(e.target.value)}
          placeholder="Somente números"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      <button
        type="submit"
        disabled={carregando}
        className="w-full rounded-lg bg-green-600 text-white text-sm font-medium py-2 hover:bg-green-700 disabled:opacity-60"
      >
        {carregando ? "Gerando cobrança..." : "Continuar para pagamento"}
      </button>
      <p className="text-xs text-gray-500">
        Você será levado para a tela segura do Asaas para escolher Pix, boleto ou cartão.
      </p>
    </form>
  );
}
