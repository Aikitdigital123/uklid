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
