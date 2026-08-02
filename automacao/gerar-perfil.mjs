import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
const CERRADO="#0E241A", OURO="#C9A24B", AREIA="#F5F1E6";
const FONT = new URL("fontes/Archivo-2.ttf", import.meta.url).pathname;

// espiga com traço pesado, sobrevive a 32px
const espiga = (cor, w=9) => `
<g stroke="${cor}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <line x1="60" y1="95" x2="60" y2="28"/>
  <path d="M60,40 C49,35 44,25 47,15"/><path d="M60,40 C71,35 76,25 73,15"/>
  <path d="M60,58 C50,54 45,44 48,34"/><path d="M60,58 C70,54 75,44 72,34"/>
  <path d="M60,76 C52,73 48,64 50,55"/><path d="M60,76 C68,73 72,64 70,55"/>
</g>`;

const opcoes = {
  "A-monograma": `<div class="c" style="background:${CERRADO}">
      <span style="color:${OURO};font-size:470px;letter-spacing:-.05em">CM</span></div>`,
  "B-espiga": `<div class="c" style="background:${CERRADO}">
      <svg viewBox="0 0 120 120" width="720" height="720">${espiga(OURO)}</svg></div>`,
  "C-monograma-invertido": `<div class="c" style="background:${OURO}">
      <span style="color:${CERRADO};font-size:470px;letter-spacing:-.05em">CM</span></div>`,
  "D-espiga-anel": `<div class="c" style="background:${CERRADO}">
      <svg viewBox="0 0 120 120" width="820" height="820">
        <circle cx="60" cy="60" r="52" fill="none" stroke="${OURO}" stroke-width="4" opacity=".45"/>
        ${espiga(OURO, 8)}</svg></div>`,
  "E-monograma-espiga": `<div class="c" style="background:${CERRADO};flex-direction:column;gap:0">
      <svg viewBox="20 10 80 90" width="360" height="405">${espiga(OURO, 8)}</svg>
      <span style="color:${AREIA};font-size:190px;letter-spacing:.02em;margin-top:-10px">CM</span></div>`,
};

const b = await chromium.launch({ executablePath:"/opt/pw-browsers/chromium", args:["--no-sandbox"] });
const p = await b.newPage({ viewport:{width:1080,height:1080}, deviceScaleFactor:1 });
for (const [nome, corpo] of Object.entries(opcoes)) {
  const html = `<!doctype html><meta charset=utf-8><style>
    @font-face{font-family:'Archivo';font-weight:900;src:url('file://${FONT}')}
    *{margin:0;padding:0;box-sizing:border-box}
    html,body{width:1080px;height:1080px;overflow:hidden}
    .c{width:1080px;height:1080px;display:flex;align-items:center;justify-content:center;
       font-family:'Archivo';font-weight:900;line-height:1}
  </style>${corpo}`;
  const tmp = new URL(".perfil.tmp.html", import.meta.url).pathname;
  writeFileSync(tmp, html);
  await p.goto("file://"+tmp);
  await p.evaluate(async()=>{ await document.fonts.load("900 400px Archivo"); await document.fonts.ready; });
  await p.screenshot({ path:new URL(`perfil/${nome}.png`, import.meta.url).pathname });
  console.log("✓", nome);
}
await b.close();
