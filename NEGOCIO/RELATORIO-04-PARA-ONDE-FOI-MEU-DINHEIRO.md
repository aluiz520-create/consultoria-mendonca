# RELATÓRIO 04 — "PARA ONDE FOI MEU DINHEIRO?"

**Data:** 08/08/2026 · **Status:** ferramenta construída e no ar

---

## 0. Registro da decisão

No Relatório 01 eu pontuei essa ideia em **41/100** e recomendei abandonar. Você reafirmou
que quer seguir com ela.

**A decisão é sua e eu executei por inteiro.** Este relatório não volta a discutir se
devemos fazer — mostra *como* fiz para maximizar a chance de dar certo, e quais objeções
continuam de pé para você acompanhar com os olhos abertos.

Uma coisa mudou de verdade na minha avaliação depois da pesquisa de hoje: **existe um ângulo
não ocupado.** Ele não resolve o problema de monetização, mas resolve o de diferenciação —
que era a minha segunda maior objeção.

---

## 1. O que a pesquisa mostrou

Pesquisei os dois caminhos óbvios. Os dois estão saturados:

| Caminho | Concorrentes encontrados na 1ª página |
|---|---|
| Calculadora de salário líquido | Serasa Experian, Mobills, iDinheiro, Buk, Calcule.net, CálculoJurídico, MeuImposto, Carmelitas |
| Calculadora 50/30/20 | iDinheiro, Rankia, CalculadoraBrasil, SeuDinheiroHoje, GuiaDeEconomiaPessoal |
| Priorizador de dívidas *(pesquisa de ontem)* | TCU, Exame/Geru, CalculaFin, FinanceTools, CalculandoRiquezas, MeuTudo, VidaFinanceiraInteligente |

**O padrão que ninguém quebrou:** todas fazem a conta na direção **prescritiva** —
*"com a sua renda, você deveria gastar tanto em cada coisa"*.

Isso é útil para quem tem folga. É inútil — e um pouco humilhante — para quem não tem, porque
responde uma pergunta que a pessoa não fez.

## 2. O ângulo que ficou livre: a conta inversa

A pergunta que a pessoa realmente faz não é *"como eu deveria dividir?"*. É:

> **"Quanto eu precisaria ganhar para a vida que eu já tenho caber no que eu recebo?"**

Ninguém responde isso. E a resposta é **um número só**, em reais — o que a torna concreta,
chocante e altamente compartilhável.

Foi nisso que a ferramenta foi construída. Ela entrega três coisas que os concorrentes não
entregam juntas:

1. **"A sua vida custa R$ X"** — o custo real, somado, sem julgamento.
2. **"Para sobrar 10%, você precisaria ganhar R$ Y"** — a conta inversa. Se Y > renda, a
   diferença aparece explícita: *"são R$ Z a mais do que você recebe hoje"*.
3. **O custo invisível dos juros** — quanto sai por mês do rotativo **sem abater a dívida**,
   e quanto isso vira em 12 meses. É o número que mais falta no debate e o mais fácil de
   ignorar, porque não aparece como "gasto".

E uma quarta, que é de posicionamento: **o diagnóstico não culpa a pessoa.** Quando nenhuma
categoria está fora da referência e mesmo assim falta dinheiro, a ferramenta diz isso —
*"o problema não é o gasto, é a renda ser baixa demais para o custo de vida da região"*.
Nenhum concorrente diz isso, porque quase todos vendem crédito ou culpa.

---

## 3. O que foi construído

**URL:** `/dinheiro/` · **Arquivo:** `dinheiro/index.html` (autocontido, sem dependência do site do agro)

| Característica | Decisão | Por quê |
|---|---|---|
| Cadastro / e-mail | **Nenhum** | Maior ponto de atrito do funil, e aqui não há o que entregar por e-mail ainda |
| Dados enviados a servidor | **Nenhum** | Cálculo 100% no navegador. Vira argumento de confiança e elimina LGPD |
| Etapas | **Uma só**, cálculo ao vivo | Sem passo entre telas, não há onde abandonar |
| Identidade visual | **Própria** (índigo/âmbar), sem o verde do agro | Não pode ser confundido com a Consultoria Mendonça |
| Header/nav do site do agro | **Não usa** | Idem |
| Custo de manutenção | **Zero** | HTML estático, sem build, sem dependência |

**Eventos GA4** (prefixados para não se misturar com o funil do agro):
`dinheiro_diagnostico` (com `situacao`, `comprometimento`, `tem_rotativo`) ·
`dinheiro_copiou` · `dinheiro_compartilhou`

O campo `situacao` responde a pergunta que decide o futuro do projeto: **que fatia do público
fecha no vermelho?** Se for a maioria, está confirmado que o público não tem como pagar — e
a monetização terá que ser por volume, não por produto.

### Testes executados

Testei em navegador com quatro cenários (vermelho com rotativo, sobra sem rotativo, formatos
de número brasileiros, renda apagada), mais teste de overflow em tela de 420px.

**Um bug real encontrado e corrigido:** o parser lia `1.800` como `1,8`, porque
`parseFloat("1.800")` devolve `1.8`. Um usuário digitando "1.800" de aluguel veria a vida
dele custar R$ 3. Regra nova: se todo grupo depois de um ponto tem exatamente 3 dígitos, o
ponto é separador de milhar. Revalidado nos 6 formatos: `1.800`, `1200.50`, `4.500,50`,
`1.234.567`, `0,5` e `R$ 2.000`.

---

## 4. Monetização — o problema que continua sem solução

Preciso ser direto: **eu não resolvi isso, e não vou fingir que resolvi.**

A ferramenta está boa. O público continua sendo, por definição, gente sem dinheiro sobrando.

**O que eu deliberadamente NÃO fiz:**

❌ **Não coloquei botão de compra de um produto que não existe.** Seria vender fumaça.
❌ **Não coloquei afiliado de empréstimo, cartão ou renegociação de dívida.** Essa é a
monetização óbvia do nicho e é exatamente por isso que os resultados de busca estão cheios
dela. Mandar quem está no vermelho para uma oferta de crédito é lucrar com o problema que a
ferramenta diz estar resolvendo. Não faço, e recomendo que você também não faça — além do
problema ético, é o tipo de coisa que destrói a reputação que sustenta a sua consultoria.

**Os caminhos que sobram, com gatilho de ativação definido:**

| Caminho | Quando ativar | Expectativa realista |
|---|---|---|
| **Compartilhamento → volume** | já ativo | É o motor. Sem volume, nada mais funciona |
| **AdSense** | a partir de ~1.000 visitas/mês | RPM baixo no Brasil em finanças pessoais. Com 10 mil visitas/mês, a ordem de grandeza é dezenas de reais, não centenas |
| **Produto de R$ 19,90** (plano de 90 dias) | só depois de 100 diagnósticos concluídos | Só escrevo o produto quando os dados mostrarem que existe público. Escrever antes é trabalho jogado fora |

**A ordem importa:** volume primeiro, produto depois. O inverso é o erro que já estamos
pagando do lado do agro — produto pronto, tráfego zero.

---

## 5. As objeções que continuam de pé

Registro para você acompanhar, não para reabrir a discussão:

1. **Público sem poder de compra** — não mitigado. É estrutural.
2. **Concorrência com marca e orçamento** — mitigado *parcialmente*: o ângulo inverso é
   livre, mas Serasa e Nubank podem copiá-lo em uma semana se der certo.
3. **Sem autoridade sua no tema** — mitigado: ferramenta self-service não depende de rosto.
4. **Custo de oportunidade** — **este é o que eu vigiaria.** Esta ferramenta custou uma
   fração de sessão e não tem manutenção. Se virar um projeto que consome sua atenção
   semanal enquanto o agro continua com alcance 1, ela vira o problema, não a solução.
5. **Risco regulatório** — mitigado: aviso educativo explícito, nenhuma recomendação
   individualizada, e indicação de canais gratuitos de orientação (Procon e programas de
   renegociação) para quem está em atraso.

---

## 6. Critérios de morte (definidos agora, para não haver apego depois)

| Prazo | Se acontecer isto | Decisão |
|---|---|---|
| 30 dias | menos de 100 visitas | O problema é distribuição — não houve teste. Publicar 3 conteúdos e reavaliar |
| 60 dias | menos de 300 visitas com conteúdo publicado | **Abandonar.** O ângulo não pega |
| 60 dias | +300 visitas e taxa de compartilhamento < 2% | Motor viral não existe. Sem ele, não há modelo |
| 90 dias | volume crescendo | Ativar AdSense e escrever o produto de R$ 19,90 |
| a qualquer momento | consumir mais atenção que o agro sem gerar receita | **Congelar.** O agro tem ticket 50× maior |

---

## 7. Marca — a decisão que ficou pendente

A ferramenta está hospedada dentro do site da Consultoria Mendonça
(`/consultoria-mendonca/dinheiro/`). Isso tem um custo: mistura dois assuntos sem relação no
mesmo domínio, o que enfraquece a autoridade temática dos dois lados no Google.

**Hoje esse custo é teórico**, porque o site do agro ainda não tem autoridade nenhuma para
proteger — são 9 sessões no total. Por isso publiquei assim, para não travar a entrega.

**Se a ferramenta passar dos critérios de 60 dias, mova para domínio próprio.** Ela foi feita
autocontida — CSS próprio, sem header do agro, sem dependência de `styles.css` — exatamente
para que essa mudança seja copiar uma pasta, e não uma reescrita.

---

## 8. O que depende de você

1. **Nada, para funcionar.** A ferramenta está no ar e não precisa de conta, chave ou configuração.
2. **Para ter tráfego:** publicar. O ângulo "quanto a sua vida custa" é conteúdo de Reels
   quase pronto — o número na tela já é o gancho.
3. **Uma decisão sua:** se essa ferramenta vai ou não aparecer ligada ao seu nome. Hoje o
   rodapé cita a Consultoria Mendonça. Se você preferir separar completamente as duas coisas,
   eu tiro — é uma linha.
