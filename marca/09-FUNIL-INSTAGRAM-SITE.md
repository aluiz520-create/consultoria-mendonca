# 09 — FUNIL INSTAGRAM → SITE

Correção do funil de conversão do perfil para o site. Versão 1.0 · 07/08/2026

> Base: dados reais do @controllerdoagro puxados via Windsor.ai em 07/08/2026
> (últimos 30 dias / 5 posts publicados entre 02 e 05/08).

---

## 1. O que os dados mostraram

| Sinal | Número | Leitura |
|---|---:|---|
| Cliques no link da bio (30 dias) | **0** | O conteúdo não manda ninguém pro site. |
| Salvos (todos os 5 posts) | **0** | Sem salvamento, o alcance morre no 1º dia. |
| Compartilhamentos (todos os 5 posts) | **0** | Sem compartilhamento, o algoritmo não escala. |
| Alcance — Reels | 110 | O Reels puxa alcance (6× o carrossel). |
| Engajamento — carrossel "Amanhã sua nota" | 73 | O carrossel puxa engajamento/leitura. |

**Diagnóstico:** o problema não é o conteúdo — é tecnicamente forte. É o **fechamento**.
Os 5 posts usaram **só o CTA de Direct** ("manda REFORMA no direct") e **nunca** o CTA
de link nem cobraram salvamento de forma visual. Isso contraria a própria §8 da
identidade, que prevê CTAs de link, salvamento e compartilhamento.

---

## 2. O modelo de fechamento (dupla camada)

Todo post fecha com **duas camadas**, sempre nesta ordem:

1. **Micro-CTA (algoritmo):** um pedido de **salvar** OU **compartilhar**, com benefício
   concreto — nunca "salva aí". O salvamento e o compartilhamento é o que faz o post
   escalar. É de graça e foi o que faltou nos 5 posts.
2. **Macro-CTA (conversão):** **um** destino por post, alternando entre:
   - **Link na bio → simulador** (`/link/` → `/simulador/`) — lead frio, mede no GA4, tráfego pro site.
   - **Direct com palavra-chave** (REFORMA / DIAGNÓSTICO / CUSTO / KIT) — lead quente, qualifica.

**Regra de rotação (o que faltava):**
- **Reels = link na bio.** Reels traz gente nova que ainda não te segue — mandar pro
  Direct desperdiça o alcance. O Reel de alcance 110 deveria ter levado ao simulador.
- **Carrossel = Direct com palavra-chave.** Quem lê carrossel até o fim é lead quente,
  vale a conversa qualificada no Direct.
- **1 palavra-chave por post.** Nunca duas.
- Respeita o tom: "você" (nunca "vocês/galera"), máx. 3 emoji como marcador, número antes de adjetivo.

---

## 3. Reescrita dos 5 posts publicados

Troque **apenas o bloco final de CTA** de cada post (o corpo pode ficar). Onde o post é
Reels, o fechamento passa a apontar pro link; onde é carrossel, mantém o Direct — mas
sempre com a camada de salvamento/compartilhamento explícita.

### Post 1 — Reel "Metade dos posts… falou com a pessoa errada" (alcance 110)
**Era:** "Compartilha com quem te mandou o post errado. Manda REFORMA no direct."
**Fica:**
```
Manda esse Reel pro contador que te assustou essa semana — pergunta se ele separou PJ de pessoa física.

Não sabe em qual dos dois casos você está?
👇 Link na bio: 2 minutos e o simulador te diz seu nível de risco fiscal.
```

### Post 2 — Carrossel "Amanhã sua nota pode ser rejeitada" (engajamento 73)
**Era:** "Salva esse post e manda pro seu contador. Manda REFORMA no direct."
**Fica:**
```
Salva esse post. Na noite antes de emitir, você vai querer conferir o par CST + cClassTrib com ele na mão.

Quer que eu olhe a sua operação? Manda REFORMA no direct — eu te digo em 15 minutos onde está o risco.
```

### Post 3 — Carrossel "5 erros que derrubam nota"
**Era:** "Salva esse post. E manda pro seu contador. Manda REFORMA no direct."
**Fica:**
```
Salva esse checklist — é a ordem exata de conferência (NCM → CST → cClassTrib → natureza).

Manda REFORMA no direct que eu olho a sua parametrização antes da próxima emissão.
```

### Post 4 — Reel (repost do Post 1)
Não republique legenda idêntica — o Instagram penaliza repetição. Se mantiver o Reel,
troque o fechamento para o de link e mude a primeira linha:
```
Você tem cinco meses. Ou não tem nenhum. Depende de qual caso é o seu.

👇 Link na bio: faz o teste de 2 minutos e descobre se a sua fazenda está pronta pro IBS/CBS.
```

### Post 5 — Carrossel "Você ganhou 5 meses"
**Era:** "Salva esse post. Comenta JANEIRO que eu mando o cronograma completo."
**Fica (mantém o comentário — funciona bem para alcance):**
```
Salva esse cronograma — agosto a janeiro, mês a mês.

Comenta JANEIRO que eu te mando o cronograma completo em PDF pra imprimir.
```

---

## 4. Formato padrão — engenheirado para salvamento

O salvamento (0 hoje) é a alavanca mais barata. Conteúdo que se salva tem uma
característica: **serve de consulta depois.** Toda semana, no mínimo:

**Reels (alcance):** tese forte nos 3s → 1 número → 1 consequência concreta →
CTA de **link na bio**. Duração 20–40s.

**Carrossel "salvável" (engajamento):** capa com promessa de checklist/tabela →
slides que a pessoa vai querer reabrir (tabela NCM×CST, ordem de conferência,
calendário de prazos) → último slide = **salvar + Direct com palavra-chave**.

Gatilhos de salvamento que funcionam no agro:
- Tabela/checklist que substitui uma consulta ("salva pra hora de emitir")
- Calendário com prazos ("salva, o próximo vence em…")
- Passo a passo numerado ("salva a ordem certa")

> A skill `gerar-conteudo` já produz esse formato. Peça o próximo pacote pedindo
> **CTA rotacionado (Reels→link, carrossel→Direct)** e **um gancho de salvamento por peça**.

---

## 5. Ajuste de bio (reforça o link)

A bio atual não deixa claro o que a pessoa ganha ao tocar no link. Alinhar com a
Variação A da §3 da identidade, deixando o CTA de link inequívoco:

```
IBS/CBS na nota sem rejeição + custo real por saca.
🌾 Produtor • Armazém • Cerealista • Cooperativa
🧾 SIAGRI • Power BI • Controladoria
👇 Teste em 2 min se sua fazenda está pronta
```

E ativar o botão nativo de **WhatsApp** no perfil (converte 3–4× mais que link, porque
não sai do app) — sem substituir o link do simulador, que é o que alimenta o GA4.

---

## 6. Como medir se funcionou

Só dá pra fechar o ciclo com o site medido. **Próximo passo estrutural: conectar GA4 +
Google Search Console no Windsor.** Com isso, semana a semana:

| Métrica | Onde | Meta inicial |
|---|---|---|
| Cliques no link da bio | Instagram Insights / Windsor | sair de 0 |
| Sessões vindas do Instagram | GA4 | > 0 e crescendo |
| Conclusões do simulador | GA4 (evento) | medir taxa link→simulador |
| Salvos por post | Windsor (`media_saved`) | sair de 0 |
| Palavra-chave no Direct | contagem manual | intenção real por semana |
```
