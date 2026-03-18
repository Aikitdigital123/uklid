/**
 * Init orchestrator: global inits, page inits, bfcache reinit.
 * Each module sets its own dataset guard for idempotence.
 */
import './polyfills/legacyDom.js';
import { initCurrentYear } from './components/currentYear.js';
import { initReveal } from './components/reveal.js';
import { initNav } from './components/nav.js';
import { initForms } from './components/form.js';
import { initSelects } from './components/select.js';
import { initBackToTop } from './components/backToTop.js';
import { initBackButton } from './components/backButton.js';
import { initCookieBanner } from './components/cookieBanner.js';
import { initEnhancedTracking } from './components/enhancedTracking.js';
import { initAdvancedTracking } from './components/advancedTracking.js';
import { initUniversalTracking } from './components/universalTracking.js';
import { initIndexPage } from './pages/index.js';

const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const logError = isDev ? console.error.bind(console) : () => {};

const html = document.documentElement;

function initHeadAssets() {
  if (document.documentElement.dataset.headAssetsInit === '1') return;
  document.documentElement.dataset.headAssetsInit = '1';

  const stylesheetLinks = document.querySelectorAll('link[data-async-stylesheet]');
  stylesheetLinks.forEach((link) => {
    const activateStylesheet = () => {
      link.media = 'all';
      link.dataset.stylesheetLoaded = '1';
    };

    if (link.media === 'all' || link.dataset.stylesheetLoaded === '1') return;

    link.addEventListener('load', activateStylesheet, { once: true });
    if (link.sheet) activateStylesheet();
  });
}

/** Global inits: order matters (e.g. cookieBanner before tracking). */
const GLOBAL_INIT_REGISTRY = [
  { key: 'headAssetsInit', init: initHeadAssets },
  { key: 'currentYearInit', init: initCurrentYear },
  // Cookie banner musí být inicializovaný co nejdřív kvůli stabilní viditelnosti
  { key: 'cookieBannerInit', init: initCookieBanner },
  { key: 'revealInit', init: initReveal },
  { key: 'navInit', init: initNav },
  { key: 'backButtonInit', init: initBackButton },
  { key: 'formInit', init: initForms },
  { key: 'selectInit', init: initSelects },
  { key: 'backToTopInit', init: initBackToTop },
  { key: 'enhancedTrackingInit', init: initEnhancedTracking },
  { key: 'advancedTrackingInit', init: initAdvancedTracking },
  { key: 'universalTrackingInit', init: initUniversalTracking },
];

/**
 * Page dispatch: každá položka = jedna stránka (data-page na body).
 * Spustí se jen init pro aktuální stránku.
 */
const PAGE_INIT_REGISTRY = [
  { page: 'index', key: 'indexPageInit', init: initIndexPage },
];

function getCurrentPage() {
  return (document.body && document.body.dataset && document.body.dataset.page) || '';
}

function runGlobalInits() {
  GLOBAL_INIT_REGISTRY.forEach(({ key, init }) => {
    try {
      if (typeof init === 'function') init();
    } catch (err) {
      logError(`[init] ${key}:`, err);
    }
  });
}

function runPageInits() {
  const currentPage = getCurrentPage();
  if (!currentPage) return;

  const entry = PAGE_INIT_REGISTRY.find((e) => e.page === currentPage);
  if (!entry || typeof entry.init !== 'function') return;

  try {
    entry.init();
  } catch (err) {
    logError(`[init] ${entry.key}:`, err);
  }
}

function clearInitGuards() {
  GLOBAL_INIT_REGISTRY.forEach(({ key }) => delete html.dataset[key]);
  PAGE_INIT_REGISTRY.forEach(({ key }) => delete html.dataset[key]);
}

function whenDomReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

// --- First load: global inits immediately, page inits when DOM ready ---
runGlobalInits();
whenDomReady(runPageInits);

// --- bfcache (Back/Forward): clear guards, re-run all inits, then force reveal ---
window.addEventListener('pageshow', (ev) => {
  if (!ev.persisted) return;

  window.__lesktopReinitializing = true;
  clearInitGuards();

  setTimeout(() => {
    runGlobalInits();
    runPageInits();
    if (typeof window.__lesktopForceReveal === 'function') {
      window.__lesktopForceReveal();
    }
    window.__lesktopReinitializing = false;
    window.__lesktopReinitialized = true;
  }, 0);
});
