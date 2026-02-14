# Téma a design tokeny

## 1. CSS proměnné (custom properties)

### Barvy

#### --color-primary-dark: #3a4768
Používá se na nadpisy sekcí (.section-title), nadpisy v kartách služeb a ceníku (h3), text v sekcích, skip-link pozadí, silné texty v price-list, a v rgba() pro pozadí stránky a hero sekce.

#### --color-primary-light: #4c6292
Používá se na ikony v kartách služeb, ikony v price-list, text v kontaktních informacích, a v rgba() pro rámečky karet, formulářů a features.

#### --color-accent: #7ca8e0
Používá se na ceny v ceníku (.price-from), hover stavy navigačních odkazů, podtržení aktivních odkazů, ikony v services grid, ikony v features, hover stavy v kontaktních informacích.

#### --color-text-dark: #2c354a
Používá se na základní text v body, text v kartách služeb, text v price-info, text v custom select, text v checkbox labels.

#### --color-text-light: #5f6b8c
Používá se na sekundární text v kartách služeb, text v price-list, text v price-note, text v features, malý text v kalkulačce (small).

#### --color-background-white: #ffffff
Používá se na text v headeru (logo, navigace), text v footeru, text v hero sekci.

#### --color-background-offwhite: #f5f8fc
Definována, ale nepoužívá se v žádném CSS souboru.

#### --color-border: #e0e7ee
Používá se na rámečky inputů, selectů a textareas ve formulářích.

#### --color-success: #28a745
Používá se na text úspěšného odeslání formuláře (.form-status.success).

#### --color-error: #dc3545
Používá se na text chybové zprávy formuláře (.form-status.error).

#### --color-primary-light-rgb: 76, 98, 146
Používá se v rgba() pro průhledné rámečky karet, formulářů, features a focus stavy inputů.

#### --color-primary-dark-rgb: 58, 71, 104
Používá se v rgba() pro průhledné pozadí stránky (body::before) a hero sekce s různými úrovněmi opacity.

#### --color-accent-rgb: 124, 168, 224
Používá se v rgba() pro focus ringy (outline a box-shadow) na tlačítkách, back-to-top tlačítku a custom select options, a pro transparentní akcenty s různými úrovněmi opacity.

### Fonty

#### --font-heading: 'Montserrat', sans-serif
Používá se na všechny nadpisy (h1, h2, h3), section-title, nadpisy v kartách, nadpisy v pricing, nadpisy v features, tlačítka (.btn).

#### --font-body: 'Open Sans', sans-serif
Používá se na základní text v body elementu.

### Stíny

#### --shadow-light: 0 4px 15px rgba(0, 0, 0, 0.08)
Používá se na karty služeb (.service-item), karty features (.feature-item), glass efekty v index.css.

#### --shadow-medium: 0 8px 25px rgba(0, 0, 0, 0.12)
Používá se na hover stavy karet služeb a ceníku, kontaktní formulář, kalkulačku, pricing grid karty při hoveru.

### Přechody / animace / rychlosti

#### --transition-speed: 0.4s
Používá se na transition vlastnosti tlačítek, karet, formulářů, features, back-to-top tlačítka, hover efekty v headeru a footeru, reveal-on-scroll animace.

### Glass parametry

#### --glass-blur: 12px
Používá se v backdrop-filter pro glass efekty v formulářích, glass-panel, glass-effect, glass-effect-small (s úpravou -6px).

#### --glass-saturate: 180%
Používá se v backdrop-filter pro glass efekty v formulářích, glass-panel, glass-effect společně s --glass-blur.

### Layout proměnné

#### --header-height: 90px
Používá se na scroll-padding-top v html pro správné scrollování k anchor odkazům, min-height footeru. Přepisuje se v media queries pro různé breakpointy (80px, 70px, 64px, 60px, 56px).

#### --mobile-menu-gap: 8px
Definována, ale nepoužívá se v žádném CSS souboru.

## 2. Nejrychlejší změny vzhledu

### Změna primární barvy
**Soubor:** `/assets/css/tokens/tokens.css`  
**Proměnné:** `--color-primary-dark` a `--color-primary-dark-rgb`  
Uprav hodnotu `--color-primary-dark` (např. `#3a4768`) a odpovídající RGB složky v `--color-primary-dark-rgb` (např. `58, 71, 104`). Ovlivní nadpisy, texty v sekcích, pozadí stránky a hero sekce.

### Změna akcentní barvy
**Soubor:** `/assets/css/tokens/tokens.css`  
**Proměnná:** `--color-accent`  
Uprav hodnotu `--color-accent` (např. `#7ca8e0`). Ovlivní ceny v ceníku, hover stavy navigace, ikony v services a features, hover stavy v kontaktech.

### Změna fontu nadpisů a textu
**Soubor:** `/assets/css/tokens/tokens.css`  
**Proměnné:** `--font-heading` a `--font-body`  
Uprav hodnoty `--font-heading` (např. `'Montserrat', sans-serif`) a `--font-body` (např. `'Open Sans', sans-serif`). Ovlivní všechny nadpisy a základní text na celém webu.

### Změna intenzity glass efektu
**Soubor:** `/assets/css/tokens/tokens.css`  
**Proměnné:** `--glass-blur` a `--glass-saturate`  
Uprav hodnoty `--glass-blur` (např. `12px`) pro míru rozmazání a `--glass-saturate` (např. `180%`) pro sytost barev. Ovlivní všechny glass efekty v formulářích, kartách a panelech.

### Změna stínů
**Soubor:** `/assets/css/tokens/tokens.css`  
**Proměnné:** `--shadow-light` a `--shadow-medium`  
Uprav hodnoty `--shadow-light` (např. `0 4px 15px rgba(0, 0, 0, 0.08)`) pro jemné stíny a `--shadow-medium` (např. `0 8px 25px rgba(0, 0, 0, 0.12)`) pro výraznější stíny. Ovlivní stíny karet, formulářů a hover efekty.
