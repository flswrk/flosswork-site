/* ============================================================
   FLOSSWORK™ — FLOATS.JS  v3.1
   Handles:
   1. Call FAB (all pages, all devices)
   2. Callback form modal (name + phone → WA or tel fallback)
   3. Callback trigger delegation
   ============================================================ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    injectFloats();
    initCallbackForm();
    initCallbackTriggers();
  });

  /* ── HELPERS ───────────────────────────────────────────────── */
  function waLink(msgKey, replacements) {
    var fw   = window.FW || {};
    var num  = (fw.clinic && fw.clinic.whatsapp) ? fw.clinic.whatsapp : '918354088822';
    var msgs = fw.waMessages || {};
    var msg  = msgs[msgKey] || msgs['default'] || 'Hi, I\'d like to book a consultation at Flosswork.';
    if (replacements) {
      Object.keys(replacements).forEach(function (k) {
        msg = msg.replace('{' + k + '}', replacements[k]);
      });
    }
    return 'https://wa.me/' + num + '?text=' + encodeURIComponent(msg);
  }

  function getPhone()        { var fw = window.FW || {}; return (fw.clinic && fw.clinic.phone1raw)  ? fw.clinic.phone1raw  : '+918354088822'; }
  function getPhoneDisplay() { var fw = window.FW || {}; return (fw.clinic && fw.clinic.phone1)     ? fw.clinic.phone1     : '+91 83540 88822'; }

  /* ================================================================
     1. INJECT FLOATS
     Appends: Call FAB + callback modal into <body>.
     Sticky CTA bar removed — cleaner mobile UX.
  ================================================================ */
  function injectFloats() {
    var html = [

      /* ── WhatsApp FAB (desktop only) ── */
      '<a id="call-fab"',
      '   href="' + waLink('fab') + '"',
      '   target="_blank" rel="noopener noreferrer"',
      '   aria-label="Chat on WhatsApp"',
      '   data-track="wa_fab_click">',
      '  <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"',
      '       stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">',
      '    <path d="M20 12a8 8 0 01-12.2 6.8L3 20l1.3-4.7A8 8 0 1120 12z"/>',
      '  </svg>',
      '</a>',

      /* ── Callback modal ── */
      '<div id="callback-modal" role="dialog" aria-modal="true" aria-labelledby="callback-title" aria-hidden="true">',
      '  <div class="callback-sheet">',
      '    <button class="callback-close" id="callback-close" aria-label="Close">',
      '      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 6l12 12M6 18L18 6"/></svg>',
      '    </button>',
      '    <p class="callback-eyebrow">Request a callback</p>',
      '    <h2 id="callback-title" class="callback-title">We\'ll call<br><em>you back.</em></h2>',
      '    <p class="callback-sub">Leave your name and number. Our team calls back within 30 minutes during clinic hours.</p>',
      '    <div id="callback-form">',
      '      <div class="field">',
      '        <label for="cb-name">Your name</label>',
      '        <input type="text" id="cb-name" name="name" placeholder="e.g. Rahul Sharma" autocomplete="name" required>',
      '      </div>',
      '      <div class="field">',
      '        <label for="cb-phone">Mobile number</label>',
      '        <input type="tel" id="cb-phone" name="phone" placeholder="+91 98765 43210" autocomplete="tel" required>',
      '      </div>',
      '      <button type="button" id="callback-submit" class="btn btn--primary callback-btn" data-track="callback_request">',
      '        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12a8 8 0 01-12.2 6.8L3 20l1.3-4.7A8 8 0 1120 12z"/></svg>',
      '        Send via WhatsApp',
      '      </button>',
      '      <p class="callback-note">Prefer a call? <a href="tel:' + getPhone() + '" data-track="call_click">' + getPhoneDisplay() + '</a></p>',
      '    </div>',
      '    <div id="callback-success" class="callback-success" hidden>',
      '      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12l5 5L20 6"/></svg>',
      '      <h3>Request sent</h3>',
      '      <p>WhatsApp has opened with your details. We\'ll respond within 30 minutes during clinic hours.</p>',
      '      <p class="callback-fallback">Or call directly: <a href="tel:' + getPhone() + '">' + getPhoneDisplay() + '</a></p>',
      '    </div>',
      '  </div>',
      '</div>',

    ].join('\n');

    var container = document.createElement('div');
    container.innerHTML = html;
    while (container.firstChild) {
      document.body.appendChild(container.firstChild);
    }
  }

  /* ================================================================
     2. CALLBACK FORM
  ================================================================ */
  function initCallbackForm() {
    setTimeout(function () {
      var modal    = document.getElementById('callback-modal');
      var closeBtn = document.getElementById('callback-close');
      var submitBtn= document.getElementById('callback-submit');
      var form     = document.getElementById('callback-form');
      var success  = document.getElementById('callback-success');
      if (!modal) return;

      /* Open */
      window.openCallbackModal = function () {
        modal.removeAttribute('aria-hidden');
        modal.classList.add('open');
        document.body.classList.add('fw-nav-open');
        var firstInput = modal.querySelector('input');
        if (firstInput) setTimeout(function () { firstInput.focus(); }, 50);
      };

      /* Close */
      function closeModal() {
        modal.setAttribute('aria-hidden', 'true');
        modal.classList.remove('open');
        document.body.classList.remove('fw-nav-open');
        document.body.style.top = '';
        var nameInput  = document.getElementById('cb-name');
        var phoneInput = document.getElementById('cb-phone');
        if (nameInput)  nameInput.value  = '';
        if (phoneInput) phoneInput.value = '';
        if (form)    form.hidden    = false;
        if (success) success.hidden = true;
      }

      if (closeBtn) closeBtn.addEventListener('click', closeModal);
      modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
      modal.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

      /* Submit → open WA with name + phone pre-filled */
      if (submitBtn) {
        submitBtn.addEventListener('click', function () {
          var nameInput  = document.getElementById('cb-name');
          var phoneInput = document.getElementById('cb-phone');
          var name  = nameInput  ? nameInput.value.trim()  : '';
          var phone = phoneInput ? phoneInput.value.trim() : '';

          if (!name || !phone) {
            if (!name  && nameInput)  { nameInput.focus();  nameInput.style.borderColor  = 'oklch(0.65 0.18 25)'; }
            if (!phone && phoneInput) { phoneInput.focus(); phoneInput.style.borderColor = 'oklch(0.65 0.18 25)'; }
            return;
          }

          var lastSubmit = localStorage.getItem('fw_callback_ts');
          if (!lastSubmit || (Date.now() - parseInt(lastSubmit)) >= 60000) {
            localStorage.setItem('fw_callback_ts', Date.now().toString());
            window.open(waLink('callback', { name: name, phone: phone }), '_blank', 'noopener,noreferrer');
          }

          if (form)    form.hidden    = true;
          if (success) success.hidden = false;
          if (window.gtag) window.gtag('event', 'callback_request', { name: name });
        });
      }

      /* Clear error border on re-type */
      ['cb-name', 'cb-phone'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.addEventListener('input', function () { el.style.borderColor = ''; });
      });

    }, 100);
  }

  /* ================================================================
     3. CALLBACK TRIGGERS
     Any element with [data-callback="open"] opens the modal.
  ================================================================ */
  function initCallbackTriggers() {
    document.addEventListener('click', function (e) {
      var el = e.target.closest('[data-callback="open"]');
      if (el && typeof window.openCallbackModal === 'function') {
        e.preventDefault();
        window.openCallbackModal();
      }
    });
  }

})();
