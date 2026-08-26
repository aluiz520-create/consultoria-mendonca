# RELATÓRIO 05 — PLANO DE TRÁFEGO PAGO E AQUISIÇÃO DE CLIENTES

**Data:** 13/08/2026 · **Autor:** operador autônomo (Claude) · **Escopo:** tráfego pago (Google Ads
prioritário), Google Business Profile, SEO, conteúdo Instagram/LinkedIn, funil do diagnóstico,
WhatsApp, orçamento, métricas e plano de execução de 30 dias.

> **Regra número 1, cumprida:** nada neste relatório altera layout, identidade visual, Hero,
> diagnóstico, Método Mendonça, cases, soluções, tecnologia, "quem somos" ou preços da Home.
> Toda campanha, anúncio e post aqui leva para páginas que **já existem e já estão no ar**:
> `/`, `/#diagnostico`, `/solucoes/#gestao`, `/solucoes/#fiscal`, `/solucoes/#tecnologia`,
> `/solucoes/#auditoria`, `/obrigado-ibs-cbs/`, `/blog/`, `/materiais/`. Onde encontrei um
> problema na Home, ele está isolado na seção **"Oportunidades futuras"**, no fim — não foi
> corrigido.

## Base usada (e por que isso importa)

Antes de escrever uma linha de anúncio, li o que já existe no repositório: o código real do
site (`index.html`, `solucoes/`, `blog/`, `materiais/`), o manual da marca
(`marca/02-MANUAL-DA-MARCA.md`), a auditoria do site (`marca/01-AUDITORIA-SITE.md`), o plano de
crescimento orgânico (`marca/05-PLANO-CRESCIMENTO.md`), a correção de funil do Instagram
(`marca/09-FUNIL-INSTAGRAM-SITE.md`) e os quatro relatórios de negócio já produzidos
(`NEGOCIO/RELATORIO-01` a `04`). Esses relatórios já tinham decidido uma hipótese vencedora
(IBS/CBS como motor de tráfego e receita) e definido, por enquanto, **não usar tráfego pago** —
a orientação era orgânico primeiro, R$300–500/mês de impulsionamento só a partir da Fase 2.

**O que muda agora:** você pediu explicitamente um plano de tráfego pago, com Google Ads como
prioridade. Isso não invalida o que já foi construído — o funil, o produto, o posicionamento e a
segmentação (PJ obrigado agora × PF com prazo até 2027) continuam sendo a base. O que este
relatório faz é **dar dinheiro a essa hipótese** em vez de esperar só o orgânico, com orçamento
pequeno e critério de corte definido, exatamente como as decisões anteriores neste projeto foram
tomadas.

**Estado real de hoje (linha de base), sem estimar o que não medi:**

| Métrica | Valor real | Fonte |
|---|---:|---|
| Sessões no site (dia com GA4 ativo) | 9 | `painel/dados.json` |
| Seguidores Instagram @controllerdoagro | 611 | `painel/dados.json` |
| Vendas confirmadas | 0 | `painel/dados.json` |
| Conta Google Ads | não existe ainda | a criar |
| Google Search Console | não conectado | ação pendente do proprietário |
| Pixel Meta Ads | não instalado | a criar |
| Google Business Profile | só o link de avaliação | a otimizar |
| Domínio | `aluiz520-create.github.io/consultoria-mendonca/` (subdomínio) | GitHub Pages |

---

## 1. Diagnóstico do marketing atual

**O site é bom e a oferta é real, mas hoje ele não recebe tráfego pago nenhum, e o tráfego
orgânico é mínimo (9 sessões/dia na melhor medição).** Isso não é um problema de produto: é
página estática, com preço visível, com prova técnica (caso documentado + caso anonimizado com
números de porte), FAQ com schema, três ferramentas de diagnóstico gratuitas e uma escada de
produtos que vai de R$29 a R$25.000. O problema é que **nenhum canal pago está ligado** e o
orgânico depende de alguém publicar, o que não vem acontecendo com regularidade.

Pontos que o tráfego pago vai expor rapidamente, e que valem registrar aqui (sem mexer neles
agora):

- Não existe conversão do Google Ads configurada — sem isso, nenhuma campanha pode ser
  otimizada de forma correta.
- Não existe Google Business Profile otimizado além do link de avaliação no rodapé — para busca
  local ("consultoria fiscal agro Itaberaí", "controladoria rural Goiás") isso pesa tanto quanto
  o site.
- O domínio é um subdomínio do GitHub Pages. Google Ads funciona normalmente nele, mas a
  Página de Destino de um anúncio pago com esse domínio comunica menos autoridade do que um
  `.com.br` para quem está decidindo contratar um projeto de R$20 mil.
- O funil pago não tem para onde crescer sem *tracking*: hoje o site mede eventos no GA4
  (`clique_whatsapp`, `clique_diagnostico`, `ferramenta_concluida` etc. via `data-ev`), mas
  esses eventos não estão importados como conversão no Google Ads.

**Conclusão prática:** antes de gastar o primeiro real em mídia, a Seção 16 (checklist) lista o
que precisa estar de pé — é meio dia de trabalho, não um projeto.

---

## 2. Público-alvo prioritário

Não vou correr atrás de "agronegócio" genérico. Com base na oferta real (controladoria, fiscal,
tecnologia, auditoria — preços de R$900 a R$25.000, área de atuação Itaberaí/Goiânia presencial
+ Centro-Oeste presencial + Brasil remoto), a ordem de prioridade é:

| Ordem | Perfil | Por que é prioridade | Onde a dor aparece |
|---|---|---|---|
| 1 | **Produtor rural PJ / regime regular, multi-fazenda** | Já está obrigado ao IBS/CBS desde 03/08/2026; ticket mais alto; decide rápido quando a nota trava | Campanha 5 (IBS/CBS) + Campanha 4 (Fiscal) |
| 2 | **Armazéns gerais e cerealistas** | Compliance específico, ticket muito alto, concorrência quase inexistente (Relatório 01, item #12, nota 63) | Campanha 1 (Controladoria) + Campanha 4 (Fiscal/Auditoria) |
| 3 | **Gestores/administradores de operação multi-fazenda** | São quem sente o problema de planilha espalhada e ERP subutilizado na pele — o comprador operacional, não só o dono | Campanha 3 (ERP/Processos) |
| 4 | **Cooperativas e revendas agrícolas** | Estrutura administrativa maior, múltiplas inscrições estaduais, mesma dor de integração fiscal-financeiro-operacional | Campanha 1, 2 e 4 |
| 5 | **Auxiliar fiscal / responsável por emitir nota** | Não é quem assina o contrato, mas é quem sente a dor primeiro (nota rejeitada) e compra o degrau de R$29–197 do próprio bolso | Campanha 5, produtos digitais |
| 6 | **Produtor rural PF (não obrigado ainda)** | Não compra agora, mas é o volume que alimenta o funil gratuito, salva, compartilha e mede o mercado | Campanha 5, orgânico |
| 7 | **Contador do agro** | Não é cliente — é multiplicador. Um contador que confia manda dezenas de produtores | Conteúdo (Seções 8–10), não campanha paga direta |

**Fora do escopo deste plano, mesmo que "interessante":** produtor de subsistência, agronegócio
fora do Centro-Oeste sem operação de porte, e qualquer público de finanças pessoais (isso
pertence ao projeto `site-dinheiro/`, que é outro negócio, com outra marca, documentado no
Relatório 04 — não misturar tráfego nem orçamento).

---

## 3. Palavras-chave

**Método e limitação, com a mesma transparência dos relatórios anteriores:** não tenho acesso a
Google Keyword Planner nem a uma ferramenta paga de volume de busca. A classificação abaixo é
por **intenção comercial observável** (o tipo de resultado que aparece hoje na SERP, se é
transacional ou informativo, se tem concorrência paga) — não por volume medido. Antes de escalar
orçamento, confirme volume real no Keyword Planner (basta uma conta Google Ads, mesmo sem gastar)
e no Search Console depois de conectado (item 5 do `NEGOCIO/ACAO-NECESSARIA-DO-PROPRIETARIO.md`).

### ALTA intenção (comprador pronto para conversa/contratação)

| Palavra-chave | Tema |
|---|---|
| controladoria rural | Gestão |
| consultoria controladoria rural | Gestão |
| controladoria para fazenda | Gestão |
| consultoria custo de produção agrícola | Gestão |
| gestão financeira rural consultoria | Gestão |
| consultoria crédito rural | Gestão |
| consultoria siagri | ERP |
| parametrização siagri | Fiscal/ERP |
| parametrização fiscal agro | Fiscal |
| cbenef goiás | Fiscal |
| nota fiscal rejeitada agro | Fiscal |
| nota fiscal rejeitada sefaz agronegócio | Fiscal |
| auditoria fiscal rural | Auditoria |
| ibs cbs agronegócio | Reforma |
| ibs cbs produtor rural | Reforma |
| sou obrigado ibs cbs | Reforma |
| cnpj produtor rural obrigatório | Reforma |
| compliance armazém geral | Auditoria |

### MÉDIA intenção (pesquisando solução, ainda comparando)

| Palavra-chave | Tema |
|---|---|
| custo de produção por hectare | Gestão |
| custo por saca soja calcular | Gestão |
| indicadores para fazenda | Gestão/Tecnologia |
| fluxo de caixa fazenda | Gestão |
| erp agrícola | ERP |
| qual erp agrícola escolher | ERP |
| dashboard fazenda power bi | Tecnologia |
| cclasstrib como usar | Fiscal |
| reforma tributária agronegócio | Reforma |
| diferimento ibs cbs insumos agrícolas | Reforma/Fiscal |
| gestão de custos agrícolas | Gestão |
| organização de processos rurais | Processos |

### BAIXA intenção (informativo, útil para SEO/conteúdo, não para lance alto em Ads)

| Palavra-chave | Tema |
|---|---|
| o que é controladoria rural | Gestão |
| o que é cclasstrib | Fiscal |
| o que é ibs e cbs | Reforma |
| planilha custo de produção fazenda grátis | Gestão |
| o que é split payment | Reforma |
| gestão rural conceito | Gestão |

**Regra de uso:** ALTA intenção recebe correspondência de frase/exata e lance mais alto. MÉDIA
recebe frase, com atenção ao termo de pesquisa real nas primeiras duas semanas. BAIXA **não entra
em campanha de pesquisa paga** — vira pauta de blog e Instagram, que é onde o custo de aparecer é
zero (Seções 7–10).

---

## 4. Concorrentes

Pesquisei agora (13/08/2026) quem aparece para os termos acima. Três grupos, com implicações
diferentes para o lance e para o posicionamento do anúncio:

**Consultorias de gestão/financeiro do agro** — concorrem em "controladoria rural" e "gestão
financeira agronegócio": Contador Agro, Hedge Agro Consultoria, AgroInvest Consultoria, Foco
Rural, Studio Agro, França & Silva. Em geral são **contabilidade rural generalista** ou
**consultoria financeira sem a camada fiscal/ERP** — nenhuma junta as três coisas.
([contadoragro.com.br](https://contadoragro.com.br/), [hedgeagro.com.br](https://hedgeagro.com.br/),
[agroinvestconsultoria.com.br](https://agroinvestconsultoria.com.br/),
[focorural.com.br](https://www.focorural.com.br/gestao-financeira-no-agronegocio))

**A própria Aliare/SIAGRI** vende "SIAGRI Consultoria" — um diagnóstico de processos para quem
já usa o ERP deles. É o concorrente mais direto na Campanha 3 (ERP/Processos) e no termo
"consultoria siagri". A diferença que o anúncio precisa deixar clara: a Aliare otimiza o uso do
próprio produto; a Consultoria Mendonça é **independente de fornecedor**, atende quem usa
SIAGRI, myFarm ou qualquer outro sistema — inclusive planilha — e não tem comissão de licença.
([siagri.com.br](https://www.siagri.com.br/), [aliare.co](https://www.aliare.co/controladoria-no-agronegocio/))

**Softwares de gestão agrícola** (Aegro, SSCrop, Connectere) competem em "custo de produção por
hectare" e "planilha de custo" — distribuem calculadora e conteúdo de graça como isca para
assinatura de SaaS. É concorrência forte em conteúdo (SEO), mas fraca em consultoria de fato: eles
vendem ferramenta, não trabalho de parametrização e estruturação dentro da operação do cliente.
([aegro.com.br](https://aegro.com.br/blog/custo-producao-por-hectare-guia-pratico-para-controlar/),
[sscrop.com](https://sscrop.com/))

**Conteúdo institucional e jurídico sobre IBS/CBS no agro** domina a SERP informativa: CNA,
Conjur, escritórios de advocacia tributária (Trad & Cavalcanti), portais como Nota Gateway,
FarmPlus, Brazsoft, GA Agrosoluções. Eles explicam o conceito muito bem — **nenhum entrega o
roteiro de conferência prático que o Guia Anti-Rejeição entrega**, e advocacia tributária tem
ticket alto demais para o auxiliar fiscal que só quer não travar a próxima nota.
([conjur.com.br](https://www.conjur.com.br/2026-jan-17/diferimento-de-ibs-e-cbs-de-insumos-agricolas-a-conta-vai-ficar-para-o-produtor-rural/),
[tradecavalcanti.com.br](https://www.tradecavalcanti.com.br/publicacoes/reforma-tributaria-agronegocio-2026))

**O que isso confirma:** o diferencial real (fiscal + controladoria + tecnologia na mesma mesa,
independente de fornecedor, com preço visível e caso documentado) não tem concorrente direto
juntando as quatro frentes. A concorrência é fragmentada por frente — o que é uma vantagem para
posicionamento de anúncio, mas significa que cada campanha (Seção 5) compete com um concorrente
diferente, não sempre o mesmo.

---

## 5. Campanhas Google

**Por que Google primeiro:** é o único canal onde a pessoa já está procurando a solução — a
intenção existe antes do clique. Meta Ads, neste estágio (zero pixel, zero audiência aquecida,
zero venda confirmada), serviria só para interromper quem não estava procurando nada, com um
ticket que não se decide em um scroll. Ele entra no plano na Seção 14, mas depois do Google.

Estrutura recomendada da conta: **5 campanhas de Pesquisa (Search)**, rede de Display **desligada**
em todas, idioma português, localização Goiás + Centro-Oeste como núcleo (raio ampliado a partir de
Itaberaí/Goiânia) e Brasil inteiro habilitado só nos grupos de anúncio claramente B2B (ninguém
busca "controladoria rural" por acaso). Estratégia de lance: **CPC manual** nas primeiras 2–3
semanas (não há histórico de conversão para o Google otimizar sozinho) — migrar para "Maximizar
conversões" só depois de ter conversões suficientes (Seção 16).

### CAMPANHA 1 — CONTROLADORIA RURAL

| Campo | Definição |
|---|---|
| **Objetivo** | Gerar contato qualificado (WhatsApp ou diagnóstico) de operações que precisam estruturar controladoria: custo de produção, DRE, centro de custo |
| **Público** | Produtores multi-fazenda, diretores/gestores de armazéns, cerealistas, cooperativas · 30–65 anos · Goiás/Centro-Oeste + Brasil remoto |
| **Palavras-chave** | *Frase/exata:* "controladoria rural", "consultoria controladoria rural", "controladoria para fazenda", "controladoria agronegócio", "consultoria custo de produção agrícola", "custo de produção por hectare consultoria", "custo por saca consultoria", "DRE rural", "centro de custo fazenda", "plano de contas rural" |
| **Negativas** | grátis, gratuito, curso, apostila, pdf, download, modelo excel grátis, vaga, emprego, estágio, faculdade, tcc, monografia, o que é, conceito, definição, salário, concurso |
| **Página de destino** | `/solucoes/#gestao` |
| **CTA** | "Falar sobre controladoria" (WhatsApp) · secundário "Fazer o diagnóstico gratuito" |
| **Orçamento inicial** | R$20/dia (~R$600/mês) |
| **KPI principal** | Custo por clique-WhatsApp com origem `solucoes_gestao` (evento já instrumentado) |

### CAMPANHA 2 — GESTÃO FINANCEIRA RURAL

| Campo | Definição |
|---|---|
| **Objetivo** | Leads de quem decide sobre fluxo de caixa, crédito rural e indicadores financeiros — momento de decisão (Plano Safra, renovação de crédito) |
| **Público** | Proprietários e diretores financeiros de fazendas médias-grandes, armazéns e cerealistas |
| **Palavras-chave** | "gestão financeira rural", "consultoria financeira agronegócio", "consultoria gestão financeira fazenda", "fluxo de caixa fazenda", "fluxo de caixa projetado rural", "consultoria crédito rural", "organizar financeiro fazenda", "indicadores para fazenda", "indicadores agronegócio consultoria" |
| **Negativas** | (as mesmas da Campanha 1) + empréstimo pessoal, financiamento consignado, crédito rápido, cartão de crédito, banco digital |
| **Página de destino** | `/solucoes/#gestao` — **nota:** é a mesma página da Campanha 1, porque essa é a estrutura real do site hoje (a frente "Gestão" cobre custo e financeiro juntos). A diferenciação está na palavra-chave e no anúncio, não em uma página nova — criar página nova não está no escopo deste plano |
| **CTA** | "Falar sobre o financeiro da operação" |
| **Orçamento inicial** | R$15/dia (~R$450/mês) |
| **KPI principal** | Custo por clique-WhatsApp qualificado + menção a "crédito"/"Plano Safra" na conversa |

### CAMPANHA 3 — ERP / SIAGRI / PROCESSOS

| Campo | Definição |
|---|---|
| **Objetivo** | Leads de quem já usa SIAGRI/myFarm/outro ERP e o usa pela metade, ou está decidindo se compra um sistema |
| **Público** | Gestores administrativos e responsáveis por TI/operações de fazendas e armazéns |
| **Palavras-chave** | "consultoria siagri", "parametrização siagri", "siagri myfarm consultoria", "treinamento siagri", "erp agrícola", "sistema de gestão agrícola", "qual erp agrícola escolher", "erp para fazenda", "dashboard fazenda power bi", "indicadores agronegócio", "extrair relatório siagri" |
| **Negativas** | download, crack, curso gratuito, vaga emprego siagri, trabalhe conosco, reclame aqui |
| **Página de destino** | `/solucoes/#tecnologia` |
| **CTA** | "Descobrir qual sistema faz sentido" / "Destravar o sistema que já tenho" |
| **Orçamento inicial** | R$15/dia (~R$450/mês) |
| **KPI principal** | Custo por clique-WhatsApp com origem `tecnologia_indicacao` / `tecnologia_destravar` |

### CAMPANHA 4 — FISCAL / PARAMETRIZAÇÃO

| Campo | Definição |
|---|---|
| **Objetivo** | Leads de dor fiscal aguda e recorrente (não ligada só à data da Reforma): nota rejeitada, CST/cClassTrib/cBenef errado, multi-inscrição estadual |
| **Público** | Auxiliar fiscal, gestor administrativo, produtor PJ, armazém, cerealista, revenda |
| **Palavras-chave** | "nota fiscal rejeitada agro", "nota fiscal rejeitada sefaz", "erro cst cclasstrib", "parametrização fiscal siagri", "parametrização fiscal agro", "cbenef goiás", "cclasstrib como usar", "auditoria fiscal rural", "revisão fiscal fazenda", "conferência nota fiscal agro", "compliance armazém geral" |
| **Negativas** | grátis, curso, concurso fiscal, receita federal vaga, declaração imposto de renda pessoa física |
| **Página de destino** | `/solucoes/#fiscal` (grupos "Nota Rejeitada" e "Parametrização Fiscal") · `/solucoes/#auditoria` (grupo "Auditoria Fiscal Rural") |
| **CTA** | "Falar sobre o fiscal da minha operação" |
| **Orçamento inicial** | R$20/dia (~R$600/mês) — prioridade alta: dor aguda + preço de entrada baixo (projetos a partir de R$1.500) |
| **KPI principal** | Custo por clique-WhatsApp com origem `solucoes_fiscal`/`solucoes_auditoria` + cliques nos produtos digitais (Guia R$29, Kit R$197) |

### CAMPANHA 5 — IBS/CBS NO AGRONEGÓCIO ★ prioridade tática do plano

| Campo | Definição |
|---|---|
| **Objetivo** | Capturar o pico de urgência legal (obrigatório desde 03/08/2026 para regime regular; 01/01/2027 para PF) e alimentar o funil **já construído**: ferramenta gratuita → Guia R$29 → Kit R$197 → parametrização R$1.500 → mensal R$900 (Relatórios 01–03) |
| **Público** | Produtor PJ/regime regular (dor aguda, tem dinheiro, tem pressa) + produtor PF (audiência/compartilhamento, converte depois) |
| **Palavras-chave** | "ibs cbs agronegócio", "ibs cbs produtor rural", "sou obrigado ibs cbs", "nota fiscal ibs cbs obrigatória", "cnpj produtor rural obrigatório", "cnpj produtor rural 2027", "produtor rural precisa cnpj", "reforma tributária agronegócio", "reforma tributária produtor rural", "split payment agro", "diferimento ibs cbs insumos agrícolas" |
| **Negativas** | concurso, vaga, aposentadoria, inss, declaração imposto de renda pessoa física — **e nada além disso**: esta é a única campanha em que mantenho termos mais informativos ("o que muda"), porque o funil da própria ferramenta faz a qualificação — é a hipótese vencedora dos Relatórios 01 e 02 |
| **Página de destino** | `/obrigado-ibs-cbs/` (principal) · `/blog/reforma-tributaria-agronegocio-2026.html` (alternativa, testar em grupo separado) |
| **CTA** | "Descobrir se já estou obrigado" |
| **Orçamento inicial** | R$25/dia (~R$750/mês) — o maior das cinco |
| **KPI principal** | **Não é clique.** É o evento `ferramenta_concluida` (conclusão) e `clique_oferta_guia` (intenção de compra), já instrumentados no GA4 conforme `NEGOCIO/RELATORIO-03-EXECUCAO.md` |

---

## 6. Anúncios prontos

Todos os títulos respeitam o limite de 30 caracteres e as descrições o de 90 — confira no editor
do Google Ads antes de publicar, alguns podem precisar de ajuste fino de um ou dois caracteres.
Nenhum título ou descrição promete economia, redução percentual ou resultado financeiro — só o
que está publicado no site.

### Campanha 1 — Controladoria Rural

**Títulos (10):** Controladoria Rural Técnica · Custo Real por Hectare e Saca · Fluxo de Caixa da
Fazenda · Número no Lugar Certo · Diagnóstico Grátis em 40s · Gestão para Multifazenda · DRE
Rural e Centro de Custo · Atendimento Direto e Técnico · Goiás, Centro-Oeste e Remoto ·
Consultoria Mendonça

**Descrições (4):**
1. Custo por hectare, saca e talhão. Fluxo de caixa projetado. Diagnóstico gratuito em 40s.
2. Trabalhamos com o seu contador, não no lugar dele. Atendimento direto, sem intermediário.
3. Controladoria orçada pelo porte da operação: fazendas, inscrições estaduais e equipe.
4. Presencial em Goiás e Centro-Oeste. Consultoria e parametrização remotas para o Brasil.

**Sitelinks:** Fazer o diagnóstico (`/#diagnostico`) · Ver projetos realizados (`/#casos`) ·
Conhecer as 4 frentes (`/solucoes/`) · Materiais e guias (`/materiais/`)
**Callouts:** Sem substituir seu contador · Atendimento técnico direto · Presencial GO/Centro-Oeste
· Remoto para o Brasil
**Snippet estruturado (Serviços):** Controladoria rural · Custo de produção · Fluxo de caixa · DRE
rural · Centro de custo
**Chamada:** (64) 99222-6766

### Campanha 2 — Gestão Financeira Rural

**Títulos (10):** Gestão Financeira do Agro · Fluxo de Caixa Projetado · Prepare o Crédito Rural ·
Decida com Número, Não Achismo · Diagnóstico Grátis em 40s · Estrutura Financeira Rural ·
Realizado x Orçado por Safra · Atendimento Direto e Técnico · Goiás, Centro-Oeste e Remoto ·
Consultoria Mendonça

**Descrições (4):**
1. Fluxo de caixa projetado e indicadores para decidir — não só para registrar o passado.
2. Prepare o dossiê financeiro para banco e Plano Safra antes de precisar dele com pressa.
3. Trabalhamos com o seu contador, não no lugar dele. Diagnóstico gratuito em 40 segundos.
4. Controladoria e gestão financeira orçadas pelo porte da operação. Fale com quem executa.

**Sitelinks/callouts/snippets:** os mesmos da Campanha 1.

### Campanha 3 — ERP / SIAGRI / Processos

**Títulos (10):** ERP Comprado, Mas Subusado? · Parametrização SIAGRI e myFarm · Não Vendemos
Licença de Sistema · Indicação Técnica, Não Comercial · Treinamento da Equipe no ERP · Dashboards
e Indicadores Reais · Diagnóstico Grátis em 40s · Atendimento Direto e Técnico · Goiás,
Centro-Oeste e Remoto · Consultoria Mendonça

**Descrições (4):**
1. Avaliamos o que a operação usa hoje e indicamos o que faz sentido — sem comissão de fabricante.
2. Configuramos o que ficou pela metade e treinamos a equipe a extrair o que a gestão precisa.
3. Trabalhamos com SIAGRI, myFarm e outros ERPs agrícolas. Diagnóstico gratuito em 40 segundos.
4. Dashboards em Power BI e planilhas sob medida, a partir do que a operação já tem.

**Sitelinks:** Descobrir qual sistema faz sentido (`/solucoes/#tecnologia`) · Destravar meu
sistema atual (`/solucoes/#tecnologia`) · Ver projetos realizados (`/#casos`) · Fazer o
diagnóstico (`/#diagnostico`)
**Callouts:** Sem comissão de fabricante · Indicação técnica · Treinamento da equipe · SIAGRI e
myFarm

### Campanha 4 — Fiscal / Parametrização

**Títulos (10):** Nota Rejeitada pela Sefaz? · Parametrização Fiscal do Agro · CST, cClassTrib e
cBenef Certos · Multi-Inscrição Estadual · Testamos Antes de Valer · A Partir de R$1.500 o
Projeto · Acompanhamento Fiscal Mensal · Diagnóstico Grátis em 40s · Atendimento Direto e Técnico
· Consultoria Mendonça

**Descrições (4):**
1. Revisamos e parametrizamos o fiscal no seu ERP, produto por produto, inscrição por inscrição.
2. Rejeição de nota não é sorte — é parametrização. Descubra o erro antes da próxima emissão.
3. Parametrização a partir de R$1.500. Acompanhamento fiscal mensal a partir de R$900.
4. Trabalhamos com o seu contador, não no lugar dele. Diagnóstico gratuito em 40 segundos.

**Sitelinks:** Falar sobre o fiscal (`/solucoes/#fiscal`) · Falar sobre auditoria
(`/solucoes/#auditoria`) · Guia Anti-Rejeição R$29 (`/produtos/guia-anti-rejeicao/`) · Ver
projetos realizados (`/#casos`)
**Callouts:** Teste em homologação antes de valer · Multi-inscrição estadual · A partir de R$1.500
· Acompanhamento mensal a partir de R$900

### Campanha 5 — IBS/CBS no Agronegócio

**Títulos (10):** Já Está Obrigado ao IBS/CBS? · Teste Grátis em 40 Segundos · Nota Sem os Campos?
Ela Trava · Obrigatório Desde 03/08/2026 · CNPJ Rural: 2026 ou 2027? · Descubra Seu Caso Agora ·
Sem Cadastro, Resultado na Hora · Guia Anti-Rejeição por R$29 · Reforma Tributária no Agro ·
Consultoria Mendonça

**Descrições (4):**
1. Seis perguntas dizem em qual regime você está e o que isso significa em data. Sem cadastro.
2. Desde 03/08/2026, quem está no regime regular precisa emitir com IBS/CBS preenchido.
3. Produtor pessoa física teve prazo adiado para 01/01/2027 — o que muda para o PJ é agora.
4. Guia Anti-Rejeição: a ordem certa de conferir antes de emitir. Entrega automática por e-mail.

**Sitelinks:** Fazer o teste agora (`/obrigado-ibs-cbs/`) · Ler sobre a Reforma
(`/blog/reforma-tributaria-agronegocio-2026.html`) · CNPJ: 2026 ou 2027?
(`/blog/cnpj-produtor-rural-2026-ou-2027.html`) · Guia Anti-Rejeição
(`/produtos/guia-anti-rejeicao/`)
**Callouts:** Sem cadastro · Resultado na hora · Roteiro de conferência incluso · Entrega
automática

---

## 7. Google Business Profile

O perfil hoje só tem o link de avaliação no rodapé do site. Plano completo:

**Categoria principal sugerida:** Consultor de negócios (ou "Consultoria de gestão", conforme
disponível no painel — a lista de categorias do Google muda; confirmar as mais próximas na hora
de configurar). **Categorias secundárias:** Consultor financeiro · Consultor tributário.
Evite qualquer categoria de "Contador"/"Contabilidade" — o site é explícito: "não substituímos o
seu contador".

**Descrição da empresa** (usar o texto real do site, sem inflar):

> Controladoria, fiscal, tecnologia e auditoria para o agronegócio. Ajudamos produtores
> multi-fazenda, armazéns gerais, cerealistas, revendas e cooperativas a organizar processos,
> parametrizar o ERP agrícola (SIAGRI, myFarm e outros) e estruturar a controladoria: custo de
> produção por hectare e por saca, fluxo de caixa projetado, indicadores e adequação ao IBS/CBS
> da Reforma Tributária. Trabalhamos com o seu contador, não no lugar dele. Base em Itaberaí
> (GO), atendimento presencial em Goiás e Centro-Oeste, consultoria remota para todo o Brasil.

**Serviços (aba Serviços do perfil), com descrição curta cada:**

| Serviço | Descrição |
|---|---|
| Controladoria rural | Custo de produção por hectare, saca e talhão; fluxo de caixa projetado; DRE rural; centro de custo. |
| Parametrização fiscal (SIAGRI e outros ERPs) | CST, cClassTrib, cBenef e adequação ao IBS/CBS, produto por produto, inscrição por inscrição. |
| Acompanhamento fiscal mensal | Manutenção de parâmetros, novos produtos e monitoramento da Reforma Tributária. A partir de R$900/mês. |
| Avaliação e indicação de sistemas | Avaliação do que a operação usa hoje e indicação técnica do que faz sentido — sem comissão de fabricante. |
| Treinamento de equipe em ERP agrícola | Configuração do que ficou pela metade e treinamento da equipe administrativa. |
| Dashboards e indicadores | Extração de indicadores e dashboards em Power BI a partir do sistema ou da planilha atual. |
| Auditoria e conferência | Conferência de documentos, lançamentos e processos; identificação de inconsistências entre fontes. |
| Diagnóstico gratuito de 40 segundos | Dez perguntas, resultado por área (financeiro, fiscal, processos, tecnologia, indicadores). Sem cadastro. |

**Perguntas e respostas (Q&A) — usar a FAQ real que já está no schema do site**, publicando você
mesmo as perguntas mais prováveis para que não fiquem em branco à espera de um estranho perguntar
algo errado:

1. *Vocês substituem meu contador?* → "Não. Trabalhamos com o seu contador, não contra ele. Ele
   cuida da obrigação acessória e da apuração; nós cuidamos de a informação sair certa da fazenda."
2. *Atendem fora de Goiás?* → "Sim. Base em Itaberaí (GO), presencial em Goiás e Centro-Oeste,
   remoto para todo o Brasil."
3. *Vocês atendem só quem usa SIAGRI?* → "Não. Somos especialistas em SIAGRI, mas controladoria,
   custo de produção e fluxo de caixa são feitos em qualquer sistema — inclusive planilha."
4. *Qual o investimento?* → "Parametrização fiscal a partir de R$1.500. Acompanhamento mensal a
   partir de R$900. Controladoria é orçada por porte da operação."

**Primeiras publicações (Posts do Google Business Profile), uma por semana no primeiro mês:**

1. "Desde 03/08/2026, o preenchimento de IBS/CBS na nota fiscal do agro é obrigatório para o
   regime regular. Descubra em 40 segundos se sua operação já está obrigada." → link para
   `/obrigado-ibs-cbs/`.
2. "Quatro frentes, um problema de cada vez: controladoria, fiscal, tecnologia e auditoria para
   o agro." → link para `/solucoes/`.
3. "Publicamos o que temos documentado: veja o projeto de parametrização de NF-e para
   produtores de frutas cítricas." → link para `/#casos`.
4. "Guia Anti-Rejeição: a ordem certa de conferir antes de emitir a nota, com IBS/CBS." → link
   para `/produtos/guia-anti-rejeicao/`.

**Estratégia de avaliações — sem inventar nenhuma.** Depois da entrega de um projeto (não durante
— o momento certo é logo após o cliente ver o resultado funcionando), envie por WhatsApp:

> "Fulano, o projeto está entregue e funcionando. Se puder, uma avaliação sua no Google ajuda
> outros produtores a nos encontrar: [link g.page/r/Ccmp5DRSXjGvEBM/review]. Não precisa ser
> longa — só real."

Nunca oferecer desconto ou qualquer coisa em troca da avaliação (viola as políticas do Google e
é reversível a qualquer momento). Se uma avaliação vier abaixo de 5 estrelas, responder
publicamente, sem defensiva, perguntando o que faltou — isso constrói mais confiança do que só
avaliações perfeitas.

---

## 8. Estratégia SEO

O blog já tem 7 artigos publicados cobrindo bem a Reforma Tributária, cBenef e NFP-e (listados em
`/blog/`). Não vou repetir esses temas — vou preencher o que falta, priorizado pelo que alimenta
diretamente uma campanha paga ou o funil de produtos.

| # | Título | Palavra-chave principal | Intenção | Público | CTA / página destino | Potencial comercial |
|---|---|---|---|---|---|---|
| 1 | Controladoria Rural: o que é e como estruturar na sua fazenda | controladoria rural | Informacional → comercial | Produtor/gestor médio-grande | Diagnóstico → `/solucoes/#gestao` | **Alto** — página pilar, alimenta Campanhas 1 e 2 |
| 2 | 5 sinais de que sua fazenda perdeu o controle (antes do fechamento da safra) | sinais de que preciso de controladoria | Informacional | Produtor médio | Diagnóstico → `/#diagnostico` | Alto — liga direto à ferramenta principal do site |
| 3 | SIAGRI, myFarm ou outro ERP: como saber se está na hora de trocar (ou só destravar o que você tem) | qual erp agrícola escolher | Comercial | Gestor administrativo | `/solucoes/#tecnologia` | Médio-alto — alimenta Campanha 3 |
| 4 | Auditoria fiscal rural: o que é, quando contratar e o que ela encontra | auditoria fiscal rural | Comercial | Armazém, cerealista, cooperativa | `/solucoes/#auditoria` | Alto — termo de alta intenção sem concorrência direta |
| 5 | Quem precisa se registrar como contribuinte de IBS/CBS no agro (e quem fica de fora) | quem é contribuinte ibs cbs agro | Informacional → urgência | Produtor PJ e PF | `/obrigado-ibs-cbs/` | Alto — alimenta a Campanha 5 |
| 6 | Diferimento de IBS/CBS em insumos agrícolas: o que muda para quem compra | diferimento ibs cbs insumos agrícolas | Informacional técnico | Produtor e revenda | `/solucoes/#fiscal` | Médio — tema técnico com pouca cobertura fora de advocacia |
| 7 | Compliance de armazém geral: os documentos que o auditor vai pedir | compliance armazém geral | Comercial | Armazéns e cerealistas | `/solucoes/#auditoria` | Alto — ticket alto, quase sem concorrente |
| 8 | O dossiê financeiro que o banco pede antes de aprovar o Plano Safra | dossiê financeiro plano safra | Comercial | Produtor médio-grande | `/solucoes/#gestao` | Médio — sazonal, mas ticket alto |
| 9 | Multi-inscrição estadual no agro: por que cada IE parametriza diferente | multi inscrição estadual agro | Técnico → comercial | Cooperativas, multi-fazenda | `/solucoes/#fiscal` | Médio |
| 10 | Quanto custa uma nota rejeitada: o caminhão parado na balança | custo de nota fiscal rejeitada | Urgência | Produtor PJ | `/produtos/guia-anti-rejeicao/` | Alto — reforça a Campanha 4 e 5, converte no produto de R$29 |

**Estrutura padrão para cada artigo:** H1 = o título da tabela · H2s = "O problema real" (a dor,
concreta) → "Como isso aparece na prática" (com o caso documentado do site, quando aplicável) →
"O que fazer" (passo a passo genérico e honesto) → "Quando vale chamar alguém" (transição suave
para CTA) · H3s conforme subtemas técnicos (ex.: por regime, por tipo de operação). CTA sempre no
fim do artigo e uma vez no meio, nunca mais que isso — o texto tem que valer a leitura mesmo para
quem não vai contratar agora.

**Antes de escrever qualquer um desses:** conecte o Google Search Console (pendente desde o
Relatório 03) e envie o `sitemap.xml`. Sem isso, os próximos artigos continuam sendo escolhidos
por julgamento, não por dado real de busca — o mesmo aviso que os relatórios anteriores já
fizeram.

---

## 9. Conteúdo Instagram

Os 10 pilares que você definiu orientam a distribuição. Formato compacto abaixo — capa/gancho,
estrutura e fechamento prontos para publicar; para expandir qualquer um em roteiro completo de
slide a slide, use a skill `GERAR CONTEÚDO`, que já está configurada no repositório e segue o
manual da marca (Verde Cerrado + Ouro Safra, IBM Plex Mono para número, sem emoji como ícone).

| # | Pilar | Título | Formato | Objetivo | Público |
|---|---|---|---|---|---|
| 1 | Gestão rural | "O número que a sua fazenda esconde" | Carrossel | Autoridade | Produtor médio-grande |
| 2 | Fiscal | "5 erros que derrubam a nota" | Carrossel | Salvamento/utilidade | Auxiliar fiscal, produtor PJ |
| 3 | IBS/CBS | "Amanhã sua nota pode ser rejeitada" | Reel | Alcance | Produtor PJ, regime regular |
| 4 | ERP agrícola | "O ERP foi comprado inteiro. Usado pela metade." | Reel | Alcance | Gestor administrativo |
| 5 | Erros de gestão | "Planilha em 3 setores, 3 versões da verdade" | Post único (imagem) | Identificação | Produtor médio |
| 6 | Auditoria | "O que o banco vê no seu dossiê — e o que falta" | Carrossel | Autoridade | Armazém, cerealista |
| 7 | Diagnóstico de operações | "64/100: a nota da maioria das operações que atendemos" | Post único | Prova/curiosidade | Todos |
| 8 | Casos e experiências | "3 inscrições, 4 produtos, uma nota que quase travou" | Carrossel (caso real) | Prova social | Produtor PJ |
| 9 | Bastidores | "O que perguntamos antes de falar em sistema" | Reel | Confiança/humanização | Todos |
| 10 | Tecnologia | "Power BI não resolve planilha bagunçada" | Post único | Autoridade técnica | Gestor de TI/operações |

**Cada post segue o fechamento de dupla camada já corrigido em `marca/09-FUNIL-INSTAGRAM-SITE.md`:**
Reels fecham com **link na bio** (`/#diagnostico` ou `/obrigado-ibs-cbs/`, conforme o tema);
carrosséis fecham com **Direct + palavra-chave** (REFORMA, DIAGNÓSTICO, CUSTO). Sempre com um
pedido de salvamento explícito antes do CTA de conversão — é a alavanca que está zerada hoje.

**Exemplo completo (post #3, Reel, o de maior potencial de alcance):**
- **Texto:** "Desde 03/08/2026 os campos de IBS e CBS na nota do agro deixaram de ser opcionais
  pra quem está no regime regular. Errou o par CST + cClassTrib, a Sefaz rejeita — e o caminhão
  fica parado na balança."
- **CTA:** "Não sabe em qual caso você está? Link na bio: 40 segundos e você descobre."
- **Formato:** Reel, 25–35s, tese no primeiro 1s, número na tela.
- **Objetivo:** alcance frio + tráfego para `/obrigado-ibs-cbs/`.
- **Público:** produtor PJ, regime regular.

### 5 carrosséis (conceito completo, pronto para virar arte)

1. **"5 erros que derrubam a nota"** — capa com o número 5 em Ouro Safra · slides: cada erro em
   uma frase + o que fazer · fechamento: "Salva esse checklist — é a ordem exata de conferência
   (NCM → CST → cClassTrib → natureza)." + assinatura da marca.
2. **"O que é controladoria rural, em 6 slides"** — capa "Controladoria não é planilha bonita" ·
   slides: definição, os 4 números que faltam na maioria das operações, exemplo de custo por
   talhão · fechamento: link no Direct com "CUSTO".
3. **"Amanhã sua nota pode ser rejeitada"** (já existe, reforçar com nova arte) — foco no
   calendário 08/2026 → 01/2027 · fechamento: "Salva esse cronograma."
4. **"Caso real: 3 inscrições, 4 produtos, zero rejeição"** — usa o case documentado do site
   (frutas cítricas, Goiás) com números reais (3 IEs, 4 produtos, 281 códigos cBenef mapeados) ·
   fechamento: "Quer ver se sua parametrização tem o mesmo risco? Direct: PARAMETRIZAÇÃO."
5. **"ERP comprado inteiro, usado pela metade"** — sintomas (relatório manual, exportar e colar,
   informação que chega depois da decisão) · fechamento: link na bio para diagnóstico.

### 5 ideias de vídeos curtos (Reels)

1. "3 sinais de que sua fazenda tá no escuro financeiro" — 20s, tese + 3 sinais + link na bio.
2. "O que eu pergunto antes de falar em sistema novo" — bastidores, tom de conversa.
3. "cClassTrib em 30 segundos, sem economês" — explicação rápida e técnica, sem prometer nada.
4. "Por que eu não vendo licença de ERP" — diferencial, confiança, indicação técnica.
5. "O índice de controle: 64 de 100 — o que isso quer dizer" — usa o dado real do Hero do site
   como gancho, sem inventar número novo.

---

## 10. Conteúdo LinkedIn

Tom mais formal, sem emoji, textos mais longos que o Instagram — é onde o diretor de cooperativa
e o gestor financeiro de armazém realmente estão, segundo o próprio `marca/05-PLANO-CRESCIMENTO.md`.

| # | Pilar | Título | Texto (resumo) | CTA | Objetivo | Público |
|---|---|---|---|---|---|---|
| 1 | Gestão rural | Controladoria rural não é planilha bonita | Diferença entre "ter dado" e "ter controle" — usa a frase do site "Número no lugar certo" | Comentar ou DM | Autoridade | Diretores/gestores |
| 2 | Fiscal | O que a Nota Técnica 2025.002 significa para quem emite | Tradução técnica sem jargão de desenvolvedor de ERP | Link para o Guia | Autoridade técnica | Auxiliar fiscal, contador |
| 3 | IBS/CBS | Obrigatório desde 03/08/2026: o que muda na prática | Explica o adiamento das validações vs. obrigatoriedade do campo | Link `/obrigado-ibs-cbs/` | Urgência | Produtor PJ |
| 4 | ERP agrícola | O ERP mais caro é o que a equipe não sabe usar | Argumento contra a troca precipitada de sistema | Link `/solucoes/#tecnologia` | Autoridade | Gestor de operações |
| 5 | Auditoria | O que aparece numa auditoria de armazém geral | Lista de divergências comuns encontradas em conferência | DM | Prova técnica | Armazéns, cerealistas |
| 6 | Erros de gestão | O erro mais caro não é o que aparece no relatório | Sobre informação que chega depois da decisão | Comentar | Identificação | Todos |
| 7 | Diagnóstico de operações | O que aprendemos avaliando dezenas de rotinas fiscais e financeiras | Padrões recorrentes, sem citar cliente | Link `/#diagnostico` | Autoridade | Todos |
| 8 | ERP/IBS-CBS | Reforma Tributária: o ERP resolve sozinho? | Por que parametrização não é automática mesmo com sistema atualizado | Link `/solucoes/#fiscal` | Educar | Gestor de TI |
| 9 | Casos e experiências | Um projeto, três inscrições estaduais, um produto por vez | O caso documentado, em formato de artigo curto | Link `/#casos` | Prova social | Produtor PJ |
| 10 | Bastidores | Por que trabalhamos com o contador, não no lugar dele | Posicionamento explícito — reduz objeção comum | Comentar/DM | Confiança | Contadores, produtores |

**Formato de publicação:** os mesmos carrosséis do Instagram podem ser republicados no LinkedIn
(o documento nativo do LinkedIn aceita PDF/carrossel) — não recrie a arte, reaproveite.

---

## 11. Estratégia do diagnóstico

O diagnóstico de 40 segundos (`/#diagnostico`, "Índice de Controle Operacional") é o **destino
padrão de quase todo anúncio e post deste plano**, exceto a Campanha 5 e o conteúdo de IBS/CBS,
que usam a ferramenta especializada `/obrigado-ibs-cbs/`. A regra que este plano segue, coerente
com o que você pediu: **nunca mandar tráfego frio direto para "fale conosco".**

A sequência de contato é sempre:

1. Anúncio/post → problema específico (não "agronegócio", e sim "planilha em 3 setores", "nota
   rejeitada", "ERP subutilizado").
2. Ferramenta → resultado personalizado, sem cadastro, sem e-mail pedido antes de mostrar o valor.
3. Resultado → CTA de WhatsApp **só depois** que a pessoa já viu o índice dela — o texto do botão
   já existente no site ("Receber a análise do meu resultado") funciona porque não pede para
   "comprar", pede para conversar sobre o que já apareceu na tela.

**Textos para WhatsApp específicos do diagnóstico** (usar como mensagem pré-preenchida em botões
de campanha, complementando os que já existem no `wa.me`):

- Vindo do Google Ads (Campanhas 1–4): *"Olá! Vi o anúncio de vocês e quero entender melhor a
  minha operação."*
- Vindo do diagnóstico já concluído: *"Olá! Acabei de fazer o diagnóstico e meu índice foi [X]/100
  — quero entender o resultado."*
- Vindo da Campanha 5 / ferramenta IBS/CBS: *"Olá! Fiz o teste e descobri que já estou obrigado ao
  IBS/CBS. Quero saber o que fazer agora."*

Essas três variações de mensagem pré-preenchida (parâmetro `?text=` no link `wa.me`) já são o
padrão técnico usado em todo o site — é só reaproveitar o mesmo mecanismo com o texto de origem
certo por campanha, sem alterar nenhum botão existente na Home.

---

## 12. Funil

```
TRÁFEGO (Google Ads, Instagram, LinkedIn, SEO)
   │
   ▼
SITE (página de destino específica por campanha — nunca a Home genérica sozinha)
   │
   ▼
DIAGNÓSTICO (Índice de Controle Operacional OU ferramenta "Já está obrigado ao IBS/CBS?")
   │
   ▼
RESULTADO (índice por área OU regime tributário identificado — sem cadastro)
   │
   ▼
CONTATO (CTA de WhatsApp com o resultado já na conversa — nunca formulário genérico)
   │
   ▼
WHATSAPP (mensagem pré-preenchida com origem — Seção 13 traz os roteiros)
   │
   ▼
REUNIÃO (30–60 min: estrutura de custo, rotina fiscal, sistema atual)
   │
   ▼
DIAGNÓSTICO COMPLETO (resumo de pontos de risco, sem compromisso de contratação)
   │
   ▼
PROPOSTA (orçada por porte: fazendas, inscrições estaduais, equipe)
   │
   ▼
CLIENTE
```

**O que acontece em cada etapa, de forma acionável:**

- **Tráfego → Site:** cada campanha/post leva para a página que responde exatamente à busca —
  nunca para a Home genérica quando existe página mais específica (`/solucoes/#fiscal` para quem
  busca fiscal, não `/`).
- **Site → Diagnóstico:** todo CTA principal da página de destino aponta para uma das duas
  ferramentas, nunca direto para "fale conosco".
- **Diagnóstico → Resultado:** automático, sem fricção — já está construído e funcionando.
- **Resultado → Contato:** o botão de WhatsApp carrega contexto (via `?text=`) para que a
  conversa comece sabendo o que a pessoa já viu, não do zero.
- **Contato → Reunião:** responder em até 2 horas (a mesma regra já definida em
  `marca/05-PLANO-CRESCIMENTO.md` para o Direct do Instagram vale igual para o WhatsApp pago).
- **Reunião → Proposta:** só depois do diagnóstico completo (30–60 min) — nunca orçamento sem
  conversa, como já é a prática descrita no FAQ do site.
- **Proposta → Cliente:** ticket e prazo de fechamento variam por frente; é o dado que este
  plano começa a medir a partir do dia 1 (Seção 15).

---

## 13. WhatsApp

Todas as mensagens seguem o tom do site: direto, técnico, sem emoji em excesso, sem pressão.
Nenhuma promete resultado financeiro.

**1. Primeiro contato (lead veio de anúncio, sem contexto prévio)**
> Olá! Aqui é da Consultoria Mendonça. Vi que você chegou até nós pelo [Google/Instagram] —
> me conta rapidamente qual é a situação da sua operação hoje, pra eu já te direcionar certo.

**2. Pessoa que fez o diagnóstico (Índice de Controle Operacional)**
> Olá! Vi que seu índice foi [X]/100, com o ponto de atenção em [área]. Isso geralmente aparece
> quando [explicação breve e honesta]. Posso te fazer 3 perguntas rápidas pra entender melhor?

**3. Pessoa que fez o teste do IBS/CBS**
> Olá! Pelo resultado do teste, sua operação [já está obrigada desde 03/08/2026 / tem prazo até
> 01/2027]. Isso muda a forma como vocês emitem a nota hoje?

**4. Pessoa que pediu informação (orçamento)**
> Olá! Pra te passar um valor certo, preciso entender o porte: quantas fazendas, quantas
> inscrições estaduais e qual sistema vocês usam hoje (ou se ainda é planilha)?

**5. Pessoa que demonstrou interesse, mas não pediu orçamento ainda**
> Fico à disposição se quiser conversar sobre isso com calma. Se preferir, o diagnóstico de
> 40 segundos no site já te dá um primeiro retrato: [link].

**6. Agendamento da reunião de diagnóstico completo**
> Podemos marcar 30 a 60 minutos pra olhar sua estrutura de custo, rotina fiscal e sistema atual.
> Você prefere [opção 1] ou [opção 2]?

**7. Confirmação de reunião**
> Confirmando nossa conversa em [data/hora]. Se puder, separe um exemplo recente de nota ou
> relatório do sistema — ajuda a tornar a conversa mais concreta.

**8. Follow-up (sem resposta após primeiro contato, 2–3 dias)**
> Só retomando: fico à disposição quando fizer sentido pra você. Sem pressa nenhuma da nossa
> parte.

**9. Proposta enviada**
> Te mandei a proposta com o escopo que conversamos. Qualquer dúvida sobre algum item, me chama
> — prefiro esclarecer agora do que depois.

**10. Pessoa que não respondeu à proposta (7+ dias)**
> Oi, [nome]. Ficou alguma dúvida sobre a proposta que te impeça de decidir? Se o momento não for
> esse, tudo bem — só me avisa que eu não insisto.

**11. Pós-reunião (não fechou, mas teve diagnóstico completo)**
> Obrigado pelo tempo hoje. Ficou registrado que o ponto de maior risco na sua operação é
> [resumo]. Quando fizer sentido avançar, é só chamar — o diagnóstico continua valendo.

---

## 14. Orçamento

Você pediu para começar pequeno — três cenários, com critério explícito de quando subir de um
para o outro.

| Canal | TESTE (mês 1) | CRESCIMENTO (mês 2–3, se validar) | ESCALA (a partir do mês 4, se validar) |
|---|---:|---:|---:|
| **Google Ads** | R$600–800/mês | R$1.800–2.200/mês | R$4.000–5.500/mês |
| **Meta Ads** | R$0 (ainda não) | R$400–600/mês (retargeting) | R$1.200–2.000/mês |
| **Conteúdo** (edição, Canva Pro, banco de imagens) | R$0–100/mês (produção própria) | R$300–500/mês | R$800–1.500/mês |
| **SEO** (ferramenta de validação de volume) | R$0 | R$0–200/mês | R$0–500/mês |
| **Total mensal** | **≈ R$700–900** | **≈ R$2.500–3.500** | **≈ R$6.000–9.500** |

**Por que essa ordem:**

1. **Google Ads primeiro e sozinho no mês 1.** É o único canal com intenção comercial já
   embutida no clique. Meta Ads sem pixel, sem audiência aquecida e sem venda confirmada
   interromperia gente que não estava procurando nada — pior custo por lead possível nesta fase.
2. **Conteúdo e SEO custam tempo, não dinheiro, no início.** A produção já está montada (skills
   `gerar-conteudo` e `boletim-agro`) — o gasto em edição/ferramentas só se justifica quando o
   volume de conteúdo publicado já é maior do que uma pessoa sozinha sustenta, o que
   `marca/05-PLANO-CRESCIMENTO.md` já havia identificado como ponto de contratar edição.
3. **Meta Ads entra na fase CRESCIMENTO, e como retargeting — não prospecção fria.** Primeiro
   uso: reimpactar quem visitou `/solucoes/` ou `/obrigado-ibs-cbs/` sem converter. É mais barato
   e mais alinhado ao ticket alto do que tentar vender controladoria rural pra um desconhecido no
   feed.

**Critério de subir de cenário (não é tempo, é resultado):**

| De → Para | Condição |
|---|---|
| TESTE → CRESCIMENTO | Rastreamento de conversão funcionando (Seção 16) **e** pelo menos 1 lead qualificado com custo sob controle **e** fluxo de caixa da consultoria comporta o gasto |
| CRESCIMENTO → ESCALA | Pelo menos 1 cliente fechado atribuível a tráfego pago **e** CPL estável ou em queda por 30 dias |

**Não recomendo pular etapa.** Gastar R$6.000/mês em uma conta sem histórico de conversão é
queimar orçamento aprendendo o que R$700/mês já ensina mais barato.

---

## 15. Métricas

**O que importa** (decide se continua, corta ou escala):

| Métrica | Onde medir | O que decide |
|---|---|---|
| Custo por lead (CPL) | Google Ads ÷ GA4 (`clique_whatsapp`) | Se o canal/campanha compensa |
| Custo por diagnóstico concluído | GA4 (`ferramenta_concluida`, `diagnostico_concluido`) | Se a ferramenta segura quem chega |
| Diagnósticos realizados | GA4 | Volume real do funil, não vaidade |
| Contatos (WhatsApp) | GA4 + contagem manual das conversas | Qualidade da qualificação |
| Reuniões agendadas | Contagem manual (não há CRM ainda) | Taxa de conversão contato → reunião |
| Propostas enviadas | Contagem manual | Taxa de conversão reunião → proposta |
| Clientes fechados | Contagem manual, confirmado | O único número que paga a mídia |
| Custo por cliente (CAC) | Investimento total ÷ clientes fechados | Se o CAC cabe no ticket médio do serviço |
| Faturamento gerado | Confirmado por contrato/nota — nunca estimado | Base real do ROI |
| ROI | (Faturamento − investimento) ÷ investimento | Decisão de escalar ou não |

**O que é vaidade** (acompanhar, mas nunca decidir por isso sozinho):

- Impressões e alcance bruto sem custo associado.
- CTR isolado (um CTR alto com CPL alto não significa nada bom).
- Seguidores do Instagram (a própria `marca/05-PLANO-CRESCIMENTO.md` já registrou isso: a meta é
  receita, não seguidor).
- Curtidas e comentários sem conversão em Direct qualificado.

**Planilha mental de acompanhamento — atualizar semanalmente:**

```
Investimento (Google + Meta) | Impressões | Cliques | CTR | CPC
   → Leads (WhatsApp) | Custo por lead
      → Diagnósticos realizados | Taxa de conclusão
         → Contatos qualificados | Reuniões agendadas
            → Propostas | Clientes | Custo por cliente
               → Faturamento gerado | ROI
```

Nenhum número de venda ou faturamento entra nesta planilha sem confirmação real — a mesma regra
que já rege o `painel/dados.json` deste projeto.

---

## 16. Plano de execução de 30 dias

### Dia 1–3 — Configuração

1. Criar conta Google Ads (Modo Especialista, não Campanha Inteligente).
2. Vincular a conta Google Ads ao GA4 (propriedade 546920453) e importar como conversão os
   eventos `clique_whatsapp`, `ferramenta_concluida` e `diagnostico_concluido` — já existem, só
   precisam ser importados.
3. Configurar o Google Business Profile completo (Seção 7): descrição, categorias, serviços,
   Q&A, horário, área de atendimento.
4. Conectar o Google Search Console (ação pendente há dias — `NEGOCIO/ACAO-NECESSARIA-DO-PROPRIETARIO.md`,
   item 5) e enviar `sitemap.xml`.
5. Montar as 5 campanhas em rascunho, pausadas, com as palavras-chave, negativas e anúncios das
   Seções 5 e 6 já prontos para colar.
6. Definir orçamento diário de cada campanha conforme o cenário TESTE (Seção 14).

### Dia 4–7 — Primeiras campanhas

7. Ativar primeiro a **Campanha 5 (IBS/CBS)** — maior urgência, funil já validado nos relatórios
   anteriores.
8. Ativar a **Campanha 1 (Controladoria Rural)** — ticket mais alto.
9. Configurar extensões (sitelinks, callouts, snippet estruturado, chamada) em ambas.
10. Aguardar aprovação dos anúncios (24–48h) e revisar se algum foi reprovado (o Google costuma
    barrar termos que pareçam promessa financeira — nenhum título aqui usa isso, mas confira).
11. Publicar 1 Reel e 1 carrossel (Seção 9) no mesmo tema das duas campanhas ativas, para que
    pago e orgânico reforcem a mesma mensagem na mesma semana.
12. Ativar as **Campanhas 2, 3 e 4** assim que as duas primeiras estiverem rodando sem erro de
    configuração.

### Semana 2 — Análise

13. Abrir "Termos de pesquisa" em cada campanha e adicionar como negativa qualquer termo que
    gerou clique fora da intenção esperada.
14. Calcular o CPL real por campanha (investimento ÷ cliques no WhatsApp).
15. Pausar qualquer anúncio com 0 cliques em 3 dias — não esperar a semana toda para agir.
16. Conferir se os eventos do GA4 estão realmente disparando (teste manual: clicar no próprio
    anúncio e confirmar o evento no GA4 em tempo real).
17. Comparar as 5 campanhas entre si: qual gera clique-WhatsApp mais barato até agora.

### Semana 3 — Otimização

18. Pausar os 30% de palavras-chave com pior CPL e zero conversão.
19. Testar 2 títulos novos nos grupos de anúncio com melhor CTR (trocar, não somar).
20. Ajustar lances manuais para cima nas palavras ALTA intenção que já converteram.
21. Testar a landing page alternativa da Campanha 5 (artigo de blog vs. ferramenta) em um grupo
    de anúncio separado — nunca editando a Home para isso.
22. Instalar o Pixel do Meta no site (pré-requisito para a Fase CRESCIMENTO) e deixá-lo coletando
    dados, mesmo sem campanha ativa ainda.

### Semana 4 — Escala ou corte

23. Aplicar o critério de corte: campanha com CPL acima de ~R$150–250 (referência: ticket de
    entrada do fiscal é R$1.500, então um CPL alto ainda pode compensar — ajuste esse teto depois
    da primeira venda real) **e** zero conversão em 30 dias → pausar e revisar hipótese de
    palavra-chave ou anúncio antes de tentar de novo.
24. Aplicar o critério de escala: campanha com pelo menos 1 lead qualificado a custo aceitável →
    aumentar o orçamento diário em 20–30%, não dobrar de uma vez.
25. Registrar os aprendizados em um novo relatório (`NEGOCIO/RELATORIO-06-...`), seguindo a
    mesma convenção dos relatórios já existentes neste repositório.
26. Decidir, com números na mão, se o mês 2 entra no cenário CRESCIMENTO (Seção 14).

---

## 17. Checklist de execução

**Pré-requisito técnico (antes de gastar o primeiro real):**

- [ ] Conta Google Ads criada
- [ ] Conversões importadas do GA4 para o Google Ads
- [ ] Google Search Console conectado e sitemap enviado
- [ ] Google Business Profile completo (categoria, descrição, serviços, Q&A)
- [ ] Pixel do Meta instalado (mesmo sem campanha ativa ainda)

**5 campanhas Google Ads:**

- [ ] Campanha 1 — Controladoria Rural
- [ ] Campanha 2 — Gestão Financeira Rural
- [ ] Campanha 3 — ERP / SIAGRI / Processos
- [ ] Campanha 4 — Fiscal / Parametrização
- [ ] Campanha 5 — IBS/CBS no Agronegócio

**Conteúdo:**

- [ ] 1 Reel + 1 carrossel publicados na mesma semana da ativação das campanhas
- [ ] Cadência mínima retomada: 5–7 posts/semana (já recomendado em `marca/05-PLANO-CRESCIMENTO.md`,
      ainda não cumprido segundo `painel/dados.json`)
- [ ] Primeiro artigo novo de SEO publicado (Seção 8, item 1 ou 5)

**Acompanhamento:**

- [ ] Planilha/painel semanal com as métricas da Seção 15
- [ ] Revisão de termos de pesquisa e negativas na Semana 2
- [ ] Decisão de corte/escala registrada na Semana 4

---

## Oportunidades futuras (não implementadas — apenas relatadas)

Conforme a regra 1 deste plano, nada abaixo foi alterado. São observações que aparecem quando se
olha o site do ângulo de quem vai pagar por tráfego para ele — decida você quando (e se) agir:

1. **Domínio próprio.** O subdomínio `github.io` funciona para Google Ads, mas reduz a percepção
   de autoridade em landing pages de ticket alto (R$1.500–25.000). Os relatórios anteriores já
   recomendaram esperar a primeira venda antes de trocar — mantenho a mesma recomendação.
2. **Menu mobile.** A auditoria de `marca/01-AUDITORIA-SITE.md` (seção 6) já apontou ausência de
   menu mobile funcional. Para tráfego pago isso importa mais ainda: a maior parte do clique em
   anúncio no agro vem de celular.
3. **Sitemap incompleto.** Não inclui `/obrigado-ibs-cbs/`, `/produtos/`, nem `/painel/` (este
   último, corretamente, não deveria estar público). Vale conferir antes de depender de SEO como
   canal principal.
4. **Conversão de Google Ads não instalada.** Não é alteração de layout, mas é pré-requisito
   técnico que falta — está no checklist da Seção 17.
5. **Ausência de rosto/autoridade pessoal na Home**, já apontada como o problema de maior ROI na
   auditoria anterior — segue valendo para quem chega por anúncio pago também: tráfego pago sem
   prova de "quem é essa empresa" converte pior do que poderia.

Nenhum desses pontos bloqueia o plano de tráfego pago — eles competem por prioridade com ele,
não com você.

---

## "Se eu fosse você, faria nesta ordem:"

1. **Crie a conta Google Ads e vincule ao GA4** — sem isso, nenhuma campanha é mensurável de
   verdade, e você estaria voando às cegas com dinheiro real.
2. **Ative primeiro a Campanha 5 (IBS/CBS)** — é a única com funil de monetização já pronto e
   validado nos relatórios anteriores (ferramenta → Guia R$29 → Kit R$197 → parametrização →
   mensal). É onde R$25/dia tem mais chance de virar venda mais rápido.
3. **Complete o Google Business Profile** — é grátis, leva menos de uma hora e captura busca
   local que hoje vai inteira para os concorrentes.
4. **Ative a Campanha 4 (Fiscal/Parametrização)** — segunda prioridade, porque tem o preço de
   entrada mais baixo (R$1.500) e a dor mais aguda depois da Reforma.
5. **Volte a publicar no Instagram na cadência da Seção 9** — o tráfego pago fica mais barato
   quando o perfil que a pessoa vê depois de clicar não parece abandonado (alcance caiu de 123
   para 1 pessoa/dia por falta de publicação, segundo o Relatório 01).
6. **Conecte o Google Search Console** — sem ele você não sabe se o SEO da Seção 8 está
   funcionando, só está torcendo.
7. **Ative as Campanhas 1, 2 e 3** — depois que 4 e 5 já estiverem rodando sem erro de
   configuração e você já souber ler um CPL.
8. **Publique o primeiro artigo novo de SEO** (Seção 8, item 5 — sobre quem é contribuinte de
   IBS/CBS) — reforça a mesma campanha que já tem o orçamento mais alto.
9. **Na Semana 2, adicione negativas e corte o que não performa** — não espere o mês fechar para
   agir; o dinheiro perdido em 2 semanas de palavra-chave errada não volta.
10. **Só decida sobre Meta Ads e sobre subir de cenário de orçamento depois de ter pelo menos 1
    lead qualificado com CPL sob controle** — o cenário CRESCIMENTO (Seção 14) existe para
    quando os números já falam, não para acelerar por ansiedade.
