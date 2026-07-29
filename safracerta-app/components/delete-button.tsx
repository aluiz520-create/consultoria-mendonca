"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteButton({
  url,
  confirmMessage,
  className,
  label = "Apagar",
  redirectTo,
}: {
  url: string;
  confirmMessage: string;
  className?: string;
  label?: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm(confirmMessage)) return;

    setCarregando(true);
    const res = await fetch(url, { method: "DELETE" });
    setCarregando(false);

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Não foi possível apagar." }));
      window.alert(error ?? "Não foi possível apagar.");
      return;
    }

    if (redirectTo) {
      router.push(redirectTo);
    }
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={carregando}
      className={className ?? "text-xs text-red-600 hover:text-red-700 font-medium disabled:opacity-60"}
    >
      {carregando ? "Apagando..." : label}
    </button>
  );
}
