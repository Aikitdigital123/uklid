# Architektura CSS

## 1. CSS soubory načítané v index.html

V `index.html` se načítají následující CSS soubory (v pořadí):

1. **Google Fonts** (řádek 9)
   - URL: `https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@400;600&display=swap`

2. **Font Awesome** (řádek 39)
   - URL: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css`

3. **Hlavní CSS** (řádek 41)
   - Cesta: `/assets/css/style.css`

4. **Before-After CSS** (řádek 42)
   - Cesta: `before-after/before-after.css`

## 2. Importy v style.css

Soubor `/assets/css/style.css` importuje následující soubory pomocí `@import` (v pořadí podle řádků 3-21):

1. `./tokens/tokens.css` - design tokeny (barvy, fonty, stíny, přechody)
2. `./base/reset.css` - reset stylů a základní nastavení
3. `./base/typography.css` - typografie a velikosti písma
4. `./base/utilities.css` - utility třídy (skip-link)
5. `./layout/header.css` - styly pro hlavičku
6. `./layout/sections.css` - styly pro sekce
7. `./layout/footer.css` - styly pro patičku
8. `./layout/container.css` - container a layout
9. `./components/button.css` - tlačítka
10. `./components/card.css` - karty (service-item, price-card)
11. `./components/form.css` - formuláře
12. `./components/features.css` - features sekce
13. `./components/services.css` - services grid
14. `./components/pricing.css` - pricing grid
15. `./components/glass.css` - glass efekty
16. `./components/back-to-top.css` - tlačítko "zpět nahoru"
17. `./components/cookie-banner.css` - cookie banner
18. `./pages/index.css` - stránkově specifické styly pro index

## 3. Struktura podsložek v /assets/css/

### base/
**Soubory:**
- `reset.css` - reset box-sizing, margin, padding, scroll-padding, overflow kontroly, základní nastavení body a main
- `typography.css` - adaptivní velikosti písma pomocí clamp() pro h1, h2, h3, p, li, nav-link, btn, label, input/select/textarea
- `utilities.css` - skip-link pro přístupnost

**Účel:** Základní reset, typografie a utility třídy.

### components/
**Soubory:**
- `button.css` - základní tlačítka (.btn), glass efekty, sheen animace, WhatsApp varianta (zelená)
- `card.css` - karty pro služby (.service-item) a ceník (.price-card) s glass efekty a hover animacemi
- `form.css` - formuláře (#kalkulacka, .contact-form), input/select/textarea styly, checkbox skupiny s custom designem
- `pricing.css` - pricing grid layout, price-card styly
- `services.css` - services grid layout, service-item styly
- `cookie-banner.css` - fixed cookie banner s glass efektem, tlačítka pro souhlas
- `glass.css` - glass efekty (.glass-effect, .glass-effect-small, .glass-panel) s backdrop-filter a pseudo-elementy
- `back-to-top.css` - fixed tlačítko "zpět nahoru" s animací zobrazení při scrollu
- `features.css` - features list grid a feature-item karty

**Účel:** Komponenty používané napříč webem.

### layout/
**Soubory:**
- `container.css` - container s max-width 1100px a padding
- `header.css` - fixed header (.site-header), glass efekt header-inner, logo (.brand), navigace (.site-nav), mobilní menu, shimmer animace
- `footer.css` - footer (.main-footer) s glass efektem, social links, legal links, shimmer animace
- `sections.css` - content-section styly, section-title, padding a margin pro sekce

**Účel:** Layout komponenty (header, footer, container, sekce).

### pages/
**Soubory:**
- `index.css` - stránkově specifické styly: body::before pozadí, hero sekce, kontaktní formulář, reveal-on-scroll animace, custom select (caret používá mask-image s tokenem pro barvu), checkbox styly, responzivní breakpointy, glass efekty variace

**Účel:** Styly specifické pro index.html.

### tokens/
**Soubory:**
- `tokens.css` - CSS custom properties (design tokeny): barvy (--color-primary-dark, --color-primary-light, --color-accent, --color-text-dark, --color-text-light, --color-background-white, --color-background-offwhite, --color-border, --color-success, --color-error), RGB složky pro rgba(), fonty (--font-heading, --font-body), stíny (--shadow-light, --shadow-medium), přechody (--transition-speed), glass parametry (--glass-blur, --glass-saturate), header výška (--header-height)

**Účel:** Centrální definice design tokenů (barvy, fonty, mezery, stíny).

### breakpoints/
**Soubory:**
- Žádné soubory (prázdná složka)

**Účel:** Složka pro budoucí breakpoint definice (aktuálně prázdná).

## 4. Kde se řeší jednotlivé části designu

### Barvy a fonty (design tokeny)
- **Soubor:** `/assets/css/tokens/tokens.css`
- Definuje CSS custom properties pro všechny barvy, fonty, stíny a další design tokeny používané napříč projektem.

### Layout (container/sections)
- **Container:** `/assets/css/layout/container.css` - max-width, padding, margin
- **Sekce:** `/assets/css/layout/sections.css` - content-section, section-title, padding a margin
- **Header:** `/assets/css/layout/header.css` - fixed header, navigace
- **Footer:** `/assets/css/layout/footer.css` - footer layout

### Komponenty
- **Tlačítka:** `/assets/css/components/button.css` - .btn, glass efekty, WhatsApp varianta
- **Karty:** `/assets/css/components/card.css` - .service-item, .price-card
- **Formuláře:** `/assets/css/components/form.css` - #kalkulacka, .contact-form, input/select/textarea, checkbox skupiny
- **Pricing:** `/assets/css/components/pricing.css` - .pricing-grid, .price-card
- **Services:** `/assets/css/components/services.css` - .services-grid, .service-item

### Cookie banner
- **Soubor:** `/assets/css/components/cookie-banner.css`
- Fixed pozice, glass efekt, tlačítka pro souhlas, responzivní úpravy.

### Before-after galerie
- **Soubor:** `/before-after/before-after.css` (načítá se přímo v index.html, není v assets/css)
- Styly pro .ba-section, .ba-gallery, .ba-card, .ba-figure, .ba-label, responzivní grid.

## 5. 5 nejčastějších míst pro změny designu

### 1. Barvy a fonty
**Soubor:** `/assets/css/tokens/tokens.css`
- Změna barev: upravit CSS custom properties `--color-primary-dark`, `--color-primary-light`, `--color-accent`, `--color-text-dark`, `--color-text-light`
- Změna fontů: upravit `--font-heading` a `--font-body`
- Změna stínů: upravit `--shadow-light` a `--shadow-medium`

### 2. Tlačítka
**Soubor:** `/assets/css/components/button.css`
- Změna vzhledu tlačítek: upravit .btn styly (padding, border-radius, barvy, glass efekty)
- Změna hover efektů: upravit .btn:hover
- Změna WhatsApp tlačítka: upravit .btn.btn-whatsapp

### 3. Spacing sekcí
**Soubory:**
- `/assets/css/layout/sections.css` - padding a margin pro .content-section
- `/assets/css/pages/index.css` - responzivní úpravy padding pro různé breakpointy
- Změna mezer mezi sekcemi: upravit padding v .content-section nebo margin v jednotlivých sekcích

### 4. Karty (service-item, price-card)
**Soubory:**
- `/assets/css/components/card.css` - základní styly pro .service-item a .price-card
- `/assets/css/components/services.css` - services grid a service-item variace
- `/assets/css/components/pricing.css` - pricing grid a price-card variace
- Změna vzhledu karet: upravit padding, border-radius, glass efekty, hover animace

### 5. Glass efekty a průhlednost
**Soubory:**
- `/assets/css/components/glass.css` - základní glass efekty (.glass-effect, .glass-effect-small, .glass-panel)
- `/assets/css/layout/header.css` - glass efekt pro header
- `/assets/css/layout/footer.css` - glass efekt pro footer
- `/assets/css/components/card.css` - glass efekty v kartách
- Změna průhlednosti: upravit rgba() hodnoty v background, backdrop-filter parametry, nebo design tokeny `--glass-blur` a `--glass-saturate` v tokens.css
