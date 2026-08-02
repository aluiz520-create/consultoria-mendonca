#!/usr/bin/env node
/**
 * Publicador — Instagram Graph API oficial (Meta).
 *
 * NÃO automatiza o navegador nem faz login com usuário e senha. Usa a API de
 * Publicação de Conteúdo da Meta, que é o caminho sancionado para contas
 * Profissionais. Ver automacao/SETUP-API.md para gerar as credenciais.
 *
 * Uso:
 *   node automacao/publicar.mjs automacao/conteudo/2026-08-03-dia01.json --dry-run
 *   node automacao/publicar.mjs automacao/conteudo/2026-08-03-dia01.json
 *
 * Variáveis de ambiente obrigatórias:
 *   IG_USER_ID       id da conta Instagram Profissional (numérico)
 *   IG_ACCESS_TOKEN  token de acesso de longa duração
 *   BASE_URL         URL pública onde as artes estão hospedadas
 *                    ex.: https://aluiz520-create.github.io/consultoria-mendonca
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const API = "https://graph.facebook.com/v21.0";
const HISTORICO = join(AQUI, "historico.json");

const { IG_USER_ID, IG_ACCESS_TOKEN, BASE_URL } = process.env;
const SECO = process.argv.includes("--dry-run");

const alvo = process.argv.slice(2).find((a) => !a.startsWith("--"));
if (!alvo) {
  console.error("uso: node automacao/publicar.mjs <conteudo.json> [--dry-run]");
  process.exit(1);
}

if (!SECO && (!IG_USER_ID || !IG_ACCESS_TOKEN || !BASE_URL)) {
  console.error(`
Faltam credenciais. Defina antes de publicar:

  export IG_USER_ID=...
  export IG_ACCESS_TOKEN=...
  export BASE_URL=https://aluiz520-create.github.io/consultoria-mendonca

Como obter: automacao/SETUP-API.md
Para simular sem publicar, rode com --dry-run.
`);
  process.exit(1);
}

/* ---------- Helpers de API ---------- */

async function chamar(caminho, corpo) {
  const url = `${API}/${caminho}`;
  const params = new URLSearchParams({ ...corpo, access_token: IG_ACCESS_TOKEN });
  const r = await fetch(url, { method: "POST", body: params });
  const j = await r.json();
  if (!r.ok || j.error) {
    throw new Error(`Graph API ${r.status}: ${JSON.stringify(j.error || j)}`);
  }
  return j;
}

/** Contêiner de mídia precisa terminar em FINISHED antes de publicar. */
async function aguardarPronto(idContainer, tentativas = 30) {
  for (let i = 0; i < tentativas; i++) {
    const r = await fetch(
      `${API}/${idContainer}?fields=status_code,status&access_token=${IG_ACCESS_TOKEN}`);
    const j = await r.json();
    if (j.status_code === "FINISHED") return true;
    if (j.status_code === "ERROR") throw new Error(`Contêiner falhou: ${j.status}`);
    process.stdout.write(".");
    await new Promise((s) => setTimeout(s, 5000));
  }
  throw new Error("Contêiner não ficou pronto a tempo.");
}

/* ---------- Validações de qualidade (antes de qualquer chamada) ---------- */

function validar(dados, arquivos) {
  const erros = [];
  const legenda = `${dados.legenda}\n\n${dados.hashtags}`;

  if (!dados.legenda?.trim()) erros.push("legenda vazia");
  if (legenda.length > 2200) erros.push(`legenda com ${legenda.length} caracteres (máx. 2200)`);

  const tags = (dados.hashtags || "").match(/#\w+/g) || [];
  if (tags.length > 30) erros.push(`${tags.length} hashtags (máx. 30)`);
  if (tags.length < 5) erros.push(`só ${tags.length} hashtags (mínimo recomendado: 5)`);

  if (dados.formato === "carrossel") {
    if (arquivos.length < 2) erros.push("carrossel precisa de 2+ imagens");
    if (arquivos.length > 10) erros.push(`carrossel com ${arquivos.length} imagens (máx. 10)`);
  }

  // Regras do manual da marca
  if (!/direct|salva|manda|comenta|link na bio/i.test(legenda)) {
    erros.push("legenda sem CTA reconhecível (marca/00-MEMORIA §7 regra 5)");
  }
  const proibidas = ["revolucionário", "solução completa", "somos apaixonados", "o segredo que ninguém conta"];
  for (const p of proibidas) {
    if (legenda.toLowerCase().includes(p)) erros.push(`palavra proibida na legenda: "${p}"`);
  }

  return erros;
}

/* ---------- Histórico ---------- */

function registrar(entrada) {
  const hist = existsSync(HISTORICO) ? JSON.parse(readFileSync(HISTORICO, "utf8")) : [];
  hist.push(entrada);
  writeFileSync(HISTORICO, JSON.stringify(hist, null, 2) + "\n", "utf8");
}

/* ---------- Fluxo ---------- */

const caminho = resolve(alvo);
const dados = JSON.parse(readFileSync(caminho, "utf8"));
const nome = basename(caminho).replace(/\.json$/, "");
const pastaArtes = join(AQUI, "artes", nome);

if (!existsSync(pastaArtes)) {
  console.error(`Artes não encontradas em ${pastaArtes}.\nRode antes: node automacao/gerar-artes.mjs ${alvo}`);
  process.exit(1);
}

const arquivos = readdirSync(pastaArtes).filter((f) => f.endsWith(".png")).sort();
const legendaFinal = `${dados.legenda}\n\n${dados.hashtags}`;

console.log(`\n▸ ${dados.titulo}`);
console.log(`  formato .... ${dados.formato}`);
console.log(`  pilar ...... ${dados.pilar}`);
console.log(`  imagens .... ${arquivos.length}`);
console.log(`  legenda .... ${legendaFinal.length} caracteres`);
console.log(`  hashtags ... ${(dados.hashtags.match(/#\w+/g) || []).length}`);

const erros = validar(dados, arquivos);
if (erros.length) {
  console.error("\n✗ Reprovado na revisão de qualidade:");
  erros.forEach((e) => console.error(`  · ${e}`));
  console.error("\nNada foi publicado. Corrija o JSON e rode de novo.\n");
  process.exit(1);
}
console.log("  ✓ revisão de qualidade aprovada");

const urls = arquivos.map((f) => `${BASE_URL || "<BASE_URL>"}/automacao/artes/${nome}/${f}`);

if (SECO) {
  console.log("\n[--dry-run] Nada foi enviado. O que seria publicado:\n");
  urls.forEach((u, i) => console.log(`  ${String(i + 1).padStart(2, "0")}. ${u}`));
  console.log(`\n--- LEGENDA ---\n${legendaFinal}\n---------------\n`);
  console.log(`Direct: ${dados.chamada_direct}\n`);
  process.exit(0);
}

try {
  let idPublicacao;

  if (dados.formato === "carrossel") {
    console.log("\n  criando contêineres dos slides");
    const filhos = [];
    for (const [i, url] of urls.entries()) {
      const r = await chamar(`${IG_USER_ID}/media`, {
        image_url: url,
        is_carousel_item: "true",
      });
      filhos.push(r.id);
      console.log(`    ✓ slide ${i + 1}/${urls.length}`);
    }

    console.log("  criando contêiner do carrossel");
    const pai = await chamar(`${IG_USER_ID}/media`, {
      media_type: "CAROUSEL",
      children: filhos.join(","),
      caption: legendaFinal,
    });
    await aguardarPronto(pai.id);
    idPublicacao = pai.id;

  } else if (dados.formato === "reel") {
    const pai = await chamar(`${IG_USER_ID}/media`, {
      media_type: "REELS",
      video_url: `${BASE_URL}/automacao/artes/${nome}/reel.mp4`,
      caption: legendaFinal,
      share_to_feed: "true",
    });
    await aguardarPronto(pai.id);
    idPublicacao = pai.id;

  } else {
    const pai = await chamar(`${IG_USER_ID}/media`, {
      image_url: urls[0],
      caption: legendaFinal,
    });
    await aguardarPronto(pai.id);
    idPublicacao = pai.id;
  }

  console.log("\n  publicando");
  const pub = await chamar(`${IG_USER_ID}/media_publish`, { creation_id: idPublicacao });

  const permalink = await fetch(
    `${API}/${pub.id}?fields=permalink&access_token=${IG_ACCESS_TOKEN}`)
    .then((r) => r.json()).then((j) => j.permalink).catch(() => null);

  console.log(`\n✓ PUBLICADO — ${permalink || pub.id}\n`);

  registrar({
    id_publicacao: pub.id,
    permalink,
    arquivo: nome,
    data_publicacao: new Date().toISOString(),
    data_planejada: dados.data,
    horario_planejado: dados.horario,
    tipo: dados.formato,
    pilar: dados.pilar,
    objetivo: dados.objetivo,
    cta: dados.cta,
    chamada_direct: dados.chamada_direct,
    palavra_direct: dados.palavra_direct,
    n_imagens: arquivos.length,
    n_hashtags: (dados.hashtags.match(/#\w+/g) || []).length,
  });
  console.log(`  registrado em automacao/historico.json\n`);

} catch (e) {
  console.error(`\n✗ Falhou: ${e.message}\n`);
  process.exit(1);
}
