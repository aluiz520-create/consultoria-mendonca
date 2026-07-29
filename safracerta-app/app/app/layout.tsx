import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

const NAV_ITEMS = [
  { href: "/app/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/app/fazendas", label: "Fazendas", icon: "🌾" },
  { href: "/app/operacoes", label: "Operações", icon: "💰" },
  { href: "/app/recursos", label: "Equipe e Máquinas", icon: "🚜" },
  { href: "/app/estoque", label: "Estoque", icon: "📦" },
  { href: "/app/compras", label: "Compras", icon: "🛒" },
  { href: "/app/financeiro", label: "Financeiro", icon: "🧾" },
  { href: "/app/contratos", label: "Contratos", icon: "📄" },
  { href: "/app/atividade", label: "Atividade", icon: "🕒" },
  { href: "/app/configuracoes/plano", label: "Plano", icon: "💳" },
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: perfil } = user
    ? await supabase.from("users").select("nome, account_id, accounts(nome, plano)").eq("id", user.id).single()
    : { data: null };

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 shrink-0 bg-green-900 text-white flex flex-col">
        <div className="px-5 py-6">
          <span className="text-lg font-semibold">
            Safra<span className="text-gold-500">Certa</span>
          </span>
          {perfil?.accounts && (
            <p className="text-xs text-white/60 mt-1 truncate">
              {(perfil.accounts as any).nome ?? ""}
            </p>
          )}
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/85 hover:bg-white/10"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-3 pb-6">
          <form action={signOut}>
            <button
              type="submit"
              className="w-full text-left rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10"
            >
              Sair
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 bg-[#f7f5ef] p-8">{children}</main>
    </div>
  );
}
