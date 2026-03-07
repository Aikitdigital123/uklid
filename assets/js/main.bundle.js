// main.bundle.js - bundler entry point for production JS.
// Static imports avoid Promise-based loader behavior in older browsers.

import './polyfills/legacyDom.js';
import { initReveal } from './components/reveal.js';
import { initNav } from './components/nav.js';
import { initForms } from './components/form.js';
import { initSelects } from './components/select.js';
import { initBackToTop } from './components/backToTop.js';
import { initCookieBanner } from './components/cookieBanner.js';
import { initEnhancedTracking } from './components/enhancedTracking.js';
import { initAdvancedTracking } from './components/advancedTracking.js';
import './pages/index.js';

const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const logError = isDev ? console.error.bind(console) : () => {};

function safeInit(name, initFn) {
  try {
    if (typeof initFn === 'function') initFn();
  } catch (err) {
    logError(`[main.js] Failed to init ${name}:`, err);
  }
}

safeInit('reveal', initReveal);
safeInit('nav', initNav);
safeInit('forms', initForms);
safeInit('select', initSelects);
safeInit('backToTop', initBackToTop);
safeInit('cookieBanner', initCookieBanner);
safeInit('enhancedTracking', initEnhancedTracking);
safeInit('advancedTracking', initAdvancedTracking);

// Reset dataset flags při načtení z bfcache (tlačítko Zpět)
// Toto zajistí, že komponenty se reinicializují správně
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    // Nastavit flag, že probíhá reinicializace
    window.__lesktopReinitializing = true;
    
    // Reset všech dataset flags pro reinicializaci komponent
    const htmlEl = document.documentElement;
    const flagsToReset = [
      'revealInit',
      'navInit',
      'formInit',
      'selectInit',
      'backToTopInit',
      'cookieBannerInit',
      'enhancedTrackingInit',
      'advancedTrackingInit',
      'indexPageInit'
    ];
    
    flagsToReset.forEach(flag => {
      delete htmlEl.dataset[flag];
    });
    
    // Reinicializovat komponenty po resetu flags
    setTimeout(() => {
      safeInit('reveal', initReveal);
      safeInit('nav', initNav);
      safeInit('forms', initForms);
      safeInit('select', initSelects);
      safeInit('backToTop', initBackToTop);
      safeInit('cookieBanner', initCookieBanner);
      safeInit('enhancedTracking', initEnhancedTracking);
      safeInit('advancedTracking', initAdvancedTracking);
      
      // Označit, že reinicializace je dokončena
      window.__lesktopReinitializing = false;
      window.__lesktopReinitialized = true;
    }, 0);
  }
});
