(function () {
  var ITEMS_PER_PAGE = 6;

  function parseDate(value) {
    var parsed = Date.parse(value);
    return isNaN(parsed) ? null : new Date(parsed);
  }

  function sortByDateAsc(a, b) {
    var dateA = parseDate(a.date);
    var dateB = parseDate(b.date);

    if (dateA && dateB) {
      return dateA - dateB;
    }

    if (dateA) {
      return 1;
    }

    if (dateB) {
      return -1;
    }

    return 0;
  }

  function updateToggle(figure, img, label, hint, state) {
    if (state === 'after') {
      img.src = img.dataset.after;
      img.alt = img.dataset.afterAlt;
      label.textContent = 'Po';
      hint.textContent = 'Klikněte pro Před';
      figure.setAttribute('aria-pressed', 'true');
    } else {
      img.src = img.dataset.before;
      img.alt = img.dataset.beforeAlt;
      label.textContent = 'Před';
      hint.textContent = 'Klikněte pro Po';
      figure.setAttribute('aria-pressed', 'false');
    }
    figure.dataset.state = state;
  }

  function createCard(item) {
    var card = document.createElement('article');
    card.className = 'ba-card glass-panel';

    var meta = document.createElement('div');
    meta.className = 'ba-meta';

    var title = document.createElement('div');
    title.className = 'ba-title';
    title.textContent = item.title || 'Zakázka';

    var date = document.createElement('div');
    date.className = 'ba-date';
    date.textContent = item.date || '';

    meta.appendChild(title);
    if (date.textContent) {
      meta.appendChild(date);
    }

    var media = document.createElement('div');
    media.className = 'ba-media';

    var figure = document.createElement('figure');
    figure.className = 'ba-figure';
    figure.setAttribute('role', 'button');
    figure.setAttribute('tabindex', '0');

    var img = document.createElement('img');
    img.dataset.before = item.before;
    img.dataset.after = item.after;
    img.dataset.beforeAlt = 'Před úklidem - ' + (item.title || 'zakázka');
    img.dataset.afterAlt = 'Po úklidu - ' + (item.title || 'zakázka');
    img.loading = 'lazy';
    img.decoding = 'async';
    img.width = 4032;
    img.height = 3024;

    var label = document.createElement('div');
    label.className = 'ba-label';

    var hint = document.createElement('div');
    hint.className = 'ba-toggle-hint';

    updateToggle(figure, img, label, hint, 'before');

    figure.appendChild(img);
    figure.appendChild(label);

    var note;
    if (item.note) {
      note = document.createElement('p');
      note.className = 'ba-note';
      note.textContent = item.note;
    }

    function toggle() {
      var nextState = figure.dataset.state === 'before' ? 'after' : 'before';
      updateToggle(figure, img, label, hint, nextState);
    }

    figure.addEventListener('click', toggle);
    figure.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggle();
      }
    });

    media.appendChild(figure);
    card.appendChild(meta);
    card.appendChild(media);
    card.appendChild(hint);

    if (note) {
      card.appendChild(note);
    }

    return card;
  }

  function renderGallery() {
    var target = document.getElementById('before-after-gallery');
    if (!target) {
      return;
    }

    var emptyState = document.getElementById('before-after-empty');
    
    // Bezpečné načtení dat s error handlingem
    var data = [];
    try {
      if (window.beforeAfterGallery && Array.isArray(window.beforeAfterGallery)) {
        data = window.beforeAfterGallery.slice();
      } else if (window.beforeAfterGallery && typeof window.beforeAfterGallery === 'object') {
        // Fallback: pokud je to objekt, zkus převést na pole
        data = Array.isArray(window.beforeAfterGallery) ? window.beforeAfterGallery.slice() : [];
      }
    } catch (e) {
      // Pokud dojde k chybě při přístupu k window.beforeAfterGallery, použijeme prázdné pole
      data = [];
    }

    data = data.filter(function (item) {
      return item && typeof item === 'object' && item.before && item.after;
    });

    if (!data.length) {
      if (emptyState) {
        emptyState.hidden = false;
      }
      return;
    }

    data.sort(sortByDateAsc);

    var fragment = document.createDocumentFragment();
    data.forEach(function (item) {
      fragment.appendChild(createCard(item));
    });
    target.appendChild(fragment);

    if (emptyState) {
      emptyState.hidden = true;
    }
  }

  // Robustní inicializace - čekáme na data.js s delším timeoutem a více pokusy
  function safeRenderGallery() {
    var target = document.getElementById('before-after-gallery');
    if (!target) {
      // Pokud target ještě neexistuje, zkusíme znovu po DOMContentLoaded
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', safeRenderGallery);
      } else {
        setTimeout(safeRenderGallery, 100);
      }
      return;
    }

    // Pokud data.js ještě není načten, počkáme s více pokusy a delším intervalem
    if (typeof window.beforeAfterGallery === 'undefined') {
      var attempts = 0;
      var maxAttempts = 10; // Zvýšeno z 3 na 10
      var checkInterval = setInterval(function() {
        attempts++;
        // Zkontrolovat, zda data.js je načten
        if (typeof window.beforeAfterGallery !== 'undefined') {
          clearInterval(checkInterval);
          renderGallery();
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          // Po vyčerpání pokusů zkontrolovat, zda data.js existuje
          // Pokud ano, ale není načten, zkusit ještě jednou po delší prodlevě
          var scripts = document.querySelectorAll('script[src*="data.js"]');
          if (scripts.length > 0) {
            // Script existuje v HTML, ale ještě není načten - počkat déle
            setTimeout(function() {
              if (typeof window.beforeAfterGallery !== 'undefined') {
                renderGallery();
              } else {
                // Pokud po dlouhé prodlevě stále není, zobrazit prázdný stav
                renderGallery();
              }
            }, 500);
          } else {
            // Script neexistuje v HTML - zobrazit prázdný stav
            renderGallery();
          }
        }
      }, 100); // Zvýšeno z 50ms na 100ms pro stabilnější kontrolu
      return;
    }
    
    // Data jsou dostupná - renderovat hned
    renderGallery();
  }

  // Inicializace - čekat na DOMContentLoaded nebo použít okamžitou inicializaci
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', safeRenderGallery);
  } else {
    // DOM je už připraven, ale data.js může být stále načítán
    safeRenderGallery();
  }
  
  // Fallback: zkusit znovu po window.load (když jsou všechny skripty načteny)
  if (document.readyState !== 'complete') {
    window.addEventListener('load', function() {
      // Pokud galerie ještě nebyla vykreslena, zkusit znovu
      var target = document.getElementById('before-after-gallery');
      if (target && target.children.length === 0) {
        safeRenderGallery();
      }
    });
  }
})();
