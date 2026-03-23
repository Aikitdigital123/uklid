(function () {
  var ITEMS_PER_PAGE = 6;
  var INIT_GUARD_KEY = 'beforeAfterGalleryInit';
  var VISIBLE_LIMIT = 1;
  var EXPAND_BTN_ID = 'before-after-expand';

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

  function sortByDateDesc(a, b) {
    var dateA = parseDate(a.date);
    var dateB = parseDate(b.date);

    if (dateA && dateB) {
      return dateB - dateA;
    }

    // Items without a valid date go last.
    if (dateA) return -1;
    if (dateB) return 1;
    return 0;
  }

  function normalizeMediaPath(path) {
    if (!path || typeof path !== 'string') {
      return '';
    }

    if (/^(?:[a-z]+:)?\/\//i.test(path) || path.indexOf('data:') === 0 || path.indexOf('blob:') === 0) {
      return path;
    }

    if (path.charAt(0) === '/') {
      return path;
    }

    return '/' + path.replace(/^\.?\/*/, '');
  }

  function updateToggle(figure, img, label, hint, state) {
    var isEnglish = document.documentElement.lang === 'en';
    if (state === 'after') {
      img.src = img.dataset.after;
      img.alt = img.dataset.afterAlt;
      label.textContent = isEnglish ? 'After' : 'Po';
      hint.textContent = isEnglish ? 'Click for Before' : 'Klikněte pro Před';
      figure.setAttribute('aria-pressed', 'true');
    } else {
      img.src = img.dataset.before;
      img.alt = img.dataset.beforeAlt;
      label.textContent = isEnglish ? 'Before' : 'Před';
      hint.textContent = isEnglish ? 'Click for After' : 'Klikněte pro Po';
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
    var isEnglish = document.documentElement.lang === 'en';
    title.textContent = item.title || (isEnglish ? 'Job' : 'Zakázka');

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
    img.dataset.before = normalizeMediaPath(item.before);
    img.dataset.after = normalizeMediaPath(item.after);
    var isEnglish = document.documentElement.lang === 'en';
    var defaultTitle = item.title || (isEnglish ? 'job' : 'zakázka');
    img.dataset.beforeAlt = isEnglish ? ('Before cleaning - ' + defaultTitle) : ('Před úklidem - ' + defaultTitle);
    img.dataset.afterAlt = isEnglish ? ('After cleaning - ' + defaultTitle) : ('Po úklidu - ' + defaultTitle);
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
        var isEnglish = document.documentElement.lang === 'en';
        if (isEnglish && emptyState.textContent === 'Galerie zatím nemá žádné fotky.') {
          emptyState.textContent = 'The gallery currently has no photos.';
        } else if (!isEnglish && emptyState.textContent === 'The gallery currently has no photos.') {
          emptyState.textContent = 'Galerie zatím nemá žádné fotky.';
        }
        emptyState.hidden = false;
      }
      return;
    }

    data.sort(sortByDateDesc);

    var fragment = document.createDocumentFragment();
    data.forEach(function (item) {
      fragment.appendChild(createCard(item));
    });
    target.appendChild(fragment);

    if (emptyState) {
      emptyState.hidden = true;
    }

    // --- Progressive disclosure: show only first item, rest after expand ---
    // Idempotence: if gallery is re-rendered or page is restored from bfcache, avoid duplicating button.
    if (document.documentElement.dataset[INIT_GUARD_KEY] !== '1') {
      document.documentElement.dataset[INIT_GUARD_KEY] = '1';
    }

    var cards = target.querySelectorAll('.ba-card');
    if (!cards || cards.length <= VISIBLE_LIMIT) {
      // Remove old expand button if any (e.g., if items were removed)
      var oldBtn = document.getElementById(EXPAND_BTN_ID);
      if (oldBtn) oldBtn.remove();
      return;
    }

    // Hide cards above the visible limit (preserve first item)
    for (var i = 0; i < cards.length; i++) {
      if (i < VISIBLE_LIMIT) {
        cards[i].hidden = false;
        cards[i].classList.remove('is-hidden');
      } else {
        cards[i].hidden = true;
        cards[i].classList.add('is-hidden');
      }
    }

    var existingBtn = document.getElementById(EXPAND_BTN_ID);
    if (existingBtn) existingBtn.remove();

    var isEnglish = document.documentElement.lang === 'en';
    var btn = document.createElement('button');
    btn.id = EXPAND_BTN_ID;
    btn.type = 'button';
    btn.className = 'btn btn-secondary btn-expand-services';
    btn.setAttribute('aria-controls', 'before-after-gallery');
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = isEnglish ? 'Show more photos' : 'Zobrazit další fotky';

    // Place button under the gallery
    target.insertAdjacentElement('afterend', btn);

    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var nextExpanded = !expanded;
      btn.setAttribute('aria-expanded', String(nextExpanded));
      btn.textContent = nextExpanded
        ? (isEnglish ? 'Show fewer photos' : 'Zobrazit méně fotek')
        : (isEnglish ? 'Show more photos' : 'Zobrazit další fotky');

      for (var j = 0; j < cards.length; j++) {
        if (j < VISIBLE_LIMIT) continue;
        cards[j].hidden = !nextExpanded;
        if (nextExpanded) cards[j].classList.remove('is-hidden');
        else cards[j].classList.add('is-hidden');
      }
    });
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
