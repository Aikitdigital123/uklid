# Hlavní soubory a složky projektu Lesktop

## HTML soubory

### index.html
**Typ:** HTML  
**Popis:** Hlavní stránka webu Lesktop obsahující všechny sekce: O nás, Služby, Ceník, Kontaktní formulář a kalkulačku úklidu. Obsahuje kompletní strukturu webu včetně meta tagů pro SEO, strukturovaných dat (JSON-LD) a integrace s formulářovými službami.

### privacy.html
**Typ:** HTML  
**Popis:** Stránka se zásadami ochrany osobních údajů (GDPR). Obsahuje informace o tom, jak společnost zpracovává osobní údaje uživatelů webu a zákazníků služeb.

### terms.html
**Typ:** HTML  
**Popis:** Stránka s obchodními podmínkami. Definuje pravidla pro objednávky, ceny, platební podmínky a další právní aspekty poskytování úklidových služeb.

### 404.html
**Typ:** HTML  
**Popis:** Chybová stránka zobrazovaná při přístupu na neexistující URL. Obsahuje odkaz zpět na hlavní stránku a zachovává design webu.

## Složky s assety

### assets/
**Typ:** Asset  
**Popis:** Hlavní složka pro všechny statické assety projektu. Obsahuje CSS soubory (organizované do podsložek podle funkcí), JavaScript soubory a další zdroje. Struktura je modulární pro lepší organizaci a údržbu kódu.

#### assets/css/
**Typ:** Asset  
**Popis:** Složka obsahující všechny CSS soubory projektu. Organizována do podsložek: `base/` (reset.css, typography.css, utilities.css), `components/` (back-to-top.css, button.css, card.css, cookie-banner.css, features.css, form.css, glass.css, pricing.css, services.css), `layout/` (container.css, footer.css, header.css, sections.css), `pages/` (index.css), `tokens/` (tokens.css) a hlavní soubor `style.css`. Obsahuje také prázdnou složku `breakpoints/`.

#### assets/js/
**Typ:** Asset  
**Popis:** Složka s JavaScript soubory. Obsahuje `main.js` jako hlavní vstupní bod, který importuje komponenty z podsložky `components/` (advancedTracking.js, backToTop.js, cookieBanner.js, enhancedTracking.js, form.js, nav.js, reveal.js, select.js) a stránkově specifickou logiku z podsložky `pages/` (index.js).

### before-after/
**Typ:** Asset  
**Popis:** Složka obsahující funkcionalitu pro zobrazení galerie "Před/po" úklidu. Obsahuje `before-after.css` pro styly, `data.js` s daty o fotografiích (pole objektů s title, date, before, after, note), `gallery.js` s JavaScript logikou pro interaktivní zobrazení galerie a složku `photos/` s obrázky před a po úklidu (formáty .jpg a .jpeg).

### images/
**Typ:** Asset  
**Popis:** Složka s grafickými assety webu. Obsahuje logo (Domecek.png), hero obrázky (hero.jpg, hero-mobile.jpg, hero-background.jpg, hero-background1.jpg, hero-background2.jpg), ikony úklidových pomůcek (houbička.png, kartáč.png, kbelík .png, koš.png, koště.png, lopatka.png, prádlo.png, rukavice.png, sprej.png, stěrka.png, vysavač.png, zahod.png, žehlička.png, zvon.png) a další obrázky (cleaning_girl.png, cleaning_products.png, clinching_car.png).

## Nástroje a konfigurace

### tools/
**Typ:** Tool  
**Popis:** Složka s build nástroji pro automatizaci procesu sestavení projektu. Obsahuje skripty pro build CSS (`build-css.mjs`), build JavaScript (`build-js.mjs`) a kopírování statických souborů (`copy-static.mjs`). Skript `copy-static.mjs` navíc přepíná odkazy na minifikované assety v HTML souborech (`index.html`, `privacy.html`, `terms.html`, `404.html`) - nahrazuje `/assets/css/style.css` → `/assets/css/style.min.css` a `/assets/js/main.js` → `/assets/js/main.min.js`.

### package.json
**Typ:** Config  
**Popis:** Konfigurační soubor Node.js projektu definující závislosti a build skripty. Obsahuje `engines` pole specifikující minimální Node.js verzi (>=18.0.0). Obsahuje devDependencies: cssnano, esbuild, postcss, postcss-import. Definuje npm skripty: `build:css` (spouští build-css.mjs), `build:js` (spouští build-js.mjs), `build:static` (spouští copy-static.mjs) a `build` (spouští všechny tři předchozí skripty postupně).
