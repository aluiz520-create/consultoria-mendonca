const ASAAS_API_URL = process.env.ASAAS_API_URL ?? "https://sandbox.asaas.com/api/v3";

export const PLANOS_PRECO: Record<string, number> = {
  starter: 97,
  pro: 297,
};

interface AsaasCliente {
  id: string;
  name: string;
  email: string;
  cpfCnpj: string;
}

interface AsaasAssinatura {
  id: string;
  customer: string;
  value: number;
  status: string;
}

interface AsaasPagamento {
  id: string;
  invoiceUrl: string;
  status: string;
  subscription?: string;
}

async function asaasRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const apiKey = process.env.ASAAS_API_KEY;
  if (!apiKey) throw new Error("ASAAS_API_KEY não configurada.");

  const res = await fetch(`${ASAAS_API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      access_token: apiKey,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const body = await res.json();

  if (!res.ok) {
    const mensagem = body?.errors?.[0]?.description ?? "Erro ao comunicar com o Asaas.";
    throw new Error(mensagem);
  }

  return body as T;
}

export async function buscarOuCriarCliente(params: {
  nome: string;
  email: string;
  cpfCnpj: string;
}): Promise<AsaasCliente> {
  const existentes = await asaasRequest<{ data: AsaasCliente[] }>(
    `/customers?cpfCnpj=${encodeURIComponent(params.cpfCnpj)}`
  );

  if (existentes.data.length > 0) return existentes.data[0];

  return asaasRequest<AsaasCliente>("/customers", {
    method: "POST",
    body: JSON.stringify({ name: params.nome, email: params.email, cpfCnpj: params.cpfCnpj }),
  });
}

export async function criarAssinatura(params: {
  customerId: string;
  plano: string;
}): Promise<AsaasAssinatura> {
  const valor = PLANOS_PRECO[params.plano];
  if (!valor) throw new Error(`Plano "${params.plano}" não tem preço configurado.`);

  const amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);

  return asaasRequest<AsaasAssinatura>("/subscriptions", {
    method: "POST",
    body: JSON.stringify({
      customer: params.customerId,
      billingType: "UNDEFINED", // deixa o cliente escolher Pix, boleto ou cartão na tela do Asaas
      value: valor,
      nextDueDate: amanha.toISOString().slice(0, 10),
      cycle: "MONTHLY",
      description: `SafraCerta — plano ${params.plano}`,
    }),
  });
}

export async function atualizarValorAssinatura(subscriptionId: string, plano: string): Promise<AsaasAssinatura> {
  const valor = PLANOS_PRECO[plano];
  if (!valor) throw new Error(`Plano "${plano}" não tem preço configurado.`);

  return asaasRequest<AsaasAssinatura>(`/subscriptions/${subscriptionId}`, {
    method: "PUT",
    body: JSON.stringify({ value: valor }),
  });
}

export async function obterLinkPagamento(subscriptionId: string): Promise<string> {
  const pagamentos = await asaasRequest<{ data: AsaasPagamento[] }>(
    `/payments?subscription=${subscriptionId}&limit=1`
  );

  const primeiro = pagamentos.data[0];
  if (!primeiro) throw new Error("Nenhuma cobrança gerada para a assinatura ainda.");

  return primeiro.invoiceUrl;
}
