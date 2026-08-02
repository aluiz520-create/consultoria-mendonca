# 01 — AUDITORIA COMPLETA DO SITE

Auditado em 02/08/2026 · Fonte: código do repositório (`index.html`, `styles.css`,
`script.js`, `blog/`, `saas/`, `simulador/`, `sitemap.xml`).

**Nota geral: 6,4 / 10.**
Tecnicamente competente, estrategicamente confuso, comercialmente subaproveitado.
É um site que **informa** bem e **converte** mal.

---

## 1. Diagnóstico em uma frase

> Você construiu um site de **especialista técnico** para vender para um público de
> **decisores empresariais** — e colocou três negócios diferentes (consultoria, SaaS e
> infoprodutos) competindo pela mesma atenção, sem nenhuma prova de que você existe
> como pessoa.

---

## 2. Posicionamento — nota 5/10 · **problema mais grave do site**

**O que está lá:** `<title>` e `<h1>` dizem *"Gestão Fiscal SIAGRI para o Agronegócio"* /
*"Parametrização Fiscal SIAGRI"* (index.html:7, 76, 82).

**Três problemas:**

**a) Você se posicionou pela ferramenta, não pelo resultado.**
"Parametrização SIAGRI" é *como* você resolve. O diretor de uma cooperativa não acorda
pensando "preciso parametrizar o SIAGRI". Ele acorda pensando *"minha nota tá sendo
rejeitada"*, *"não sei meu custo real"*, *"a Reforma vai me pegar de calças curtas"*.

**b) Você amarrou a marca a um fornecedor terceiro.**
Aliare SIAGRI aparece 8 vezes na home. Isso te transforma em **implantador credenciado
percebido**, não em consultor. Consequências reais:
- Quem usa TOTVS Agro, Siagri concorrente, Protheus ou planilha **se auto-exclui** ao ler a home.
- Se a Aliare mudar de estratégia, muda o seu negócio.
- Implantador compete por preço. Consultor compete por resultado.

**c) O site cobre 3 das suas 18 competências.**
Controladoria Rural, Crédito Rural, Power BI, Fluxo de Caixa, Indicadores, IA,
Armazéns Gerais, Logística, Planejamento Tributário — **nada disso está na home.**
Você tem um arsenal e está mostrando uma ferramenta.

### 🔧 Recomendação (discordando do que está no ar)

Mantenha o fiscal como **isca**, não como **identidade**.

| | Hoje | Proposta |
|---|---|---|
| H1 | GESTÃO FISCAL SIAGRI PARA O AGRONEGÓCIO | **SUA FAZENDA FATURA MILHÕES. VOCÊ SABE O CUSTO DA SUA SACA?** |
| Subtítulo | Parametrização fiscal no Aliare SIAGRI... | Controladoria, gestão financeira e blindagem fiscal para produtores, armazéns, cerealistas e cooperativas. Do custo por talhão ao IBS/CBS na nota. |
| Categoria | Consultoria de parametrização | **Controladoria e Inteligência Fiscal para o Agro** |

SIAGRI continua no site — mas dentro de "Blindagem Fiscal", como *uma* das plataformas
em que você atua, não como a marca.

**Risco dessa mudança:** você perde especificidade no SEO de cauda longa "parametrização
SIAGRI" (que hoje te traz alguns leads muito qualificados).
**Mitigação:** cria uma landing page dedicada `/siagri/` que segura esse termo inteiro,
enquanto a home ganha o posicionamento amplo. Você fica com os dois.

---

## 3. Comunicação e clareza — nota 6/10

**Bom:** linguagem técnica correta, sem enrolação, preços visíveis (raro e corajoso),
o caso real é excelente e específico.

**Ruim:**

1. **"Somos especializados..." (index.html:287) — quem é "nós"?**
   Não existe **uma foto, um nome, uma biografia, um CRC, uma formação**. No agro, a
   confiança é **pessoal**. Ninguém entrega o fiscal da própria fazenda para um logotipo.
   → **Essa é a correção de maior ROI do site inteiro.**

2. **A home tem 6 CTAs concorrentes:** "Ver serviços", "Solicitar orçamento", "Teste
   SafraCerta", "Fazer o simulador", "Quero o checklist", "Comprar agora" (×4),
   "Avaliar no Google". Quando tudo é prioridade, nada é. A taxa de conversão cai por
   paralisia de escolha.

3. **A seção "Como pagar" (index.html:292-305) está no lugar errado.**
   Chave Pix exposta antes do "Contato", em um site que ainda não vendeu nada, comunica
   *"eu preciso do seu dinheiro"* e não *"eu resolvo o seu problema"*.
   → Move para uma página `/pagamento` linkada só depois do fechamento.

4. **"Portfólios Profissionais — a partir de R$ 200" (index.html:163-168)** não tem
   nenhuma relação com agro, fiscal ou gestão. É serviço de freelancer genérico.
   Ele sozinho reposiciona o site inteiro para baixo.

---

## 4. Preço e percepção de valor — nota 4/10 · **segundo problema mais grave**

A vitrine de serviços vai de **R$ 150 a R$ 1.500** na mesma grade visual.

O que acontece na cabeça de um diretor de cerealista com faturamento de R$ 80 milhões
quando ele vê *"Revisão de contratos — a partir de R$ 150"*:

> "Ah, é um freelancer."

E aí ele não te chama para o projeto de R$ 40 mil que ele tinha em mente. **O item mais
barato da sua vitrine define o teto do seu ticket.** Isso é ancoragem de preço, e está
funcionando contra você.

Some-se: o `schema.org` declara `"priceRange": "R$150 - R$1.500"` (index.html:35) — ou
seja, o **Google** está anunciando você como consultoria de até R$ 1.500.

### 🔧 Recomendação
- **Fora da home:** contratos R$150, portfólios R$200, planilhas sob medida R$250.
  (Continuam existindo — viram entregáveis dentro de projetos maiores ou ficam numa
  página `/servicos-avulsos`.)
- **Na home, 4 ofertas, todas ≥ R$ 900**, com faixa declarada por porte de operação.
- `priceRange` no schema → `"R$$$"` ou `"R$900 - R$25.000"`.
- Adicionar um **Diagnóstico de Controladoria** (60–90 min, R$ 0 ou R$ 490 creditável)
  como porta de entrada. É isso que converte Direct em cliente.

---

## 5. Design — nota 7/10

**Bom:** paleta verde/dourado/creme coerente e adulta; sistema de tokens CSS
organizado (`:root` em styles.css); cards consistentes; responsivo.

**Problemas:**

| # | Problema | Onde |
|---|---|---|
| 1 | **Estilo inline pesado** no card do SafraCerta — 14 atributos `style=` | index.html:214-234 |
| 2 | **Emoji como sistema de ícones** (🖥️🧾🌾📊📄🗂️🧮📋). Renderiza diferente em cada SO, quebra a identidade e comunica improviso | home inteira |
| 3 | **`banner-photo.png` = 309 KB** sem `loading="lazy"`, sem WebP, e é a imagem de OG | assets/ |
| 4 | **Fonte de sistema** (`Segoe UI`) — o site não tem tipografia própria. Marca sem tipografia é marca sem rosto | styles.css:20 |
| 5 | `h2 { text-align: center }` global força tudo ao centro — texto centralizado longo tem leitura pior | styles.css:36 |
| 6 | Contraste: `--muted: #5b6660` sobre `--cream: #faf7f0` = ~4.9:1. Passa raspando em AA, falha em AAA | styles.css |

---

## 6. UX e navegação — nota 5,5/10

### 🐞 Bug confirmado
```html
<a href="#ebook">SafraCerta</a>
<a href="#ebook">Materiais</a>
```
`index.html:61-62` — **dois itens de menu diferentes apontam para a mesma âncora.**
Quem clica em "SafraCerta" esperando o produto cai na seção de e-books. Existe uma
página `/saas/index.html` pronta e o menu não leva até ela.

### Outros pontos
- **Sem menu mobile.** Com 7 itens + botão, no celular a navegação quebra ou vira
  scroll horizontal. **A maioria do público-alvo entra pelo celular.**
- **Sem breadcrumb na home**, sem "voltar ao topo", sem barra de progresso.
- **Simulador não captura nada.** O usuário responde 6 perguntas, recebe o resultado e
  **vai embora**. É o melhor ativo de lead-gen do site e ele não pede nome nem WhatsApp.
  → Correção de altíssimo ROI: pedir o contato **antes de revelar o resultado**.
- **Zero links de redes sociais.** Instagram, LinkedIn, YouTube: nenhum. O site e a
  estratégia social não se conversam.
- Checklist da NFP-e "grátis" leva para o WhatsApp com mensagem pré-pronta — funciona,
  mas **não constrói lista de e-mail**. Você está alugando audiência no WhatsApp em vez
  de possuí-la.

---

## 7. Conversão — nota 4,5/10 · **onde você mais perde dinheiro**

| Vazamento | Impacto | Correção |
|---|---|---|
| Simulador sem captura | Perde 100% dos leads mornos | Gate de contato antes do resultado |
| Sem e-mail/lista | Não existe remarketing | Formulário + automação |
| Sem prova social | Não vence objeção de confiança | 3 depoimentos + foto + números |
| Sem escassez/prazo | Nada obriga a agir hoje | **Contador regressivo da Reforma** |
| Um único caso | Amostra pequena demais | 4–6 casos, um por segmento |
| Sem FAQ | Objeções morrem sem resposta | 8 perguntas + `FAQPage` schema |
| CTA genérico ("Solicitar orçamento") | Baixo clique | "Quero meu diagnóstico fiscal gratuito" |
| Sem pixel/analytics visível | Você não sabe o que funciona | GA4 + Meta Pixel + eventos |

### 🚨 O gap de urgência mais caro do site
**Desde 01/08/2026, o destaque de IBS e CBS na NF-e passou a ser obrigatório**, com
preenchimento de CST e cClassTrib e alíquotas de teste. Isso aconteceu **ontem**.

O seu site **não menciona essa data em lugar nenhum**. Você tem exatamente o serviço que
resolve exatamente a dor que acabou de virar obrigação legal para todo o seu público —
e a home fala de forma genérica sobre "Reforma Tributária".

→ **Barra fixa no topo do site, hoje:**
*"Desde 01/08/2026 o destaque de IBS/CBS na NF-e é obrigatório. Sua emissão está
adequada? → Diagnóstico gratuito em 15 minutos"*

---

## 8. SEO — nota 6,5/10

**Bem feito:** canonical, OG completo, Twitter Card, `ProfessionalService` schema com
endereço e telefone, sitemap, robots, verificação do Google Search Console, 4 artigos de
blog com temas de intenção real.

**Falhas:**

1. **Palavra-chave principal errada.** "Parametrização fiscal SIAGRI" tem volume de busca
   ínfimo. O tráfego está em: *cClassTrib*, *cBenef Goiás*, *NFP-e produtor rural*,
   *CST reforma tributária*, *custo de produção soja planilha*, *IBS CBS agro*.
   Seus artigos de blog já atacam alguns desses — **mas a home não.**
2. **Sitemap incompleto:** faltam `/saas/` e `/simulador/`, que já existem e estão
   linkados. Nenhuma URL tem `<lastmod>`.
3. **Schema raso:** falta `Article` nos posts, `FAQPage`, `Person` (autor), `Product`
   nos infoprodutos, `AggregateRating`, `BreadcrumbList`.
4. **Sem autoria (E-E-A-T).** O Google, desde as atualizações de conteúdo útil, pesa
   *quem* escreveu. Não há autor declarado em nenhum artigo.
5. **Blog estagnado:** todos os 4 posts são de "Julho 2026". Sem data legível por máquina
   (`datePublished`), sem frequência, sem links internos entre artigos.
6. **Domínio em `github.io`.** Subdomínio de terceiro tem teto de autoridade e passa
   amadorismo em proposta comercial. `consultoriamendonca.com.br` custa ~R$ 40/ano e o
   GitHub Pages suporta domínio próprio com HTTPS grátis. **Faça isso esta semana.**
7. **Sem Google Business Profile otimizado** além do link de review — sem posts,
   sem fotos, sem perguntas. Para busca local ("consultoria agro Itaberaí") isso é o
   principal fator.

---

## 9. Autoridade — nota 3/10 · **o buraco mais fundo**

Inventário do que existe de prova no site: **1 caso anônimo.**

Não existe: rosto, nome, formação, tempo de mercado, nº de clientes, nº de fazendas
atendidas, hectares sob gestão, depoimento, logotipo de cliente, certificação, palestra,
menção em mídia, perfil social.

Você está pedindo para um empresário confiar o CNPJ dele a um site anônimo.

### 🔧 O mínimo obrigatório (ordem de execução)
1. **Foto profissional sua** na seção Sobre — camisa, ambiente de campo ou escritório.
2. **Bio de autoridade em 3 linhas** com números: *"X anos, Y fazendas atendidas,
   Z inscrições estaduais parametrizadas, R$ N em faturamento sob controladoria."*
3. **3 depoimentos** com nome, cargo e cidade (vídeo de 30s vale por 10 textos).
4. **Bloco "Números"**: hectares, fazendas, notas emitidas sem rejeição, clientes.
5. **Selo Aliare / certificações**, se houver.
6. **Links sociais** no header e footer.

---

## 10. Diferenciais competitivos — nota 5/10 (existem, mas estão escondidos)

Você **tem** um diferencial raro e o site não grita ele:

> **Você é a única pessoa nesse mercado que junta fiscal do agro + controladoria de custo
> + tecnologia própria. Você construiu um ERP agrícola inteiro (SafraCerta).**

O contador do agro não sabe de custo por talhão. O consultor de gestão não sabe de
cClassTrib. A software house não sabe de nenhum dos dois. **Você sabe dos três.**

Hoje o SafraCerta aparece como "mais um produto à venda por R$ 97". Ele deveria aparecer
como **prova de competência**: *"Eu não opino sobre sistema de gestão agrícola.
Eu construí um."*

---

## 11. Plano de correção priorizado

### 🔴 Fazer hoje (impacto alto, esforço baixo)
1. Corrigir o bug do menu (`#ebook` duplicado) → apontar SafraCerta para `/saas/`
2. Barra de urgência IBS/CBS (obrigatoriedade desde 01/08/2026)
3. Capturar contato no simulador antes de mostrar o resultado
4. Tirar "Portfólios R$200" e "Contratos R$150" da vitrine
5. Adicionar `/saas/` e `/simulador/` ao sitemap
6. Links de Instagram no header e footer

### 🟠 Esta semana
7. Foto + bio + números na seção Sobre
8. Novo H1 e posicionamento
9. Menu mobile funcional
10. Domínio próprio `.com.br`
11. GA4 + Meta Pixel + eventos de conversão
12. FAQ com `FAQPage` schema

### 🟡 Este mês
13. Tipografia própria (Archivo + Inter + IBM Plex Mono)
14. Substituir emojis por SVG
15. 3 depoimentos + 3 novos casos (armazém, cooperativa, cerealista)
16. Landing `/siagri/` dedicada
17. Página `/reforma-tributaria/` como hub de conteúdo
18. Otimizar imagens (WebP, lazy)

### 🟢 Trimestre
19. Newsletter com automação
20. Calculadora de custo por saca (segundo lead magnet)
21. Área de membros para compradores dos infoprodutos
22. Cadência de 2 artigos/mês no blog com `Article` schema

---

## 12. Autocrítica desta auditoria

- **Não medi performance real.** Não rodei Lighthouse nem tenho dados de Analytics.
  Os diagnósticos de conversão são baseados em estrutura, não em comportamento medido.
  *Corrigir: instalar GA4 e refazer esta seção com dados em 30 dias.*
- **Não conheço o funil atual.** Se 90% dos seus clientes vêm de indicação, o peso do
  site na estratégia é menor do que assumi — mas a auditoria segue válida, porque o site
  é o que o indicado consulta antes de te chamar.
- **A recomendação de tirar os serviços baratos tem risco real de receita no curto prazo.**
  Se hoje eles representam volume relevante de caixa, a transição deve ser gradual:
  mova para uma página secundária antes de eliminar.
- **Não validei o volume de busca das palavras-chave** que recomendei — usei julgamento
  de mercado, não ferramenta. *Corrigir com Google Keyword Planner antes de reescrever
  a estrutura de conteúdo.*
