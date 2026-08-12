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

> ⚠️ **Rede:** nas sessões em nuvem o proxy de egresso bloqueia WebFetch para `cepea.org.br`,
> `graodireto.com.br`, `noticiasagricolas.com.br`, `otempo.com.br` e a maioria dos portais de
> cotação (`EGRESS_BLOCKED`). **Use WebSearch como canal principal** — ele funciona e devolve os
> números. WebFetch é complemento; se bloquear, siga com WebSearch e não interrompa a rotina.
>
> ⚠️ **Data:** confirme o dia da semana com `date` (fuso `America/Sao_Paulo`) antes de escrever o
> título. Já saiu edição com o dia da semana errado. Em fim de semana e feriado não há pregão —
> use o último fechamento e diga isso no texto.

Busque sempre os números do dia — nunca reaproveite valores antigos. Compare com a edição
anterior em `boletim/`: se algum valor vier idêntico ao de ontem, confirme com uma segunda busca
antes de publicar. Anote a data de cada número e cite-a no rodapé de fontes.

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

1. **Publicar no site — no formato v2** (o site foi migrado; não copie edição antiga em v1):
   - **Modelo obrigatório: `boletim/2026-08-08.html`** — é a edição de referência já no formato
     v2. Copie a estrutura dela e troque **só o conteúdo e a data**.
   - O que o formato v2 exige, e que a versão antiga não tinha:
     - `<link rel="stylesheet" href="/consultoria-mendonca/estilo-v2.css">` — **sem bloco
       `<style>` na página** (as classes `.art`, `.prose`, `.note`, `.tag`, `.crumb`, `.dark`,
       `.btn`, `.btn2`, `.row` já existem; não crie CSS novo);
     - fontes Archivo + IBM Plex Mono via Google Fonts (copiar as tags do modelo);
     - `header class="site"` com `nav.main` e `footer class="site dark"` **idênticos** ao modelo;
     - `<script defer src="/consultoria-mendonca/app-v2.js">` no lugar de `script.js`
       — **e sem `<span id="year">`**, que era dependência do script antigo;
     - URLs internas na forma de diretório (`/consultoria-mendonca/boletim/`,
       `/consultoria-mendonca/simulador/`);
     - `data-ev` e `data-origem` nos CTAs (`clique_simulador`, `clique_whatsapp`,
       `clique_diagnostico` com `data-origem="boletim"`) — é o que alimenta o GA4;
     - as 5 seções em `<section>` separadas por linha de 1px, cada uma com o rótulo em
       `<p class="tag">`; o Gancho do dia num bloco `class="dark"`; a caixa de alerta em
       `class="note"`.
   - Em `boletim/index.html`, insira o novo item **logo após** o marcador
     `<!-- BOLETIM:INICIO ... -->` (a edição mais nova fica no topo), no formato v2 da lista:

     ```html
     <li><a href="/consultoria-mendonca/boletim/AAAA-MM-DD.html">
       <div class="mono" style="font-size:11px;letter-spacing:.12em;color:var(--mut);margin-bottom:10px">DD/MM/AAAA · DIA</div>
       <h2>Boletim Agro — DD/MM/AAAA</h2>
       <p class="sub" style="font-size:16px">resumo em uma frase</p>
     </a></li>
     ```

   - Adicione a URL da nova edição em `sitemap.xml` e atualize o `lastmod` da seção `boletim/`.
   - Comite e faça push para o `main` (`git add boletim sitemap.xml && git commit && git push origin main`).
     O GitHub Pages republica sozinho. Não abra PR — é conteúdo diário.
2. **Notificar:** imprima o boletim no chat e envie um PushNotification com o resumo de 1 linha
   (tempo + destaque de preço). Inclua o link da edição publicada.

Sob demanda (usuário digitou "BOLETIM"): só imprima no chat; publique/comite apenas se pedido.
Se o usuário pedir versão Story, entregue também o formato do §5.
