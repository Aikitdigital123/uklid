# Slovník pojmů projektu Lesktop

## HTML ID atributy

### #main-content
**Definováno:** `index.html` (řádek 153)  
**Účel:** Hlavní obsah stránky, skip link cíl pro přístupnost  
**Použití:** Skip link (řádek 133), hlavní struktura stránky

### #about
**Definováno:** `index.html` (řádek 154)  
**Účel:** Sekce "O nás"  
**Použití:** Navigační odkazy (řádek 144), logo link (řádek 137), anchor pro smooth scroll

### #services
**Definováno:** `index.html` (řádek 161)  
**Účel:** Sekce "Naše Služby"  
**Použití:** Navigační odkazy (řádek 145), anchor pro smooth scroll

### #before-after
**Definováno:** `index.html` (řádek 220)  
**Účel:** Sekce galerie "Před/po úklidu"  
**Použití:** Sekce pro before-after galerii

### #before-after-gallery
**Definováno:** `index.html` (řádek 225)  
**Účel:** Kontejner pro renderování galerie  
**Použití:** `/before-after/gallery.js` - renderování karet galerie (řádek 127)

### #before-after-empty
**Definováno:** `index.html` (řádek 226)  
**Účel:** Zpráva, když galerie nemá data  
**Použití:** `/before-after/gallery.js` - zobrazení prázdného stavu (řádek 142)

### #pricing
**Definováno:** `index.html` (řádek 230)  
**Účel:** Sekce "Ceník a nezávazná kalkulace"  
**Použití:** Navigační odkazy (řádek 146), anchor pro smooth scroll

### #kalkulacka
**Definováno:** `index.html` (řádek 279)  
**Účel:** Kalkulační formulář  
**Použití:** `/assets/js/components/form.js` - submit handler (řádek 14, 94), anchor odkazy v HTML (řádek 171)

### #cleaningType
**Definováno:** `index.html` (řádek 285)  
**Účel:** Select pro výběr typu úklidu  
**Použití:** `/assets/js/components/select.js` - transformace na custom UI (řádek 88), `/assets/js/pages/index.js` - kontrola změny pro zobrazení frekvence (řádek 7, 26)

### #areaSize
**Definováno:** `index.html` (řádek 297)  
**Účel:** Input pro velikost plochy v m²  
**Použití:** Formulářové pole v kalkulačce

### #frequencyGroup
**Definováno:** `index.html` (řádek 301)  
**Účel:** Skupina pole frekvence úklidu (skrytá/zobrazená)  
**Použití:** `/assets/js/pages/index.js` - zobrazení/skrytí podle typu úklidu (řádek 8, 16, 19)

### #cleaningFrequency
**Definováno:** `index.html` (řádek 303)  
**Účel:** Select pro frekvenci úklidu  
**Použití:** `/assets/js/components/select.js` - transformace na custom UI (řádek 89), `/assets/js/pages/index.js` - kontrola zobrazení (řádek 9), `/assets/js/components/form.js` - tracking hodnoty (řádek 136)

### #calc-form-status
**Definováno:** `index.html` (řádek 445)  
**Účel:** Status zpráva kalkulačního formuláře (úspěch/chyba)  
**Použití:** `/assets/js/components/form.js` - zobrazení stavu odeslání (řádek 15, 104, 128, 153)

### #contact
**Definováno:** `index.html` (řádek 451)  
**Účel:** Sekce "Kontaktujte nás"  
**Použití:** Navigační odkazy (řádek 147), anchor odkazy v HTML, anchor pro smooth scroll

### #contactForm
**Definováno:** `index.html` (řádek 461)  
**Účel:** Kontaktní formulář  
**Použití:** `/assets/js/components/form.js` - submit handler (řádek 12, 18)

### #form-status
**Definováno:** `index.html` (řádek 478)  
**Účel:** Status zpráva kontaktního formuláře (úspěch/chyba)  
**Použití:** `/assets/js/components/form.js` - zobrazení stavu odeslání (řádek 13, 27, 51, 70)

### #cookie-banner
**Definováno:** `index.html` (řádek 503)  
**Účel:** Cookie banner pro souhlas s cookies  
**Použití:** `/assets/js/components/cookieBanner.js` - inicializace a kontrola existence (řádek 2)

### #cookie-accept
**Definováno:** `index.html` (řádek 509)  
**Účel:** Tlačítko "Souhlasím" v cookie banneru  
**Použití:** `/assets/js/components/cookieBanner.js` - click handler pro souhlas (řádek 5, 86)

### #cookie-necessary
**Definováno:** `index.html` (řádek 510)  
**Účel:** Tlačítko "Jen nezbytné" v cookie banneru  
**Použití:** `/assets/js/components/cookieBanner.js` - click handler pro odmítnutí (řádek 6, 94)

### #name, #email, #message
**Definováno:** `index.html` (řádky 467, 471, 475)  
**Účel:** Inputy kontaktního formuláře  
**Použití:** Formulářová pole v #contactForm

### #customerName, #customerEmail, #customerPhone, #notes
**Definováno:** `index.html` (řádky 426, 431, 436, 441)  
**Účel:** Inputy kalkulačního formuláře  
**Použití:** Formulářová pole v #kalkulacka

### #windowsCleaningGeneral
**Definováno:** `index.html` (řádek 315)  
**Účel:** Checkbox pro "Mytí a čištění oken (obecně)"  
**Použití:** Checkbox v #kalkulacka pro výběr doplňkové služby

### #windowsCleaningStandard
**Definováno:** `index.html` (řádek 319)  
**Účel:** Checkbox pro "Mytí oken"  
**Použití:** Checkbox v #kalkulacka pro výběr doplňkové služby

### #balconyWindows
**Definováno:** `index.html` (řádek 323)  
**Účel:** Checkbox pro "Mytí balkonových a terasových oken"  
**Použití:** Checkbox v #kalkulacka pro výběr doplňkové služby

### #blindsCleaning
**Definováno:** `index.html` (řádek 327)  
**Účel:** Checkbox pro "Mytí žaluzií"  
**Použití:** Checkbox v #kalkulacka pro výběr doplňkové služby

### #carpetCleaning
**Definováno:** `index.html` (řádek 332)  
**Účel:** Checkbox pro "Tepování koberců"  
**Použití:** Checkbox v #kalkulacka pro výběr doplňkové služby

### #sofaCleaning
**Definováno:** `index.html` (řádek 336)  
**Účel:** Checkbox pro "Tepování sedaček"  
**Použití:** Checkbox v #kalkulacka pro výběr doplňkové služby

### #mattressCleaning
**Definováno:** `index.html` (řádek 340)  
**Účel:** Checkbox pro "Tepování matrací"  
**Použití:** Checkbox v #kalkulacka pro výběr doplňkové služby

### #ovenCleaning
**Definováno:** `index.html` (řádek 345)  
**Účel:** Checkbox pro "Čištění trouby"  
**Použití:** Checkbox v #kalkulacka pro výběr doplňkové služby

### #fridgeCleaning
**Definováno:** `index.html` (řádek 349)  
**Účel:** Checkbox pro "Čištění lednice"  
**Použití:** Checkbox v #kalkulacka pro výběr doplňkové služby

### #freezerCleaning
**Definováno:** `index.html` (řádek 353)  
**Účel:** Checkbox pro "Čištění mrazáku"  
**Použití:** Checkbox v #kalkulacka pro výběr doplňkové služby

### #hoodCleaning
**Definováno:** `index.html` (řádek 357)  
**Účel:** Checkbox pro "Čištění digestoře"  
**Použití:** Checkbox v #kalkulacka pro výběr doplňkové služby

### #applianceInteriorCleaning
**Definováno:** `index.html` (řádek 361)  
**Účel:** Checkbox pro "Mytí vnitřku kuchyňských spotřebičů"  
**Použití:** Checkbox v #kalkulacka pro výběr doplňkové služby

### #kitchenCabinetCleaning
**Definováno:** `index.html` (řádek 365)  
**Účel:** Checkbox pro "Úklid v kuchyňské skříňce"  
**Použití:** Checkbox v #kalkulacka pro výběr doplňkové služby

### #closetCleaning
**Definováno:** `index.html` (řádek 369)  
**Účel:** Checkbox pro "Úklid ve skříni"  
**Použití:** Checkbox v #kalkulacka pro výběr doplňkové služby

### #balconyTerraceCleaning
**Definováno:** `index.html` (řádek 373)  
**Účel:** Checkbox pro "Úklid balkónu nebo terasy"  
**Použití:** Checkbox v #kalkulacka pro výběr doplňkové služby

### #radiatorCleaning
**Definováno:** `index.html` (řádek 377)  
**Účel:** Checkbox pro "Mytí radiátorů"  
**Použití:** Checkbox v #kalkulacka pro výběr doplňkové služby

### #doorFrameCleaning
**Definováno:** `index.html` (řádek 381)  
**Účel:** Checkbox pro "Mytí dveří a zárubní"  
**Použití:** Checkbox v #kalkulacka pro výběr doplňkové služby

### #lightFixtureCleaning
**Definováno:** `index.html` (řádek 385)  
**Účel:** Checkbox pro "Mytí světel a lustru"  
**Použití:** Checkbox v #kalkulacka pro výběr doplňkové služby

### #extraBathroomToilet
**Definováno:** `index.html` (řádek 390)  
**Účel:** Checkbox pro "Další koupelna/toaleta"  
**Použití:** Checkbox v #kalkulacka pro výběr doplňkové služby

### #ironingService
**Definováno:** `index.html` (řádek 394)  
**Účel:** Checkbox pro "Žehlení prádla"  
**Použití:** Checkbox v #kalkulacka pro výběr doplňkové služby

### #keyHandling
**Definováno:** `index.html` (řádek 398)  
**Účel:** Checkbox pro "Předání nebo převzetí klíčů"  
**Použití:** Checkbox v #kalkulacka pro výběr doplňkové služby

### #cellarAtticCleaning
**Definováno:** `index.html` (řádek 402)  
**Účel:** Checkbox pro "Úklid sklepních a půdních prostor"  
**Použití:** Checkbox v #kalkulacka pro výběr doplňkové služby

### #moveInMoveOutCleaning
**Definováno:** `index.html` (řádek 406)  
**Účel:** Checkbox pro "Generální úklid před/po stěhování"  
**Použití:** Checkbox v #kalkulacka pro výběr doplňkové služby

### #hasPets
**Definováno:** `index.html` (řádek 417)  
**Účel:** Checkbox pro "Máte domácí mazlíčky?"  
**Použití:** Doplňující údaj v #kalkulacka pro kalkulaci a výběr vhodných prostředků

### #main-menu
**Definováno:** `privacy.html` (řádek 25), `terms.html` (řádek 25)  
**Účel:** ID navigačního menu v privacy.html a terms.html  
**Použití:** `/assets/js/components/nav.js` - automatické přiřazení ID pro aria-controls (řádek 17), HTML atribut aria-controls na .menu-toggle

## Hlavní CSS třídy

### .container
**Definováno:** `/assets/css/layout/container.css`  
**Účel:** Centrální kontejner s max-width a padding  
**Použití:** Všude v HTML pro obalení obsahu sekcí

### .site-header
**Definováno:** `/assets/css/layout/header.css`  
**Účel:** Fixed header stránky  
**Použití:** `index.html` (řádek 135), `/assets/js/components/nav.js` - reference pro smooth scroll (řádek 9)

### .header-inner
**Definováno:** `/assets/css/layout/header.css`  
**Účel:** Vnitřní kontejner headeru s glass efektem  
**Použití:** `index.html` (řádek 136)

### .brand
**Definováno:** `/assets/css/layout/header.css`  
**Účel:** Logo a název firmy  
**Použití:** `index.html` (řádek 137), `/assets/js/components/nav.js` - smooth scroll handler (řádek 50)

### .brand-logo, .brand-text
**Definováno:** `/assets/css/layout/header.css`  
**Účel:** Obrázek loga a text loga  
**Použití:** `index.html` (řádky 138, 139)

### .nav-toggle
**Definováno:** `/assets/css/layout/header.css`  
**Účel:** Tlačítko pro mobilní menu  
**Použití:** `index.html` (řádek 141), `/assets/js/components/nav.js` - toggle handler (řádek 10, 66)

### .site-nav
**Definováno:** `/assets/css/layout/header.css`  
**Účel:** Navigační menu  
**Použití:** `index.html` (řádek 142), `/assets/js/components/nav.js` - toggle a smooth scroll (řádek 11, 65)

### .nav-link
**Definováno:** `/assets/css/layout/header.css`  
**Účel:** Odkazy v navigaci  
**Použití:** `index.html` (řádky 144-147), `/assets/js/components/nav.js` - smooth scroll handler (řádek 23)

### .content-section
**Definováno:** `/assets/css/layout/sections.css`  
**Účel:** Základní sekce stránky s padding a margin  
**Použití:** Všechny sekce v `index.html` (about, services, before-after, pricing, contact)

### .section-title
**Definováno:** `/assets/css/layout/sections.css`, `/assets/css/base/typography.css`  
**Účel:** Nadpis sekce  
**Použití:** Všechny sekce v `index.html`, `/assets/js/components/enhancedTracking.js` - tracking viditelnosti (řádek 75)

### .section-subtitle
**Definováno:** `/assets/css/pages/index.css`  
**Účel:** Podnadpis sekce  
**Použití:** `index.html` (řádek 276)

### .glass-panel
**Definováno:** `/assets/css/components/glass.css`  
**Účel:** Glass efekt panel s backdrop-filter  
**Použití:** Sekce, karty, formuláře v `index.html`

### .services-grid
**Definováno:** `/assets/css/components/services.css`  
**Účel:** Grid layout pro karty služeb  
**Použití:** `index.html` (řádek 166)

### .service-item
**Definováno:** `/assets/css/components/card.css`, `/assets/css/components/services.css`  
**Účel:** Karta služby  
**Použití:** `index.html` (řádky 168, 174, 180, 186, 192, 198, 204, 210)

### .pricing-grid
**Definováno:** `/assets/css/components/pricing.css`  
**Účel:** Grid layout pro ceníkové karty  
**Použití:** `index.html` (řádek 235)

### .price-card
**Definováno:** `/assets/css/components/card.css`, `/assets/css/components/pricing.css`  
**Účel:** Karta ceníku  
**Použití:** `index.html` (řádky 236, 250, 264)

### .price-list, .price-info, .price-note, .price-from
**Definováno:** `/assets/css/components/card.css`, `/assets/css/components/pricing.css`  
**Účel:** Styly pro ceníkové informace  
**Použití:** `index.html` - v .price-card elementech

### .btn
**Definováno:** `/assets/css/components/button.css`  
**Účel:** Základní tlačítko s glass efektem  
**Použití:** Všude v HTML pro tlačítka a odkazy stylované jako tlačítka

### .btn-primary, .btn-secondary, .btn-whatsapp, .btn-outline
**Definováno:** `/assets/css/components/button.css`  
**Účel:** Varianty tlačítek  
**Použití:** `index.html` - různé tlačítka podle kontextu

### .calculator-form, .contact-form
**Definováno:** `/assets/css/components/form.css`  
**Účel:** Styly pro formuláře  
**Použití:** `index.html` - #kalkulacka a #contactForm

### .form-group
**Definováno:** `/assets/css/components/form.css`  
**Účel:** Skupina formulářových polí  
**Použití:** Všechny formuláře v `index.html`

### .form-group-hidden
**Definováno:** `/assets/css/pages/index.css`  
**Účel:** Skrytá skupina formuláře  
**Použití:** `index.html` (řádek 301), `/assets/js/pages/index.js` - přepínání viditelnosti (řádek 16, 19)

### .checkbox-group
**Definováno:** `/assets/css/components/form.css`  
**Účel:** Skupina checkboxů  
**Použití:** `index.html` - v kalkulačce pro doplňkové služby (řádek 313)

### .form-status, .form-status-hidden
**Definováno:** `index.html` (inline style), `/assets/css/pages/index.css`  
**Účel:** Status zpráva formuláře (úspěch/chyba/skrytá)  
**Použití:** `index.html` (řádky 445, 478), `/assets/js/components/form.js` - zobrazení stavu (řádky 28, 52, 70, 105, 129, 153)

### .contact-info
**Definováno:** `/assets/css/pages/index.css`  
**Účel:** Kontaktní informace  
**Použití:** `index.html` (řádek 455)

### .reveal-on-scroll
**Definováno:** `/assets/css/pages/index.css`  
**Účel:** Třída pro animaci při scrollování  
**Použití:** `index.html` - sekce a karty (řádky 154, 161, 163, 164, 168, 174, 180, 186, 192, 198, 204, 210, 230, 236, 250, 264, 451), `/assets/js/components/reveal.js` - IntersectionObserver (řádek 10)

### .is-visible
**Definováno:** `/assets/css/pages/index.css`  
**Účel:** Třída přidaná při zobrazení elementu  
**Použití:** `/assets/js/components/reveal.js` - přidává se při vstupu do viewportu (řádek 31)

### .delay-1, .delay-2, .delay-3, .delay-4
**Definováno:** `/assets/css/pages/index.css`  
**Účel:** Zpoždění animace reveal-on-scroll  
**Použití:** `index.html` - na elementech s .reveal-on-scroll

### .main-footer
**Definováno:** `/assets/css/layout/footer.css`  
**Účel:** Footer stránky  
**Použití:** `index.html` (řádek 484)

### .social-links, .legal-links
**Definováno:** `/assets/css/layout/footer.css`  
**Účel:** Odkazy v footeru  
**Použití:** `index.html` (řádky 487, 495)

### .cookie-banner
**Definováno:** `/assets/css/components/cookie-banner.css`  
**Účel:** Cookie banner  
**Použití:** `index.html` (řádek 503), `/assets/js/components/cookieBanner.js` - kontrola existence (řádek 2)

### .back-to-top
**Definováno:** `/assets/css/components/back-to-top.css`  
**Účel:** Tlačítko "zpět nahoru"  
**Použití:** `/assets/js/components/backToTop.js` - dynamicky vytvořený element (řádek 8)

### .visible
**Definováno:** `/assets/css/components/back-to-top.css`  
**Účel:** Třída pro zobrazení back-to-top tlačítka  
**Použití:** `/assets/js/components/backToTop.js` - přidává se při scrollu >200px (řádek 22)

### .ba-section, .ba-intro, .ba-interaction, .ba-gallery, .ba-empty, .ba-card, .ba-meta, .ba-title, .ba-date, .ba-media, .ba-figure, .ba-label, .ba-note, .ba-toggle-hint, .ba-more
**Definováno:** `/before-after/before-after.css`  
**Účel:** Styly pro before-after galerii  
**Použití:** `/before-after/gallery.js` - dynamicky vytvořené elementy, `index.html` (řádky 220-226)

### .select-modern, .select-trigger, .select-label, .select-caret, .select-menu, .select-option, .select-hidden
**Definováno:** `/assets/css/pages/index.css`  
**Účel:** Styly pro custom select komponentu  
**Použití:** `/assets/js/components/select.js` - dynamicky vytvořené elementy (řádky 12-50)

### .is-open
**Definováno:** `/assets/css/layout/header.css`  
**Účel:** Třída pro otevřené mobilní menu  
**Použití:** `/assets/js/components/nav.js` - toggle mobilního menu (řádek 67)

### .is-scrolled
**Definováno:** `/assets/css/layout/header.css`  
**Účel:** Třída pro scrollovaný header. Momentálně neaktivní – kód je zakomentovaný.  
**Použití:** Zakomentováno v nav.js (řádek 92)

### .active
**Definováno:** `/assets/css/layout/header.css`  
**Účel:** Aktivní odkaz v navigaci  
**Použití:** `/assets/js/components/nav.js` - přidává se při kliknutí na odkaz (řádek 45)

### .is-selected
**Definováno:** `/assets/css/pages/index.css`  
**Účel:** Vybraná možnost v custom select  
**Použití:** `/assets/js/components/select.js` - přidává se při výběru (řádek 74)

### .is-hidden
**Definováno:** `/assets/css/components/cookie-banner.css`  
**Účel:** Skrytý cookie banner  
**Použití:** `/assets/js/components/cookieBanner.js` - přidává se po souhlasu (řádky 76, 82, 90, 99)

### .bg-offwhite
**Definováno:** Nedefinováno v CSS – pouze použito v HTML  
**Účel:** Pozadí sekce  
**Použití:** `index.html` (řádek 230)

### .skip-link
**Definováno:** `/assets/css/base/utilities.css`  
**Účel:** Skip link pro přístupnost  
**Použití:** `index.html` (řádek 133)

## JavaScript globální proměnné a funkce

### window.beforeAfterGallery
**Definováno:** `/before-after/data.js` (řádek 1)  
**Účel:** Pole objektů s daty galerie (title, date, before, after, note)  
**Použití:** `/before-after/gallery.js` - renderování galerie (řádek 133), kontrola existence a filtrování

### window.lesktopTrackEvent
**Definováno:** `/assets/js/components/cookieBanner.js` (řádek 14)  
**Účel:** Globální funkce pro tracking událostí do Google Analytics  
**Použití:** 
- `index.html` - inline onclick handlery (řádky 144-147, 171, 177, 183, 189, 195, 201, 207, 213, 444, 456, 457, 477)
- `/assets/js/components/form.js` - tracking konverzí (řádky 56, 62, 133, 145)
- `/assets/js/components/enhancedTracking.js` - kontrola existence před použitím (řádek 8)

### window.gtag
**Definováno:** `/assets/js/components/cookieBanner.js` (řádek 33)  
**Účel:** Google Analytics gtag funkce  
**Použití:** 
- `/assets/js/components/cookieBanner.js` - konfigurace GA4 a Google Ads (řádky 37, 44, 58)
- `/assets/js/components/enhancedTracking.js` - kontrola existence (řádek 16)
- `/assets/js/components/advancedTracking.js` - kontrola existence (řádek 5)

### window.dataLayer
**Definováno:** `/assets/js/components/cookieBanner.js` (řádek 29)  
**Účel:** Google Analytics data layer  
**Použití:** `/assets/js/components/cookieBanner.js` - inicializace a push událostí (řádek 29, 31)

### window.__lesktopGtagLoaded
**Definováno:** `/assets/js/components/cookieBanner.js` (řádek 26)  
**Účel:** Flag pro prevenci duplikace načtení GA skriptu  
**Použití:** `/assets/js/components/cookieBanner.js` - kontrola před načtením (řádek 26, 27)

### window['ga-disable-G-FLL5D5LE75']
**Definováno:** `/assets/js/components/cookieBanner.js` (řádek 11)  
**Účel:** Flag pro zakázání Google Analytics  
**Použití:** `/assets/js/components/cookieBanner.js` - kontrola v lesktopTrackEvent (řádek 15), nastavení při "Jen nezbytné" (řádek 11)

## Data atributy

### data-track
**Použití:** `index.html`, `privacy.html`, `terms.html`
**Účel:** Identifikuje typ elementu pro tracking (např. "phone")

### data-location
**Použití:** `index.html`, `privacy.html`, `terms.html`
**Účel:** Určuje kontext/lokaci, kde ke kliknutí došlo (např. "contact_section", "footer")

### data-page
**Použití:** `404.html`
**Účel:** Identifikuje typ stránky pro specifické skripty nebo styly (např. "404")

## Poznámky k údržbě

- Čísla řádků platí pro aktuální verzi projektu.
- Při větších změnách aktualizuj tento slovník.
- Nové ID/třídy vždy doplň do tohoto souboru.
