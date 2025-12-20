(function () {
  var ITEMS_PER_PAGE = 6;

  function parseDate(value) {
    var parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : new Date(parsed);
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
      hint.textContent = 'Kliknete pro Pred';
      figure.setAttribute('aria-pressed', 'true');
    } else {
      img.src = img.dataset.before;
      img.alt = img.dataset.beforeAlt;
      label.textContent = 'Pred';
      hint.textContent = 'Kliknete pro Po';
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
    title.textContent = item.title || 'Zakazka';

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
    img.dataset.beforeAlt = 'Pred uklidem - ' + (item.title || 'zakazka');
    img.dataset.afterAlt = 'Po uklidu - ' + (item.title || 'zakazka');
    img.loading = 'lazy';
    img.decoding = 'async';

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
    var moreButton = document.getElementById('before-after-more');
    var data = Array.isArray(window.beforeAfterGallery)
      ? window.beforeAfterGallery.slice()
      : [];

    data = data.filter(function (item) {
      return item && item.before && item.after;
    });

    if (!data.length) {
      if (emptyState) {
        emptyState.hidden = false;
      }
      if (moreButton) {
        moreButton.hidden = true;
      }
      return;
    }

    data.sort(sortByDateAsc);
    var rendered = 0;

    function renderNextBatch() {
      var nextItems = data.slice(rendered, rendered + ITEMS_PER_PAGE);
      if (!nextItems.length) {
        return;
      }

      var fragment = document.createDocumentFragment();
      nextItems.forEach(function (item) {
        fragment.appendChild(createCard(item));
      });
      target.appendChild(fragment);
      rendered += nextItems.length;

      if (moreButton) {
        moreButton.hidden = rendered >= data.length;
      }
    }

    renderNextBatch();

    if (moreButton) {
      moreButton.addEventListener('click', renderNextBatch);
      moreButton.hidden = rendered >= data.length;
    }

    if (emptyState) {
      emptyState.hidden = true;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderGallery);
  } else {
    renderGallery();
  }
})();
