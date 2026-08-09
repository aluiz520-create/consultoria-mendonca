# Google Search Console — passo a passo

**Tempo: cerca de 15 minutos. Uma vez só.**

Isto é o item número 1 da lista de ações do proprietário. Sem Search Console não existem
impressões, cliques, CTR, posição média nem consultas — e sem isso as Fases 16 e 19 do plano
(usar os dados como radar) não têm o que ler.

---

## Por que não posso fazer isso por você

O Search Console exige login na sua conta Google. Não tenho e não devo ter acesso a ela.
Tudo o que dependia do site já está pronto: sitemap correto, canonical em todas as páginas,
nenhuma página órfã, nenhum link quebrado.

---

## Passo 1 — Adicionar a propriedade

1. Abra **https://search.google.com/search-console** e entre com a sua conta Google.
2. Clique em **Adicionar propriedade**.
3. Escolha o tipo **"Prefixo do URL"** (a caixa da direita, **não** a de domínio).
4. Cole exatamente isto:

```
https://aluiz520-create.github.io/consultoria-mendonca/
```

> **Por que o prefixo e não o domínio:** o tipo "Domínio" exige mexer no DNS, e você não
> controla o DNS de `github.io`. Com prefixo, a verificação é por arquivo ou por tag — e o
> arquivo você consegue subir.

---

## Passo 2 — Verificar a propriedade

O Google vai oferecer alguns métodos. Use o **arquivo HTML**:

1. Clique em **Arquivo HTML** e baixe o arquivo. O nome parece com
   `google1a2b3c4d5e6f7g8h.html`.
2. Coloque esse arquivo na **raiz do repositório** — a mesma pasta onde está o `index.html`
   principal, não dentro de `site-dinheiro/`.
3. Faça commit e push.
4. Espere 1 ou 2 minutos e confira se ele abre em:
   `https://aluiz520-create.github.io/consultoria-mendonca/google...........html`
5. Volte ao Search Console e clique em **Verificar**.

**Se preferir não mexer no Git:** me mande o nome do arquivo e o conteúdo dele que eu subo.

**Se der erro de verificação:** aguarde 5 minutos e tente de novo — o GitHub Pages leva um
tempo para publicar.

---

## Passo 3 — Enviar o sitemap

Ainda no Search Console, com a propriedade verificada:

1. Menu lateral → **Sitemaps**.
2. No campo "Adicionar novo sitemap", digite só:

```
sitemap.xml
```

3. Clique em **Enviar**.

O status deve ficar **"Sucesso"** em alguns minutos, com **23 URLs descobertos** (15 do site
da consultoria + 8 do site do dinheiro).

> Este é o sitemap que importa. Em GitHub Pages de projeto, o Google só lê o `robots.txt` da
> raiz do domínio, então é este sitemap — o da raiz do repositório — que carrega as páginas do
> `/site-dinheiro/`. O `sitemap.xml` dentro da pasta só passa a valer em domínio próprio.

---

## Passo 4 — Pedir indexação das páginas novas

Isso acelera bastante a primeira aparição. Para cada uma das 8 URLs abaixo:

1. Cole a URL na **barra de busca do topo** do Search Console.
2. Espere a análise ("URL não está no Google" é o esperado agora).
3. Clique em **Solicitar indexação**.
4. Repita. Há um limite diário — se travar, faça o resto no dia seguinte.

```
https://aluiz520-create.github.io/consultoria-mendonca/site-dinheiro/
https://aluiz520-create.github.io/consultoria-mendonca/site-dinheiro/qual-divida-pagar-primeiro/
https://aluiz520-create.github.io/consultoria-mendonca/site-dinheiro/juros-do-cartao-de-credito/
https://aluiz520-create.github.io/consultoria-mendonca/site-dinheiro/quanto-posso-gastar-ganhando/
https://aluiz520-create.github.io/consultoria-mendonca/site-dinheiro/como-sair-das-dividas/
https://aluiz520-create.github.io/consultoria-mendonca/site-dinheiro/quanto-precisa-ganhar/
https://aluiz520-create.github.io/consultoria-mendonca/site-dinheiro/qual-conta-pagar-primeiro/
https://aluiz520-create.github.io/consultoria-mendonca/site-dinheiro/meu-salario-esta-comprometido/
```

**Ordem de prioridade se você só tiver tempo para duas:** a primeira e a
`qual-divida-pagar-primeiro/`.

---

## Passo 5 — Me dar acesso de leitura (opcional, mas é o que faz a diferença)

Sem isso, você precisa me mandar prints ou exportações toda semana. Com isso, eu leio os dados
sozinho e as Fases 16 e 19 rodam de verdade.

**Opção A — usuário delegado (mais simples)**
Configurações → Usuários e permissões → Adicionar usuário → permissão **"Completo"** ou
**"Restrito"**. Só serve se houver uma conta Google minha para adicionar — hoje não há, então
provavelmente é a opção B.

**Opção B — conectar via Windsor.ai (recomendado)**
Você já usa o Windsor.ai para o GA4 e o Instagram. Ele também conecta Google Search Console.
Ao adicionar o conector lá, eu passo a ler os dados de busca com as mesmas ferramentas com que
já leio o GA4 — que foi como levantei os números deste relatório.

**Opção C — exportação manual**
Uma vez por semana: Desempenho → intervalo de 28 dias → Exportar → CSV. Me mande o arquivo.
Funciona, só é mais trabalhoso para você.

---

## O que eu vou olhar toda semana (Fase 19)

| Sinal | O que significa | Ação |
|---|---|---|
| Muitas impressões, poucos cliques | O título e a descrição não convencem | Reescrever title e meta description |
| Posição entre 5 e 20 | Está quase lá — é a maior alavanca do site | Aprofundar o conteúdo, adicionar perguntas relacionadas, mais links internos |
| Consulta com impressão e sem página dedicada | Demanda descoberta | Criar a página |
| Página com tráfego e zero clique na oferta | O conteúdo atrai, a oferta não | Trocar CTA, posição ou promessa |
| Página com tráfego e alta rolagem | Está funcionando | Fazer mais páginas iguais a essa |

**Prazo realista:** as primeiras impressões costumam aparecer entre 1 e 3 semanas após a
indexação. Cliques em volume relevante, em domínio novo e nicho concorrido, levam meses. É por
isso que a distribuição social vem primeiro — ela dá resposta em dias enquanto o SEO amadurece.

---

## Depois de fazer, me avise

Basta dizer "Search Console ligado". A partir daí eu passo a usar os dados reais para decidir
quais páginas criar, em vez de usar as estimativas de dificuldade da `palavras-chave.csv`.
