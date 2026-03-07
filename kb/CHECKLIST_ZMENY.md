# Checklist – běžné změny

Rychlý kontrolní seznam před dokončením úprav.

---

## Nová stránka (content, např. „O nás“ textová)

- [ ] HTML soubor s `<body data-page="hodnota">` (hodnota přesně tak, jak bude v registru)
- [ ] Struktura: skip-link, header.main-header, main#main-content, section.legal, footer, cookie-banner
- [ ] HEAD v pořadí: charset, viewport, title, description, canonical, robots, OG, favicon, theme-color, preconnect + fonty + FA, style.css, legal.css
- [ ] Odkazy v footer (legal-links) na novou stránku
- [ ] Pokud vlastní JS: pages/xxx.js + záznam v PAGE_INIT_REGISTRY v main.bundle.js; **ověřit, že `page: 'hodnota'` v registru odpovídá `data-page="hodnota"` v HTML** (tichý bug = stránka bez spuštěného JS)

---

## Nová komponenta (sdílená UI / chování)

- [ ] CSS: soubor v assets/css/components/ + @import v style.css (v bloku components)
- [ ] JS: modul v assets/js/components/ s exportem init funkce
- [ ] main.bundle.js: import + záznam ve **správném** registru: sdílená na všech stránkách → GLOBAL_INIT_REGISTRY; jen na jedné stránce → PAGE_INIT_REGISTRY (špatná volba = tichý bug nebo rozbití jiných stránek)
- [ ] Použití tokenů (barvy, spacing) z tokens.css, ne hardcoded hodnoty

---

## Úprava stylů

- [ ] Barvy/spacing/typography → tokens.css nebo base/typography.css
- [ ] Layout (header, footer, sekce) → assets/css/layout/
- [ ] Konkrétní komponenta (tlačítko, karta, formulář) → assets/css/components/
- [ ] Jen pro homepage → assets/css/pages/index.css nebo index/*.css
- [ ] Jen pro terms/privacy/impresum/faq → legal.css
- [ ] Jen pro 404 → error-pages.css

---

## Úprava JavaScriptu

- [ ] Sdílená logika (nav, formuláře, cookie, tracking) → assets/js/components/
- [ ] Jen pro homepage (kalkulačka, frekvence) → assets/js/pages/index.js
- [ ] Nová stránka s vlastní logikou → nový soubor v pages/ + PAGE_INIT_REGISTRY
- [ ] Skripty v HTML vždy s `defer`, pořadí zachovat (data → gallery → main na indexu)

---

## Úprava formuláře

- [ ] Přidat/změnit pole v HTML (id, name, struktura)
- [ ] Handler v form.js (selectory podle id formuláře)
- [ ] Web3Forms: hidden input s access key, action/method beze změny pokud jen měníš pole
- [ ] Bez inline onsubmit; submit obsluhuje form.js

---

## Loading / performance

- [ ] Nové obrázky: uvést width/height (CLS), mimo viewport použít loading="lazy"
- [ ] Preload jen u LCP zdrojů na stránkách, kde na tom záleží (index: hero, logo)
- [ ] Preconnect jen pro zdroje, které stránka skutečně hned načítá (fonty, CDN)
- [ ] Žádný nový skript bez defer (kromě nutných výjimek)

---

Před větší změnou projdi kb/00_ARCHITEKTURA_PROJEKTU.md (sekce „Co nedělat“ a **„Rizika údržby“**).
