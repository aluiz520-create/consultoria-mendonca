# RELATÓRIO DE TRÁFEGO — VERSÃO 1

**Data:** 08/08/2026
**Site auditado:** https://aluiz520-create.github.io/consultoria-mendonca/site-dinheiro/
**Branch:** `claude/traffic-audit-optimization-n2k843`

> **Regra que vale para o relatório inteiro:** nenhum número de tráfego, venda ou receita
> aparece aqui sem fonte. Onde não há dado, está escrito **"não medido"** — nunca zero
> presumido, nunca estimativa disfarçada de fato.

---

## 1. Diagnóstico do site

### O que o site é hoje

Uma ferramenta de diagnóstico financeiro doméstico chamada **"Para onde foi meu dinheiro?"**,
que pergunta quem mora na casa e o que sai todo mês, e devolve:

- em que **dia do mês** a renda acaba;
- quanto a casa custa por pessoa e por dia;
- a comparação com o **piso do DIEESE** calculado para aquela composição de família;
- quanto some por mês em juros de rotativo e cheque especial;
- quanto seria preciso receber para sobrar 10%.

Monetização: um plano de 90 dias por **R$ 19,90**, checkout ativo na Kiwify
(`pay.kiwify.com.br/BhOeiGG`). O produto existe — PDF de 9 páginas e planilha de 3 abas.

### O diagnóstico em uma frase

**O produto era bom e ninguém podia encontrá-lo.**

O site não estava fraco em conteúdo. Estava **desconectado da internet**: sem link de entrada,
fora do sitemap que o Google lê, com `robots.txt` e `sitemap.xml` apontando para um domínio
que não existe (`https://SEU-DOMINIO/`), e sem uma linha de medição.

### A prova, e não a suspeita

Consulta ao GA4 do proprietário (propriedade **546920453**), últimos 30 dias:

| Página | Sessões | Usuários |
|---|---|---|
| /consultoria-mendonca/ | 5 | 4 |
| /consultoria-mendonca/index.html | 4 | 1 |
| /consultoria-mendonca/boletim/index.html | 3 | 2 |
| /consultoria-mendonca/boletim/2026-08-07.html | 1 | 1 |
| /consultoria-mendonca/pagamento.html | 1 | 1 |
| **/consultoria-mendonca/site-dinheiro/** | **nenhuma linha** | **nenhuma linha** |

Há **um único dia** de dados (07/08/2026) — o GA4 foi ligado no dia anterior. Tráfego orgânico
de Google no período: **0 sessões**.

A ausência de linha para `/site-dinheiro/` tem duas causas somadas, e as duas foram corrigidas:
a página não tinha tag de medição, e não havia por onde alguém chegar nela.

---

## 2. Pontos fortes

Estes não são elogios de cortesia. São os ativos em que a estratégia inteira se apoia.

1. **A pergunta é melhor que a das concorrentes.** "Em que dia o seu salário acaba" é concreta,
   pessoal e compartilhável. "Como economizar dinheiro" não é nenhuma das três coisas.
2. **Pergunta quem mora na casa.** Nenhuma das calculadoras concorrentes que examinei faz isso,
   e é o que separa um resultado útil de um número sem contexto. R$ 1.200 de mercado significa
   coisas opostas para 1 e para 5 pessoas.
3. **Âncora em dado oficial.** O piso do DIEESE dá autoridade verificável e cria um segundo
   ângulo de busca inteiro ("quanto uma família precisa ganhar"), que já rende uma página.
4. **Zero atrito.** Sem cadastro, sem e-mail, cálculo no navegador. É o maior diferencial de
   conversão possível numa categoria onde todo concorrente pede login.
5. **Honestidade estrutural.** Sem afiliado de crédito, sem promessa de resultado, com aviso
   legal e indicação de atendimento gratuito no Procon. Num nicho cheio de golpe, isso é ativo
   de marca — e é também o que sustenta E-E-A-T aos olhos do Google.
6. **Rápido e leve.** CSS próprio, fonte embutida em base64, nenhuma requisição a CDN, nenhuma
   biblioteca. O site inteiro cabe em poucos KB e roda bem em celular ruim.
7. **O produto pago existe.** Não é promessa. Isso permite medir intenção de compra de verdade.

---

## 3. Pontos fracos

1. **Só duas páginas.** Um site de duas páginas capta duas intenções de busca. O mercado tem
   centenas.
2. **Nenhum link de entrada.** Nem do site principal, nem de lugar nenhum.
3. **Nenhuma medição.** `ID_ANALYTICS` estava vazio: não havia como saber se alguém usava.
4. **Nenhum degrau intermediário no funil.** Ou a pessoa comprava por R$ 19,90 ou saía sem
   deixar rastro. Não há captura de e-mail — o que é coerente com a decisão de não coletar
   dados, mas significa que **todo visitante que não compra hoje está perdido para sempre**.
5. **A promessa do bloco pago é genérica na chamada.** "Quero o plano completo" não diz o que
   a pessoa leva. O texto acima dele é bom; o botão desperdiça o trabalho do texto.
6. **Nenhum sinal de prova.** Nenhum depoimento, nenhuma contagem de uso, nenhuma indicação de
   que outra pessoa já passou por ali. Em produto de R$ 19,90 isso pesa.
7. **Convive com um site de outro nicho no mesmo domínio.** A Consultoria Mendonça é agro e
   tributário; este site é finanças pessoais B2C. Não é erro, mas limita o ganho de autoridade
   cruzada e é motivo suficiente para migrar de domínio quando houver tráfego.

---

## 4. Problemas técnicos encontrados

| # | Problema | Gravidade | Situação |
|---|---|---|---|
| T1 | `sitemap.xml` com `https://SEU-DOMINIO/` — inválido para qualquer buscador | Crítica | **Corrigido** |
| T2 | `robots.txt` idem | Alta | **Corrigido** |
| T3 | Páginas do site-dinheiro ausentes do `sitemap.xml` da raiz — o único que o Google lê | Crítica | **Corrigido** |
| T4 | Nenhuma tag `canonical` em nenhuma página | Alta | **Corrigido** |
| T5 | `ID_ANALYTICS` vazio: nenhuma medição | Crítica | **Corrigido** |
| T6 | Sem `og:url`, `og:image`, `og:site_name` e sem Twitter cards — link compartilhado aparecia sem imagem | Alta | **Corrigido** |
| T7 | Sem `meta robots` com `max-image-preview:large` (requisito prático do Discover) | Média | **Corrigido** |
| T8 | Schema apenas `FAQPage`; sem `WebApplication`, `BreadcrumbList`, `HowTo` | Média | **Corrigido** |
| T9 | Sem migalhas de navegação visíveis | Média | **Corrigido** |
| T10 | Nenhum evento de funil além do resultado final | Alta | **Corrigido** |

**Sobre o `robots.txt` — uma armadilha específica do GitHub Pages.** Em site de projeto
(`usuario.github.io/repositorio/`), o Google só lê o `robots.txt` da **raiz do domínio**:
`aluiz520-create.github.io/robots.txt`. O arquivo dentro de `/consultoria-mendonca/` é
ignorado, e o de dentro de `/site-dinheiro/` mais ainda. Por isso a correção que realmente
importa não foi arrumar o `robots.txt` da pasta — foi **colocar as seis URLs no
`sitemap.xml` da raiz**, que é o que o robots.txt do domínio referencia.

Não encontrei: links internos quebrados (0), páginas órfãs (0, depois das correções), imagens
sem `alt` (o site não usa `<img>`), problemas de viewport ou de contraste.

---

## 5. Problemas de SEO

| # | Problema | Situação |
|---|---|---|
| S1 | Título da home começava pelo nome da marca, não pela busca do usuário | **Corrigido** — agora "Em Que Dia o Seu Salário Acaba? Calculadora Grátis, Sem Cadastro" |
| S2 | Duas páginas cobrindo duas intenções, num mercado de centenas | **Em andamento** — 4 páginas novas publicadas, 20 mapeadas |
| S3 | Nenhum link interno entre páginas além de um link solto | **Corrigido** — bloco `.trilhos` em todas |
| S4 | Nenhuma cobertura das buscas de maior intenção comercial (dívida, cartão, faixa de renda) | **Corrigido para as 4 principais** |
| S5 | Nenhuma página de resposta direta a pergunta longa (long tail) | **Em andamento** |
| S6 | Sem imagem de compartilhamento: link colado no WhatsApp aparecia sem nada | **Corrigido** — `capa.png` 1200×630 |
| S7 | Sem Search Console: nenhuma visibilidade de impressão, clique, CTR e posição | **Depende do proprietário** — passo a passo pronto |

### Sobre a concorrência, com honestidade

As buscas de cabeça deste nicho — "como sair das dívidas", "como dividir o salário",
"quanto guardar por mês" — estão ocupadas por **Serasa, PicPay, Mobills, BTG, BV, Meu Bolso em
Dia e blogs de banco**. Sites com décadas de autoridade e equipes de conteúdo.

**Não vamos disputar essas buscas de frente, e nenhuma tática muda isso no curto prazo.**

A tese desta estratégia é outra: essas páginas são todas **texto**. Nenhuma delas responde
"qual das *minhas* dívidas eu pago primeiro" com os números da pessoa. É aí que uma ferramenta
ganha de um artigo — e é por isso que cada página nova criada aqui tem uma calculadora dentro,
não só parágrafos.

---

## 6. Problemas de conversão

O funil desejado é:

```
VISITA → USA A FERRAMENTA → VÊ O RESULTADO → CLICA NA OFERTA → CHECKOUT → COMPRA
```

**Antes destas mudanças, nenhum dos degraus era medido.** Só existia um evento no fim do
diagnóstico e um no clique do plano — sem denominador, os dois eram inúteis.

Problemas identificados na estrutura de conversão:

1. **Salto grande demais entre gratuito e pago.** Diagnóstico gratuito → R$ 19,90 sem nenhum
   passo intermediário. Corrigido em parte: as ferramentas novas criam um caminho de uso
   múltiplo antes da oferta.
2. **A oferta aparece uma vez só.** Agora aparece em quatro páginas, com `origem` medida em
   cada uma — em duas semanas saberemos **qual página vende**, que é a informação que decide
   onde investir conteúdo.
3. **Botão sem promessa.** "Quero o plano completo" descreve a transação, não o resultado.
   Está na fila de teste A/B (ver Experimento E2).
4. **Nenhuma prova social.** Não há como resolver honestamente hoje: sem vendas confirmadas,
   inventar depoimento está fora de questão. Entra quando houver cliente real.
5. **Sem retorno possível.** Sem e-mail e sem retargeting, quem não compra na primeira visita
   não volta. A alternativa honesta ao cadastro é o **compartilhamento** — por isso o botão de
   copiar diagnóstico e o de mandar para alguém da casa são estratégicos, não decorativos.

---

## 7. As 50 primeiras oportunidades de pesquisa

Base completa: **205 termos** em [`palavras-chave.csv`](palavras-chave.csv), com intenção,
problema, público, dificuldade estimada, potencial comercial, tipo de conteúdo, página-alvo e
CTA para cada um.

**Como as dificuldades foram estimadas:** por inspeção dos resultados reais de busca (quem
ocupa o topo hoje e com que tipo de conteúdo), não por ferramenta de volume — não tenho acesso
a uma. Onde está escrito 5, significa "dominado por Serasa/banco/portal grande". Onde está 1
ou 2, significa "ninguém respondeu isso direito ainda".

Recorte das 50 prioritárias — **PROBLEMA e TRANSAÇÃO primeiro**, como pedido:

| # | Termo | Int. | Dif. | Pot. | Página-alvo |
|---|---|---|---|---|---|
| 1 | qual dívida pagar primeiro | P | 3 | 5 | ✅ /qual-divida-pagar-primeiro/ |
| 2 | tenho várias dívidas por onde começo | P | 2 | 5 | ✅ /qual-divida-pagar-primeiro/ |
| 3 | pagar a dívida maior ou a menor primeiro | P | 2 | 5 | ✅ /qual-divida-pagar-primeiro/ |
| 4 | calculadora para sair das dívidas | T | 3 | 5 | ✅ /qual-divida-pagar-primeiro/ |
| 5 | simulador de quitação de dívidas | T | 3 | 5 | ✅ /qual-divida-pagar-primeiro/ |
| 6 | quanto vou pagar de juros no cartão | P | 3 | 5 | ✅ /juros-do-cartao-de-credito/ |
| 7 | calculadora juros rotativo cartão | T | 2 | 5 | ✅ /juros-do-cartao-de-credito/ |
| 8 | o que acontece se eu pagar só o mínimo do cartão | P | 3 | 5 | ✅ /juros-do-cartao-de-credito/ |
| 9 | é melhor parcelar a fatura ou pagar o mínimo | P | 2 | 5 | ✅ /juros-do-cartao-de-credito/ |
| 10 | em que dia meu salário acaba | P | 2 | 5 | ✅ / |
| 11 | meu salário acaba antes do fim do mês | P | 3 | 5 | ✅ / |
| 12 | quanto do meu salário já está comprometido | P | 2 | 5 | ✅ / |
| 13 | vale a pena pegar empréstimo para pagar o cartão | P | 3 | 5 | ✅ /qual-divida-pagar-primeiro/ |
| 14 | quanto do salário pode ir para parcelas | P | 3 | 5 | ✅ /quanto-posso-gastar-ganhando/ |
| 15 | dívida com garantia ou sem garantia qual pagar antes | P | 2 | 5 | ✅ /qual-divida-pagar-primeiro/ |
| 16 | por onde começar a quitar dívidas | P | 3 | 5 | ✅ /como-sair-das-dividas/ |
| 17 | como sair das dívidas em 90 dias | T | 2 | 5 | ✅ /como-sair-das-dividas/ |
| 18 | plano para sair das dívidas em 90 dias | T | 2 | 5 | ✅ /como-sair-das-dividas/ |
| 19 | como sair das dívidas ganhando pouco | P | 3 | 5 | 🔜 criar |
| 20 | como sair das dívidas do cartão de crédito | P | 4 | 5 | 🔜 criar |
| 21 | meu salário está todo comprometido o que fazer | P | 2 | 5 | 🔜 criar |
| 22 | qual conta pagar primeiro quando falta dinheiro | P | 2 | 5 | 🔜 criar |
| 23 | como priorizar contas quando falta dinheiro | P | 2 | 5 | 🔜 criar |
| 24 | dívida de cartão de 5000 como pagar | P | 2 | 5 | 🔜 criar |
| 25 | dívida de cartão de 10000 como pagar | P | 2 | 5 | 🔜 criar |
| 26 | dívida de cartão de 3000 como pagar | P | 2 | 5 | 🔜 criar |
| 27 | proposta de acordo do banco é boa | P | 2 | 5 | 🔜 criar |
| 28 | qual desconto pedir na negociação de dívida | P | 2 | 5 | 🔜 criar |
| 29 | o que falar na negociação de dívida | P | 2 | 5 | ✅ /como-sair-das-dividas/ |
| 30 | trocar dívida cara por barata como fazer | P | 2 | 5 | 🔜 criar |
| 31 | consignado vale a pena para quitar cartão | P | 3 | 5 | 🔜 criar |
| 32 | uso o cartão para pagar mercado é errado | P | 2 | 5 | 🔜 criar |
| 33 | estou usando o cartão para pagar contas | P | 2 | 5 | 🔜 criar |
| 34 | onde cortar gastos primeiro | P | 3 | 5 | 🔜 criar |
| 35 | parcelamento da fatura vale a pena | P | 3 | 5 | 🔜 criar |
| 36 | quanto posso gastar ganhando 2000 | P | 2 | 4 | ✅ /quanto-posso-gastar-ganhando/ |
| 37 | quanto posso gastar ganhando 2500 | P | 2 | 4 | ✅ /quanto-posso-gastar-ganhando/ |
| 38 | quanto posso gastar ganhando 3000 | P | 2 | 4 | ✅ /quanto-posso-gastar-ganhando/ |
| 39 | quanto posso gastar ganhando 4000 | P | 2 | 4 | ✅ /quanto-posso-gastar-ganhando/ |
| 40 | quanto posso gastar ganhando 5000 | P | 2 | 4 | ✅ /quanto-posso-gastar-ganhando/ |
| 41 | como organizar salário de 2000 | P | 3 | 4 | 🔜 criar |
| 42 | como organizar salário de 2500 | P | 3 | 4 | 🔜 criar |
| 43 | como organizar salário de 3000 | P | 3 | 4 | 🔜 criar |
| 44 | quanto de aluguel posso pagar ganhando 3000 | P | 2 | 4 | 🔜 criar |
| 45 | quanto do salário pode ir para o aluguel | P | 3 | 4 | ✅ /quanto-posso-gastar-ganhando/ |
| 46 | regra 50 30 20 funciona para renda baixa | P | 2 | 4 | ✅ /quanto-posso-gastar-ganhando/ |
| 47 | 50 30 20 não dá certo pra mim | P | 1 | 4 | 🔜 criar |
| 48 | por que não consigo guardar dinheiro | P | 4 | 4 | 🔜 criar |
| 49 | ganho bem mas não sobra nada | P | 3 | 4 | 🔜 criar |
| 50 | aumentei de salário e continuo sem dinheiro | P | 2 | 4 | 🔜 criar |

**Do total de 205 termos, 75 são prioritários** (intenção PROBLEMA ou TRANSAÇÃO, dificuldade
≤ 3, potencial ≥ 4). Destes, **34 já têm página** depois do trabalho de hoje e **41 ainda não**.

---

## 8. As 20 páginas a criar primeiro

Ordem por (intenção comercial × facilidade de ranquear), com as 5 já publicadas marcadas.

| # | URL | O que precisa ter | Termos que captura |
|---|---|---|---|
| 1 | `/qual-divida-pagar-primeiro/` ✅ | Simulador avalanche × bola de neve | 8 |
| 2 | `/juros-do-cartao-de-credito/` ✅ | Calculadora de rotativo, 3/6/12 meses | 12 |
| 3 | `/quanto-posso-gastar-ganhando/` ✅ | Tetos por faixa + piso do DIEESE | 14 |
| 4 | `/como-sair-das-dividas/` ✅ | Pilar das 5 decisões, liga as ferramentas | 9 |
| 5 | `/` ✅ (melhorada) | Diagnóstico da casa | 10 |
| 6 | `/meu-salario-esta-comprometido/` | Calculadora de comprometimento com o teto de 30% dos bancos | 5 |
| 7 | `/qual-conta-pagar-primeiro/` | Ordenador de contas por consequência do atraso (corte, multa, juro, perda do bem) | 6 |
| 8 | `/divida-de-cartao/` | Hub por valor: 3.000 / 5.000 / 10.000, cada um com prazo e juros reais | 8 |
| 9 | `/como-sair-das-dividas-ganhando-pouco/` | O caso em que cortar não resolve; foco em renegociação e priorização | 5 |
| 10 | `/onde-cortar-gastos-primeiro/` | Simulador de corte: quanto sobra ao cortar cada categoria | 6 |
| 11 | `/proposta-de-acordo-e-boa/` | Checklist de avaliação: total pago × parcela, prazo, tarifas | 5 |
| 12 | `/trocar-divida-cara-por-barata/` | Comparador: taxa nova × antiga, com o ponto de equilíbrio | 5 |
| 13 | `/como-organizar-salario-de-2500/` | Orçamento realista da faixa, não teoria de 50/30/20 | 4 |
| 14 | `/como-organizar-salario-de-3000/` | Idem | 4 |
| 15 | `/quanto-de-aluguel-posso-pagar/` | Calculadora com o teto de 30% e o efeito no resto do orçamento | 5 |
| 16 | `/estou-usando-o-cartao-para-pagar-contas/` | Diagnóstico do déficit estrutural — a página mais honesta do site | 4 |
| 17 | `/50-30-20-nao-funciona/` | Crítica fundamentada da regra em renda baixa + o que usar no lugar | 4 |
| 18 | `/quanto-custa-manter-um-carro/` | Calculadora do custo total mensal, incluindo depreciação | 5 |
| 19 | `/reserva-de-emergencia-ganhando-pouco/` | Quanto dá para guardar de verdade, a partir do diagnóstico | 4 |
| 20 | `/quanto-custa-criar-um-filho/` | Calculadora por faixa etária, ancorada no DIEESE | 5 |

**Critério de corte, que vale mais que a lista:** nenhuma dessas páginas vai ao ar sem passar
no teste da Fase 8 — *"se eu fosse o usuário, esta página resolveria meu problema?"*. Se a
resposta for não, ela não entra. Preencher o site com 20 páginas fracas é pior que ter 5 boas.

---

## 9. 30 conteúdos para redes sociais

Estão em [`MOTOR-DE-CONTEUDO.md`](MOTOR-DE-CONTEUDO.md), com roteiros completos: 8 Reels,
6 TikToks, 5 Shorts, 5 carrosséis, 6 posts curtos, mais 20 ganchos, 12 títulos e 9 CTAs.

Todos apontam para uma ferramenta específica, nenhum para a home genérica.

---

## 10. Estratégia de distribuição

Em [`DISTRIBUICAO.md`](DISTRIBUICAO.md). Resumo do princípio:

**O SEO deste site vai demorar meses.** Domínio novo, zero autoridade, concorrentes com
décadas de vantagem. Quem espera só pelo Google fica seis meses sem nenhum dado — e sem dado
não há otimização.

Por isso a ordem é: **social primeiro para gerar os primeiros usuários e aprender o que
funciona, SEO em paralelo para colher depois.** O social dá resposta em dias; o Google, em
meses. Um financia a paciência do outro.

---

## 11. Plano de 30 dias

### Dias 1–3 — Auditoria, pesquisa e correção técnica ✅ **feito hoje**
- Auditoria completa (este documento)
- 205 oportunidades de busca mapeadas
- 10 problemas técnicos corrigidos
- Medição instalada com funil completo

### Dias 4–7 — Estrutura e primeiras páginas ✅ **feito hoje, adiantado**
- 4 páginas novas com ferramenta própria, publicadas
- Links internos ligando as 6 páginas
- Sitemap e Open Graph corretos
- **Falta ao proprietário:** ligar o Search Console (15 min — ver seção 13)

### Semana 2 — Conteúdo, distribuição e primeiros dados
- Publicar páginas 6, 7 e 8 da lista da seção 8
- Publicar os 15 primeiros conteúdos sociais (3/dia úteis)
- Ler os primeiros dados do GA4: quantos chegam, quantos usam, quantos clicam na oferta
- Primeira leitura do Search Console, se ligado

### Semana 3 — Mais páginas, testes e comunidades
- Publicar páginas 9 a 14
- Rodar Experimento E1 (título do botão da oferta)
- Participar de 5 discussões reais no Reddit/fóruns onde a pergunta já está sendo feita —
  respondendo de verdade, com link só quando a ferramenta for a resposta
- Segunda leitura de dados

### Semana 4 — Dobrar no que funcionou
- Repetir o formato social que trouxe mais cliques
- Melhorar as páginas que aparecerem no Search Console entre as posições 8 e 20
- Criar página nova para toda consulta com impressão e sem página correspondente
- Rodar Experimento E2
- **Relatório de Tráfego v2, com números reais**

---

## 12. O que já foi implementado (hoje)

Commit `ccb4efa` na branch `claude/traffic-audit-optimization-n2k843`.

**Correções técnicas**
- `canonical`, `og:url`, `og:image`, `og:site_name`, Twitter cards em todas as 6 páginas
- `meta robots` com `max-image-preview:large`
- Schema: `WebApplication`, `BreadcrumbList`, `HowTo`, `FAQPage` conforme a página
- `sitemap.xml` da pasta com URLs reais
- As 6 URLs no `sitemap.xml` da raiz (a correção que de fato importa)
- `capa.png` 1200×630 para compartilhamento
- Migalhas de navegação visíveis

**Medição**
- `medir.js` compartilhado, GA4 ligado, `content_group: "site-dinheiro"`
- Eventos de funil: `comecou_diagnostico`, `diagnostico_pronto`, `plano_dividas_pronto`,
  `rotativo_calculado`, `tetos_calculados`, `escolheu_faixa`, `copiou_*`, `compartilhou`,
  `clique_plano` **com `origem`**, e profundidade de rolagem
- Nenhum valor digitado é enviado: só faixas, contagens e classificações

**Páginas novas, todas com ferramenta funcionando**
- `/qual-divida-pagar-primeiro/` — simula avalanche e bola de neve e mostra a diferença em reais
- `/juros-do-cartao-de-credito/` — o que o saldo vira em 3, 6 e 12 meses
- `/quanto-posso-gastar-ganhando/` — tetos por faixa com o piso do DIEESE
- `/como-sair-das-dividas/` — pilar que organiza as quatro ferramentas

**Links internos**
- Bloco `.trilhos` em todas as páginas; teste automatizado confirma **0 páginas órfãs e 0 links
  internos quebrados**

**Verificação**
- Sintaxe de todos os JS conferida
- As 4 calculadoras testadas no Chromium com valores reais — todas produzem resultado correto
- Matemática das simulações conferida separadamente (avalanche × bola de neve; juros compostos)

---

## 13. O que depende de você

Detalhes em [`ACAO-NECESSARIA.md`](ACAO-NECESSARIA.md). Em ordem de impacto:

| # | Ação | Tempo | Por que trava |
|---|---|---|---|
| 1 | **Ligar o Google Search Console** | 15 min | Exige login na sua conta Google. Sem ele, voamos cegos em busca — é o radar das Fases 16 e 19 |
| 2 | Publicar os conteúdos sociais no Instagram/TikTok | contínuo | Exige login nas plataformas |
| 3 | Decidir sobre domínio próprio | 10 min + ~R$ 40/ano | Exige gasto de dinheiro |
| 4 | Criar propriedade GA4 dedicada | 10 min | Opcional — hoje funciona com filtro por caminho de página |
| 5 | Confirmar se houve alguma venda na Kiwify | 5 min | Só você tem acesso ao extrato |

**Nenhuma das cinco bloqueia a continuação do trabalho.** As páginas 6 a 20 podem ser criadas
sem qualquer uma delas. A número 1 é a que mais muda a qualidade das decisões a partir da
semana 2.

---

## 14. Métricas que vamos acompanhar

Painel em [`PAINEL.md`](PAINEL.md), atualizado a cada ciclo com dado real do GA4.

**Tráfego** — visitantes 1/7/30 dias · origem (Google, Instagram, TikTok, direto, outros) ·
páginas mais vistas

**SEO** — impressões · cliques · CTR · posição média · consultas · páginas indexadas · erros
*(tudo isso depende do Search Console — hoje, "não medido")*

**Conversão — o funil, que é o que importa**

| Degrau | Evento | Pergunta que responde |
|---|---|---|
| Visita | `page_view` | Alguém chega? |
| Começou | `comecou_diagnostico` | O primeiro campo assusta? |
| Usou | `diagnostico_pronto` e irmãos | A ferramenta entrega? |
| Compartilhou | `compartilhou`, `copiou_*` | O resultado é bom o bastante para mostrar? |
| Quis comprar | `clique_plano` (com `origem`) | **Qual página vende?** |
| Comprou | extrato Kiwify | Existe negócio aqui? |

**As três taxas que decidem tudo** (Fase 14):
1. **Visita → uso.** Abaixo de 20%, o problema é a página, não o tráfego.
2. **Uso → clique na oferta.** Abaixo de 2%, o problema é a oferta ou o momento dela.
3. **Clique → compra.** Abaixo de 5%, o problema é a página de checkout ou o preço.

**Conteúdo** — publicados · melhor e pior por cliques · qual gerou venda

---

## Próxima ação

**Sem depender de você:** criar as páginas 6, 7 e 8 da seção 8 e publicar o primeiro lote de
conteúdo social no repositório, pronto para você postar.

**Dependendo de você:** ligar o Search Console. A partir daí, o ciclo da Fase 19 começa a
rodar com dado real toda semana, em vez de com hipótese.

---

*Relatório gerado em 08/08/2026. Números de tráfego vêm do GA4 (propriedade 546920453) via
Windsor.ai. Onde não havia dado, está escrito "não medido".*
