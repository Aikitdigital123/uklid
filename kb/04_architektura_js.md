# Architektura JavaScriptu

## 1. Moduly importované v main.js

V souboru `main.js` jsou importovány následující moduly (v pořadí podle řádků 6-15):

1. `./components/reveal.js` - exportuje `initReveal`
2. `./components/nav.js` - exportuje `initNav`
3. `./components/form.js` - exportuje `initForms`
4. `./components/select.js` - exportuje `initSelects`
5. `./components/backToTop.js` - exportuje `initBackToTop`
6. `./components/cookieBanner.js` - exportuje `initCookieBanner`
7. `./components/enhancedTracking.js` - exportuje `initEnhancedTracking`
8. `./pages/index.js` - import bez volání funkce

Všechny importy používají dynamický import (`.then()`) s `.catch()` bloky pro error handling. Chyby při inicializaci modulů se logují pouze v dev módu (localhost/127.0.0.1) pomocí `console.error`, v produkci jsou potlačené pro graceful degradation (chyba v jednom modulu neblokuje ostatní).

## 2. Pořadí inicializace

Moduly se načítají paralelně pomocí dynamických importů (`import()`). Není garantované pevné pořadí spuštění inicializačních funkcí, protože každý import je asynchronní a nečeká na dokončení předchozího.

Všechny inicializační funkce jsou volány v `.then()` callbacku dynamických importů bez čekání na dokončení předchozího modulu:

- `initReveal()` - reveal.js
- `initNav()` - nav.js
- `initForms()` - form.js
- `initSelects()` - select.js
- `initBackToTop()` - backToTop.js
- `initCookieBanner()` - cookieBanner.js
- `initEnhancedTracking()` - enhancedTracking.js
- `index.js` - spouští se při `DOMContentLoaded` (řádek 5)

Závislosti mezi moduly jsou řešeny kontrolami existence funkcí (např. `typeof window.lesktopTrackEvent === 'function'`), nikoliv garantovaným pořadím inicializace.

## 3. Funkcionalita jednotlivých modulů

### reveal.js - `initReveal()`
Přidává třídu `js` na `<html>` element a inicializuje IntersectionObserver pro animaci zobrazení sekcí při scrollování. Elementy s třídou `.reveal-on-scroll` získají třídu `is-visible` při vstupu do viewportu. Pokud IntersectionObserver není dostupný, přidá třídu `is-visible` všem sekcím okamžitě.

### nav.js - `initNav()`
Inicializuje navigaci: nastavuje ARIA atributy pro přístupnost, obsluhuje smooth scroll pro anchor odkazy v navigaci a logo (s automatickým zavřením mobilního menu při kliknutí na mobilních zařízeních ≤768px), přepíná mobilní menu pomocí tlačítka `.nav-toggle`, automaticky zavírá menu při změně velikosti okna na desktop (resize handler je throttlovaný 150ms pro optimalizaci výkonu a používá passive flag). Opraveno: odstraněny duplicitní listenery na navLinks a přidán throttling pro resize handler.

### form.js - `initForms()`
Obsluhuje odesílání dvou formulářů (`#contactForm` a `#kalkulacka`) přes Web3Forms API pomocí fetch. Při odesílání zobrazuje loading stav, po úspěchu zobrazí zprávu a resetuje formulář, při chybě zobrazí chybovou zprávu. Po úspěšném odeslání volá `window.lesktopTrackEvent` pro tracking konverzí do Google Ads a Analytics. Obsahuje ochranu proti double submit (dataset lock na formuláři + kontrola disabled stavu) a robustní error handling včetně parsování JSON odpovědi s try/catch.

### select.js - `initSelects()`
Transformuje nativní `<select>` elementy (`#cleaningType` a `#cleaningFrequency`) na custom UI komponenty s vlastním menu. Synchronizuje hodnoty mezi nativním selectem a custom UI, obsluhuje otevírání/zavírání menu, výběr možností a uzavření při kliknutí mimo nebo stisknutí Escape. Používá globální document listenery (click a keydown) pro zavírání všech otevřených selectů, které se přidají pouze jednou při inicializaci, aby se zabránilo duplicitním listenerům při více selectech na stránce. Komponenta je plně přístupná (A11y): používá ARIA atributy (`aria-controls`, `aria-expanded`, `aria-selected`, `role="listbox"`, `role="option"`), podporuje kompletní keyboard ovládání (Enter/Space pro otevření/zavření, Arrow keys pro navigaci, Escape pro zavření) a správně spravuje focus (po otevření se focus přesune na první možnost, po zavření se vrátí na trigger).

### backToTop.js - `initBackToTop()`
Dynamicky vytváří tlačítko "Zpět nahoru" a přidává ho do `<body>`. Tlačítko se zobrazí při scrollování více než 200px dolů (přidá třídu `visible`). Při kliknutí scrolluje na začátek stránky s `behavior: 'smooth'`. Scroll listener používá `requestAnimationFrame` throttling pro optimalizaci výkonu a `passive: true` flag.

### cookieBanner.js - `initCookieBanner()`
Inicializuje cookie banner: kontroluje localStorage pro uložený souhlas (s try/catch pro private browsing), pokud je `all`, načte Google Analytics a skryje banner, pokud je `necessary`, zakáže GA a skryje banner. Při kliknutí na "Souhlasím" uloží souhlas, načte GA4 a Google Ads skripty a definuje globální funkci `window.lesktopTrackEvent`. Při kliknutí na "Jen nezbytné" uloží preferenci a smaže GA cookies. Používá idempotence guard (`dataset.cookieBannerInit`) a všechny localStorage operace jsou chráněny try/catch pro graceful degradation.

### enhancedTracking.js - `initEnhancedTracking()`
Přidává tracking pro různé interakce: kliknutí na telefonní odkazy (`tel:`), kliknutí na email odkazy (`mailto:`), kliknutí na externí odkazy (sociální sítě), viditelnost sekcí pomocí IntersectionObserver (tracking při 50% viditelnosti sekce). Všechny události se odesílají přes `window.lesktopTrackEvent`.

### index.js (pages/index.js)
Spouští se při `DOMContentLoaded`. Obsluhuje logiku pro zobrazení/skrytí pole "Frekvence úklidu" (`#frequencyGroup`) podle hodnoty v `#cleaningType`. Pole se zobrazí pouze pro "Pravidelný úklid domácnosti" nebo "Úklid komerčních prostor (kanceláře, obchody)". Modul je idempotentní přes `dataset.indexPageInit` guard, který se nastavuje až po ověření existence cílových elementů (#cleaningType, #frequencyGroup, #cleaningFrequency).

## 4. Obsluhované události

### reveal.js
- Žádné explicitní event listenery (používá IntersectionObserver)

### nav.js
- `click` na `.nav-link[href^="#"]` - smooth scroll a zavření mobilního menu (pouze na mobilních zařízeních ≤768px)
- `click` na `.brand[href^="#"]` - smooth scroll pro logo
- `click` na `.nav-toggle` - přepnutí mobilního menu
- `resize` na `window` (throttled 150ms) - zavření menu při přechodu na desktop (>768px)

### form.js
- `submit` na `#contactForm` - odeslání kontaktního formuláře
- `submit` na `#kalkulacka` - odeslání kalkulačního formuláře

### select.js
- `click` na `.select-trigger` - otevření/zavření custom select menu
- `click` na `.select-option` - výběr možnosti
- `click` na `document` - zavření menu při kliknutí mimo
- `keydown` na `document` - zavření menu při Escape
- `change` na nativním selectu - dispatchuje se po změně hodnoty

### backToTop.js
- `click` na tlačítko `.back-to-top` - scroll na začátek stránky
- `scroll` na `window` (throttled via requestAnimationFrame, passive: true) - zobrazení/skrytí tlačítka podle pozice
- `load` na `window` - kontrola pozice při načtení stránky

### cookieBanner.js
- `click` na `#cookie-accept` - uložení souhlasu a načtení GA
- `click` na `#cookie-necessary` - uložení preference a zakázání GA

### enhancedTracking.js
- `click` na `a[href^="tel:"]` - tracking telefonních odkazů
- `click` na `a[href^="mailto:"]` - tracking email odkazů
- `click` na `a[target="_blank"]` (externí odkazy) - tracking externích odkazů
- IntersectionObserver na `section[id]` - tracking viditelnosti sekcí

### advancedTracking.js (není importován v main.js)
- `scroll` na `window` - tracking hloubky scrollování (25%, 50%, 75%, 100%)
- `setTimeout` - tracking času na stránce (60 sekund)

### index.js
- `DOMContentLoaded` na `document` - inicializace logiky pro frekvenci úklidu
- `change` na `#cleaningType` - zobrazení/skrytí pole frekvence

## 5. Závislosti mezi moduly

### Závislosti na cookieBanner.js

**enhancedTracking.js** závisí na `cookieBanner.js`:
- Používá globální funkci `window.lesktopTrackEvent`, která je definována v `cookieBanner.js` (řádek 14-21)
- V `enhancedTracking.js` je kontrola `typeof window.lesktopTrackEvent === 'function'` (řádek 8)

**form.js** závisí na `cookieBanner.js`:
- Používá `window.lesktopTrackEvent` pro tracking konverzí (řádky 56, 62, 133, 145)
- Kontroluje existenci funkce před voláním: `if (window.lesktopTrackEvent)`

**advancedTracking.js** (není importován v main.js):
- Používá `window.gtag`, který je načten v `cookieBanner.js` při souhlasu s cookies
- Kontroluje existenci: `typeof window.gtag === 'function'` (řádek 5)

### Řešení závislostí

Závislosti mezi moduly nejsou řešeny garantovaným pořadím inicializace (dynamické importy se načítají paralelně), ale kontrolami existence funkcí. Například `enhancedTracking.js` kontroluje `typeof window.lesktopTrackEvent === 'function'` před použitím, takže funguje i když se inicializuje před `cookieBanner.js`.

### Idempotence

Všechny moduly jsou idempotentní - používají kontrolu `document.documentElement.dataset.[modul]Init === '1'` nebo podobnou ochranu proti vícenásobné inicializaci:
- `reveal.js`: `dataset.revealInit` (řádek 6)
- `nav.js`: `dataset.navInit` (řádek 6)
- `form.js`: `dataset.formInit` (řádek 9)
- `select.js`: `dataset.selectInit` (řádek 6)
- `backToTop.js`: `dataset.backToTopInit` (řádek 5)
- `cookieBanner.js`: `dataset.cookieBannerInit` (řádek 2, nastavuje se až po ověření existence banneru)
- `enhancedTracking.js`: `dataset.enhancedTrackingInit` (řádek 5)
- `advancedTracking.js`: `dataset.advancedTrackingInit` (řádek 2)
