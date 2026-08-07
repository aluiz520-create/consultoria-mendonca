---
name: boletim-agro
description: Gera o Boletim Agro diário da Consultoria Mendonça (Controller do Agro) — tempo em Goiás, cotações CEPEA de soja/milho/boi gordo, dólar, radar fiscal (Reforma Tributária/NFP-e/prazos) e um gancho de conteúdo pronto para Story/Reels. Use sempre que o usuário escrever "BOLETIM", "BOLETIM AGRO", pedir o resumo/boletim diário do agro, cotações do dia, previsão do tempo do campo, ou quando disparado por uma sessão agendada diária.
---

# Boletim Agro diário — Consultoria Mendonça

Objetivo: entregar, todo dia de manhã, um boletim curto e acionável que (1) informa o
produtor/contador e (2) alimenta o conteúdo do @controllerdoagro, sempre com uma ponte
para o funil (link na bio → simulador). Público: produtor rural, armazém, cerealista,
cooperativa e escritório contábil do agro em GO e no Brasil.

## Passo 1 — Buscar dados frescos (obrigatório, via WebSearch/WebFetch)

Busque sempre os números do dia — nunca reaproveite valores antigos:

1. **Cotações CEPEA/ESALQ** (mercado físico), saca de 60 kg / arroba:
   - Soja, Milho, Boi gordo. Fonte primária: `cepea.org.br`. Alternativas: Notícias Agrícolas, Canal Rural.
   - Anote o preço e a data do último fechamento, e a tendência (alta/baixa/estável) da semana.
2. **Dólar** USD/BRL — cotação e se está subindo/caindo (impacta exportação e insumo).
3. **Tempo em Goiás** (Itaberaí e Goiânia) — condição, temperatura, chuva (mm), vento, umidade.
   Fonte: Climatempo/AccuWeather. Destaque qualquer alerta (chuva fora de época, vento forte,
   geada, umidade crítica) e o que significa para plantio/colheita/pulverização/transporte/armazenagem.
4. **Radar fiscal/agro** — cheque se há prazo, mudança de regra ou fato novo relevante nas
   últimas semanas: Reforma Tributária (IBS/CBS, cClassTrib, cBenef), NFP-e/NF-e, SEFAZ-GO,
   Plano Safra, financiamento rural. **Fato com prazo sempre entra.**

> Estado conhecido do radar fiscal (atualizar se mudar): PJ regime regular com IBS/CBS
> obrigatórios na NF-e desde 03/08/2026 (NT 2025.002 v1.40, UB12-10); produtor PF adiado
> para 01/01/2027 pelo Decreto 13.075/2026.

## Passo 2 — Montar o boletim (formato fixo)

Título: `🌱 Boletim Agro · Controller do Agro — DD/MM/AAAA (dia da semana)`

Seções, nesta ordem:

1. **🌦️ Tempo — Goiás** — condição + números + 1 frase de impacto prático no campo.
2. **🌾 Cotações CEPEA** — tabela Soja / Milho / Boi gordo (preço + unidade) + tendência.
3. **💵 Dólar** — USD/BRL + 1 frase de impacto.
4. **📅 Radar fiscal** — 2–3 bullets com o que está valendo e a ação da semana.
5. **💡 Gancho do dia** — 1 ideia curta de Story/Reels que conecta um fato do dia
   (tempo, preço ou prazo) a um serviço, terminando com CTA de funil
   ("👉 Link na bio: teste em 2 min se sua fazenda está pronta") — alternar com CTA de
   Direct (palavra-chave REFORMA/CUSTO), conforme `marca/09-FUNIL-INSTAGRAM-SITE.md`.

## Passo 3 — Tom (segue a identidade da marca)

- "Você" (nunca "vocês/galera/pessoal"). Número antes de adjetivo.
- Curto e escaneável. Máx. 3 emoji por bloco, como marcador.
- Não prometer o que depende do cliente. Ver `marca/00-MEMORIA-DO-PROJETO.md` (tom e proibições).

## Passo 4 — Entrega

Conforme o modo em que a skill foi disparada:
- **Sessão agendada / manual:** imprima o boletim no chat e envie PushNotification com o
  resumo de 1 linha (tempo + destaque de preço) se o usuário estiver ausente.
- **Se o usuário pedir para publicar no site:** salve como `boletim/AAAA-MM-DD.html` seguindo
  o estilo de `styles.css`, atualize `boletim/index.html` (lista das últimas edições) e comite.
- **Se o usuário pedir para virar post:** entregue também a versão Story (formato do §5).
```
