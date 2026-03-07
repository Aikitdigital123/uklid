# Struktura main.js

## 1. Importy

Všechny importy jsou dynamické (`import()`):

```javascript
import('./components/reveal.js').then(m => m.initReveal()).catch(() => {});
import('./components/nav.js').then(m => m.initNav()).catch(() => {});
import('./components/form.js').then(m => m.initForms()).catch(() => {});
import('./components/select.js').then(m => m.initSelects()).catch(() => {});
import('./components/backToTop.js').then(m => m.initBackToTop()).catch(() => {});
import('./components/cookieBanner.js').then(m => m.initCookieBanner()).catch(() => {});
import('./components/enhancedTracking.js').then(m => m.initEnhancedTracking()).catch(() => {});
import('./pages/index.js').catch(() => {});
```

## 2. Volání inicializace

Všechna volání inicializace jsou v `.then()` callbacku dynamických importů:

- `import('./components/reveal.js').then(m => m.initReveal())`
- `import('./components/nav.js').then(m => m.initNav())`
- `import('./components/form.js').then(m => m.initForms())`
- `import('./components/select.js').then(m => m.initSelects())`
- `import('./components/backToTop.js').then(m => m.initBackToTop())`
- `import('./components/cookieBanner.js').then(m => m.initCookieBanner())`
- `import('./components/enhancedTracking.js').then(m => m.initEnhancedTracking())`
- `import('./pages/index.js')` - bez volání funkce

## 3. DOMContentLoaded listener

```javascript
document.addEventListener('DOMContentLoaded', () => {
  // Místo pro inicializaci komponent (nav, modal, accordion...)
});
```

**Tělo listeneru:** prázdné (pouze komentář)
