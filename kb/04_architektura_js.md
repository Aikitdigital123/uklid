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

Všechny importy používají dynamický import (`.then()`) s `.catch(() => {})` pro potlačení chyb.

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
Inicializuje navigaci: nastavuje ARIA atributy pro přístupnost, obsluhuje smooth scroll pro anchor odkazy v navigaci a logo, přepíná mobilní menu pomocí tlačítka `.nav-toggle`, automaticky zavírá menu při kliknutí na odkaz na mobilních zařízeních (≤768px) a při změně velikosti okna na desktop.

### form.js - `initForms()`
Obsluhuje odesílání dvou formulářů (`#contactForm` a `#kalkulacka`) přes Web3Forms API pomocí fetch. Při odesílání zobrazuje loading stav, po úspěchu zobrazí zprávu a resetuje formulář, při chybě zobrazí chybovou zprávu. Po úspěšném odeslání volá `window.lesktopTrackEvent` pro tracking konverzí do Google Ads a Analytics.

### select.js - `initSelects()`
Transformuje nativní `<select>` elementy (`#cleaningType` a `#cleaningFrequency`) na custom UI komponenty s vlastním menu. Synchronizuje hodnoty mezi nativním selectem a custom UI, obsluhuje otevírání/zavírání menu, výběr možností a uzavření při kliknutí mimo nebo stisknutí Escape.

### backToTop.js - `initBackToTop()`
Dynamicky vytváří tlačítko "Zpět nahoru" a přidává ho do `<body>`. Tlačítko se zobrazí při scrollování více než 200px dolů (přidá třídu `visible`). Při kliknutí scrolluje na začátek stránky s `behavior: 'smooth'`.

### cookieBanner.js - `initCookieBanner()`
Inicializuje cookie banner: kontroluje localStorage pro uložený souhlas, pokud je `all`, načte Google Analytics a skryje banner, pokud je `necessary`, zakáže GA a skryje banner. Při kliknutí na "Souhlasím" uloží souhlas, načte GA4 a Google Ads skripty a definuje globální funkci `window.lesktopTrackEvent`. Při kliknutí na "Jen nezbytné" uloží preferenci a smaže GA cookies.

### enhancedTracking.js - `initEnhancedTracking()`
Přidává tracking pro různé interakce: kliknutí na telefonní odkazy (`tel:`), kliknutí na email odkazy (`mailto:`), kliknutí na externí odkazy (sociální sítě), viditelnost sekcí pomocí IntersectionObserver (tracking při 50% viditelnosti sekce). Všechny události se odesílají přes `window.lesktopTrackEvent`.

### index.js (pages/index.js)
Spouští se při `DOMContentLoaded`. Obsluhuje logiku pro zobrazení/skrytí pole "Frekvence úklidu" (`#frequencyGroup`) podle hodnoty v `#cleaningType`. Pole se zobrazí pouze pro "Pravidelný úklid domácnosti" nebo "Úklid komerčních prostor (kanceláře, obchody)".

## 4. Obsluhované události

### reveal.js
- Žádné explicitní event listenery (používá IntersectionObserver)

### nav.js
- `click` na `.nav-link[href^="#"]` - smooth scroll a zavření mobilního menu
- `click` na `.brand[href^="#"]` - smooth scroll pro logo
- `click` na `.nav-toggle` - přepnutí mobilního menu
- `click` na `.nav-link` v mobilním menu - zavření menu na mobilních zařízeních
- `resize` na `window` - zavření menu při přechodu na desktop

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
- `scroll` na `window` - zobrazení/skrytí tlačítka podle pozice
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
- `cookieBanner.js`: žádná explicitní kontrola (ale kontroluje existenci banneru)
- `enhancedTracking.js`: `dataset.enhancedTrackingInit` (řádek 5)
- `advancedTracking.js`: `dataset.advancedTrackingInit` (řádek 2)
