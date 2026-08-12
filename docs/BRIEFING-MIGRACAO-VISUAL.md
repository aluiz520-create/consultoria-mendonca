# Briefing — migração visual para o formato v2

**Para:** quem for fazer o design das páginas que ainda estão no formato antigo
**Atualizado em:** 12/08/2026, depois da migração do blog
**Site no ar:** https://aluiz520-create.github.io/consultoria-mendonca/

---

## 0. Regra número 1 — parta dos arquivos do repositório

**Sempre leia o arquivo que está no repositório antes de reescrevê-lo.** Não parta de uma
versão gerada numa conversa anterior.

Na última entrega isso custou caro: o pacote trouxe 11 arquivos, e 5 deles (`index.html`,
`app-v2.js`, `sitemap.xml`, `solucoes/index.html`, `agroaudit/index.html`) vieram na versão
original de dois dias antes. Se tivessem sido copiados por cima, teriam apagado:

- os dois blocos de JSON-LD da home (`ProfessionalService` e `FAQPage`)
- o `LEAD_ENDPOINT` do formulário do AgroAudit
- 14 URLs do `sitemap.xml` (todos os artigos do blog e todos os boletins)
- a normalização das URLs internas para a forma de diretório

Foram descartados um a um na conferência. Para não repetir: **entregue no pacote só os
arquivos que você realmente alterou.** Se um arquivo não faz parte do trabalho daquela
rodada, deixe-o de fora.

Segunda regra, do mesmo espírito: **preserve o conteúdo.** Se um texto, um número, um link
de pagamento ou um bloco inteiro vai mudar, isso é decisão de negócio — sinalize em vez de
alterar silenciosamente no meio de um trabalho de layout.

---

## 1. Onde estão as duas camadas

### Já no formato novo — `estilo-v2.css` + `app-v2.js`

| Página | Arquivo |
|---|---|
| Home | `index.html` |
| Soluções | `solucoes/index.html` |
| Materiais | `materiais/index.html` |
| AgroAudit | `agroaudit/index.html` |
| Índice do blog | `blog/index.html` |
| **Artigo-piloto** | `blog/nota-rejeitada-ibs-cbs-o-que-fazer.html` |

São a **referência**. Não redesenhar: copiar delas.

### Ainda no formato antigo — `styles.css` + `script.js`

| Grupo | Arquivos | Observação |
|---|---|---|
| **Artigos do blog** | 6 restantes | **próxima tarefa** — ver seção 4 |
| Boletim | `boletim/index.html` + 6 diários | gerado automaticamente, ver seção 6 |
| Quiz IBS/CBS | `obrigado-ibs-cbs/index.html` | 292 linhas de JS próprio |
| Simulador | `simulador/index.html` | 129 linhas de JS próprio |
| SafraCerta | `saas/index.html` | página de venda do ERP |
| Guia Anti-Rejeição | `produtos/guia-anti-rejeicao/index.html` | página de venda, R$ 29 |
| Pagamento | `pagamento.html` | botão de copiar Pix |
| Painel | `painel/index.html` | uso interno, prioridade baixa |

### Fora dos dois sistemas (CSS inline próprio)

`link/index.html` (linktree do Instagram), `textos/index.html`, `baixar/index.html`.
O linktree merece alinhar cor e tipografia, mas não precisa do layout de site.

---

## 2. O que muda entre v1 e v2

|  | v1 (antigo) | v2 (novo) |
|---|---|---|
| Fundo | creme `#faf7f0` | papel `#F6F4EF` |
| Verde | `#1b3a2b` / `#2f5d3f` | tinta `#0E1512`, verde `#2E7D5B`, menta `#7FD3A8` |
| Destaque | dourado `#c9a24b` | âmbar `#C8862A` |
| Tipografia | Segoe UI / system | **Archivo** + **IBM Plex Mono** |
| Cantos | `border-radius: 12px` | `2px` — quase reto |
| Sombra | `0 4px 16px` | nenhuma; separação por linha de 1px |
| Grid | `.container` | `.wrap` (máx. 1240px, padding 24px) |
| Tom | cartões arredondados, emoji | editorial, denso, mono nos rótulos |

A régua: **linha em vez de sombra, retângulo em vez de cartão arredondado, mono para
rótulo e número.**

---

## 3. O design system v2

Tudo em `estilo-v2.css`. Não crie CSS novo sem checar se a classe já existe.

### Tokens

```css
--ink:#0E1512    --ink2:#2A332F   --mut:#5C6B64
--paper:#F6F4EF  --paper2:#EFEDE6 --line:rgba(14,21,18,.14)
--grn:#2E7D5B    --grn2:#4FA97F   --mint:#7FD3A8
--amb:#C8862A    --amb2:#9A6412   --red:#B4472F
```

Cores de estado: verde `#4FA97F` = certo · âmbar `#C8862A` = atenção · vermelho `#B4472F` = inconsistência.

### Estrutura e blocos

| Classe | Para quê |
|---|---|
| `.wrap` | container de 1240px |
| `.sec` | espaçamento vertical de seção |
| `.dark` | inverte o bloco para fundo tinta |
| `.eyebrow` | rótulo mono acima do título |
| `.lead` / `.sub` | texto de apoio grande / cinza |
| `.btn` / `.btn2` | botão sólido / contornado |
| `.grid` `.g2` `.row` | layout |
| `.cards` | grade com separação de 1px |
| `.box` `.panel` `.dash` | caixa contornada / painel tinta / borda tracejada |
| `.kv` | item de lista com linha em cima |
| `.tag` | rótulo mono pequeno |
| `.bars` `.track` | barras de índice |
| `.faq` `.faqq` · `.tabs` `.tab` | acordeão · filtros |
| `.field` `.chip` | formulário em bloco escuro |
| `.hide` | esconder |

### Artigo e prosa — use nos textos longos

| Classe | Para quê |
|---|---|
| `.art` | coluna de leitura de 760px |
| `.crumb` | migalha mono (`BLOG / TÍTULO`) |
| `.art .meta` | linha de autoria e tempo de leitura |
| `.prose` | corpo do texto (h2, h3, ul, ol, strong, table já estilizados) |
| `.note` | caixa de destaque com barra âmbar (atualização, aviso legal) |
| `.artcta` | bloco de material relacionado no fim do artigo |
| `.postlist` | lista de artigos do índice |

### Esqueleto de página

```
<head>  título · description · canonical · og:* · favicons · fonts · estilo-v2.css
        (+ JSON-LD de Article nos artigos)
<body>
  <header class="site"> … logo + nav.main + a.cta …
  <main>
    <article class="wrap sec">
      <div class="art">     crumb + h1 + meta
      <div class="art prose">  o texto
      <div class="artcta">     material relacionado
    <section class="dark sec">  bloco de fechamento com CTA
  </main>
  <footer class="site dark">
  <script defer src="/consultoria-mendonca/assets/ga.js">
  <script defer src="/consultoria-mendonca/app-v2.js">
```

Header e footer são **idênticos** em todas as páginas v2 — copie sem alterar.

---

## 4. Próxima tarefa: os 6 artigos restantes

`blog/nota-rejeitada-ibs-cbs-o-que-fazer.html` é o **molde**. Replique nestes:

- `blog/validacoes-ibs-cbs-adiadas-o-que-muda.html`
- `blog/cnpj-produtor-rural-2026-ou-2027.html`
- `blog/nfpe-obrigatoria-produtor-rural.html`
- `blog/tabela-cbenef-goias.html`
- `blog/reforma-tributaria-agronegocio-2026.html`
- `blog/ibs-cbs-agro-aliquotas.html`

Para cada um: **leia o arquivo atual, preserve o texto e as tabelas, troque só a casca.**
Mantenha `canonical`, `og:*` e `description` que já existem, e acrescente o JSON-LD de
`Article` no padrão do piloto. O índice do blog já lista os 7 e não precisa mudar.

Enquanto não terminar, quem clica num artigo não migrado cai no visual antigo — por isso
vale fazer os 6 numa rodada só.

### Depois disso

1. **Boletim** (7 páginas) — mesma lógica de artigo, ler seção 6 antes
2. **SafraCerta** (`saas/`) — página de venda, merece atenção de conversão
3. **Quiz** e **Simulador** — layout simples, cuidado com o JS (seção 5)
4. **Guia Anti-Rejeição** e **Pagamento**
5. **Painel** — uso interno, pode ficar por último
6. **Linktree** — só alinhar cor e tipografia

---

## 5. O que não pode quebrar

**Funcionalidades com JS próprio** — o layout muda, o comportamento não:

- `obrigado-ibs-cbs/index.html` — quiz de 6 perguntas, 292 linhas inline
- `simulador/index.html` — cálculo CBS/IBS, 129 linhas inline
- `painel/index.html` — lê `painel/dados.json`, 117 linhas inline
- `pagamento.html` — copiar Pix, depende de `#copyPixBtn` e `#pixKey`

Páginas que ainda carregam `script.js` precisam manter um `<span id="year">` no rodapé: a
primeira linha do arquivo escreve nele sem verificar se existe. Ao migrar para `app-v2.js`
essa dependência some — o v2 verifica tudo antes de usar.

**Analytics** — `assets/ga.js` em todas as páginas, e os `data-ev` / `data-origem` nos
links são o que alimenta o GA4. Ao reescrever um bloco, leve os atributos junto:
`clique_whatsapp`, `clique_email`, `clique_instagram`, `clique_google`,
`clique_quiz_ibs_cbs`, `clique_simulador`, `clique_blog`, `clique_boletim`,
`clique_safracerta`, `clique_agroaudit`, `clique_diagnostico`, `clique_guia_anti_rejeicao`,
`compra_guia_siagri`, `compra_kit_cst`, `compra_planilha_custos`, `compra_contrato`,
`diagnostico_iniciado`, `diagnostico_concluido`, `lista_agroaudit_enviada`.

**SEO** — preserve `canonical`, `og:*` e `twitter:card` de cada página. URLs internas na
forma de diretório (`/blog/`, `/saas/`, `/simulador/`, `/boletim/`), igual ao canonical —
não volte para `/blog/index.html`. URL nova precisa entrar no `sitemap.xml`.

**Menu** — as páginas v1 já foram religadas às novas. Ao migrar, use o `nav.main` do v2.

**Preços e checkouts são reais** — não invente, não arredonde, não mude:

| Item | Preço | Onde |
|---|---|---|
| Guia Parametrização SIAGRI | R$ 147 | `pay.kiwify.com.br/dZOYUoq` |
| Kit CST/cClassTrib/cBenef | R$ 197 | `pay.kiwify.com.br/jX8PK2D` |
| Planilha de custos | R$ 97 | `pay.kiwify.com.br/vGZ5nvZ` |
| Contrato arrendamento | R$ 67 | `pay.kiwify.com.br/E4S9SDX` |
| Guia Anti-Rejeição | R$ 29 | `pay.kiwify.com.br/0nNxK94` |
| SafraCerta | R$ 97/mês | signup na Vercel |
| Parametrização fiscal | a partir de R$ 1.500 | orçamento |
| Acompanhamento mensal | a partir de R$ 900/mês | orçamento |

Pix: CNPJ 52.394.324/0001-55.

---

## 6. O boletim se regenera sozinho

`boletim/AAAA-MM-DD.html` é criado todo dia pela skill `boletim-agro`
(`.claude/skills/boletim-agro/SKILL.md`), que manda **copiar a estrutura de
`boletim/2026-08-08.html`**.

Ao migrar o boletim: migre `boletim/2026-08-08.html` **e** atualize a instrução da skill
para apontar para a nova referência. Sem isso, o boletim do dia seguinte nasce em v1 de novo.

---

## 7. Como conferir antes de dar por pronto

1. **Sem rolagem horizontal** em 360px, 900px e 1280px
2. **Nenhum link quebrado**, incluindo âncoras
3. **A funcionalidade da página ainda roda** — refaça o quiz, o simulador, o cálculo
4. **Zero erro no console**
5. JSON-LD válido como JSON; `sitemap.xml` válido como XML
6. **Diff contra o arquivo do repositório** — confira que só mudou o que devia mudar

---

## 8. Dois pendentes que não são de design

**Card errado na home.** Na seção de conteúdos do `index.html`, o card do Guia
Anti-Rejeição está descrito como *"Parametrização fiscal no SIAGRI para o agro"* — que é o
outro produto, o de R$ 147. A descrição certa é a do guia de IBS/CBS, como já está em
`/materiais/`.

**Lead do AgroAudit não é gravado.** O `LEAD_ENDPOINT` no topo do `app-v2.js` está vazio.
Enquanto estiver assim, o cadastro só existe se a pessoa clicar em "Confirmar pelo
WhatsApp" — a tela de sucesso não significa que algo foi guardado. Falta colar um endpoint
(Formspree ou equivalente). Não é trabalho de design, mas convém saber.
