# Napojení index.html

## 1. CSS soubory (v pořadí načítání)

1. **Google Fonts** (řádek 9)
   - URL: `https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@400;600&display=swap`
   - Načítání: lazy loading s `media="print" onload="this.media='all'"` a fallback v `<noscript>`

2. **Font Awesome** (řádek 39)
   - URL: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css`
   - Integrity: `sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==`
   - Crossorigin: `anonymous`
   - Referrer policy: `no-referrer`

3. **Hlavní CSS** (řádek 41)
   - Cesta: `/assets/css/style.css`

4. **Before-After CSS** (řádek 42)
   - Cesta: `before-after/before-after.css`

## 2. JavaScript soubory (v pořadí načítání)

1. **Before-After Data** (řádek 515)
   - Cesta: `/before-after/data.js`
   - Atribut: `defer`

2. **Before-After Gallery** (řádek 516)
   - Cesta: `/before-after/gallery.js`
   - Atribut: `defer`

3. **Hlavní JS** (řádek 517)
   - Cesta: `/assets/js/main.js`
   - Atribut: `defer`

## 3. Externí skripty a služby

### Fonty
- **Google Fonts**
  - Preconnect: `https://fonts.googleapis.com` (řádek 7)
  - Preconnect: `https://fonts.gstatic.com` (řádek 8, crossorigin)
  - CSS: `https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@400;600&display=swap` (řádek 9)

### CDN
- **Font Awesome** (řádek 39)
  - URL: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css`

### API služby
- **Web3Forms API** (řádky 279, 461)
  - URL: `https://api.web3forms.com/submit`
  - Použití: action atribut ve formulářích

### Externí odkazy
- **WhatsApp** (řádek 457)
  - URL: `https://wa.me/420775344145`
  
- **Facebook** (řádek 488)
  - URL: `https://www.facebook.com/lesktop.cz`
  
- **Instagram** (řádek 491)
  - URL: `https://www.instagram.com/lesktop.cz`

### Tracking
- **window.lesktopTrackEvent** (řádky 144-147, 171, 177, 183, 189, 195, 201, 207, 213, 444, 456, 457, 477)
  - Funkce volaná v onclick handlerech pro tracking událostí
  - Parametry: 'event', 'nav_click', 'cta_click', 'phone_click', 'click_whatsapp', 'conversion'
  - Google Analytics conversion: `AW-17893281939/whatsapp_click` (řádek 457)

## 4. JSON-LD strukturovaná data

**Ano** (řádky 55-123)

**Typ:** `LocalBusiness`

Obsahuje:
- @context: `https://schema.org`
- @type: `LocalBusiness`
- name, description, telephone, email, image, priceRange
- areaServed (Praha, Střední Čechy)
- address (PostalAddress)
- hasOfferCatalog s itemListElement (3 služby: Pravidelný úklid domácností, Jednorázový úklid, Úklid kanceláří a komerčních prostor)

## 5. Formuláře

### Formulář 1: Kalkulačka úklidu

**Umístění:**
- Sekce: `#pricing` (řádek 230)
- ID: `kalkulacka` (řádek 279)
- Class: `calculator-form glass-panel`

**Action a submit mechanismus:**
- Action: `https://api.web3forms.com/submit`
- Method: `POST`
- Accept-charset: `UTF-8`
- Status element: `#calc-form-status` (řádek 445)

**Hlavní inputy (name atributy):**
- `access_key` (hidden, řádek 280) - hodnota: `4e724eab-1a15-4f9c-9c19-caa25c2b95fc`
- `subject` (hidden, řádek 281) - hodnota: `Nová poptávka z kalkulačky úklidu - Lesktop`
- `cleaning_type` (select, řádek 285) - required
- `area_size` (number, řádek 297) - required
- `cleaning_frequency` (select, řádek 303) - v `#frequencyGroup` (skrytá skupina)
- `additional_services[]` (checkbox, řádky 315-408) - více checkboxů s různými hodnotami
- `has_pets` (checkbox, řádek 417) - hodnota: `Ano`
- `customer_name` (text, řádek 426) - required
- `customer_email` (email, řádek 431) - required
- `customer_phone` (tel, řádek 436) - volitelné
- `notes` (textarea, řádek 441)

**Tracking:**
- Submit button má onclick: `window.lesktopTrackEvent('event','cta_click',{button_name:'ziskat_nezavaznou_nabidku'})` (řádek 444)

### Formulář 2: Kontaktní formulář

**Umístění:**
- Sekce: `#contact` (řádek 451)
- ID: `contactForm` (řádek 461)
- Class: `contact-form glass-panel`

**Action a submit mechanismus:**
- Action: `https://api.web3forms.com/submit`
- Method: `POST`
- Accept-charset: `UTF-8`
- Status element: `#form-status` (řádek 478)

**Hlavní inputy (name atributy):**
- `access_key` (hidden, řádek 462) - hodnota: `4e724eab-1a15-4f9c-9c19-caa25c2b95fc`
- `subject` (hidden, řádek 463) - hodnota: `Nová zpráva z webu Lesktop`
- `Jmeno` (text, řádek 467) - required
- `Email` (email, řádek 471) - required
- `Zprava` (textarea, řádek 475) - required

**Tracking:**
- Submit button má onclick: `window.lesktopTrackEvent('event','cta_click',{button_name:'odeslat_poptavku'})` (řádek 477)
