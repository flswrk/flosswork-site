/* ============================================================
   FLOSSWORK™ — MOBILE CTA BAR  v1.0
   Sticky mobile CTA with WhatsApp, Call, Book
   Synced with layout.js config
   ============================================================ */

(function () {
  'use strict';

  function fw() { return window.FW || {}; }
  function clinic() { return fw().clinic || {}; }

  function phoneRaw() { return clinic().phone1raw || '+918354088822'; }
  function phoneDisplay() { return clinic().phone1 || '+91 83540 88822'; }
  function waNumber() { return clinic().whatsapp || '918354088822'; }

  function waUrl(msg) {
    return 'https://wa.me/' + waNumber() + '?text=' + encodeURIComponent(msg || 'Hi, I\'d like to book a consultation at Flosswork Dental Clinic.');
  }

  var SVG_WA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12a8 8 0 01-12.2 6.8L3 20l1.3-4.7A8 8 0 1120 12z"/></svg>';
  var SVG_PHONE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h3l2 5-2 1a11 11 0 006 6l1-2 5 2v3a2 2 0 01-2 2A17 17 0 013 6a2 2 0 012-2z"/></svg>';
  var SVG_CALENDAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';

  function createMobileCTA() {
    var cta = document.createElement('nav');
    cta.className = 'fw-mobile-cta';
    cta.setAttribute('role', 'doc-pagebreak');
    cta.setAttribute('aria-label', 'Mobile contact options');

    var inner = document.createElement('div');
    inner.className = 'fw-mobile-cta-inner';

    var waBtn = document.createElement('a');
    waBtn.href = waUrl();
    waBtn.className = 'fw-mobile-cta-btn fw-mobile-cta-btn--wa';
    waBtn.innerHTML = SVG_WA + '<span>WhatsApp</span>';
    waBtn.setAttribute('data-track', 'mobile_cta_wa');

    var phoneBtn = document.createElement('a');
    phoneBtn.href = 'tel:' + phoneRaw();
    phoneBtn.className = 'fw-mobile-cta-btn fw-mobile-cta-btn--call';
    phoneBtn.innerHTML = SVG_PHONE + '<span>Call</span>';
    phoneBtn.setAttribute('data-track', 'mobile_cta_call');

    inner.appendChild(waBtn);
    inner.appendChild(phoneBtn);

    cta.appendChild(inner);

    return cta;
  }

  function init() {
    if (typeof document === 'undefined') return;

    var cta = createMobileCTA();
    document.body.appendChild(cta);
    document.body.classList.add('has-mobile-cta');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
