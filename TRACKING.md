# Tracking dokumentace - Lesktop

Tento dokument popisuje implementaci Google Analytics 4 (GA4) a Google Ads trackingu v projektu Lesktop.

## Obsah

- [Architektura trackingu](#architektura-trackingu)
- [Consent Mode](#consent-mode)
- [Inicializace GA4 a Google Ads](#inicializace-ga4-a-google-ads)
- [Tracking wrapper](#tracking-wrapper)
- [Soubory s trackingem](#soubory-s-trackingem)
- [Seznam všech eventů](#seznam-všech-eventů)
- [Leady a konverze](#leady-a-konverze)
- [Na co si dát pozor](#na-co-si-dát-pozor)
- [Přidání nového trackingu](#přidání-nového-trackingu)

---

## Architektura trackingu

Tracking v projektu Lesktop je postaven na:

- **Google Analytics 4**: `G-FLL5D5LE75`
- **Google Ads**: `AW-17893281939`
- **Consent Mode v2**: Implementován pro GDPR compliance
- **Vlastní wrapper**: `window.lesktopTrackEvent()` pro centralizované volání

### Princip fungování

1. Uživatel navštíví stránku → tracking je **vypnutý** (default)
2. Cookie banner se zobrazí → uživatel vybere souhlas
3. Pokud souhlasí s "všemi cookies" → gtag script se načte a tracking se aktivuje
4. Pokud zvolí "jen nezbytné" → tracking zůstane vypnutý
5. Všechny tracking eventy procházejí přes `window.lesktopTrackEvent()` wrapper

---

## Consent Mode

### Implementace

Consent Mode je implementován v `assets/js/components/cookieBanner.js`.

### Defaultní stav (před souhlasem)

```javascript
analytics_storage: 'denied'
ad_storage: 'denied'
ad_user_data: 'denied'
ad_personalization: 'denied'
```

**Důležité**: Tracking je **vypnutý** dokud uživatel explicitně nesouhlasí.

### Po souhlasu s "všemi cookies"

```javascript
analytics_storage: 'granted'
ad_storage: 'granted'
ad_user_data: 'granted'
ad_personalization: 'granted'
```

### Po volbě "jen nezbytné"

Tracking zůstává vypnutý, cookies se smažou.

### Aktualizace consentu

Consent se aktualizuje přes `gtag('consent', 'update', {...})` při změně volby uživatele.

---

## Inicializace GA4 a Google Ads

### Kde se inicializuje

Inicializace probíhá v `assets/js/components/cookieBanner.js` v funkci `ensureGtag()`.

### Kdy se inicializuje

- **Pouze po souhlasu** s "všemi cookies"
- gtag script se načítá dynamicky až po souhlasu
- Script se načte z: `https://www.googletagmanager.com/gtag/js?id=AW-17893281939`

### Konfigurace GA4

```javascript
window.gtag('config', 'G-FLL5D5LE75', {
  anonymize_ip: true,
  allow_google_signals: true,
  allow_ad_personalization_signals: true
});
```

### Konfigurace Google Ads

```javascript
window.gtag('config', 'AW-17893281939', {
  allow_google_signals: true,
  allow_ad_personalization_signals: true
});
```

### Speciální tracking

- **404 stránka**: Automaticky se pošle event `error_404` při načtení stránky s `data-page="404"`

---

## Tracking wrapper

### `window.lesktopTrackEvent()`

Všechny tracking eventy musí procházet přes tento wrapper.

#### Kde je definován

`assets/js/components/cookieBanner.js` (řádek 40-47)

#### Jak funguje

```javascript
window.lesktopTrackEvent = function lesktopTrackEvent() {
  // Kontrola, zda je tracking povolen
  if (window[`ga-disable-G-FLL5D5LE75`]) return false;
  
  // Kontrola, zda je gtag dostupný
  if (typeof window.gtag === 'function') {
    window.gtag.apply(window, arguments);
    return true;
  }
  return false;
};
```

#### Použití

```javascript
// Jednoduchý event
window.lesktopTrackEvent('event', 'event_name');

// Event s parametry
window.lesktopTrackEvent('event', 'event_name', {
  param1: 'value1',
  param2: 'value2'
});
```

#### Důležité

- **Vždy** používej `window.lesktopTrackEvent()` místo přímého `gtag()`
- Wrapper automaticky kontroluje, zda je tracking povolen
- Pokud tracking není povolen, volání se tiše ignoruje (bez chyby)

---

## Soubory s trackingem

### 1. `assets/js/components/cookieBanner.js`
- **Účel**: Consent management, inicializace gtag, tracking wrapper
- **Klíčové funkce**:
  - `initCookieBanner()`: Hlavní inicializační funkce
  - `ensureGtag()`: Načte gtag script a nakonfiguruje GA4/Ads
  - `applyConsent()`: Aktualizuje consent mode
  - `window.lesktopTrackEvent()`: Tracking wrapper
- **Eventy**:
  - `cookie_consent_accepted`: Při souhlasu s všemi cookies
  - `cookie_consent_necessary_only`: Při volbě jen nezbytné
  - `error_404`: Automaticky na 404 stránce

### 2. `assets/js/components/enhancedTracking.js`
- **Účel**: Tracking telefonních hovorů, emailů, externích odkazů, viditelnosti sekcí
- **Klíčové funkce**:
  - `initEnhancedTracking()`: Inicializace enhanced trackingu
- **Eventy**:
  - `generate_lead`: Telefonní a WhatsApp kliky
  - `email_click`: Email kliky
  - `external_link_click`: Externí odkazy (kromě WhatsApp)
  - `section_view`: Viditelnost sekcí (IntersectionObserver)

### 3. `assets/js/components/advancedTracking.js`
- **Účel**: Pokročilé engagement metriky
- **Klíčové funkce**:
  - `initAdvancedTracking()`: Inicializace advanced trackingu
- **Eventy**:
  - `page_scroll_depth`: Scroll na 25%, 50%, 75%, 100%
  - `time_on_site_60s`: 60 sekund na stránce

### 4. `assets/js/components/form.js`
- **Účel**: Tracking formulářů a konverzí
- **Klíčové funkce**:
  - `trackFormConversion()`: Tracking úspěšného odeslání formuláře
- **Eventy**:
  - `form_submission`: Úspěšné odeslání formuláře
  - `generate_lead`: Lead event po odeslání formuláře
  - `conversion`: Google Ads conversion event
  - `form_validation_error`: Chyba validace formuláře
  - `form_submit_error`: Chyba při odesílání (network/server)

### 5. `assets/js/components/universalTracking.js`
- **Účel**: Univerzální tracking CTA tlačítek a navigace napříč webem
- **Klíčové funkce**:
  - `initUniversalTracking()`: Inicializace univerzálního trackingu
- **Eventy**:
  - `cta_click`: Klik na CTA tlačítko (napříč webem)
  - `nav_click`: Klik na navigační odkaz (napříč webem)

### 6. `assets/js/pages/index.js`
- **Účel**: Page-specific tracking pro homepage
- **Klíčové funkce**:
  - `initIndexTracking()`: Tracking specifický pro homepage
- **Eventy**:
  - `nav_click`: Navigační kliky na homepage (přes `data-track-event`)
  - `hero_cta_click`: Klik na hero CTA
  - `cta_click`: Klik na CTA tlačítka na homepage (přes `data-track-event`)
  - `services_expand`: Rozbalení "Zobrazit další služby" v kalkulačce

---

## Seznam všech eventů

### Consent a chyby

#### `cookie_consent_accepted`
- **Kdy**: Při kliknutí na "Souhlasím" v cookie banneru
- **Kde**: `cookieBanner.js`
- **Parametry**: Žádné

#### `cookie_consent_necessary_only`
- **Kdy**: Při kliknutí na "Jen nezbytné" v cookie banneru
- **Kde**: `cookieBanner.js`
- **Parametry**: Žádné

#### `error_404`
- **Kdy**: Automaticky při načtení 404 stránky
- **Kde**: `cookieBanner.js`
- **Parametry**: Žádné

---

### Leady

#### `generate_lead`
- **Kdy**: 
  - Telefonní klik (`tel:` odkazy)
  - WhatsApp klik (`wa.me` odkazy)
  - Úspěšné odeslání formuláře
- **Kde**: 
  - `enhancedTracking.js` (telefon, WhatsApp)
  - `form.js` (formuláře)
- **Parametry**:
  ```javascript
  {
    event_category: 'engagement' | 'form',
    event_label: 'phone_click' | 'whatsapp_click' | 'kalkulacka_nebo_kontakt',
    contact_type?: 'phone' | 'whatsapp',  // Pouze pro telefon/WhatsApp
    lead_source: 'phone' | 'whatsapp' | 'contact_form' | 'calculation_form',
    page_type: string  // 'index', 'sluzby', 'prezentace', atd.
  }
  ```

#### `email_click`
- **Kdy**: Klik na email odkaz (`mailto:`)
- **Kde**: `enhancedTracking.js`
- **Parametry**:
  ```javascript
  {
    email: string,
    subject?: string,  // Pokud je v mailto: odkazu
    contact_type: 'email',
    lead_source: 'email',
    page_type: string
  }
  ```

---

### Formuláře

#### `form_submission`
- **Kdy**: Úspěšné odeslání formuláře (kontakt nebo kalkulačka)
- **Kde**: `form.js`
- **Parametry**:
  ```javascript
  {
    form_type: 'contact' | 'calculation',
    form_name: string,  // 'Kontaktni formular' | 'Kalkulacni formular'
    value: number,  // 900 (contact) nebo 1200 (calculation)
    currency: 'CZK',
    event_id: string,  // Unikátní ID pro deduplikaci
    cleaning_type?: string,  // Pokud je v kalkulačce
    frequency?: string  // Pokud je v kalkulačce
  }
  ```

#### `form_validation_error`
- **Kdy**: HTML5 validation error při submitu formuláře
- **Kde**: `form.js`
- **Parametry**:
  ```javascript
  {
    form_type: 'contact' | 'calculation' | 'unknown',
    field_name: string,  // name nebo id pole
    error_type: string  // validation message nebo 'validation_failed'
  }
  ```

#### `form_submit_error`
- **Kdy**: Chyba při odesílání formuláře (network nebo server)
- **Kde**: `form.js`
- **Parametry**:
  ```javascript
  {
    form_type: 'contact' | 'calculation',
    error_type: 'server_error' | 'network_error',
    error_message: string
  }
  ```

#### `conversion` (Google Ads)
- **Kdy**: Úspěšné odeslání formuláře
- **Kde**: `form.js`
- **Parametry**:
  ```javascript
  {
    send_to: 'AW-17893281939/XoMGCP-N4-kbEJOhl9RC',
    value: number,  // 900 (contact) nebo 1200 (calculation)
    currency: 'CZK',
    transaction_id: string  // Unikátní ID pro deduplikaci
  }
  ```

---

### Engagement

#### `section_view`
- **Kdy**: Sekce se stane viditelnou (IntersectionObserver, threshold 20%)
- **Kde**: `enhancedTracking.js`
- **Parametry**:
  ```javascript
  {
    section_id: string,  // ID sekce
    section_name: string  // Text z .section-title nebo ID
  }
  ```
- **Poznámka**: Trackuje se jen jednou na sekci

#### `page_scroll_depth`
- **Kdy**: Scroll na 25%, 50%, 75%, 100% stránky
- **Kde**: `advancedTracking.js`
- **Parametry**:
  ```javascript
  {
    depth_percent: number  // 25, 50, 75, nebo 100
  }
  ```
- **Poznámka**: Každý threshold se posílá jen jednou

#### `time_on_site_60s`
- **Kdy**: 60 sekund na stránce
- **Kde**: `advancedTracking.js`
- **Parametry**: Žádné
- **Poznámka**: Posílá se jen jednou na návštěvu

#### `services_expand`
- **Kdy**: První rozbalení "Zobrazit další služby" v kalkulačce
- **Kde**: `index.js`
- **Parametry**: Žádné
- **Poznámka**: Posílá se jen při prvním rozbalení

---

### CTA a navigace

#### `cta_click`
- **Kdy**: Klik na CTA tlačítko
- **Kde**: 
  - `index.js` (homepage, přes `data-track-event`)
  - `universalTracking.js` (ostatní stránky)
- **Parametry**:
  ```javascript
  {
    button_name: string,  // id, data-button-name, nebo className
    button_text: string,  // Text tlačítka
    page_type: string,  // 'index', 'sluzby', atd.
    section?: string  // ID sekce nebo název (pokud je dostupný)
  }
  ```
- **Poznámka**: Na homepage se používá `data-track-button-name` pro `button_name`

#### `nav_click`
- **Kdy**: Klik na navigační odkaz
- **Kde**: 
  - `index.js` (homepage, přes `data-track-event`)
  - `universalTracking.js` (ostatní stránky)
- **Parametry**:
  ```javascript
  {
    menu_item: string,  // Text odkazu
    page_type: string,  // 'index', 'sluzby', atd.
    link_href?: string  // href odkazu (pouze na ostatních stránkách)
  }
  ```

#### `hero_cta_click`
- **Kdy**: Klik na hlavní CTA v hero sekci na homepage
- **Kde**: `index.js`
- **Parametry**: Žádné

---

### Externí odkazy

#### `external_link_click`
- **Kdy**: Klik na externí odkaz (kromě WhatsApp)
- **Kde**: `enhancedTracking.js`
- **Parametry**:
  ```javascript
  {
    link_url: string,
    link_text: string
  }
  ```

---

## Leady a konverze

### Leady

Leady jsou trackovány přes event `generate_lead` z následujících zdrojů:

1. **Telefonní kliky** (`lead_source: 'phone'`)
   - Všechny `tel:` odkazy napříč webem
   - Trackuje se v `enhancedTracking.js`

2. **WhatsApp kliky** (`lead_source: 'whatsapp'`)
   - Všechny `wa.me` odkazy
   - Trackuje se v `enhancedTracking.js`

3. **Email kliky** (`lead_source: 'email'`)
   - Všechny `mailto:` odkazy
   - Trackuje se jako `email_click` event v `enhancedTracking.js`

4. **Kontaktní formulář** (`lead_source: 'contact_form'`)
   - Úspěšné odeslání kontaktního formuláře
   - Hodnota: **900 CZK**
   - Trackuje se v `form.js`

5. **Kalkulačka** (`lead_source: 'calculation_form'`)
   - Úspěšné odeslání kalkulačky
   - Hodnota: **1200 CZK**
   - Trackuje se v `form.js`

### Google Ads konverze

Konverze do Google Ads se posílají automaticky při úspěšném odeslání formuláře:

- **Conversion ID**: `AW-17893281939/XoMGCP-N4-kbEJOhl9RC`
- **Hodnoty**:
  - Kontaktní formulář: 900 CZK
  - Kalkulačka: 1200 CZK
- **Transaction ID**: Unikátní ID pro deduplikaci (`${formType}_${timestamp}_${random}`)

### Důležité pro analýzu

Pro analýzu leadů v GA4 používej:
- `lead_source` parametr pro segmentaci podle zdroje
- `contact_type` parametr pro rozlišení typu kontaktu
- `page_type` parametr pro zjištění, ze které stránky lead přišel

---

## Na co si dát pozor

### ⚠️ Kritické - nesmí se rozbít

1. **`form_submission` event**
   - **Proč**: Používá se pro Google Ads konverze
   - **Kde**: `form.js` → `trackFormConversion()`
   - **Co nesmíš změnit**: Struktura parametrů `form_type`, `value`, `currency`, `event_id`

2. **`conversion` event (Google Ads)**
   - **Proč**: Přímé konverze do Google Ads
   - **Kde**: `form.js` → `trackFormConversion()`
   - **Co nesmíš změnit**: `send_to` parametr, `transaction_id` struktura

3. **`generate_lead` event**
   - **Proč**: Používá se pro lead tracking v GA4
   - **Kde**: `enhancedTracking.js`, `form.js`
   - **Co nesmíš změnit**: `lead_source` parametr (musí být konzistentní)

4. **Consent Mode logika**
   - **Proč**: GDPR compliance
   - **Kde**: `cookieBanner.js`
   - **Co nesmíš změnit**: Defaultní stav (`denied`), struktura consent objektů

5. **`window.lesktopTrackEvent()` wrapper**
   - **Proč**: Všechny eventy procházejí přes něj
   - **Kde**: `cookieBanner.js`
   - **Co nesmíš změnit**: Kontrola `ga-disable-*` flagu, kontrola existence `gtag`

### ⚠️ Důležité - může ovlivnit analýzu

1. **Duplicity eventů**
   - Některé akce mohou být trackovány z více míst
   - Např.: CTA tlačítka na homepage mají `data-track-event`, ale `universalTracking.js` je přeskočí
   - **Řešení**: Vždy kontroluj, zda element už nemá tracking

2. **Timing inicializace**
   - Tracking komponenty se inicializují v určitém pořadí (viz `main.bundle.js`)
   - `cookieBanner` musí být před tracking komponentami
   - **Řešení**: Neměň pořadí v `GLOBAL_INIT_REGISTRY`

3. **Page type detekce**
   - `page_type` se získává z `document.body.dataset.page`
   - Pokud stránka nemá `data-page`, použije se `'unknown'`
   - **Řešení**: Vždy přidej `data-page` atribut na nové stránky

4. **Form conversion hodnoty**
   - Hodnoty konverzí jsou hardcoded v `form.js`:
     - `contact: 900`
     - `calculation: 1200`
   - **Řešení**: Pokud změníš hodnoty, aktualizuj i dokumentaci

### ⚠️ Pozor na

1. **WhatsApp tracking**
   - WhatsApp odkazy jsou trackovány jako `generate_lead` v `enhancedTracking.js`
   - `universalTracking.js` je přeskočí (aby se neposílaly duplicity)
   - **Nesmíš**: Trackovat WhatsApp odkazy jinde

2. **Form submit tracking**
   - Form submit tlačítka jsou trackována v `form.js`
   - `universalTracking.js` je přeskočí
   - **Nesmíš**: Trackovat form submit tlačítka jinde

3. **Cookie banner tracking**
   - Cookie banner tlačítka jsou trackována v `cookieBanner.js`
   - `universalTracking.js` je přeskočí
   - **Nesmíš**: Trackovat cookie banner tlačítka jinde

---

## Přidání nového trackingu

### Přidání trackingu na CTA tlačítko

#### Na homepage (s `data-track-event`)

1. Přidej atributy do HTML:
   ```html
   <a href="#section" 
      class="btn btn-primary" 
      data-track-event="cta_click" 
      data-track-button-name="nazev_tlacitka">
     Text tlačítka
   </a>
   ```

2. Tracking se automaticky zpracuje v `index.js` → `initIndexTracking()`

3. Event bude mít parametry:
   ```javascript
   {
     button_name: 'nazev_tlacitka',  // z data-track-button-name
     menu_item?: string  // pokud je data-track-menu-item
   }
   ```

#### Na ostatních stránkách (automaticky)

1. Přidej tlačítko s třídou `btn`:
   ```html
   <a href="#section" class="btn btn-primary">
     Text tlačítka
   </a>
   ```

2. Tracking se automaticky zpracuje v `universalTracking.js`

3. Event bude mít parametry:
   ```javascript
   {
     button_name: string,  // id, data-button-name, nebo className
     button_text: string,  // text tlačítka
     page_type: string,  // z data-page
     section: string  // ID sekce (pokud je dostupný)
   }
   ```

**Poznámka**: Pokud chceš přidat tracking na tlačítko, které by mělo být přeskočeno (např. cookie banner), přidej `data-track-event` atribut a `universalTracking.js` ho přeskočí.

---

### Přidání trackingu na formulář

1. Formulář musí být v `form.js` → `initForms()` registrován

2. Při úspěšném odeslání se automaticky zavolá `trackFormConversion()`:
   ```javascript
   trackFormConversion('form_type', 'Form Name', {
     // volitelné extra parametry
   });
   ```

3. Pokud potřebuješ přidat nový typ formuláře:
   - Přidej do `conversionValueByForm` hodnotu
   - Přidej do `conversionSendToByForm` Google Ads conversion ID (pokud je potřeba)

4. Eventy se pošlou automaticky:
   - `form_submission`
   - `generate_lead`
   - `conversion` (Google Ads, pokud je `send_to` definován)

---

### Přidání nového typu eventu

1. Vytvoř nový event v příslušném souboru:
   ```javascript
   if (typeof window.lesktopTrackEvent === 'function') {
     window.lesktopTrackEvent('event', 'novy_event', {
       param1: 'value1',
       param2: 'value2'
     });
   }
   ```

2. **Vždy** použij `window.lesktopTrackEvent()` místo přímého `gtag()`

3. **Vždy** zkontroluj, zda je funkce dostupná (`typeof window.lesktopTrackEvent === 'function'`)

4. Pokud je event důležitý pro leady, přidej `lead_source` parametr

5. Pokud je event důležitý pro analýzu, přidej `page_type` parametr

---

### Kontrolní seznam

Před commitem nového trackingu zkontroluj:

- [ ] Používáš `window.lesktopTrackEvent()` místo `gtag()`
- [ ] Kontroluješ, zda je funkce dostupná
- [ ] Nepřidáváš duplicity (zkontroluj, zda element už není trackován)
- [ ] Přidáváš `page_type` parametr (pokud je to relevantní)
- [ ] Přidáváš `lead_source` parametr (pokud je to lead event)
- [ ] Aktualizuješ tuto dokumentaci (pokud přidáváš nový event)

---

## Závěr

Tato dokumentace popisuje aktuální stav trackingu v projektu Lesktop. Při jakýchkoliv změnách v trackingu aktualizuj tento dokument.

**Poslední aktualizace**: 2026-03-XX
