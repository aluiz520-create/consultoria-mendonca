# IR AO AR — o que falta

**Auditado em 08/08/2026.** Este arquivo é a lista de fechamento. Cada item diz quem faz,
quanto leva e o que ele destrava.

---

## Estado auditado (não é estimativa, foi verificado)

| Verificação | Resultado |
|---|---|
| Páginas HTML nos dois sites | **22** |
| Links internos testados | **122** — nenhum quebrado |
| Erros de JavaScript | **0** |
| Requisições 404 | **0** |
| Rolagem horizontal no celular | **nenhuma** |
| Schema JSON-LD | **válido em todas** |
| Title e meta description | **completos** nas páginas públicas |
| Páginas internas (`/painel/`, `/textos/`, `/baixar/`, `pagamento.html`) | **noindex**, como deve ser |
| Sitemap do agro | 15 URLs, **todos os arquivos existem** |
| Menção à Consultoria no site do dinheiro | **nenhuma** |
| Trabalho não commitado | **nenhum** |

**Conclusão técnica: não falta código. Falta apertar o botão.**

---

## 🔴 BLOCO 1 — Para ir ao ar (é literalmente 1 ação)

O GitHub Pages publica a partir da **`main`**. Todo o trabalho está na branch
`claude/autonomous-digital-business-5c3qqz`, **7 commits à frente**. Enquanto não houver
merge, nada do que foi construído existe para o mundo.

> ⚠️ A sua `main` **local** está 33 commits atrás da `main` do GitHub. Isso é só uma cópia
> velha no computador, não é conflito — mas por isso **prefira fazer pelo site do GitHub**,
> que usa sempre a versão certa.

**Caminho recomendado (2 minutos):**

1. Abra: `https://github.com/aluiz520-create/consultoria-mendonca/pull/new/claude/autonomous-digital-business-5c3qqz`
2. Confira os 7 commits.
3. *Create pull request* → *Merge*.
4. Espere de 1 a 2 minutos: o Pages reconstrói sozinho.

**Se preferir pelo terminal:**
```bash
git fetch origin
git checkout main
git reset --hard origin/main          # sincroniza a main local, que está velha
git merge claude/autonomous-digital-business-5c3qqz
git push origin main
```

**Depois do merge, confira estes endereços:**

| Página | Endereço |
|---|---|
| Você já está obrigado ao IBS/CBS? | `/consultoria-mendonca/obrigado-ibs-cbs/` |
| Guia Anti-Rejeição (R$ 29) | `/consultoria-mendonca/produtos/guia-anti-rejeicao/` |
| Artigo do adiamento das validações | `/consultoria-mendonca/blog/validacoes-ibs-cbs-adiadas-o-que-muda.html` |
| Artigo CNPJ 2026 ou 2027 | `/consultoria-mendonca/blog/cnpj-produtor-rural-2026-ou-2027.html` |
| Artigo nota rejeitada | `/consultoria-mendonca/blog/nota-rejeitada-ibs-cbs-o-que-fazer.html` |
| Painel do proprietário | `/consultoria-mendonca/painel/` |
| **Para onde foi meu dinheiro** | `/consultoria-mendonca/site-dinheiro/` |

Base: `https://aluiz520-create.github.io`

✅ **Feito o merge, está no ar.** Todo o resto abaixo é para o que está no ar dar resultado.

---

## 🟠 BLOCO 2 — Para o agro receber gente (é aqui que trava hoje)

Estar no ar com alcance de 1 pessoa por dia não muda nada. Estes dois itens custam
**7 minutos somados** e são o que realmente destrava.

### 2.1 Corrigir a bio do Instagram — 2 minutos

Está escrito hoje, com erro de concordância: *"Teste **de** sua Fazenda está pronta"*.
Seu público é produtor e contador. Erro de português na primeira linha derruba a
credibilidade técnica antes do primeiro post.

```
IBS/CBS na nota sem rejeição + custo real por saca.
🌾 Produtor • Armazém • Cerealista • Cooperativa
🧾 SIAGRI • Power BI • Controladoria
👇 Descubra em 40s se você já está obrigado
```

Link da bio (um toque a menos que hoje):
`https://aluiz520-create.github.io/consultoria-mendonca/obrigado-ibs-cbs/`

Ative também o **botão nativo de WhatsApp** no perfil.

### 2.2 Voltar a publicar — 5 minutos por post

**As artes já estão prontas**, com legenda e hashtags escritas. É abrir e postar:

| Dia | Pasta da arte | Peça | CTA |
|---|---|---|---|
| SEG 10 | `automacao/artes/2026-08-10-c1/` | A régua foi desligada. A regra não. | Direct `VALIDAÇÃO` |
| QUI 13 | `automacao/artes/2026-08-13-c2/` | CST × cClassTrib: o par que precisa fechar | Direct `VALIDAÇÃO` |
| SEX 14 | `automacao/artes/2026-08-14-c9/` | Guia Anti-Rejeição R$ 29 | Link na bio |

As legendas estão nos JSON de mesmo nome em `automacao/conteudo/`.

---

## 🟡 BLOCO 3 — Para poder receber dinheiro

Hoje o botão de compra do Guia cai num fluxo manual por WhatsApp + Pix. **Já funciona e já
pode gerar a primeira venda** — mas depende de você responder na hora.

### 3.1 Gerar o PDF do Guia — 10 minutos

O texto completo foi entregue a você no chat (`guia-anti-rejeicao.md`, versão 1.1). Abra,
cole no Google Docs ou Word, exporte em PDF. Mantenha a folha de conferência do capítulo 8
em uma página só — ela é feita para imprimir.

> Ele não está no repositório de propósito: **o repositório é público** e o conteúdo pago
> ficaria de graça. Explicação em `NEGOCIO/produto/README.md`.

### 3.2 Criar o produto na Kiwify — 15 minutos

1. Produto digital: **Guia Anti-Rejeição — IBS/CBS na nota do agro**, **R$ 29**.
2. Suba o PDF, ative Pix e cartão, deixe a entrega automática ligada.
3. Copie o link (`https://pay.kiwify.com.br/XXXXXXX`).
4. Cole em `produtos/guia-anti-rejeicao/index.html`, linha 139:

```js
var CHECKOUT_KIWIFY = "";   // ← cole entre as aspas
```

O botão passa sozinho a apontar para o checkout. **Ou me mande o link que eu colo.**

---

## 🟢 BLOCO 4 — Para o Google encontrar

É a maior lacuna de dados que sobrou. Sem isso eu escrevo SEO no escuro.

1. `search.google.com/search-console` → adicionar
   `https://aluiz520-create.github.io/consultoria-mendonca/`
2. Validar pela tag HTML — **me mande a tag que eu instalo**.
3. Enviar o sitemap: `sitemap.xml`
4. Pedir indexação manual das 3 páginas novas do agro.
5. Conectar o Search Console no Windsor, como já estão GA4 e Instagram.

Depois disso eu escolho os próximos artigos por dado, não por palpite.

---

## 🔵 BLOCO 5 — Para o site do dinheiro virar projeto separado de verdade

Depois do merge ele fica no ar em `/consultoria-mendonca/site-dinheiro/`. Funciona, mas
ainda é um endereço do site do agro.

| Passo | Quando |
|---|---|
| Criar repositório próprio e copiar o **conteúdo** da pasta para a raiz | quando quiser separar de fato |
| Criar propriedade **nova** no Google Analytics e colar em `ID_ANALYTICS` no `app.js` | antes de esperar qualquer dado |
| Trocar `SEU-DOMINIO` no `robots.txt` e no `sitemap.xml` | só quando tiver domínio |
| Registrar domínio (~R$ 40/ano) | **só depois de passar dos critérios de 60 dias** |

Passo a passo completo em `site-dinheiro/README.md`.

---

## ⬜ O que ainda NÃO existe (e por quê)

**O plano de 90 dias de R$ 19,90** prometido no site do dinheiro não foi escrito. Por isso o
botão está desabilitado, escrito *"Plano completo em breve"* — ninguém consegue pagar por
algo que não existe.

Eu mesmo defini o portão: escrever antes de haver tráfego repete o erro que já estamos
pagando no agro — produto pronto, tráfego zero. O portão é **100 diagnósticos concluídos**.

Se você quiser antecipar, é decisão sua e eu escrevo. Só quero que seja escolha, não descuido.

---

## Resumo em uma linha

| Bloco | Ação | Tempo | Destrava |
|---|---|---|---|
| **1** | Merge do PR | **2 min** | **Tudo ir ao ar** |
| 2 | Bio + voltar a postar | 7 min + 5 min/post | Tráfego |
| 3 | PDF + Kiwify | 25 min | Venda automática |
| 4 | Search Console | 10 min | SEO com dado |
| 5 | Repositório e analytics próprios | 20 min | Separação real |

**Só o Bloco 1 é obrigatório para ir ao ar. Ele leva 2 minutos e depende só de você.**
