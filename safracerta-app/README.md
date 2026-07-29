# SafraCerta

MVP do painel de custo por hectare, contratos de arrendamento/parceria e break-even para produtores rurais e escritórios do agro — descrito em [`../plano-monetizacao-saas.md`](../plano-monetizacao-saas.md) e [`../docs/arquitetura-tecnica-saas.md`](../docs/arquitetura-tecnica-saas.md).

Stack: Next.js 14 (App Router) + Supabase (Postgres + Auth + RLS) + Tailwind CSS + Recharts.

## O que já funciona (MVP)

- Cadastro/login (e-mail e senha) — cada novo usuário ganha automaticamente uma `account` (multi-tenant) via trigger no banco.
- CRUD de fazendas, talhões (opcional) e safras (soja/milho/feijão) — hierarquia fazenda → talhão → safra.
- Lançamento de custos por categoria, por safra.
- Registro de produção colhida (sacas e umidade) na tela de custos, fechando o ciclo previsto × realizado: custo/saca e margem passam a usar a produção real assim que ela é registrada, em vez da estimativa.
- Dashboard: custo total, custo/ha, custo/saca, margem de break-even, gráfico por categoria, evolução mensal e comparativo de custo/ha entre fazendas.
- Contratos de arrendamento/parceria com status de vencimento (ativo / vencendo / vencido), aditivos (reajuste, prorrogação, mudança de valor/área) com histórico, e encerramento antecipado com motivo.
- Contratos de venda de produção (comercialização da safra) em `/app/contratos/venda`: comprador, quantidade, preço por saca/tonelada/kg, valor total calculado, forma de pagamento e status de entrega.
- Rateio de despesas entre fazendas/safras: uma compra que atende mais de uma safra pode ser dividida por percentual em `/app/custos/rateio`, gerando automaticamente um lançamento de custo em cada safra.
- Auditoria: toda criação, alteração e exclusão em fazendas, safras, custos, contratos, aditivos e rateios fica registrada (quem fez, quando, valor anterior x novo), visível em `/app/atividade`.
- Cobrança recorrente via Asaas (Pix, boleto ou cartão): tela de plano em `/app/configuracoes/plano`, criação/atualização de assinatura, webhook que atualiza o status a cada pagamento e bloqueio automático de acesso (redireciona para a tela de plano) quando a assinatura fica atrasada ou cancelada.

## O que ainda falta (próximos passos, ver plano de 90 dias)

- Geração de PDF do contrato.
- Alertas via WhatsApp (vencimento de contrato, lembrete de lançamento mensal) — hoje só há o campo `alertas` no banco, sem o job/integração.
- Assistente de IA (Claude API) para insights automáticos do dashboard.
- Módulo fiscal (CST/cClassTrib/cBenef).

## Configuração local

1. Crie um projeto gratuito em [supabase.com](https://supabase.com).
2. No SQL Editor do projeto, rode **nesta ordem**: `supabase/migrations/0001_init.sql`, `0002_asaas.sql`, `0003_regras_negocio.sql`, `0004_contratos_venda.sql`, `0005_talhoes.sql`, `0006_producao_colhida.sql`.
3. Copie `.env.example` para `.env.local` e preencha com as chaves do projeto (Project Settings → API):

   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. Instale as dependências e rode:

   ```bash
   npm install
   npm run dev
   ```

5. Acesse `http://localhost:3000`, crie uma conta em `/signup`, confirme o e-mail (o Supabase envia automaticamente) e entre.

## Configurar a cobrança (Asaas)

1. Crie uma conta em [asaas.com](https://www.asaas.com) — comece pelo ambiente **sandbox** (`sandbox.asaas.com`) para testar sem mexer com dinheiro real.
2. Em Integrações → API, copie a **API Key** e preencha `ASAAS_API_KEY` no `.env.local` (mantenha `ASAAS_API_URL=https://sandbox.asaas.com/api/v3` enquanto estiver testando).
3. Em Integrações → Webhooks, cadastre a URL `https://SEU_DOMINIO/api/webhooks/asaas`, marque os eventos `PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED`, `PAYMENT_OVERDUE`, `PAYMENT_DELETED` e `SUBSCRIPTION_DELETED`, e defina um token de autenticação — cole esse mesmo token em `ASAAS_WEBHOOK_TOKEN`.
4. Quando for para produção: troque `ASAAS_API_URL` para `https://api.asaas.com/v3`, use a API Key de produção e cadastre o webhook de produção com o mesmo token.

Os preços dos planos self-service (Starter R$ 97 e Pro R$ 297) ficam em `lib/asaas.ts` (`PLANOS_PRECO`). O plano Cerealista/Escritório é vendido manualmente (o botão na tela de plano leva direto ao WhatsApp), por isso não tem checkout automático.

## Deploy

Pensado para [Vercel](https://vercel.com): importe este diretório (`safracerta-app/`) como projeto, configure as mesmas variáveis de ambiente do `.env.local` (incluindo as do Asaas) e aponte `NEXT_PUBLIC_SITE_URL` para o domínio final. Não é necessário nenhum build step além do padrão do Next.js.

## Nota de segurança

O projeto está fixado no Next.js 14.2.35 (última correção de segurança da série 14.x) em vez da versão mais recente (16.x) para evitar mudanças de API que quebrariam este MVP sem testes. Antes de ir para produção com dados reais de clientes, vale planejar a migração para uma versão mais recente do Next.js e rodar `npm audit` novamente.
