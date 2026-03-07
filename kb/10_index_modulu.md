# Index modulů webu

## 1. Navigace

**Kód:**
- `/assets/js/components/nav.js` - JavaScript logika (smooth scroll, mobilní menu, ARIA atributy)
- `/assets/css/layout/header.css` - CSS styly (fixed header, glass efekt, mobilní menu)

**Relevantní dokumenty:**
- `02_hlavni_soubory.md` - přehled souborů
- `04_architektura_js.md` - popis nav.js modulu
- `06_architektura_css.md` - popis header.css
- `08_tok_fungovani_webu.md` - jak funguje navigace

## 2. Formuláře

**Kód:**
- `/assets/js/components/form.js` - JavaScript logika (submit handlery, fetch, validace)
- `/assets/css/components/form.css` - CSS styly (input, select, textarea, checkbox skupiny)
- `index.html` - HTML struktura formulářů (#contactForm, #kalkulacka)

**Relevantní dokumenty:**
- `02_hlavni_soubory.md` - přehled souborů
- `03_napojeni_indexu.md` - struktura formulářů v HTML
- `04_architektura_js.md` - popis form.js modulu
- `06_architektura_css.md` - popis form.css
- `08_tok_fungovani_webu.md` - jak fungují formuláře

## 3. Kalkulačka

**Kód:**
- `/assets/js/components/form.js` - JavaScript logika pro odeslání (#kalkulacka)
- `/assets/js/pages/index.js` - JavaScript logika pro zobrazení/skrytí pole frekvence
- `/assets/js/components/select.js` - transformace #cleaningType na custom UI
- `/assets/css/components/form.css` - CSS styly pro kalkulačku
- `index.html` - HTML struktura (#kalkulacka)

**Relevantní dokumenty:**
- `02_hlavni_soubory.md` - přehled souborů
- `03_napojeni_indexu.md` - struktura kalkulačky v HTML
- `04_architektura_js.md` - popis form.js a /assets/js/pages/index.js modulů
- `06_architektura_css.md` - popis form.css
- `08_tok_fungovani_webu.md` - jak funguje kalkulačka

## 4. Custom select

**Kód:**
- `/assets/js/components/select.js` - JavaScript logika (transformace nativního selectu na custom UI)
- `/assets/css/components/form.css` - CSS styly pro custom select (.select-modern, .select-trigger, .select-menu)
- `/assets/css/pages/index.css` - CSS styly pro custom select (část)

**Funkcionalita:**
- Podporuje plné keyboard ovládání (Enter/Space/Arrow keys/Escape) a A11y atributy (ARIA)
- Automaticky zavírá menu při kliknutí mimo nebo stisknutí Escape

**Relevantní dokumenty:**
- `02_hlavni_soubory.md` - přehled souborů
- `04_architektura_js.md` - popis select.js modulu
- `06_architektura_css.md` - popis form.css a index.css
- `08_tok_fungovani_webu.md` - jak funguje custom select v kalkulačce

## 5. Galerie before-after

**Kód:**
- `/before-after/gallery.js` - JavaScript logika (renderování galerie, přepínání před/po)
- `/before-after/data.js` - data galerie (window.beforeAfterGallery)
- `/before-after/before-after.css` - CSS styly (.ba-gallery, .ba-card, .ba-figure)
- `index.html` - HTML struktura (#before-after-gallery)

**Relevantní dokumenty:**
- `02_hlavni_soubory.md` - přehled souborů before-after/
- `03_napojeni_indexu.md` - napojení before-after CSS a JS v HTML
- `08_tok_fungovani_webu.md` - jak funguje galerie before-after

## 6. Cookie banner

**Kód:**
- `/assets/js/components/cookieBanner.js` - JavaScript logika (souhlas, načtení GA, definice window.lesktopTrackEvent)
- `/assets/css/components/cookie-banner.css` - CSS styly (.cookie-banner, tlačítka)

**Relevantní dokumenty:**
- `02_hlavni_soubory.md` - přehled souborů
- `04_architektura_js.md` - popis cookieBanner.js modulu
- `06_architektura_css.md` - popis cookie-banner.css
- `08_tok_fungovani_webu.md` - jak funguje cookie souhlas a tracking

## 7. Tracking

**Kód:**
- `/assets/js/components/cookieBanner.js` - definice window.lesktopTrackEvent, načtení GA
- `/assets/js/components/enhancedTracking.js` - tracking telefonních/email/externích odkazů a sekcí
- `/assets/js/components/advancedTracking.js` - tracking scroll hloubky a času (není importován v main.js)
- `index.html` - inline onclick handlery pro tracking

**Relevantní dokumenty:**
- `02_hlavni_soubory.md` - přehled souborů
- `03_napojeni_indexu.md` - tracking funkce a inline handlery
- `04_architektura_js.md` - popis tracking modulů
- `08_tok_fungovani_webu.md` - jak funguje tracking

## 8. Back-to-top

**Kód:**
- `/assets/js/components/backToTop.js` - JavaScript logika (vytvoření tlačítka, scroll handler)
- `/assets/css/components/back-to-top.css` - CSS styly (.back-to-top, .visible)

**Relevantní dokumenty:**
- `02_hlavni_soubory.md` - přehled souborů
- `04_architektura_js.md` - popis backToTop.js modulu
- `06_architektura_css.md` - popis back-to-top.css

## 9. Reveal animace

**Kód:**
- `/assets/js/components/reveal.js` - JavaScript logika (IntersectionObserver pro .reveal-on-scroll)
- `/assets/css/pages/index.css` - CSS styly (.reveal-on-scroll, .is-visible, delay třídy)

**Relevantní dokumenty:**
- `02_hlavni_soubory.md` - přehled souborů
- `04_architektura_js.md` - popis reveal.js modulu
- `06_architektura_css.md` - popis index.css

## 10. Design tokeny

**Kód:**
- `/assets/css/tokens/tokens.css` - CSS custom properties (barvy, fonty, stíny, glass parametry, layout proměnné)

**Relevantní dokumenty:**
- `02_hlavni_soubory.md` - přehled souborů
- `06_architektura_css.md` - popis tokens.css
- `07_tema_a_tokeny.md` - kompletní přehled všech tokenů a jejich použití

## 11. Layout

**Kód:**
- `/assets/css/layout/container.css` - container styly
- `/assets/css/layout/header.css` - header styly
- `/assets/css/layout/footer.css` - footer styly
- `/assets/css/layout/sections.css` - sekce styly

**Relevantní dokumenty:**
- `02_hlavni_soubory.md` - přehled souborů
- `06_architektura_css.md` - popis layout souborů
- `07_tema_a_tokeny.md` - layout proměnné (--header-height)

## Když chci změnit...

**Vzhled:** Začni v `/assets/css/tokens/tokens.css` pro barvy a fonty, pak `/assets/css/components/` pro komponenty, `/assets/css/layout/` pro layout. Viz `06_architektura_css.md` a `07_tema_a_tokeny.md`.

**Formulář:** Uprav HTML v `index.html` (#contactForm nebo #kalkulacka), logiku v `/assets/js/components/form.js`, styly v `/assets/css/components/form.css`. Viz `03_napojeni_indexu.md` a `08_tok_fungovani_webu.md`.

**Tracking:** Uprav `/assets/js/components/cookieBanner.js` pro GA konfiguraci, `/assets/js/components/enhancedTracking.js` pro tracking událostí, inline handlery v `index.html`. Viz `04_architektura_js.md` a `08_tok_fungovani_webu.md`.

**Galerii:** Uprav data v `/before-after/data.js`, logiku v `/before-after/gallery.js`, styly v `/before-after/before-after.css`. Viz `02_hlavni_soubory.md` a `08_tok_fungovani_webu.md`.

**Navigaci:** Uprav logiku v `/assets/js/components/nav.js`, styly v `/assets/css/layout/header.css`. Viz `04_architektura_js.md`, `06_architektura_css.md` a `08_tok_fungovani_webu.md`.

**Kalkulačku:** Uprav HTML v `index.html` (#kalkulacka), logiku odeslání v `/assets/js/components/form.js`, logiku frekvence v `/assets/js/pages/index.js`, custom select v `/assets/js/components/select.js`, styly v `/assets/css/components/form.css`. Viz `03_napojeni_indexu.md` a `08_tok_fungovani_webu.md`.
