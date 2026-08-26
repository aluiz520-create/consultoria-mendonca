# CHECKPOINT — FASE 0

Este documento registra o estado do repositório no momento em que a Fase 0 foi
considerada estável e um checkpoint reversível foi criado, antes do início de
qualquer nova implementação da Fase 1. Ele não avalia se algo está "bom" ou
"pronto" — apenas fotografa o que existe e o que está confirmado funcionando.

**Regra aplicada neste documento:** nada abaixo foi marcado como confirmado sem eu
ter verificado (código lido, teste ao vivo, ou confirmação sua registrada em
conversa). Onde não verifiquei, está marcado como NÃO AUDITADO NESTE CHECKPOINT —
não presumi.

---

## Estado do projeto

| Campo | Valor |
|---|---|
| Data do checkpoint | 26/08/2026 |
| Branch de origem | `main` |
| Commit no momento do checkpoint | `4d9881835403207dd4de0211853451a451a03053` ("Update index.html") |
| Checkpoint criado como | tag `checkpoint-fase-0` **e** branch `checkpoint-fase-0`, ambos apontando para o commit acima |
| Status de produção | Deploy ativo via Vercel (`consultoria-mendonca.vercel.app`), com histórico de 500+ deployments. O `index.html` também referencia `aluiz520-create.github.io/consultoria-mendonca/` como URL canônica — os dois domínios foram encontrados servindo o mesmo repositório; qual é o domínio "oficial" hoje é uma pergunta para você, não presumi |
| Working tree no momento do checkpoint | Limpo, sem alterações pendentes, sincronizado com `origin/main` |

---

## Funcionalidades confirmadas

| Componente | O que existe | Confirmação |
|---|---|---|
| Captura de leads | `assets/lead.js` — captura UTM, gera/persiste client ID, envia lead ao backend | Código lido; testado ao vivo em sessões anteriores |
| AgroAudit | `/agroaudit/index.html` | Presente no repositório. Registrou 1 clique e 4 visualizações nos últimos 20 dias (GA4) |
| Backend (Apps Script) | `Code.gs`, container-bound à planilha "Leads", implantado como Web App | Código completo lido e evoluído nesta consultoria (funil de 9 estágios, trilha de auditoria) |
| Google Sheets | Planilha "Leads" com abas de leads, histórico e resumo de eventos | Confirmada pela estrutura do `Code.gs` e por teste ao vivo seu (mudança de status registrada corretamente) |
| Lead scoring | Sistema de pontuação (`PONTOS`, `classificar_`) no backend, com `enviarEventoDeScore` no frontend | Código lido |
| Dashboard `/admin/` (CRM) | Painel de leads com KPIs, quebras por origem/status, tabela editável (status, observação, valor) | Evoluído e testado nesta consultoria — end-to-end, com dado real gravado |
| Painel `/painel/` (proprietário) | Dashboard JSON-driven com dados reais de GA4 e Instagram via Windsor.ai | Atualizado e publicado nesta consultoria — confirmado byte a byte |
| Radar Financeiro | `/radar/index.html`, `app.js`, `engine.js` | Presente no repositório. **NÃO AUDITADO NESTE CHECKPOINT** — não testei nem revisei o código |
| CRM | Ver "Dashboard `/admin/`" acima — funil de 9 estágios (`NOVO` → `GANHO`/`PERDIDO`, com diagnóstico dividido em agendado/realizado) | Confirmado |
| UTM | Captura de `utm_source/medium/campaign/content` em `assets/lead.js`, anexada a todo evento | Código lido |
| GA4 | Propriedade 546920453, eventos padronizados via `EVENT_ALIAS`, dados puxados ao vivo via Windsor.ai | Confirmado — dados reais de 07/08 a 26/08/2026 coletados nesta consultoria |
| Tracking (cliques, funil) | `data-ev` em todos os links de WhatsApp e no botão de diagnóstico, traduzido pelo `EVENT_ALIAS` | Revisão de código confirma a implementação correta; **não testado com um clique real** — ver Pendências |
| Automação de conteúdo/Instagram | `automacao/` — scripts `.mjs` para gerar artes, reels, perfil, publicar; skill `.claude/skills/gerar-conteudo` | Presente e com histórico de execução (`historico.json`, artes datadas). **NÃO AUDITADO NESTE CHECKPOINT** em profundidade — não testei os scripts |
| Boletim | `/boletim/` com edições diárias (HTML), skill `.claude/skills/boletim-agro` | Presente, com edições recentes até 26/08/2026 |

### Outros componentes encontrados (não solicitados na lista, não auditados)

O repositório também contém `saas/`, `safracerta-app/`, `simulador/`, `site-dinheiro/`,
`solucoes/`, `textos/`, `link/`, `docs/`, `marca/`, `materiais/`, `produtos/`
(inclui `guia-anti-rejeicao/`, com checkout Kiwify já preenchido no código) e
`obrigado-ibs-cbs/` (a ferramenta principal da oferta atual). Listados aqui por
completude da auditoria; nenhum foi revisado em profundidade neste checkpoint.

---

## Integrações

| Integração | Estado |
|---|---|
| Google Sheets / Apps Script | Ativa — backend do CRM, ver acima |
| GA4 (propriedade 546920453) | Ativa — tracking no site + leitura via Windsor.ai |
| Instagram (@controllerdoagro) | Conectado via Windsor.ai (leitura). Perfil com 477 seguidores na última leitura (26/08) |
| Windsor.ai | Conta `controllerdoagrogmailcom`, plano TRIAL, com GA4 e Instagram conectados. Sem Google Ads, sem conector de pagamento |
| Kiwify | Link de checkout preenchido em `produtos/guia-anti-rejeicao/index.html`. Não confirmei se a conta está ativa/testada — só você sabe |
| Vercel | Hospedagem/deploy ativo, 500+ deployments históricos |
| Google Search Console | **Não conectado** — sem tag de verificação encontrada no site |
| Google Ads | **Não conectado**, nenhuma conta ativa confirmada |

---

## Pendências conhecidas (registradas, não resolvidas neste checkpoint)

- Google Search Console não conectado — bloqueia SEO com dados reais.
- Bio do Instagram: não tenho como confirmar se a correção recomendada em 08/08 foi aplicada.
- Domínio próprio: ainda não comprado (decisão consciente de esperar a 1ª venda).
- Os primeiros 10 contatos diretos (ação manual do proprietário): sem confirmação de que foram feitos.
- Eventos de funil (`whatsapp_clique`, `diagnostico_inicio`, `diagnostico_concluido`, `ferramenta_concluida`, `clique_oferta_guia`) em zero nos últimos 20 dias — código revisado e correto, mas sem teste ao vivo com clique real; hipótese é volume baixo, não bug.
- 1 sessão "Paid Search" no GA4 sem conta Google Ads ativa — não investigada a fundo, sinalizada para validação sua.
- Queda de seguidores no Instagram (611 → 477 em 18 dias) — não investigada a fundo, sinalizada para validação sua.
- Tracking das páginas `/obrigado-ibs-cbs/` e `/produtos/guia-anti-rejeicao/` ainda não vinculado ao sistema de pontuação (`CM.enviarEventoDeScore`).
- `Radar Financeiro` e os scripts de `automacao/` (conteúdo/Instagram) existem no repositório mas não foram auditados nesta consultoria.
- Inconsistência de domínio canônico (GitHub Pages vs. Vercel) — não investigada, sinalizada acima.

---

## Pull Request pendente

Auditoria feita diretamente na interface do GitHub (`Pull requests` → filtro `is:open`):
**nenhum Pull Request está aberto no momento deste checkpoint** (0 Open / 35 Closed).
Dos 35 fechados, 30 foram mesclados e 5 foram fechados sem merge (todos referentes a
edições automáticas do Boletim Agro, entre 08/2026).

Se você tinha um PR específico em mente que não aparece nesta lista, pode já ter
sido fechado ou mesclado antes desta auditoria — me diga o número ou o título que eu
confirmo o histórico dele.

**Não mesclado — não aplicável: não há PR pendente para decidir.**

---

## Segurança e reversibilidade

- Nenhum arquivo funcional foi alterado nesta tarefa. A única alteração de conteúdo é a criação deste próprio documento.
- Nenhum merge foi realizado.
- Nenhum histórico foi reescrito, nenhum commit foi squashed ou forçado.
- Nenhuma branch foi deletada.
- O checkpoint (`tag` + `branch checkpoint-fase-0`) é reversível a qualquer momento: para voltar exatamente a este estado, `git checkout checkpoint-fase-0` restaura o repositório inteiro a este ponto.
