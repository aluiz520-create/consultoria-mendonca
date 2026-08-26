(function () {
  'use strict';

  // Mesma URL configurada em ../assets/lead.js — duplicado aqui de propósito
  // (o painel é uma página separada, sem depender do carregamento de
  // lead.js, para não contaminar os contadores de evento com visitas ao
  // próprio painel). Atualize os dois se a URL do backend mudar.
  var LEAD_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzIkLH8ud4fmEOHu3gCzcaX5rm3muIusoYXpncnBVzzvWX9sc-PHjzqWkpnJUDWUPVF1A/exec';

  var LS_KEY = 'cm_admin_key_v1';
  // FASE 1 (26/08/2026): REUNIAO virou dois estagios — precisa bater exatamente
  // com STATUS_VALIDOS do Code.gs (backend), senao o update_status é recusado.
  var STATUS_OPCOES = ['NOVO', 'CONTATADO', 'QUALIFICADO', 'DIAGNOSTICO_AGENDADO', 'DIAGNOSTICO_REALIZADO', 'PROPOSTA', 'NEGOCIACAO', 'GANHO', 'PERDIDO'];
  // 'REUNIAO' não existe mais no backend (STATUS_VALIDOS), mas leads antigos
  // ainda têm essa palavra salva na planilha. Sem isto, o <select> não acha
  // a opção e cai silenciosamente em "NOVO" — mostrando um status errado no
  // painel. Mantemos ela só para exibir corretamente o dado antigo; ao
  // escolher qualquer opção da lista nova, o lead avança e não volta a
  // aparecer como REUNIAO.
  var STATUS_LEGADO = 'REUNIAO';

  var gate = document.getElementById('gate');
  var panel = document.getElementById('panel');
  var gateKeyInput = document.getElementById('gate-key');
  var gateMsg = document.getElementById('gate-msg');

  function apiGet(action) {
    var key = localStorage.getItem(LS_KEY) || '';
    return fetch(LEAD_ENDPOINT + '?action=' + action + '&key=' + encodeURIComponent(key))
      .then(function (r) { return r.json(); });
  }
  function apiPost(body) {
    var key = localStorage.getItem(LS_KEY) || '';
    body.api_key = key;
    return fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body)
    }).then(function (r) { return r.json(); });
  }

  function abrirPainel() {
    gate.classList.add('hide');
    panel.classList.remove('hide');
    carregar();
  }

  document.getElementById('gate-go').addEventListener('click', function () {
    var k = (gateKeyInput.value || '').trim();
    if (!k) { gateMsg.textContent = 'Cole a chave primeiro.'; return; }
    if (!LEAD_ENDPOINT) { gateMsg.textContent = 'LEAD_ENDPOINT não configurado em admin/app.js ainda.'; return; }
    localStorage.setItem(LS_KEY, k);
    gateMsg.textContent = 'Verificando...';
    apiGet('dashboard').then(function (res) {
      if (res && res.erro) {
        gateMsg.textContent = 'Chave inválida ou backend indisponível: ' + res.erro;
        localStorage.removeItem(LS_KEY);
        return;
      }
      abrirPainel();
    }).catch(function (err) {
      gateMsg.textContent = 'Não foi possível conectar ao backend: ' + err;
    });
  });

  document.getElementById('logout').addEventListener('click', function () {
    localStorage.removeItem(LS_KEY);
    panel.classList.add('hide');
    gate.classList.remove('hide');
    gateKeyInput.value = '';
  });

  document.getElementById('refresh').addEventListener('click', carregar);

  function fillList(ulId, obj) {
    var ul = document.getElementById(ulId);
    ul.innerHTML = '';
    var entries = Object.keys(obj || {}).map(function (k) { return [k, obj[k]]; }).sort(function (a, b) { return b[1] - a[1]; });
    if (!entries.length) { ul.innerHTML = '<li style="color:var(--mut)">Sem dados ainda</li>'; return; }
    entries.forEach(function (e) {
      var li = document.createElement('li');
      li.innerHTML = '<span>' + escapeHtml_(String(e[0])) + '</span><span><b>' + e[1] + '</b></span>';
      ul.appendChild(li);
    });
  }

  function escapeHtml_(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function contarEvento(eventos, nome) {
    var e = (eventos || []).filter(function (x) { return x.evento === nome; })[0];
    return e ? Number(e.total) || 0 : 0;
  }

  function carregar() {
    document.getElementById('atualizado').textContent = 'Carregando...';
    apiGet('dashboard').then(function (d) {
      if (!d || d.erro) {
        document.getElementById('atualizado').textContent = 'Erro: ' + (d && d.erro);
        return;
      }
      document.getElementById('k-hoje').textContent = d.leads_hoje;
      document.getElementById('k-7d').textContent = d.leads_7d;
      document.getElementById('k-30d').textContent = d.leads_30d;
      document.getElementById('k-total').textContent = d.total_leads;

      var inicios = contarEvento(d.eventos_resumo, 'diagnostico_inicio');
      var concluidos = contarEvento(d.eventos_resumo, 'diagnostico_concluido');
      document.getElementById('k-conv').textContent = inicios ? Math.round((concluidos / inicios) * 100) + '%' : (concluidos ? '—' : '0%');
      document.getElementById('k-wa').textContent = contarEvento(d.eventos_resumo, 'whatsapp_clique');

      fillList('b-origem', d.por_origem);
      fillList('b-classificacao', d.por_classificacao);
      fillList('b-estado', d.por_estado);
      fillList('b-servico', d.por_servico);
      fillList('b-empresa', d.por_empresa);
      fillList('b-status', d.por_status_crm);

      renderTabela(d.leads_recentes || []);
      document.getElementById('atualizado').textContent = 'Atualizado às ' + new Date(d.gerado_em).toLocaleTimeString('pt-BR');
    }).catch(function (err) {
      document.getElementById('atualizado').textContent = 'Erro ao carregar: ' + err;
    });
  }

  function renderTabela(leads) {
    var tbody = document.getElementById('tbl-leads');
    tbody.innerHTML = '';
    leads.forEach(function (l) {
      var tr = document.createElement('tr');
      var data = l.criado_em ? new Date(l.criado_em).toLocaleDateString('pt-BR') : '';
      var badge = '<span class="tagpill badge-' + (l.classificacao || 'FRIO') + '">' + (l.classificacao || '') + ' · ' + (l.pontuacao || 0) + '</span>';

      var select = document.createElement('select');
      var opcoesParaEsteLead = STATUS_OPCOES;
      if (l.status_crm === STATUS_LEGADO) {
        // lead antigo ainda em REUNIAO: mostra o valor real dele + as opções
        // novas, para não mentir sobre o status e ainda permitir avançar.
        opcoesParaEsteLead = [STATUS_LEGADO].concat(STATUS_OPCOES);
      }
      opcoesParaEsteLead.forEach(function (s) {
        var opt = document.createElement('option');
        opt.value = s; opt.textContent = s === STATUS_LEGADO ? s + ' (antigo)' : s;
        if (s === l.status_crm) opt.selected = true;
        select.appendChild(opt);
      });

      // FASE 1: observação e valor ficam junto do status, e são lidos no
      // momento em que o status muda — não exigem um botão "salvar" à parte,
      // mantendo o mesmo padrão de uso que já existia (trocar o status já salva).
      var obsInput = document.createElement('input');
      obsInput.type = 'text';
      obsInput.placeholder = 'observação (opcional)';
      obsInput.style.cssText = 'width:100%;font-size:12px;padding:4px';

      var valorInput = document.createElement('input');
      valorInput.type = 'text';
      valorInput.placeholder = 'valor R$ (opcional)';
      valorInput.style.cssText = 'width:100%;font-size:12px;padding:4px';
      if (l.valor_negocio) valorInput.value = l.valor_negocio;

      select.addEventListener('change', function () {
        var novo = select.value;
        var msg = document.getElementById('crm-msg');
        msg.textContent = 'Salvando...';
        apiPost({
          action: 'update_status', id_lead: l.id_lead, novo_status: novo, alterado_por: 'painel',
          observacao: obsInput.value || '', valor: valorInput.value || ''
        }).then(function (res) {
          if (res && res.ok) {
            msg.textContent = 'Status de ' + (l.nome || l.id_lead) + ' atualizado para ' + novo + '.';
          } else {
            msg.textContent = 'Falha ao salvar: ' + (res && res.erro);
          }
        });
      });

      tr.innerHTML = '<td>' + data + '</td><td>' + escapeHtml_(String(l.nome || '')) + '</td><td>' + escapeHtml_(String(l.empresa || '')) + '</td><td>' + escapeHtml_(String(l.whatsapp || '')) + '</td><td>' + escapeHtml_(String(l.origem || '')) + '</td><td>' + badge + '</td>';
      var tdStatus = document.createElement('td');
      tdStatus.appendChild(select);
      tr.appendChild(tdStatus);
      var tdObs = document.createElement('td');
      tdObs.appendChild(obsInput);
      tr.appendChild(tdObs);
      var tdValor = document.createElement('td');
      tdValor.appendChild(valorInput);
      tr.appendChild(tdValor);
      tbody.appendChild(tr);
    });
    if (!leads.length) tbody.innerHTML = '<tr><td colspan="9" style="color:var(--mut)">Nenhum lead ainda.</td></tr>';
  }

  // reabre direto se já tiver chave salva
  if (localStorage.getItem(LS_KEY)) {
    gateKeyInput.value = localStorage.getItem(LS_KEY);
    abrirPainel();
  }
})();
