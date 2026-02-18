# Tok fungování webu

## 1. Co se stane při načtení stránky

### HTML fáze
1. Browser načte `index.html`
2. Parsuje HTML strukturu
3. Načte JSON-LD strukturovaná data (řádky 55-123) - typ `LocalBusiness`

### CSS fáze (v pořadí načítání)
1. **Google Fonts** (řádek 9)
   - Non-blocking načtení: `media="print" onload="this.media='all'"`
   - Fallback v `<noscript>` pro případy bez JavaScriptu
   - Fonty: Montserrat (400, 500, 600, 700) a Open Sans (400, 600)

2. **Font Awesome** (řádek 39)
   - Non-blocking načtení z CDN s preconnect a integrity hash (viz `kb/12_architektura_systemu.md`)

3. **Hlavní CSS** (řádek 41)
   - `/assets/css/style.css` importuje 18 dalších CSS souborů v pořadí:
     - tokens/tokens.css (design tokeny)
     - base/reset.css, typography.css, utilities.css
     - layout/header.css, sections.css, footer.css, container.css
     - components/*.css (button, card, form, features, services, pricing, glass, back-to-top, cookie-banner)
     - pages/index.css

4. **Before-After CSS** (řádek 42)
   - `before-after/before-after.css` pro galerii

### JavaScript fáze (všechny s atributem `defer`)
1. **Before-After Data** (řádek 515)
   - `/before-after/data.js` - načte data do `window.beforeAfterGallery`

2. **Before-After Gallery** (řádek 516)
   - `/before-after/gallery.js` - čeká na `DOMContentLoaded`, pak renderuje galerii

3. **Hlavní JS** (řádek 517)
   - `/assets/js/main.js` - vstupní bod

### Inicializace JavaScript modulů
Moduly se načítají paralelně pomocí dynamických importů (`import()`) v `main.js`:

1. **initReveal()** - přidá třídu `js` na `<html>`, inicializuje IntersectionObserver pro `.reveal-on-scroll`
2. **initNav()** - nastaví ARIA atributy, připojí smooth scroll a mobilní menu
3. **initForms()** - připojí submit handlery na `#contactForm` a `#kalkulacka`
4. **initSelects()** - transformuje `#cleaningType` a `#cleaningFrequency` na custom UI
5. **initBackToTop()** - vytvoří tlačítko "zpět nahoru"
6. **initCookieBanner()** - zkontroluje localStorage, načte GA pokud je souhlas, nebo zobrazí banner
7. **initEnhancedTracking()** - připojí tracking na telefonní/email/externí odkazy a sekce
8. **/assets/js/pages/index.js** - `main.js` pouze načte modul `./pages/index.js` (bez volání funkce). Modul `/assets/js/pages/index.js` obsahuje vlastní `DOMContentLoaded` listener, který inicializuje logiku pro zobrazení/skrytí pole frekvence

**Poznámka:** Pořadí inicializace není garantované (paralelní načítání), závislosti řešeny kontrolami existence funkcí.

## 2. Jak funguje navigace po stránce

### Desktop navigace
1. Uživatel klikne na odkaz v `.site-nav .nav-link[href^="#"]`
2. Event handler (z `nav.js`) zachytí kliknutí
3. `event.preventDefault()` - zabrání výchozímu chování
4. Získá cílový element pomocí `document.querySelector(targetId)`
5. Vypočítá pozici s offsetem pro fixed header: `elementPosition - headerOffset - 20px`
6. `window.scrollTo({ top: offsetPosition, behavior: 'smooth' })` - plynulé scrollování
7. Odstraní třídu `active` ze všech odkazů, přidá `active` na kliknutý odkaz

### Logo navigace
1. Uživatel klikne na `.brand[href^="#"]`
2. Stejný proces jako u navigačních odkazů, ale bez změny `active` stavu

### Mobilní menu
1. Na zařízeních ≤768px se zobrazí tlačítko `.nav-toggle`
2. Kliknutí na tlačítko: `siteNav.classList.toggle('is-open')`
3. Aktualizace ARIA atributu `aria-expanded`
4. Kliknutí na odkaz v mobilním menu: automaticky zavře menu (pouze na mobilu, součást smooth scroll handleru)
5. Resize event (throttled 150ms): při přechodu na desktop (>768px) automaticky zavře menu

## 3. Jak funguje kalkulačka (od výběru po odeslání)

### Výběr typu úklidu
1. Uživatel klikne na custom select `#cleaningType` (transformovaný `select.js`)
2. Otevře se dropdown menu
3. Výběr možnosti: aktualizuje nativní select, synchronizuje custom UI, dispatchuje `change` event

### Zobrazení/skrytí pole frekvence
1. `/assets/js/pages/index.js` naslouchá na `change` event `#cleaningType`
2. Kontrola hodnoty:
   - Pokud `'Pravidelný úklid domácnosti'` nebo `'Úklid komerčních prostor (kanceláře, obchody)'`:
     - Odstraní třídu `form-group-hidden` z `#frequencyGroup`
     - Nastaví `required` na `#cleaningFrequency`
   - Jinak:
     - Přidá třídu `form-group-hidden` (skryje pole)
     - Odstraní `required`
     - Resetuje hodnotu na prázdnou

### Vyplnění formuláře
1. Uživatel vyplní povinná pole: `cleaning_type`, `area_size`, `customer_name`, `customer_email`
2. Volitelně: `cleaning_frequency`, `additional_services[]`, `has_pets`, `customer_phone`, `notes`

### Odeslání formuláře
1. Uživatel klikne na submit tlačítko
2. `form.js` zachytí `submit` event na `#kalkulacka`
3. `event.preventDefault()` - zabrání výchozímu odeslání
4. **Loading stav:**
   - Submit tlačítko: `disabled = true`, text změněn na "Odesílám..."
   - Status element `#calc-form-status`: zobrazí "Odesílám...", odstraní `form-status-hidden`
5. **Vytvoření FormData:**
   - `new FormData(calcForm)` - shromáždí všechny hodnoty z formuláře
   - `formData.append('_charset', 'UTF-8')` - explicitní UTF-8
6. **Fetch request:**
   - URL: `https://api.web3forms.com/submit`
   - Method: `POST`
   - Headers: `Accept: application/json`
   - Body: FormData
7. **Zpracování odpovědi:**
   - Pokud `response.ok === false`: throw Error
   - Parsování JSON: `await response.json()`
   - Pokud `result.success === true`:
     - Zobrazí úspěšnou zprávu: "Děkujeme! Vaše poptávka byla úspěšně odeslána."
     - Přidá třídu `success` na status element
     - Pokud existuje `window.lesktopTrackEvent`:
       - Odešle event `form_submission` s `form_type: 'calculation'`
       - Odešle Google Ads conversion `AW-17893281939/calculation_form_submission`
     - `calcForm.reset()` - resetuje formulář
   - Pokud `result.success === false`:
     - Zobrazí chybovou zprávu z `result.message` nebo výchozí
     - Přidá třídu `error` na status element
8. **Konečné úpravy:**
   - Submit tlačítko: `disabled = false`, text "Získat nezávaznou nabídku"
   - Po 5 sekundách: skryje status zprávu (přidá `form-status-hidden`)

### Chyba při odeslání
- Pokud fetch selže (síťová chyba): catch blok zobrazí "Při odesílání poptávky došlo k chybě sítě. Zkuste to prosím později."
- Pokud API vrátí chybu: zobrazí zprávu z `result.message` nebo výchozí chybovou zprávu
- V dev módu (localhost): chyby se logují do konzole pomocí `logError`

## 4. Jak funguje kontaktní formulář

### Vyplnění formuláře
1. Uživatel vyplní povinná pole: `Jmeno`, `Email`, `Zprava` (minlength 10 znaků)

### Odeslání formuláře
1. Uživatel klikne na submit tlačítko
2. `form.js` zachytí `submit` event na `#contactForm`
3. Stejný proces jako u kalkulačky:
   - `event.preventDefault()`
   - Loading stav
   - Vytvoření FormData s `_charset: UTF-8`
   - Fetch na `https://api.web3forms.com/submit`
   - Zpracování odpovědi
4. **Rozdíly:**
   - Status element: `#form-status`
   - Úspěšná zpráva: "Děkujeme! Vaše zpráva byla úspěšně odeslána."
   - Tracking: `form_type: 'contact'`, conversion `AW-17893281939/contact_form_submission`
   - Submit tlačítko text: "Odeslat poptávku"

## 5. Jak funguje galerie before-after

### Načtení dat
1. `data.js` (řádek 515) se načte s `defer`
2. Vytvoří globální pole `window.beforeAfterGallery` s objekty:
   - `title`, `date`, `before` (cesta k obrázku), `after` (cesta k obrázku), `note`

### Renderování galerie
1. `gallery.js` (řádek 516) se načte s `defer`
2. Čeká na `DOMContentLoaded` nebo spustí okamžitě pokud je DOM ready
3. **Funkce `renderGallery()`:**
   - Najde element `#before-after-gallery`
   - Zkontroluje `window.beforeAfterGallery` (fallback na prázdné pole)
   - Filtruje položky: pouze ty s `before` a `after`
   - Pokud žádné data: zobrazí `#before-after-empty`, konec
   - Seřadí data podle data vzestupně (`sortByDateAsc`)
   - Pro každou položku vytvoří kartu (`createCard`)
4. **Funkce `createCard(item)`:**
   - Vytvoří `<article class="ba-card glass-panel">`
   - Přidá meta informace (title, date)
   - Vytvoří `<figure class="ba-figure">` s obrázkem
   - Nastaví `dataset.before` a `dataset.after` na img element
   - Přidá label "Před" nebo "Po"
   - Přidá hint text
   - Připojí click a keydown handlery pro přepínání

### Přepínání před/po
1. Uživatel klikne na obrázek nebo stiskne Enter/Space
2. Funkce `toggle()`:
   - Zjistí aktuální stav z `figure.dataset.state`
   - Přepne na opačný stav ('before' ↔ 'after')
3. Funkce `updateToggle()`:
   - Změní `img.src` na `dataset.after` nebo `dataset.before`
   - Změní `img.alt` na odpovídající alt text
   - Aktualizuje label text ("Před" / "Po")
   - Aktualizuje hint text
   - Nastaví `aria-pressed` atribut

## 6. Jak funguje cookie souhlas a tracking

### Inicializace cookie banneru
1. `initCookieBanner()` se spustí při načtení `main.js`
2. Najde element `#cookie-banner`
3. Zkontroluje `localStorage.getItem('lesktop_cookie_consent')`:
   - Pokud `'all'`: načte GA, skryje banner, konec
   - Pokud `'necessary'`: zakáže GA, smaže cookies, skryje banner, konec
   - Jinak: zobrazí banner

### Definice tracking funkce
1. Vytvoří globální funkci `window.lesktopTrackEvent`:
   - Kontroluje `window['ga-disable-G-FLL5D5LE75']` (pokud true, vrátí false)
   - Kontroluje `typeof window.gtag === 'function'`
   - Pokud ano, volá `window.gtag(...args)`
   - Vrátí true/false podle úspěchu

### Kliknutí na "Souhlasím"
1. Uživatel klikne na `#cookie-accept`
2. `localStorage.setItem('lesktop_cookie_consent', 'all')`
3. Volá `loadGa4()`:
   - Kontrola `window.__lesktopGtagLoaded` (prevence duplikace)
   - Nastaví flag `__lesktopGtagLoaded = true`
   - Vytvoří `window.dataLayer` a `window.gtag` funkci
   - Konfiguruje GA4: `gtag('config', 'G-FLL5D5LE75', {...})`
   - Konfiguruje Google Ads: `gtag('config', 'AW-17893281939', {...})`
   - Vytvoří a přidá script tag s `src="https://www.googletagmanager.com/gtag/js?id=AW-17893281939"`
   - Pokud je stránka 404: odešle event `error_404`
4. Přidá třídu `is-hidden` na banner (skryje ho)

### Kliknutí na "Jen nezbytné"
1. Uživatel klikne na `#cookie-necessary`
2. `localStorage.setItem('lesktop_cookie_consent', 'necessary')`
3. Volá `disableGa()`: nastaví `window['ga-disable-G-FLL5D5LE75'] = true`
4. Volá `deleteGaCookies()`: smaže všechny cookies začínající `_ga` nebo `_gid`
5. Přidá třídu `is-hidden` na banner

### Tracking událostí
1. **Telefonní odkazy** (`enhancedTracking.js`):
   - Naslouchá na `click` na `a[href^="tel:"]`
   - Odešle `phone_click` event s číslem a lokací
   - Odešle Google Ads conversion `AW-17893281939/phone_click`

2. **Email odkazy** (`enhancedTracking.js`):
   - Naslouchá na `click` na `a[href^="mailto:"]`
   - Odešle `email_click` event s email adresou

3. **Externí odkazy** (`enhancedTracking.js`):
   - Naslouchá na `click` na `a[target="_blank"]` (externí domény)
   - Odešle `external_link_click` event s URL a textem

4. **Viditelnost sekcí** (`enhancedTracking.js`):
   - IntersectionObserver na `section[id]` s threshold 0.5
   - Při 50% viditelnosti: odešle `section_view` event (pouze jednou díky `dataset.tracked`)

5. **Formuláře** (`form.js`):
   - Po úspěšném odeslání: `form_submission` event a Google Ads conversion

6. **Navigace** (inline onclick v HTML):
   - `window.lesktopTrackEvent('event', 'nav_click', {menu_item: ...})`
   - `window.lesktopTrackEvent('event', 'cta_click', {button_name: ...})`

## 7. Kam jdou data z formulářů

### Web3Forms API
1. **URL:** `https://api.web3forms.com/submit`
2. **Method:** `POST`
3. **Content-Type:** `multipart/form-data` (FormData)
4. **Povinná pole:**
   - `access_key`: `4e724eab-1a15-4f9c-9c19-caa25c2b95fc`
   - `subject`: "Nová poptávka z kalkulačky úklidu - Lesktop" nebo "Nová zpráva z webu Lesktop"
   - `_charset`: `UTF-8`

### Kalkulačka - odeslaná data
- `cleaning_type` (select)
- `area_size` (number)
- `cleaning_frequency` (select, pokud je zobrazeno)
- `additional_services[]` (checkbox array)
- `has_pets` (checkbox)
- `customer_name` (text)
- `customer_email` (email)
- `customer_phone` (tel, volitelné)
- `notes` (textarea)

### Kontaktní formulář - odeslaná data
- `Jmeno` (text)
- `Email` (email)
- `Telefon` (tel, volitelné)
- `Zprava` (textarea)

### Zpracování odpovědi
1. API vrací JSON s `success: true/false` a `message`
2. Pokud `success === true`: zobrazí se úspěšná zpráva, formulář se resetuje
3. Pokud `success === false`: zobrazí se chybová zpráva z `message`
4. Web3Forms zpracuje data a odešle email majiteli webu (konfigurace v Web3Forms dashboardu)

## 8. Co se stane při chybě

### API error (Web3Forms)
1. **HTTP error (response.ok === false):**
   - Throw Error s textem `HTTP error! status: ${response.status}`
   - Catch blok zobrazí: "Při odesílání zprávy došlo k chybě sítě. Zkuste to prosím později." (kontaktní formulář)
   - Nebo: "Při odesílání poptávky došlo k chybě sítě. Zkuste to prosím později." (kalkulačka)

2. **API vrátí success: false:**
   - Zobrazí se zpráva z `result.message` nebo výchozí chybová zpráva
   - Status element dostane třídu `error`

3. **Síťová chyba (fetch selže):**
   - Catch blok zachytí error
   - Zobrazí chybovou zprávu o síťové chybě
   - V dev módu (localhost): error se loguje do konzole

### JavaScript error
1. **Dynamické importy:**
   - Všechny importy v `main.js` mají `.catch(() => {})` - chyby se potlačí
   - Modul se prostě nenačte, web funguje dál

2. **Inicializační funkce:**
   - Všechny moduly kontrolují existenci elementů před použitím
   - Pokud element neexistuje, funkce se ukončí (např. `if (!banner) return;`)

3. **Idempotence:**
   - Všechny moduly kontrolují `dataset.[modul]Init === '1'` - prevence vícenásobné inicializace
   - Pokud už byl inicializován, funkce se ukončí

4. **Tracking chyby:**
   - `window.lesktopTrackEvent` kontroluje existenci funkce před voláním
   - Pokud funkce neexistuje (bez cookies), vrátí false, ale nevyhodí error

### Bez cookies / tracking disabled
1. **Cookie banner zobrazen:**
   - Uživatel vidí banner s možností souhlasu
   - Tracking nefunguje dokud uživatel nesouhlasí

2. **Tracking funkce:**
   - `window.lesktopTrackEvent` kontroluje `ga-disable` flag
   - Pokud je GA zakázáno, funkce vrátí false
   - Pokud `window.gtag` neexistuje, funkce vrátí false
   - Web funguje normálně, pouze tracking nefunguje

3. **Formuláře:**
   - Fungují normálně i bez cookies/trackingu
   - Tracking konverzí se prostě neodešle (kontrola `if (window.lesktopTrackEvent)`)

### Chybějící elementy
1. **Cookie banner:**
   - `if (!banner) return;` - pokud banner neexistuje, inicializace se ukončí

2. **Formuláře:**
   - `if (contactForm && formStatusContact)` - kontrola před připojením handleru
   - Pokud element neexistuje, handler se nepřipojí

3. **Galerie:**
   - `if (!target) return;` - pokud `#before-after-gallery` neexistuje, renderování se ukončí
   - Pokud nejsou data: zobrazí se `#before-after-empty`

### Chybějící data
1. **Before-After galerie:**
   - Kontrola `Array.isArray(window.beforeAfterGallery)`
   - Fallback na prázdné pole `[]`
   - Pokud žádné validní položky: zobrazí se prázdný stav

2. **Formulářová data:**
   - HTML5 validace: `required` atributy
   - Browser validace před odesláním
   - Pokud chybí povinná pole, formulář se neodešle
