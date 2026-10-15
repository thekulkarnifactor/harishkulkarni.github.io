// harishkulkarni.in — interactions (no dependencies)
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // footer year
  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  // 1. rolling hero word
  var roller = $('#roller');
  if (roller && !reduce) {
    var wi = 0, wn = roller.children.length;
    setInterval(function () {
      wi = (wi + 1) % wn;
      roller.style.transform = 'translateY(-' + (wi * 1.12) + 'em)';
    }, 2200);
  }

  // 2. live pipeline log
  var logEl = $('#logLines');
  var pool = [
    ['INGEST', '#7FB8FF', 'bronze ← sharepoint/sales_2026.xlsx'],
    ['MERGE ', 'var(--ac)', 'silver.customers  +1,284 rows upserted'],
    ['QA    ', 'var(--ac)', 'keys ✓ dupes 0 ✓ recon 100% ✓'],
    ['MODEL ', '#F0B860', 'churn_v3 retrained · auc 0.91'],
    ['GOLD  ', 'var(--ac)', 'gold.revenue_daily refreshed'],
    ['BI    ', '#7FB8FF', 'Direct Lake model synced'],
    ['DEPLOY', '#F0B860', 'web app v1.4 → prod'],
    ['BOT   ', 'var(--ac)', 'invoices.pdf → 212 rows in 2.9s']
  ];
  var logN = 0;
  function pushLog() {
    if (!logEl) return;
    var e = pool[logN % pool.length];
    var now = new Date();
    var t = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');
    var row = document.createElement('div');
    row.className = 'log-line';
    row.innerHTML = '<span class="t"></span><span class="k"></span><span class="m"></span>';
    row.children[0].textContent = t;
    row.children[1].textContent = e[0];
    row.children[1].style.color = e[1];
    row.children[2].textContent = e[2];
    logEl.appendChild(row);
    while (logEl.children.length > 6) logEl.removeChild(logEl.firstChild);
    logN++;
  }
  for (var i = 0; i < 3; i++) pushLog();
  if (!reduce) setInterval(pushLog, 1100); else for (var j = 0; j < 3; j++) pushLog();

  // 3. flow stages run in sequence
  var stages = $$('#stages .stage');
  var stageLabel = $('#stageLabel');
  var si = 0;
  function setStage(n) {
    stages.forEach(function (el, k) {
      el.classList.toggle('is-on', k === n);
      el.classList.toggle('is-done', k < n);
      var st = $('.st', el);
      if (st) st.textContent = k === n ? '● running' : (k < n ? '✓ done' : '○ queued');
    });
    if (stageLabel) stageLabel.textContent = 'STAGE 0' + (n + 1) + ' / 04 RUNNING';
  }
  if (stages.length) {
    setStage(0);
    if (!reduce) setInterval(function () { si = (si + 1) % stages.length; setStage(si); }, 1800);
  }

  // 4. stats count up when scrolled into view
  var statEls = $$('.stat');
  function fmt(el, v) {
    var f = el.getAttribute('data-fmt');
    if (f === 'neg-pct') return '−' + v + '%';
    if (f === 'plus') return v + '+';
    if (f === 'sec') return v + 's';
    return String(v);
  }
  function runCount() {
    var start = performance.now(), dur = 1800;
    function tick(now) {
      var p = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - p, 3);
      statEls.forEach(function (el) {
        var to = +el.getAttribute('data-to');
        var from = el.hasAttribute('data-from') ? +el.getAttribute('data-from') : 0;
        el.textContent = fmt(el, Math.round(from + (to - from) * e));
      });
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var statsBox = $('#stats');
  if (statsBox && !reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { runCount(); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(statsBox);
  }

  // 5. expanding work panels
  var panels = $$('#panels .panel');
  function openPanel(p) {
    panels.forEach(function (x) {
      var on = x === p;
      x.classList.toggle('is-open', on);
      x.setAttribute('aria-expanded', on ? 'true' : 'false');
    });
  }
  panels.forEach(function (p) {
    p.addEventListener('click', function () { openPanel(p); });
    p.addEventListener('mouseenter', function () { if (window.matchMedia('(hover: hover)').matches) openPanel(p); });
  });

  // 6. project filters
  var chips = $$('#filters .chip');
  var cards = $$('#cards .card');
  chips.forEach(function (c) {
    var f = c.getAttribute('data-f');
    var n = f === 'All' ? cards.length : cards.filter(function (k) { return k.getAttribute('data-cat') === f; }).length;
    var span = $('span', c); if (span) span.textContent = n;
    c.setAttribute('aria-pressed', c.classList.contains('is-on') ? 'true' : 'false');
    c.addEventListener('click', function () {
      chips.forEach(function (x) { x.classList.toggle('is-on', x === c); x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); });
      var shown = 0;
      cards.forEach(function (k) {
        var show = f === 'All' || k.getAttribute('data-cat') === f;
        k.hidden = !show;
        k.classList.remove('is-in');
        if (show) {
          void k.offsetWidth; // restart animation
          k.style.animationDelay = (shown * 0.06) + 's';
          k.classList.add('is-in');
          shown++;
        }
      });
    });
  });

  // 7. crew cards flip on tap (touch screens)
  $$('.flip').forEach(function (f) {
    f.addEventListener('click', function () { f.classList.toggle('is-flipped'); });
  });

  // 8. "Got data? Let's ship." marquee
  var ship = $('#shipTrack');
  if (ship) {
    var html = '';
    for (var s = 0; s < 4; s++) html += '<span class="o">Got data?</span><span class="f">Let’s ship.</span>';
    ship.innerHTML = html;
  }
})();
