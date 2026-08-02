#!/usr/bin/env node
/**
 * Coletor de métricas — Instagram Insights API (oficial).
 *
 * Lê as publicações registradas em historico.json, busca as métricas de cada uma
 * e imprime o placar da semana no formato do marca/06-PAINEL-DE-CONTROLE.md.
 *
 * Uso:
 *   node automacao/metricas.mjs            # últimas 7 publicações
 *   node automacao/metricas.mjs --todas
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const API = "https://graph.facebook.com/v21.0";
const HISTORICO = join(AQUI, "historico.json");
const { IG_USER_ID, IG_ACCESS_TOKEN } = process.env;

if (!IG_USER_ID || !IG_ACCESS_TOKEN) {
  console.error("Defina IG_USER_ID e IG_ACCESS_TOKEN. Ver automacao/SETUP-API.md");
  process.exit(1);
}
if (!existsSync(HISTORICO)) {
  console.error("Nada publicado ainda — historico.json não existe.");
  process.exit(1);
}

const METRICAS_POST = ["reach", "likes", "comments", "shares", "saved", "profile_visits"];

async function insights(id) {
  const r = await fetch(
    `${API}/${id}/insights?metric=${METRICAS_POST.join(",")}&access_token=${IG_ACCESS_TOKEN}`);
  const j = await r.json();
  if (j.error) return { erro: j.error.message };
  return Object.fromEntries((j.data || []).map((m) => [m.name, m.values?.[0]?.value ?? 0]));
}

async function conta() {
  const r = await fetch(
    `${API}/${IG_USER_ID}?fields=followers_count,media_count&access_token=${IG_ACCESS_TOKEN}`);
  return r.json();
}

const hist = JSON.parse(readFileSync(HISTORICO, "utf8"));
const alvo = process.argv.includes("--todas") ? hist : hist.slice(-7);

const perfil = await conta();
console.log(`\n═══ PLACAR · Consultoria Mendonça ═══`);
console.log(`Seguidores: ${perfil.followers_count ?? "?"}   Publicações: ${perfil.media_count ?? "?"}\n`);

const linhas = [];
for (const p of alvo) {
  const m = await insights(p.id_publicacao);
  if (m.erro) { console.log(`  ! ${p.arquivo}: ${m.erro}`); continue; }
  linhas.push({ ...p, ...m });
  console.log(
    `${(p.data_planejada || "").padEnd(11)} ${(p.pilar || "").padEnd(9)} ` +
    `alc ${String(m.reach ?? 0).padStart(6)}  ` +
    `salv ${String(m.saved ?? 0).padStart(4)}  ` +
    `comp ${String(m.shares ?? 0).padStart(4)}  ` +
    `com ${String(m.comments ?? 0).padStart(3)}  ` +
    `perfil ${String(m.profile_visits ?? 0).padStart(4)}`);
}

if (linhas.length) {
  const soma = (k) => linhas.reduce((a, l) => a + (l[k] || 0), 0);
  const salvamentos = soma("saved");
  const compart = soma("shares");
  const alcance = soma("reach");

  console.log(`\n─── Totais (${linhas.length} publicações) ───`);
  console.log(`Alcance ......... ${alcance}`);
  console.log(`Salvamentos ..... ${salvamentos}`);
  console.log(`Compartilhamentos ${compart}`);
  console.log(`Visitas ao perfil ${soma("profile_visits")}`);

  // Diagnóstico automático — marca/06-PAINEL-DE-CONTROLE.md §2
  console.log(`\n─── Leitura ───`);
  const taxaSalv = alcance ? (salvamentos / alcance) * 100 : 0;
  if (alcance > 500 && taxaSalv < 1)
    console.log("• Alcance bom, salvamento baixo → conteúdo raso. Suba a densidade técnica: tabela, número, passo a passo.");
  if (taxaSalv >= 2)
    console.log("• Taxa de salvamento forte. Esse tipo de post é o seu ativo — repita o formato.");
  if (compart < salvamentos / 4 && salvamentos > 20)
    console.log("• Salvam mas não compartilham → falta tensão. Reforce o pilar ALARMAR (dor/erro/risco).");

  const melhor = [...linhas].sort((a, b) => (b.saved || 0) - (a.saved || 0))[0];
  console.log(`• Melhor post por salvamento: ${melhor.arquivo} (${melhor.saved})`);

  writeFileSync(join(AQUI, "metricas-ultima-coleta.json"),
    JSON.stringify({ coletado_em: new Date().toISOString(), perfil, posts: linhas }, null, 2) + "\n");
  console.log(`\nSalvo em automacao/metricas-ultima-coleta.json\n`);
}
