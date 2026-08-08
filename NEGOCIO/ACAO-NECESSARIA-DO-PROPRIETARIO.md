# AÇÃO NECESSÁRIA DO PROPRIETÁRIO

**Atualizado em 08/08/2026**

Tudo que eu podia fazer sozinho está feito e publicado. O que está nesta lista depende de
uma conta, uma senha ou um aparelho que só você tem. Está em ordem de impacto sobre a
primeira venda — faça de cima para baixo.

---

## 🔴 1. Voltar a publicar (5 minutos por dia)

**Este é o item mais importante da lista. Sem ele, nada do resto funciona.**

Os números: alcance de **123 pessoas no dia 02/08** → **1 pessoa no dia 07/08**. Três dias
sem publicar. Nenhuma ferramenta, nenhuma página de SEO e nenhum produto converte quando o
alcance é de uma pessoa por dia.

**O que fazer:** publicar 1 Reel e 1 carrossel por semana, no mínimo. Peça o próximo pacote
com `GERAR CONTEÚDO` — a skill já produz no formato certo.

**Regra de CTA que ainda não foi aplicada nenhuma vez** (está no `marca/09-FUNIL-INSTAGRAM-SITE.md`):
- **Reels → link na bio.** Reels alcança gente nova; mandar para o Direct desperdiça.
- **Carrossel → Direct com palavra-chave.** Quem lê até o fim é lead quente.
- **Sempre peça salvamento** com benefício concreto. Salvamento está em 0 há 30 dias, e é
  ele que faz o post continuar circulando.

---

## 🔴 2. Corrigir a bio do Instagram (2 minutos)

A bio está, hoje, literalmente assim:

> Teste **de** sua Fazenda está pronta 👇

Está com erro de concordância e não faz sentido. Seu público é produtor e contador — erro de
português na primeira linha do perfil derruba a credibilidade técnica antes do primeiro post
ser lido.

**Troque por:**

```
IBS/CBS na nota sem rejeição + custo real por saca.
🌾 Produtor • Armazém • Cerealista • Cooperativa
🧾 SIAGRI • Power BI • Controladoria
👇 Descubra em 40s se você já está obrigado
```

**E troque o link da bio** para a ferramenta nova, direto (um toque a menos que hoje):

```
https://aluiz520-create.github.io/consultoria-mendonca/obrigado-ibs-cbs/
```

**Ative também o botão nativo de WhatsApp** no perfil. Ele converte mais que link, porque a
pessoa não sai do app.

---

## 🟠 3. Criar o produto de R$ 29 na Kiwify (15 minutos)

Hoje o botão "Comprar" da página do guia cai num fluxo manual por WhatsApp + Pix. **Funciona
e já pode gerar a primeira venda hoje** — mas exige você responder na hora, e a entrega é
manual.

**Passo a passo:**

1. Entre na sua conta Kiwify.
2. Crie um produto digital: **Guia Anti-Rejeição — IBS/CBS na nota do agro**, **R$ 29**.
3. Suba o PDF como entrega (veja o item 4 abaixo para gerar o PDF).
4. Ative Pix e cartão. Deixe a entrega automática por e-mail ligada.
5. Copie o link de checkout (formato `https://pay.kiwify.com.br/XXXXXXX`).
6. Cole o link no arquivo `produtos/guia-anti-rejeicao/index.html`, na linha marcada:

```js
var CHECKOUT_KIWIFY = "";   // ← cole entre as aspas
```

Assim que houver um link ali, o botão passa sozinho a apontar para o checkout e o evento do
GA4 muda de `whatsapp_pix` para `kiwify`. Nenhuma outra alteração é necessária.

**Se preferir, me mande o link que eu colo.**

---

## 🟠 4. Gerar o PDF do Guia (10 minutos)

O texto completo do guia foi **entregue a você no chat** como
`guia-anti-rejeicao.md`. Ele não está no repositório de propósito: **o repositório é
público**, e conteúdo pago dentro dele ficaria de graça para quem soubesse o caminho do
arquivo. A explicação está em `NEGOCIO/produto/README.md`.

**O que fazer:** abrir o arquivo, colar no Google Docs ou Word, exportar em PDF. Mantenha a
folha de conferência (capítulo 8) em uma página só — ela existe para ser impressa e ficar do
lado do monitor.

Guarde o `.md` no seu Drive. É dele que saem as próximas versões.

---

## 🟡 5. Conectar o Google Search Console (10 minutos)

**É a maior lacuna de dados que sobrou.** Sem ele, eu escrevo SEO no escuro: não sei quais
buscas trazem gente, quais termos você já aparece, nem em que posição.

1. Acesse `search.google.com/search-console`.
2. Adicione a propriedade `https://aluiz520-create.github.io/consultoria-mendonca/`.
3. Valide (a forma mais simples aqui é pela tag HTML — **me mande a tag que eu instalo**).
4. Envie o sitemap: `sitemap.xml`.
5. Peça indexação manual das 3 páginas novas:
   - `/obrigado-ibs-cbs/`
   - `/blog/cnpj-produtor-rural-2026-ou-2027.html`
   - `/blog/nota-rejeitada-ibs-cbs-o-que-fazer.html`

Depois disso, conecte o Search Console no Windsor.ai — do mesmo jeito que já estão o GA4 e o
Instagram. Aí eu passo a escolher os próximos artigos por dado, não por palpite.

---

## 🟡 6. Decidir sobre o domínio próprio

Hoje o site vive em `aluiz520-create.github.io/consultoria-mendonca/`. Funciona, mas:

- Subdomínio genérico compete pior no Google que domínio próprio.
- No B2B, um produtor de 3.000 ha reparar num link `github.io` custa confiança.

Um `.com.br` custa por volta de R$ 40/ano. **Minha recomendação: não faça agora.** Espere a
primeira venda. É uma despesa pequena, mas trocar de domínio antes de saber se o funil
converte é otimizar a coisa errada — e você pediu 80% do esforço no que gera receita.

---

## 🟢 7. Os primeiros 10 contatos (a coisa com maior chance de dar a 1ª venda)

Sendo honesto com você: entre tudo que está nesta lista, **isto aqui é o que tem mais chance
de produzir a primeira venda esta semana.** SEO leva semanas. Instagram, com alcance de 1,
leva mais ainda. Você já conhece produtores, armazéns e contadores em Itaberaí e região.

**O que fazer:** escolha 10 contatos reais que emitem nota no CNPJ. Mande mensagem
individual — não lista de transmissão, não grupo, não texto igual para todos:

> Fulano, tudo bem? Fiz uma ferramenta rápida que diz se a operação já está obrigada ao
> IBS/CBS — muita gente entendeu que foi tudo adiado pra 2027, mas isso vale só pra pessoa
> física. Leva 40 segundos: [link]
> Se der rejeição de nota aí, me chama que eu te ajudo a ler a mensagem.

Isso não é spam: é conversa individual com quem você já conhece, sobre um problema que essa
pessoa tem de verdade. É exatamente o que a regra de não-spam permite e o que os números
pedem.

---

## O que eu NÃO fiz de propósito

Para ficar claro, porque você pediu transparência:

- ❌ Não criei nenhuma credencial, conta ou API key.
- ❌ Não acessei conta bancária, Kiwify ou gateway de pagamento.
- ❌ Não publiquei nada no Instagram no seu nome.
- ❌ Não registrei nenhuma venda no painel — **elas estão em 0 porque são 0**.
- ❌ Não comprei domínio nem contratei serviço nenhum.

---

## Como saber se funcionou

Depois de fazer os itens 1, 2 e 3, me chame. Eu puxo os números reais do GA4 e do Instagram
e comparo com a linha de base de hoje:

| Métrica | Hoje | Como vou saber que melhorou |
|---|---:|---|
| Cliques no link da bio | 0 | qualquer número acima de 0 |
| Visitas em `/obrigado-ibs-cbs/` | 0 | primeiro acesso registrado |
| `ferramenta_concluida` no GA4 | 0 | mostra que a ferramenta segura a pessoa |
| `clique_oferta_guia` | 0 | mostra que a oferta tem apelo |
| Vendas | 0 | **só entra aqui com confirmação real** |

O evento `ferramenta_concluida` carrega o perfil de quem respondeu (`pj_obrigado`,
`pf_2027`…). Ele responde a pergunta mais valiosa do negócio: **quanto da sua audiência tem
dor pagável agora.** Se vier baixo, o problema é o público — e aí a gente muda o público, não
o produto.
