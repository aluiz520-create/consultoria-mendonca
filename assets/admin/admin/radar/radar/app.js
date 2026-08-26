(function () {
  'use strict';

  var CM = window.CM;
  var Engine = window.RadarEngine;

  var drop = document.getElementById('drop');
  var fileInput = document.getElementById('file');
  var pickBtn = document.getElementById('pick');
  var erroEl = document.getElementById('upload-erro');
  var resultadoEl = document.getElementById('resultado');
  var ultimoResultado = null;

  pickBtn.addEventListener('click', function () { fileInput.click(); });
  fileInput.addEventListener('change', function (e) {
    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
  });
  ['dragenter', 'dragover'].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('over'); });
  });
  ['dragleave', 'drop'].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('over'); });
  });
  drop.addEventListener('drop', function (e) {
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  });

  document.getElementById('baixar-modelo').addEventListener('click', function (e) {
    e.preventDefault();
    var csv = 'periodo,receita,despesas,dividas,contas_pagar,contas_receber,producao,preco,area,estoque\n2026-06,180000,150000,220000,40000,60000,3200,55,120,15000\n2026-07,195000,158000,215000,42000,65000,3400,56,120,16000\n';
    var blob = new Blob([csv], { type: 'text/csv' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'modelo-radar-financeiro.csv';
    document.body.appendChild(a); a.click(); a.remove();
  });

  document.getElementById('usar-exemplo').addEventListener('click', function (e) {
    e.preventDefault();
    var rows = [
      { periodo: '2026-06', receita: 180000, despesas: 150000, dividas: 220000, contas_pagar: 40000, contas_receber: 60000, producao: 3200, preco: 55, area: 120, estoque: 15000 },
      { periodo: '2026-07', receita: 195000, despesas: 158000, dividas: 215000, contas_pagar: 42000, contas_receber: 65000, producao: 3400, preco: 56, area: 120, estoque: 16000 }
    ];
    processarLinhas(rows, 'exemplo.csv');
  });

  function handleFile(file) {
    erroEl.classList.add('hide');
    var nome = file.name.toLowerCase();
    if (nome.endsWith('.csv')) {
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var rows = parseCsv(reader.result);
          if (!rows.length) throw new Error('Arquivo CSV vazio ou sem linhas de dados reconhecíveis.');
          processarLinhas(rows, file.name);
        } catch (err) { mostrarErro(err); }
      };
      reader.onerror = function () { mostrarErro(new Error('Não foi possível ler o arquivo.')); };
      reader.readAsText(file, 'utf-8');
    } else if (nome.endsWith('.xlsx') || nome.endsWith('.xls')) {
      if (!window.XLSX) { mostrarErro(new Error('Biblioteca de leitura de XLSX não carregou — tente novamente em alguns segundos ou envie em CSV.')); return; }
      var reader2 = new FileReader();
      reader2.onload = function () {
        try {
          var wb = window.XLSX.read(new Uint8Array(reader2.result), { type: 'array' });
          var sheet = wb.Sheets[wb.SheetNames[0]];
          var rows = window.XLSX.utils.sheet_to_json(sheet, { defval: '' });
          if (!rows.length) throw new Error('Planilha vazia ou sem linhas de dados na primeira aba.');
          processarLinhas(rows, file.name);
        } catch (err) { mostrarErro(err); }
      };
      reader2.onerror = function () { mostrarErro(new Error('Não foi possível ler o arquivo.')); };
      reader2.readAsArrayBuffer(file);
    } else {
      mostrarErro(new Error('Formato não suportado ainda — envie um arquivo .csv ou .xlsx. PDF é uma etapa futura, não desta versão.'));
    }
  }

  function mostrarErro(err) {
    erroEl.textContent = 'Não deu para processar o arquivo: ' + (err && err.message ? err.message : err);
    erroEl.classList.remove('hide');
    if (CM) CM.track('radar_erro_upload', { erro: String(err && err.message) });
  }

  function parseCsv(text) {
    var lines = text.replace(/\r/g, '').split('\n').filter(function (l) { return l.trim() !== ''; });
    if (!lines.length) return [];
    var sep = lines[0].indexOf(';') > -1 && lines[0].indexOf(',') === -1 ? ';' : ',';
    var headers = splitCsvLine(lines[0], sep).map(function (h) { return h.trim().toLowerCase(); });
    return lines.slice(1).map(function (line) {
      var cells = splitCsvLine(line, sep);
      var o = {};
      headers.forEach(function (h, i) { o[h] = cells[i] !== undefined ? cells[i].trim() : ''; });
      return o;
    });
  }
  function splitCsvLine(line, sep) {
    var out = [], cur = '', inQ = false;
    for (var i = 0; i < line.length; i++) {
      var c = line[i];
      if (c === '"') { inQ = !inQ; continue; }
      if (c === sep && !inQ) { out.push(cur); cur = ''; continue; }
      cur += c;
    }
    out.push(cur);
    return out;
  }

  function processarLinhas(rows, nomeArquivo) {
    var res = Engine.compute(rows);
    if (res.erro) { mostrarErro(new Error(res.erro)); return; }
    ultimoResultado = res;
    if (CM) CM.track('diagnostico_concluido', { indice: res.saude_financeira, service: 'radar_financeiro', arquivo: nomeArquivo });
    render(res);
  }

  function confClass(c) {
    if (c.indexOf('CONFIRMADO') > -1) return 'conf-CONFIRMADO';
    if (c.indexOf('PROV') > -1) return 'conf-PROVÁVEL';
    if (c.indexOf('ESTIMATIVA') > -1) return 'conf-ESTIMATIVA';
    if (c.indexOf('NECESSITA') > -1) return 'conf-NECESSITA';
    return 'conf-DADO';
  }

  function cardHtml(icone, item) {
    return '<div class="card">' +
      '<h4>' + icone + ' ' + esc(item.titulo) + '</h4>' +
      '<p>' + esc(item.texto) + '</p>' +
      '<div class="meta"><span class="conf ' + confClass(item.confianca) + '">' + esc(item.confianca) + '</span>' +
      (item.evidencia ? ' &nbsp; <b>Evidência:</b> ' + esc(item.evidencia) : '') +
      (item.calculo ? ' &nbsp; <b>Cálculo:</b> ' + esc(item.calculo) : '') +
      (item.premissas ? '<br /><b>Premissas:</b> ' + esc(item.premissas) : '') +
      '</div></div>';
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }

  function render(res) {
    var html = '';
    html += '<div style="border-top:1px solid rgba(246,244,239,.16);padding-top:32px;margin-top:8px">';
    html += '<p class="tag" style="margin-bottom:10px">RESULTADO — ' + esc(res.periodo_analisado) + '</p>';
    html += '<div style="display:flex;align-items:baseline;gap:10px;margin-bottom:6px"><span class="big" style="font-size:64px;font-weight:700">' + (res.saude_financeira === null ? '—' : res.saude_financeira) + '</span><span style="font-size:22px;opacity:.6">/100 · Saúde financeira</span></div>';
    html += '<p style="font-size:13px;color:rgba(246,244,239,.55);margin-bottom:28px">' + esc(res.formula_saude) + '</p>';

    html += '<h3 style="font-size:22px;margin-bottom:14px">🔴 Riscos</h3>';
    html += res.riscos.length ? res.riscos.map(function (r) { return cardHtml('🔴', r); }).join('') : '<p style="color:rgba(246,244,239,.5);margin-bottom:20px">Nenhum risco identificado com os dados informados.</p>';

    html += '<h3 style="font-size:22px;margin:28px 0 14px">🟡 Alertas (anomalias e dados insuficientes)</h3>';
    html += res.alertas.length ? res.alertas.map(function (r) { return cardHtml('🟡', r); }).join('') : '<p style="color:rgba(246,244,239,.5);margin-bottom:20px">Nenhum alerta.</p>';

    html += '<h3 style="font-size:22px;margin:28px 0 14px">🟢 Oportunidades</h3>';
    html += res.oportunidades.length ? res.oportunidades.map(function (r) { return cardHtml('🟢', r); }).join('') : '<p style="color:rgba(246,244,239,.5);margin-bottom:20px">Nenhuma oportunidade identificada com os dados informados.</p>';

    html += '<h3 style="font-size:22px;margin:28px 0 14px">💰 Impacto financeiro</h3>';
    if (res.impacto_financeiro.length) {
      html += '<ul class="bars" style="margin-bottom:20px">' + res.impacto_financeiro.map(function (i) {
        return '<li style="border-bottom:1px solid rgba(246,244,239,.12);padding:8px 0;display:flex;justify-content:space-between"><span>' + esc(i.item) + ' <span class="conf ' + confClass(i.confianca) + '">' + esc(i.confianca) + '</span></span><b>R$ ' + Number(i.valor).toLocaleString('pt-BR') + '</b></li>';
      }).join('') + '</ul>';
    } else {
      html += '<p style="color:rgba(246,244,239,.5);margin-bottom:20px">Sem dados suficientes (área/produção/despesas) para estimar impacto por hectare ou por unidade.</p>';
    }

    html += '<h3 style="font-size:22px;margin:28px 0 14px">🎯 5 decisões prioritárias</h3>';
    html += '<ol style="padding-left:20px;display:flex;flex-direction:column;gap:14px;margin-bottom:8px">' + res.decisoes.map(function (d, i) {
      return '<li style="font-size:15px;line-height:1.5"><b>' + esc(d.titulo) + '</b> <span class="conf ' + confClass(d.confianca) + '">' + esc(d.confianca) + '</span><br /><span style="color:rgba(246,244,239,.75)">' + esc(d.texto) + '</span></li>';
    }).join('') + '</ol>';

    html += '<p style="font-size:13px;color:rgba(246,244,239,.5);margin:20px 0 40px">' + esc(res.aviso) + '</p>';

    html += analiseProfissionalHtml();
    html += '</div>';

    resultadoEl.innerHTML = html;
    resultadoEl.classList.remove('hide');
    wireAnaliseProfissional();
    resultadoEl.scrollIntoView({ behavior: 'smooth' });
  }

  function analiseProfissionalHtml() {
    return '<div style="border-top:1px solid rgba(246,244,239,.16);padding-top:28px;margin-top:20px">' +
      '<p class="tag" style="margin-bottom:10px;color:#7FD3A8">ANÁLISE PROFISSIONAL</p>' +
      '<p style="font-size:16px;line-height:1.55;color:rgba(246,244,239,.8);margin-bottom:18px">Quer que um especialista revise os principais pontos encontrados na sua operação?</p>' +
      '<div id="rd-form" style="display:flex;flex-direction:column;gap:12px;max-width:420px">' +
      '<label class="field"><span class="tag">NOME</span><input id="rd-nome" type="text" placeholder="Como devemos te chamar" /></label>' +
      '<label class="field"><span class="tag">WHATSAPP</span><input id="rd-wpp" type="tel" placeholder="(00) 00000-0000" /></label>' +
      '<label class="field"><span class="tag">E-MAIL (OPCIONAL)</span><input id="rd-email" type="email" placeholder="seu@email.com" /></label>' +
      '<button class="btn" id="rd-send" type="button">Solicitar análise</button>' +
      '<p id="rd-note" style="font-size:13px"></p>' +
      '</div>' +
      '<div id="rd-ok" class="hide"><p style="font-size:15px;color:rgba(246,244,239,.8)"><span id="rd-ok-name"></span>, recebemos seu pedido. Em breve entramos em contato pelo WhatsApp informado.</p></div>' +
      '</div>';
  }

  function wireAnaliseProfissional() {
    var sending = false;
    var send = document.getElementById('rd-send');
    if (!send) return;
    send.addEventListener('click', function () {
      if (sending) return;
      var g = function (id) { var el = document.getElementById(id); return el ? (el.value || '').trim() : ''; };
      var nome = g('rd-nome'), wpp = g('rd-wpp'), mail = g('rd-email');
      var note = document.getElementById('rd-note');
      if (!nome || !wpp) { note.textContent = 'Precisamos do seu nome e do WhatsApp.'; note.style.color = '#E08A72'; return; }
      if (mail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) { note.textContent = 'Esse e-mail não parece válido — confira ou deixe em branco.'; note.style.color = '#E08A72'; return; }
      if (!CM) { note.textContent = 'Serviço de captura ainda não configurado neste site. Fale pelo WhatsApp do rodapé.'; note.style.color = '#E08A72'; return; }
      sending = true; send.disabled = true; send.textContent = 'Enviando...'; note.textContent = ''; note.style.color = '';
      CM.enviarLead({
        origem: 'radar_financeiro',
        nome: nome, whatsapp: wpp, email: mail,
        indice_diagnostico: ultimoResultado ? ultimoResultado.saude_financeira : '',
        servico_interesse: 'Diagnóstico Financeiro Inteligente do Agro'
      }).then(function (res) {
        sending = false;
        if (res && res.ok) {
          CM.enviarEventoDeScore(res.id_lead, 'solicitou_diagnostico_profissional');
          document.getElementById('rd-ok-name').textContent = nome.split(' ')[0];
          document.getElementById('rd-form').classList.add('hide');
          document.getElementById('rd-ok').classList.remove('hide');
        } else {
          send.disabled = false; send.textContent = 'Solicitar análise';
          note.textContent = 'Não conseguimos registrar agora. Tente novamente em instantes.';
          note.style.color = '#E08A72';
        }
      });
    });
  }
})();
