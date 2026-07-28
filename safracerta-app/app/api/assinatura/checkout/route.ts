import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buscarOuCriarCliente, criarAssinatura, atualizarValorAssinatura, obterLinkPagamento, PLANOS_PRECO } from "@/lib/asaas";

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const body = await request.json();
  const { plano, nome, cpfCnpj, email } = body as {
    plano: string;
    nome: string;
    cpfCnpj: string;
    email: string;
  };

  if (!PLANOS_PRECO[plano]) {
    return NextResponse.json({ error: "Plano inválido. Fale com a gente pelo WhatsApp para o plano Cerealista." }, { status: 400 });
  }

  if (!nome || !cpfCnpj || !email) {
    return NextResponse.json({ error: "Preencha nome, e-mail e CPF/CNPJ para gerar a cobrança." }, { status: 400 });
  }

  const { data: perfil } = await supabase.from("users").select("account_id").eq("id", user.id).single();
  if (!perfil) return NextResponse.json({ error: "Conta não encontrada." }, { status: 400 });

  const { data: assinatura } = await supabase
    .from("assinaturas")
    .select("id, asaas_customer_id, asaas_subscription_id, plano")
    .eq("account_id", perfil.account_id)
    .single();

  if (!assinatura) return NextResponse.json({ error: "Assinatura não encontrada." }, { status: 400 });

  try {
    await supabase
      .from("accounts")
      .update({ cpf_cnpj: cpfCnpj, email_cobranca: email })
      .eq("id", perfil.account_id);

    let asaasCustomerId = assinatura.asaas_customer_id;
    if (!asaasCustomerId) {
      const cliente = await buscarOuCriarCliente({ nome, email, cpfCnpj });
      asaasCustomerId = cliente.id;
    }

    let asaasSubscriptionId = assinatura.asaas_subscription_id;
    if (asaasSubscriptionId && assinatura.plano !== plano) {
      await atualizarValorAssinatura(asaasSubscriptionId, plano);
    } else if (!asaasSubscriptionId) {
      const novaAssinatura = await criarAssinatura({ customerId: asaasCustomerId, plano });
      asaasSubscriptionId = novaAssinatura.id;
    }

    await supabase
      .from("assinaturas")
      .update({
        asaas_customer_id: asaasCustomerId,
        asaas_subscription_id: asaasSubscriptionId,
        plano,
        status: "pendente",
      })
      .eq("id", assinatura.id);

    const checkoutUrl = await obterLinkPagamento(asaasSubscriptionId!);

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    const mensagem = error instanceof Error ? error.message : "Erro ao iniciar a assinatura.";
    return NextResponse.json({ error: mensagem }, { status: 400 });
  }
}
