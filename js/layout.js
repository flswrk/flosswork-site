/* ============================================================
   FLOSSWORK™ — LAYOUT.JS  v1.0
   Single source of truth for all shared page components.

   COMPONENTS MANAGED HERE:
   ─ Navbar (desktop + mobile)
   ─ Final CTA section
   ─ Footer

   HOW TO ADD A NAV LINK:
     Add { href: 'page.html', label: 'Label' } to NAV_ITEMS.

   HOW TO CHANGE THE CTA:
     Edit the renderCTA() function.

   HOW TO SUPPRESS CTA ON A PAGE:
     Add data-cta="none" to that page's <main> element.

   LOAD ORDER (in each HTML file):
     1. <script src="js/content.js"></script>   ← defines window.FW
     2. <script src="js/layout.js"></script>    ← this file (sync, no defer)
     3. <script defer src="js/components.js">   ← behaviour only
   ============================================================ */

(function () {
  'use strict';

  /* ============================================================
     NAV ITEMS CONFIG
     ─────────────────────────────────────────────────────────────
     To add a page  → append { href: 'page.html', label: 'Label' }
     To rename      → change label
     To reorder     → move the object in the array
     To add a badge → add badge: 'New'  (renders as a pill)
     To hide        → set hidden: true
  ============================================================ */
  var NAV_ITEMS = [
    { href: 'index.html',    label: 'Home' },
    { href: 'aligners.html', label: 'Aligners' },
    { href: 'services.html', label: 'Services' },
    { href: 'about.html',    label: 'About' },
    { href: 'contact.html',  label: 'Contact' },
  ];

  /* ============================================================
     HELPERS — pull from FW config with safe fallbacks
  ============================================================ */
  function fw()      { return window.FW           || {}; }
  function clinic()  { return fw().clinic          || {}; }
  function addr()    { return fw().address         || {}; }
  function hrs()     { return fw().hours           || {}; }
  function soc()     { return fw().social          || {}; }

  function phoneRaw()     { return clinic().phone1raw  || '+918354088822'; }
  function phoneDisplay() { return clinic().phone1     || '+91 83540 88822'; }
  function waNumber()     { return clinic().whatsapp   || '918354088822'; }

  function waUrl(msgKey) {
    var msgs = fw().waMessages || {};
    var msg  = msgs[msgKey] || 'Hi, I\'d like to book a consultation at Flosswork Dental Clinic.';
    return 'https://wa.me/' + waNumber() + '?text=' + encodeURIComponent(msg);
  }

  /* ============================================================
     SVG ICON LIBRARY
     Add new icons here as needed.
  ============================================================ */
  var ICO = {
    phone: [
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"',
      ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">',
      '<path d="M5 4h3l2 5-2 1a11 11 0 006 6l1-2 5 2v3a2 2 0 01-2 2A17 17 0 013 6a2 2 0 012-2z"/>',
      '</svg>',
    ].join(''),

    arrow: [
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"',
      ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">',
      '<path d="M5 12h14M13 6l6 6-6 6"/>',
      '</svg>',
    ].join(''),

    menu: [
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"',
      ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">',
      '<path d="M4 7h16M4 12h16M4 17h16"/>',
      '</svg>',
    ].join(''),

    close: [
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"',
      ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">',
      '<path d="M6 6l12 12M6 18L18 6"/>',
      '</svg>',
    ].join(''),

    wa: [
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"',
      ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">',
      '<path d="M20 12a8 8 0 01-12.2 6.8L3 20l1.3-4.7A8 8 0 1120 12z"/>',
      '</svg>',
    ].join(''),

    tooth: [
      '<svg class="nav-logo-icon" width="26" height="26" viewBox="0 0 28 28" fill="none"',
      ' xmlns="http://www.w3.org/2000/svg" aria-hidden="true">',
      '<path d="M14 3C10 3 7 6 7 9.5C7 12 8.5 14 10 15.5C11 16.5 11.5 18 11.5 20C11.5 22.5',
      ' 12.5 25 14 25C15.5 25 16.5 22.5 16.5 20C16.5 18 17 16.5 18 15.5C19.5 14 21 12 21 9.5',
      'C21 6 18 3 14 3Z" fill="currentColor" opacity="0.15"/>',
      '<path d="M14 3C10 3 7 6 7 9.5C7 12 8.5 14 10 15.5C11 16.5 11.5 18 11.5 20C11.5 22.5',
      ' 12.5 25 14 25C15.5 25 16.5 22.5 16.5 20C16.5 18 17 16.5 18 15.5C19.5 14 21 12 21 9.5',
      'C21 6 18 3 14 3Z" stroke="currentColor" stroke-width="1.5" fill="none"/>',
      '</svg>',
    ].join(''),
  };

  /* ============================================================
     RENDER: DESKTOP HEADER
  ============================================================ */
  function renderHeader() {
    /* Build desktop + mobile nav links from NAV_ITEMS */
    var desktopLinks = NAV_ITEMS
      .filter(function (item) { return !item.hidden; })
      .map(function (item) {
        var badge = item.badge
          ? ' <span class="nav-badge">' + item.badge + '</span>'
          : '';
        return (
          '<a href="' + item.href + '" class="nav-link" data-page="' + item.href + '">' +
          item.label + badge +
          '</a>'
        );
      })
      .join('\n        ');

    return [
      '<div class="wrap nav-inner">',

      /* ── Logo ──
           Real logo image, once added at images/shared/flosswork-logo.png,
           displays automatically. Until then onerror swaps back to the
           SVG icon + wordmark below — no broken-image icon in the meantime. */
      '  <a href="index.html" class="nav-logo" aria-label="Flosswork Dental Clinic — Home">',
      '    <img src="images/shared/flosswork-logo.png" alt="Flosswork Dental Clinic" class="nav-logo-img"',
      '         onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">',
      '    <span class="nav-logo-fallback" style="display:none">' + ICO.tooth + '<span class="wordmark">Flosswork™ Dental Clinic</span></span>',
      '  </a>',

      /* ── Desktop links ── */
      '  <nav class="nav-links" aria-label="Main navigation">',
      '    ' + desktopLinks,
      '  </nav>',

      /* ── Desktop actions ── */
      '  <div class="nav-actions">',
      '    <a href="tel:' + phoneRaw() + '" class="btn btn--ghost btn--sm"',
      '       data-track="call_click" aria-label="Call Flosswork">',
      '      ' + ICO.phone,
      '      ' + phoneDisplay(),
      '    </a>',
      '    <a href="contact.html" class="btn btn--primary btn--sm" data-track="book_click">',
      '      Book Consultation',
      '    </a>',
      '  </div>',

      /* ── Hamburger (mobile) ── */
      '  <button id="nav-toggle" aria-expanded="false" aria-controls="nav-mobile"',
      '          aria-label="Open navigation menu">',
      '    ' + ICO.menu,
      '  </button>',

      '</div>',
    ].join('\n');
  }

  /* ============================================================
     RENDER: MOBILE DRAWER
  ============================================================ */
  function renderMobileMenu() {
    var mobileLinks = NAV_ITEMS
      .filter(function (item) { return !item.hidden; })
      .map(function (item) {
        return (
          '<a href="' + item.href + '" class="nav-link" data-page="' + item.href + '">' +
          item.label +
          '</a>'
        );
      })
      .join('\n      ');

    return [
      '<div class="nav-mobile-sheet">',

      '  <button class="nav-mobile-close" id="nav-mobile-close" aria-label="Close navigation">',
      '    ' + ICO.close,
      '  </button>',

      '  <nav class="nav-mobile-links" aria-label="Mobile navigation">',
      '    ' + mobileLinks,
      '  </nav>',

      '  <div class="nav-mobile-actions">',
      '    <a href="tel:' + phoneRaw() + '" class="btn btn--ghost" data-track="call_click">',
      '      ' + ICO.phone + ' ' + phoneDisplay(),
      '    </a>',
      '    <a href="contact.html" class="btn btn--primary" data-track="book_click">',
      '      Book Consultation',
      '    </a>',
      '  </div>',

      '</div>',
    ].join('\n');
  }

  /* ============================================================
     RENDER: FINAL CTA
     ─────────────────────────────────────────────────────────────
     One standard CTA injected into every page that has
     <div id="fw-cta-mount"></div>.

     To suppress on a specific page, add data-cta="none" to
     that page's <main id="main-content"> element.
  ============================================================ */
  function renderCTA() {
    return [
      '<section class="section section--ink" id="book" aria-labelledby="fw-cta-h2">',
      '  <div class="wrap">',
      '    <div class="fcta-grid">',

      /* Left: heading */
      '      <div>',
      '        <h2 id="fw-cta-h2" class="h2">',
      '          Ready for<br><em>your new smile?</em>',
      '        </h2>',
      '      </div>',

      /* Right: copy + CTAs + stats */
      '      <div>',
      '        <p class="fcta-body">',
      '          Take the first step towards a more confident smile.',
      '        </p>',

      '        <div class="fcta-ctas">',
      '          <a href="tel:' + phoneRaw() + '" class="btn btn--light" data-track="call_click">',
      '            ' + ICO.phone + ' Call Us',
      '          </a>',
      '          <a href="' + waUrl('booking') + '" class="btn btn--wa"',
      '             target="_blank" rel="noopener noreferrer" data-track="wa_click">',
      '            ' + ICO.wa + ' WhatsApp Us',
      '          </a>',
      '          <button class="btn btn--outline-light" data-callback="open" type="button">',
      '            Request a callback',
      '          </button>',
      '        </div>',

      '        <div class="fcta-stats">',
      '          <div>',
      '            <div class="fcta-stat-v">MDS</div>',
      '            <div class="fcta-stat-l">Specialists</div>',
      '          </div>',
      '          <div>',
      '            <div class="fcta-stat-v">Latest</div>',
      '            <div class="fcta-stat-l">Technology</div>',
      '          </div>',
      '          <div>',
      '            <div class="fcta-stat-v">Ai</div>',
      '            <div class="fcta-stat-l">Powered</div>',
      '          </div>',
      '        </div>',

      '      </div>',
      '    </div>',
      '  </div>',
      '</section>',
    ].join('\n');
  }

  /* ============================================================
     RENDER: FOOTER
  ============================================================ */
  function renderFooter() {
    var c = clinic();
    var a = addr();
    var h = hrs();
    var s = soc();
    var yr = new Date().getFullYear();

    return [
      '<footer class="site-footer" role="contentinfo">',
      '  <div class="wrap">',

      /* ── Top grid ── */
      '    <div class="footer-grid">',

      /* Brand */
      '      <div class="footer-brand">',
      '        <a href="index.html" class="footer-logo" aria-label="Flosswork Dental Clinic — Home">',
      '          <img src="images/shared/flosswork-logo.png" alt="Flosswork Dental Clinic" class="footer-logo-img"',
      '               onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'\'">',
      '          <span class="wordmark" style="display:none">flosswork<sup>™</sup></span>',
      '        </a>',
      '        <p>' + (c.tagline || 'Aligners & Implants Experience Centre') + '.</p>',
      '        <div class="footer-social">',
      '          <a href="' + (s.instagram || '#') + '" target="_blank" rel="noopener noreferrer"',
      '             aria-label="Flosswork on Instagram">IG</a>',
      '          <a href="' + (s.facebook  || '#') + '" target="_blank" rel="noopener noreferrer"',
      '             aria-label="Flosswork on Facebook">FB</a>',
      '          <a href="' + (s.google    || '#') + '" target="_blank" rel="noopener noreferrer"',
      '             aria-label="Flosswork on Google Reviews">G★</a>',
      '        </div>',
      '      </div>',

      /* Care column */
      '      <nav class="footer-col" aria-label="Treatments">',
      '        <h3 class="footer-col-heading">Care</h3>',
      '        <ul>',
      '          <li><a href="aligners.html">Clear Aligners</a></li>',
      '          <li><a href="services.html">All Services</a></li>',
      '        </ul>',
      '      </nav>',

      /* Clinic column */
      '      <nav class="footer-col" aria-label="About the clinic">',
      '        <h3 class="footer-col-heading">Clinic</h3>',
      '        <ul>',
      '          <li><a href="about.html">Our Story</a></li>',
      '          <li><a href="about.html#doctors">Specialists</a></li>',
      '          <li><a href="about.html#gallery">Gallery</a></li>',
      '          <li><a href="' + (s.google || '#') + '" target="_blank" rel="noopener noreferrer">Google Reviews</a></li>',
      '        </ul>',
      '      </nav>',

      /* Visit column */
      '      <nav class="footer-col" aria-label="Visit us">',
      '        <h3 class="footer-col-heading">Visit</h3>',
      '        <ul>',
      '          <li><a href="contact.html">Book a Consultation</a></li>',
      '          <li><a href="' + waUrl('booking') + '" target="_blank" rel="noopener noreferrer">WhatsApp Us</a></li>',
      '          <li><a href="' + (a.mapsUrl || '#') + '" target="_blank" rel="noopener noreferrer">Get Directions</a></li>',
      '        </ul>',
      '      </nav>',

      '    </div>',

      /* ── NAP strip (SEO) ── */
      '    <div class="footer-nap">',
      '      <a href="' + (a.mapsUrl || '#') + '" target="_blank" rel="noopener noreferrer" style="text-decoration:none;color:inherit">',
      '      <address class="footer-address" itemprop="address" itemscope',
      '               itemtype="https://schema.org/PostalAddress" style="cursor:pointer">',
      '        <span itemprop="streetAddress">' + (a.line1 || '') + ', ' + (a.line2 || '') + '</span><br>',
      '        <span itemprop="addressLocality">' + (a.area || '') + ', ' + (a.city || '') + '</span> ',
      '        <span itemprop="postalCode">' + (a.pin || '') + '</span><br>',
      '        <span itemprop="addressRegion">' + (a.state || '') + '</span>, ' + (a.country || ''),
      '      </address>',
      '      </a>',
      '      <div class="footer-hours">',
      '        <span>' + (h.display || '') + '</span><br>',
      '      </div>',
      '      <div class="footer-contact">',
      '        <a href="tel:' + (c.phone1raw || '') + '" itemprop="telephone">' + (c.phone1 || '') + '</a><br>',
      '        <a href="tel:' + (c.phone2raw || '') + '">' + (c.phone2 || '') + '</a><br>',
      '        <span class="fw-email-mount" data-email="' + (c.email || '') + '"></span>',
      '      </div>',
      '    </div>',

      /* ── Bottom bar ── */
      '    <div class="footer-bottom">',
      '      <span>© ' + yr + ' Flosswork Dental Clinic · All rights reserved</span>',
      '      <span>Est. MMXXIII · Raipur, IN</span>',
      '    </div>',

      '  </div>',
      '</footer>',
    ].join('\n');
  }

  /* ============================================================
     INJECT FUNCTIONS
  ============================================================ */

  /** Fills <header id="fw-header"> and <div id="nav-mobile"> immediately. */
  function injectNav() {
    var header = document.getElementById('fw-header');
    var mobile = document.getElementById('nav-mobile');
    if (header) header.innerHTML = renderHeader();
    if (mobile) mobile.innerHTML = renderMobileMenu();
  }

  /** Replaces <div id="fw-cta-mount"> with the standard CTA section. */
  function injectCTA() {
    var mount = document.getElementById('fw-cta-mount');
    if (!mount) return;

    /* Allow opt-out: <main data-cta="none"> */
    var main = document.getElementById('main-content');
    if (main && main.getAttribute('data-cta') === 'none') {
      mount.remove();
      return;
    }

    /* outerHTML swap so the section sits directly in <main> */
    mount.outerHTML = renderCTA();
  }

  /** Fills <div id="fw-footer"> with the full footer. */
  function injectFooter() {
    var el = document.getElementById('fw-footer');
    if (!el) return;
    el.innerHTML = renderFooter();

    /* Anti-spam: reconstruct email from data attribute */
    var span = el.querySelector('.fw-email-mount');
    if (span && span.dataset.email) {
      var link = document.createElement('a');
      link.href        = 'mailto:' + span.dataset.email;
      link.textContent = span.dataset.email;
      link.setAttribute('itemprop', 'email');
      span.parentNode.replaceChild(link, span);
    }
  }

  /* ============================================================
     INIT
     ─────────────────────────────────────────────────────────────
     injectNav() runs synchronously right now — the <header> and
     <div id="nav-mobile"> are already in the DOM (they appear in
     HTML before this script tag), so we can fill them immediately.
     This prevents any flash of empty nav.

     injectCTA() and injectFooter() need the full DOM to be ready
     (they target elements inside <main> and after it).
  ============================================================ */
  injectNav();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      injectCTA();
      injectFooter();
    });
  } else {
    /* Script was loaded after DOM was already ready */
    injectCTA();
    injectFooter();
  }

})();
