// main.js — vstupní bod pro JS
// Sem budeme postupně přidávat logiku a importy komponent/stránek.

// Příklad startu: jednoduchý helper pro 404/Privacy odkazování
// Inicializace nových komponent (idempotentní)
import('./components/reveal.js').then(m => m.initReveal()).catch(() => {});
import('./components/nav.js').then(m => m.initNav()).catch(() => {});
import('./components/form.js').then(m => m.initForms()).catch(() => {});
import('./components/select.js').then(m => m.initSelects()).catch(() => {});
import('./components/backToTop.js').then(m => m.initBackToTop()).catch(() => {});
import('./components/advancedTracking.js').then(m => m.initAdvancedTracking()).catch(() => {});
import('./components/cookieBanner.js').then(m => m.initCookieBanner()).catch(() => {});

// Připojíme stránkový JS (zatím monolit z backupu)
import('./pages/index.js').catch(() => {});

document.addEventListener('DOMContentLoaded', () => {
  // Místo pro inicializaci komponent (nav, modal, accordion...)
});

window.gtag_report_conversion = function (url) {
  const callback = () => {
    if (typeof url !== 'undefined') {
      window.location = url;
    }
  };
  if (window.gtag) {
    gtag('event', 'conversion', {
      send_to: 'AW-17893281939/XoMGCP-N4-kbEJOhl9RC',
      event_callback: callback,
    });
  } else {
    callback();
  }
  return false;
};

document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="tel:"]');
  if (link) {
    e.preventDefault();
    window.gtag_report_conversion(link.href);
  }
});
