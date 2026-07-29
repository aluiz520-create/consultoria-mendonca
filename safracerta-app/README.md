# SafraCerta

Sistema de gestão agrícola e financeira para produtores rurais e escritórios do agro, organizado na hierarquia Empresa → Safra → Fazenda → Cultura → Talhão → Centro de Resultado. Começou como MVP enxuto (descrito em [`../plano-monetizacao-saas.md`](../plano-monetizacao-saas.md) e [`../docs/arquitetura-tecnica-saas.md`](../docs/arquitetura-tecnica-saas.md)) e está evoluindo para o fluxo operacional completo da safra: planejamento → estoque → compras → operações agrícolas → colheita → venda → resultado (DRE).

Stack: Next.js 14 (App Router) + Supabase (Postgres + Auth + RLS) + Tailwind CSS + Recharts.

## O que já funciona (MVP)

- Cadastro/login (e-mail e senha) — cada novo usuário ganha automaticamente uma `account` (multi-tenant) via trigger no banco.
- **Hierarquia: Empresa → Safra (ciclo agrícola, ex. "2025/2026") → Fazenda → Cultura → Talhão → Plantio.** Safra e Cultura são cadastros próprios da conta, reutilizados em toda a empresa. Talhão é obrigatório e é o ponto de entrada na fazenda; dentro dele, cada Plantio é a combinação específica de uma Safra + uma Cultura naquele Talhão, e é ali que moram custos (Operações), colheita e resultado. Quem não quer dividir a fazenda cadastra um único talhão representando a área toda.
- Operações (`/app/operacoes`, por plantio): lançamento de custo por categoria, com controle de pagamento — marca se já foi pago (à vista) ou informa vencimento (a prazo), com status (Pago / A vencer / Vencido) e botão de marcar como pago.
- Financeiro (`/app/financeiro`): fluxo de pagamento com tudo que está em aberto (ordenado por vencimento, vencidos em destaque), total pendente e total vencido, e histórico dos pagos recentemente.
- Registro de produção colhida (sacas e umidade) na tela de Operações, fechando o ciclo previsto × realizado: custo/saca e margem passam a usar a produção real assim que ela é registrada, em vez da estimativa.
- Dashboard: custo total, custo/ha, custo/saca, margem de break-even, gráfico por categoria, evolução mensal e comparativo de custo/ha entre fazendas.
- Contratos de arrendamento/parceria com status de vencimento (ativo / vencendo / vencido), aditivos (reajuste, prorrogação, mudança de valor/área) com histórico, e encerramento antecipado com motivo.
- Contratos de venda de produção (comercialização da safra) em `/app/contratos/venda`: comprador, quantidade, preço por saca/tonelada/kg, valor total calculado, forma de pagamento e status de entrega.
- Rateio de despesas entre plantios: uma compra que atende mais de um plantio (fazenda/talhão diferentes) pode ser dividida por percentual em `/app/operacoes/rateio`, gerando automaticamente uma operação em cada plantio.
- Centro de Resultado (Produção / Administrativo / Máquinas / Comercial): todo custo e toda receita ficam automaticamente ligados a um centro, herdado da categoria de custo já escolhida (ou do tipo de receita) — sem nenhum campo ou clique extra no formulário.
- Estoque (`/app/estoque`): cadastro de produtos (sementes, fertilizantes, defensivos, combustíveis...) com saldo calculado a partir das entradas e saídas; a API bloqueia registrar uma saída maior que o saldo disponível.
- Equipe e Máquinas (`/app/recursos`): cadastro de funcionários, máquinas e implementos (com custo/hora opcional), usado pelas operações agrícolas.
- Compras (`/app/compras`): toda compra de insumo/produto gera automaticamente, em um só lançamento, a entrada no estoque e a conta a pagar em Operações (com centro de resultado herdado da categoria) — apagar a compra desfaz as duas automaticamente.
- Auditoria: toda criação, alteração e exclusão em fazendas, talhões, culturas, safras, plantios, operações, contratos, aditivos e rateios fica registrada (quem fez, quando, valor anterior x novo), visível em `/app/atividade`.
- Cobrança recorrente via Asaas (Pix, boleto ou cartão): tela de plano em `/app/configuracoes/plano`, criação/atualização de assinatura, webhook que atualiza o status a cada pagamento e bloqueio automático de acesso (redireciona para a tela de plano) quando a assinatura fica atrasada ou cancelada.

## Roteiro do ERP completo (em andamento)

O escopo foi ampliado de MVP enxuto para o fluxo operacional completo da safra. Etapas, na ordem:

1. ✅ Centro de Resultado
2. ✅ Cadastros base: Funcionários, Máquinas, Implementos (`/app/recursos`)
3. ✅ Estoque: produtos, saldo, movimentações (`/app/estoque`)
4. ✅ Compras (`/app/compras`) — origem obrigatória do custo (gera conta a pagar + entrada em estoque)
5. Operações agrícolas por talhão — funcionário/máquina/implemento/horas/produtos, com baixa automática de estoque
6. Colheita completa — peso, umidade, armazém
7. Venda completa — cliente, contrato, frete, desconto, recebimentos parciais
8. Resultado/DRE completo — lucro bruto/líquido, custos administrativos/arrendamento/financeiro, indicadores por hectare/saca

## Outras pendências

- Geração de PDF do contrato.
- Alertas via WhatsApp (vencimento de contrato, lembrete de lançamento mensal) — hoje só há o campo `alertas` no banco, sem o job/integração.
- Assistente de IA (Claude API) para insights automáticos do dashboard.
- Módulo fiscal (CST/cClassTrib/cBenef).

## Configuração local

1. Crie um projeto gratuito em [supabase.com](https://supabase.com).
2. No SQL Editor do projeto, rode **nesta ordem**: `supabase/migrations/0001_init.sql`, `0002_asaas.sql`, `0003_regras_negocio.sql`, `0004_contratos_venda.sql`, `0005_talhoes.sql`, `0006_producao_colhida.sql`, `0007_financeiro.sql`, `0008_talhao_obrigatorio.sql`, `0009_safra_cultura.sql`, `0010_centro_resultado.sql`, `0011_recursos.sql`, `0012_estoque.sql`, `0013_compras.sql`.
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
