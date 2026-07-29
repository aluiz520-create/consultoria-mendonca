"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function EncerrarContratoButton({ contratoId }: { contratoId: string }) {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const res = await fetch(`/api/contratos/${contratoId}/encerrar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ motivo }),
    });

    setCarregando(false);

    if (!res.ok) {
      const { error } = await res.json();
      setErro(error ?? "Não foi possível encerrar o contrato.");
      return;
    }

    setAberto(false);
    router.refresh();
  }

  if (!aberto) {
    return (
      <button
        onClick={() => setAberto(true)}
        className="text-sm text-red-600 hover:text-red-700 font-medium"
      >
        Encerrar antecipadamente
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-3 max-w-lg">
      <p className="text-sm text-red-700 font-medium">Encerrar este contrato antes do vencimento</p>
      <textarea
        required
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
        placeholder="Motivo do encerramento (ex: rescisão amigável, venda da área, descumprimento...)"
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        rows={2}
      />
      {erro && <p className="text-sm text-red-600">{erro}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={carregando}
          className="rounded-lg bg-red-600 text-white text-sm font-medium px-4 py-2 hover:bg-red-700 disabled:opacity-60"
        >
          {carregando ? "Encerrando..." : "Confirmar encerramento"}
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
