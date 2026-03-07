# Audit Externích služeb - Lesktop Project

**Datum auditu:** 2025-01-XX  
**Soubory kontrolované:** `cookieBanner.js`, `form.js`, `index.html`  
**Dokumentace kontrolovaná:** `kb/08_tok_fungovani_webu.md`, `kb/12_architektura_systemu.md`

---

## 1. Web3Forms API

### ✅ Konfigurace v kódu

**URL:**
- **Skutečnost:** `https://api.web3forms.com/submit` (v `index.html` řádky 279, 461)
- **Dokumentace:** `kb/08_tok_fungovani_webu.md` (řádek 259) - `https://api.web3forms.com/submit` ✓
- **Dokumentace:** `kb/12_architektura_systemu.md` (řádek 74) - `https://api.web3forms.com/submit` ✓
- **Status:** ✅ Správně

**Access Key:**
- **Skutečnost:** `4e724eab-1a15-4f9c-9c19-caa25c2b95fc` (v `index.html` řádky 280, 462)
- **Dokumentace:** `kb/12_architektura_systemu.md` (řádek 76) - `4e724eab-1a15-4f9c-9c19-caa25c2b95fc` ✓
- **Status:** ✅ Správně

**Subject (kalkulačka):**
- **Skutečnost:** `"Nová poptávka z kalkulačky úklidu - Lesktop"` (v `index.html` řádek 281)
- **Dokumentace:** `kb/08_tok_fungovani_webu.md` (řádek 264) - `"Nová poptávka z kalkulačky úklidu - Lesktop"` ✓
- **Status:** ✅ Správně

**Subject (kontaktní formulář):**
- **Skutečnost:** `"Nová zpráva z webu Lesktop"` (v `index.html` řádek 463)
- **Dokumentace:** `kb/08_tok_fungovani_webu.md` (řádek 264) - `"Nová zpráva z webu Lesktop"` ✓
- **Status:** ✅ Správně

**Metoda:**
- **Skutečnost:** `POST` (v `index.html` řádky 279, 461; v `form.js` řádky 37, 113)
- **Dokumentace:** `kb/12_architektura_systemu.md` (řádek 77) - `POST` ✓
- **Status:** ✅ Správně

**Headers:**
- **Skutečnost:** `Accept: application/json` (v `form.js` řádky 40, 117)
- **Dokumentace:** `kb/12_architektura_systemu.md` (řádek 77) - `Accept: application/json` ✓
- **Status:** ✅ Správně

**Charset:**
- **Skutečnost:** `UTF-8` (v `index.html` řádky 279, 461 jako `accept-charset="UTF-8"`; v `form.js` řádky 33, 110 jako `formData.append('_charset', 'UTF-8')`)
- **Dokumentace:** `kb/08_tok_fungovani_webu.md` (řádek 265) - `UTF-8` ✓
- **Dokumentace:** `kb/12_architektura_systemu.md` (řádek 78) - `UTF-8` ✓
- **Status:** ✅ Správně

**Formuláře:**
- **Kalkulačka:** `#kalkulacka` (v `index.html` řádek 279; v `form.js` řádek 14)
- **Kontaktní formulář:** `#contactForm` (v `index.html` řádek 461; v `form.js` řádek 12)
- **Dokumentace:** `kb/12_architektura_systemu.md` (řádek 75) - `#kalkulacka`, `#contactForm` ✓
- **Status:** ✅ Správně

### ✅ Fallbacky a error handling

**Error handling v `form.js`:**
- ✅ Try-catch bloky (řádky 35-89, 112-172)
- ✅ Kontrola `response.ok` (řádky 44, 121)
- ✅ Kontrola `result.success` (řádky 50, 127)
- ✅ Fallback zprávy: `result.message || 'výchozí zpráva'` (řádky 70, 153)
- ✅ Síťové chyby: catch blok s výchozí zprávou (řádky 74-78, 157-161)
- ✅ Dev mode logging: `logError` pouze na localhost (řádky 5-6, 69, 75, 152, 158)
- ✅ Loading stavy: disable tlačítka, změna textu (řádky 21-25, 98-102)
- ✅ Timeout pro skrytí zprávy: 5 sekund (řádky 84-88, 167-171)

**Dokumentace:**
- ✅ `kb/08_tok_fungovani_webu.md` (řádky 291-304) správně popisuje error handling ✓

### ⚠️ Nesoulady v Web3Forms

**Žádné nesoulady.** Všechna konfigurace odpovídá dokumentaci. ✓

---

## 2. Google Analytics 4

### ✅ Konfigurace v kódu

**Measurement ID:**
- **Skutečnost:** `G-FLL5D5LE75` (v `cookieBanner.js` řádek 8)
- **Dokumentace:** `kb/12_architektura_systemu.md` (řádek 81) - `G-FLL5D5LE75` ✓
- **Status:** ✅ Správně

**Načítání:**
- **Skutečnost:** Dynamicky přes `cookieBanner.js` po souhlasu s cookies (řádky 25-60)
- **Dokumentace:** `kb/12_architektura_systemu.md` (řádek 82) - "dynamicky přes `cookieBanner.js` po souhlasu s cookies" ✓
- **Status:** ✅ Správně

**Skript URL:**
- **Skutečnost:** `https://www.googletagmanager.com/gtag/js?id=AW-17893281939` (v `cookieBanner.js` řádek 23)
- **Dokumentace:** `kb/12_architektura_systemu.md` (řádek 83) - `https://www.googletagmanager.com/gtag/js?id=AW-17893281939` ✓
- **Poznámka:** Skript URL používá Google Ads ID (`AW-17893281939`), což je správné, protože gtag.js může načítat více tagů najednou
- **Status:** ✅ Správně

**Konfigurace:**
- **Skutečnost:** 
  ```javascript
  window.gtag('config', 'G-FLL5D5LE75', {
    anonymize_ip: true,
    allow_google_signals: true,
    allow_ad_personalization_signals: true
  });
  ```
  (v `cookieBanner.js` řádky 37-41)
- **Dokumentace:** `kb/12_architektura_systemu.md` (řádek 84) - "anonymize_ip, allow_google_signals, allow_ad_personalization_signals" ✓
- **Status:** ✅ Správně

**ga-disable flag:**
- **Skutečnost:** `window['ga-disable-G-FLL5D5LE75']` (v `cookieBanner.js` řádky 11, 15)
- **Dokumentace:** `kb/08_tok_fungovani_webu.md` (řádek 206) - `window['ga-disable-G-FLL5D5LE75']` ✓
- **Status:** ✅ Správně

### ✅ Fallbacky a error handling

**Prevenci duplikace:**
- ✅ Kontrola `window.__lesktopGtagLoaded` (řádek 26)
- ✅ Kontrola existujícího script tagu (řádek 49)
- ✅ Nastavení flagu `__lesktopGtagLoaded = true` (řádek 27)

**Graceful degradation:**
- ✅ `window.lesktopTrackEvent` kontroluje `ga-disable` flag (řádek 15)
- ✅ `window.lesktopTrackEvent` kontroluje existenci `window.gtag` (řádek 16)
- ✅ Vrátí `false` pokud GA není dostupné (řádek 20)

**Dokumentace:**
- ✅ `kb/08_tok_fungovani_webu.md` (řádky 323-332) správně popisuje graceful degradation ✓

### ⚠️ Nesoulady v Google Analytics

**Žádné nesoulady.** Všechna konfigurace odpovídá dokumentaci. ✓

---

## 3. Google Ads

### ✅ Konfigurace v kódu

**Conversion ID:**
- **Skutečnost:** `AW-17893281939` (v `cookieBanner.js` řádek 44; v `form.js` řádky 63, 146; v `index.html` řádek 457)
- **Dokumentace:** `kb/12_architektura_systemu.md` (řádek 87) - `AW-17893281939` ✓
- **Status:** ✅ Správně

**Skript URL:**
- **Skutečnost:** `https://www.googletagmanager.com/gtag/js?id=AW-17893281939` (v `cookieBanner.js` řádek 23)
- **Dokumentace:** `kb/12_architektura_systemu.md` (řádek 88) - "stejný skript jako GA4" ✓
- **Status:** ✅ Správně

**Konfigurace:**
- **Skutečnost:**
  ```javascript
  window.gtag('config', 'AW-17893281939', {
    allow_google_signals: true,
    allow_ad_personalization_signals: true
  });
  ```
  (v `cookieBanner.js` řádky 44-47)
- **Dokumentace:** `kb/12_architektura_systemu.md` (řádek 88) - "samostatná konfigurace" ✓
- **Status:** ✅ Správně

**Conversions:**
- **Skutečnost:** Tracking přes `window.lesktopTrackEvent('event', 'conversion', {...})` (v `form.js` řádky 62-64, 145-147; v `index.html` řádek 457)
- **Dokumentace:** `kb/12_architektura_systemu.md` (řádek 89) - "tracking přes `window.lesktopTrackEvent('event', 'conversion', {...})`" ✓
- **Status:** ✅ Správně

**Conversion events:**
- **Kontaktní formulář:** `AW-17893281939/contact_form_submission` (v `form.js` řádek 63)
- **Kalkulačka:** `AW-17893281939/calculation_form_submission` (v `form.js` řádek 146)
- **WhatsApp:** `AW-17893281939/whatsapp_click` (v `index.html` řádek 457)
- **Telefon:** `AW-17893281939/phone_click` (v `enhancedTracking.js` - není v auditovaných souborech, ale je zmíněno v dokumentaci)
- **Dokumentace:** `kb/08_tok_fungovani_webu.md` (řádky 122, 153, 235) správně uvádí conversion events ✓

### ✅ Fallbacky a error handling

**Graceful degradation:**
- ✅ `window.lesktopTrackEvent` kontroluje `ga-disable` flag před odesláním
- ✅ `window.lesktopTrackEvent` kontroluje existenci `window.gtag` před voláním
- ✅ Vrátí `false` pokud tracking není dostupný

**Dokumentace:**
- ✅ `kb/08_tok_fungovani_webu.md` (řádky 323-332) správně popisuje graceful degradation ✓

### ⚠️ Nesoulady v Google Ads

**Žádné nesoulady.** Všechna konfigurace odpovídá dokumentaci. ✓

---

## 4. CDN služby

### ✅ Google Fonts

**URL:**
- **Skutečnost:** `https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@400;600&display=swap` (v `index.html` řádek 9)
- **Dokumentace:** `kb/12_architektura_systemu.md` (řádek 92) - `https://fonts.googleapis.com/css2?...` ✓
- **Status:** ✅ Správně

**Non-blocking načtení:**
- **Skutečnost:** `media="print" onload="this.media='all'"` (v `index.html` řádek 9)
- **Dokumentace:** `kb/08_tok_fungovani_webu.md` (řádek 12) - "Non-blocking načtení: `media="print" onload="this.media='all'"`" ✓
- **Status:** ✅ Správně

**Fallback:**
- **Skutečnost:** `<noscript><link rel="stylesheet" href="..."></noscript>` (v `index.html` řádek 10)
- **Dokumentace:** `kb/08_tok_fungovani_webu.md` (řádek 13) - "Fallback v `<noscript>` pro případy bez JavaScriptu" ✓
- **Status:** ✅ Správně

**Fonty:**
- **Skutečnost:** Montserrat (400, 500, 600, 700) a Open Sans (400, 600) (v `index.html` řádek 9)
- **Dokumentace:** `kb/08_tok_fungovani_webu.md` (řádek 14) - "Montserrat (400, 500, 600, 700) a Open Sans (400, 600)" ✓
- **Status:** ✅ Správně

**Preconnect:**
- **Skutečnost:** 
  - `<link rel="preconnect" href="https://fonts.googleapis.com">` (řádek 7)
  - `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` (řádek 8)
- **Dokumentace:** Není explicitně zmíněno v dokumentaci
- **Status:** ⚠️ **Chybějící dokumentace** - preconnect linky nejsou zmíněny

### ✅ Font Awesome

**URL:**
- **Skutečnost:** `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css` (v `index.html` řádek 39)
- **Dokumentace:** `kb/12_architektura_systemu.md` (řádek 93) - `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css` ✓
- **Status:** ✅ Správně

**Integrity hash:**
- **Skutečnost:** `sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==` (v `index.html` řádek 39)
- **Dokumentace:** `kb/08_tok_fungovani_webu.md` (řádek 18) - "Integrity hash pro bezpečnost" ✓
- **Status:** ✅ Správně

**Crossorigin a referrerpolicy:**
- **Skutečnost:** `crossorigin="anonymous" referrerpolicy="no-referrer"` (v `index.html` řádek 39)
- **Dokumentace:** Není explicitně zmíněno v dokumentaci
- **Status:** ⚠️ **Chybějící dokumentace** - crossorigin a referrerpolicy nejsou zmíněny

### ⚠️ Nesoulady v CDN službách

**Chybějící dokumentace:**
1. **Preconnect linky** pro Google Fonts nejsou zmíněny v dokumentaci
2. **Crossorigin a referrerpolicy** pro Font Awesome nejsou zmíněny v dokumentaci

---

## 5. Detailní kontroly

### cookieBanner.js

**Kontrola:**
- ✅ Measurement ID: `G-FLL5D5LE75` (řádek 8) ✓
- ✅ Conversion ID: `AW-17893281939` (řádek 44) ✓
- ✅ Skript URL: správně používá Google Ads ID pro gtag.js (řádek 23) ✓
- ✅ ga-disable flag: správně implementován (řádky 11, 15) ✓
- ✅ Prevenci duplikace: `__lesktopGtagLoaded` flag (řádek 26) ✓
- ✅ Kontrola existujícího script tagu (řádek 49) ✓
- ✅ 404 tracking: kontroluje `document.body?.dataset.page === '404'` (řádek 57) ✓
- ✅ Cookie deletion: správně implementováno (řádky 62-71) ✓
- ✅ localStorage key: `lesktop_cookie_consent` (řádek 7) ✓

**Nesoulad:** Žádný.

### form.js

**Kontrola:**
- ✅ Web3Forms URL: používá `contactForm.action` a `calcForm.action` (řádky 36, 113) ✓
- ✅ Charset: `formData.append('_charset', 'UTF-8')` (řádky 33, 110) ✓
- ✅ Headers: `Accept: application/json` (řádky 40, 117) ✓
- ✅ Error handling: try-catch bloky (řádky 35-89, 112-172) ✓
- ✅ Dev mode logging: `logError` pouze na localhost (řádky 5-6) ✓
- ✅ Tracking: kontrola `window.lesktopTrackEvent` před voláním (řádky 56, 133) ✓
- ✅ Conversion events: správné IDs (řádky 63, 146) ✓
- ✅ Loading stavy: správně implementovány (řádky 21-25, 98-102) ✓
- ✅ Timeout: 5 sekund pro skrytí zprávy (řádky 84-88, 167-171) ✓

**Nesoulad:** Žádný.

### index.html

**Kontrola:**
- ✅ Web3Forms action: `https://api.web3forms.com/submit` (řádky 279, 461) ✓
- ✅ Access key: `4e724eab-1a15-4f9c-9c19-caa25c2b95fc` (řádky 280, 462) ✓
- ✅ Subject: správné hodnoty (řádky 281, 463) ✓
- ✅ Accept-charset: `UTF-8` (řádky 279, 461) ✓
- ✅ Google Fonts: správná URL a non-blocking načtení (řádek 9) ✓
- ✅ Font Awesome: správná URL a integrity hash (řádek 39) ✓
- ✅ Preconnect: správně implementováno (řádky 7-8) ✓
- ✅ WhatsApp conversion: správné ID (řádek 457) ✓

**Nesoulad:** Žádný.

---

## 6. Shrnutí zjištění

### ✅ Pozitivní zjištění

1. **Web3Forms konfigurace je správná** - URL, access key, subject, charset, metoda, headers
2. **Google Analytics konfigurace je správná** - Measurement ID, skript URL, konfigurace, ga-disable flag
3. **Google Ads konfigurace je správná** - Conversion ID, skript URL, konfigurace, conversion events
4. **CDN služby jsou správně konfigurované** - Google Fonts non-blocking, Font Awesome integrity hash
5. **Error handling je dobře implementován** - try-catch bloky, fallback zprávy, dev mode logging
6. **Graceful degradation je správně implementována** - kontroly existence funkcí, ga-disable flag
7. **Prevenci duplikace je správně implementována** - `__lesktopGtagLoaded` flag, kontrola script tagu

### ⚠️ Chybějící dokumentace

1. **Preconnect linky** pro Google Fonts (`fonts.googleapis.com` a `fonts.gstatic.com`) nejsou zmíněny v dokumentaci
2. **Crossorigin a referrerpolicy** pro Font Awesome nejsou zmíněny v dokumentaci

### ❌ Kritické problémy

**Žádné kritické problémy.** Všechna konfigurace externích služeb je správná a odpovídá dokumentaci.

---

## 7. Doporučené opravy

**Priorita: Nízká (dokumentace):**

1. **Aktualizovat `kb/08_tok_fungovani_webu.md`:**
   - Přidat poznámku o preconnect linky pro Google Fonts (řádky 7-8 v `index.html`)
   - Přidat poznámku o crossorigin a referrerpolicy pro Font Awesome (řádek 39 v `index.html`)

2. **Aktualizovat `kb/12_architektura_systemu.md`:**
   - Přidat sekci o preconnect linky pro Google Fonts
   - Přidat sekci o crossorigin a referrerpolicy pro Font Awesome

---

## 8. Závěr

**Celkové hodnocení:** Konfigurace externích služeb je v **výborném stavu**. Všechny služby (Web3Forms, Google Analytics, Google Ads, CDN) jsou správně nakonfigurované a odpovídají dokumentaci.

**Nalezené problémy:**
- **Žádné kritické problémy**
- **2 drobné chybějící informace v dokumentaci** (preconnect linky, crossorigin/referrerpolicy)

**Priorita oprav:**
- **Nízká:** Doplňující informace do dokumentace (volitelné)

**Odhadovaný čas na opravy:** 5-10 minut (volitelné)
