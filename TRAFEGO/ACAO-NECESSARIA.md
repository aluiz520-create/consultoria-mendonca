# O que depende de você

Só está nesta lista o que **eu não posso fazer**: exige senha, login, dinheiro ou uma decisão
que é sua. Tudo o mais eu executo sem perguntar.

**Nenhum item abaixo bloqueia a continuação do trabalho.** As páginas 6 a 20 podem ser criadas
sem nenhum deles. Mas o item 1 muda a qualidade de toda decisão a partir da semana 2.

---

## 1. Ligar o Google Search Console 🔴 prioridade máxima

**Tempo:** 15 minutos, uma vez só.
**Por que trava:** exige login na sua conta Google.

**O que muda:** hoje eu escolho quais páginas criar usando *estimativas* de dificuldade que fiz
olhando os resultados de busca. Com o Search Console, eu passo a usar **o que as pessoas
realmente digitaram para chegar no seu site** — impressões, cliques, CTR, posição. É a
diferença entre hipótese e fato, e é o motor das Fases 16 e 19.

👉 Passo a passo completo: [`SEARCH-CONSOLE.md`](SEARCH-CONSOLE.md)

**Se puder fazer só uma coisa desta lista inteira, faça esta.**

---

## 2. Publicar os conteúdos sociais 🟠 alta

**Tempo:** cerca de 20 min/dia.
**Por que trava:** exige login no Instagram e no TikTok.

**O que muda:** é a única fonte de tráfego que responde em dias. O SEO deste site vai levar
meses; o social é o que gera os primeiros usuários — e são eles que vão me dizer se a
ferramenta converte antes do Google descobrir que ela existe.

👉 30 conteúdos prontos, com roteiro e calendário de 15 dias:
[`MOTOR-DE-CONTEUDO.md`](MOTOR-DE-CONTEUDO.md)

**Decisão que preciso de você antes:** os conteúdos vão para `@controllerdoagro` ou para um
perfil novo? Minha recomendação é **perfil novo**. O público do agro/tributário não é o público
de dívida de cartão, e misturar estraga a audiência que você já tem. Detalhes em
[`DISTRIBUICAO.md`](DISTRIBUICAO.md).

**Comece pelo TikTok se o tempo for curto** — é onde um perfil zerado alcança gente sem
seguidor nenhum.

---

## 3. Decidir sobre domínio próprio 🟡 média

**Tempo:** 10 minutos · **Custo:** cerca de R$ 40/ano no Registro.br
**Por que trava:** gasto de dinheiro.

**O caso a favor:** hoje o site mora em `aluiz520-create.github.io/consultoria-mendonca/site-dinheiro/`.
Isso é ruim por três motivos: é impossível de falar em vídeo, divide autoridade com um site de
outro nicho, e a URL longa reduz o clique no resultado de busca.

**O caso contra:** não vale gastar antes de haver sinal de que o projeto pega. R$ 40 é pouco,
mas a hora certa é quando houver os primeiros usuários.

**Minha recomendação:** espere a semana 3. Se os primeiros conteúdos trouxerem gente que usa a
ferramenta, compre. Se não trouxerem, o domínio não era o problema.

Sugestões, na ordem que eu tentaria: `paraondefoimeudinheiro.com.br` ·
`meusalarioacaba.com.br` · `quantocustaminhavida.com.br`

**Quando decidir, me avise** — a migração são poucos arquivos e eu faço.

---

## 4. Criar propriedade GA4 dedicada 🟢 baixa

**Tempo:** 10 minutos.
**Por que trava:** exige login na sua conta Google.

**Situação atual:** liguei a medição usando a propriedade que você já tem
(`G-GQLS60YM9Y`, da consultoria). Isso **contraria a decisão original** registrada no README do
projeto, que dizia para não misturar — e a troca foi consciente: a alternativa era continuar
sem nenhum dado, e sem dado não há nada a otimizar.

**A mistura está controlada:** todas as páginas vivem sob `/site-dinheiro/`, então filtrar por
caminho isola o projeto em qualquer relatório; e o `config` manda
`content_group: "site-dinheiro"`, que vira dimensão no GA4.

**Faça quando:** o site do dinheiro tiver volume suficiente para os relatórios da consultoria
começarem a ficar confusos. Não é urgente. Quando fizer, me passe o novo `G-...` — é uma linha
em `medir.js`.

---

## 5. Confirmar se houve alguma venda 🟢 baixa

**Tempo:** 5 minutos.
**Por que trava:** só você tem acesso ao extrato da Kiwify.

O painel registra **0 vendas confirmadas**. Se houver qualquer venda que eu não saiba, me
avise — muda a prioridade inteira, porque prova que a oferta converte e o problema passa a ser
só de volume.

**Regra que eu sigo:** nenhum número de venda entra no painel sem confirmação sua no extrato.
Não haverá venda estimada nem projetada em relatório nenhum.

---

## O que eu vou fazer sem perguntar

Para você não precisar acompanhar: corrigir HTML, CSS e links · melhorar títulos, meta
descriptions e headings · criar páginas e artigos · escrever conteúdo social · mexer em
sitemap, robots e dados estruturados · melhorar links internos e CTAs · instalar e ler
medição · rodar experimentos de conversão · atualizar o painel com dado real.

**Só te procuro quando precisar de senha, API key, acesso externo, gasto de dinheiro,
publicação em plataforma com login, ou autorização legal.**
