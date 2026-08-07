// Google Analytics 4 — Consultoria Mendonça (Controller do Agro)
// ID de métricas: G-GQLS60YM9Y
// Centralizado aqui para facilitar manutenção (ex.: eventos personalizados).
(function () {
  var GA_ID = 'G-GQLS60YM9Y';

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_ID);
})();
