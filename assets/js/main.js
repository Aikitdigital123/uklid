// main.js — vstupní bod pro JS
// Sem budeme postupně přidávat logiku a importy komponent/stránek.

// Příklad startu: jednoduchý helper pro 404/Privacy odkazování
// Inicializace nových komponent (idempotentní)
import('./components/reveal.js').then(m => m.initReveal()).catch(() => {});
import('./components/nav.js').then(m => m.initNav()).catch(() => {});
import('./components/form.js').then(m => m.initForms()).catch(() => {});
import('./components/select.js').then(m => m.initSelects()).catch(() => {});
import('./components/backToTop.js').then(m => m.initBackToTop()).catch(() => {});

// Připojíme stránkový JS (zatím monolit z backupu)
import('./pages/index.js').catch(() => {});

document.addEventListener('DOMContentLoaded', () => {
  // Místo pro inicializaci komponent (nav, modal, accordion...)
});
