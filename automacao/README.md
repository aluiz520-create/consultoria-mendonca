# 🤖 automacao/ — o que é automatizável e o que não é

Leia isto antes de esperar qualquer coisa deste diretório.

---

## A resposta curta e honesta

**Não vou logar no seu Instagram com usuário e senha e clicar nos botões por você.**
Não porque falte capacidade técnica — o Playwright está instalado e funcionando aqui —
mas por três motivos que valem mais que a conveniência:

1. **Os Termos de Uso da Meta proíbem** acesso automatizado à interface do Instagram.
   Você mesmo escreveu na sua missão: *"Nunca faça ações que violem as políticas do
   Instagram."* Automação de navegador é exatamente isso. Sua própria regra veta o
   método que você pediu.

2. **O risco recai sobre um perfil recém-criado.** O Instagram detecta automação de
   navegador com facilidade (fingerprint, timing, ausência de eventos de toque). A
   punição para conta nova, sem histórico e sem posts é ação bloqueada ou banimento —
   e um `@controllerdoagro` banido não é recuperável. Você perderia o handle que
   sustenta todo o posicionamento.

3. **Este ambiente é efêmero.** O container é reciclado por inatividade. Uma sessão de
   navegador logada aqui não sobrevive até amanhã, então nem funcionaria como operação
   diária. Publicação recorrente precisa rodar em infraestrutura persistente.

**O que eu faço no lugar:** o caminho oficial da Meta — a **API de Publicação de
Conteúdo**. É sancionada, estável, não corre risco de ban, e faz quase tudo que você
pediu.

---

## Mapa de capacidades

| O que você pediu | Status | Como |
|---|---|---|
| Analisar o site e extrair identidade/serviços/público/posicionamento | ✅ **Feito** | `marca/00` a `marca/06` |
| Gerar a arte | ✅ **Automatizado** | `gerar-artes.mjs` — Chromium local, fontes e paleta da marca |
| Gerar a legenda | ✅ **Automatizado** | comando `GERAR CONTEÚDO` |
| Revisar ortografia e regras da marca | ✅ **Automatizado** | validador dentro de `publicar.mjs` |
| Inserir hashtags | ✅ **Automatizado** | no JSON de conteúdo, validado (5–30) |
| **Publicar feed e carrossel** | ✅ **Automatizável** | `publicar.mjs` via Graph API — precisa do token |
| **Publicar Reels** | ✅ **Automatizável** | idem, com o `.mp4` hospedado |
| **Publicar Stories** | ⚠️ **Parcial** | a API publica Stories de imagem/vídeo, mas **não** enquete, caixinha de perguntas nem sticker de link. Esses são manuais |
| **Agendar publicações** | ✅ **Automatizável** | `cron` chamando `publicar.mjs`, ou o agendador nativo do Meta Business Suite |
| **Ler métricas** | ✅ **Automatizável** | `metricas.mjs` via Insights API |
| Histórico de tudo | ✅ **Automatizado** | `historico.json`, escrito a cada publicação |
| Propor melhorias com base no desempenho | ✅ **Automatizado** | diagnóstico automático em `metricas.mjs` |
| Configurar nome, @, bio, foto, destaques, capas | ❌ **Manual** | **a API da Meta não expõe edição de perfil.** Nenhuma ferramenta legítima faz isso. São ~15 minutos no app, uma vez |
| Responder Direct | ⚠️ **Parcial** | há a Messaging API, mas exige App Review da Meta. Fora de escopo por ora |
| Curtir/seguir/comentar em outros perfis | ❌ **Nunca** | é o comportamento que mais gera bloqueio, e é justamente o que os ToS proíbem |

---

## Fluxo de trabalho

```
1. Escrever/gerar o conteúdo     →  automacao/conteudo/AAAA-MM-DD-diaNN.json
2. Gerar as artes                →  node automacao/gerar-artes.mjs <json>
3. Conferir os PNGs              →  automacao/artes/<nome>/
4. Simular a publicação          →  node automacao/publicar.mjs <json> --dry-run
5. Publicar de verdade           →  node automacao/publicar.mjs <json>
6. Medir depois de 48-72h        →  node automacao/metricas.mjs
```

O passo 3 é seu e é inegociável. Nada sobe sem olho humano — é a regra "nunca publique
conteúdo de baixa qualidade" transformada em processo.

## Instalação

```bash
npm install                       # instala o playwright (browsers já estão no ambiente)
```

Credenciais: veja **[SETUP-API.md](SETUP-API.md)**.

## Estrutura

| Arquivo | Função |
|---|---|
| `gerar-artes.mjs` | JSON → PNGs 1080×1350 (carrossel) ou 1080×1920 (story), na identidade da marca |
| `publicar.mjs` | Valida e publica via Graph API. Sempre teste com `--dry-run` antes |
| `metricas.mjs` | Coleta Insights e imprime o placar com diagnóstico automático |
| `conteudo/*.json` | Um arquivo por publicação: slides, legenda, hashtags, CTA, stories |
| `artes/` | PNGs gerados. Versionados no Git para servirem de URL pública à API |
| `fontes/` | Archivo, Inter e IBM Plex Mono (OFL) |
| `historico.json` | Log de tudo que foi publicado: data, hora, tipo, objetivo, CTA |

## Tipos de slide disponíveis

`capa` · `texto` · `numero` · `lista` · `comparativo` (errado/certo) · `tabela` · `assinatura`

Em qualquer texto, `*palavra*` vira destaque em Ouro Safra.
`"fundo": "claro"` inverte o slide para fundo Areia.

## Limites da Graph API

- **50 publicações por 24h** por conta
- Imagens precisam estar em **URL pública** (por isso `artes/` vai para o Git — o GitHub
  Pages serve os PNGs para a Meta buscar)
- JPEG/PNG, proporção entre 4:5 e 1.91:1
- Carrossel: 2 a 10 itens
- Token de longa duração **expira em 60 dias** — precisa ser renovado

---

## Autocrítica desta automação

- **`artes/` versionado no Git é uma solução de compromisso.** Funciona e é grátis, mas
  incha o repositório com o tempo (~700 KB por carrossel). A partir de ~50 publicações,
  migre para um bucket (Cloudflare R2 tem camada gratuita) e aponte o `BASE_URL` para lá.
- **O validador de qualidade é raso.** Ele checa tamanho de legenda, contagem de hashtags,
  presença de CTA e palavras proibidas. **Não** checa ortografia de verdade nem coerência
  factual. Revisão humana continua obrigatória.
- **Não há geração de vídeo.** Reels precisam ser gravados e editados por você; o script
  só publica um `.mp4` já pronto. Gerar vídeo com locução sintética seria possível, mas
  vídeo com o seu rosto converte muito mais em consultoria B2B — a limitação aqui é
  deliberada.
- **Não existe agendador rodando.** `publicar.mjs` publica na hora em que é chamado.
  Agendamento real exige uma máquina que fique de pé (VPS, GitHub Actions com `schedule`,
  ou o agendador do Meta Business Suite). **Recomendação: comece pelo Meta Business Suite** —
  é grátis, oficial, e você não mantém infraestrutura para postar 7 vezes por semana.
- **A API não publica sticker de enquete nem caixinha de perguntas**, que são justamente
  os Stories que mais geram Direct. Ou seja: a parte do Stories que mais converte
  continua manual. Não há como contornar isso legitimamente.
