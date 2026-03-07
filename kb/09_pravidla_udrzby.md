# Pravidla údržby projektu

## 1. Kdy aktualizovat dokumentaci

Aktualizuj dokumentaci v `kb/` vždy, když:

- **Měníš strukturu HTML** - přidáváš/odebíráš sekce, formuláře, elementy
- **Měníš CSS** - přidáváš/upravuješ styly, komponenty, layout
- **Měníš JavaScript** - přidáváš/upravuješ moduly, funkce, event handlery
- **Měníš formuláře** - přidáváš/odebíráš inputy, měníš action, měníš validaci
- **Měníš assety** - přidáváš/odebíráš obrázky, ikony, fonty
- **Měníš build proces** - upravuješ `package.json`, build skripty
- **Měníš externí služby** - měníš API endpointy, tracking kódy, CDN odkazy

**NEAKTUALIZUJ dokumentaci při:**
- Opravě chyb (typy, překlepy)
- Refaktoringu bez změny funkcionality
- Optimalizaci výkonu bez změny API

Za aktualizaci dokumentace odpovídá autor změny.

## 2. Který soubor aktualizovat při jakém typu změny

### Změny v HTML (`index.html`, `privacy.html`, `terms.html`, `404.html`)

**Aktualizuj:**
- `02_hlavni_soubory.md` - pokud přidáváš/odebíráš HTML soubory
- `03_napojeni_indexu.md` - pokud měníš:
  - CSS/JS soubory načítané v HTML
  - Formuláře (struktura, inputy, action)
  - JSON-LD strukturovaná data
  - Externí služby (API, CDN, tracking)

### Změny v CSS (`/assets/css/`)

**Aktualizuj:**
- `02_hlavni_soubory.md` - pokud přidáváš/odebíráš CSS soubory nebo podsložky
- `06_architektura_css.md` - pokud měníš:
  - Strukturu importů v `style.css`
  - Organizaci podsložek
  - Komponenty, layout, base styly
- `07_tema_a_tokeny.md` - pokud měníš:
  - Design tokeny v `tokens.css`
  - CSS custom properties
- `03_napojeni_indexu.md` - pokud měníš CSS soubory načítané v HTML

### Změny v JavaScript (`/assets/js/`)

**Aktualizuj:**
- `02_hlavni_soubory.md` - pokud přidáváš/odebíráš JS soubory
- `04_architektura_js.md` - pokud měníš:
  - Moduly v `components/` nebo `pages/`
  - Funkcionalitu modulů
  - Event handlery
  - Závislosti mezi moduly
- `05_mainjs_skeleton.md` - pokud měníš:
  - Importy v `main.js`
  - Pořadí inicializace
  - DOMContentLoaded listener
- `08_tok_fungovani_webu.md` - pokud měníš:
  - Tok fungování webu
  - Inicializaci modulů
  - Chybové stavy
- `03_napojeni_indexu.md` - pokud měníš JS soubory načítané v HTML

### Změny ve formulářích

**Aktualizuj:**
- `03_napojeni_indexu.md` - struktura formulářů, inputy, action
- `08_tok_fungovani_webu.md` - tok odeslání, validace, chyby
- `04_architektura_js.md` - pokud měníš `form.js` modul
- `06_architektura_css.md` - pokud měníš `form.css`

### Změny v assety (`images/`, `before-after/`)

**Aktualizuj:**
- `02_hlavni_soubory.md` - pokud přidáváš/odebíráš soubory nebo složky
- `08_tok_fungovani_webu.md` - pokud měníš logiku galerie before-after
- `03_napojeni_indexu.md` - pokud měníš načítání assetů v HTML

### Změny v build procesu (`package.json`, `tools/`)

**Aktualizuj:**
- `02_hlavni_soubory.md` - pokud přidáváš/odebíráš build nástroje nebo závislosti
- `kb/changelog.md` - záznam o změně

## 3. Jak přidávat nový modul nebo komponentu

### Nový JavaScript modul

1. **Vytvoř soubor:**
   - Komponenta: `/assets/js/components/nazevModulu.js`
   - Stránková logika: `/assets/js/pages/nazevStrany.js`

2. **Exportuj inicializační funkci:**
   ```javascript
   export function initNazevModulu() {
     // idempotence kontrola
     if (document.documentElement.dataset.nazevModuluInit === '1') return;
     document.documentElement.dataset.nazevModuluInit = '1';
     
     // logika modulu
   }
   ```

3. **Přidej import do `main.js`:**
   ```javascript
   import('./components/nazevModulu.js').then(m => m.initNazevModulu()).catch(() => {});
   ```

4. **Aktualizuj dokumentaci:**
   - `02_hlavni_soubory.md` - přidej nový soubor do seznamu
   - `04_architektura_js.md` - přidej popis modulu (funkcionalita, události, závislosti)
   - `05_mainjs_skeleton.md` - přidej import do seznamu
   - `08_tok_fungovani_webu.md` - přidej do sekce "Co se stane při načtení stránky"
   - `10_index_modulu.md` - přidej nový modul do indexu

### Nová CSS komponenta

1. **Vytvoř soubor:**
   - `/assets/css/components/nazevKomponenty.css`

2. **Přidej import do `style.css`:**
   ```css
   @import url('./components/nazevKomponenty.css');
   ```

3. **Aktualizuj dokumentaci:**
   - `02_hlavni_soubory.md` - přidej nový soubor do seznamu
   - `06_architektura_css.md` - přidej do seznamu importů a popis komponenty
   - `10_index_modulu.md` - pokud je to samostatný modul, přidej ho do indexu

### Nový design token

1. **Přidej do `/assets/css/tokens/tokens.css`:**
   ```css
   :root {
     --nazev-tokenu: hodnota;
   }
   ```

2. **Aktualizuj dokumentaci:**
   - `07_tema_a_tokeny.md` - přidej token do příslušné skupiny s popisem použití

## 4. Jak zapisovat změny do changelogu

Changelog ukládej do souboru: `kb/changelog.md`

### Formát záznamu

```
## [Datum] - Stručný popis změny

**Typ změny:** HTML / CSS / JS / Formulář / Asset / Build / Dokumentace

**Změněné soubory:**
- cesta/k/souboru.js
- cesta/k/souboru.css

**Popis:**
- Co bylo změněno
- Proč to bylo změněno
- Jaké to má dopady

**Aktualizovaná dokumentace:**
- kb/XX_nazev.md
```

### Příklady záznamů

**Malá změna:**
```
## [2025-01-15] - Změna primární barvy

**Typ změny:** CSS

**Změněné soubory:**
- assets/css/tokens/tokens.css

**Popis:**
- Změněna hodnota --color-primary-dark z #3a4768 na #2d3a52
- Důvod: nový brand guideline

**Aktualizovaná dokumentace:**
- kb/07_tema_a_tokeny.md
```

**Větší změna:**
```
## [2025-01-20] - Přidání nového formuláře pro poptávku

**Typ změny:** HTML / JS / CSS

**Změněné soubory:**
- index.html
- assets/js/components/form.js
- assets/css/components/form.css

**Popis:**
- Přidán nový formulář #poptavkaForm v sekci #services
- Nový submit handler v form.js
- Nové CSS styly pro poptávkový formulář
- Tracking konverzí do Google Ads

**Aktualizovaná dokumentace:**
- kb/02_hlavni_soubory.md
- kb/03_napojeni_indexu.md
- kb/04_architektura_js.md
- kb/06_architektura_css.md
- kb/08_tok_fungovani_webu.md
- kb/10_index_modulu.md
```

## 5. Doporučený postup při větší úpravě webu (checklist)

### Před začátkem práce

- [ ] Přečti si relevantní dokumentaci v `kb/` (viz `10_index_modulu.md`)
- [ ] Zjisti, které soubory budou ovlivněny
- [ ] Zkontroluj závislosti mezi moduly (`04_architektura_js.md`)
- [ ] Zkontroluj design tokeny (`07_tema_a_tokeny.md`)

### Během práce

- [ ] Měň kód v produkčních souborech
- [ ] Testuj změny v prohlížeči
- [ ] Ověř, že nefungující moduly neblokují ostatní (graceful degradation)
- [ ] Zkontroluj konzoli pro chyby

### Po dokončení změn

- [ ] **Aktualizuj dokumentaci:**
  - [ ] `02_hlavni_soubory.md` - pokud jsi přidal/odebral soubory
  - [ ] `03_napojeni_indexu.md` - pokud jsi změnil HTML strukturu nebo napojení
  - [ ] `04_architektura_js.md` - pokud jsi změnil JS moduly
  - [ ] `05_mainjs_skeleton.md` - pokud jsi změnil main.js
  - [ ] `06_architektura_css.md` - pokud jsi změnil CSS strukturu
  - [ ] `07_tema_a_tokeny.md` - pokud jsi změnil design tokeny
  - [ ] `08_tok_fungovani_webu.md` - pokud jsi změnil tok fungování
  - [ ] `10_index_modulu.md` - pokud jsi přidal nový modul

- [ ] **Zapiš do changelogu:**
  - [ ] Datum změny
  - [ ] Typ změny
  - [ ] Seznam změněných souborů
  - [ ] Popis změny a důvodu
  - [ ] Seznam aktualizované dokumentace

- [ ] **Otestuj:**
  - [ ] Web funguje v prohlížeči
  - [ ] Formuláře se odesílají
  - [ ] Tracking funguje (pokud je povolen)
  - [ ] Responzivní design funguje
  - [ ] Žádné chyby v konzoli

- [ ] **Build (pokud používáš):**
  - [ ] Spusť `npm run build` (pokud je potřeba)
  - [ ] Ověř, že build prošel bez chyb

### Kontrolní seznam pro konkrétní typy změn

**Přidání nového formuláře:**
- [ ] HTML struktura v `index.html`
- [ ] Submit handler v `form.js`
- [ ] CSS styly v `form.css`
- [ ] Tracking konverzí (pokud je potřeba)
- [ ] Aktualizace dokumentace formulářů

**Změna designu:**
- [ ] Uprav design tokeny v `tokens.css`
- [ ] Ověř, že změny se projevily všude
- [ ] Aktualizace `07_tema_a_tokeny.md`

**Přidání nové sekce:**
- [ ] HTML struktura
- [ ] CSS styly (možná nový soubor v `components/` nebo `layout/`)
- [ ] JavaScript logika (pokud je potřeba)
- [ ] Aktualizace navigace (pokud přidáváš do menu)
- [ ] Aktualizace dokumentace

**Změna API endpointu:**
- [ ] Aktualizace action v formulářích
- [ ] Ověření, že API funguje
- [ ] Aktualizace `03_napojeni_indexu.md` a `08_tok_fungovani_webu.md`
