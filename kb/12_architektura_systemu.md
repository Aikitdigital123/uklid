# Architektura systému Lesktop

## 1. Přehled vrstev systému

### HTML vrstva
**Soubory:** `index.html`, `privacy.html`, `terms.html`, `404.html`

**Struktura:**
- Statické HTML soubory s kompletní strukturou stránky
- Sekce: `#about`, `#services`, `#before-after`, `#pricing`, `#contact`
- Formuláře: `#kalkulacka` (kalkulační), `#contactForm` (kontaktní)
- Inline event handlery: `onclick` atributy pro tracking (řádky 144-147, 171, 177, 183, 189, 195, 201, 207, 213, 444, 456, 457, 477)
- Externí zdroje: Google Fonts (non-blocking), Font Awesome CDN, CSS/JS soubory
- JSON-LD strukturovaná data: `LocalBusiness` typ (řádek 52)

**Závislosti:**
- CSS soubory: `/assets/css/style.css`, `/before-after/before-after.css`
- JS soubory: `/before-after/data.js`, `/before-after/gallery.js`, `/assets/js/main.js` (vše s `defer`)

### CSS vrstva
**Soubory:** `/assets/css/style.css` (entry point), modulární CSS soubory

**Struktura:**
- Entry point: `style.css` s `@import` pravidly (řádky 3-21)
- Pořadí importů:
  1. `tokens/tokens.css` - design tokeny (CSS custom properties)
  2. `base/*.css` - reset, typography, utilities
  3. `layout/*.css` - header, sections, footer, container
  4. `components/*.css` - button, card, form, features, services, pricing, glass, back-to-top, cookie-banner
  5. `pages/index.css` - stránkově specifické styly

**Externí CSS:**
- Google Fonts: non-blocking načtení (`media="print" onload="this.media='all'"`)
- Font Awesome CDN: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css`
- Before-after galerie: `/before-after/before-after.css`

**Komunikace s HTML:**
- CSS třídy: `.container`, `.glass-panel`, `.btn`, `.service-item`, `.content-section`, `.reveal-on-scroll`, atd.
- ID selektory: `#main-content`, `#about`, `#services`, `#pricing`, `#contact`, `#kalkulacka`, `#contactForm`, atd.
- CSS custom properties: definované v `tokens.css`, používané napříč komponentami

### JavaScript vrstva
**Soubory:** `/assets/js/main.js` (entry point), `/assets/js/components/*.js`, `/assets/js/pages/*.js`

**Struktura:**
- Entry point: `main.js` s dynamickými importy (řádky 6-15)
- Moduly (paralelní načítání):
  - `reveal.js` - reveal-on-scroll animace
  - `nav.js` - navigace, smooth scroll, mobilní menu
  - `form.js` - submit handlery pro formuláře
  - `select.js` - custom select komponenta
  - `backToTop.js` - tlačítko "zpět nahoru"
  - `cookieBanner.js` - cookie souhlas, načtení GA, definice `window.lesktopTrackEvent`
  - `enhancedTracking.js` - tracking telefonů, emailů, externích odkazů, viditelnosti sekcí
  - `pages/index.js` - stránkově specifická logika (toggle frekvence úklidu)

**Komunikace s HTML:**
- `getElementById()` - přístup k elementům podle ID
- `querySelector()` / `querySelectorAll()` - přístup podle CSS selektorů
- Event listeners: `addEventListener()` na formuláře, odkazy, tlačítka
- Inline handlery: kontrola existence `window.lesktopTrackEvent` před voláním

**Globální proměnné a funkce:**
- `window.beforeAfterGallery` - data galerie (definováno v `/before-after/data.js`)
- `window.lesktopTrackEvent` - tracking funkce (definováno v `cookieBanner.js`)
- `window.gtag` - Google Analytics funkce (definováno v `cookieBanner.js`)
- `window.dataLayer` - Google Analytics data layer (definováno v `cookieBanner.js`)
- `window.__lesktopGtagLoaded` - flag pro prevenci duplikace GA skriptu
- `window['ga-disable-G-FLL5D5LE75']` - flag pro zakázání GA

### Externí služby

**Web3Forms API:**
- URL: `https://api.web3forms.com/submit`
- Použití: odesílání formulářů (`#kalkulacka`, `#contactForm`)
- Access key: `4e724eab-1a15-4f9c-9c19-caa25c2b95fc` (v HTML jako hidden input)
- Metoda: `POST` s `FormData`, `Accept: application/json`
- Charset: explicitně `UTF-8` přes `_charset` parametr

**Google Analytics 4:**
- Measurement ID: `G-FLL5D5LE75`
- Načítání: dynamicky přes `cookieBanner.js` po souhlasu s cookies
- Skript: `https://www.googletagmanager.com/gtag/js?id=AW-17893281939`
- Konfigurace: anonymize_ip, allow_google_signals, allow_ad_personalization_signals

**Google Ads:**
- Conversion ID: `AW-17893281939`
- Konfigurace: stejný skript jako GA4, samostatná konfigurace
- Conversions: tracking přes `window.lesktopTrackEvent('event', 'conversion', {...})`

**CDN služby:**
- Google Fonts: `https://fonts.googleapis.com/css2?...` (non-blocking)
- Font Awesome: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css`

### Build vrstva
**Nástroje:** Node.js (min. verze 18.0.0, specifikováno v `package.json` engines), esbuild, PostCSS, cssnano, postcss-import

**Soubory:** `/tools/build-js.mjs`, `/tools/build-css.mjs`, `/tools/copy-static.mjs`

**Build proces:**
1. **CSS build** (`build-css.mjs`):
   - Vstup: `/assets/css/style.css`
   - PostCSS s `postcss-import` (řeší `@import`)
   - cssnano pro minifikaci
   - Výstup: `/dist/assets/css/style.min.css`

2. **JS build** (`build-js.mjs`):
   - Vstup: `/assets/js/main.js`
   - esbuild: bundling, minifikace, target ES2018, format IIFE
   - Výstup: `/dist/assets/js/main.min.js`

3. **Static copy** (`copy-static.mjs`):
   - Kopírování statických souborů do `/dist/`
   - Přepnutí odkazů na minifikované assety v HTML souborech: `index.html`, `privacy.html`, `terms.html`, `404.html`
   - Nahrazení: `/assets/css/style.css` → `/assets/css/style.min.css`, `/assets/js/main.js` → `/assets/js/main.min.js`

**NPM skripty:**
- `npm run build:css` - build CSS
- `npm run build:js` - build JS
- `npm run build:static` - kopírování statických souborů
- `npm run build` - všechny tři kroky sekvenčně

## 2. Jak spolu vrstvy komunikují

### HTML ↔ CSS
**Mechanismus:**
- CSS třídy: HTML elementy mají `class` atributy, CSS definuje styly pro tyto třídy
- ID selektory: HTML elementy mají `id` atributy, CSS může stylovat přes `#id`
- CSS custom properties: definované v `:root` v `tokens.css`, používané přes `var(--property-name)`

**Příklady:**
- `.glass-panel` třída na sekcích → glass efekt z `components/glass.css`
- `#main-content` ID → skip link cíl, scroll padding
- `--color-primary-dark` custom property → používá se napříč komponentami

### HTML ↔ JS
**Mechanismy:**

1. **DOM API:**
   - `document.getElementById('id')` - přístup k elementům podle ID
   - `document.querySelector('.class')` - přístup podle CSS selektoru
   - `document.querySelectorAll('.class')` - přístup k více elementům

2. **Event listeners:**
   - JS přidává event listenery na HTML elementy: `element.addEventListener('click', handler)`
   - Formuláře: `form.addEventListener('submit', handler)` s `preventDefault()`
   - IntersectionObserver: pro reveal-on-scroll a tracking viditelnosti sekcí

3. **Inline handlery:**
   - HTML má `onclick` atributy s kontrolou existence funkce: `onclick="window.lesktopTrackEvent && window.lesktopTrackEvent(...)"`
   - Použití: navigační odkazy, CTA tlačítka, telefonní/email odkazy

4. **Data atributy:**
   - HTML: `data-track="phone"`, `data-location="contact_section"`, `data-page="404"`
   - JS: čtení přes `element.dataset.track`, `element.dataset.location`

5. **Idempotentní inicializace:**
   - JS moduly kontrolují `document.documentElement.dataset.moduleInit === '1'` před inicializací
   - Zabraňuje duplikaci event listenerů při opakovaném volání

### JS ↔ Externí API

**Web3Forms API:**
```
Formulář → FormData → fetch() → Web3Forms API → JSON response → JS zpracování
```

**Proces:**
1. Uživatel odešle formulář
2. JS zachytí `submit` event, `preventDefault()`
3. Vytvoří `FormData` z formuláře, přidá `_charset: 'UTF-8'`
4. `fetch()` POST request na `https://api.web3forms.com/submit`
5. Zpracování JSON response (`result.success`)
6. Zobrazení status zprávy, reset formuláře
7. Tracking konverze přes `window.lesktopTrackEvent`

**Error handling:**
- `try-catch` bloky kolem `fetch()`
- Kontrola `response.ok`
- Fallback zprávy při chybě sítě nebo API

### CookieBanner ↔ Tracking

**Komunikace:**
1. `cookieBanner.js` definuje `window.lesktopTrackEvent` funkci (řádek 14)
2. Funkce kontroluje:
   - `window['ga-disable-G-FLL5D5LE75']` - pokud true, vrátí false
   - `typeof window.gtag === 'function'` - pokud existuje, volá `window.gtag(...args)`
3. Po souhlasu s cookies:
   - `loadGa4()` načte Google Tag Manager skript
   - Vytvoří `window.gtag` funkci a `window.dataLayer`
   - Nakonfiguruje GA4 a Google Ads
4. Ostatní moduly kontrolují `typeof window.lesktopTrackEvent === 'function'` před použitím

**Závislosti:**
- `enhancedTracking.js` kontroluje `canTrack()` před trackingem (řádek 8)
- `form.js` kontroluje `if (window.lesktopTrackEvent)` před voláním (řádky 56, 133)
- Inline handlery v HTML kontrolují `window.lesktopTrackEvent &&` před voláním

### main.js ↔ dynamické moduly

**Mechanismus:**
- `main.js` používá dynamické `import()` pro načítání modulů (řádky 6-15)
- Každý import je asynchronní, načítá se paralelně
- `.then(m => m.initFunction())` - volá inicializační funkci po načtení
- `.catch(() => {})` - graceful degradation při chybě načtení

**Pořadí:**
- Moduly se načítají paralelně, není garantované pevné pořadí
- Závislosti řešeny kontrolami existence funkcí, ne pořadím inicializace
- `pages/index.js` má vlastní `DOMContentLoaded` listener (řádek 5)

**Idempotence:**
- Každý modul kontroluje `document.documentElement.dataset.moduleInit === '1'` před inicializací
- Zabraňuje duplikaci event listenerů při opakovaném volání

## 3. Závislosti systému

### Kritické pro fungování

**HTML struktura:**
- Existence elementů s očekávanými ID: `#main-content`, `#about`, `#services`, `#pricing`, `#contact`, `#kalkulacka`, `#contactForm`, `#cookie-banner`
- Formuláře s `action` a `method` atributy
- Hidden inputy s `access_key` pro Web3Forms

**CSS:**
- `/assets/css/style.css` musí být načten
- `@import` řetězec musí být validní (tokens → base → layout → components → pages)
- CSS custom properties z `tokens.css` jsou kritické pro styling

**JavaScript:**
- `/assets/js/main.js` musí být načten (entry point)
- Moduly mohou selhat individuálně (graceful degradation přes `.catch(() => {})`)
- `form.js` je kritický pro odesílání formulářů
- `cookieBanner.js` je kritický pro definici `window.lesktopTrackEvent`

**Externí služby:**
- Web3Forms API musí být dostupné pro odesílání formulářů
- Pokud selže, zobrazí se chybová zpráva, formulář zůstane funkční pro opakovaný pokus

### Volitelné (graceful degradation)

**Google Analytics a Google Ads:**
- Pokud není souhlas s cookies, tracking se neprovádí
- `window.lesktopTrackEvent` kontroluje existenci `window.gtag` před voláním
- Pokud `window.gtag` neexistuje, funkce vrátí `false`, ale nezpůsobí chybu
- Inline handlery kontrolují `window.lesktopTrackEvent &&` před voláním

**Before-after galerie:**
- Pokud `window.beforeAfterGallery` neexistuje nebo je prázdné, zobrazí se `#before-after-empty` zpráva
- `gallery.js` kontroluje `Array.isArray(window.beforeAfterGallery)` (řádek 133)
- Fallback na prázdné pole: `window.beforeAfterGallery.slice()` nebo `[]`

**JavaScript moduly:**
- Každý modul má `.catch(() => {})` při načítání
- Pokud modul selže, ostatní moduly pokračují v načítání
- Moduly kontrolují existenci elementů před inicializací: `if (!element) return;`

**Externí CSS (CDN):**
- Google Fonts: fallback v `<noscript>` tagu (řádek 10)
- Font Awesome: pokud selže, ikony se nezobrazí, ale stránka zůstane funkční

**Reveal-on-scroll animace:**
- Pokud `reveal.js` selže, elementy zůstanou viditelné, jen bez animace
- CSS třída `.reveal-on-scroll` může existovat bez JS funkčnosti

**Custom select komponenta:**
- Pokud `select.js` selže, nativní `<select>` zůstane funkční
- Formulář může být odeslán i s nativním selectem

### Bezpečnostně citlivé

**Web3Forms access key:**
- Umístění: `index.html` jako hidden input (řádky 280, 462)
- Hodnota: `4e724eab-1a15-4f9c-9c19-caa25c2b95fc`
- Riziko: viditelné v HTML zdrojovém kódu, může být zneužito pro spam
- Opatření: Web3Forms má rate limiting, ale klíč by měl být chráněn

**Google Analytics Measurement ID:**
- Hodnota: `G-FLL5D5LE75`
- Umístění: `cookieBanner.js` (řádek 8)
- Riziko: relativně nízké, ID je veřejné, ale může být zneužito pro falešné eventy

**Google Ads Conversion ID:**
- Hodnota: `AW-17893281939`
- Umístění: `cookieBanner.js` (řádek 23, 44)
- Riziko: podobné jako GA ID

**Cookie consent:**
- Ukládá se v `localStorage` pod klíčem `lesktop_cookie_consent`
- Hodnoty: `'all'` nebo `'necessary'`
- Riziko: uživatel může změnit hodnotu v DevTools, ale to je očekávané chování

## 4. Tok dat v systému

### Tok dat z formuláře

**Kalkulační formulář (`#kalkulacka`):**

1. **Uživatelský vstup:**
   - HTML: `<form id="kalkulacka">` s inputy (řádek 279)
   - JS: `form.js` zachytí `submit` event (řádek 95)

2. **Příprava dat:**
   - `FormData` objekt z formuláře (řádek 107)
   - Přidá se `_charset: 'UTF-8'` (řádek 110)
   - Hidden input `access_key` je automaticky v `FormData`

3. **Odeslání:**
   - `fetch()` POST na `https://api.web3forms.com/submit` (řádek 113)
   - Headers: `Accept: application/json`
   - Body: `FormData`

4. **Zpracování odpovědi:**
   - JSON response: `{success: true/false, message: "..."}`
   - Pokud `success === true`:
     - Zobrazí se úspěšná zpráva (řádek 128)
     - Formulář se resetuje (řádek 150)
     - Tracking: `window.lesktopTrackEvent('event', 'form_submission', {...})` (řádek 138)
     - Tracking: `window.lesktopTrackEvent('event', 'conversion', {...})` (řádek 145)
   - Pokud `success === false`:
     - Zobrazí se chybová zpráva (řádek 153)

5. **Error handling:**
   - `try-catch` kolem `fetch()` (řádek 112)
   - Při chybě sítě: zobrazí se obecná chybová zpráva (řádek 159)
   - `finally` blok: obnoví submit tlačítko, po 5s skryje status zprávu (řádek 167)

**Kontaktní formulář (`#contactForm`):**
- Stejný proces jako kalkulační formulář
- Liší se pouze tracking parametry: `form_type: 'contact'` vs `form_type: 'calculation'`

### Tok dat při trackingu

**Inicializace tracking systému:**

1. **Cookie banner:**
   - `cookieBanner.js` kontroluje `localStorage.getItem('lesktop_cookie_consent')` (řádek 73)
   - Pokud `'all'`: načte GA4, skryje banner (řádek 74-77)
   - Pokud `'necessary'`: zakáže GA, smaže cookies, skryje banner (řádek 79-83)
   - Pokud není uložen: zobrazí banner, čeká na uživatelský souhlas

2. **Načtení Google Analytics:**
   - `loadGa4()` funkce (řádek 25):
     - Kontrola `window.__lesktopGtagLoaded` (prevence duplikace) (řádek 26)
     - Vytvoří `window.dataLayer` a `window.gtag` funkci (řádky 29-33)
     - Konfigurace GA4: `window.gtag('config', 'G-FLL5D5LE75', {...})` (řádek 37)
     - Konfigurace Google Ads: `window.gtag('config', 'AW-17893281939', {...})` (řádek 44)
     - Dynamické načtení GTM skriptu (řádky 49-54)

3. **Definice tracking funkce:**
   - `window.lesktopTrackEvent = (...args) => {...}` (řádek 14)
   - Kontrola `ga-disable` flagu (řádek 15)
   - Kontrola existence `window.gtag` (řádek 16)
   - Volání `window.gtag(...args)` pokud vše OK (řádek 17)

**Tracking událostí:**

1. **Inline handlery v HTML:**
   - Navigační odkazy: `onclick="window.lesktopTrackEvent && window.lesktopTrackEvent('event','nav_click',{menu_item:'...'})"` (řádky 144-147)
   - CTA tlačítka: `onclick="window.lesktopTrackEvent && window.lesktopTrackEvent('event','cta_click',{button_name:'...'})"` (řádky 171, 177, 183, atd.)
   - Telefonní odkazy: `onclick="window.lesktopTrackEvent && window.lesktopTrackEvent('event','phone_click',{...})"` (řádek 456)
   - WhatsApp: `onclick="window.lesktopTrackEvent(...); window.lesktopTrackEvent('event','conversion',{...})"` (řádek 457)

2. **Event listeners v JS:**
   - `enhancedTracking.js`: tracking telefonů, emailů, externích odkazů, viditelnosti sekcí (řádky 11-84)
   - `form.js`: tracking odeslání formulářů a konverzí (řádky 56, 62, 133, 145)

3. **Tok dat:**
   ```
   Událost → window.lesktopTrackEvent() → kontrola ga-disable → kontrola window.gtag → window.gtag() → window.dataLayer → Google Analytics/Ads
   ```

### Tok dat v galerii before-after

1. **Načtení dat:**
   - `/before-after/data.js` definuje `window.beforeAfterGallery` jako pole objektů (řádek 1)
   - Každý objekt: `{title, date, before, after, note}`

2. **Renderování:**
   - `/before-after/gallery.js` se spustí při `DOMContentLoaded` (řádek 162)
   - `renderGallery()` funkce (řádek 126):
     - Získá `#before-after-gallery` element (řádek 127)
     - Zkontroluje `window.beforeAfterGallery` (řádek 133)
     - Fallback: pokud není pole, použije `[]` (řádek 135)
     - Filtruje položky bez `before` nebo `after` (řádek 137-139)
     - Pokud prázdné: zobrazí `#before-after-empty` (řádek 142-144)
     - Seřadí podle data (řádek 148)
     - Vytvoří karty pomocí `createCard()` (řádek 151)
     - Přidá do DOM (řádek 154)

3. **Interakce:**
   - Kliknutí na kartu: `toggle()` funkce (řádek 101)
   - Přepínání mezi `before` a `after` obrázkem (řádek 102)
   - `updateToggle()` aktualizuje `src`, `alt`, `textContent`, `aria-pressed` (řádek 28)

## 5. Slabá místa architektury

### Dynamické importy bez čekání

**Problém:**
- `main.js` načítá moduly paralelně pomocí `import()` (řádky 6-15)
- Není garantované pevné pořadí inicializace
- Moduly mohou být inicializovány v libovolném pořadí

**Důsledky:**
- Pokud `enhancedTracking.js` se inicializuje před `cookieBanner.js`, `window.lesktopTrackEvent` ještě neexistuje
- Řešení: moduly kontrolují existenci funkcí před použitím (`typeof window.lesktopTrackEvent === 'function'`)

**Riziko:**
- Pokud modul očekává existenci jiného modulu bez kontroly, může dojít k chybě
- Např. pokud `form.js` by volal `window.lesktopTrackEvent` bez kontroly, selhalo by při chybě načtení `cookieBanner.js`

**Doporučení:**
- Všechny moduly by měly kontrolovat existenci závislostí před použitím
- Zvážit sekvenční načítání kritických modulů (např. `cookieBanner.js` před ostatními)

### Inline onclick handlery

**Problém:**
- HTML obsahuje `onclick` atributy s JavaScript kódem (řádky 144-147, 171, 177, atd.)
- Kód je smíchaný s HTML strukturou
- Obtížná údržba a testování

**Příklady:**
```html
onclick="window.lesktopTrackEvent && window.lesktopTrackEvent('event','nav_click',{menu_item:'o_nas'})"
```

**Důsledky:**
- Porušení separation of concerns (HTML vs JS)
- Obtížné testování (nemůžeme mockovat funkce)
- Duplikace kódu (stejný pattern opakovaně)
- Obtížná refaktorizace (změna vyžaduje úpravu HTML)

**Riziko:**
- Pokud se změní API `window.lesktopTrackEvent`, musí se upravit všechny inline handlery
- Chyby v inline kódu jsou obtížněji debugovatelné

**Doporučení:**
- Přesunout všechny handlery do JS modulů
- Použít `data-*` atributy pro metadata (např. `data-track="nav_click"`, `data-menu-item="o_nas"`)
- JS modul by přidal event listenery na základě `data-*` atributů

### Externí závislosti (CDN, Web3Forms)

**Problém:**
- Web3Forms API: pokud selže, formuláře nefungují
- Google Fonts: pokud selže, fonty se nenačtou (ale je fallback v `<noscript>`)
- Font Awesome CDN: pokud selže, ikony se nezobrazí
- Google Tag Manager: pokud selže, tracking nefunguje (ale je graceful degradation)

**Důsledky:**
- Závislost na dostupnosti externích služeb
- Pokud Web3Forms API má výpadek, formuláře nelze odeslat
- Pokud CDN má výpadek, části UI se nezobrazí správně

**Riziko:**
- Single point of failure pro formuláře (Web3Forms)
- Bez offline fallbacku
- Rate limiting na Web3Forms může blokovat legitimní požadavky

**Doporučení:**
- Zvážit vlastní backend pro formuláře (snižuje závislost na externí službě)
- Přidat retry mechanismus pro failed requests
- Zvážit self-hosting Font Awesome (snižuje závislost na CDN)
- Přidat service worker pro offline fallback (pokud je to relevantní)

### Web3Forms access key v HTML

**Problém:**
- Access key je viditelný v HTML zdrojovém kódu (řádky 280, 462)
- Každý může vidět a potenciálně zneužít klíč

**Důsledky:**
- Klíč může být zneužít pro spam přes Web3Forms API
- Web3Forms má rate limiting, ale klíč by měl být chráněn

**Riziko:**
- Zneužití klíče pro odesílání spamových emailů
- Možné náklady pokud Web3Forms účtuje za požadavky

**Doporučení:**
- Přesunout access key do backendu (pokud je vlastní backend)
- Použít environment variables pro build proces
- Zvážit rotaci klíče pokud je zneužit

### Chybějící error boundaries

**Problém:**
- Pokud JS modul selže při inicializaci, chyba může být tichá (`.catch(() => {})`)
- Uživatel nemusí vědět, že něco nefunguje

**Důsledky:**
- Formulář může být nefunkční, ale uživatel to neví
- Tracking může nefungovat, ale není viditelná chyba

**Riziko:**
- Tiché selhání funkcionalit
- Obtížné debugování v produkci

**Doporučení:**
- Přidat error logging (např. do console v dev módu, do error tracking služby v produkci)
- Zobrazit uživateli zprávu pokud kritická funkcionalita selže (např. formulář)
- Zvážit error tracking službu (např. Sentry)
