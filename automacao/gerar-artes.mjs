#!/usr/bin/env node
/**
 * Gerador de artes — Consultoria Mendonça
 *
 * Renderiza slides de carrossel e telas de story em PNG, no padrão do
 * marca/02-MANUAL-DA-MARCA.md, usando o Chromium local. Não acessa o Instagram.
 *
 * Uso:
 *   node automacao/gerar-artes.mjs automacao/conteudo/2026-08-03-dia01.json
 *   node automacao/gerar-artes.mjs automacao/conteudo/*.json
 */

import { chromium } from "playwright";
import { readFileSync, writeFileSync, unlinkSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, "..");
const FONTES = join(AQUI, "fontes");
const CHROME = process.env.CHROME_BIN || "/opt/pw-browsers/chromium";

/* ---------- Paleta oficial (marca/02-MANUAL-DA-MARCA.md §3) ---------- */
const COR = {
  cerrado: "#0E241A",
  lavoura: "#2F5D3F",
  ouro: "#C9A24B",
  areia: "#F5F1E6",
  terra: "#B4462F",
  confirma: "#4F9563",
  neblina: "#8A9A91",
  grao: "#111411",
};

const DIM = {
  carrossel: { w: 1080, h: 1350 },
  story: { w: 1080, h: 1920 },
};

const fonte = (arquivo) => `file://${join(FONTES, arquivo)}`;

const CSS_BASE = `
@font-face{font-family:'Archivo';font-weight:700;src:url('${fonte("Archivo-1.ttf")}')}
@font-face{font-family:'Archivo';font-weight:900;src:url('${fonte("Archivo-2.ttf")}')}
@font-face{font-family:'Inter';font-weight:400;src:url('${fonte("Inter-1.ttf")}')}
@font-face{font-family:'Inter';font-weight:600;src:url('${fonte("Inter-2.ttf")}')}
@font-face{font-family:'Inter';font-weight:700;src:url('${fonte("Inter-3.ttf")}')}
@font-face{font-family:'PlexMono';font-weight:500;src:url('${fonte("PlexMono-1.ttf")}')}
@font-face{font-family:'PlexMono';font-weight:700;src:url('${fonte("PlexMono-2.ttf")}')}

*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%;overflow:hidden}
body{
  font-family:'Inter',sans-serif;
  background:${COR.cerrado};color:${COR.areia};
  display:flex;flex-direction:column;
  /* 168px de folga embaixo: reserva do rodapé + área que a UI do Instagram cobre */
  padding:88px 76px 168px;position:relative;
  -webkit-font-smoothing:antialiased;
}
body.claro{background:${COR.areia};color:${COR.grao}}
.destaque{color:${COR.ouro}}
.kicker{
  font-size:26px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;
  color:${COR.ouro};margin-bottom:28px;
}
h1{font-family:'Archivo';font-weight:900;font-size:104px;line-height:1.04;letter-spacing:-.025em}
h2{font-family:'Archivo';font-weight:700;font-size:66px;line-height:1.12;letter-spacing:-.02em;margin-bottom:30px}
p{font-size:41px;line-height:1.5;color:${COR.areia};opacity:.93}
body.claro p{color:${COR.grao};opacity:.86}
.sub{font-size:36px;line-height:1.45;color:${COR.neblina};margin-top:26px}
.corpo{flex:1;display:flex;flex-direction:column;justify-content:center}
.corpo.topo{justify-content:flex-start}

/* numero gigante */
.numerao{
  font-family:'PlexMono';font-weight:700;font-size:250px;line-height:.92;
  color:${COR.ouro};letter-spacing:-.04em;margin-bottom:24px;
}
.numerao.menor{font-size:170px}

/* listas */
ul{list-style:none;margin-top:12px}
li{
  font-size:39px;line-height:1.42;margin-bottom:26px;
  padding-left:44px;position:relative;
}
li::before{
  content:"";position:absolute;left:0;top:.58em;
  width:14px;height:14px;border-radius:50%;background:${COR.ouro};
}
li.erro::before,li.certo::before{
  content:"";width:22px;height:22px;border-radius:6px;top:.46em;
}
li.erro::before{background:${COR.terra}}
li.certo::before{background:${COR.confirma}}

/* comparativo errado x certo */
.comp{display:flex;flex-direction:column;gap:34px;margin-top:10px}
.bloco{
  border-radius:22px;padding:34px 36px;
  border:2px solid rgba(245,241,230,.14);background:rgba(245,241,230,.045);
}
.bloco .rot{
  font-size:27px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:14px;
}
.bloco.x{border-color:rgba(180,70,47,.55)}
.bloco.x .rot{color:${COR.terra}}
.bloco.v{border-color:rgba(79,149,99,.55)}
.bloco.v .rot{color:${COR.confirma}}
.bloco p{font-size:37px;line-height:1.4}

/* tabela */
table{width:100%;border-collapse:collapse;margin-top:14px}
th,td{
  text-align:left;padding:22px 16px;font-size:33px;
  border-bottom:1.5px solid rgba(245,241,230,.16);
}
th{font-size:25px;letter-spacing:.09em;text-transform:uppercase;color:${COR.ouro};font-weight:700}
td.mono{font-family:'PlexMono';font-weight:500;color:${COR.ouro}}

/* rodape — posicionado de forma determinística para nunca ser cortado */
.rodape{
  position:absolute;left:76px;right:76px;bottom:64px;height:56px;
  display:flex;justify-content:space-between;align-items:center;
  font-size:27px;line-height:56px;color:${COR.neblina};
}
.rodape>*{display:block;line-height:56px}
body.claro .rodape{color:#6C7A72}
.arroba{font-weight:600}
.passo{font-family:'PlexMono';font-weight:500}
.seta{font-family:'Archivo';font-weight:900;font-size:44px;color:${COR.ouro}}

/* assinatura */
body.assinatura{align-items:center;justify-content:center;text-align:center}
.marca{font-family:'Archivo';font-weight:900;font-size:62px;letter-spacing:-.02em;line-height:1.1}
.papel{font-size:34px;color:${COR.neblina};margin-top:18px;line-height:1.4}
.bordao{
  font-family:'Archivo';font-weight:700;font-size:44px;color:${COR.ouro};
  margin-top:56px;padding-top:44px;border-top:2px solid rgba(201,162,75,.4);
}
.assina-cta{font-size:38px;margin-top:30px;line-height:1.4}

/* faixa lateral de progresso */
.trilha{position:absolute;left:0;top:0;width:12px;height:100%;background:rgba(245,241,230,.08)}
.trilha i{display:block;width:100%;background:${COR.ouro}}
`;

/* ---------- Montagem de cada tipo de slide ---------- */

function corpoSlide(s) {
  switch (s.tipo) {
    case "capa":
      return `
        ${s.kicker ? `<div class="kicker">${s.kicker}</div>` : ""}
        <div class="corpo">
          <h1>${realce(s.titulo)}</h1>
          ${s.sub ? `<p class="sub">${realce(s.sub)}</p>` : ""}
        </div>`;

    case "numero":
      return `
        ${s.kicker ? `<div class="kicker">${s.kicker}</div>` : ""}
        <div class="corpo">
          <div class="numerao${(s.numero || "").length > 6 ? " menor" : ""}">${s.numero}</div>
          <h2>${realce(s.titulo)}</h2>
          ${s.texto ? `<p>${realce(s.texto)}</p>` : ""}
        </div>`;

    case "lista":
      return `
        ${s.kicker ? `<div class="kicker">${s.kicker}</div>` : ""}
        <div class="corpo topo">
          <h2>${realce(s.titulo)}</h2>
          <ul>${(s.itens || []).map((i) => `<li class="${i.tipo || ""}">${realce(i.texto || i)}</li>`).join("")}</ul>
        </div>`;

    case "comparativo":
      return `
        ${s.kicker ? `<div class="kicker">${s.kicker}</div>` : ""}
        <div class="corpo">
          <h2>${realce(s.titulo)}</h2>
          <div class="comp">
            <div class="bloco x"><div class="rot">✕ ${s.rotuloErrado || "Errado"}</div><p>${realce(s.errado)}</p></div>
            <div class="bloco v"><div class="rot">✓ ${s.rotuloCerto || "Certo"}</div><p>${realce(s.certo)}</p></div>
          </div>
        </div>`;

    case "tabela":
      return `
        ${s.kicker ? `<div class="kicker">${s.kicker}</div>` : ""}
        <div class="corpo topo">
          <h2>${realce(s.titulo)}</h2>
          <table>
            <tr>${(s.colunas || []).map((c) => `<th>${c}</th>`).join("")}</tr>
            ${(s.linhas || []).map((l) => `<tr>${l.map((c, i) => `<td class="${i ? "mono" : ""}">${c}</td>`).join("")}</tr>`).join("")}
          </table>
        </div>`;

    case "assinatura":
      return `
        <div class="marca">CONSULTORIA<br>MENDONÇA</div>
        <div class="papel">Controladoria e Inteligência<br>Fiscal para o Agro</div>
        <div class="bordao">Número no lugar certo.</div>
        ${s.cta ? `<div class="assina-cta">${realce(s.cta)}</div>` : ""}`;

    default: // texto
      return `
        ${s.kicker ? `<div class="kicker">${s.kicker}</div>` : ""}
        <div class="corpo">
          <h2>${realce(s.titulo)}</h2>
          ${s.texto ? `<p>${realce(s.texto)}</p>` : ""}
          ${s.sub ? `<p class="sub">${realce(s.sub)}</p>` : ""}
        </div>`;
  }
}

// *palavra* vira destaque dourado
const realce = (t = "") =>
  String(t).replace(/\*([^*]+)\*/g, '<span class="destaque">$1</span>').replace(/\n/g, "<br>");

function montarHTML(slide, idx, total, formato, arroba) {
  const { w, h } = DIM[formato];
  const ehAssinatura = slide.tipo === "assinatura";
  const progresso = Math.round(((idx + 1) / total) * 100);
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<style>${CSS_BASE}
html,body{width:${w}px;height:${h}px}
${formato === "story" ? "body{padding:150px 76px 120px}h1{font-size:96px}" : ""}
</style></head>
<body class="${slide.fundo === "claro" ? "claro " : ""}${ehAssinatura ? "assinatura" : ""}">
${!ehAssinatura ? `<div class="trilha"><i style="height:${progresso}%"></i></div>` : ""}
${corpoSlide(slide)}
${!ehAssinatura ? `<div class="rodape">
  <span class="arroba">${arroba}</span>
  <span class="passo">${String(idx + 1).padStart(2, "0")}/${String(total).padStart(2, "0")}</span>
  ${idx < total - 1 ? '<span class="seta">→</span>' : "<span></span>"}
</div>` : ""}
</body></html>`;
}

/* ---------- Renderização ----------
 * Usa Playwright em vez de `chromium --screenshot` porque a flag --window-size
 * reserva ~98px de cromo da janela mesmo em headless, o que cortava o rodapé.
 * Com viewport explícito o recorte é exato.
 */

async function processar(navegador, caminhoJson) {
  const dados = JSON.parse(readFileSync(caminhoJson, "utf8"));
  const formato = dados.formato === "story" ? "story" : "carrossel";
  const arroba = dados.arroba || "@controllerdoagro";
  const slides = dados.slides || [];
  const nome = basename(caminhoJson).replace(/\.json$/, "");
  const destino = join(AQUI, "artes", nome);
  mkdirSync(destino, { recursive: true });

  console.log(`\n▸ ${dados.titulo || nome}  (${slides.length} ${formato === "story" ? "telas" : "slides"})`);

  const { w, h } = DIM[formato];
  const pagina = await navegador.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const gerados = [];

  // Grava num arquivo dentro de automacao/ e navega por file:// — com setContent a
  // página fica em about:blank e o Chromium recusa carregar as fontes file://.
  const tmp = join(AQUI, ".slide.tmp.html");

  for (const [i, s] of slides.entries()) {
    const arquivo = join(destino, `${String(i + 1).padStart(2, "0")}.png`);
    writeFileSync(tmp, montarHTML(s, i, slides.length, formato, arroba), "utf8");
    await pagina.goto(`file://${tmp}`, { waitUntil: "load" });
    // Força o carregamento de TODOS os pesos declarados (fonts.ready só espera os
    // que já foram requisitados pelo layout) e falha alto se algum não vier —
    // arte com fonte errada não é arte da marca.
    const faltando = await pagina.evaluate(async () => {
      const pesos = [
        ["Archivo", 700], ["Archivo", 900],
        ["Inter", 400], ["Inter", 600], ["Inter", 700],
        ["PlexMono", 500], ["PlexMono", 700],
      ];
      await Promise.all(pesos.map(([f, p]) =>
        document.fonts.load(`${p} 40px ${f}`).catch(() => {})));
      await document.fonts.ready;
      return pesos
        .filter(([f, p]) => !document.fonts.check(`${p} 40px ${f}`))
        .map(([f, p]) => `${f}:${p}`);
    });
    if (faltando.length) throw new Error(`Fontes não carregadas: ${faltando.join(", ")}`);

    await pagina.screenshot({ path: arquivo });
    console.log(`  ✓ ${String(i + 1).padStart(2, "0")}.png  ${s.tipo.padEnd(12)} ${(s.titulo || s.numero || "").slice(0, 46)}`);
    gerados.push(arquivo);
  }

  await pagina.close();
  try { unlinkSync(tmp); } catch {}
  return { nome, destino, gerados, dados };
}

/* ---------- Main ---------- */

const alvos = process.argv.slice(2);
if (!alvos.length) {
  console.error("uso: node automacao/gerar-artes.mjs <arquivo.json> [...]");
  process.exit(1);
}
if (!existsSync(CHROME)) {
  console.error(`Chromium não encontrado em ${CHROME}. Defina CHROME_BIN.`);
  process.exit(1);
}

const navegador = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
for (const alvo of alvos) await processar(navegador, resolve(alvo));
await navegador.close();
console.log("\nArtes em automacao/artes/ — confira antes de publicar.\n");
