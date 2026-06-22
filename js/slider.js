/* ============================================================
   FLOSSWORK™ — SLIDER.JS
   Before/after drag slider.
   - Touch-safe: calls preventDefault on touchmove (passive:false)
   - Keyboard: Left/Right arrow keys move divider
   - Accessible: role="img" with aria-label, aria-valuenow
   - Tracks interaction via trackGalleryInteract()
   ============================================================ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var sliders = document.querySelectorAll('[data-slider]');
    sliders.forEach(initSlider);
  });

  function initSlider(wrap) {
    var caseId    = wrap.getAttribute('data-slider') || '1';
    var divider   = wrap.querySelector('.ba-divider');
    var handle    = wrap.querySelector('.ba-handle');
    var beforeMask= wrap.querySelector('.ba-mask');
    if (!divider || !handle || !beforeMask) return;

    var pos     = 50;   /* percentage 0–100 */
    var dragging= false;
    var tracked = false;

    function setPos(pct) {
      pos = Math.min(Math.max(pct, 2), 98);
      divider.style.left      = pos + '%';
      handle.style.left       = pos + '%';
      beforeMask.style.width  = pos + '%';
      wrap.setAttribute('aria-valuenow', Math.round(pos));
    }

    function getPercent(clientX) {
      var rect = wrap.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    }

    /* ── MOUSE ──────────────────────────────────────────────── */
    wrap.addEventListener('mousedown', function (e) {
      e.preventDefault();
      dragging = true;
      setPos(getPercent(e.clientX));
    });

    document.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      setPos(getPercent(e.clientX));
      if (!tracked) {
        tracked = true;
        if (typeof window.trackGalleryInteract === 'function') {
          window.trackGalleryInteract(caseId);
        }
      }
    });

    document.addEventListener('mouseup', function () {
      dragging = false;
    });

    /* ── TOUCH (passive:false to allow preventDefault) ────── */
    wrap.addEventListener('touchstart', function (e) {
      dragging = true;
      setPos(getPercent(e.touches[0].clientX));
    }, { passive: true });

    wrap.addEventListener('touchmove', function (e) {
      if (!dragging) return;
      e.preventDefault(); /* Prevents page scroll while dragging */
      setPos(getPercent(e.touches[0].clientX));
      if (!tracked) {
        tracked = true;
        if (typeof window.trackGalleryInteract === 'function') {
          window.trackGalleryInteract(caseId);
        }
      }
    }, { passive: false }); /* Must be non-passive for preventDefault to work */

    wrap.addEventListener('touchend', function () {
      dragging = false;
    }, { passive: true });

    /* ── KEYBOARD ───────────────────────────────────────────── */
    wrap.setAttribute('tabindex', '0');
    wrap.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); setPos(pos - 5); }
      if (e.key === 'ArrowRight') { e.preventDefault(); setPos(pos + 5); }
    });

    /* ── ACCESSIBILITY ─────────────────────────────────────── */
    wrap.setAttribute('role', 'slider');
    wrap.setAttribute('aria-label', 'Before and after comparison. Use arrow keys to move divider.');
    wrap.setAttribute('aria-valuemin', '0');
    wrap.setAttribute('aria-valuemax', '100');
    wrap.setAttribute('aria-valuenow', '50');

    /* Initial position */
    setPos(50);
  }

})();
