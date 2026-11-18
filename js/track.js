(function () {
  var C = window.FUNIL || {};

  // Meta Pixel: só carrega se houver ID e se a pessoa não tiver rejeitado os cookies
  var consent = null;
  try { consent = localStorage.getItem('realize-cookies'); } catch (e) {}
  window.startPixel = function () {
    if (!C.PIXEL_ID || window.fbq) return;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', C.PIXEL_ID);
    fbq('track', 'PageView');
  };
  if (consent !== 'rejeitado') window.startPixel();

  // Variante do teste A/B (definida em <body data-variant>)
  var variant = document.body.getAttribute('data-variant');
  if (variant) { try { localStorage.setItem('realize-variante', variant); } catch (e) {} }
  window.VARIANTE = variant || (function () { try { return localStorage.getItem('realize-variante'); } catch (e) { return null; } })() || 'a';
  if (variant && window.fbq) fbq('trackCustom', 'VarianteVista', { variante: variant });

  window.track = function (name, data, custom) {
    if (!window.fbq) return;
    fbq(custom ? 'trackCustom' : 'track', name, data || {});
  };

  window.waLink = function (text) {
    var n = (C.WHATSAPP || '').replace(/\D/g, '');
    return 'https://wa.me/' + n + (text ? '?text=' + encodeURIComponent(text) : '');
  };

  // Mensagem do WhatsApp: simples, só com a referência de onde veio (LP ou QUIZ)
  var REF = document.body.getAttribute('data-ref') || 'LP';
  function origem() {
    var q = new URLSearchParams(location.search), o = [];
    if (q.get('utm_source')) o.push(q.get('utm_source'));
    if (q.get('utm_campaign')) o.push(q.get('utm_campaign'));
    if (q.get('utm_content')) o.push(q.get('utm_content'));
    return o.join(' / ');
  }
  function mensagem(motivo) {
    var m = 'Olá! Quero agendar a minha consultoria estratégica sem custos.';
    if (motivo) m += ' Meu principal motivo: ' + motivo + '.';
    m += '\n\n[' + REF + (origem() ? ' | ' + origem() : '') + ']';
    return m;
  }
  window.waMensagem = mensagem;

  // Botões que levam ao WhatsApp
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    var motivo = a.getAttribute('data-motivo');
    a.href = waLink(mensagem(motivo, a.getAttribute('data-cta')));
    a.target = '_blank'; a.rel = 'noopener';
    a.addEventListener('click', function () { track('Contact', { content_name: 'whatsapp_direto', motivo: motivo || '', local: a.getAttribute('data-cta') || '' }); });
  });
  // Ícone de WhatsApp do rodapé
  document.querySelectorAll('.foot2-soc[aria-label="WhatsApp"]').forEach(function (a) {
    a.href = waLink(mensagem('', 'rodape'));
    a.addEventListener('click', function () { track('Contact', { content_name: 'whatsapp_rodape' }); });
  });
  document.querySelectorAll('[data-cta]').forEach(function (a) {
    a.addEventListener('click', function () { track('CliqueAgendar', { local: a.getAttribute('data-cta') }, true); });
  });
  document.querySelectorAll('[data-reviews]').forEach(function (a) { a.href = C.GOOGLE_REVIEWS_URL || '#'; });
})();
