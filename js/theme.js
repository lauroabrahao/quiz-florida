(function () {
  var root = document.documentElement, KEY = 'realize-tema';
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function apply(t) { if (t === 'light') root.setAttribute('data-theme', 'light'); else root.removeAttribute('data-theme'); }
  apply(get() || window.DEFAULT_THEME);
  var host = document.querySelector('.top .wrap') || document.querySelector('.qhead .row');
  if (!host) return;
  var b = document.createElement('button');
  b.type = 'button'; b.className = 'theme'; b.setAttribute('aria-label', 'Alternar tema claro/escuro');
  b.innerHTML = '<svg class="moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg><svg class="sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  b.onclick = function () {
    var light = root.getAttribute('data-theme') === 'light';
    apply(light ? 'dark' : 'light'); set(light ? 'dark' : 'light');
  };
  var second = host.children[1];
  host.insertBefore(b, second || null);
})();
