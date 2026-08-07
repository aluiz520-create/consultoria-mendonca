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

1. **Cotações — preço da praça em DESTAQUE + nacional como referência.**
   - **Praça principal: Sudoeste Goiano (Rio Verde / Jataí).** É o preço que o produtor de GO
     realmente recebe. Fontes: Grão Direto (`graodireto.com.br/ofertas/`), Notícias Agrícolas
     (praças), Agrolink regional, milhosoja.com.br, rioverderural.com.br.
     - Soja (sc 60 kg) e Milho (sc 60 kg) na praça Rio Verde-GO.
     - Boi gordo (arroba) — indicador de **Goiás** (Scot Consultoria / Notícias Agrícolas por estado).
   - **Referência nacional (só p/ comparar): CEPEA/ESALQ** — Soja (Paranaguá), Milho (Campinas),
     Boi gordo (SP/B3). Fonte: `cepea.org.br`.
   - Para cada produto, anote **preço regional**, **preço nacional** e a **tendência** da semana.
     A diferença regional−nacional é o frete até o porto — vale destacar quando for grande.
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
2. **🌾 Cotações — Sudoeste Goiano** — tabela Soja / Milho / Boi gordo com o **preço da praça
   goiana em destaque** e a coluna **"Ref. nacional"** (CEPEA) mais discreta ao lado. Fechar com
   1 frase explicando que a diferença é o frete até o porto (o regional é o que entra no caixa).
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

**Padrão (sessão agendada diária): PUBLICAR NO SITE + notificar.** Faça as duas coisas:

1. **Publicar no site** (a seção `boletim/` já existe; use a edição de 07/08 como modelo):
   - Crie `boletim/AAAA-MM-DD.html` copiando a estrutura de `boletim/2026-08-07.html`
     (mesmo header/nav, blocos Tempo/Cotações/Dólar/Radar/Gancho, CTA para o simulador e
     WhatsApp no fim, tag do GA4 via `../assets/ga.js`). Troque só o conteúdo e a data.
   - Em `boletim/index.html`, insira o novo item **logo após** o marcador
     `<!-- BOLETIM:INICIO ... -->` (a edição mais nova fica no topo), no mesmo formato
     `<a class="blog-list-item" ...>` das existentes.
   - Adicione a URL da nova edição em `sitemap.xml` e atualize o `lastmod` da seção `boletim/`.
   - Comite e faça push para o `main` (`git add boletim sitemap.xml && git commit && git push origin main`).
     O GitHub Pages republica sozinho. Não abra PR — é conteúdo diário.
2. **Notificar:** imprima o boletim no chat e envie um PushNotification com o resumo de 1 linha
   (tempo + destaque de preço). Inclua o link da edição publicada.

Sob demanda (usuário digitou "BOLETIM"): só imprima no chat; publique/comite apenas se pedido.
Se o usuário pedir versão Story, entregue também o formato do §5.
```
