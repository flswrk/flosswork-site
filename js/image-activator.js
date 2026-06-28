/* ============================================================
   FLOSSWORK™ — IMAGE ACTIVATOR  v1.0
   Every placeholder image on the site is preceded by a comment:
     <!-- REPLACE: <img src="images/..." ...> -->
     <div class="placeholder ...">...</div>
   This script tries loading the path in each comment. If the file
   exists, the placeholder is swapped for the real <img> automatically.
   If it doesn't, the placeholder stays exactly as it was.
   Drop a photo into the right images/ folder — no HTML edits needed.
   ============================================================ */

(function () {
  'use strict';

  function nextElement(node) {
    var n = node.nextSibling;
    while (n && n.nodeType !== 1) n = n.nextSibling;
    return n;
  }

  /* Flags a console warning (not a UI alert) if the uploaded photo's
     real proportions differ from the width/height the slot expects
     by more than ~15% — usually means the photo was cropped to the
     wrong shape before exporting. See js/content.js's IMAGE SIZE GUIDE. */
  function warnIfAspectMismatch(imgEl, probe) {
    var expectedW = parseFloat(imgEl.getAttribute('width'));
    var expectedH = parseFloat(imgEl.getAttribute('height'));
    if (!expectedW || !expectedH || !probe.naturalWidth || !probe.naturalHeight) return;

    var expectedRatio = expectedW / expectedH;
    var actualRatio = probe.naturalWidth / probe.naturalHeight;
    var deviation = Math.abs(actualRatio - expectedRatio) / expectedRatio;

    if (deviation > 0.15) {
      console.warn(
        '[image-activator] ' + imgEl.getAttribute('src') +
        ' is ' + probe.naturalWidth + '×' + probe.naturalHeight +
        ' (ratio ' + actualRatio.toFixed(2) + ') but this slot expects ' +
        'roughly ' + expectedW + '×' + expectedH + ' (ratio ' + expectedRatio.toFixed(2) + '). ' +
        'See the IMAGE SIZE GUIDE in js/content.js.'
      );
    }
  }

  function activate() {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_COMMENT);
    var pairs = [];
    var comment;

    while ((comment = walker.nextNode())) {
      var text = comment.nodeValue.trim();
      if (text.indexOf('REPLACE:') !== 0) continue;

      var placeholder = nextElement(comment);
      if (!placeholder || !placeholder.classList || !placeholder.classList.contains('placeholder')) continue;

      var match = text.match(/<img[^>]*>/i);
      if (!match) continue;

      pairs.push({ html: match[0], placeholder: placeholder });
    }

    pairs.forEach(function (pair) {
      var temp = document.createElement('div');
      temp.innerHTML = pair.html;
      var imgEl = temp.firstElementChild;
      if (!imgEl || imgEl.tagName !== 'IMG' || !imgEl.getAttribute('src')) return;

      var probe = new Image();
      probe.onload = function () {
        warnIfAspectMismatch(imgEl, probe);
        pair.placeholder.replaceWith(imgEl);
      };
      probe.src = imgEl.src;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', activate);
  } else {
    activate();
  }
})();
