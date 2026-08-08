# Pagamento automático — passo a passo da Kiwify

**Para o Guia Anti-Rejeição — R$ 29.** Este é o produto que pode ir para o automático hoje,
porque o conteúdo dele existe.

Você já tem conta na Kiwify com 4 produtos ativos. Isso aqui é só mais um.

---

## Como funciona quando estiver pronto

```
pessoa clica em "Comprar"
        ↓
checkout da Kiwify (Pix ou cartão)
        ↓
pagamento aprovado          ← Pix aprova em segundos
        ↓
Kiwify envia o PDF por e-mail    ← automático, sem você
        ↓
dinheiro cai na sua conta Kiwify
        ↓
você saca para a conta bancária
```

**Você não entra em nenhuma etapa.** Pode estar na lavoura, dormindo ou em reunião.

Hoje, sem isso, o botão abre uma conversa no seu WhatsApp pedindo o Pix — funciona, mas
depende de você responder e mandar o arquivo na mão.

---

## Antes de começar: gerar o PDF

O texto completo está no arquivo `guia-anti-rejeicao.md` (versão 1.1) que foi entregue a você
no chat. Ele não está no repositório de propósito — o repositório é público.

1. Abra o arquivo e copie tudo.
2. Cole no Google Docs ou no Word.
3. Confira que a **folha de conferência do capítulo 8** ficou em uma página só — ela existe
   para ser impressa e ficar do lado do monitor.
4. *Arquivo → Baixar → PDF* (ou *Salvar como → PDF*).
5. Nomeie: `Guia-Anti-Rejeicao-IBS-CBS-Agro-v1.1.pdf`

---

## Na Kiwify

Entre em `kiwify.com.br` → login → **Produtos** → **Criar produto** → tipo **Digital**.

### Campos, prontos para copiar

**Nome do produto**
```
Guia Anti-Rejeição — IBS/CBS na nota do agro
```

**Preço**
```
29,00
```
Pagamento único. Sem assinatura, sem renovação.

**Descrição**
```
A ordem certa de conferir antes de emitir a nota com IBS e CBS.

Em 31/07/2026 as validações foram adiadas pelo Ato Técnico Conjunto CGIBS/RFB nº 1. A régua
que derrubaria a sua nota saiu — mas a obrigação de preencher os campos continua valendo, e o
cronograma segue integralmente válido segundo a própria Receita Federal.

Na prática: a sua nota passa mesmo com o campo errado. E esse dado errado entra na sua
escrituração e no crédito de quem comprou de você. A trading e a cooperativa cobram isso antes
do Fisco.

O que tem dentro:

• A ordem exata de conferência: NCM → CST → cClassTrib → CFOP → homologação → mensagem
• O tradutor de mensagem de rejeição da SEFAZ: o que ela cita e a qual passo voltar
• As 7 causas mais comuns de rejeição no agro
• O que muda por tipo de operação: produtor PJ, armazém geral, cerealista, revenda e
  cooperativa — separados, não misturados
• A camada do cBenef em Goiás
• Folha de conferência imprimível para deixar do lado do monitor
• Calendário de agosto/2026 a janeiro/2027, mês a mês
• Os 5 sinais de que o problema não está na nota

Para quem é: quem emite ou confere nota — auxiliar fiscal, gestor administrativo, produtor
PJ, armazém, cerealista, revenda — e o contador que atende essas operações.

Para quem NÃO é: se você quer um código pronto para colar na sua nota, não compre. Este guia
não faz isso, e ninguém honesto faria sem ver a sua escrituração. O que ele faz é te dar
condição de achar o erro e conversar com o seu contador de igual para igual.

Material educativo. Não constitui consultoria tributária individualizada nem substitui a
análise da sua operação por profissional responsável. Legislação vigente em agosto de 2026.
```

**Formas de pagamento:** marque **Pix** e **cartão de crédito**.
O Pix costuma ter taxa menor e aprova na hora — deixe ele em destaque se a plataforma permitir.

**Entrega:** suba o PDF como arquivo do produto e deixe a **entrega automática por e-mail**
ligada. É isso que tira você do meio.

**E-mail de entrega — texto pronto**
```
Assunto: Seu Guia Anti-Rejeição chegou

Olá!

Seu Guia Anti-Rejeição está anexado aqui embaixo.

Uma sugestão de como usar: não leia do começo ao fim como um livro. Vá direto ao capítulo 8,
imprima a folha de conferência e deixe do lado do monitor. É ela que você vai usar na hora de
emitir.

Se aparecer uma mensagem de rejeição que você não entende, me manda no WhatsApp (64) 99222-6766
que eu te digo o que ela está dizendo. Isso não tem custo.

Consultoria Mendonça — o Controller do Agro
controllerdoagro@gmail.com
```

**Garantia:** compra online no Brasil tem direito de arrependimento de **7 dias** pelo
artigo 49 do Código de Defesa do Consumidor. A Kiwify já trabalha com esse prazo — deixe
como está e não prometa nada menor que isso.

---

## Depois de criar

1. Copie o **link de checkout** (formato `pay.kiwify.com.br/` + 7 caracteres).
2. **Me mande o link** que eu colo no site — ou cole você mesmo:

   Arquivo `produtos/guia-anti-rejeicao/index.html`, **linha 139**:
   ```js
   var CHECKOUT_KIWIFY = "";   // ← cole entre as aspas
   ```

3. Assim que houver link ali, o botão passa sozinho a apontar para o checkout e o evento do
   GA4 muda de `whatsapp_pix` para `kiwify`. Nenhuma outra alteração é necessária.

---

## Sobre as taxas — o que eu não sei

**Não vou inventar percentual.** A Kiwify cobra comissão por venda, e o valor varia por plano
e por forma de pagamento. Está no painel dela, em *Configurações → Taxas* ou equivalente.

Me diga o que aparece lá e eu calculo a sua receita líquida por venda e coloco no painel.

Também confira o **prazo de saque**: costuma haver uma janela entre a venda e a liberação do
dinheiro para retirada. Isso não afeta a automação, mas afeta o seu fluxo de caixa.

---

## O outro produto — o de R$ 19,90 do site de finanças

**Não crie ainda.** O conteúdo do plano de 90 dias não foi escrito, e por isso o botão está
desabilitado no site, escrito *"Plano completo em breve"*.

Vender algo que não existe é o único jeito garantido de queimar a reputação dos dois projetos
de uma vez. Quando o texto existir, o processo é idêntico ao de cima.
