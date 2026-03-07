# Architektura projektu Lesktop (po refaktoru)

Stručný technický průvodce: kde co je a jak to dodržet při změnách.

---

## 1. Struktura složek

| Kde | Co tam patří |
|-----|----------------|
| **Kořen** | `index.html`, `terms.html`, `privacy.html`, `impresum.html`, `faq.html`, `404.html` – každá stránka jeden soubor |
| **images/** | Obrázky (hero, logo, favicon). Cesty z HTML: `images/...` nebo `/images/...` |
| **before-after/** | Galerie Před/Po: `data.js` (data), `gallery.js` (defer), `before-after.css` – načítá se jen na indexu |
| **assets/css/** | Veškeré CSS. Entry point: `style.css`. Dále `legal.css`, `error-pages.css` (načítají se jen na příslušných stránkách) |
| **assets/css/tokens/** | Design tokeny (`tokens.css`) – barvy, spacing, fonty, stíny. Jediný zdroj pravdy pro hodnoty |
| **assets/css/base/** | Reset, typography, utilities. Žádné komponenty |
| **assets/css/layout/** | Container, header, sections, footer – rozložení stránky |
| **assets/css/components/** | Znovupoužitelné komponenty: button, card, form, glass, cookie-banner, back-to-top, … |
| **assets/css/pages/** | Stránkově specifické styly. `pages/index.css` → importuje `index/*.css` (hero, sections, reveal, responsive, print, misc) |
| **assets/js/** | `main.js` (bootstrap, načte bundle), `main.bundle.js` (orchestrátor + moduly). Oba vždy s `defer` |
| **assets/js/components/** | Sdílená logika: reveal, nav, form, select, backToTop, cookieBanner, enhancedTracking, … |
| **assets/js/pages/** | Logika jen pro jednu stránku. `pages/index.js` – kalkulačka (frekvence), atd. |
| **assets/js/polyfills/** | Např. `legacyDom.js` – polyfilly pro bundle |
| **kb/** | Dokumentace a pravidla projektu |

**Pravidlo:** Nový soubor vždy do správné vrstvy (token → base → layout → component → page). Shared komponenta nepatří do `pages/`.

---

## 2. Init flow (JavaScript)

1. **HTML:** Na konci `<body>` je `<script src="/assets/js/main.js" defer></script>` (na indexu před ním ještě `data.js`, `gallery.js` – vše s `defer`).
2. **main.js** (IIFE): Zkontroluje podporu ES modulů → dynamicky vloží `<script type="module" src="main.bundle.js">`. Při chybě nebo bez modulů spustí pouze fallback cookie banneru.
3. **main.bundle.js**: Importuje polyfilly, pak komponenty a `pages/index.js`. Hned po načtení:
   - `runGlobalInits()` – spustí všechny z `GLOBAL_INIT_REGISTRY` (currentYear, reveal, nav, form, select, backToTop, cookieBanner, enhancedTracking, advancedTracking).
   - `whenDomReady(runPageInits)` – po DOMContentLoaded spustí init jen pro aktuální stránku (viz page dispatch).
4. **bfcache:** Při `pageshow` s `ev.persisted` se vyčistí init guardy a znovu spustí global + page inits (aby po Back/Forward vše fungovalo).

**Pravidlo:** Nová sdílená funkcionalita = nový modul v `components/` + záznam v `GLOBAL_INIT_REGISTRY`. Nová stránka s vlastní logikou = modul v `pages/` + záznam v `PAGE_INIT_REGISTRY`.

---

## 3. Page dispatch (data-page)

- Na každé stránce má `<body>` atribut **`data-page="..."`**.
- Povolené hodnoty: `index`, `terms`, `privacy`, `impresum`, `faq`, `404`.
- **main.bundle.js** má `PAGE_INIT_REGISTRY`: pro každou hodnotu `data-page` může být jedna init funkce. Spustí se jen ta, která odpovídá aktuální stránce.
- Stránky bez vlastní logiky (terms, privacy, impresum, faq, 404) nemají v registru záznam – stačí global inits (cookie banner, current year, …).

**Pravidlo:** Přidáš-li novou HTML stránku s vlastním JS, přidej do `<body>` odpovídající `data-page` a do `PAGE_INIT_REGISTRY` v main.bundle.js záznam `{ page: 'hodnota', key: '…PageInit', init: initXxxPage }`.

---

## 4. Shared vs page-specific

- **Shared:** Layout (header, footer, container, sections), komponenty (tlačítka, formuláře, karty, glass, cookie banner), base a tokens. Používají je více stránek nebo celý web.
- **Page-specific:**  
  - **Index:** `pages/index.css` (+ index/hero, sections, reveal, responsive, print, misc), `pages/index.js`, before-after (data.js, gallery.js, before-after.css).  
  - **Content stránky (terms, privacy, impresum, faq):** `legal.css` + stejná struktura HTML (header.main-header, main > section.legal).  
  - **404:** `error-pages.css`, bez headeru, jiný layout (error-container, error-card).

**Pravidlo:** Styl nebo chování použitelné na více stránkách patří do shared (components/layout). Jen pro jednu stránku → pages/ nebo samostatný soubor (legal.css, error-pages.css) a načítat ho jen na té stránce.

---

## 5. CSS vrstvy a pořadí

**style.css** (entry point) importuje v tomto pořadí:

1. **tokens** – `tokens/tokens.css`
2. **base** – reset, typography, utilities
3. **layout** – container, header, sections, footer
4. **components** – button, card, form, features, services, pricing, glass, back-to-top, cookie-banner
5. **pages** – `pages/index.css`

Stránky terms/privacy/impresum/faq načítají navíc **legal.css**. Stránka 404 načítá navíc **error-pages.css**.

**Pravidlo:** Nový soubor přidávej do správné vrstvy a v `style.css` (nebo v `pages/index.css` u page-specific) přidej `@import` na správné místo. Barvy/spacing ber ze `tokens.css`, ne hardcoded hodnoty.

---

## 6. HTML patterny

- **Homepage (index):** `<main id="main-content">` s sekcemi `#about`, `#services`, `#before-after`, `#pricing`, `#contact`. Header je `.site-header` s `.brand`, `.site-nav`. Formuláře: `#kalkulacka`, `#contactForm`.
- **Content stránky (terms, privacy, impresum, faq):** `<header class="main-header">` (logo + nav), `<main id="main-content"><section class="legal">` s h1, bloky h2/p nebo h2/ul, na konci `.legal-updated`. Footer stejný jako na indexu.
- **404:** Bez main headeru, `<main class="container error-container">`, uvnitř `.glass-panel.error-card`, CTA „Zpět na hlavní stránku“. Footer stejný.

**Pravidlo:** Nová content stránka kopíruje strukturu terms/privacy (main-header + main > section.legal). HEAD viz sekce 9 a checklist.

---

## 7. Formuláře

- Formuláře jsou na indexu: `#kalkulacka`, `#contactForm`. Odesílání přes Web3Forms API.
- **form.js** (v bundle) napojuje submit handlery, zobrazuje stavy, volá `window.lesktopTrackEvent` po odeslání.
- HTML: `action="https://api.web3forms.com/submit"`, `method="POST"`, `accept-charset="UTF-8"`, skrytý input s access key. Třídy např. `.calculator-form`, `.contact-form`, `.glass-panel`.

**Pravidlo:** Nový formulář přidej do DOM, dej mu jednoznačné `id`, v `form.js` přidej handler (nebo rozšiř stávající) a nepřidávej inline handlery pro submit.

---

## 8. Loading a performance

- **CSS:** Kritické styly (style.css, stránkové/legal/error-pages) jsou render-blocking. Fonty a Font Awesome: `media="print"` + `onload="this.media='all'"` (neblokují první vykreslení).
- **JS:** Všechny skripty `defer`. Pořadí na indexu: data.js → gallery.js → main.js.
- **Preconnect:** Jen tam, kde se hned načítá obsah: fonts.googleapis.com, fonts.gstatic.com, cdnjs.cloudflare.com. Bez preconnect na analytiku (načítá se po souhlasu).
- **Preload:** Jen na indexu pro LCP – hero (1x podle viewportu), logo. Obrázky mimo viewport: `loading="lazy"`, u obrázků vždy `width` a `height` kvůli CLS.

**Pravidlo:** Nepřidávej blokující skripty bez `defer`. Nové stránky nepotřebují preload hero; preconnect přidávej jen pro zdroje, které stránka skutečně hned používá.

---

## 9. HEAD architektura

Na všech stránkách jednotné pořadí v `<head>`:

1. charset, viewport  
2. title, meta description  
3. canonical (kromě 404)  
4. robots  
5. Open Graph (kromě 404)  
6. favicon, theme-color  
7. CSS (preconnect, fonty, FA, style.css, stránkové CSS)  
8. preload jen tam, kde je LCP (index)  
9. structured data (ld+json) jen kde dává smysl (index: LocalBusiness, faq: FAQPage)

**Pravidlo:** Novou stránku nastav podle terms/privacy (bez preloadu a bez OG na 404). Komentář na začátku head popisuje strukturu – neměň pořadí bez důvodu.

---

## 10. Přidání nové stránky

1. Vytvoř HTML (např. `nova-stranka.html`), `<body data-page="nova-stranka">`.
2. Struktura: stejná jako terms/privacy (skip-link, main-header, main#main-content, section.legal, footer, cookie-banner) nebo 404 pokud jde o chybovou stránku.
3. HEAD: zkopíruj z terms.html, uprav title, description, canonical, og:url, og:title, og:description. Odkazy na CSS: style.css + legal.css (nebo error-pages.css pro 404).
4. Odkazy v patičce (legal-links) doplň na novou stránku, pokud má být v menu.
5. Pokud stránka potřebuje vlastní JS: vytvoř `assets/js/pages/novaStranka.js`, exportuj `initNovaStrankaPage`, v main.bundle.js přidej import a do `PAGE_INIT_REGISTRY` záznam `{ page: 'nova-stranka', key: 'novaStrankaPageInit', init: initNovaStrankaPage }`.
6. Pokud potřebuje vlastní styly: buď přidej do legal.css (společné s ostatními content stránkami), nebo vytvoř např. `assets/css/nova-stranka.css` a načti ho jen v tomto HTML.

---

## 11. Přidání nové komponenty

- **Pouze CSS:** Nový soubor v `assets/css/components/nazev-komponenty.css`. V `style.css` přidej `@import url('./components/nazev-komponenty.css');` v bloku components (před pages).
- **CSS + JS:** CSS jako výše. JS modul v `assets/js/components/nazevKomponenty.js` s exportem `initNazevKomponenty`. V main.bundle.js: import + přidání do `GLOBAL_INIT_REGISTRY`. Pokud má komponenta běžet jen na jedné stránce, použij page init (pages/ + PAGE_INIT_REGISTRY).
- **HTML:** Komponentu používej přes třídy nebo data-atributy; nepřidávej inline styly ani zbytečné inline handlery.

---

## 12. Naming conventions

- **Soubory:** kebab-case (např. `cookie-banner.css`, `back-to-top.css`). JS moduly: camelCase (např. `cookieBanner.js`, `backToTop.js`).
- **data-page:** lowercase, jednoslovné nebo s pomlčkou (`index`, `terms`, `faq`, `404`).
- **CSS třídy:** kebab-case. Tam kde je to přehledné, blok__prvek--modifikátor (BEM).
- **ID elementů:** camelCase pro JS hooky (`main-content`, `kalkulacka`, `contactForm`).

---

## 13. Co nedělat

- **Nedávat** nové blokující skripty bez `defer` (kromě nutných výjimek).
- **Nepřidávat** inline styly do HTML; vše do CSS v příslušné vrstvě.
- **Neměnit** pořadí importů v style.css bez důvodu (tokens → base → layout → components → pages).
- **Nedávat** logiku sdílenou mezi stránkami do `pages/` – patří do `components/`.
- **Nedávat** stránkově specifické styly do `components/` nebo `layout/` – patří do `pages/` nebo legal.css/error-pages.css.
- **Nepřidávat** preconnect/preload „pro jistotu“ – jen tam, kde je to zdůvodněné (LCP, kritický zdroj).
- **Neměnit** HEAD pořadí na stránkách (charset → viewport → title → … → CSS → structured data).
- **Nevkládat** novou stránku bez `data-page` a bez záznamu v PAGE_INIT_REGISTRY, pokud má vlastní JS.
- **Nepoužívat** barvy/spacing přímo v komponentách – brát z `tokens.css` (`var(--…)`).
- **Nepřidávat** nový modul bez zápisu do příslušného registru (GLOBAL vs PAGE) – jinak se init vůbec nespustí, nebo poběží na špatných stránkách.
- **Neměnit** shared vrstvu (components/, layout/) kvůli „rychlé opravě“ jedné stránky – změna se projeví všude; opravit v page-specific nebo přidat variantu.

---

## 14. Rizika údržby (na co dávat pozor)

Největší rizika už nejsou v architektuře samotné, ale v budoucí disciplíně při změnách.

**Tiché bugy**
- **data-page vs. PAGE_INIT_REGISTRY:** Zapomenuté nebo jinak napsané `data-page` = stránka vypadá v pořádku, ale její JS se nespustí. Při přidání stránky vždy zkontrolovat shodu hodnoty v HTML a v registru.
- **Zapomenutá registrace modulu:** Nový soubor v components/ nebo pages/ bez záznamu v GLOBAL_INIT_REGISTRY / PAGE_INIT_REGISTRY = init se nikdy nevolá. Při přidání modulu vždy doplnit import a záznam ve správném registru (sdílené → GLOBAL, jen jedna stránka → PAGE).
- **Špatná registry:** Modul jen pro jednu stránku v GLOBAL_INIT_REGISTRY může rozbít jiné stránky; sdílený modul jen v PAGE_INIT_REGISTRY nebude fungovat jinde. Rozhodnout předem: běží na všech stránkách, nebo jen na jedné?
- **Úprava ve shared vrstvě „jen pro jednu stránku“:** Změna v components/ nebo layout/ ovlivní všechny stránky. Pokud je úprava opravdu jen pro jednu stránku, patří do pages/ nebo do legal.css/error-pages.css, ne do shared.

**Performance dluh**
- **Přibývání preloadů a preconnectů:** Každý další preload/preconnect soutěží o prioritu. Nepřidávat „pro jistotu“; jen LCP nebo jasně kritický zdroj. Pravidelně zkontrolovat, zda stávající preloady/preconnecty jsou ještě odůvodněné.
- **Bobtnání style.css:** Content stránky tahají celý style.css. Při rozšiřování projektu hlídat, zda nepřibývá CSS, které content stránky nevyužívají; v dlouhodobém horizontu zvážit rozdělení nebo podmíněné načítání.
- **Hero / LCP na homepage:** Preload hero a logo je nastaven správně. Citlivé místo: výměna hero za větší obrázek, video, slider nebo další overlay může rychle zhoršit LCP a CLS. Jakákoli změna hero oblasti by měla jít ruku v ruce s kontrolou výkonu (rozměry, preload, lazy vs eager).

**Typické chyby při úpravách**
- **„Jen malá výjimka“ v HTML:** Jedna inline styl nebo výjimka v HEAD/formuláři často přitáhne další. Držet pravidlo: žádné inline styly, jednotné patterny; výjimky nebrat jako normu.
- **Hardcoded hodnoty:** Při úpravě komponenty snadno vložit `margin: 18px`, `#5f6b8c` nebo `border-radius: 14px` místo tokenu. Web funguje, ale konzistence a údržba se rozpadají. Vždy použít `var(--…)` z tokens.css.
- **Špatné zařazení funkcionality:** Nejčastější není syntaktická chyba, ale špatné „kam to dát“. Logika jen pro jednu stránku do components/ nebo naopak sdílená věc do pages/ – krátkodobě to může fungovat, dlouhodobě to ničí čitelnost. Před přidáním souboru vždy rozhodnout: sdílené = components/layout, stránkové = pages/ nebo specializovaný CSS (legal, error-pages).

---

Doplňující dokumenty v kb/: 02_hlavni_soubory, 04_architektura_js, 06_architektura_css, 12_architektura_systemu, 14_development_playbook. Tento dokument popisuje cílový stav po refaktoru; při rozporu s kódem má přednost tento dokument a kód by se měl k němu doplnit nebo opravit.
