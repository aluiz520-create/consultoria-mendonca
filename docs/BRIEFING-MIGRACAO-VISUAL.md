# Briefing — migração visual para o formato v2

**Para:** quem for fazer o design das páginas que ficaram no formato antigo
**Situação:** o site está no ar com dois sotaques visuais convivendo. Quatro páginas já
estão no formato novo (v2); vinte e uma continuam no antigo (v1). Este documento diz o
que é cada coisa, em que ordem migrar e o que não pode quebrar no caminho.

Site: https://aluiz520-create.github.io/consultoria-mendonca/

---

## 1. Onde estão as duas camadas

### Já no formato novo — `estilo-v2.css` + `app-v2.js`

| Página | Arquivo |
|---|---|
| Home | `index.html` |
| Soluções | `solucoes/index.html` |
| Materiais | `materiais/index.html` |
| AgroAudit | `agroaudit/index.html` |

Estas são a **referência**. Não redesenhar: copiar delas.

### Ainda no formato antigo — `styles.css` + `script.js`

| Grupo | Arquivos | Observação |
|---|---|---|
| Blog | `blog/index.html` + 7 artigos | **maior prioridade** — é a porta de entrada de busca |
| Boletim | `boletim/index.html` + 6 diários | gerado automaticamente, ver seção 5 |
| Quiz IBS/CBS | `obrigado-ibs-cbs/index.html` | 292 linhas de JS próprio |
| Simulador | `simulador/index.html` | 129 linhas de JS próprio |
| SafraCerta | `saas/index.html` | página de venda do ERP |
| Guia Anti-Rejeição | `produtos/guia-anti-rejeicao/index.html` | |
| Pagamento | `pagamento.html` | tem o botão de copiar Pix |
| Painel | `painel/index.html` | uso interno, prioridade baixa |

### Fora dos dois sistemas (CSS inline próprio)

`link/index.html` (linktree), `textos/index.html`, `baixar/index.html`.
Não têm `styles.css` nem `estilo-v2.css`. O linktree é usado na bio do Instagram —
vale alinhar a cor e a tipografia, mas ele não precisa do layout de site.

---

## 2. O que muda entre v1 e v2

|  | v1 (antigo) | v2 (novo) |
|---|---|---|
| Fundo | creme `#faf7f0` | papel `#F6F4EF` |
| Verde | `#1b3a2b` / `#2f5d3f` | tinta `#0E1512`, verde `#2E7D5B`, menta `#7FD3A8` |
| Destaque | dourado `#c9a24b` | âmbar `#C8862A` |
| Tipografia | Segoe UI / system | **Archivo** + **IBM Plex Mono** (Google Fonts) |
| Cantos | `border-radius: 12px` | `2px` — quase reto |
| Sombra | `0 4px 16px` | nenhuma; separação por linha de 1px |
| Grid | `.container` | `.wrap` (máx. 1240px, padding 24px) |
| Tom | cartões arredondados, ícones emoji | editorial, denso, monoespaçado nos rótulos |

O v2 é mais seco e mais editorial. A régua: **linha em vez de sombra, retângulo em vez
de cartão arredondado, mono para rótulo e número.**

---

## 3. O design system v2

Tudo vive em `estilo-v2.css` (83 linhas). Não crie CSS novo sem antes checar se já existe
a classe.

### Tokens

```css
--ink:#0E1512    --ink2:#2A332F   --mut:#5C6B64
--paper:#F6F4EF  --paper2:#EFEDE6 --line:rgba(14,21,18,.14)
--grn:#2E7D5B    --grn2:#4FA97F   --mint:#7FD3A8
--amb:#C8862A    --amb2:#9A6412   --red:#B4472F
```

Semântica das cores de estado, usada no diagnóstico e no AgroAudit:
verde `#4FA97F` = está certo · âmbar `#C8862A` = atenção · vermelho `#B4472F` = inconsistência.

### Componentes prontos

| Classe | Para quê |
|---|---|
| `.wrap` | container de 1240px |
| `.sec` | espaçamento vertical de seção |
| `.dark` | inverte o bloco para fundo tinta |
| `.eyebrow` | rótulo mono acima do título (`01 — IDENTIFICAÇÃO`) |
| `.lead` / `.sub` | texto de apoio grande / cinza |
| `.btn` / `.btn2` | botão sólido / contornado |
| `.grid` `.g2` `.row` | layout |
| `.cards` | grade com separação de 1px (não é cartão com sombra) |
| `.box` | caixa contornada dentro de bloco escuro |
| `.panel` | painel tinta sobre fundo claro |
| `.kv` | item de lista com linha em cima |
| `.tag` | rótulo mono pequeno |
| `.bars` `.track` | barras de índice |
| `.faq` `.faqq` | acordeão |
| `.tabs` `.tab` | filtros (usado em Materiais) |
| `.field` `.chip` | formulário em bloco escuro |
| `.dash` | caixa de borda tracejada (dado sob sigilo) |
| `.hide` | esconder |

Modificador `.on-dark` no `<header class="site">` quando a página abre em fundo escuro
(ver `agroaudit/index.html`).

### Esqueleto de página

Copie de `solucoes/index.html` — é o exemplo mais limpo. Estrutura:

```
<head>  título · description · canonical · og:* · favicons · fonts · estilo-v2.css
<body>
  <header class="site"> … logo + nav.main + a.cta …
  <main>
    <section class="wrap">  <p class="eyebrow"><a>INÍCIO</a> / SEÇÃO</p>  <h1>
    … blocos …
    <section class="dark sec">  bloco de fechamento com CTA
  </main>
  <footer class="site dark">  … institucional + lista de links …
  <script defer src="/consultoria-mendonca/assets/ga.js">
  <script defer src="/consultoria-mendonca/app-v2.js">
```

O header e o footer são **idênticos** nas quatro páginas v2 — copie sem alterar, só
mudando o `.cta` quando fizer sentido.

---

## 4. Ordem sugerida

1. **Blog** (8 páginas) — entrada de busca, e o layout de artigo é o mais reutilizável.
   Faça `blog/index.html` + um artigo primeiro, aprove, e replique nos outros 6.
2. **Boletim** (7 páginas) — mesma lógica de artigo, ler seção 5 antes.
3. **SafraCerta** (`saas/`) — página de venda; merece atenção de conversão, não só de cor.
4. **Quiz e Simulador** — layout simples, mas cuidado com o JS (seção 6).
5. **Guia Anti-Rejeição** e **Pagamento**.
6. **Painel** — uso interno, pode ficar por último ou nem migrar.
7. **Linktree** — só alinhar cor e tipografia.

---

## 5. O boletim é gerado automaticamente

`boletim/AAAA-MM-DD.html` é criado todo dia pela skill `boletim-agro`
(`.claude/skills/boletim-agro/SKILL.md`), que manda **copiar a estrutura de
`boletim/2026-08-08.html`**.

Portanto: ao migrar o boletim, migre `boletim/2026-08-08.html` **e** atualize a instrução
da skill para apontar para a nova referência. Se migrar só as páginas, o boletim do dia
seguinte nasce no formato antigo de novo.

---

## 6. O que não pode quebrar

**Funcionalidades com JS próprio** — o layout muda, o comportamento não:

- `obrigado-ibs-cbs/index.html` — quiz de 6 perguntas, 292 linhas inline
- `simulador/index.html` — cálculo CBS/IBS, 129 linhas inline
- `painel/index.html` — lê `painel/dados.json`, 117 linhas inline
- `pagamento.html` — botão de copiar Pix, depende de `#copyPixBtn` e `#pixKey` em `script.js`

Todas as páginas que carregam `script.js` precisam manter um `<span id="year">` no rodapé —
a primeira linha do arquivo escreve nele sem verificar se existe, e some sem ele o JS quebra.
Ao migrar para `app-v2.js`, essa dependência desaparece (o v2 verifica tudo antes de usar).

**Analytics** — `assets/ga.js` em todas as páginas, e os atributos `data-ev` / `data-origem`
nos links são o que alimenta os eventos do GA4. Ao reescrever um bloco, leve os `data-ev`
junto. Lista dos que existem hoje: `clique_whatsapp`, `clique_email`, `clique_instagram`,
`clique_google`, `clique_quiz_ibs_cbs`, `clique_simulador`, `clique_blog`, `clique_boletim`,
`clique_safracerta`, `clique_agroaudit`, `clique_diagnostico`, `clique_guia_anti_rejeicao`,
`compra_guia_siagri`, `compra_kit_cst`, `compra_planilha_custos`, `compra_contrato`,
`diagnostico_iniciado`, `diagnostico_concluido`, `lista_agroaudit_enviada`.

**SEO** — cada página tem `canonical`, `og:*` e `twitter:card`. Preserve. As URLs internas
seguem a forma de diretório (`/blog/`, `/saas/`), igual ao canonical — não volte para
`/blog/index.html`. Qualquer URL nova precisa entrar no `sitemap.xml`.

**Menu** — as páginas v1 já foram religadas às novas. O menu delas hoje é
`Soluções · AgroAudit · Materiais · Blog · Contato` (+ o autolink da própria seção).
Ao migrar, use o `nav.main` do v2, que tem a mesma lista.

**Links de pagamento** — os 4 links da Kiwify em `materiais/index.html` e o Pix
(CNPJ 52.394.324/0001-55) são reais. Não mexer nos endereços.

---

## 7. Como conferir antes de dar por pronto

1. **Sem rolagem horizontal** em 360px, 900px e 1280px. Foi assim que apareceu o bug do
   hero do SafraCerta: um `margin-right: -90px` sobrando 90px para fora da tela.
2. **Nenhum link quebrado** — incluindo âncoras. As páginas v1 apontavam para `#servicos`
   e `#ebook`, que não existem mais na home nova; hoje apontam para `#solucoes` e
   `#conteudos`.
3. **A funcionalidade da página ainda roda** — refaça o quiz, o simulador, o cálculo.
4. **Zero erro no console.**
5. Se mexer em `sitemap.xml`, validar como XML; se mexer em JSON-LD, validar como JSON.

---

## 8. Um detalhe pendente, não é de design

O formulário do AgroAudit tem `LEAD_ENDPOINT` vazio no topo do `app-v2.js`. Enquanto
estiver assim, o cadastro não é gravado em lugar nenhum — o lead só existe se a pessoa
clicar em "Confirmar pelo WhatsApp". Precisa de um endpoint (Formspree ou equivalente)
colado ali. Não é trabalho de design, mas convém saber que a tela de sucesso, hoje, não
significa que o cadastro foi guardado.
