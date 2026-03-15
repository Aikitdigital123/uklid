# Roadmap: dolaďování buildu Lesktop

Cílem je z dobrého statického webu udělat vymazáný build – výkon, bezpečnost, SEO a údržba.

---

## 1. Výkon

### Obrázky
- [x] **Optimalizace při buildu** – plugin `optimizeImages()` (Sharp) komprimuje jpg/png/webp v `dist/assets`, `dist/images`, `dist/before-after` (quality 82 / compressionLevel 9)
- [ ] Všechny hlavní obrázky ve správných rozměrech (ne větší než potřeba)
- [ ] Ideálně servírovat **webp** nebo **avif** (např. `<picture>` + generování variant)
- [x] LCP obrázek je součástí optimalizace (assets + images)
- [x] U obrázků mimo viewport: galerie má `loading="lazy"` a `decoding="async"` (JS)

### Fonty
- [x] **Self-hosted fonty** – `vite-plugin-webfont-dl` stahuje Montserrat + Open Sans při buildu, injektuje jako lokální woff2 (subset latin + latin-ext)
- [x] Pouze potřebné řezy (400, 500, 600, 700 Montserrat; 400, 600 Open Sans)
- [ ] Zkontrolovat CLS při přepnutí fallback → webfont

### CSS
- [x] **PurgeCSS** – `vite-plugin-purgecss` s content (všechna HTML + assets/js + before-after) a konzervativním safelistem (fa-*, is-*, has-*, js-*, třídy z JS: menu-open, active, form-status-hidden, btn-spinner, atd.). Úbytek main CSS ~16 % (59.65 kB → 49.94 kB).
- [ ] Hlídat mrtvý CSS z historických sekcí
- [ ] Ověřit, že critical část není zbytečně velká

### JS
- [ ] Zkontrolovat, jestli se vše musí načítat na každé stránce
- [ ] Odložit nebo podmíněně načítat méně důležité skripty
- [ ] U marketing skriptů hlídat LCP/INP

---

## 2. Bezpečnost

### SRI pro vlastní assety
- [x] **SRI pro vlastní Vite bundle** – `vite-plugin-sri3` doplňuje `integrity` (sha384) a `crossorigin` na vlastní JS/CSS a modulepreload; externí Font Awesome má v HTML `skip-sri` a vlastní SRI (sha512)

### CSP audit
- [x] Po zavedení lokálních fontů: odstraněny `fonts.googleapis.com` a `fonts.gstatic.com` z CSP; přidáno `'unsafe-inline'` pro style (inline @font-face z webfont-dl)
- [x] Po SRI: ověřeno, že vlastní assety mají integrity a CSP s nimi nepřichází do konfliktu; FA má skip-sri
- [x] script-src, style-src, font-src, connect-src, form-action zúženy na konkrétní domény (žádné volné unsafe-* kromě style-src 'unsafe-inline')
- [x] **img-src zpřísněno** – místo `https:` jen `'self'` + data: + blob: + Google domény (GA/GTM tracking pixely)
- [ ] Průběžně kontrolovat, že style-src 'unsafe-inline' nejde časem odstranit (závisí na webfont-dl)

### Třetí strany
- [x] **Google Analytics 4 + Google Ads** – načítají se až po souhlasu s cookies (cookie banner: „Souhlasím“ / „Jen nezbytné“). Výchozí stav: GA i Ads vypnuty (`consent default: denied`), gtag se načte až po „Souhlasím“. V privacy.html explicitně popsány GA4, Google Ads a že cookies jsou jen se souhlasem.
- [ ] Fonty (FA) a Web3Forms – ponechány dle potřeby; FA má SRI, formuláře jen na api.web3forms.com

---

## 3. SEO a kvalita obsahu

### Jednotnost metadat
- [x] **Audit metadat** – všechny stránky mají unikátní title, description, canonical a OG (title, description, image); 404 má noindex a bez canonical/OG; na prezentace.html doplněna diakritika v description a og:description

### Sitemap
- [x] **Automatizace sitemap** – generování z `htmlPages` při buildu (404 vynechán)

### Structured data
- [x] **LocalBusiness** – doplněno `openingHoursSpecification` (Po–Pá 8:00–18:00, So 9:00–14:00) pro lepší local SEO a Google; ostatní pole (adresa, kontakt, služby, ceník) již byla vyplněná
- [x] **FAQPage** na faq.html – pro rich výsledky (rozbalitelné FAQ)
- [ ] Po nasazení ověřit v [Rich Results Test](https://search.google.com/test/rich-results) a případně upravit otevírací dobu v index.html

### Interní prolinkování
- [ ] Důležité stránky ne „hluboko schované“, smysluplné prolinkování

---

## 4. Build a údržba

### Automatické kontroly
- [ ] Kontrola nepoužívaných assetů
- [ ] Kontrola chybějících meta tagů
- [ ] Kontrola rozbitých interních odkazů
- [ ] Kontrola, že sitemap obsahuje všechny stránky (kromě 404)

### Konzistence buildu
- [ ] Reprodukovatelný build – nic se „náhodně“ nemění mezi buildy

### Konfigurace
- [ ] Při růstu `vite.config.js` oddělit: security, SEO, static copy, page config

---

## Priority (po pořadí)

1. **Automatizace sitemap** ✅ (implementováno)
2. Audit a optimalizace obrázků
3. PurgeCSS po stabilizaci šablon
4. SRI pro vlastní Vite bundle
5. Pravidelný audit CSP a externích služeb

---

## Nice to have

- Lokální (self-hosted) fonty
- Automatické generování social preview obrázků
- Kontrola nepoužitých assetů při buildu
- Jemná obfuskace JS jen při skutečném důvodu
- PWA jen pokud dává smysl pro obsah

---

## Shrnutí

Chybí hlavně:

- **Dotáhnout automatizaci**
- **Zmenšit manuální údržbu**
- **Doladit asset pipeline**
- **Uzavřít poslední bezpečnostní detaily**

Architektura projektu je již v pořádku.
