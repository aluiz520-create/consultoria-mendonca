"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function MarcarEntregueButton({ id }: { id: string }) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);

  async function handleClick() {
    setCarregando(true);
    const res = await fetch(`/api/contratos-venda/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "entregue" }),
    });
    setCarregando(false);

    if (res.ok) router.refresh();
  }

  return (
    <button
      onClick={handleClick}
      disabled={carregando}
      className="text-xs text-green-700 hover:text-green-800 font-medium disabled:opacity-60"
    >
      {carregando ? "..." : "Marcar entregue"}
    </button>
  );
}
