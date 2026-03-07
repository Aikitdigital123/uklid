# Audit JavaScript vs Dokumentace - Lesktop Project

**Datum auditu:** 2025-01-XX  
**Soubory kontrolované:** `/assets/js/main.js`, `/assets/js/components/*.js`, `/assets/js/pages/*.js`  
**Dokumentace kontrolovaná:** `kb/04_architektura_js.md`, `kb/05_mainjs_skeleton.md`, `kb/10_index_modulu.md`, `kb/12_architektura_systemu.md`

---

## 1. Importy v main.js vs dokumentace

### ✅ Importy v main.js, které JSOU v dokumentaci

**Všechny importy v `main.js` jsou správně dokumentované v `kb/05_mainjs_skeleton.md` a `kb/04_architektura_js.md`:**

1. `import('./components/reveal.js').then(m => m.initReveal()).catch(() => {});` (řádek 6) ✓
2. `import('./components/nav.js').then(m => m.initNav()).catch(() => {});` (řádek 7) ✓
3. `import('./components/form.js').then(m => m.initForms()).catch(() => {});` (řádek 8) ✓
4. `import('./components/select.js').then(m => m.initSelects()).catch(() => {});` (řádek 9) ✓
5. `import('./components/backToTop.js').then(m => m.initBackToTop()).catch(() => {});` (řádek 10) ✓
6. `import('./components/cookieBanner.js').then(m => m.initCookieBanner()).catch(() => {});` (řádek 11) ✓
7. `import('./components/enhancedTracking.js').then(m => m.initEnhancedTracking()).catch(() => {});` (řádek 12) ✓
8. `import('./pages/index.js').catch(() => {});` (řádek 15) ✓

### ⚠️ Moduly, které existují, ale NEOBSAHUJE main.js

**`advancedTracking.js`** existuje v `/assets/js/components/`, ale **NENÍ importován v `main.js`**.

- **Skutečnost:** Soubor existuje a exportuje `initAdvancedTracking()`
- **Dokumentace:** `kb/04_architektura_js.md` správně uvádí: "advancedTracking.js (není importován v main.js)" (řádek 99)
- **Status:** ✅ Dokumentace je správná - modul existuje, ale není aktivní

---

## 2. Inicializace modulů vs dokumentace

### ✅ Inicializační funkce v dokumentaci

**Všechny inicializační funkce jsou správně dokumentované:**

- `initReveal()` - reveal.js ✓
- `initNav()` - nav.js ✓
- `initForms()` - form.js ✓
- `initSelects()` - select.js ✓
- `initBackToTop()` - backToTop.js ✓
- `initCookieBanner()` - cookieBanner.js ✓
- `initEnhancedTracking()` - enhancedTracking.js ✓
- `initAdvancedTracking()` - advancedTracking.js (není importován) ✓
- `index.js` - DOMContentLoaded listener ✓

### ⚠️ Nesoulady v inicializaci

**Žádné nesoulady.** Všechny inicializační funkce odpovídají dokumentaci. ✓

---

## 3. Idempotence vs dokumentace

### ✅ Idempotentní moduly v dokumentaci

**Dokumentace (`kb/04_architektura_js.md`, řádky 127-137) uvádí idempotentní kontrolu pro:**

1. **reveal.js** - `dataset.revealInit` (řádek 6) ✓
   - **Skutečnost:** `if (document.documentElement.dataset.revealInit === '1') return;` (řádek 6)
   - **Status:** ✅ Správně

2. **nav.js** - `dataset.navInit` (řádek 6) ✓
   - **Skutečnost:** `if (document.documentElement.dataset.navInit === '1') return;` (řádek 6)
   - **Status:** ✅ Správně

3. **form.js** - `dataset.formInit` (řádek 9) ✓
   - **Skutečnost:** `if (document.documentElement.dataset.formInit === '1') return;` (řádek 9)
   - **Status:** ✅ Správně

4. **select.js** - `dataset.selectInit` (řádek 6) ✓
   - **Skutečnost:** `if (document.documentElement.dataset.selectInit === '1') return;` (řádek 6)
   - **Status:** ✅ Správně

5. **backToTop.js** - `dataset.backToTopInit` (řádek 5) ✓
   - **Skutečnost:** `if (document.documentElement.dataset.backToTopInit === '1') return;` (řádek 5)
   - **Status:** ✅ Správně

6. **enhancedTracking.js** - `dataset.enhancedTrackingInit` (řádek 5) ✓
   - **Skutečnost:** `if (document.documentElement.dataset.enhancedTrackingInit === '1') return;` (řádek 5)
   - **Status:** ✅ Správně

7. **advancedTracking.js** - `dataset.advancedTrackingInit` (řádek 2) ✓
   - **Skutečnost:** `if (document.documentElement.dataset.advancedTrackingInit === '1') return;` (řádek 2)
   - **Status:** ✅ Správně

8. **cookieBanner.js** - žádná explicitní kontrola ✓
   - **Dokumentace:** "žádná explicitní kontrola (ale kontroluje existenci banneru)" (řádek 135)
   - **Skutečnost:** `const banner = document.getElementById('cookie-banner'); if (!banner) return;` (řádek 2-3)
   - **Status:** ✅ Správně - kontrola existence elementu místo dataset flagu

### ⚠️ Nesoulady v idempotenci

**Žádné nesoulady.** Všechny moduly mají správnou idempotentní kontrolu podle dokumentace. ✓

---

## 4. Závislosti vs dokumentace

### ✅ Závislosti v dokumentaci

**Dokumentace (`kb/04_architektura_js.md`, řádky 107-125) správně uvádí závislosti:**

1. **enhancedTracking.js závisí na cookieBanner.js:**
   - **Dokumentace:** Používá `window.lesktopTrackEvent`, kontrola `typeof window.lesktopTrackEvent === 'function'`
   - **Skutečnost:** `const canTrack = () => typeof window.lesktopTrackEvent === 'function';` (řádek 8)
   - **Status:** ✅ Správně

2. **form.js závisí na cookieBanner.js:**
   - **Dokumentace:** Používá `window.lesktopTrackEvent`, kontrola `if (window.lesktopTrackEvent)`
   - **Skutečnost:** `if (window.lesktopTrackEvent) { ... }` (řádky 56, 133)
   - **Status:** ✅ Správně

3. **advancedTracking.js závisí na cookieBanner.js:**
   - **Dokumentace:** Používá `window.gtag`, kontrola `typeof window.gtag === 'function'`
   - **Skutečnost:** `const canTrack = () => typeof window.gtag === 'function';` (řádek 5)
   - **Status:** ✅ Správně

### ⚠️ Skryté závislosti

**Žádné skryté závislosti.** Všechny závislosti jsou správně dokumentované. ✓

**Poznámka:** `index.js` (pages/index.js) používá `#cleaningType` a `#cleaningFrequency`, které jsou transformovány `select.js`, ale to není závislost - `index.js` pracuje s nativním selectem, který existuje v HTML.

---

## 5. Graceful degradation vs dokumentace

### ✅ Graceful degradation v dokumentaci

**Dokumentace správně uvádí graceful degradation:**

1. **Dynamické importy s `.catch(() => {})`:**
   - **Dokumentace:** "Všechny importy používají dynamický import (`.then()`) s `.catch(() => {})` pro potlačení chyb" (`kb/04_architektura_js.md`, řádek 16)
   - **Skutečnost:** Všechny importy v `main.js` mají `.catch(() => {})` ✓
   - **Status:** ✅ Správně

2. **Kontrola existence elementů:**
   - **Dokumentace:** "Kontrola existence elementů před manipulací" (`kb/12_architektura_systemu.md`)
   - **Skutečnost:** Všechny moduly kontrolují existenci elementů:
     - `reveal.js`: `if (!revealSections.length) return;` (řádek 11)
     - `nav.js`: `if (menuToggle) { ... }` (řádek 14)
     - `form.js`: `if (contactForm && formStatusContact) { ... }` (řádek 17)
     - `select.js`: `if (!nativeSelect || nativeSelect.classList.contains('select-hidden')) return;` (řádek 10)
     - `cookieBanner.js`: `if (!banner) return;` (řádek 3)
     - `enhancedTracking.js`: `if (canTrack()) { ... }` (řádek 8)
   - **Status:** ✅ Správně

3. **Kontrola existence funkcí:**
   - **Dokumentace:** "Kontrola existence funkcí před jejich voláním" (`kb/12_architektura_systemu.md`)
   - **Skutečnost:** 
     - `enhancedTracking.js`: `const canTrack = () => typeof window.lesktopTrackEvent === 'function';` (řádek 8)
     - `form.js`: `if (window.lesktopTrackEvent) { ... }` (řádky 56, 133)
     - `advancedTracking.js`: `const canTrack = () => typeof window.gtag === 'function';` (řádek 5)
   - **Status:** ✅ Správně

### ⚠️ Nesoulady v graceful degradation

**Žádné nesoulady.** Všechny moduly implementují graceful degradation podle dokumentace. ✓

---

## 6. Event handlery vs dokumentace

### ✅ Event handlery v dokumentaci

**Dokumentace (`kb/04_architektura_js.md`, řádky 61-106) správně uvádí event handlery:**

1. **reveal.js:**
   - **Dokumentace:** "Žádné explicitní event listenery (používá IntersectionObserver)"
   - **Skutečnost:** Používá `IntersectionObserver`, žádné `addEventListener` ✓
   - **Status:** ✅ Správně

2. **nav.js:**
   - **Dokumentace:** `click` na `.nav-link[href^="#"]`, `.brand[href^="#"]`, `.nav-toggle`, `.nav-link` v mobilním menu, `resize` na `window`
   - **Skutečnost:** 
     - `click` na `.site-nav .nav-link[href^="#"]` (řádek 24)
     - `click` na `a.brand[href^="#"]` (řádek 50)
     - `click` na `.nav-toggle` (řádek 66)
     - `click` na `.nav-link` v mobilním menu (řádek 74)
     - `resize` na `window` (řádek 84)
   - **Status:** ✅ Správně

3. **form.js:**
   - **Dokumentace:** `submit` na `#contactForm` a `#kalkulacka`
   - **Skutečnost:** 
     - `submit` na `#contactForm` (řádek 18)
     - `submit` na `#kalkulacka` (řádek 95)
   - **Status:** ✅ Správně

4. **select.js:**
   - **Dokumentace:** `click` na `.select-trigger`, `.select-option`, `document`, `keydown` na `document`, `change` na nativním selectu
   - **Skutečnost:**
     - `click` na `.select-trigger` (řádek 60)
     - `click` na `.select-menu` (řádek 64)
     - `click` na `document` (řádek 83)
     - `keydown` na `document` (řádek 84)
     - `change` event dispatch (řádek 77)
   - **Status:** ✅ Správně

5. **backToTop.js:**
   - **Dokumentace:** `click` na `.back-to-top`, `scroll` na `window`, `load` na `window`
   - **Skutečnost:**
     - `click` na tlačítko (řádek 14)
     - `scroll` na `window` (řádek 26)
     - `load` na `window` (řádek 27)
   - **Status:** ✅ Správně

6. **cookieBanner.js:**
   - **Dokumentace:** `click` na `#cookie-accept` a `#cookie-necessary`
   - **Skutečnost:**
     - `click` na `#cookie-accept` (řádek 87)
     - `click` na `#cookie-necessary` (řádek 95)
   - **Status:** ✅ Správně

7. **enhancedTracking.js:**
   - **Dokumentace:** `click` na `a[href^="tel:"]`, `a[href^="mailto:"]`, `a[target="_blank"]`, IntersectionObserver na `section[id]`
   - **Skutečnost:**
     - `click` na `a[href^="tel:"]` (řádek 12)
     - `click` na `a[href^="mailto:"]` (řádek 32)
     - `click` na `a[target="_blank"]` (řádek 45)
     - IntersectionObserver na `section[id]` (řádek 60)
   - **Status:** ✅ Správně

8. **advancedTracking.js:**
   - **Dokumentace:** `scroll` na `window`, `setTimeout`
   - **Skutečnost:**
     - `scroll` na `window` (řádek 38)
     - `setTimeout` (řádek 41)
   - **Status:** ✅ Správně

9. **index.js:**
   - **Dokumentace:** `DOMContentLoaded` na `document`, `change` na `#cleaningType`
   - **Skutečnost:**
     - `DOMContentLoaded` na `document` (řádek 5)
     - `change` na `#cleaningType` (řádek 26)
   - **Status:** ✅ Správně

### ⚠️ Nesoulady v event handlerech

**Žádné nesoulady.** Všechny event handlery odpovídají dokumentaci. ✓

---

## 7. Porušení architektury

### ✅ Architektura v dokumentaci

**Dokumentace správně popisuje architekturu:**

1. **Dynamické importy:**
   - **Dokumentace:** "Všechny importy používají dynamický import" (`kb/04_architektura_js.md`, řádek 16)
   - **Skutečnost:** Všechny importy v `main.js` jsou dynamické (`import()`) ✓
   - **Status:** ✅ Správně

2. **Paralelní načítání:**
   - **Dokumentace:** "Moduly se načítají paralelně pomocí dynamických importů" (`kb/04_architektura_js.md`, řádek 20)
   - **Skutečnost:** Všechny importy jsou asynchronní, nečekají na dokončení předchozího ✓
   - **Status:** ✅ Správně

3. **Idempotentní inicializace:**
   - **Dokumentace:** "Všechny moduly jsou idempotentní" (`kb/04_architektura_js.md`, řádek 127)
   - **Skutečnost:** Všechny moduly mají idempotentní kontrolu ✓
   - **Status:** ✅ Správně

4. **Graceful degradation:**
   - **Dokumentace:** "Moduly mohou selhat individuálně bez ovlivnění celku" (`kb/12_architektura_systemu.md`)
   - **Skutečnost:** Všechny importy mají `.catch(() => {})` ✓
   - **Status:** ✅ Správně

### ⚠️ Porušení architektury

**Žádné porušení architektury.** Všechny moduly dodržují architekturu podle dokumentace. ✓

---

## 8. Nepopsané moduly

### ✅ Všechny moduly jsou v dokumentaci

**Všechny moduly jsou správně dokumentované:**

1. **reveal.js** - `kb/04_architektura_js.md` (řádek 37) ✓
2. **nav.js** - `kb/04_architektura_js.md` (řádek 40) ✓
3. **form.js** - `kb/04_architektura_js.md` (řádek 43) ✓
4. **select.js** - `kb/04_architektura_js.md` (řádek 46) ✓
5. **backToTop.js** - `kb/04_architektura_js.md` (řádek 49) ✓
6. **cookieBanner.js** - `kb/04_architektura_js.md` (řádek 52) ✓
7. **enhancedTracking.js** - `kb/04_architektura_js.md` (řádek 55) ✓
8. **advancedTracking.js** - `kb/04_architektura_js.md` (řádek 99) ✓
9. **index.js** - `kb/04_architektura_js.md` (řádek 58) ✓

### ⚠️ Chybějící moduly v dokumentaci

**Žádné chybějící moduly.** Všechny moduly jsou v dokumentaci. ✓

---

## 9. Chybějící inicializace

### ✅ Všechny inicializace jsou v main.js

**Všechny moduly importované v `main.js` mají inicializaci:**

1. `reveal.js` - `initReveal()` voláno v `.then()` ✓
2. `nav.js` - `initNav()` voláno v `.then()` ✓
3. `form.js` - `initForms()` voláno v `.then()` ✓
4. `select.js` - `initSelects()` voláno v `.then()` ✓
5. `backToTop.js` - `initBackToTop()` voláno v `.then()` ✓
6. `cookieBanner.js` - `initCookieBanner()` voláno v `.then()` ✓
7. `enhancedTracking.js` - `initEnhancedTracking()` voláno v `.then()` ✓
8. `index.js` - import bez volání funkce (má vlastní DOMContentLoaded) ✓

### ⚠️ Chybějící inicializace

**Žádné chybějící inicializace.** Všechny moduly jsou správně inicializovány. ✓

**Poznámka:** `advancedTracking.js` není importován v `main.js`, což je správně dokumentované.

---

## 10. Detailní kontroly

### reveal.js

**Kontrola:**
- ✅ Idempotence: `dataset.revealInit` (řádek 6)
- ✅ Graceful degradation: kontrola existence elementů (řádek 11)
- ✅ IntersectionObserver fallback: pokud není dostupný, přidá třídu okamžitě (řádek 40)
- ✅ Přidává třídu `js` na `<html>` (řádek 8) - **není v dokumentaci explicitně uvedeno**

**Nesoulad:** Třída `js` přidaná na `<html>` není v dokumentaci zmíněna.

### nav.js

**Kontrola:**
- ✅ Idempotence: `dataset.navInit` (řádek 6)
- ✅ Graceful degradation: kontrola existence elementů (řádky 14, 50, 65)
- ✅ ARIA atributy: nastavuje `aria-expanded`, `aria-controls` (řádky 15, 17, 18)
- ✅ Smooth scroll: správně implementován s offsetem pro header (řádky 37-40, 57-60)
- ✅ Mobilní menu: správně implementováno (řádky 65-89)
- ✅ Zakomentovaný kód: scroll effect je zakomentovaný (řádky 92-107) - **dokumentace to správně uvádí**

**Nesoulad:** Žádný.

### form.js

**Kontrola:**
- ✅ Idempotence: `dataset.formInit` (řádek 9)
- ✅ Graceful degradation: kontrola existence elementů (řádky 17, 94)
- ✅ Error handling: `try-catch` bloky (řádky 35, 112)
- ✅ Tracking: kontrola `window.lesktopTrackEvent` (řádky 56, 133)
- ✅ Dev mode logging: `isDev` a `logError` (řádky 5-6) - **není v dokumentaci**

**Nesoulad:** Dev mode logging není v dokumentaci zmíněn.

### select.js

**Kontrola:**
- ✅ Idempotence: `dataset.selectInit` (řádek 6)
- ✅ Graceful degradation: kontrola existence elementů (řádek 10)
- ✅ ARIA atributy: `aria-haspopup`, `aria-expanded`, `role`, `aria-selected` (řádky 19, 20, 30, 36, 41, 75)
- ✅ Accessibility: správně implementováno

**Nesoulad:** Žádný.

### backToTop.js

**Kontrola:**
- ✅ Idempotence: `dataset.backToTopInit` (řádek 5)
- ✅ Dynamické vytvoření: tlačítko je vytvořeno v JS (řádek 8)
- ✅ Scroll threshold: 200px (řádek 22) - **dokumentace uvádí správně**
- ✅ Passive event listener: `{ passive: true }` (řádek 26) - **není v dokumentaci**

**Nesoulad:** Passive event listener není v dokumentaci zmíněn.

### cookieBanner.js

**Kontrola:**
- ✅ Graceful degradation: kontrola existence banneru (řádek 2)
- ✅ localStorage: používá `lesktop_cookie_consent` (řádek 7)
- ✅ Globální funkce: definuje `window.lesktopTrackEvent` (řádek 14)
- ✅ Globální proměnné: `window.gtag`, `window.dataLayer`, `window.__lesktopGtagLoaded` (řádky 29, 33, 26)
- ✅ 404 tracking: kontroluje `document.body?.dataset.page === '404'` (řádek 57) - **není v dokumentaci explicitně**

**Nesoulad:** 404 tracking není v dokumentaci explicitně zmíněn.

### enhancedTracking.js

**Kontrola:**
- ✅ Idempotence: `dataset.enhancedTrackingInit` (řádek 5)
- ✅ Graceful degradation: kontrola `canTrack()` (řádek 8)
- ✅ Data atributy: používá `dataset.location` (řádek 15) - **není v dokumentaci**
- ✅ Tracking flag: používá `dataset.tracked` pro sekce (řádek 71) - **není v dokumentaci**

**Nesoulad:** Použití `data-location` a `data-tracked` není v dokumentaci zmíněno.

### advancedTracking.js

**Kontrola:**
- ✅ Idempotence: `dataset.advancedTrackingInit` (řádek 2)
- ✅ Graceful degradation: kontrola `canTrack()` (řádek 5)
- ✅ Scroll depth: thresholds [25, 50, 75, 100] (řádek 7)
- ✅ RequestAnimationFrame: používá pro optimalizaci (řádek 14) - **není v dokumentaci**
- ✅ Time tracking: 60 sekund (řádek 41)

**Nesoulad:** RequestAnimationFrame optimalizace není v dokumentaci zmíněna.

### index.js

**Kontrola:**
- ✅ DOMContentLoaded: správně implementováno (řádek 5)
- ✅ Graceful degradation: kontrola existence elementů (řádek 11)
- ✅ Logika frekvence: správně implementována (řádky 12-23)
- ✅ Required atribut: dynamicky přidává/odebírá (řádky 17, 20) - **není v dokumentaci**

**Nesoulad:** Dynamické přidávání/odebírání `required` atributu není v dokumentaci zmíněno.

---

## 11. Shrnutí zjištění

### ✅ Pozitivní zjištění

1. **Všechny importy jsou správně dokumentované** - `main.js` odpovídá dokumentaci
2. **Všechny moduly jsou idempotentní** - implementace odpovídá dokumentaci
3. **Závislosti jsou správně dokumentované** - všechny závislosti jsou uvedeny
4. **Graceful degradation je implementována** - všechny moduly mají správnou implementaci
5. **Event handlery jsou správně dokumentované** - všechny handlery jsou uvedeny
6. **Architektura je dodržována** - žádné porušení architektury

### ⚠️ Drobné nesoulady (nízká priorita)

1. **reveal.js:**
   - Třída `js` přidaná na `<html>` není v dokumentaci zmíněna

2. **form.js:**
   - Dev mode logging (`isDev`, `logError`) není v dokumentaci zmíněn

3. **backToTop.js:**
   - Passive event listener (`{ passive: true }`) není v dokumentaci zmíněn

4. **cookieBanner.js:**
   - 404 tracking (`document.body?.dataset.page === '404'`) není v dokumentaci explicitně zmíněn

5. **enhancedTracking.js:**
   - Použití `data-location` atributu není v dokumentaci zmíněno
   - Použití `data-tracked` atributu pro sekce není v dokumentaci zmíněno

6. **advancedTracking.js:**
   - RequestAnimationFrame optimalizace není v dokumentaci zmíněna

7. **index.js:**
   - Dynamické přidávání/odebírání `required` atributu není v dokumentaci zmíněno

### 📋 Doporučené opravy

**Priorita: Nízká** - Jedná se o drobné detaily implementace, které neovlivňují hlavní funkcionalitu.

1. **Aktualizovat `kb/04_architektura_js.md`:**
   - Přidat poznámku o třídě `js` v reveal.js
   - Přidat poznámku o dev mode logging v form.js
   - Přidat poznámku o passive event listener v backToTop.js
   - Přidat poznámku o 404 tracking v cookieBanner.js
   - Přidat poznámku o `data-location` a `data-tracked` v enhancedTracking.js
   - Přidat poznámku o RequestAnimationFrame v advancedTracking.js
   - Přidat poznámku o dynamickém `required` atributu v index.js

---

## 12. Závěr

**Celkové hodnocení:** Dokumentace JavaScript je v **výborném stavu**. Všechny hlavní aspekty (importy, inicializace, idempotence, závislosti, graceful degradation) jsou správně dokumentované a odpovídají skutečnému kódu.

**Nalezené nesoulady jsou pouze drobné detaily implementace** (např. třída `js`, dev mode logging, passive event listeners), které neovlivňují hlavní funkcionalitu ani architekturu.

**Priorita oprav:**
- **Nízká:** Doplňující detaily implementace do dokumentace (volitelné)

**Odhadovaný čas na opravy:** 15-20 minut (volitelné)
