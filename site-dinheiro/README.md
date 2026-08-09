# Para onde foi meu dinheiro?

Site autônomo. **Não compartilha nada com a Consultoria Mendonça** — nem CSS, nem fonte, nem
cabeçalho, nem rodapé, nem analytics, nem menção ao nome. É um projeto separado que por
enquanto mora nesta pasta.

```
site-dinheiro/
├── index.html                    a ferramenta principal (diagnóstico da casa)
├── qual-divida-pagar-primeiro/   calculadora avalanche x bola de neve
├── juros-do-cartao-de-credito/   o que o rotativo vira em 3, 6 e 12 meses
├── quanto-posso-gastar-ganhando/ tetos por faixa de renda + piso do DIEESE
├── qual-conta-pagar-primeiro/    ordena as contas do mês pelo custo do atraso
├── meu-salario-esta-comprometido/ comprometimento de renda: o do banco e o da vida
├── como-sair-das-dividas/        pilar: as 5 decisões, na ordem
├── quanto-precisa-ganhar/        artigo de SEO (piso do DIEESE)
├── estilo.css                    CSS próprio, com a fonte de título embutida em base64
├── app.js                        lógica do diagnóstico da página inicial
├── medir.js                      medição, compartilhada por todas as páginas
├── capa.png                      imagem de compartilhamento (Open Graph, 1200×630)
├── robots.txt                    vale quando o site estiver em domínio próprio
└── sitemap.xml                   idem
```

**Nenhum arquivo aponta para fora da pasta.** Isso é de propósito: mover o site é copiar a
pasta, não reescrever. As únicas URLs absolutas estão nas tags `canonical`/`og:url` de cada
página, no `sitemap.xml` e no `robots.txt` — é a lista de troca ao migrar de domínio.

### Como as páginas se ligam

Toda página aponta para a ferramenta principal e para pelo menos duas irmãs, pelo bloco
`.trilhos`. Nenhuma página é órfã — há um teste disso no relatório de tráfego.

```
                    ┌─ qual-divida-pagar-primeiro/ ──┐
                    ├─ juros-do-cartao-de-credito/ ──┤
index.html ─────────┼─ qual-conta-pagar-primeiro/ ───┼──→ plano de R$ 19,90
(diagnóstico)       ├─ meu-salario-esta-comprometido/│
                    ├─ quanto-posso-gastar-ganhando/ │
                    ├─ como-sair-das-dividas/ ───────┘
                    └─ quanto-precisa-ganhar/
```

---

## Como publicar como site separado

### Opção A — repositório próprio no GitHub Pages (grátis)

1. Crie um repositório novo, por exemplo `paraondefoimeudinheiro`.
2. Copie o **conteúdo** desta pasta para a raiz do repositório novo (o `index.html` precisa
   ficar na raiz, não dentro de uma subpasta).
3. Em *Settings → Pages*, escolha a branch `main` e a pasta `/ (root)`.
4. O endereço fica `https://SEU-USUARIO.github.io/paraondefoimeudinheiro/`.

### Opção B — domínio próprio (recomendado quando houver tráfego)

Registre algo curto e fácil de falar em vídeo. Sugestões na ordem que eu tentaria:
`paraondefoimeudinheiro.com.br` · `meusalarioacaba.com.br` · `quantocustaminhavida.com.br`

Um `.com.br` custa por volta de R$ 40/ano no Registro.br. Depois aponte para o Pages ou para
a Vercel — as duas hospedam site estático de graça.

**Quando fizer isso**, troque a URL nos dois arquivos que a citam:
- `robots.txt` → linha do `Sitemap:`
- `sitemap.xml` → o `<loc>`

O `index.html` e o `app.js` **não** têm URL fixa — usam `location.href`, então funcionam em
qualquer endereço sem edição.

---

## O que você precisa configurar

### 1. Medição — `medir.js`

A medição está **ligada** desde 08/08/2026, em uma linha só no topo de `medir.js`:

```js
var ID_ANALYTICS = "G-GQLS60YM9Y";
```

⚠️ **Isto contraria a decisão original de não reaproveitar a propriedade da consultoria**, e a
troca foi consciente: a alternativa era continuar sem nenhum dado. Sem medição não dá para
saber se alguém chega, se alguém usa e se alguém compra — e sem isso não há o que otimizar.

A separação dos dados está garantida de duas formas: todas as páginas vivem sob
`/site-dinheiro/`, então filtrar por caminho de página isola o projeto em qualquer relatório;
e o `config` manda `content_group: "site-dinheiro"`, que aparece como dimensão no GA4.

**Quando existir uma propriedade dedicada**, troque só essa linha. Nada mais muda.

Eventos registrados:

| Evento | Página | Para que serve |
|---|---|---|
| `comecou_diagnostico` | inicial | primeiro campo preenchido — degrau entre visita e uso |
| `diagnostico_pronto` | inicial | taxa de conclusão, e **quantos fecham no vermelho** |
| `copiou_diagnostico` | inicial | utilidade real |
| `compartilhou` | inicial | é o motor de crescimento deste projeto |
| `plano_dividas_pronto` | qual dívida pagar primeiro | uso da segunda ferramenta |
| `copiou_plano_dividas` | qual dívida pagar primeiro | utilidade real |
| `rotativo_calculado` | juros do cartão | uso da terceira ferramenta |
| `tetos_calculados` | quanto posso gastar | uso da quarta ferramenta |
| `escolheu_faixa` | quanto posso gastar | qual faixa de renda o público tem |
| `ordem_contas_pronta` | qual conta pagar primeiro | uso da quinta ferramenta |
| `comprometimento_calculado` | meu salário está comprometido | uso da sexta ferramenta |
| `clique_plano` | todas | intenção de compra, com `origem` para saber qual página vende |
| `rolagem` | todas | 25/50/75/100% — separa quem leu de quem bateu e saiu |

O `diagnostico_pronto` carrega `situacao`, `dia_que_acaba`, `pessoas` e `comprometimento`. É
o dado que responde a pergunta que decide o futuro do projeto: **existe alguém aqui com
capacidade de pagar?**

Nenhum evento carrega valor digitado: só faixas, contagens e classificações.

### 2. `CHECKOUT` — o plano pago

O link do checkout está repetido no topo de `app.js`, de `qual-divida-pagar-primeiro/dividas.js`,
de `meu-salario-esta-comprometido/comprometimento.js` e no script embutido de
`como-sair-das-dividas/`. Se ele mudar, troque nos quatro — esvaziar
qualquer um deles devolve o botão ao estado *"Plano completo em breve"*, desabilitado.

⚠️ **Não preencha `CHECKOUT` antes de o conteúdo do plano existir de verdade.**
Ninguém deve conseguir pagar por algo que não existe.

O plano de 90 dias prometido na página **já foi escrito** (08/08/2026). São dois arquivos,
entregues ao proprietário fora do Git porque este repositório é público:

- `plano-90-dias.md` — 6 capítulos: ordem de corte, ordem de quitação, as 12 semanas, roteiro
  de renegociação, e o capítulo sobre quando cortar não resolve
- `Plano-90-dias-planilha.xlsx` — 3 abas: dívidas ordenadas por avalanche e bola de neve,
  simulador de cenários de corte, e acompanhamento das 12 semanas

Falta só criar o produto na plataforma e colar o link em `CHECKOUT`. Passo a passo com os
campos prontos em `NEGOCIO/produto/KIWIFY-PASSO-A-PASSO.md`.

---

## Decisões de construção, e por quê

| Decisão | Motivo |
|---|---|
| **Sem cadastro, sem e-mail** | Maior ponto de atrito de qualquer ferramenta. E não há nada para entregar por e-mail |
| **Cálculo 100% no navegador** | Nenhum dado sai do aparelho. Vira argumento de confiança e elimina obrigação de LGPD |
| **Pergunta quem mora na casa** | R$ 1.200 de mercado significa coisas opostas para 1 e para 5 pessoas. Nenhum concorrente pergunta isso |
| **Barra fixa com o número ao vivo** | A pessoa vê o resultado se formando enquanto digita. É o que faz terminar de preencher |
| **Resultado só aparece com 3 valores** | Antes disso o diagnóstico seria vazio e queimaria a confiança |
| **Fonte de título embutida (11 KB)** | Subconjunto latino em woff2. Sem CDN, sem requisição externa, sem risco de cair para a fonte padrão |
| **Resto em fonte do sistema** | Em celular, velocidade é parte do produto |
| **Tema claro e escuro** | Segue o aparelho da pessoa |
| **Sem afiliado de crédito** | É a monetização óbvia do nicho e é lucrar com o problema que a ferramenta diz resolver. Fora de questão |

### O piso oficial do DIEESE

O diagnóstico compara os números da pessoa com o **salário mínimo necessário** calculado pelo
DIEESE, aplicando a fórmula do próprio instituto:

```
piso = cesta básica mais cara entre as capitais × 3 × adultos-equivalentes
       (cada adulto = 1 · cada criança = 0,4)
```

A família de referência do DIEESE é 2 adultos + 2 crianças = 2,8 equivalentes. Em **junho de
2026** o instituto publicou **R$ 8.110,92**, e a fórmula reproduz esse valor a partir da cesta
de São Paulo (R$ 965,47 × 3 × 2,8). Como a fórmula depende só da composição, o site calcula o
piso para **qualquer** configuração de casa — o que o DIEESE não publica.

**Para atualizar quando sair a pesquisa do mês**, mexa só no bloco `DIEESE` no topo do
`app.js` e nos números citados no artigo `quanto-precisa-ganhar/`:

```js
var DIEESE = {
  mes: "junho de 2026",
  necessario_familia_referencia: 8110.92,
  equivalentes_referencia: 2.8,
  cesta_media_capitais: 779.95
};
```

O valor por equivalente é derivado do número **publicado**, não recalculado da cesta — assim a
família de referência devolve exatamente o número oficial, sem diferença de arredondamento.

### A conta do "dia em que o salário acaba"

```
custo por dia   = custo total ÷ 30
dia que acaba   = piso(renda da casa ÷ custo por dia)
```

Se o resultado é 23, a renda cobre 23 dias — e do 24 em diante a pessoa gasta o que não tem.
É a métrica principal porque é imediata, pessoal e fácil de contar para alguém.

### Comparação entre famílias de tamanhos diferentes

Usa a **escala de equivalência modificada da OCDE**: 1 para o primeiro adulto, 0,5 para cada
adulto a mais, 0,3 para cada criança. Está citado na própria página, no aviso legal — o
usuário pode conferir o método.

### Referências percentuais

São médias de planejamento, tratadas na interface como **bússola, não regra**, e a página diz
isso com essas palavras. Não são norma nem recomendação individualizada.

---

## O que este site não faz

- Não coleta dado nenhum.
- Não recomenda investimento, empréstimo, cartão ou renegociação específica.
- Não promete resultado financeiro.
- Não menciona a Consultoria Mendonça em lugar algum.
