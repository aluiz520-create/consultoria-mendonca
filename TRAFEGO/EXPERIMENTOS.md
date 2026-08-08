# Registro de experimentos

Formato fixo: **HIPÓTESE → ALTERAÇÃO → RESULTADO → DECISÃO**.

**Regra:** uma variável por vez, sempre que separar a causa importar. Se duas mudanças forem
rodadas juntas, isso fica escrito aqui e o resultado é lido como conjunto — não como duas
conclusões.

**Regra 2:** nenhum experimento é declarado vencedor sem dado. Se o volume for baixo demais
para concluir, a linha de resultado diz "sem volume para concluir" e o teste continua rodando.

---

## E0 — Linha de base (não é experimento)

**Data:** 08/08/2026
**O que foi feito:** medição instalada, 4 páginas novas, links internos, sitemap corrigido.

**Por que não é experimento:** foram muitas mudanças ao mesmo tempo, de propósito. Antes disso
o site tinha **zero** visitantes medidos — não havia base contra a qual comparar nada. Testar
variações de uma página que ninguém acessa não produz informação.

**O que estabelece:** a linha de base contra a qual todo experimento daqui em diante será
medido. A partir da próxima leitura, uma variável por vez.

---

## E1 — Texto do botão da oferta 🔜 semana 3

**Hipótese:** "Quero o plano completo" descreve a transação, não o resultado. Um botão que
promete o resultado deve converter mais.

**Alteração:** trocar por **"Ver a minha ordem de saída"** na página `/como-sair-das-dividas/`,
mantendo o texto original nas outras três. As páginas viram controle e variação naturais,
porque o evento `clique_plano` já carrega `origem`.

**Medida:** `clique_plano` ÷ visitas da página, comparado entre as origens.

**Volume mínimo para concluir:** 200 visitas por variação. Abaixo disso, continua rodando.

**Resultado:** aguardando tráfego
**Decisão:** —

---

## E2 — Posição do bloco da oferta 🔜 semana 4

**Hipótese:** na página inicial a oferta aparece **depois** de todo o resultado. Quem está no
vermelho pode sair antes de chegar lá — o momento de maior impacto emocional é logo após o
veredito, não no fim.

**Alteração:** na home, mover o bloco pago para logo abaixo do veredito, mantendo o atalho do
fim do artigo.

**Medida:** `clique_plano` com `origem: home` antes × depois, e profundidade de rolagem, para
confirmar se as pessoas de fato não chegavam ao fim.

**Risco a vigiar:** oferecer cedo demais pode parecer que a ferramenta gratuita é isca. Se o
evento `compartilhou` cair junto, a mudança piorou a confiança e volta atrás — mesmo que o
clique na oferta suba.

**Resultado:** aguardando tráfego
**Decisão:** —

---

## E3 — Título da página inicial 🔜 quando houver Search Console

**Hipótese:** "Em Que Dia o Seu Salário Acaba? Calculadora Grátis, Sem Cadastro" tem CTR maior
que o título anterior, que começava pelo nome da marca.

**Alteração:** já aplicada em 08/08.

**Medida:** CTR no Search Console, comparado entre o período anterior e o posterior.

**Bloqueio:** exige Search Console ligado **e** impressões suficientes. Sem os dois, não há
como medir — e nesse caso o experimento fica parado em vez de ser declarado vencedor por
opinião.

**Resultado:** aguardando Search Console
**Decisão:** —

---

## E4 — Ferramenta antes ou depois do texto 🔜 backlog

**Hipótese:** em `/qual-divida-pagar-primeiro/` a calculadora vem antes do artigo. Isso deve
aumentar o uso e reduzir a leitura. A dúvida é se a leitura importa para a conversão.

**Medida:** cruzar `plano_dividas_pronto` com `rolagem: 75` — descobrir se quem compra é quem
usa, quem lê, ou os dois.

**Por que esperar:** só vale rodar depois de existir uma quantidade razoável de compras. Antes
disso não há o que cruzar.

**Resultado:** aguardando volume
**Decisão:** —

---

## Fila de ideias (ainda sem hipótese formulada)

- Preço: R$ 19,90 × R$ 29,00 × R$ 14,90 — **exige gasto/decisão do proprietário**
- Mostrar contagem de uso ("X pessoas fizeram esta conta") — só quando for verdade
- Botão de compartilhar no topo do resultado, além do fim
- Versão do diagnóstico com menos campos, para reduzir abandono
- Prova social real, quando houver primeiro cliente que autorize
