# Audit CSS vs Dokumentace - Lesktop Project

**Datum auditu:** 2025-01-XX  
**Soubory kontrolované:** `/assets/css/style.css`, `/assets/css/**/*`  
**Dokumentace kontrolovaná:** `kb/06_architektura_css.md`, `kb/07_tema_a_tokeny.md`, `kb/11_slovnik_pojmu.md`

---

## 1. Pořadí @import v style.css vs dokumentace

### ✅ Pořadí @import v style.css

**Skutečné pořadí v `style.css` (řádky 3-21):**
1. `./tokens/tokens.css` (řádek 3)
2. `./base/reset.css` (řádek 4)
3. `./base/typography.css` (řádek 5)
4. `./base/utilities.css` (řádek 6)
5. `./layout/header.css` (řádek 7)
6. `./layout/sections.css` (řádek 8)
7. `./layout/footer.css` (řádek 9)
8. `./layout/container.css` (řádek 10)
9. `./components/button.css` (řádek 11)
10. `./components/card.css` (řádek 12)
11. `./components/form.css` (řádek 13)
12. `./components/features.css` (řádek 14)
13. `./components/services.css` (řádek 15)
14. `./components/pricing.css` (řádek 16)
15. `./components/glass.css` (řádek 17)
16. `./components/back-to-top.css` (řádek 18)
17. `./components/cookie-banner.css` (řádek 19)
18. `./pages/index.css` (řádek 21)

### ✅ Pořadí @import v dokumentaci

**Dokumentace (`kb/06_architektura_css.md`, řádky 21-40) uvádí:**
1. `./tokens/tokens.css` ✓
2. `./base/reset.css` ✓
3. `./base/typography.css` ✓
4. `./base/utilities.css` ✓
5. `./layout/header.css` ✓
6. `./layout/sections.css` ✓
7. `./layout/footer.css` ✓
8. `./layout/container.css` ✓
9. `./components/button.css` ✓
10. `./components/card.css` ✓
11. `./components/form.css` ✓
12. `./components/features.css` ✓
13. `./components/services.css` ✓
14. `./components/pricing.css` ✓
15. `./components/glass.css` ✓
16. `./components/back-to-top.css` ✓
17. `./components/cookie-banner.css` ✓
18. `./pages/index.css` ✓

### ⚠️ Nesoulady v pořadí @import

**Žádné nesoulady.** Pořadí @import v `style.css` odpovídá dokumentaci. ✓

---

## 2. Existence všech souborů vs dokumentace

### ✅ Soubory v style.css, které existují

**Všechny soubory importované v `style.css` existují:**

1. `./tokens/tokens.css` ✓
2. `./base/reset.css` ✓
3. `./base/typography.css` ✓
4. `./base/utilities.css` ✓
5. `./layout/header.css` ✓
6. `./layout/sections.css` ✓
7. `./layout/footer.css` ✓
8. `./layout/container.css` ✓
9. `./components/button.css` ✓
10. `./components/card.css` ✓
11. `./components/form.css` ✓
12. `./components/features.css` ✓
13. `./components/services.css` ✓
14. `./components/pricing.css` ✓
15. `./components/glass.css` ✓
16. `./components/back-to-top.css` ✓
17. `./components/cookie-banner.css` ✓
18. `./pages/index.css` ✓

### ✅ Struktura podsložek vs dokumentace

**Dokumentace (`kb/06_architektura_css.md`, řádky 42-91) správně uvádí strukturu:**

**base/:**
- `reset.css` ✓
- `typography.css` ✓
- `utilities.css` ✓

**components/:**
- `button.css` ✓
- `card.css` ✓
- `form.css` ✓
- `features.css` ✓
- `services.css` ✓
- `pricing.css` ✓
- `glass.css` ✓
- `back-to-top.css` ✓
- `cookie-banner.css` ✓

**layout/:**
- `container.css` ✓
- `header.css` ✓
- `footer.css` ✓
- `sections.css` ✓

**pages/:**
- `index.css` ✓

**tokens/:**
- `tokens.css` ✓

**breakpoints/:**
- Prázdná složka (dokumentace správně uvádí) ✓

### ⚠️ Chybějící soubory

**Žádné chybějící soubory.** Všechny soubory uvedené v dokumentaci existují. ✓

---

## 3. Použití tokenů vs dokumentace

### ✅ Tokeny definované v tokens.css

**Všechny tokeny z `tokens.css` (řádky 3-29):**
- `--color-primary-dark: #3a4768` ✓
- `--color-primary-light: #4c6292` ✓
- `--color-accent: #7ca8e0` ✓
- `--color-text-dark: #2c354a` ✓
- `--color-text-light: #5f6b8c` ✓
- `--color-background-white: #ffffff` ✓
- `--color-background-offwhite: #f5f8fc` ✓
- `--color-border: #e0e7ee` ✓
- `--color-success: #28a745` ✓
- `--color-error: #dc3545` ✓
- `--color-primary-light-rgb: 76, 98, 146` ✓
- `--color-primary-dark-rgb: 58, 71, 104` ✓
- `--font-heading: 'Montserrat', sans-serif` ✓
- `--font-body: 'Open Sans', sans-serif` ✓
- `--shadow-light: 0 4px 15px rgba(0, 0, 0, 0.08)` ✓
- `--shadow-medium: 0 8px 25px rgba(0, 0, 0, 0.12)` ✓
- `--transition-speed: 0.4s` ✓
- `--glass-blur: 12px` ✓
- `--glass-saturate: 180%` ✓
- `--header-height: 90px` ✓
- `--mobile-menu-gap: 8px` ✓

### ⚠️ Tokeny v dokumentaci, které nejsou použity

**Dokumentace (`kb/07_tema_a_tokeny.md`) správně uvádí:**

1. **`--color-background-offwhite`** (řádek 25-26)
   - **Dokumentace:** "Definována, ale nepoužívá se v žádném CSS souboru."
   - **Skutečnost:** Token je definován v `tokens.css` (řádek 9), ale není používán v žádném CSS souboru
   - **Status:** ✅ Dokumentace je správná

2. **`--mobile-menu-gap`** (řádek 77-78)
   - **Dokumentace:** "Definována, ale nepoužívá se v žádném CSS souboru."
   - **Skutečnost:** Token je definován v `tokens.css` (řádek 29), ale není používán v žádném CSS souboru
   - **Status:** ✅ Dokumentace je správná

### ❌ Tokeny používané v CSS, které NEOBSAHUJE dokumentace

**Chybějící token v dokumentaci:**

1. **`--color-text`** (používá se v `cookie-banner.css`)
   - **Skutečnost:** Používá se v `cookie-banner.css` (řádky 15, 87): `color: var(--color-text);`
   - **Problém:** Token `--color-text` **NENÍ definován** v `tokens.css`
   - **Status:** ❌ **Chyba v kódu** - token je používán, ale není definován

### ⚠️ Nesoulady v použití tokenů

**Kritická chyba:** Token `--color-text` je používán v `cookie-banner.css`, ale není definován v `tokens.css`. To způsobí, že barva nebude fungovat (fallback na default).

---

## 4. Existence tříd vs dokumentace

### ✅ Třídy v dokumentaci, které existují v CSS

**Všechny hlavní třídy z `kb/11_slovnik_pojmu.md` existují v CSS:**

- `.container` - `layout/container.css` ✓
- `.site-header` - `layout/header.css` ✓
- `.header-inner` - `layout/header.css` ✓
- `.brand` - `layout/header.css` ✓
- `.brand-logo`, `.brand-text` - `layout/header.css` ✓
- `.nav-toggle` - `layout/header.css` ✓
- `.site-nav` - `layout/header.css` ✓
- `.nav-link` - `layout/header.css` ✓
- `.content-section` - `layout/sections.css` ✓
- `.section-title` - `layout/sections.css` ✓
- `.section-subtitle` - `pages/index.css` ✓
- `.glass-panel` - `components/glass.css` ✓
- `.services-grid` - `components/services.css` ✓
- `.service-item` - `components/card.css`, `components/services.css` ✓
- `.pricing-grid` - `components/pricing.css` ✓
- `.price-card` - `components/card.css`, `components/pricing.css` ✓
- `.btn` - `components/button.css` ✓
- `.btn-primary`, `.btn-secondary`, `.btn-whatsapp`, `.btn-outline` - `components/button.css` ✓
- `.calculator-form`, `.contact-form` - `components/form.css` ✓
- `.form-group` - `components/form.css` ✓
- `.form-group-hidden` - `pages/index.css` ✓
- `.checkbox-group` - `components/form.css` ✓
- `.form-status`, `.form-status-hidden` - `pages/index.css` ✓
- `.contact-info` - `pages/index.css` ✓
- `.reveal-on-scroll` - `pages/index.css` ✓
- `.is-visible` - `pages/index.css` ✓
- `.delay-1`, `.delay-2`, `.delay-3`, `.delay-4` - `pages/index.css` ✓
- `.main-footer` - `layout/footer.css` ✓
- `.social-links`, `.legal-links` - `layout/footer.css` ✓
- `.cookie-banner` - `components/cookie-banner.css` ✓
- `.back-to-top` - `components/back-to-top.css` ✓
- `.visible` - `components/back-to-top.css` ✓
- `.select-modern`, `.select-trigger`, `.select-label`, `.select-caret`, `.select-menu`, `.select-option`, `.select-hidden` - `pages/index.css` ✓
- `.is-open` - `layout/header.css` ✓
- `.is-scrolled` - `layout/header.css` ✓
- `.active` - `layout/header.css` ✓
- `.is-selected` - `pages/index.css` ✓
- `.is-hidden` - `components/cookie-banner.css` ✓
- `.bg-offwhite` - Nedefinováno v CSS (pouze použito v HTML) ✓
- `.skip-link` - `base/utilities.css` ✓

### ⚠️ Třídy v CSS, které NEOBSAHUJE dokumentace

**Chybějící třídy v `kb/11_slovnik_pojmu.md`:**

1. **`.hero-section`** (`pages/index.css`, řádek 71)
   - Hero sekce s pozadím
   - **Doporučení:** Přidat do slovníku

2. **`.hero-content`** (`pages/index.css`, řádek 89)
   - Kontejner pro hero obsah
   - **Doporučení:** Přidat do slovníku

3. **`.features-list`** (`components/features.css`, řádek 2)
   - Grid layout pro features
   - **Doporučení:** Přidat do slovníku

4. **`.feature-item`** (`components/features.css`, řádek 9)
   - Karta feature
   - **Doporučení:** Přidat do slovníku

5. **`.glass-effect`** (`components/glass.css`, řádek 2)
   - Glass efekt komponenta
   - **Doporučení:** Přidat do slovníku (je zmíněna v dokumentaci, ale není v slovníku)

6. **`.glass-effect-small`** (`components/glass.css`, řádek 3)
   - Malý glass efekt
   - **Doporučení:** Přidat do slovníku (je zmíněna v dokumentaci, ale není v slovníku)

7. **`.glass-readable`** (`pages/index.css`, řádek 763)
   - Modifikátor pro čitelnost textu v glass efektech
   - **Doporučení:** Přidat do slovníku

8. **`.glass-text-contrast`** (`pages/index.css`, řádek 773)
   - Utility pro kontrast textu v glass efektech
   - **Doporučení:** Přidat do slovníku

9. **`.cookie-banner__text`** (`components/cookie-banner.css`, řádek 23)
   - Textová část cookie banneru
   - **Doporučení:** Přidat do slovníku

10. **`.cookie-banner__link`** (`components/cookie-banner.css`, řádek 36)
    - Odkaz v cookie banneru
    - **Doporučení:** Přidat do slovníku

11. **`.cookie-banner__actions`** (`components/cookie-banner.css`, řádek 62)
    - Kontejner pro tlačítka v cookie banneru
    - **Doporučení:** Přidat do slovníku

12. **`.open`** (`pages/index.css`, řádek 820)
    - Třída pro otevřený custom select menu
    - **Doporučení:** Přidat do slovníku

---

## 5. Hardcoded hodnoty místo tokenů

### ❌ Hardcoded barvy místo tokenů

**Nalezené hardcoded hodnoty:**

1. **`#ffffff` (bílá barva)**
   - **Místa:** Používá se na mnoha místech místo `var(--color-background-white)`
   - **Soubory:**
     - `pages/index.css`: řádky 26, 39, 121, 851, 861
     - `layout/header.css`: řádky 105, 147, 160, 351, 358
     - `base/utilities.css`: řádek 7
     - `components/cookie-banner.css`: řádky 50, 57, 74
     - `layout/footer.css`: řádek 97
     - `components/back-to-top.css`: řádek 10
     - `components/button.css`: řádky 29, 45, 58
   - **Doporučení:** Nahradit `#ffffff` za `var(--color-background-white)` kde je to možné

2. **`rgba(124,168,224,...)` (akcentní barva)**
   - **Místa:** Používá se na mnoha místech místo `var(--color-accent)` nebo `rgba(var(--color-primary-light-rgb), ...)`
   - **Soubory:**
     - `pages/index.css`: řádky 122-131, 645, 708, 743, 750, 802, 830, 854
     - `layout/header.css`: řádky 100, 106, 132, 139, 148, 172, 228, 238, 249
     - `components/form.css`: řádky 58, 65, 81, 82, 90
     - `components/cookie-banner.css`: řádky 16, 73, 75, 80, 88
   - **Doporučení:** Použít `rgba(var(--color-primary-light-rgb), ...)` nebo vytvořit token pro akcentní barvu s RGB

3. **`rgba(37,211,102,...)` (WhatsApp zelená)**
   - **Místa:** Používá se pro WhatsApp tlačítka
   - **Soubory:**
     - `pages/index.css`: řádky 27-29, 34-36
     - `components/button.css`: řádky 46-48, 53-55
   - **Doporučení:** Vytvořit token `--color-whatsapp` nebo `--color-whatsapp-rgb` pro WhatsApp barvu

4. **`rgba(20,30,60,...)` (tmavá barva pro stíny)**
   - **Místa:** Používá se pro box-shadow
   - **Soubory:**
     - `pages/index.css`: řádky 124, 131, 219, 449, 577, 646, 677, 702, 744, 796, 814, 911
     - `layout/header.css`: řádky 35, 86
     - `components/back-to-top.css`: řádek 14
   - **Doporučení:** Vytvořit token `--shadow-color-rgb` nebo použít existující RGB tokeny

5. **`rgba(44, 53, 74, ...)` (text-dark barva)**
   - **Místa:** Používá se místo `var(--color-text-dark)` nebo `rgba(var(--color-primary-dark-rgb), ...)`
   - **Soubory:**
     - `pages/index.css`: řádek 142
     - `layout/sections.css`: řádek 28
     - `before-after/before-after.css`: řádky 8, 15
   - **Doporučení:** Použít `rgba(var(--color-primary-dark-rgb), ...)` nebo `var(--color-text-dark)`

6. **`#d4edda`, `#c3e6cb` (success barvy)**
   - **Místa:** Používá se pro success stav formuláře
   - **Soubory:**
     - `pages/index.css`: řádky 200, 202
   - **Doporučení:** Vytvořit tokeny `--color-success-bg` a `--color-success-border` nebo použít existující `--color-success`

7. **`#f8d7da`, `#f5c6cb` (error barvy)**
   - **Místa:** Používá se pro error stav formuláře
   - **Soubory:**
     - `pages/index.css`: řádky 207, 209
   - **Doporučení:** Vytvořit tokeny `--color-error-bg` a `--color-error-border` nebo použít existující `--color-error`

8. **`#8a93a8`, `#9aa3b8` (placeholder barvy)**
   - **Místa:** Používá se pro placeholder text
   - **Soubory:**
     - `components/form.css`: řádky 15, 47
   - **Doporučení:** Vytvořit token `--color-placeholder`

9. **`#1f2a44` (tmavá barva pro checkbox fajfku)**
   - **Místa:** Používá se pro checkbox fajfku
   - **Soubory:**
     - `components/form.css`: řádek 74
   - **Doporučení:** Použít `var(--color-primary-dark)` nebo vytvořit token

10. **`rgba(255,255,255,...)` (bílá s průhledností)**
    - **Místa:** Používá se na mnoha místech pro glass efekty
    - **Soubory:** Všude v CSS souborech
    - **Doporučení:** Vytvořit token `--color-white-rgb: 255, 255, 255` pro konzistentní použití

### ⚠️ Hardcoded hodnoty - shrnutí

**Počet hardcoded hodnot:**
- `#ffffff`: ~20 výskytů
- `rgba(124,168,224,...)`: ~30 výskytů
- `rgba(20,30,60,...)`: ~15 výskytů
- `rgba(255,255,255,...)`: ~50 výskytů
- Ostatní: ~10 výskytů

**Celkem:** ~125 hardcoded hodnot místo tokenů

---

## 6. Detailní kontroly

### tokens.css

**Kontrola:**
- ✅ Všechny tokeny jsou definovány v `:root`
- ✅ RGB složky jsou správně definovány
- ✅ Tokeny odpovídají dokumentaci

**Nesoulad:** Token `--color-text` je používán v `cookie-banner.css`, ale není definován v `tokens.css`.

### base/reset.css

**Kontrola:**
- ✅ Používá `var(--header-height)` (řádek 9) ✓
- ✅ Používá `var(--font-body)` (řádek 21) ✓
- ✅ Používá `var(--color-text-dark)` (řádek 23) ✓

**Nesoulad:** Žádný.

### base/typography.css

**Kontrola:**
- ✅ Používá `var(--font-heading)` (řádky 6-8) ✓

**Nesoulad:** Žádný.

### base/utilities.css

**Kontrola:**
- ✅ Používá `var(--color-primary-dark, #3a4768)` (řádek 6) ✓
- ⚠️ Hardcoded `#ffffff` (řádek 7) - mělo by být `var(--color-background-white)`

**Nesoulad:** Hardcoded `#ffffff` místo tokenu.

### layout/header.css

**Kontrola:**
- ✅ Používá `var(--color-background-white, #ffffff)` s fallbackem (řádky 97, 131, 138, 208, 245, 267, 281) ✓
- ✅ Používá `var(--color-accent, rgba(124,168,224,0.85))` s fallbackem (řádky 228, 238, 249, 270, 283) ✓
- ✅ Používá `var(--transition-speed, 0.3s)` s fallbackem (řádek 99) ✓
- ⚠️ Hardcoded `#ffffff` na několika místech (řádky 105, 147, 160, 351, 358)
- ⚠️ Hardcoded `rgba(124,168,224,...)` na několika místech (řádky 100, 106, 132, 139, 148, 172, 228, 238, 249)

**Nesoulad:** Mnoho hardcoded hodnot místo tokenů.

### layout/sections.css

**Kontrola:**
- ✅ Používá `var(--font-heading)` (řádek 32) ✓
- ✅ Používá `var(--color-primary-dark)` (řádek 34) ✓
- ⚠️ Hardcoded `rgba(44, 53, 74, 0.85)` (řádek 28) - mělo by být `rgba(var(--color-primary-dark-rgb), 0.85)`

**Nesoulad:** Hardcoded rgba hodnota místo tokenu.

### layout/footer.css

**Kontrola:**
- ✅ Používá `var(--color-background-white)` (řádek 64) ✓
- ✅ Používá `var(--color-accent)` (řádek 71) ✓
- ✅ Používá `var(--transition-speed)` (řádek 67) ✓
- ✅ Používá `var(--header-height)` (řádek 53) ✓
- ⚠️ Hardcoded `rgba(124,168,224,0.78)`, `rgba(76,98,146,0.78)` (řádek 3) - mělo by být `rgba(var(--color-primary-light-rgb), 0.78)`
- ⚠️ Hardcoded `#ffffff` (řádek 97)

**Nesoulad:** Několik hardcoded hodnot místo tokenů.

### components/button.css

**Kontrola:**
- ✅ Používá `var(--transition-speed)` (řádek 8) ✓
- ✅ Používá `var(--font-heading)` (řádek 9) ✓
- ⚠️ Hardcoded `#ffffff` (řádky 29, 45, 58)
- ⚠️ Hardcoded `rgba(124,168,224,...)` (řádky 30-32, 37-39)
- ⚠️ Hardcoded `rgba(20,30,60,...)` (řádky 32, 39)
- ⚠️ Hardcoded `rgba(37,211,102,...)` pro WhatsApp (řádky 46-48, 53-55)

**Nesoulad:** Mnoho hardcoded hodnot místo tokenů.

### components/card.css

**Kontrola:**
- ✅ Používá `var(--shadow-light)` (řádek 5) ✓
- ✅ Používá `var(--shadow-medium)` (řádek 23, 39) ✓
- ✅ Používá `rgba(var(--color-primary-light-rgb), 0.1)` (řádky 9, 37) ✓
- ✅ Používá `var(--color-primary-light)` (řádky 24, 46) ✓
- ✅ Používá `var(--font-heading)` (řádky 25, 40) ✓
- ✅ Používá `var(--color-primary-dark)` (řádky 25, 40, 47) ✓
- ✅ Používá `var(--color-text-light)` (řádky 26, 45) ✓
- ✅ Používá `var(--color-text-dark)` (řádek 42) ✓
- ✅ Používá `var(--color-accent)` (řádek 41) ✓
- ✅ Používá `var(--transition-speed)` (řádek 33) ✓

**Nesoulad:** Žádný - dobře používá tokeny.

### components/form.css

**Kontrola:**
- ✅ Používá `var(--color-border)` (řádek 10) ✓
- ✅ Používá `var(--transition-speed)` (řádek 13) ✓
- ✅ Používá `rgba(var(--color-primary-light-rgb), ...)` (řádky 17, 34, 45, 49) ✓
- ✅ Používá `var(--shadow-medium)` (řádek 30) ✓
- ✅ Používá `var(--glass-blur)` (řádek 32) ✓
- ✅ Používá `var(--glass-saturate)` (řádek 32) ✓
- ✅ Používá `var(--color-text-light)` (řádek 52) ✓
- ⚠️ Hardcoded `#8a93a8`, `#9aa3b8` (řádky 15, 47) - placeholder barvy
- ⚠️ Hardcoded `#ffffff` (řádky 59, 65)
- ⚠️ Hardcoded `rgba(124,168,224,...)` (řádky 58, 65, 81, 82, 90)
- ⚠️ Hardcoded `#1f2a44` (řádek 74)

**Nesoulad:** Několik hardcoded hodnot místo tokenů.

### components/features.css

**Kontrola:**
- ✅ Používá `var(--shadow-light)` (řádek 16) ✓
- ✅ Používá `var(--transition-speed)` (řádek 17) ✓
- ✅ Používá `rgba(var(--color-primary-light-rgb), 0.1)` (řádek 21) ✓
- ✅ Používá `var(--color-accent)` (řádek 26) ✓
- ✅ Používá `var(--font-heading)` (řádek 31) ✓
- ✅ Používá `var(--color-primary-dark)` (řádek 33) ✓
- ✅ Používá `var(--color-text-light)` (řádek 39) ✓

**Nesoulad:** Žádný - dobře používá tokeny.

### components/services.css

**Kontrola:**
- ✅ Používá `var(--color-accent)` (řádek 33) ✓
- ✅ Používá `var(--font-heading)` (řádek 43) ✓
- ✅ Používá `var(--color-text-dark)` (řádek 50) ✓
- ⚠️ Hardcoded `rgba(20, 30, 60, 0.26)` (řádek 22)
- ⚠️ Hardcoded `rgba(255,255,255,...)` (řádky 23, 34, 35, 38)

**Nesoulad:** Několik hardcoded hodnot místo tokenů.

### components/pricing.css

**Kontrola:**
- ✅ Používá `var(--transition-speed)` (řádek 17) ✓
- ✅ Používá `var(--shadow-medium)` (řádek 26) ✓
- ✅ Používá `rgba(var(--color-primary-light-rgb), 0.1)` (řádek 21) ✓
- ✅ Používá `var(--font-heading)` (řádek 30) ✓
- ✅ Používá `var(--color-primary-dark)` (řádek 32) ✓
- ✅ Používá `var(--color-accent)` (řádek 39) ✓
- ✅ Používá `var(--color-text-dark)` (řádek 46) ✓
- ✅ Používá `var(--color-primary-light)` (řádek 73) ✓
- ✅ Používá `var(--color-text-light)` (řádky 66, 86) ✓

**Nesoulad:** Žádný - dobře používá tokeny.

### components/glass.css

**Kontrola:**
- ✅ Používá `var(--glass-blur)` (řádky 12, 42) ✓
- ✅ Používá `var(--glass-saturate)` (řádky 12, 42) ✓
- ⚠️ Hardcoded `rgba(255,255,255,...)` na mnoha místech
- ⚠️ Hardcoded `rgba(20,30,60,...)` (řádky 16, 37, 46, 68)

**Nesoulad:** Několik hardcoded hodnot místo tokenů.

### components/back-to-top.css

**Kontrola:**
- ✅ Používá `var(--transition-speed)` (řádek 20) ✓
- ⚠️ Hardcoded `#ffffff` (řádek 10)
- ⚠️ Hardcoded `rgba(124,168,224,0.9)`, `rgba(76,98,146,0.9)` (řádek 9)
- ⚠️ Hardcoded `rgba(20,30,60,0.22)` (řádek 14)

**Nesoulad:** Několik hardcoded hodnot místo tokenů.

### components/cookie-banner.css

**Kontrola:**
- ⚠️ **Kritická chyba:** Používá `var(--color-text)` (řádky 15, 87), ale token není definován v `tokens.css`
- ⚠️ Hardcoded `#ffffff` (řádky 50, 57, 74)
- ⚠️ Hardcoded `rgba(124,168,224,...)` (řádky 16, 73, 75, 80, 88)
- ⚠️ Hardcoded `rgba(20,30,60,...)` (řádky 17, 76)

**Nesoulad:** Kritická chyba - použití nedefinovaného tokenu + mnoho hardcoded hodnot.

### pages/index.css

**Kontrola:**
- ✅ Používá `rgba(var(--color-primary-dark-rgb), ...)` (řádky 15, 16, 73, 74, 395, 501, 502, 515) ✓
- ✅ Používá `var(--color-background-white)` (řádek 77) ✓
- ✅ Používá `var(--font-heading)` (řádky 49, 50, 51, 94, 307) ✓
- ✅ Používá `var(--transition-speed)` (řádky 114, 167, 291) ✓
- ✅ Používá `var(--color-primary-light)` (řádky 158, 164) ✓
- ✅ Používá `var(--color-accent)` (řádek 171) ✓
- ✅ Používá `var(--shadow-medium)` (řádek 179) ✓
- ✅ Používá `var(--glass-blur)` (řádky 182, 216) ✓
- ✅ Používá `var(--glass-saturate)` (řádky 182, 216) ✓
- ✅ Používá `rgba(var(--color-primary-light-rgb), ...)` (řádky 184, 218, 262) ✓
- ✅ Používá `var(--color-success)` (řádek 201) ✓
- ✅ Používá `var(--color-error)` (řádek 208) ✓
- ✅ Používá `var(--shadow-light)` (řádek 263) ✓
- ✅ Používá `var(--color-text-dark)` (řádky 676, 794, 825) ✓
- ✅ Používá `var(--header-height)` s přepisem v media queries (řádky 339, 373, 488, 878, 886) ✓
- ⚠️ Hardcoded `#ffffff` (řádky 26, 39, 121, 851, 861)
- ⚠️ Hardcoded `rgba(37,211,102,...)` pro WhatsApp (řádky 27-29, 34-36)
- ⚠️ Hardcoded `rgba(124,168,224,...)` (řádky 122-131, 645, 708, 743, 750, 802, 830, 854)
- ⚠️ Hardcoded `rgba(20,30,60,...)` (řádky 124, 131, 219, 449, 577, 646, 677, 702, 744, 796, 814, 911)
- ⚠️ Hardcoded `rgba(44, 53, 74, ...)` (řádek 142)
- ⚠️ Hardcoded `#d4edda`, `#c3e6cb` (řádky 200, 202)
- ⚠️ Hardcoded `#f8d7da`, `#f5c6cb` (řádky 207, 209)

**Nesoulad:** Mnoho hardcoded hodnot místo tokenů, ale také dobré použití tokenů na mnoha místech.

---

## 7. Shrnutí zjištění

### ✅ Pozitivní zjištění

1. **Pořadí @import je správné** - `style.css` odpovídá dokumentaci
2. **Všechny soubory existují** - žádné chybějící soubory
3. **Struktura podsložek je správná** - dokumentace odpovídá skutečnosti
4. **Většina hlavních tříd je v dokumentaci** - slovník je poměrně kompletní
5. **Tokeny jsou správně definovány** - `tokens.css` odpovídá dokumentaci
6. **Některé soubory dobře používají tokeny** - `card.css`, `features.css`, `pricing.css` jsou příklady dobré praxe

### ❌ Kritické problémy

1. **Nedefinovaný token `--color-text`**
   - Používá se v `cookie-banner.css` (řádky 15, 87)
   - Není definován v `tokens.css`
   - **Doporučení:** Přidat do `tokens.css` nebo nahradit za `var(--color-text-dark)`

### ⚠️ Problémy nalezené

1. **Mnoho hardcoded hodnot místo tokenů** (~125 výskytů):
   - `#ffffff` místo `var(--color-background-white)`
   - `rgba(124,168,224,...)` místo `rgba(var(--color-primary-light-rgb), ...)`
   - `rgba(20,30,60,...)` místo tokenu pro stíny
   - `rgba(37,211,102,...)` místo tokenu pro WhatsApp
   - `rgba(255,255,255,...)` místo `rgba(var(--color-white-rgb), ...)`

2. **Chybějící třídy v dokumentaci** (12 tříd):
   - `.hero-section`, `.hero-content`
   - `.features-list`, `.feature-item`
   - `.glass-effect`, `.glass-effect-small`, `.glass-readable`, `.glass-text-contrast`
   - `.cookie-banner__text`, `.cookie-banner__link`, `.cookie-banner__actions`
   - `.open` (pro custom select)

3. **Nepoužívané tokeny** (2 tokeny):
   - `--color-background-offwhite` - definován, ale nepoužíván
   - `--mobile-menu-gap` - definován, ale nepoužíván
   - **Status:** ✅ Dokumentace to správně uvádí

### 📋 Doporučené opravy

**Priorita: Vysoká:**
1. **Opravit nedefinovaný token `--color-text`** v `cookie-banner.css`:
   - Buď přidat `--color-text` do `tokens.css`
   - Nebo nahradit `var(--color-text)` za `var(--color-text-dark)` v `cookie-banner.css`

**Priorita: Střední:**
2. **Přidat chybějící třídy do `kb/11_slovnik_pojmu.md`** (12 tříd)

**Priorita: Nízká (refaktoring):**
3. **Nahradit hardcoded hodnoty tokeny** (~125 výskytů):
   - Vytvořit nové tokeny: `--color-white-rgb`, `--color-whatsapp-rgb`, `--shadow-color-rgb`, `--color-placeholder`
   - Nahradit hardcoded hodnoty za tokeny
   - Aktualizovat `kb/07_tema_a_tokeny.md` s novými tokeny

---

## 8. Závěr

**Celkové hodnocení:** Dokumentace CSS je v **dobrém stavu**, ale kód obsahuje **mnoho hardcoded hodnot místo tokenů** a **jednu kritickou chybu** (nedefinovaný token).

**Nalezené problémy:**
- **1 kritická chyba:** Nedefinovaný token `--color-text`
- **~125 hardcoded hodnot** místo tokenů
- **12 chybějících tříd** v dokumentaci

**Priorita oprav:**
1. **Vysoká:** Opravit nedefinovaný token `--color-text`
2. **Střední:** Přidat chybějící třídy do slovníku
3. **Nízká:** Refaktoring hardcoded hodnot na tokeny (volitelné, zlepší konzistenci)

**Odhadovaný čas na opravy:**
- Kritická chyba: 5 minut
- Přidání tříd do slovníku: 15-20 minut
- Refaktoring hardcoded hodnot: 2-3 hodiny (volitelné)
