#!/usr/bin/env node
/**
 * Gerador de Reel em vídeo — Consultoria Mendonça
 *
 * Renderiza as cenas em 1080x1920 e monta um MP4 com zoom lento e crossfade.
 * Não usa câmera: é Reel de texto animado, para publicar sem gravar.
 *
 * Uso:
 *   node automacao/gerar-reel.mjs automacao/conteudo/2026-08-04-r1.json
 *
 * O JSON precisa de um array "cenas": [{ kicker, titulo, texto, dur, fundo }]
 * Se não tiver, o script deriva as cenas a partir de "slides".
 */

import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { dirname, join, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const FONTES = join(AQUI, "fontes");
const CHROME = process.env.CHROME_BIN || "/opt/pw-browsers/chromium";
const FFMPEG = process.env.FFMPEG_BIN || "/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2";

const W = 1080, H = 1920, FPS = 30;
const COR = {
  cerrado: "#0E241A", ouro: "#C9A24B", areia: "#F5F1E6",
  terra: "#B4462F", confirma: "#4F9563", neblina: "#8A9A91", grao: "#111411",
};

const fonte = (f) => `file://${join(FONTES, f)}`;
const realce = (t = "") =>
  String(t).replace(/\*([^*]+)\*/g, '<span class="d">$1</span>').replace(/\n/g, "<br>");

function html(cena) {
  const claro = cena.fundo === "claro";
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>
@font-face{font-family:'Archivo';font-weight:700;src:url('${fonte("Archivo-1.ttf")}')}
@font-face{font-family:'Archivo';font-weight:900;src:url('${fonte("Archivo-2.ttf")}')}
@font-face{font-family:'Inter';font-weight:400;src:url('${fonte("Inter-1.ttf")}')}
@font-face{font-family:'Inter';font-weight:600;src:url('${fonte("Inter-2.ttf")}')}
@font-face{font-family:'PlexMono';font-weight:700;src:url('${fonte("PlexMono-2.ttf")}')}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden}
body{
  font-family:'Inter',sans-serif;
  background:${claro ? COR.areia : COR.cerrado};
  color:${claro ? COR.grao : COR.areia};
  display:flex;flex-direction:column;justify-content:center;
  /* área segura do Reel: UI do Instagram cobre topo e base */
  padding:340px 90px 420px;position:relative;-webkit-font-smoothing:antialiased;
}
.d{color:${COR.ouro}}
.kicker{font-size:34px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;
  color:${COR.ouro};margin-bottom:36px}
h1{font-family:'Archivo';font-weight:900;font-size:${cena.grande ? 118 : 96}px;
  line-height:1.05;letter-spacing:-.03em;margin-bottom:34px}
p{font-size:46px;line-height:1.45;opacity:.94}
.num{font-family:'PlexMono';font-weight:700;font-size:230px;line-height:1;
  color:${COR.ouro};margin-bottom:28px}
.tag{display:inline-block;font-size:30px;font-weight:700;letter-spacing:.1em;
  text-transform:uppercase;padding:12px 24px;border-radius:999px;margin-bottom:26px}
.tag.x{background:rgba(180,70,47,.18);color:${COR.terra};border:2px solid ${COR.terra}}
.tag.v{background:rgba(79,149,99,.18);color:${COR.confirma};border:2px solid ${COR.confirma}}
.marca{position:absolute;left:90px;bottom:300px;font-size:32px;font-weight:600;
  color:${COR.neblina}}
.barra{position:absolute;left:0;top:0;width:14px;height:100%;background:${COR.ouro};opacity:.85}
</style></head><body>
<div class="barra"></div>
${cena.tag ? `<div class="tag ${cena.tag.tipo}">${cena.tag.texto}</div>` : ""}
${cena.kicker ? `<div class="kicker">${cena.kicker}</div>` : ""}
${cena.numero ? `<div class="num">${cena.numero}</div>` : ""}
${cena.titulo ? `<h1>${realce(cena.titulo)}</h1>` : ""}
${cena.texto ? `<p>${realce(cena.texto)}</p>` : ""}
<div class="marca">@controllerdoagro</div>
</body></html>`;
}

/* ---------- main ---------- */

const alvo = process.argv[2];
if (!alvo) { console.error("uso: node automacao/gerar-reel.mjs <conteudo.json>"); process.exit(1); }
for (const [n, p] of [["Chromium", CHROME], ["ffmpeg", FFMPEG]])
  if (!existsSync(p)) { console.error(`${n} não encontrado em ${p}`); process.exit(1); }

const caminho = resolve(alvo);
const dados = JSON.parse(readFileSync(caminho, "utf8"));
const nome = basename(caminho).replace(/\.json$/, "");
const destino = join(AQUI, "artes", nome);
const tmp = join(destino, ".frames");
mkdirSync(tmp, { recursive: true });

const cenas = dados.cenas;
if (!cenas?.length) { console.error(`${nome}.json não tem "cenas".`); process.exit(1); }

console.log(`\n▸ Reel: ${dados.titulo}`);

const nav = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
const pag = await nav.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const arqTmp = join(AQUI, ".reel.tmp.html");

for (const [i, c] of cenas.entries()) {
  writeFileSync(arqTmp, html(c), "utf8");
  await pag.goto(`file://${arqTmp}`, { waitUntil: "load" });
  const faltando = await pag.evaluate(async () => {
    const pesos = [["Archivo", 900], ["Archivo", 700], ["Inter", 400], ["PlexMono", 700]];
    await Promise.all(pesos.map(([f, p]) => document.fonts.load(`${p} 40px ${f}`).catch(() => {})));
    await document.fonts.ready;
    return pesos.filter(([f, p]) => !document.fonts.check(`${p} 40px ${f}`)).map(([f, p]) => `${f}:${p}`);
  });
  if (faltando.length) throw new Error(`Fontes não carregadas: ${faltando.join(", ")}`);
  await pag.screenshot({ path: join(tmp, `c${String(i).padStart(2, "0")}.png`) });
  console.log(`  ✓ cena ${i + 1}/${cenas.length}  ${c.dur}s  ${(c.titulo || c.numero || "").slice(0, 44)}`);
}
await pag.close(); await nav.close();
try { rmSync(arqTmp); } catch {}

/* Cada cena vira um trecho de duração fixa; crossfade de 0,4s entre elas.
 *
 * Sem zoompan de propósito: com `-loop 1` o parâmetro `d=` do zoompan é
 * aplicado a CADA quadro de entrada, e a saída sai ~10x mais longa que o
 * previsto (32s viraram 5min18s). O `trim` abaixo fixa a duração de forma
 * determinística, e para Reel de texto o corte seco funciona igual ou melhor.
 */
const FADE = 0.4;
const entradas = [], filtros = [];
cenas.forEach((c, i) => {
  const dur = (c.dur || 4) + FADE;
  entradas.push("-loop", "1", "-t", String(dur), "-i", join(tmp, `c${String(i).padStart(2, "0")}.png`));
  filtros.push(
    // Ordem importa: o `fps` precisa vir DEPOIS do trim/setpts, senão o
    // xfade recebe taxa variável e recusa ("inputs needs to be a constant
    // frame rate; current rate of 1/0 is invalid").
    `[${i}:v]trim=duration=${dur.toFixed(2)},setpts=PTS-STARTPTS,` +
    `fps=${FPS},format=yuv420p,setsar=1[v${i}]`
  );
});

let ultimo = "v0", acc = (cenas[0].dur || 4);
for (let i = 1; i < cenas.length; i++) {
  const saida = i === cenas.length - 1 ? "vout" : `x${i}`;
  filtros.push(`[${ultimo}][v${i}]xfade=transition=fade:duration=${FADE}:offset=${acc.toFixed(2)}[${saida}]`);
  ultimo = saida; acc += (cenas[i].dur || 4);
}

const saidaMp4 = join(destino, "reel.mp4");
console.log("\n  montando o vídeo...");
try {
execFileSync(FFMPEG, [
  "-y", ...entradas,
  "-filter_complex", filtros.join(";"),
  "-map", cenas.length > 1 ? "[vout]" : "[v0]",
  "-c:v", "libx264", "-profile:v", "high", "-pix_fmt", "yuv420p",
  "-r", String(FPS), "-crf", "20", "-movflags", "+faststart",
  saidaMp4,
], { stdio: "pipe", timeout: 300000 });
} catch (e) {
  console.error("\nffmpeg falhou:\n" + (e.stderr ? e.stderr.toString().split("\n").slice(-25).join("\n") : e.message));
  process.exit(1);
}

rmSync(tmp, { recursive: true, force: true });
const seg = cenas.reduce((a, c) => a + (c.dur || 4), 0);
console.log(`\n✓ ${saidaMp4}`);
console.log(`  ${seg}s · ${W}x${H} · ${FPS}fps · sem áudio (adicione trilha no Instagram)\n`);
