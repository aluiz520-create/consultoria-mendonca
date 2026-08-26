(function(){
var W='https://wa.me/5564992226766?text=';

// ---------------------------------------------------------------------------
// FASE 0 — captura de leads e analytics agora vivem em assets/lead.js
// (objeto global CM), carregado ANTES deste arquivo. Os nomes de função
// abaixo (track/enviarLead) continuam existindo como atalhos finos para
// CM.track/CM.enviarLead, só para não precisar reescrever cada chamada
// espalhada neste arquivo — alteração incremental, não uma reescrita.
// Ver assets/lead.js para a lógica real (UTM, backend, scoring).
// ---------------------------------------------------------------------------
var CMok = typeof window !== 'undefined' && window.CM;
if (!CMok) {
  console.warn('[Controller do Agro] assets/lead.js não foi carregado antes de app-v2.js — captura de leads e analytics padronizado ficam inativos nesta página.');
}

// Traduz nomes antigos de evento (usados em atributos data-ev espalhados
// por várias páginas do site) para o funil padronizado da Fase 0, sem
// precisar editar HTML de cada página.
var EVENT_ALIAS = {
  clique_whatsapp: 'whatsapp_clique',
  diagnostico_iniciado: 'diagnostico_inicio',
  lista_agroaudit_enviada: 'lead_enviado'
};

function track(n, p) {
  var name = EVENT_ALIAS[n] || n;
  if (CMok) { window.CM.track(name, p || {}); return; }
  // fallback mínimo caso lead.js não tenha carregado — não quebra a página
  try {
    window.dataLayer = window.dataLayer || [];
    var o = { event: name }; for (var k in p) o[k] = p[k];
    window.dataLayer.push(o);
    if (window.gtag) window.gtag('event', name, p || {});
  } catch (e) {}
}

document.addEventListener('click', function (e) {
  var a = e.target.closest('[data-ev]');
  if (!a) return;
  var evName = a.getAttribute('data-ev');
  track(evName, { origem: a.getAttribute('data-origem') || '', indice: a.getAttribute('data-indice') || undefined });

  // Clique em WhatsApp de um lead que JÁ existe (mesma origem) soma pontos
  // ao score dele — "Clicou WhatsApp = +15" (item 7 da missão).
  if (CMok && (evName === 'clique_whatsapp' || evName === 'whatsapp_clique')) {
    var origem = a.getAttribute('data-origem') || 'geral';
    var idLead = window.CM.idLeadAtual(origem);
    window.CM.enviarEventoDeScore(idLead, 'clicou_whatsapp');
  }
});

// --- checklist de problemas
var pl=document.getElementById('pains');
if(pl){var pc=document.getElementById('pc'),pv=document.getElementById('pv');
pl.addEventListener('click',function(e){var b=e.target.closest('.pain');if(!b)return;
var on=b.getAttribute('aria-pressed')==='true';b.setAttribute('aria-pressed',on?'false':'true');b.querySelector('.m').textContent=on?'□':'■';
var n=pl.querySelectorAll('.pain[aria-pressed=true]').length;pc.textContent=n;
pv.textContent=n===0?'Marque o que acontece na sua operação hoje.':n<=2?'Ainda são sintomas isolados — vale mapear antes que virem rotina.':n<=5?'Já é um padrão. Normalmente há uma causa comum ligando esses pontos.':'A informação parou de circular. O resultado do mês já está sendo afetado por isso.';});}

// --- FAQ
document.querySelectorAll('.faq .faqq').forEach(function(b){b.addEventListener('click',function(){
var open=b.getAttribute('aria-expanded')==='true';var p=b.nextElementSibling;
b.setAttribute('aria-expanded',open?'false':'true');b.lastElementChild.textContent=open?'+':'−';p.classList.toggle('hide',open);});});

// --- tabs (materiais)
var tabs=document.querySelector('.tabs');
if(tabs){tabs.addEventListener('click',function(e){var t=e.target.closest('.tab');if(!t)return;
tabs.querySelectorAll('.tab').forEach(function(x){x.setAttribute('aria-selected',String(x===t));});
var g=t.getAttribute('data-g');
document.querySelectorAll('[data-group]').forEach(function(li){li.classList.toggle('hide',!(g==='Tudo'||li.getAttribute('data-group')===g));});});}

// --- diagnóstico
var idle=document.getElementById('q-idle');
if(idle){
var Q=[['Sua empresa ainda depende de planilhas para controles importantes?','tecnologia',1],
['Seu ERP realmente entrega os indicadores que você precisa?','indicadores',0],
['Você possui mais de uma fonte para a mesma informação?','processos',1],
['Já encontrou divergências depois do fechamento?','fiscal',1],
['Existem processos que dependem de uma única pessoa?','processos',1],
['Você consegue identificar rapidamente seus maiores custos?','financeiro',0],
['Existe retrabalho entre financeiro, fiscal e administrativo?','fiscal',1],
['Você consegue saber rapidamente onde estão os principais gargalos?','indicadores',0],
['Seus dados estão integrados entre os sistemas e áreas?','tecnologia',0],
['Você possui indicadores confiáveis para tomada de decisão?','financeiro',0]];
var DIM=[['financeiro','Financeiro'],['fiscal','Fiscal'],['processos','Processos'],['tecnologia','Tecnologia'],['indicadores','Indicadores']];
var EXP={Financeiro:'Sem custo aberto e caixa projetado, a decisão de comprar insumo, vender saca ou tomar crédito vira aposta. É o primeiro lugar onde a margem some sem deixar rastro.',
Fiscal:'Divergência depois do fechamento e retrabalho entre áreas quase nunca são erro de digitação — são sintoma de parametrização e processo. E o custo aparece em multa ou em imposto pago a mais.',
Processos:'Quando a rotina depende de uma pessoa ou de duas fontes para o mesmo número, a operação não tem processo: tem hábito. Cresce até parar.',
Tecnologia:'Planilha não é o problema. Depender de controles fragmentados que não se falam é — porque cada um deles esconde uma parte da verdade.',
Indicadores:'Dado espalhado não é gestão. Se você não consegue apontar o gargalo em minutos, a informação existe mas não está no lugar certo.'};
var run=document.getElementById('q-run'),don=document.getElementById('q-done');
var i=0,ans=[],fired=false,ultimoResultado=null;
function col(v){return v<50?'#B4472F':v<70?'#C8862A':'#4FA97F';}
function show(a,b,c){idle.classList.toggle('hide',!a);run.classList.toggle('hide',!b);don.classList.toggle('hide',!c);}
function paintQ(){var q=Q[i];document.getElementById('q-num').textContent=i+1;
document.getElementById('q-area').textContent=q[1].toUpperCase();
document.getElementById('q-text').textContent=q[0];
document.getElementById('q-prog').style.width=Math.round(i/Q.length*100)+'%';
var tk=document.getElementById('q-track');if(tk)tk.setAttribute('aria-valuenow',i);}
function finish(){
var acc={};DIM.forEach(function(d){acc[d[0]]=[];});
ans.forEach(function(v,k){if(v==null)return;var q=Q[k];acc[q[1]].push(q[2]?1-v:v);});
var rows=DIM.map(function(d){var a=acc[d[0]];var v=a.length?Math.round(a.reduce(function(s,x){return s+x;},0)/a.length*100):0;return{label:d[1],value:v};});
var ov=Math.round(rows.reduce(function(s,r){return s+r.value;},0)/rows.length);
var srt=rows.slice().sort(function(a,b){return a.value-b.value;});
var sc=document.getElementById('r-score');sc.textContent=ov;sc.style.color=col(ov);
document.getElementById('r-verdict').textContent=ov<50?'A operação está rodando com pouca visibilidade. Há decisões sendo tomadas hoje sem base confiável.':ov<70?'A operação funciona, mas o controle depende de esforço manual e de pessoas específicas.':'Boa base de controle. O ganho agora está em confiabilidade e velocidade da informação.';
document.getElementById('r-bars').innerHTML=rows.map(function(r){return '<li><div class="top"><span style="opacity:.85">'+r.label+'</span><span class="mono" style="opacity:.6">'+r.value+'</span></div><div class="track"><i style="width:'+r.value+'%;background:'+col(r.value)+'"></i></div></li>';}).join('');
document.getElementById('r-weak').textContent='Seu principal ponto de atenção está em '+srt[0].label+(srt[1]?' e '+srt[1].label:'')+'.';
document.getElementById('r-explain').textContent=EXP[srt[0].label]||'';
document.getElementById('r-wa').href=W+encodeURIComponent('Olá! Vim pelo diagnóstico da Consultoria Mendonça. Meu índice de controle operacional foi '+ov+'/100 ('+rows.map(function(r){return r.label+' '+r.value;}).join(', ')+'). Gostaria de entender o que isso significa para a minha operação.');
document.getElementById('r-wa').setAttribute('data-indice',ov);
ultimoResultado={indice:ov,dimensoes:rows};
show(false,false,true);
if(!fired){fired=true;track('diagnostico_concluido',{indice:ov});}}
document.getElementById('q-start').addEventListener('click',function(){i=0;ans=[];fired=false;track('diagnostico_iniciado');show(false,true,false);paintQ();run.scrollIntoView?null:null;});
run.querySelectorAll('.opt').forEach(function(b){b.addEventListener('click',function(){
ans[i]=parseFloat(b.getAttribute('data-v'));i++;if(i>=Q.length){finish();}else{paintQ();}});});
document.getElementById('q-back').addEventListener('click',function(){if(i>0){i--;paintQ();}});
document.getElementById('q-reset').addEventListener('click',function(){i=0;ans=[];fired=false;show(true,false,false);});

// --- CTA "Análise profissional" (item 6 da Fase 0): mini-formulário que
// aparece junto do resultado, sem obrigar a pessoa a sair para o WhatsApp
// se preferir deixar contato e ser procurada.
var apForm=document.getElementById('ap-form'),apSend=document.getElementById('ap-send');
if(apForm&&apSend){
var apSending=false;
apSend.addEventListener('click',function(){
if(apSending)return; // trava contra duplo clique / envio duplicado
var g=function(id){var el=document.getElementById(id);return el?(el.value||'').trim():'';};
var nome=g('ap-nome'),wpp=g('ap-wpp'),mail=g('ap-email');
var note=document.getElementById('ap-note');
if(!nome||!wpp){note.textContent='Precisamos do seu nome e do WhatsApp para a análise.';note.style.color='#E08A72';return;}
if(mail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)){note.textContent='Esse e-mail não parece válido — confira ou deixe em branco.';note.style.color='#E08A72';return;}
if(!ultimoResultado){note.textContent='Refaça o diagnóstico antes de pedir a análise.';note.style.color='#E08A72';return;}
apSending=true;apSend.disabled=true;apSend.textContent='Enviando...';note.textContent='';note.style.color='';
track('solicitou_analise_profissional',{indice:ultimoResultado.indice});
if(!CMok){note.textContent='Serviço de captura ainda não configurado neste site (ver backend/SETUP.md). Fale direto pelo WhatsApp acima.';apSending=false;apSend.disabled=false;apSend.textContent='Solicitar análise';return;}
window.CM.enviarLead({
origem:'diagnostico_home_analise_profissional',
nome:nome,whatsapp:wpp,email:mail,
indice_diagnostico:ultimoResultado.indice,
dimensoes_diagnostico:ultimoResultado.dimensoes,
servico_interesse:'Diagnóstico Financeiro Inteligente do Agro'
}).then(function(res){
apSending=false;
if(res&&res.ok){
window.CM.enviarEventoDeScore(res.id_lead,'solicitou_diagnostico_profissional');
document.getElementById('ap-ok-name').textContent=nome.split(' ')[0];
apForm.classList.add('hide');document.getElementById('ap-ok').classList.remove('hide');
}else{
apSend.disabled=false;apSend.textContent='Solicitar análise';
note.textContent='Não conseguimos registrar agora. Você pode falar direto pelo WhatsApp acima enquanto resolvemos.';note.style.color='#E08A72';
}
});
});
}
}

// --- formulário AgroAudit
var f=document.getElementById('aa-form');
if(f){var tipo='';var aaSending=false;
f.querySelectorAll('.chip').forEach(function(c){c.addEventListener('click',function(){
f.querySelectorAll('.chip').forEach(function(x){x.setAttribute('aria-selected','false');x.setAttribute('aria-pressed','false');});
c.setAttribute('aria-pressed','true');tipo=c.textContent.trim();});});
document.getElementById('aa-send').addEventListener('click',function(){
if(aaSending)return; // trava contra duplo clique / envio duplicado
var g=function(id){var el=document.getElementById(id);return el?(el.value||'').trim():'';};
var nome=g('aa-nome'),emp=g('aa-empresa'),wpp=g('aa-wpp'),mail=g('aa-email'),estado=g('aa-estado'),porte=g('aa-porte');
var note=document.getElementById('aa-note');
if(!nome||!wpp){note.textContent='Precisamos ao menos do seu nome e do WhatsApp para te avisar.';note.style.color='#E08A72';return;}
if(mail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)){note.textContent='Esse e-mail não parece válido — confira ou deixe em branco.';note.style.color='#E08A72';return;}
var btn=document.getElementById('aa-send');
aaSending=true;btn.disabled=true;var textoOriginal=btn.textContent;btn.textContent='Enviando...';
note.textContent='';note.style.color='';

function mostrarConfirmacao(){
document.getElementById('aa-ok-name').textContent=nome.split(' ')[0];
document.getElementById('aa-ok-wa').href=W+encodeURIComponent('Olá! Quero entrar na lista dos primeiros testes do AgroAudit.\n\nNome: '+nome+'\nEmpresa: '+emp+'\nWhatsApp: '+wpp+'\nE-mail: '+mail+'\nTipo de operação que gostaria de auditar: '+(tipo||'a definir'));
f.classList.add('hide');document.getElementById('aa-ok').classList.remove('hide');
}

if(!CMok){
// lead.js não carregou — não finge sucesso, mas preserva o caminho de
// confirmação por WhatsApp que já existia (rede de segurança original).
aaSending=false;btn.disabled=false;btn.textContent=textoOriginal;
mostrarConfirmacao();
return;
}

window.CM.enviarLead({
origem:'agroaudit_lista',
nome:nome,empresa:emp,whatsapp:wpp,email:mail,
estado:estado,porte_faturamento:porte,
servico_interesse:tipo||'a definir'
}).then(function(res){
aaSending=false;btn.disabled=false;btn.textContent=textoOriginal;
if(res&&res.id_lead){window.CM.enviarEventoDeScore(res.id_lead,'solicitou_contato');}
// Mostra a confirmação (com o caminho de WhatsApp) mesmo se o backend
// falhar — é a rede de segurança original: o lead ainda pode se
// confirmar manualmente, e o console já registrou o problema.
mostrarConfirmacao();
});
});}
// --- cabeçalho recolhe ao descer no celular
(function(){var h=document.querySelector('header.site');if(!h)return;var ult=0;
window.addEventListener('scroll',function(){
if(window.innerWidth>700){h.classList.remove('recolhido');return;}
var y=window.pageYOffset||document.documentElement.scrollTop;
h.classList.toggle('recolhido',y>240&&y>ult+4);
ult=y;},{passive:true});})();
})();
