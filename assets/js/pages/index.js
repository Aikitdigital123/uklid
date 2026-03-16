/**
 * Page init: homepage (index). Jen viditelnost pole „Frekvence úklidu“ podle „Typ úklidu“.
 * Guard: indexPageInit. Volá main.bundle.js po DOM ready a při bfcache reinit.
 */
const PAGE_INIT_KEY = 'indexPageInit';

/** Typy úklidu, u kterých se zobrazí pole frekvence */
function getTypesRequiringFrequency() {
  const isEnglish = document.documentElement.lang === 'en';
  if (isEnglish) {
    return [
      'Regular home cleaning',
      'Commercial space cleaning (offices, shops)',
    ];
  }
  return [
    'Pravidelný úklid domácnosti',
    'Úklid komerčních prostor (kanceláře, obchody)',
  ];
}

export function initIndexPage() {
  if (document.documentElement.dataset[PAGE_INIT_KEY] === '1') return;
  document.documentElement.dataset[PAGE_INIT_KEY] = '1';

  const cleaningTypeSelect = document.getElementById('cleaningType');
  const frequencyGroup = document.getElementById('frequencyGroup');
  const frequencySelect = document.getElementById('cleaningFrequency');
  const previousController = window.__lesktopIndexPageController;
  if (previousController) previousController.abort();
  const controller = new AbortController();
  const { signal } = controller;
  window.__lesktopIndexPageController = controller;

  initAsyncStylesheets(signal);
  initBrandLogoFallback(signal);
  initIndexTracking(signal);

  if (!cleaningTypeSelect || !frequencyGroup || !frequencySelect) return;

  function toggleFrequencyDisplay() {
    const typesRequiringFrequency = getTypesRequiringFrequency();
    const show = typesRequiringFrequency.includes(cleaningTypeSelect.value);
    if (show) {
      frequencyGroup.classList.remove('form-group-hidden');
      frequencySelect.setAttribute('required', 'required');
    } else {
      frequencyGroup.classList.add('form-group-hidden');
      frequencySelect.removeAttribute('required');
      frequencySelect.value = '';
      frequencySelect.classList.remove('is-valid', 'is-invalid');
    }
  }

  cleaningTypeSelect.addEventListener('change', toggleFrequencyDisplay, { signal });
  toggleFrequencyDisplay();

  initCalculatorExpandable();
}

function initAsyncStylesheets(signal) {
  const stylesheetLinks = document.querySelectorAll('link[data-async-stylesheet]');

  stylesheetLinks.forEach((link) => {
    const activateStylesheet = () => {
      link.media = 'all';
      link.dataset.stylesheetLoaded = '1';
    };

    if (link.media === 'all' || link.dataset.stylesheetLoaded === '1') return;

    link.addEventListener('load', activateStylesheet, { once: true, signal });

    if (link.sheet) activateStylesheet();
  });
}

function initBrandLogoFallback(signal) {
  const logo = document.querySelector('.brand-logo');
  if (!logo) return;

  const applyFallback = () => {
    logo.classList.add('is-hidden');
    const brandText = logo.nextElementSibling;
    if (brandText) brandText.classList.add('is-visible');
  };

  logo.addEventListener('error', applyFallback, { once: true, signal });

  if (logo.complete && logo.naturalWidth === 0) {
    applyFallback();
  }
}

function initIndexTracking(signal) {
  const trackableElements = document.querySelectorAll('[data-track-event]');

  trackableElements.forEach((element) => {
    element.addEventListener('click', () => {
      if (typeof window.lesktopTrackEvent !== 'function') return;

      const eventName = element.dataset.trackEvent;
      if (!eventName) return;

      const params = {};
      if (element.dataset.trackMenuItem) params.menu_item = element.dataset.trackMenuItem;
      if (element.dataset.trackButtonName) params.button_name = element.dataset.trackButtonName;

      if (Object.keys(params).length > 0) {
        window.lesktopTrackEvent('event', eventName, params);
      } else {
        window.lesktopTrackEvent('event', eventName);
      }
    }, { signal });
  });
}

/**
 * Progressive disclosure pro kalkulačku:
 * Pokud je v checkbox-group hodně položek, schová je a přidá tlačítko "Zobrazit více".
 */
function initCalculatorExpandable() {
  const group = document.querySelector('#kalkulacka .checkbox-group');
  if (!group) return;
  // Prevent duplication if re-initialized
  if (group.nextElementSibling && group.nextElementSibling.classList.contains('btn-expand-services')) return;

  // Získáme všechny přímé potomky (obaly checkboxů)
  const items = Array.from(group.children);
  const VISIBLE_LIMIT = 6; // Počet viditelných položek (2 řádky na desktopu)

  if (items.length <= VISIBLE_LIMIT) return;

  // Skryjeme položky nad limit
  const hiddenItems = items.slice(VISIBLE_LIMIT);
  hiddenItems.forEach(item => item.classList.add('checkbox-item-hidden'));

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn-expand-services';
  group.id = group.id || 'kalkulacka-checkbox-group';
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', group.id);
  
  // Detect language for button text
  const isEnglish = document.documentElement.lang === 'en';
  const textShowMore = isEnglish ? `Show more services (+${hiddenItems.length})` : `Zobrazit další služby (+${hiddenItems.length})`;
  const textShowLess = isEnglish ? 'Show less' : 'Zobrazit méně';
  
  btn.innerHTML = `${textShowMore} <i class="fas fa-chevron-down" aria-hidden="true"></i>`;
  group.after(btn);

  let isExpanded = false;

  const updateButtonState = () => {
    btn.setAttribute('aria-expanded', String(isExpanded));
    if (isExpanded) {
      hiddenItems.forEach(item => {
        item.classList.remove('checkbox-item-hidden');
        item.classList.add('checkbox-item-reveal');
      });
      btn.innerHTML = `${textShowLess} <i class="fas fa-chevron-up" aria-hidden="true"></i>`;
      btn.classList.add('is-expanded');
    } else {
      hiddenItems.forEach(item => {
        item.classList.add('checkbox-item-hidden');
        item.classList.remove('checkbox-item-reveal');
      });
      btn.innerHTML = `${textShowMore} <i class="fas fa-chevron-down" aria-hidden="true"></i>`;
      btn.classList.remove('is-expanded');
    }
  };

  let hasTrackedExpand = false;
  btn.addEventListener('click', () => {
    const wasExpanded = isExpanded;
    isExpanded = !isExpanded;
    updateButtonState();
    
    // Track expansion only once, when first expanded
    if (isExpanded && !wasExpanded && !hasTrackedExpand) {
      hasTrackedExpand = true;
      if (typeof window.lesktopTrackEvent === 'function') {
        window.lesktopTrackEvent('event', 'services_expand');
      }
    }
    
    if (!isExpanded) {
      const rect = group.getBoundingClientRect();
      if (rect.top < 0) {
        const y = rect.top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  });

  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
}
