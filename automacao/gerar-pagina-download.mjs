#!/usr/bin/env node
/**
 * Gera /baixar/index.html — página mobile para salvar as artes e copiar a legenda.
 *
 * Varre automacao/conteudo/*.json, cruza com as artes já geradas e monta uma
 * página única. Rode depois de gerar artes novas:
 *   node automacao/gerar-pagina-download.mjs
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, "..");
const CONTEUDO = join(AQUI, "conteudo");
const ARTES = join(AQUI, "artes");
const SAIDA = join(RAIZ, "baixar");

const esc = (t = "") =>
  String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const posts = readdirSync(CONTEUDO)
  .filter((f) => f.endsWith(".json"))
  .map((f) => {
    const nome = f.replace(/\.json$/, "");
    const dados = JSON.parse(readFileSync(join(CONTEUDO, f), "utf8"));
    const pasta = join(ARTES, nome);
    if (!existsSync(pasta)) return null;
    const imagens = readdirSync(pasta).filter((x) => x.endsWith(".png")).sort();
    if (!imagens.length) return null;
    return { nome, dados, imagens };
  })
  .filter(Boolean)
  .sort((a, b) => (a.dados.data || "").localeCompare(b.dados.data || ""));

const rotuloFormato = { carrossel: "Carrossel", reel: "Reel", story: "Story" };

const secoes = posts.map(({ nome, dados, imagens }) => {
  const legenda = `${dados.legenda}\n\n${dados.hashtags}`;
  const ehReel = dados.formato === "reel";
  return `
<section class="post" id="${esc(nome)}">
  <header>
    <div class="tags">
      <span class="tag data">${esc(dados.data || "")}</span>
      <span class="tag">${esc(rotuloFormato[dados.formato] || dados.formato)}</span>
      <span class="tag">${esc(dados.pilar || "")}</span>
      ${dados.horario ? `<span class="tag">${esc(dados.horario)}</span>` : ""}
    </div>
    <h2>${esc(dados.titulo)}</h2>
    ${ehReel ? `<p class="aviso">Estas são a <b>capa</b> e as <b>cartelas</b> do Reel. O vídeo você grava — o roteiro está no repositório.</p>` : ""}
  </header>

  <p class="dica">Toque e segure na imagem &rarr; <b>Baixar imagem</b>. Salve na ordem.</p>

  <div class="grade">
    ${imagens.map((img, i) => `
    <figure>
      <img src="../automacao/artes/${esc(nome)}/${esc(img)}" alt="Slide ${i + 1}" loading="lazy">
      <figcaption>${String(i + 1).padStart(2, "0")}</figcaption>
    </figure>`).join("")}
  </div>

  <div class="legenda-bloco">
    <div class="legenda-topo">
      <span>Legenda + hashtags</span>
      <button class="copiar" data-alvo="leg-${esc(nome)}">Copiar</button>
    </div>
    <pre id="leg-${esc(nome)}">${esc(legenda)}</pre>
  </div>

  ${dados.chamada_direct ? `<p class="direct"><b>Direct:</b> ${esc(dados.chamada_direct)}</p>` : ""}
</section>`;
}).join("\n");

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Baixar artes — Consultoria Mendonça</title>
<meta name="robots" content="noindex, nofollow">
<link rel="icon" type="image/svg+xml" href="../assets/logo.svg">
<style>
  :root{--cerrado:#0E241A;--lavoura:#2F5D3F;--ouro:#C9A24B;--areia:#F5F1E6;--neblina:#8A9A91}
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:"Segoe UI",Roboto,-apple-system,sans-serif;background:var(--cerrado);
       color:var(--areia);line-height:1.5;padding:20px 14px 60px}
  .topo{max-width:720px;margin:0 auto 28px;text-align:center}
  .topo h1{font-size:1.35rem;letter-spacing:-.01em}
  .topo p{color:var(--neblina);font-size:.9rem;margin-top:6px}
  .post{max-width:720px;margin:0 auto 44px;background:rgba(245,241,230,.04);
        border:1px solid rgba(245,241,230,.12);border-radius:16px;padding:20px 16px}
  .tags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
  .tag{font-size:.7rem;letter-spacing:.06em;text-transform:uppercase;font-weight:700;
       padding:4px 9px;border-radius:999px;background:rgba(245,241,230,.1);color:var(--neblina)}
  .tag.data{background:var(--ouro);color:var(--cerrado)}
  .post h2{font-size:1.1rem;line-height:1.3}
  .aviso{font-size:.85rem;color:var(--ouro);margin-top:8px}
  .dica{font-size:.83rem;color:var(--neblina);margin:14px 0 10px}
  .grade{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px}
  figure{position:relative;border-radius:10px;overflow:hidden;background:#000}
  figure img{width:100%;display:block}
  figcaption{position:absolute;top:6px;left:6px;background:rgba(14,36,26,.85);color:var(--ouro);
             font-size:.7rem;font-weight:700;padding:2px 7px;border-radius:6px}
  .legenda-bloco{margin-top:18px;border:1px solid rgba(245,241,230,.14);border-radius:12px;overflow:hidden}
  .legenda-topo{display:flex;justify-content:space-between;align-items:center;
                padding:10px 12px;background:rgba(245,241,230,.06);font-size:.8rem;color:var(--neblina)}
  .copiar{background:var(--ouro);color:var(--cerrado);border:0;border-radius:8px;
          padding:7px 14px;font-weight:700;font-size:.8rem;cursor:pointer}
  .copiar.ok{background:#4F9563;color:#fff}
  pre{padding:14px 12px;white-space:pre-wrap;word-wrap:break-word;font-family:inherit;
      font-size:.85rem;color:rgba(245,241,230,.9);max-height:230px;overflow:auto}
  .direct{margin-top:12px;font-size:.85rem;color:var(--neblina)}
  .direct b{color:var(--ouro)}
  footer{max-width:720px;margin:0 auto;text-align:center;color:var(--neblina);font-size:.78rem}
</style>
</head>
<body>

<div class="topo">
  <h1>Artes para publicar</h1>
  <p>Toque e segure em cada imagem para salvar. Publique sempre na ordem 01 &rarr; 09.</p>
</div>

${secoes}

<footer>Consultoria Mendonça &middot; página interna, não indexada</footer>

<script>
document.querySelectorAll(".copiar").forEach(function (b) {
  b.addEventListener("click", async function () {
    var txt = document.getElementById(b.dataset.alvo).textContent;
    try {
      await navigator.clipboard.writeText(txt);
    } catch (e) {
      var ta = document.createElement("textarea");
      ta.value = txt; document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); document.body.removeChild(ta);
    }
    b.textContent = "Copiado!"; b.classList.add("ok");
    setTimeout(function () { b.textContent = "Copiar"; b.classList.remove("ok"); }, 2000);
  });
});
</script>
</body>
</html>
`;

mkdirSync(SAIDA, { recursive: true });
writeFileSync(join(SAIDA, "index.html"), html, "utf8");
console.log(`\n✓ baixar/index.html gerado com ${posts.length} posts:`);
posts.forEach((p) => console.log(`  · ${p.dados.data}  ${p.imagens.length} imagens  ${p.dados.titulo.slice(0, 50)}`));
console.log("");
