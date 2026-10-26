/* Flosswork shared behaviour. Reads window.FW from config.js. No dependencies.
   The markup builders at the top also run in Node (tools/build-site.js) to pre-render doctors, tiles and
   services into the static HTML; in the browser those containers are only filled when still empty. */
(function () {
  'use strict';
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var inr = function (n) { return '₹' + Number(n).toLocaleString('en-IN'); };

  function builders(FW) {
    var needBy = function (k) { return FW.needs.filter(function (n) { return n.key === k; })[0] || FW.needs[0]; };
    return {
      doctors: function () {
        return FW.doctors.filter(function (d) { return d.active; }).map(function (d) {
          var av = d.photo ? '<img src="' + esc(d.photo) + '" alt="' + esc(d.name) + '" loading="lazy" decoding="async">' : esc(d.initials);
          return '<article class="d"><div class="av">' + av + '</div><div><h3>' + esc(d.name) + '</h3><small class="q">' + esc(d.qual) + '</small><small>' + esc(d.role) + '</small>' +
            '<div class="tags">' + d.tags.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div></div></article>';
        }).join('');
      },
      tiles: function () {
        return FW.tiles.map(function (t) {
          var need = needBy(t.key);
          return '<article class="t"><div><div class="ic" aria-hidden="true">' + t.icon + '</div><h3 style="margin-top:18px">' + esc(t.name) + '</h3><small>' + esc(t.blurb) + '</small></div>' +
            '<div class="pr"><button type="button" data-need="' + esc(t.key) + '">' + (need.price ? 'From ' + inr(need.price) : 'Get a quote') + ' →</button><a href="' + esc(t.href) + '">Learn more</a></div></article>';
        }).join('');
      },
      trust: function () {
        return FW.trust.map(function (t) {
          return t.rating
            ? '<div class="rate"><b><span data-rating>' + esc(FW.clinic.rating) + '</span><i aria-hidden="true">★</i></b><span><span data-reviews>' + esc(FW.clinic.reviewCount) + '</span>+ Google reviews</span></div>'
            : '<div><b>' + esc(t.value) + '</b><span>' + esc(t.label) + '</span></div>';
        }).join('');
      },
      services: function () {
        return FW.services.map(function (g) {
          return '<div class="svg" id="' + g.id + '"><h2>' + esc(g.title) + '</h2><p class="lead">' + esc(g.lead) + '</p><div class="sc">' +
            g.items.map(function (s) {
              var im = s.img ? '<div class="im"><img src="images/' + esc(s.img) + '" width="1200" height="896" alt="' + esc(s.name) + '" loading="lazy" decoding="async"></div>' : '<div class="im ph"><span>Image to add</span></div>';
              var key = needBy(s.id).key === s.id ? s.id : 'other';
              return '<article class="card" id="' + s.id + '">' + im + '<div class="tx"><h3>' + esc(s.name) + '</h3><p>' + esc(s.desc) + '</p><div class="act"><button type="button" data-need="' + key + '" data-item="' + esc(s.name) + '">Get a quote</button>' +
                (s.href ? '<a href="' + esc(s.href) + '">Learn more</a>' : '') + '</div></div></article>';
            }).join('') + '</div></div>';
        }).join('');
      }
    };
  }
  if (typeof window === 'undefined') { module.exports = builders; return; }

  var FW = window.FW, C = FW.clinic, B = builders(FW);
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var needBy = function (k) { return FW.needs.filter(function (n) { return n.key === k; })[0] || FW.needs[0]; };

  /* ---------- analytics: GTM (preferred) or direct GA4. Everything below pushes to dataLayer. ---------- */
  var dl = window.dataLayer = window.dataLayer || [];
  var track = function (e, d) { dl.push(Object.assign({ event: e }, d || {})); };
  /* GA4 recommended conversion event; mark generate_lead as a key event in GA4. */
  var lead = function (method, d) { track('generate_lead', Object.assign({ method: method, page_path: location.pathname }, d || {})); };
  (function loadAnalytics(a) {
    var id = a && (a.gtmId || a.ga4Id); if (!id) return;
    var s = document.createElement('script'); s.async = true;
    if (a.gtmId) { dl.push({ 'gtm.start': Date.now(), event: 'gtm.js' }); s.src = 'https://www.googletagmanager.com/gtm.js?id=' + a.gtmId; }
    else { window.gtag = function () { dl.push(arguments); }; window.gtag('js', new Date()); window.gtag('config', a.ga4Id); s.src = 'https://www.googletagmanager.com/gtag/js?id=' + a.ga4Id; }
    document.head.appendChild(s);
  })(FW.analytics);

  var st;
  function resetState() { st = { need: document.body.getAttribute('data-page-need') || 'other', when: FW.when[1], name: '', phone: '' }; }
  resetState();

  function waLink(text) { return 'https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent(text); }
  function cleanPhone(v) { var d = String(v).replace(/\D/g, ''); if (d.length === 12 && d.indexOf('91') === 0) d = d.slice(2); if (d.length === 11 && d[0] === '0') d = d.slice(1); return d; }
  var isUrgent = function () { return needBy(st.need).mode === 'emergency'; };
  function openWA(text) { window.open(waLink(text), '_blank', 'noopener'); }
  function lc(s) { return String(s).toLowerCase(); }
  function pageNeed() { return document.body.getAttribute('data-page-need') || ''; }
  function bookText(key) {
    key = key || pageNeed();
    if (!key) return "Hi Flosswork, I'd like to book a consultation.";
    var n = needBy(key);
    if (n.mode === 'emergency') return 'Hi, I have a dental emergency and need urgent help.';
    return "Hi Flosswork, I'd like to book a consultation for " + lc(n.label) + '.';
  }
  function quoteText(key) { return "Hi Flosswork, I'd like a quote for " + lc(needBy(key).label) + '.'; }
  function waText() {
    if (isUrgent()) return 'Hi, I have a dental emergency and need urgent help.';
    return "Hi Flosswork, I'd like to book a consultation for " + lc(needBy(st.need).label) + ' (' + lc(st.when) + ').';
  }

  /* ---------- motion helpers ---------- */
  var reduceMQ = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var calm = function () { return reduceMQ.matches; };
  var restart = function (el, cls) { if (calm() || !el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };

  var io;
  function show(el) {
    el.classList.add('in');
    el.addEventListener('animationend', function done(ev) {
      if (ev.target !== el) return;
      el.removeEventListener('animationend', done);
      el.classList.remove('rv', 'in'); el.style.removeProperty('--i');
    });
    if (el.matches('.data')) countUp(el);
  }
  function arm(el, i) {
    if (el.dataset.mo) return;
    el.dataset.mo = '1'; el.classList.add('rv'); el.style.setProperty('--i', Math.min(i, 5)); io.observe(el);
  }
  function countUp(box) {
    $$('b', box).forEach(function (b) {
      var m = /^([\d,]+)(\+?)$/.exec(b.textContent.trim()); if (!m) return;
      var end = parseInt(m[1].replace(/,/g, ''), 10), t0 = null;
      (function tick(t) {
        t0 = t0 || t;
        var k = Math.min((t - t0) / 1100, 1), v = Math.round(end * (1 - Math.pow(1 - k, 3)));
        b.textContent = v.toLocaleString('en-IN') + m[2];
        if (k < 1) requestAnimationFrame(tick);
      })(performance.now());
    });
  }
  /* Scroll reveal. Cards in a horizontal carousel reveal together with their row, since off-screen ones never intersect. */
  function motionInit() {
    if (calm() || !('IntersectionObserver' in window)) return;
    io = io || new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var kids = e.target._kids || [e.target];
        if (!e.isIntersecting && e.boundingClientRect.bottom < 0) {
          io.unobserve(e.target); kids.forEach(function (k) { k.classList.remove('rv'); k.style.removeProperty('--i'); }); return; /* already scrolled past: no animation */
        }
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        kids.forEach(show);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.sec:not(.band) h2,.sec:not(.band) .sub,.svg .lead,.band .txt,.band .pic,.price,.cmp,.data,.form,.clinic').forEach(function (el) { arm(el, 0); });
    $$('.tr,.why,.dr,.steps,.sc,.cases,.gal,.eq,.taps,.locs,.faq,.brands,.chips,.partners').forEach(function (g) {
      var kids = Array.prototype.slice.call(g.children).filter(function (k) { return !k.dataset.mo; });
      if (!kids.length) return;
      if (g.scrollWidth > g.clientWidth + 2) {
        g._kids = kids; kids.forEach(function (k, i) { k.dataset.mo = '1'; k.classList.add('rv'); k.style.setProperty('--i', Math.min(i, 5)); });
        io.observe(g);
      } else {
        var cols = kids.filter(function (k) { return k.offsetTop === kids[0].offsetTop; }).length || 1;
        kids.forEach(function (k, i) { arm(k, i % cols); });
      }
    });
  }

  /* Sliding highlight behind the selected pill. */
  var pillRO = window.ResizeObserver ? new ResizeObserver(function (es) { es.forEach(function (e) { glide(e.target); }); }) : null;
  function glide(g) {
    var b = g.querySelector('[aria-pressed=true]'), ind = g.querySelector('.pl-ind');
    if (!ind) { ind = document.createElement('span'); ind.className = 'pl-ind'; ind.setAttribute('aria-hidden', 'true'); g.insertBefore(ind, g.firstChild); }
    if (!b || !b.offsetWidth) return;
    ind.style.width = b.offsetWidth + 'px'; ind.style.height = b.offsetHeight + 'px';
    ind.style.translate = b.offsetLeft + 'px ' + b.offsetTop + 'px';
    if (!g.classList.contains('g')) { g.classList.add('g'); requestAnimationFrame(function () { requestAnimationFrame(function () { g.classList.add('rdy'); }); }); }
  }
  function glideAll() { $$('.pl').forEach(function (g) { if (pillRO && !g._ro) { g._ro = 1; pillRO.observe(g); } glide(g); }); }

  /* ---------- shared state -> planner + form ---------- */
  var painted = false;
  function paint() {
    var n = needBy(st.need), urgent = isUrgent();
    if ($('#s-need')) {
      $('#s-need').value = st.need; $('#s-when').value = st.when;
      $('#fld-when').hidden = urgent; $('#to-form').hidden = urgent;
      var res = $('#res');
      res.hidden = false; res.classList.toggle('urgent', urgent); res.classList.toggle('ok', !urgent);
      if (urgent) {
        res.innerHTML = '<span>In pain?</span><b>We’ll find you the earliest slot.</b><span>Call us now, or message us on WhatsApp and we’ll reply as soon as we can.</span>' +
          '<div class="acts"><a class="btn btn--call" href="tel:' + C.phoneRaw + '">Call now</a><a class="btn btn--wa" target="_blank" rel="noopener" href="' + waLink(waText()) + '">WhatsApp urgently</a></div>';
      } else {
        var priced = n.price;
        res.innerHTML = '<span>' + (priced ? 'Treatment starts from' : 'Your quote') + '</span><b>' + (priced ? inr(n.price) : 'Get a quote') + '</b><span>' +
          (priced ? 'Exact cost in writing after your exam.' : 'Your doctor gives you the cost in writing after your exam.') + '</span>';
      }
    }
    if ($('#res') && painted) restart($('#res'), 'bump');
    painted = true;
    if ($('#form')) {
      $$('#p-need button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.v === st.need); });
      $('#send').textContent = urgent ? 'Send urgent message on WhatsApp' : 'Send on WhatsApp';
      $('#sum').textContent = urgent ? 'Tooth pain / emergency · earliest slot' : n.label;
    }
    glideAll();
  }

  function sendLead() {
    if (!FW.leadEndpoint) return;
    var body = JSON.stringify({ name: st.name.trim(), phone: cleanPhone(st.phone), need: needBy(st.need).label, when: isUrgent() ? 'Emergency' : st.when, page: location.pathname, at: new Date().toISOString() });
    try { fetch(FW.leadEndpoint, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: body, keepalive: true }); } catch (e) { /* WhatsApp still opens */ }
  }

  function goPlan(key) {
    if (key) st.need = key;
    paint();
    var target = $('#plan') || $('#book');
    target.scrollIntoView({ behavior: calm() ? 'auto' : 'smooth', block: 'center' });
    setTimeout(function () { restart($('#plan') || $('#form'), 'pulse'); }, 350);
    if (!$('#plan')) setTimeout(function () { var f = $('#f-name'); if (f) f.focus({ preventScroll: true }); }, 500);
  }
  function goForm() {
    paint();
    if ($('#done')) { $('#done').hidden = true; $('#form-body').hidden = false; }
    $('#book').scrollIntoView({ behavior: calm() ? 'auto' : 'smooth', block: 'center' });
    setTimeout(function () { restart($('#form'), 'pulse'); }, 350);
    setTimeout(function () { var f = $('#f-name'); if (f) f.focus({ preventScroll: true }); }, 500);
  }

  /* ---------- renderers ---------- */
  function ph(label, extra) { return '<div class="ph ' + (extra || '') + '"><span>' + esc(label) + '</span></div>'; }

  function renderAll() {
    /* pre-rendered by tools/build-site.js; only fill when empty (e.g. config edited without a rebuild) */
    [['doctors', B.doctors], ['tiles', B.tiles], ['services', B.services], ['trust', B.trust]].forEach(function (p) {
      $$('[data-' + p[0] + ']').forEach(function (n) { if (!n.firstElementChild) n.innerHTML = p[1](); });
    });
    $$('[data-more]').forEach(function (n) { n.innerHTML = FW.moreTreatments.map(function (t) { return '<button type="button" data-need="other">' + esc(t) + '</button>'; }).join(''); });
    $$('[data-equipment]').forEach(function (n) { n.innerHTML = FW.equipment.map(function (e) { return '<span>' + esc(e) + '</span>'; }).join(''); });
    $$('[data-cases]').forEach(function (n) {
      n.innerHTML = FW.cases.map(function (c, i) {
        var has = c.before && c.after;
        var inner = has ? '<img src="' + esc(c.after) + '" alt="' + esc(c.title) + ' after"><div class="top"><img src="' + esc(c.before) + '" alt="' + esc(c.title) + ' before"></div>'
          : '<div class="ph" style="border-radius:0"><span>Case ' + (i + 1) + ' · After<br>photo to add</span></div><div class="top"><div class="ph second" style="position:absolute;inset:0;clip-path:none;border-radius:0"><span>Case ' + (i + 1) + ' · Before<br>photo to add</span></div></div>';
        return '<article class="case"><div class="ba" data-ba>' + inner + '<div class="bar"></div><span class="lbl b">Before</span><span class="lbl a">After</span>' +
          '<input type="range" min="0" max="100" value="50" aria-label="Compare before and after, ' + esc(c.title) + '"></div><div class="cap"><b>' + esc(c.title) + '</b><span>' + c.months + ' months</span></div></article>';
      }).join('');
      $$('[data-ba]', n).forEach(function (ba) {
        var top = $('.top', ba), bar = $('.bar', ba), rng = $('input', ba), touched = false;
        function set(v) { rng.value = v; top.style.clipPath = 'inset(0 ' + (100 - v) + '% 0 0)'; bar.style.left = v + '%'; }
        rng.addEventListener('input', function () { set(rng.value); track('gallery_interact'); });
        ['pointerdown', 'keydown'].forEach(function (ev) { ba.addEventListener(ev, function () { touched = true; }); });
        /* once, the first time it is on screen: nudge the handle left and right so people see it can be dragged */
        if (!calm() && 'IntersectionObserver' in window) {
          var seen = new IntersectionObserver(function (es) {
            if (!es[0].isIntersecting) return;
            seen.disconnect();
            setTimeout(function () {
              var t0 = null;
              (function step(t) {
                if (touched) return;
                t0 = t0 || t; var k = Math.min((t - t0) / 1300, 1);
                set(Math.round(50 - 16 * Math.sin(2 * Math.PI * k)));
                if (k < 1) requestAnimationFrame(step); else set(50);
              })(performance.now());
            }, 300);
          }, { threshold: 0.7 });
          seen.observe(ba);
        }
      });
    });
    $$('[data-rating]').forEach(function (n) { n.textContent = C.rating; });
    $$('[data-reviews]').forEach(function (n) { n.textContent = C.reviewCount; });
    $$('[data-hours]').forEach(function (n) { n.textContent = C.hoursLong; });
    $$('[data-call]').forEach(function (n) { n.href = 'tel:' + C.phoneRaw; });
    $$('[data-phone]').forEach(function (n) { n.textContent = C.phone; n.href = 'tel:' + C.phoneRaw; });
    $$('a[data-book]').forEach(function (n) { n.href = waLink(bookText(n.getAttribute('data-book'))); n.target = '_blank'; n.rel = 'noopener'; });
    $$('[data-tel]').forEach(function (n) { n.href = 'tel:' + C.phoneRaw; });
    $$('[data-wa]').forEach(function (n) { n.href = waLink(n.getAttribute('data-wa')); n.target = '_blank'; n.rel = 'noopener'; });
    $$('[data-gmb]').forEach(function (n) { n.href = C.googleReviews; n.target = '_blank'; n.rel = 'noopener'; });
  }

  function fillOptions() {
    if ($('#s-need')) {
      $('#s-need').innerHTML = FW.needs.map(function (n) { return '<option value="' + n.key + '">' + esc(n.label) + '</option>'; }).join('');
      $('#s-when').innerHTML = FW.when.map(function (w) { return '<option>' + esc(w) + '</option>'; }).join('');
      $('#s-need').addEventListener('change', function (e) { st.need = e.target.value; paint(); });
      $('#s-when').addEventListener('change', function (e) { st.when = e.target.value; paint(); });
      $('#to-form').addEventListener('click', function () { track('plan_continue', { need: st.need }); lead('plan_your_visit', { need: st.need }); openWA(waText()); });
    }
    if ($('#form')) {
      $('#p-need').innerHTML = FW.needs.map(function (n) { return '<button type="button" data-v="' + n.key + '" aria-pressed="false">' + esc(n.pill) + '</button>'; }).join('');
      $('#p-need').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; st.need = b.dataset.v; paint(); });
      $('#form').addEventListener('submit', function (e) {
        e.preventDefault();
        var url = waLink(bookText(st.need));
        sendLead(); track('book_submit', { need: st.need }); lead('booking_form', { need: st.need });
        window.open(url, '_blank', 'noopener');
        $('#done-link').href = url; $('#form-body').hidden = true; $('#done').hidden = false;
      });
      $('#again').addEventListener('click', function () { $('#done').hidden = true; $('#form-body').hidden = false; });
    }
    if ($('#cb-form')) {
      var cbTime = 'Any time';
      var cbn = $('#cb-name'), cbf = cbn.parentNode, cbl = $('label[for=cb-name]'), cbr = $('#cb-reason');
      cbf.classList.add('fl'); cbl.classList.remove('sr'); cbn.placeholder = ' ';
      var rf = cbr.parentNode, rl = $('label[for=cb-reason]'); rf.classList.add('fl', 'up'); rl.classList.remove('sr');
      var syncName = function () {
        cbf.classList.toggle('has', cbn.value.length > 0);
        var ok = cbn.value.trim().length >= 2; cbf.classList.toggle('ok', ok);
        if (ok && cbn.getAttribute('aria-invalid') === 'true') { cbn.setAttribute('aria-invalid', 'false'); $('#cb-e-name').textContent = ''; }
      };
      cbn.addEventListener('input', syncName); syncName();
      $('#cb-time').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; cbTime = b.dataset.v; $$('#cb-time button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); glideAll(); });
      $('#cb-form').addEventListener('submit', function (e) {
        e.preventDefault();
        var nm = $('#cb-name'), name = nm.value.trim(), e1 = name.length < 2;
        nm.setAttribute('aria-invalid', e1); nm.parentNode.classList.toggle('ok', !e1);
        $('#cb-e-name').textContent = e1 ? 'Please enter your name.' : '';
        if (e1) { nm.focus(); restart(nm, 'shake'); return; }
        var lines = ['Hi Flosswork, please call me back.', 'Name: ' + name, 'Reason: ' + lc($('#cb-reason').value)];
        if (cbTime !== 'Any time') lines.push('Best time: ' + lc(cbTime));
        track('callback_submit'); lead('callback_form');
        openWA(lines.join('\n'));
        $('#cb-body').hidden = true; $('#cb-done').hidden = false;
      });
    }
  }

  /* Per-page setup: runs on load, and again whenever the page content is swapped (preview shell). */
  function initPage() {
    resetState(); renderAll(); fillOptions(); painted = false; paint();
    $$('.done').forEach(function (d) {
      if (!d.querySelector('.ok-ic')) d.insertAdjacentHTML('afterbegin', '<svg class="ok-ic" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24"/><path d="M15 27l8 8 14-16"/></svg>');
    });
    solidNav = document.body.getAttribute('data-nav') === 'solid' || !!$('.shero');
    onScroll(); motionInit();
  }
  window.FW_initPage = initPage;

  var nav, drawer, mb;
  var prog, ticking = false, solidNav = false, lastY = 0;
  function onScroll() {
    if (nav) nav.classList.toggle('solid', solidNav || window.scrollY > 40);
    if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; trackScroll(); }); }
  }
  /* reading-progress line under the header */
  function trackScroll() {
    var bar = $('#bar'), y = window.scrollY;
    if (bar && !calm()) { /* mobile Call bar tucks away while reading down, returns on scroll up */
      if (y > lastY + 8 && y > 240) bar.classList.add('away'); else if (y < lastY - 8 || y < 240) bar.classList.remove('away');
    }
    lastY = y;
    if (prog) {
      var max = document.documentElement.scrollHeight - window.innerHeight, p = max > window.innerHeight * 0.5 ? Math.min(window.scrollY / max, 1) : 0;
      prog.style.setProperty('--p', p.toFixed(4)); prog.classList.toggle('on', p > 0.005);
    }
  }
  function closeDrawer(focusBack) {
    if (!drawer) return;
    var wasOpen = drawer.classList.contains('open');
    mb.setAttribute('aria-expanded', 'false'); document.body.style.overflow = '';
    if (!wasOpen) return;
    var done = function () { if (!calm() && !drawer.classList.contains('closing')) return; drawer.classList.remove('open', 'closing'); };
    if (calm()) done(); else { drawer.classList.add('closing'); setTimeout(done, 200); }
    if (focusBack === true) mb.focus();
  }
  window.FW_closeDrawer = closeDrawer;

  /* One-time setup: header, drawer and document-level handlers. */
  function init() {
    nav = $('#nav'); drawer = $('#drawer'); mb = $('#menu-btn');
    prog = document.createElement('div'); prog.className = 'progress'; prog.setAttribute('aria-hidden', 'true'); nav.appendChild(prog);
    $('#close-menu').innerHTML = '<span></span>';
    window.addEventListener('resize', onScroll, { passive: true });
    document.addEventListener('click', function (e) {
      var l = e.target.closest('a[href]');
      if (l) {
        var h = l.getAttribute('href');
        if (h.indexOf('tel:') === 0) { track('click_to_call', { phone: h.slice(4) }); lead('phone'); }
        else if (h.indexOf('https://wa.me/') === 0 && !l.hasAttribute('data-book')) { track('whatsapp_click', { link_text: l.textContent.trim().slice(0, 60) }); if (l.id !== 'done-link') lead('whatsapp_link'); }
        else if (h.indexOf('maps.google.com') > -1) track('directions_click', { link_url: h });
      }
      var b = e.target.closest('[data-book]'); if (b) { e.preventDefault(); closeDrawer(); track('book_click'); lead('book_button', { need: b.getAttribute('data-book') || undefined }); openWA(bookText(b.getAttribute('data-book'))); return; }
      var n = e.target.closest('[data-need]'); if (n) {
        e.preventDefault(); track('need_click', { need: n.getAttribute('data-need') }); lead('quote_button', { need: n.getAttribute('data-need') });
        openWA(lc(n.textContent.trim()) === 'others' && n.closest('[data-more]') ? "Hi Flosswork, I have a dental concern that isn't listed and would like to talk to a doctor." : n.getAttribute('data-item') ? "Hi Flosswork, I'd like a quote for " + lc(n.getAttribute('data-item')) + '.' : n.closest('[data-more]') ? "Hi Flosswork, I'd like to know more about " + lc(n.textContent.trim()) + '.' : quoteText(n.getAttribute('data-need'))); }
    });
    document.addEventListener('keydown', function (e) {
      if (!drawer.classList.contains('open')) return;
      if (e.key === 'Escape') { closeDrawer(true); return; }
      if (e.key !== 'Tab') return;
      var f = $$('a[href],button', drawer), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    window.addEventListener('scroll', onScroll, { passive: true });
    mb.addEventListener('click', function () { drawer.classList.remove('closing'); drawer.classList.add('open'); mb.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; $('#close-menu').focus(); });
    $('#close-menu').addEventListener('click', function () { closeDrawer(true); });
    $$('#drawer a.l').forEach(function (x) { x.addEventListener('click', closeDrawer); });
    initPage();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
