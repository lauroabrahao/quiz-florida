(function () {
  var KEY = 'realize-cookies';
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  // ---------- Janela das páginas legais ----------
  var modal = document.getElementById('legal');
  var body = document.getElementById('legal-body');
  var closeBtn = document.getElementById('legal-close');
  var lastFocus = null;

  function openLegal(name) {
    var tpl = document.getElementById('tpl-' + name);
    if (!tpl || !modal) return;
    lastFocus = document.activeElement;
    body.innerHTML = '';
    body.appendChild(tpl.content.cloneNode(true));
    modal.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    modal.scrollTop = 0;
    var panel = modal.querySelector('.legal-panel');
    if (panel) panel.scrollTop = 0;
    if (closeBtn) closeBtn.focus();
  }
  function closeLegal() {
    if (!modal) return;
    modal.hidden = true;
    document.documentElement.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-legal]') : null;
    if (t) { e.preventDefault(); openLegal(t.getAttribute('data-legal')); return; }
    if (e.target === modal) closeLegal();
  });
  if (closeBtn) closeBtn.addEventListener('click', closeLegal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && !modal.hidden) closeLegal();
  });

  // ---------- Aviso de cookies ----------
  var bar = document.getElementById('cookie2');
  function hideBar() { if (bar) bar.hidden = true; }
  if (bar && !get()) bar.hidden = false;

  var accept = document.getElementById('cookie-accept');
  var reject = document.getElementById('cookie-reject');
  if (accept) accept.addEventListener('click', function () {
    set('aceito'); hideBar();
    if (window.startPixel) window.startPixel();
  });
  if (reject) reject.addEventListener('click', function () { set('rejeitado'); hideBar(); });
})();
