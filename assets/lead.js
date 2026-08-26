/**
 * CONTROLLER DO AGRO — CAPTURA DE LEADS + ANALYTICS PADRONIZADO (FASE 0)
 * =======================================================================
 * Arquivo novo. Não mexe na lógica visual existente (app-v2.js continua
 * cuidando do diagnóstico, FAQ, tabs). Este arquivo cuida só de:
 *   1) capturar e persistir a origem (UTM / referrer) do visitante;
 *   2) padronizar os nomes de evento do funil;
 *   3) enviar o lead de verdade para o backend (troca do LEAD_ENDPOINT
 *      vazio encontrado na auditoria);
 *   4) calcular a pontuação (lead scoring V1) do lado do cliente para uso
 *      imediato na UI (o valor OFICIAL é recalculado no servidor).
 *
 * Inclua este script ANTES de app-v2.js, depois de assets/ga.js:
 *   <script defer src="/consultoria-mendonca/assets/ga.js"></script>
 *   <script defer src="/consultoria-mendonca/assets/lead.js"></script>
 *   <script defer src="/consultoria-mendonca/app-v2.js"></script>
 */
(function (global) {
  'use strict';

  // -----------------------------------------------------------------
  // CONFIG — preencher depois de publicar o backend (ver backend/SETUP.md)
  // -----------------------------------------------------------------
  var LEAD_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzIkLH8ud4fmEOHu3gCzcaX5rm3muIusoYXpncnBVzzvWX9sc-PHjzqWkpnJUDWUPVF1A/exec';
  var API_KEY = 'rWrq-uCK5-S53cNycv2CjXg9G2me48jTmSCsIJwKfrE';       // <-- COLE AQUI a mesma API_KEY que você definiu nas Propriedades do script (Apps Script > engrenagem > Propriedades do script)
  var GA_MEASUREMENT_ID = 'G-GQLS60YM9Y';

  var LS_ATTR = 'cm_attribution_v1';
  var LS_LEAD_ID = 'cm_lead_id_v1';
  var LS_VISITOR_ID = 'cm_visitor_id_v1';

  // -----------------------------------------------------------------
  // ATRIBUIÇÃO (first-touch, persistida em localStorage do navegador)
  // -----------------------------------------------------------------
  function uuid() {
    if (global.crypto && global.crypto.randomUUID) return global.crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function parseUTM() {
    var params = new URLSearchParams(global.location.search || '');
    var out = {
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
      utm_content: params.get('utm_content') || ''
    };
    if (!out.utm_source) {
      // sem UTM explícito: inferir por referrer (ex.: veio do Instagram)
      var ref = '';
      try { ref = document.referrer || ''; } catch (e) { ref = ''; }
      if (!ref) {
        out.utm_source = 'direto';
        out.utm_medium = 'nenhum';
      } else if (/instagram\.com/i.test(ref)) {
        out.utm_source = 'instagram'; out.utm_medium = 'referral';
      } else if (/l\.instagram\.com/i.test(ref)) {
        out.utm_source = 'instagram'; out.utm_medium = 'referral';
      } else if (/google\./i.test(ref)) {
        out.utm_source = 'google'; out.utm_medium = 'organico';
      } else if (/wa\.me|whatsapp/i.test(ref)) {
        out.utm_source = 'whatsapp'; out.utm_medium = 'referral';
      } else if (/linkedin\.com/i.test(ref)) {
        out.utm_source = 'linkedin'; out.utm_medium = 'referral';
      } else {
        try {
          out.utm_source = new URL(ref).hostname;
          out.utm_medium = 'referral';
        } catch (e) {
          out.utm_source = 'desconhecido'; out.utm_medium = 'desconhecido';
        }
      }
    }
    return out;
  }

  function getAttribution() {
    try {
      var stored = localStorage.getItem(LS_ATTR);
      if (stored) return JSON.parse(stored);
    } catch (e) { /* localStorage indisponível — segue sem persistir */ }

    var attr = parseUTM();
    attr.pagina_origem = global.location.pathname + (global.location.hash || '');
    attr.capturado_em = new Date().toISOString();
    try { localStorage.setItem(LS_ATTR, JSON.stringify(attr)); } catch (e) { /* ok, só não persiste entre sessões */ }
    return attr;
  }

  function getOrCreateId(key) {
    try {
      var v = localStorage.getItem(key);
      if (v) return v;
      v = uuid();
      localStorage.setItem(key, v);
      return v;
    } catch (e) {
      return uuid(); // sem persistência — só não sobrevive a reload; não trava o fluxo
    }
  }

  function device() {
    var ua = (global.navigator && global.navigator.userAgent) || '';
    return /Mobi|Android|iPhone|iPad/i.test(ua) ? 'mobile' : 'desktop';
  }

  function getGaClientId(cb) {
    try {
      if (global.gtag) {
        global.gtag('get', GA_MEASUREMENT_ID, 'client_id', function (id) { cb(id || ''); });
        // fallback síncrono caso o callback do gtag nunca dispare (bloqueador de anúncio etc.)
        setTimeout(function () { cb(readGaCookieClientId_()); }, 800);
        return;
      }
    } catch (e) { /* segue para o fallback por cookie */ }
    cb(readGaCookieClientId_());
  }
  function readGaCookieClientId_() {
    try {
      var m = document.cookie.match(/_ga=(?:GA\d\.\d\.)?(\d+\.\d+)/);
      return m ? m[1] : '';
    } catch (e) { return ''; }
  }

  // -----------------------------------------------------------------
  // ANALYTICS — funil padronizado
  // page_view -> diagnostico_inicio -> diagnostico_concluido ->
  // lead_enviado -> whatsapp_clique -> reuniao_agendada ->
  // proposta_enviada -> cliente_conquistado
  // (os 3 últimos são disparados a partir do painel/admin, não do site)
  // -----------------------------------------------------------------
  var _clientIdCache = null;
  function track(eventName, params) {
    var attr = getAttribution();
    var p = Object.assign({
      source: attr.utm_source,
      medium: attr.utm_medium,
      campaign: attr.utm_campaign,
      content: attr.utm_content,
      device: device()
    }, params || {});

    try {
      global.dataLayer = global.dataLayer || [];
      var evt = { event: eventName };
      for (var k in p) evt[k] = p[k];
      global.dataLayer.push(evt);
      if (global.gtag) global.gtag('event', eventName, p);
    } catch (e) { /* GA indisponível não pode travar a UX */ }

    // contagem agregada no backend (sem dado pessoal) — alimenta
    // "conversão do diagnóstico" e "cliques no WhatsApp" no dashboard.
    if (LEAD_ENDPOINT && API_KEY) {
      postBackend_({ action: 'registrar_evento', api_key: API_KEY, evento: eventName });
    }
  }

  function postBackend_(payload) {
    if (!LEAD_ENDPOINT) return Promise.resolve({ ok: false, erro: 'LEAD_ENDPOINT nao configurado' });
    // Content-Type text/plain evita o preflight CORS (OPTIONS) que o
    // Apps Script Web App não trata bem — o servidor faz JSON.parse do
    // corpo independente do content-type declarado.
    return fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    }).then(function (r) { return r.json(); }).catch(function (err) {
      return { ok: false, erro: String(err) };
    });
  }

  // -----------------------------------------------------------------
  // LEADS
  // -----------------------------------------------------------------
  function scoreLocalV1(dados) {
    // Espelha PONTOS do backend só para exibir algo imediato na UI.
    // O valor OFICIAL (usado no CRM/dashboard) é sempre o do servidor.
    var pts = 0;
    if (dados.indice_diagnostico !== undefined && dados.indice_diagnostico !== null && dados.indice_diagnostico !== '') pts += 10;
    if (dados.empresa) pts += 10;
    if (dados.porte_faturamento) pts += 10;
    return pts;
  }
  function classificar(pts) {
    if (pts >= 80) return 'OPORTUNIDADE';
    if (pts >= 60) return 'QUENTE';
    if (pts >= 30) return 'MORNO';
    return 'FRIO';
  }

  function enviarLead(dados) {
    var attr = getAttribution();
    var leadId = getOrCreateId(LS_LEAD_ID + '_' + (dados.origem || 'geral'));
    // ID por origem: uma mesma pessoa pode gerar leads distintos em fluxos
    // diferentes (ex.: diagnóstico da home + AgroAudit) sem se sobrescrever.

    var payload = Object.assign({
      action: 'create_lead',
      api_key: API_KEY,
      id_lead: leadId,
      utm_source: attr.utm_source,
      utm_medium: attr.utm_medium,
      utm_campaign: attr.utm_campaign,
      utm_content: attr.utm_content,
      pagina_origem: attr.pagina_origem,
      dispositivo: device()
    }, dados);

    if (!LEAD_ENDPOINT || !API_KEY) {
      // AÇÃO BLOQUEADA em tempo real: backend ainda não configurado.
      // Não finge sucesso — avisa no console e devolve erro explícito
      // para quem chamou decidir o que mostrar ao usuário.
      console.warn('[Controller do Agro] LEAD_ENDPOINT/API_KEY não configurados em assets/lead.js — lead NÃO foi enviado. Ver backend/SETUP.md.');
      return Promise.resolve({ ok: false, erro: 'endpoint_nao_configurado', id_lead: leadId, pontuacao: scoreLocalV1(dados), classificacao: classificar(scoreLocalV1(dados)) });
    }

    return new Promise(function (resolve) {
      getGaClientId(function (clientId) {
        payload.ga_client_id = clientId;
        postBackend_(payload).then(function (res) {
          if (res && res.ok) track('lead_enviado', { score: res.pontuacao, service: dados.servico_interesse || '' });
          resolve(res);
        });
      });
    });
  }

  function enviarEventoDeScore(idLead, evento) {
    if (!LEAD_ENDPOINT || !API_KEY) return Promise.resolve({ ok: false, erro: 'endpoint_nao_configurado' });
    return postBackend_({ action: 'score_event', api_key: API_KEY, id_lead: idLead, evento: evento });
  }

  function idLeadAtual(origem) {
    return getOrCreateId(LS_LEAD_ID + '_' + (origem || 'geral'));
  }

  // -----------------------------------------------------------------
  // API pública
  // -----------------------------------------------------------------
  global.CM = {
    track: track,
    enviarLead: enviarLead,
    enviarEventoDeScore: enviarEventoDeScore,
    getAttribution: getAttribution,
    idLeadAtual: idLeadAtual,
    device: device,
    scoreLocalV1: scoreLocalV1,
    classificar: classificar,
    _config: { get LEAD_ENDPOINT() { return LEAD_ENDPOINT; }, get API_KEY() { return API_KEY; } }
  };

  // page_view padronizado — dispara uma vez por carregamento de página.
  track('page_view', {});
})(typeof window !== 'undefined' ? window : this);
