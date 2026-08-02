# SETUP — credenciais da Instagram Graph API

Uma vez só, ~20 minutos. Depois é só renovar o token a cada 60 dias.

---

## Pré-requisitos

- [ ] Conta `@controllerdoagro` convertida em **Conta Profissional** → tipo **Empresa**
- [ ] Uma **Página do Facebook** criada (pode ser vazia, chame de "Consultoria Mendonça")
- [ ] Instagram **vinculado** a essa Página
      (Instagram → Configurações → Central de Contas → adicionar a Página)

> Sem a Página do Facebook vinculada nada funciona. É exigência da Meta, não escolha nossa.

---

## Passo 1 — Criar o app

1. Vá em **https://developers.facebook.com/apps** → *Criar app*
2. Caso de uso: **"Outro"** → Tipo: **Empresa**
3. Nome: `Consultoria Mendonca Publicador`
4. No painel do app: *Adicionar produtos* → **Instagram** → *Configurar*

## Passo 2 — Permissões

No **Explorador da API Graph** (`Ferramentas → Explorador da API Graph`), selecione o app
e peça estas permissões:

```
instagram_basic
instagram_content_publish
instagram_manage_insights
pages_show_list
pages_read_engagement
business_management
```

Clique em **Gerar token de acesso** e autorize com a conta que administra a Página.

## Passo 3 — Descobrir o IG_USER_ID

Ainda no Explorador, rode:

```
GET /me/accounts
```

Pegue o `id` da sua Página. Depois:

```
GET /{PAGE_ID}?fields=instagram_business_account
```

O `instagram_business_account.id` que voltar é o seu **`IG_USER_ID`**.

## Passo 4 — Token de longa duração

O token do Explorador dura ~1 hora. Troque por um de 60 dias:

```bash
curl -s "https://graph.facebook.com/v21.0/oauth/access_token\
?grant_type=fb_exchange_token\
&client_id=SEU_APP_ID\
&client_secret=SEU_APP_SECRET\
&fb_exchange_token=TOKEN_CURTO"
```

Guarde o `access_token` retornado.

## Passo 5 — Configurar o ambiente

```bash
export IG_USER_ID="1784xxxxxxxxxxx"
export IG_ACCESS_TOKEN="EAAxxxxxxxx..."
export BASE_URL="https://aluiz520-create.github.io/consultoria-mendonca"
```

Para deixar permanente, coloque num `.env` **fora do Git**:

```bash
echo "automacao/.env" >> .gitignore
```

> ⚠️ **Nunca commite o token.** Ele dá controle de publicação da sua conta. Se vazar,
> revogue imediatamente em *Configurações do app → Segurança*.

## Passo 6 — Testar

```bash
# 1. Simular (não publica nada)
node automacao/publicar.mjs automacao/conteudo/2026-08-03-dia01.json --dry-run

# 2. Publicar de verdade
node automacao/publicar.mjs automacao/conteudo/2026-08-03-dia01.json
```

---

## Renovação do token (a cada 60 dias)

Coloque um lembrete no calendário. Token expirado = publicação falha silenciosamente
no dia em que você mais precisa.

```bash
curl -s "https://graph.facebook.com/v21.0/oauth/access_token\
?grant_type=fb_exchange_token&client_id=APP_ID&client_secret=APP_SECRET\
&fb_exchange_token=TOKEN_ATUAL"
```

## Modo de Desenvolvimento

Enquanto o app estiver em **Desenvolvimento**, ele só publica em contas listadas como
*Testadores* — o que já resolve o seu caso, já que é a sua própria conta. **Você não
precisa passar por App Review** para publicar no seu próprio perfil.

App Review só é necessário se um dia você for publicar em contas de clientes.

---

## Se algo falhar

| Erro | Causa provável |
|---|---|
| `(#200) Permissions error` | Falta `instagram_content_publish` ou o token não é da Página certa |
| `The Instagram account is not a business account` | Perfil ainda é Pessoal ou Criador de Conteúdo — mude para Empresa |
| `Media could not be fetched` | O `image_url` não está público. Confirme abrindo a URL numa aba anônima |
| `Invalid OAuth access token` | Token expirou — refaça o passo 4 |
| `Application request limit reached` | Passou de 50 publicações em 24h |
