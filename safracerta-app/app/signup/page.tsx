"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const supabase = createClient();
  const [nome, setNome] = useState("");
  const [nomeConta, setNomeConta] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: { nome, nome_conta: nomeConta },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
      },
    });

    setCarregando(false);

    if (error) {
      setErro(error.message);
      return;
    }

    setEnviado(true);
  }

  if (enviado) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-black/5 p-8 text-center">
          <h1 className="text-xl font-semibold text-green-900 mb-2">Quase lá</h1>
          <p className="text-sm text-gray-600">
            Enviamos um link de confirmação para <strong>{email}</strong>. Confirme para acessar o
            seu painel.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-black/5 p-8">
        <h1 className="text-xl font-semibold text-green-900 mb-1">Criar conta no SafraCerta</h1>
        <p className="text-sm text-gray-500 mb-6">30 dias grátis, sem cartão de crédito.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="nome">
              Seu nome
            </label>
            <input
              id="nome"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="nomeConta">
              Nome da fazenda / empresa
            </label>
            <input
              id="nomeConta"
              required
              value={nomeConta}
              onChange={(e) => setNomeConta(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="senha">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              required
              minLength={6}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {erro && <p className="text-sm text-red-600">{erro}</p>}

          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-lg bg-green-600 text-white py-2 text-sm font-medium hover:bg-green-700 disabled:opacity-60"
          >
            {carregando ? "Criando..." : "Criar conta"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Já tem conta?{" "}
          <Link href="/login" className="text-green-700 font-medium">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
