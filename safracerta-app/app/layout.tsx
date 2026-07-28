import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SafraCerta — Painel de Custo, Contrato e Fiscal para o Agro",
  description:
    "Controle o custo por hectare, os contratos de arrendamento e os prazos fiscais da sua operação em um só painel.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#f7f5ef] min-h-screen antialiased">{children}</body>
    </html>
  );
}
