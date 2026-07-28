# SafraCerta

MVP do painel de custo por hectare, contratos de arrendamento/parceria e break-even para produtores rurais e escritórios do agro — descrito em [`../plano-monetizacao-saas.md`](../plano-monetizacao-saas.md) e [`../docs/arquitetura-tecnica-saas.md`](../docs/arquitetura-tecnica-saas.md).

Stack: Next.js 14 (App Router) + Supabase (Postgres + Auth + RLS) + Tailwind CSS + Recharts.

## O que já funciona (MVP)

- Cadastro/login (e-mail e senha) — cada novo usuário ganha automaticamente uma `account` (multi-tenant) via trigger no banco.
- CRUD de fazendas e safras (soja/milho/feijão).
- Lançamento de custos por categoria, por safra.
- Dashboard: custo total, custo/ha, custo/saca, margem de break-even, gráfico por categoria, evolução mensal e comparativo de custo/ha entre fazendas.
- Contratos de arrendamento/parceria com status de vencimento (ativo / vencendo / vencido).

## O que ainda falta (próximos passos, ver plano de 90 dias)

- Cobrança recorrente (Asaas/Stripe) e bloqueio de acesso por inadimplência.
- Geração de PDF do contrato.
- Alertas via WhatsApp (vencimento de contrato, lembrete de lançamento mensal) — hoje só há o campo `alertas` no banco, sem o job/integração.
- Assistente de IA (Claude API) para insights automáticos do dashboard.
- Módulo fiscal (CST/cClassTrib/cBenef).

## Configuração local

1. Crie um projeto gratuito em [supabase.com](https://supabase.com).
2. No SQL Editor do projeto, rode o conteúdo de `supabase/migrations/0001_init.sql`.
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

## Deploy

Pensado para [Vercel](https://vercel.com): importe este diretório (`safracerta-app/`) como projeto, configure as mesmas variáveis de ambiente do `.env.local` e aponte `NEXT_PUBLIC_SITE_URL` para o domínio final. Não é necessário nenhum build step além do padrão do Next.js.

## Nota de segurança

O projeto está fixado no Next.js 14.2.35 (última correção de segurança da série 14.x) em vez da versão mais recente (16.x) para evitar mudanças de API que quebrariam este MVP sem testes. Antes de ir para produção com dados reais de clientes, vale planejar a migração para uma versão mais recente do Next.js e rodar `npm audit` novamente.
