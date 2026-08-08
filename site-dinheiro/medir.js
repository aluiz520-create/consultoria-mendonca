/* ============================================================
   Medição — Para onde foi meu dinheiro?
   Um arquivo só, incluído por todas as páginas da pasta.
   Nada de dado financeiro é enviado: os eventos carregam apenas
   faixas e contagens, nunca os valores que a pessoa digitou.
   ============================================================ */
(function () {
  "use strict";

  /* Propriedade GA4 usada por enquanto: é a que o proprietário já possui.
     A pasta tem `content_group` próprio e vive sob /site-dinheiro/, então
     dá para isolar os dados por caminho de página em qualquer relatório.
     Quando existir uma propriedade dedicada a este site, troque só esta linha. */
  var ID_ANALYTICS = "G-GQLS60YM9Y";

  // Vazio desliga a medição inteira e não carrega script de terceiro nenhum.
  if (!ID_ANALYTICS) {
    window.medir = function () {};
    return;
  }

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + ID_ANALYTICS;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", ID_ANALYTICS, { content_group: "site-dinheiro" });

  window.medir = function (nome, params) {
    window.gtag("event", nome, params || {});
  };

  /* Profundidade de leitura: distingue quem bateu e saiu de quem leu.
     Sem isso não dá para saber se uma página de conteúdo está funcionando. */
  var marcos = [25, 50, 75, 100];
  var vistos = {};
  var pendente = false;

  function conferir() {
    pendente = false;
    var altura = document.documentElement.scrollHeight - window.innerHeight;
    if (altura <= 0) return;
    var pct = ((window.scrollY || window.pageYOffset) / altura) * 100;
    marcos.forEach(function (m) {
      if (pct >= m && !vistos[m]) {
        vistos[m] = true;
        window.medir("rolagem", { profundidade: m });
      }
    });
  }

  window.addEventListener("scroll", function () {
    if (pendente) return;
    pendente = true;
    window.requestAnimationFrame(conferir);
  }, { passive: true });
})();
