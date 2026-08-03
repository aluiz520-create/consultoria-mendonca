# 09 — LIMPEZA DA BASE · protocolo operacional

Decidido em 03/08/2026 · **Opção A: limpar e continuar com `@controllerdoagro`**

---

## O que a API mostrou

| Evidência | Número |
|---|---|
| Novos seguidores em 02/08 | **+982** |
| Alcance do perfil em 02/08 | **123 contas** |
| Curtidas em 02/08 | 165 |
| Salvamentos · compartilhamentos · comentários | **0 · 0 · 0** |
| Seguidores 02/08 18h → 03/08 manhã | 1.128 → **978** |
| Novos seguidores de 04/07 a 01/08 | 0 por dia |

982 seguidores num dia em que 123 contas viram o perfil. Seguidor não chega de quem
não viu. A base é artificial.

---

## Por que limpar, e não só ignorar

O algoritmo calcula **engajamento sobre a base inteira**. Com ~900 contas inertes:

- Todo post nasce com taxa de engajamento próxima de zero
- O Instagram conclui que o conteúdo não interessa e **reduz a entrega para todos**
- Os produtores e contadores reais que chegarem depois recebem menos alcance
- E a métrica fica cega: não dá para saber se um post foi bom ou ruim

**Cada conta falsa removida melhora a entrega para as reais.**

---

## Protocolo de remoção

### ⚠️ Regra de segurança
**Máximo 80 remoções por dia.** Remoção em massa dispara bloqueio de ação — o mesmo
mecanismo que pune bot. Ironicamente, limpar rápido demais é tratado como
comportamento automatizado.

Em ~80/dia, 900 contas levam **12 dias úteis**. É chato. É o custo da opção A.

### Como remover
Perfil → **Seguidores** → toque no nome → **Remover seguidor**

### Como identificar (do mais óbvio ao mais sutil)

| Sinal | O que procurar |
|---|---|
| **Sem foto de perfil** | Silhueta cinza padrão |
| **Zero publicações** | Perfil vazio |
| **@ com números aleatórios** | `joao_8472913`, `maria.k29x` |
| **Seguindo milhares, seguido por poucos** | Segue 4.000, tem 12 seguidores |
| **Nome sem relação com o agro** | Perfil estrangeiro, nome genérico |
| **Conta privada recém-criada** | Cadeado + sem foto + sem bio |

**Não remova** quem tem foto real, posta conteúdo e tem relação com agro,
contabilidade ou negócios — mesmo que não interaja. Falso negativo custa caro.

### Ordem sugerida
Comece pelos **sem foto e sem posts**. São os mais fáceis de julgar e provavelmente
a maioria.

### Registro
Anote no fim de cada dia:

| Data | Removidos | Total restante | Alcance do post do dia |
|---|---|---|---|
| | | | |

---

## Como medir enquanto a base está suja

> **A taxa de engajamento está inutilizada até a limpeza terminar.**
> Não olhe percentual. Olhe **número absoluto**.

### Nova régua provisória

| Métrica | Meta semanal | Por quê |
|---|---|---|
| **Salvamentos por post** | ≥ 3 | Conta falsa não salva. **Todo salvamento é real.** |
| **Compartilhamentos** | ≥ 1 | Idem |
| **Comentários reais** | ≥ 1 | Idem |
| **Directs qualificados** | ≥ 1 | A métrica-mestre, sempre foi |
| **Alcance de não-seguidores** | crescente | Mede se o conteúdo escapa da bolha |
| ~~Taxa de engajamento~~ | — | **Ignorar até a base estar limpa** |

**O primeiro salvamento real vale mais que os 982 seguidores.** Ele significa que uma
pessoa do agro achou o conteúdo útil o bastante para guardar.

---

## O que NÃO fazer durante a limpeza

| ❌ | Por quê |
|---|---|
| Comprar mais seguidores ou curtidas | Recomeça o problema do zero |
| Remover mais de 80/dia | Bloqueio de ação |
| Parar de postar | Frequência é o que reconstrói o sinal |
| Cobrar resultado de alcance nas próximas 3 semanas | A base ainda está distorcendo tudo |
| Divulgar o perfil para a lista dos 100 agora | Espere a limpeza avançar |

---

## Cronograma realista

| Semana | O que acontece |
|---|---|
| **1** | ~400 removidos. Alcance ainda instável. Postar normal. |
| **2** | ~800 removidos. Primeiros sinais de entrega melhor. |
| **3** | Base limpa. Métricas voltam a significar algo. |
| **4** | Régua normal do `06-PAINEL-DE-CONTROLE.md` volta a valer. |

Durante todo o período: **publicar seguindo o calendário**, sem exceção. Consistência
é o que reconstrói o sinal do algoritmo.

---

## Autocrítica deste protocolo

- **12 dias de trabalho manual é muito**, e é a razão pela qual eu recomendei a opção B.
  Você escolheu A e a decisão é sua — mas se no terceiro dia isso virar um fardo, trocar
  para um `@` novo continua sendo possível e barato. Não é derrota, é cálculo.
- **Não sei quantas das 978 são falsas.** Estimei ~900 pela série diária, mas é
  inferência. Se você encontrar muitos perfis legítimos na lista, me diga — muda o plano.
- **O limite de 80/dia é conservador**, baseado no comportamento conhecido de limites de
  ação do Instagram, não em documentação oficial. Se aparecer "ação bloqueada", pare por
  48h e retome em 40/dia.
- **Não previ o que fazer se o Instagram remover sozinho.** Ele já tirou 150 em 24h. Se
  o ritmo continuar, boa parte do trabalho se resolve sem você. **Confira o total diário
  antes de começar a remover** — pode ser que sobre menos do que parece.
