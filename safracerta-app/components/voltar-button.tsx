"use client";

import { useRouter } from "next/navigation";

export function VoltarButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="text-sm text-green-700 hover:text-green-800 font-medium mb-2 inline-flex items-center gap-1"
    >
      ← Voltar
    </button>
  );
}
