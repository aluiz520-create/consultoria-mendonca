import { createClient } from "@/lib/supabase/server";
import { VoltarButton } from "@/components/voltar-button";
import { AssinaturaForm } from "./assinatura-form";

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  trial: { label: "Período de teste", className: "bg-blue-100 text-blue-700" },
  pendente: { label: "Aguardando pagamento", className: "bg-amber-100 text-amber-700" },
  ativa: { label: "Ativa", className: "bg-green-100 text-green-700" },
  atrasada: { label: "Pagamento atrasado", className: "bg-red-100 text-red-700" },
  cancelada: { label: "Cancelada", className: "bg-gray-200 text-gray-700" },
};

export default async function PlanoPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: perfil } = await supabase
    .from("users")
    .select("nome, account_id, accounts(email_cobranca)")
    .eq("id", user!.id)
    .single();

  const { data: assinatura } = await supabase
    .from("assinaturas")
    .select("plano, status, proxima_cobranca, created_at")
    .eq("account_id", perfil?.account_id)
    .single();

  const status = STATUS_LABEL[assinatura?.status ?? "trial"];

  const trialExpiresAt = assinatura?.created_at
    ? new Date(new Date(assinatura.created_at).getTime() + 30 * 24 * 60 * 60 * 1000)
    : null;
  const diasFaltantes = trialExpiresAt
    ? Math.ceil((trialExpiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div>
      <VoltarButton />
      <h1 className="text-2xl font-semibold text-green-900 mb-1">Plano e assinatura</h1>
      <p className="text-sm text-gray-500 mb-6">Gerencie sua assinatura do SafraCerta.</p>

      <div className="bg-white rounded-2xl border border-black/5 p-5 mb-6 flex items-center justify-between max-w-md">
        <div>
          <p className="text-sm text-gray-500">Plano atual</p>
          <p className="font-semibold text-green-900 capitalize">{assinatura?.plano ?? "starter"}</p>
          {assinatura?.proxima_cobranca && (
            <p className="text-xs text-gray-500 mt-1">
              Próxima cobrança: {new Date(assinatura.proxima_cobranca).toLocaleDateString("pt-BR")}
            </p>
          )}
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}>
          {status.label}
        </span>
      </div>

      {(assinatura?.status === "atrasada" || assinatura?.status === "cancelada") && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4 mb-6 max-w-md">
          O acesso ao painel fica limitado enquanto a assinatura não é regularizada. Escolha um plano
          abaixo para continuar.
        </div>
      )}

      {assinatura?.status === "trial" && diasFaltantes !== null && (
        <div className={`border rounded-xl p-4 mb-6 max-w-md text-sm ${
          diasFaltantes <= 0
            ? "bg-red-50 border-red-200 text-red-700"
            : diasFaltantes <= 7
            ? "bg-amber-50 border-amber-200 text-amber-700"
            : "bg-blue-50 border-blue-200 text-blue-700"
        }`}>
          {diasFaltantes <= 0 ? (
            <span className="font-semibold">Seu trial expirou. Escolha um plano abaixo para continuar usando o SafraCerta.</span>
          ) : (
            <span className="font-semibold">
              Seu trial expira em <strong>{diasFaltantes}</strong> dia{diasFaltantes !== 1 ? "s" : ""}. Escolha um plano para continuar.
            </span>
          )}
        </div>
      )}

      <AssinaturaForm
        planoAtual={assinatura?.plano ?? "starter"}
        nomeInicial={perfil?.nome ?? ""}
        emailInicial={(perfil?.accounts as any)?.email_cobranca ?? user?.email ?? ""}
      />

      <p className="text-sm text-gray-500 mt-6 max-w-md">
        Precisa do plano Cerealista/Escritório (multi-cliente)?{" "}
        <a
          href="https://wa.me/5564992226766?text=Quero%20o%20plano%20Cerealista%20do%20SafraCerta"
          className="text-green-700 font-medium"
          target="_blank"
          rel="noopener"
        >
          Fale no WhatsApp
        </a>
        .
      </p>
    </div>
  );
}
