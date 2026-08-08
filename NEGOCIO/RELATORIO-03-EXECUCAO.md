# RELATÓRIO 03 — EXECUÇÃO

**Data:** 08/08/2026 · Decorre dos Relatórios 01 e 02

---

## 1. Princípio que guia as escolhas técnicas

O gargalo é **distribuição e conversão**, não tecnologia. Então a regra é: **nada que exija
servidor, build, banco de dados ou manutenção.** Cada hora gasta em infraestrutura é uma
hora não gasta em tráfego (§21 do seu prompt: 80/20).

Consequência prática: **HTML estático puro no GitHub Pages**, igual ao resto do site.
Zero dependências, zero custo, zero deploy — `git push` publica.

O ERP (`safracerta-app`, Next.js + Supabase) continua existindo e é o degrau 4′ da escada,
mas **não entra no caminho da primeira venda**. Um SaaS de R$ 97/mês exige confiança que
uma marca com 611 seguidores e 0 clientes ainda não tem.

---

## 2. Arquitetura

```
consultoria-mendonca/            GitHub Pages (estático)
├── index.html                   home comercial
├── obrigado-ibs-cbs/            ◄── FERRAMENTA NOVA (ímã + segmentador)
├── simulador/                   ferramenta existente (funil corrigido)
├── blog/                        SEO — 4 artigos + novos
├── boletim/                     boletim diário (única página com tráfego real hoje)
├── painel/                      ◄── PAINEL DO PROPRIETÁRIO
├── produtos/guia-anti-rejeicao/ ◄── PRODUTO PAGO (arquivo real, entregue pela Kiwify)
├── link/                        página de links da bio
├── NEGOCIO/                     relatórios e operação
└── automacao/                   scripts Node (artes, reels, publicação, métricas)
```

**Banco de dados: nenhum.** Não há cadastro, não há login, não há dado pessoal armazenado
no site. Isso é escolha, não limitação: elimina LGPD desnecessária, elimina custo e elimina
o maior ponto de atrito do funil. O lead é capturado onde ele já está — WhatsApp e Kiwify.

---

## 3. Páginas a construir

| Página | Intenção de busca | Papel no funil | Prioridade |
|---|---|---|---|
| `/obrigado-ibs-cbs/` | "produtor rural precisa CNPJ 2026", "quem está obrigado IBS CBS" | Ferramenta gratuita + segmentação | **P0** |
| `/painel/` | — (interna) | Você acompanhar sem depender de mim | **P0** |
| `/blog/cnpj-produtor-rural-2026-ou-2027.html` | "CNPJ produtor rural obrigatório quando" | SEO → ferramenta | P1 |
| `/blog/nota-rejeitada-ibs-cbs-o-que-fazer.html` | "nota fiscal rejeitada reforma tributária" | SEO → Guia R$ 29 | P1 |
| `/blog/cst-cclasstrib-como-conferir.html` | "cClassTrib qual usar", "CST IBS CBS tabela" | SEO → Guia R$ 29 | P2 |
| `/simulador/` (correção) | — | Adicionar oferta ao resultado | **P0** |

**Sobre SEO programático (§11 do seu prompt):** não vou gerar dezenas de páginas
`/salario-2000/`. Naquele modelo de finanças pessoais fazia sentido porque a variável
(salário) muda a resposta. Aqui, a variável que muda a resposta é o **regime tributário**, e
ela é resolvida **dentro de uma única ferramenta**, não em 40 URLs. Gerar 40 páginas quase
idênticas neste nicho seria exatamente o "manipular o Google" que você proibiu — e o
Google, desde as atualizações de conteúdo útil, pune isso.

---

## 4. Integrações

| Integração | Status | Observação |
|---|---|---|
| **Google Analytics 4** | ✅ ativo (G-GQLS60YM9Y) | instalado 07/08/2026 |
| **Kiwify** (checkout + entrega) | ✅ 4 produtos com link | falta criar o produto de R$ 29 |
| **Pix direto** (`pagamento.html`) | ✅ ativo | manual — só para serviço, não para infoproduto |
| **Windsor.ai** → GA4 + Instagram | ✅ conectado | é como eu leio os números reais |
| **Google Search Console** | ❌ **não conectado** | **maior lacuna de dados** — sem ele, SEO é cego |
| **Meta / Instagram publicação** | parcial | `automacao/publicar.mjs` existe |

### Sobre pagamento — o que eu não fiz e por quê

Não criei credencial, não acessei conta, não configurei gateway. A Kiwify já resolve
checkout + Pix + cartão + **entrega automática por e-mail**, que é exatamente o requisito do
§15. Criar um produto novo lá exige login na sua conta — está na lista de ação.

**Nenhum número de venda aparecerá em qualquer relatório meu sem confirmação real da
Kiwify.** Se eu não tiver o dado, o campo fica vazio, não estimado.

---

## 5. Analytics — o que passa a ser medido

Eventos GA4 na ferramenta nova (`gtag`), todos sem dado pessoal:

| Evento | Dispara quando | Responde a pergunta |
|---|---|---|
| `ferramenta_iniciada` | 1ª resposta | quantos começam de fato |
| `ferramenta_concluida` | resultado exibido (com `perfil`) | taxa de conclusão e **mix do público** |
| `oferta_exibida` | bloco de oferta renderizado | tamanho do público qualificado |
| `clique_oferta_guia` | clique no checkout | intenção de compra |
| `clique_whatsapp` | clique no WhatsApp | intenção de serviço |
| `roteiro_copiado` | copia o roteiro grátis | utilidade real |

O evento `ferramenta_concluida` carrega o `perfil` (`pj_obrigado`, `pf_2027`,
`nao_contribuinte`). Isso responde a pergunta mais valiosa do negócio: **quantos por cento
da audiência tem dor pagável agora.** Se vier 5%, o problema é público, não oferta.

---

## 6. Automações

**Já existem:** `gerar-artes.mjs`, `gerar-reel.mjs`, `publicar.mjs`, `metricas.mjs`,
skills `boletim-agro` e `gerar-conteudo`.

**O que passa a ser automático:** o painel lê métricas via Windsor a cada sessão minha;
o boletim diário já se publica sozinho.

**O que NÃO vou automatizar, de propósito:** publicação em massa, mensagem em massa,
comentário automático, seguir/deixar de seguir em lote. Além de proibido por você, é o
caminho mais rápido para o bloqueio da conta — e a conta é o ativo.

---

## 7. Ordem de execução

**Feito nesta sessão:**
1. ✅ Relatórios 01, 02, 03
2. ✅ Ferramenta `/obrigado-ibs-cbs/`
3. ✅ Correção do funil do `/simulador/`
4. ✅ Produto "Guia Anti-Rejeição" escrito de verdade
5. ✅ Painel do proprietário
6. ✅ Artigos de SEO P1
7. ✅ Lista de AÇÃO NECESSÁRIA DO PROPRIETÁRIO

**Depende de você (bloqueado):**
- Criar o produto de R$ 29 na Kiwify → sem isso não há como comprar
- Corrigir a bio do Instagram
- Conectar o Search Console
- Voltar a publicar

**Próximo ciclo (depende de tráfego existir):**
- Teste A/B de headline e de preço
- Novos artigos guiados pelo Search Console, não por chute
- Decidir se o SafraCerta entra no funil ou fica dormente

---

## 8. Riscos que eu enxergo

| Risco | Probabilidade | O que fazer |
|---|---|---|
| **Você não voltar a publicar** | **alta — é o risco real** | Nada que eu construa funciona com alcance de 1/dia |
| GitHub Pages em subdomínio genérico limita SEO | média | Domínio próprio quando houver receita |
| Público PJ ser pequeno demais na sua base | média | O evento `perfil` vai medir isso em vez de supor |
| Kiwify não aprovar produto de R$ 29 | baixa | Vender direto por Pix como alternativa |
| Informação fiscal desatualizar | média | Datas versionadas e citadas; revisão a cada mudança |

**O risco número 1 não é técnico.** Está tudo pronto e no ar; se o perfil ficar mais 6 dias
sem publicar, o resultado em 30 dias será exatamente o de hoje: R$ 0.
