# Mapa de conteúdo

Não é uma lista de artigos. É a estrutura que liga uma busca a uma ferramenta e a ferramenta a
uma oferta.

```
PILAR  →  SUBTÓPICOS  →  FERRAMENTA  →  OFERTA
```

Cada pilar tem uma ferramenta própria. **Página sem ferramenta só entra quando ela existe para
organizar as outras** — é o caso do pilar de dívidas.

---

## PILAR 1 — O salário que não chega ao fim do mês

**Página:** `/site-dinheiro/` ✅
**Ferramenta:** diagnóstico da casa — dia em que o salário acaba, custo por pessoa/dia, piso do
DIEESE, juros invisíveis
**Termos na base:** 12

**Subtópicos**

| Pergunta | Página | Status |
|---|---|---|
| Em que dia meu salário acaba | pilar | ✅ |
| Para onde vai meu dinheiro | pilar | ✅ |
| Por que meu salário nunca sobra | pilar | ✅ |
| Ganho bem mas não sobra nada | `/ganho-bem-e-nao-sobra-nada/` | 🔜 |
| Aumentei de salário e continuo sem dinheiro | idem | 🔜 |
| Estou usando o cartão para pagar contas | `/estou-usando-o-cartao-para-pagar-contas/` | 🔜 |
| Por que não consigo guardar dinheiro | `/por-que-nao-consigo-guardar-dinheiro/` | 🔜 |
| Onde cortar gastos primeiro | `/onde-cortar-gastos-primeiro/` + simulador de corte | 🔜 |

**Oferta:** plano de 90 dias · R$ 19,90

---

## PILAR 2 — Dívidas

**Página organizadora:** `/como-sair-das-dividas/` ✅ — as 5 decisões, na ordem
**Termos na base:** 48 (o maior cluster, e o de maior intenção comercial)

**Subtópicos e ferramentas**

| Pergunta | Página | Ferramenta | Status |
|---|---|---|---|
| Qual dívida pagar primeiro | `/qual-divida-pagar-primeiro/` | avalanche × bola de neve | ✅ |
| Quanto custa o rotativo do cartão | `/juros-do-cartao-de-credito/` | projeção 3/6/12 meses | ✅ |
| Qual conta pagar quando falta dinheiro | `/qual-conta-pagar-primeiro/` | ordenador por consequência do atraso | 🔜 |
| Dívida de cartão de X reais | `/divida-de-cartao/` | hub por valor (3k/5k/10k) | 🔜 |
| A proposta de acordo é boa | `/proposta-de-acordo-e-boa/` | checklist + total pago × parcela | 🔜 |
| Trocar dívida cara por barata | `/trocar-divida-cara-por-barata/` | comparador de taxas | 🔜 |
| Como sair das dívidas ganhando pouco | `/como-sair-das-dividas-ganhando-pouco/` | — | 🔜 |
| Meu salário está todo comprometido | `/meu-salario-esta-comprometido/` | calculadora de comprometimento | 🔜 |

**Oferta:** plano de 90 dias · R$ 19,90 — a mais direta do site, porque quem está aqui já
reconheceu o problema

---

## PILAR 3 — Quanto dá para gastar com o que eu ganho

**Página:** `/quanto-posso-gastar-ganhando/` ✅
**Ferramenta:** tetos por faixa de renda + piso do DIEESE da composição
**Termos na base:** 28

**Subtópicos**

| Pergunta | Página | Status |
|---|---|---|
| Quanto posso gastar ganhando 2.000 / 2.500 / 3.000 / 4.000 / 5.000 | pilar (seletor de faixa) | ✅ |
| Quanto do salário pode ir para aluguel | pilar | ✅ |
| Quanto do salário pode ir para parcelas | pilar | ✅ |
| Como organizar salário de 2.500 | `/como-organizar-salario-de-2500/` | 🔜 |
| Como organizar salário de 3.000 | `/como-organizar-salario-de-3000/` | 🔜 |
| Quanto de aluguel posso pagar | `/quanto-de-aluguel-posso-pagar/` | 🔜 |
| A regra 50-30-20 não funciona pra mim | `/50-30-20-nao-funciona/` | 🔜 |
| Posso comprar um carro ganhando X | `/quanto-custa-manter-um-carro/` | 🔜 |

**Oferta:** entrada pelo diagnóstico gratuito → plano de 90 dias

---

## PILAR 4 — Quanto uma família precisa ganhar

**Página:** `/quanto-precisa-ganhar/` ✅
**Ferramenta:** tabela por composição de família + cálculo da casa da pessoa
**Termos na base:** 22

**Subtópicos**

| Pergunta | Página | Status |
|---|---|---|
| Salário mínimo necessário do DIEESE | pilar | ✅ |
| Quanto custa manter família de 3 / 4 pessoas | pilar | ✅ |
| Quanto uma pessoa sozinha precisa ganhar | pilar | ✅ |
| Quanto custa criar um filho | `/quanto-custa-criar-um-filho/` | 🔜 |
| Quanto preciso ganhar para morar sozinho | `/quanto-preciso-ganhar-para-morar-sozinho/` | 🔜 |
| Custo de vida médio no Brasil | `/custo-de-vida-no-brasil/` | 🔜 |

**Oferta:** este pilar converte pouco direto — ele existe para **autoridade e links**. Dado
oficial é o tipo de conteúdo que outros sites citam, e é assim que um domínio novo ganha
autoridade. Manda o tráfego para o pilar 1.

**Manutenção:** os números do DIEESE mudam todo mês. Atualizar em `app.js`, `faixas.js` e nos
textos de `/quanto-precisa-ganhar/` quando sair a pesquisa nova. É a única página do site com
prazo de validade.

---

## Como os pilares se ligam

```
                    ┌──────────────────────────────┐
                    │  PILAR 1 — o salário acaba   │  ← entrada mais larga
                    │  /site-dinheiro/             │
                    └───────────┬──────────────────┘
                                │ "e as minhas dívidas?"
              ┌─────────────────┼──────────────────┐
              ▼                 ▼                  ▼
       ┌─────────────┐  ┌──────────────┐  ┌────────────────┐
       │  PILAR 2    │  │   PILAR 3    │  │    PILAR 4     │
       │  dívidas    │  │ quanto gastar│  │ quanto precisa │
       │ (converte)  │  │              │  │  (autoridade)  │
       └──────┬──────┘  └───────┬──────┘  └───────┬────────┘
              └─────────────────┼──────────────────┘
                                ▼
                      Plano de 90 dias · R$ 19,90
```

**A regra de ligação:** toda página aponta para o pilar 1 (é a ferramenta mais fácil de usar e
a que dá o número que todas as outras precisam) e para pelo menos duas irmãs. Nenhuma página
é beco sem saída.

---

## Critério para uma página existir

Antes de criar qualquer página desta lista, ela precisa passar nos sete:

1. Responde a intenção da busca, não uma parecida
2. Entrega informação que a pessoa usa hoje
3. Tem ferramenta ou recurso próprio, quando o tema permite
4. Tem CTA claro
5. Tem links internos de entrada e de saída
6. É única — não é outra página do site com palavras trocadas
7. Funciona bem no celular

**E o teste que vale mais que os sete** (Fase 8): *se eu fosse a pessoa que digitou essa busca,
esta página resolveria meu problema?* Se não, ela não vai ao ar.
