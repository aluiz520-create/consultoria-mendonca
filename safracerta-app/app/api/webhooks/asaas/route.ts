import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

// Usa a service role key: o webhook do Asaas chega sem sessão de usuário,
// então precisa contornar o RLS para atualizar a assinatura correta.
function createAdminClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const EVENTOS_ATIVA = new Set(["PAYMENT_CONFIRMED", "PAYMENT_RECEIVED"]);
const EVENTOS_ATRASADA = new Set(["PAYMENT_OVERDUE"]);
const EVENTOS_CANCELADA = new Set(["PAYMENT_DELETED", "SUBSCRIPTION_DELETED", "PAYMENT_REFUNDED"]);

export async function POST(request: Request) {
  const tokenEsperado = process.env.ASAAS_WEBHOOK_TOKEN;
  const tokenRecebido = request.headers.get("asaas-access-token");

  if (tokenEsperado && tokenRecebido !== tokenEsperado) {
    return NextResponse.json({ error: "Token inválido." }, { status: 401 });
  }

  const payload = await request.json();
  const evento: string = payload.event;
  const subscriptionId: string | undefined = payload.payment?.subscription;

  if (!subscriptionId) {
    // Evento sem cobrança recorrente associada (ex.: pagamento avulso) — ignora.
    return NextResponse.json({ ok: true });
  }

  let novoStatus: string | null = null;
  if (EVENTOS_ATIVA.has(evento)) novoStatus = "ativa";
  else if (EVENTOS_ATRASADA.has(evento)) novoStatus = "atrasada";
  else if (EVENTOS_CANCELADA.has(evento)) novoStatus = "cancelada";

  if (!novoStatus) return NextResponse.json({ ok: true });

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("assinaturas")
    .update({
      status: novoStatus,
      proxima_cobranca: payload.payment?.dueDate ?? null,
    })
    .eq("asaas_subscription_id", subscriptionId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
