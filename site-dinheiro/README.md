# Para onde foi meu dinheiro?

Site autônomo. **Não compartilha nada com a Consultoria Mendonça** — nem CSS, nem fonte, nem
cabeçalho, nem rodapé, nem analytics, nem menção ao nome. É um projeto separado que por
enquanto mora nesta pasta.

```
site-dinheiro/
├── index.html     a ferramenta (única página)
├── estilo.css     CSS próprio, com a fonte de título embutida em base64
├── app.js         toda a lógica do diagnóstico
├── robots.txt     pronto para quando estiver em domínio próprio
└── sitemap.xml    idem
```

**Nenhum arquivo aponta para fora da pasta.** Isso é de propósito: mover o site é copiar a
pasta, não reescrever.

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

Tudo fica no topo do `app.js`, em três linhas:

```js
var ID_ANALYTICS = "";   // ex.: "G-XXXXXXXXXX"
var CHECKOUT     = "";   // link de checkout do plano de R$ 19,90
var WHATSAPP     = "";   // ex.: "5564999999999"
```

### 1. `ID_ANALYTICS` — medição

Vazio significa **nenhuma medição** e nenhum script de terceiro carregado.

Crie uma propriedade **nova** no Google Analytics para este site (não reaproveite a da
consultoria — misturar os dados atrapalha a leitura dos dois). Cole o `G-...` aqui.

Eventos que passam a ser registrados:

| Evento | Quando | Para que serve |
|---|---|---|
| `diagnostico_pronto` | resultado aparece | taxa de conclusão, e **quantos fecham no vermelho** |
| `copiou_diagnostico` | copia o resultado | utilidade real |
| `compartilhou` | manda pra alguém | é o motor de crescimento deste projeto |
| `clique_plano` | clica no plano pago | intenção de compra |

O `diagnostico_pronto` carrega `situacao`, `dia_que_acaba`, `pessoas` e `comprometimento`. É
o dado que responde a pergunta que decide o futuro do projeto: **existe alguém aqui com
capacidade de pagar?**

### 2. `CHECKOUT` e `WHATSAPP` — o plano pago

⚠️ **Não preencha `CHECKOUT` antes de o conteúdo do plano existir de verdade.**

Enquanto as duas linhas estiverem vazias, o botão do plano fica desabilitado e escrito
*"Plano completo em breve"*. Ninguém consegue pagar por algo que não existe — e é assim que
deve ficar até o material estar escrito.

O plano de 90 dias prometido na página (ordem de corte, ordem de quitação, simulador de
cenários, roteiro de renegociação, planilha) **ainda não foi escrito**. Me peça quando quiser
que eu escreva.

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
