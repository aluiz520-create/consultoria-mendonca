# Briefing — migração visual para o formato v2

**Para:** quem for fazer o design das páginas que ainda estão no formato antigo
**Atualizado em:** 12/08/2026, depois da migração do SafraCerta
**Placar:** 14 páginas em v2 · 11 em v1 · 3 fora dos dois
**Site no ar:** https://aluiz520-create.github.io/consultoria-mendonca/

---

## 0. Como entregar

**Entregue só os arquivos que você realmente alterou**, e leia cada um no repositório
antes de reescrever. Não parta de uma versão gerada numa conversa anterior.

Isso já custou uma rodada: um pacote trouxe 11 arquivos, e 5 deles vinham na versão de dois
dias antes. Se tivessem sido copiados por cima, teriam apagado o JSON-LD da home, o
`LEAD_ENDPOINT` do AgroAudit, 14 URLs do `sitemap.xml` e a normalização das URLs internas.
As entregas do boletim e do SafraCerta já vieram no formato certo — pasta só com o que
mudou, nada para descartar. É esse o padrão.

**Aconteceu de novo na rodada 3 da auditoria.** O pacote trouxe `index.html`, `app-v2.js` e
`estilo-v2.css`; os dois últimos vinham idênticos ao repositório, e o `index.html` tinha
sido gerado a partir de `963108b` — um commit atrás do repositório. Copiado por cima, teria
desfeito a correção do card do Guia Anti-Rejeição, que voltava a descrever o produto errado.
A rodada 2 sobreviveu porque estava naquele commit; a correção do card, não.

**Como pegar isso em um minuto:** antes de copiar, rode `diff` de cada arquivo do pacote
contra o do repositório e leia **todos** os hunks. Os que você não pediu são os suspeitos —
um deles vai ser uma correção sua sendo desfeita. `git log -S "<trecho>"` diz em qual commit
o trecho entrou e se ele é mais novo que o pacote.

**Preserve o conteúdo.** Texto, número, preço e link de pagamento são decisão de negócio.
Se algo precisa mudar, sinalize — não altere no meio de um trabalho de layout.

### A técnica que funcionou no boletim

Ao migrar uma página com muito dado, **transponha os blocos de conteúdo inteiros em vez de
redigitar.** No boletim, cada bloco v1 foi movido como está para dentro da casca v2, e
depois cada edição foi conferida número a número contra a versão anterior: 156 valores no
total, nenhum perdido, nenhum inventado. Cotação, umidade, número de decreto e data de
fonte não podem sofrer um dígito de desvio — e a única forma de garantir isso é não
retocá-los à mão.

---

## 1. Onde estão as duas camadas

### Já no formato novo — `estilo-v2.css` + `app-v2.js`

| Página | Arquivo |
|---|---|
| Home | `index.html` |
| Soluções | `solucoes/index.html` |
| Materiais | `materiais/index.html` |
| AgroAudit | `agroaudit/index.html` |
| SafraCerta | `saas/index.html` |
| Índice do blog | `blog/index.html` |
| **Artigo-modelo** | `blog/nota-rejeitada-ibs-cbs-o-que-fazer.html` |
| Boletim — índice | `boletim/index.html` |
| Boletim — 6 edições | `boletim/2026-08-07.html` … `2026-08-12.html` |

São a **referência**. Não redesenhar: copiar delas.

### Ainda no formato antigo — `styles.css` + `script.js`

| Página | Arquivo | Observação |
|---|---|---|
| **6 artigos do blog** | ver seção 4 | **próxima tarefa** |
| Quiz IBS/CBS | `obrigado-ibs-cbs/index.html` | 292 linhas de JS próprio |
| Simulador | `simulador/index.html` | 129 linhas de JS próprio |
| Guia Anti-Rejeição | `produtos/guia-anti-rejeicao/index.html` | página de venda, R$ 29 |
| Pagamento | `pagamento.html` | botão de copiar Pix |
| Painel | `painel/index.html` | uso interno, prioridade baixa |

`styles.css` existe só para essas 11 páginas. Quando a última migrar, ele e o `script.js`
saem do site.

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

Tudo em `estilo-v2.css`. Não crie CSS novo sem checar se a classe já existe — e **nada de
bloco `<style>` na página.**

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
| `.cards` | grade separada por linha de 1px — ver nota abaixo |
| `.box` `.panel` `.dash` | caixa contornada / painel tinta / borda tracejada |
| `.kv` | item de lista com linha em cima |
| `.tag` | rótulo mono pequeno — **escreva o texto em maiúsculas** |
| `.hd` | cabeçalho de bloco com rótulo à esquerda e nota à direita |
| `.bars` `.track` | barras de índice |
| `.faq` `.faqq` · `.tabs` `.tab` | acordeão · filtros |
| `.field` `.chip` | formulário em bloco escuro |
| `.hide` | esconder |

> **Nota sobre `.cards`.** A linha de separação vem da **sombra de cada célula**, não do
> fundo do container. Antes era o contrário, e toda última linha incompleta virava um bloco
> cinza vazio — apareceu no fluxo da safra do SafraCerta (9 itens) e em `/materiais/`
> (11 itens). Se você montar um grid parecido à mão, use `.cards` em vez de recriar o
> efeito, senão o problema volta.

### Artigo e prosa — para textos longos

| Classe | Para quê |
|---|---|
| `.art` | coluna de leitura de 760px |
| `.crumb` | migalha mono (`BLOG / TÍTULO`) |
| `.art .meta` | linha de autoria e tempo de leitura |
| `.prose` | corpo do texto (h2, h3, ul, ol, strong, table já estilizados) |
| `.note` | caixa de destaque com barra âmbar (atualização, alerta, aviso legal) |
| `.artcta` | bloco de material relacionado no fim do artigo |
| `.postlist` | lista de artigos ou de edições |

### Esqueleto de página

```
<head>  título · description · canonical · og:* · favicons · fonts · estilo-v2.css
        (+ JSON-LD de Article nos artigos)
<body>
  <header class="site"> … logo + nav.main + a.cta …
  <main>
    <article class="wrap sec">
      <div class="art">        crumb + h1 + meta
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

## 4. Próxima tarefa: os 6 artigos do blog

`blog/nota-rejeitada-ibs-cbs-o-que-fazer.html` é o **modelo**. Replique nestes:

- `blog/validacoes-ibs-cbs-adiadas-o-que-muda.html`
- `blog/cnpj-produtor-rural-2026-ou-2027.html`
- `blog/nfpe-obrigatoria-produtor-rural.html`
- `blog/tabela-cbenef-goias.html`
- `blog/reforma-tributaria-agronegocio-2026.html`
- `blog/ibs-cbs-agro-aliquotas.html`

Para cada um: **leia o arquivo atual, transponha o texto e as tabelas, troque só a casca.**
Mantenha `canonical`, `og:*` e `description` que já existem, e acrescente o JSON-LD de
`Article` no padrão do modelo. O índice do blog já lista os 7 e não precisa mudar.

É a maior fatia que resta e a mais valiosa: o índice do blog já é v2, então hoje quem clica
num artigo cai no visual antigo. Vale fazer os 6 numa rodada só.

### Depois disso

1. **Quiz** e **Simulador** — layout simples, cuidado com o JS (seção 5)
2. **Guia Anti-Rejeição** e **Pagamento**
3. **Painel** — uso interno, pode ficar por último
4. **Linktree** — só alinhar cor e tipografia

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
não use `/blog/index.html`. URL nova precisa entrar no `sitemap.xml`.

**Menu** — as páginas v1 já foram religadas às novas. Ao migrar, use o `nav.main` do v2.

**Preços e checkouts são reais** — não invente, não arredonde, não mude:

| Item | Preço | Onde |
|---|---|---|
| Guia Parametrização SIAGRI | R$ 147 | `pay.kiwify.com.br/dZOYUoq` |
| Kit CST/cClassTrib/cBenef | R$ 197 | `pay.kiwify.com.br/jX8PK2D` |
| Planilha de custos | R$ 97 | `pay.kiwify.com.br/vGZ5nvZ` |
| Contrato arrendamento | R$ 67 | `pay.kiwify.com.br/E4S9SDX` |
| Guia Anti-Rejeição | R$ 29 | `pay.kiwify.com.br/0nNxK94` |
| SafraCerta Starter | R$ 97/mês | signup na Vercel |
| SafraCerta Pro | R$ 297/mês | signup na Vercel |
| Parametrização fiscal | a partir de R$ 1.500 | orçamento |
| Acompanhamento mensal | a partir de R$ 900/mês | orçamento |

Pix: CNPJ 52.394.324/0001-55.

---

## 6. O boletim: feito, e por que ele exigia cuidado extra

Migrado por inteiro — índice e as 6 edições. Fica registrado o motivo de ele ser diferente
das outras seções: **`boletim/AAAA-MM-DD.html` é criado todo dia** pela skill `boletim-agro`
(`.claude/skills/boletim-agro/SKILL.md`), copiando a edição de referência.

A skill já foi atualizada para apontar para `boletim/2026-08-08.html` em v2. **Se algum dia
o formato do boletim mudar de novo, a skill precisa mudar junto** — senão a edição do dia
seguinte nasce no formato velho e a migração se desfaz sozinha.

O índice tem os marcadores `<!-- BOLETIM:INICIO -->` e `<!-- BOLETIM:FIM -->`, entre os
quais a rotina insere a edição mais nova. **Não remova nem renomeie.**

---

## 7. Como conferir antes de dar por pronto

1. **Sem rolagem horizontal** em 360px, 900px e 1280px
2. **Nenhum link quebrado**, incluindo âncoras
3. **A funcionalidade da página ainda roda** — refaça o quiz, o simulador, o cálculo
4. **Zero erro no console**
5. JSON-LD válido como JSON; `sitemap.xml` válido como XML
6. **Diff contra o arquivo do repositório** — confira que só mudou o que devia mudar
7. Em página com dados, **compare os números um a um** com a versão anterior
8. **Olhe a última linha de cada grid** — foi ali que apareceu o bloco cinza do `.cards`

---

## 8. Pendentes que não são de design

**~~Card errado na home.~~ Resolvido.** O card do Guia Anti-Rejeição na seção de conteúdos
do `index.html` estava descrito como *"Parametrização fiscal no SIAGRI para o agro"* — que é
o outro produto, o de R$ 147. Agora descreve o guia de IBS/CBS, alinhado com `/materiais/`.

**Lead do AgroAudit não é gravado.** O `LEAD_ENDPOINT` no topo do `app-v2.js` está vazio.
Enquanto estiver assim, o cadastro só existe se a pessoa clicar em "Confirmar pelo
WhatsApp" — a tela de sucesso não significa que algo foi guardado. Falta colar um endpoint
(Formspree ou equivalente). Não é trabalho de design, mas convém saber.

---

## 9. Rodada 2 da auditoria: acessibilidade e contraste

Aplicada primeiro na home e depois propagada para o resto do v2. **O que agora é padrão de
página** — quem criar página nova no v2 precisa incluir os três primeiros itens:

1. **`<a class="skip" href="#top">Ir para o conteúdo</a>` como primeiro elemento do
   `<body>`**, com `id="top"` no `<main>`. É o atalho que pula o cabeçalho no teclado.
2. **Meta tags completas** — `twitter:title`, `twitter:description`, `twitter:image`,
   `og:image:alt` e `theme-color` (`#0E1512`), além do `og:` que já existia.
3. **Piso de contraste**: texto claro sobre fundo escuro não desce de **`.62`**
   (`rgba(246,244,239,.62)` ou `opacity:.62`). Os `.4`, `.45` e `.5` que existiam foram
   levantados. O `.55` do rodapé e da lista de contato ficou como está — é o piso aceito
   para dado secundário em fundo claro.
4. **Glifo decorativo é `aria-hidden="true"`** — os `□ ■ + −` dos botões de dor e do FAQ
   viravam ruído no leitor de tela. O texto ao lado já diz tudo.
5. **Estado que muda sozinho é anunciado** — a barra do quiz é `role="progressbar"` com
   `aria-valuenow` atualizado a cada pergunta; o enunciado e o resultado são `aria-live`.
6. **Foco sempre visível** — `:focus-visible` com contorno verde está no `estilo-v2.css`,
   vale para o site inteiro, não mexa.

**No celular o cabeçalho recolhe.** Ele ocupava ~22% da tela em 360px. Agora some ao
descer e volta ao subir, via classe `.recolhido` (CSS no `estilo-v2.css`, listener no fim
do `app-v2.js`). Só abaixo de 700px.

**Fora do escopo:** `/simulador/`, `/link/` e `/obrigado-ibs-cbs/` não carregam o
`estilo-v2.css` — continuam no formato antigo, então a classe `.skip` nem existe lá. Quando
forem migradas, entram nos 6 itens acima.

**A skill do boletim foi atualizada junto** (`.claude/skills/boletim-agro/SKILL.md`), e a
edição de referência `boletim/2026-08-08.html` também — é dela que a rotina diária copia.
Sem isso, a edição de amanhã nasceria sem o skip link.
