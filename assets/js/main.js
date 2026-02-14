// main.js — vstupní bod pro JS
// Sem budeme postupně přidávat logiku a importy komponent/stránek.

// Helper pro podmíněné logování (jen v dev módu)
const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const logError = isDev ? console.error.bind(console) : () => {};

// Příklad startu: jednoduchý helper pro 404/Privacy odkazování
// Inicializace nových komponent (idempotentní)
import('./components/reveal.js').then(m => m.initReveal()).catch((err) => { logError('[main.js] Failed to init reveal:', err); });
import('./components/nav.js').then(m => m.initNav()).catch((err) => { logError('[main.js] Failed to init nav:', err); });
import('./components/form.js').then(m => m.initForms()).catch((err) => { logError('[main.js] Failed to init forms:', err); });
import('./components/select.js').then(m => m.initSelects()).catch((err) => { logError('[main.js] Failed to init select:', err); });
import('./components/backToTop.js').then(m => m.initBackToTop()).catch((err) => { logError('[main.js] Failed to init backToTop:', err); });
import('./components/cookieBanner.js').then(m => m.initCookieBanner()).catch((err) => { logError('[main.js] Failed to init cookieBanner:', err); });
import('./components/enhancedTracking.js').then(m => m.initEnhancedTracking()).catch((err) => { logError('[main.js] Failed to init enhancedTracking:', err); });
import('./components/advancedTracking.js').then(m => m.initAdvancedTracking()).catch((err) => { logError('[main.js] Failed to init advancedTracking:', err); });

// Připojíme stránkový JS (zatím monolit z backupu)
import('./pages/index.js').catch((err) => { logError('[main.js] Failed to init pages/index:', err); });

document.addEventListener('DOMContentLoaded', () => {
  // Místo pro inicializaci komponent (nav, modal, accordion...)
});
