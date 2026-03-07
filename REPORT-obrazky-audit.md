# REPORT – Audit obrázků na webu

## 1. Typy obrázků a použití, které byly zkontrolovány

- **Soubory obrázků v projektu:** `images/` (hero.jpg, hero@2x.jpg, hero-mobile.jpg, hero-mobile@2x.jpg, Domecek.png, apple-touch-icon-*.png, icon-192x192.png, icon-512x512.png, hero-desktop-new*.jpg), `before-after/photos/` (6 souborů: 2025-01-03, 2025-11-23, 2026-02-14 – pred/po v .jpeg nebo .jpg), `favicon.ico` v kořeni.
- **`<img>`:** Logo na index.html (brand-logo + onerror fallback na .brand-text), logo na faq.html, impresum.html, privacy.html, terms.html, sluzby.html; galerie before-after (obrázky vkládané z JS z data.js).
- **CSS background-image:** Hero na `body[data-page="index"]` (inline styl v index.html + hero.css + responsive.css pro mobil); .hero-section pouze gradient; data URI v form.css (ikony formuláře – checkmark, error, chevron).
- **Preload v `<head>`:** index.html – hero.jpg, hero-mobile.jpg, Domecek.png (s media pro hero).
- **OG/Twitter image:** Všechny stránky (index, faq, impresum, privacy, terms, sluzby) – `https://lesktop.cz/images/hero.jpg`.
- **JSON-LD image:** index.html – LocalBusiness "image": [ "https://lesktop.cz/images/hero.jpg", "https://lesktop.cz/images/Domecek.png" ].
- **Favicon / apple-touch-icon / manifest:** index.html – relativní `images/Domecek.png`, `images/apple-touch-icon-*.png`; 404 a podstránky – `images/Domecek.png`. site.webmanifest – `images/icon-192x192.png`, `images/icon-512x512.png`, `images/Domecek.png`.
- **Before-after galerie:** before-after/data.js – cesty `/before-after/photos/...` (6 párů); gallery.js nastavuje img src z item.before/item.after, loading="lazy", decoding="async", alt z dataset (beforeAlt/afterAlt).

## 2. Nalezené chyby

- **Žádné nové chyby.** Všechny cesty vedou na existující soubory. Žádný obrázek není skrytý nebo přebitý CSS tak, aby se vůbec nezobrazil (kromě záměrného print CSS a mobilních úprav).

## 3. Co bylo rozbité u hero/backgroundu (opraveno v předchozích krocích)

- Hero pozadí se nezobrazovalo: **absolutní cesta `/images/hero.jpg`** při otevření přes file:// nebo některé lokální servery neodpovídala složce projektu; **cover** způsoboval silný zoom bez detailů.
- **Opravy:** V index.html přidán inline `<style>` s cestou **relativní k dokumentu** (`url('images/hero.jpg')` / `url('images/hero-mobile.jpg')`), aby hero fungovalo na Live Server (127.0.0.1:5500) i na produkci. V hero.css a responsive.css zjednodušeno na jednu vrstvu bez image-set, **background-size: contain** + **background-color: #3a4768** pro celou fotku včetně detailů a jednotnou barvu okolo. CSS soubory používají relativní cesty `../../../../images/...` vůči umístění CSS.

## 4. Opravené cesty a nastavení v tomto auditu

- V rámci tohoto auditu **nebylo nic dalšího měněno**. Kontrola pouze ověřila, že všechny reference odpovídají existujícím souborům a že žádná cesta nevede do neexistujícího souboru.

## 5. Změněné soubory (v tomto auditu)

- **Žádné.** Všechny úpravy hero a cest byly provedeny v předchozích požadavcích (index.html, assets/css/pages/index/hero.css, assets/css/pages/index/responsive.css).

## 6. Stav obrázků po auditu

- **Všechny obrázky:** Cesty v HTML (relativní `images/...` z kořene stránek), v CSS (relativní od souboru hero.css/responsive.css), v data.js (absolutní `/before-after/photos/...`) a v manifestu (`images/...`) odpovídají reálným souborům.
- **Hero:** Zobrazuje se přes inline styl (priorita), contain + barva okolo; mobilní varianta v @media (max-width: 480px).
- **Logo:** Správný alt, loading="eager", decoding="async", na indexu onerror fallback na text.
- **Galerie:** Alt nastavován z JS, lazy loading, cesty z data.js odpovídají souborům v before-after/photos/.
- **Ikony / PWA:** Manifest odkazuje na existující PNG v `images/`. Favicon.ico existuje v kořeni, v HTML se používá PNG (Domecek.png) – v pořádku.
- **Tisk:** body background v print.css přepisován na bílou – záměr.

**Závěr:** Z pohledu obrázků je web technicky v pořádku; všechny reference jsou platné, soubory existují a nastavení (cesty, loading, alt, fallback) jsou konzistentní.
