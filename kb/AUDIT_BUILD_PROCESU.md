# Audit Build procesu - Lesktop Project

**Datum auditu:** 2025-01-XX  
**Soubory kontrolované:** `package.json`, `/tools/*`  
**Dokumentace kontrolovaná:** `kb/02_hlavni_soubory.md`, `kb/12_architektura_systemu.md`

---

## 1. Build skripty v package.json

### ✅ NPM skripty v package.json

**Skutečné skripty v `package.json` (řádky 5-9):**
```json
{
  "build:css": "node tools/build-css.mjs",
  "build:js": "node tools/build-js.mjs",
  "build:static": "node tools/copy-static.mjs",
  "build": "npm run build:css && npm run build:js && npm run build:static"
}
```

**Dokumentace `kb/12_architektura_systemu.md` (řádky 115-119) uvádí:**
- `npm run build:css` - build CSS ✓
- `npm run build:js` - build JS ✓
- `npm run build:static` - kopírování statických souborů ✓
- `npm run build` - všechny tři kroky sekvenčně ✓

**Dokumentace `kb/02_hlavni_soubory.md` (řádek 51) uvádí:**
- `build:css` (spouští build-css.mjs) ✓
- `build:js` (spouští build-js.mjs) ✓
- `build:static` (spouští copy-static.mjs) ✓
- `build` (spouští všechny tři předchozí skripty postupně) ✓

### ⚠️ Nesoulady v build skriptech

**Žádné nesoulady.** Všechny skripty odpovídají dokumentaci. ✓

---

## 2. Build skripty v tools/

### ✅ build-css.mjs

**Skutečnost:**
- **Vstup:** `/assets/css/style.css` (řádek 8)
- **Výstup:** `/dist/assets/css/style.min.css` (řádek 10)
- **PostCSS s postcss-import:** `atImport()` (řádek 28)
- **cssnano:** `cssnano({ preset: 'default' })` (řádek 29)
- **Source map:** Generuje `.map` soubor pokud je dostupný (řádky 37-39)
- **Error handling:** Try-catch pro čtení souboru (řádky 21-25), catch pro main (řádky 43-46)

**Dokumentace `kb/12_architektura_systemu.md` (řádky 101-105) uvádí:**
- Vstup: `/assets/css/style.css` ✓
- PostCSS s `postcss-import` (řeší `@import`) ✓
- cssnano pro minifikaci ✓
- Výstup: `/dist/assets/css/style.min.css` ✓

**Dokumentace `kb/02_hlavni_soubory.md` (řádek 47) uvádí:**
- `build-css.mjs` pro build CSS ✓

### ⚠️ Nesoulady v build-css.mjs

**Chybějící dokumentace:**
1. **Source map generování** není zmíněno v dokumentaci (řádky 37-39)
2. **Fallback pro chybějící style.css** není zmíněn v dokumentaci (řádky 19-25)
3. **Komentář o PurgeCSS** není zmíněn v dokumentaci (řádky 32-33)

### ✅ build-js.mjs

**Skutečnost:**
- **Vstup:** `/assets/js/main.js` (řádek 7)
- **Výstup:** `/dist/assets/js/main.min.js` (řádek 15)
- **Bundling:** `bundle: true` (řádek 12)
- **Minifikace:** `minify: true` (řádek 13)
- **Source map:** `sourcemap: false` (řádek 14)
- **Target:** `target: ['es2018']` (řádek 16)
- **Format:** `format: 'iife'` (řádek 17)
- **Error handling:** Catch pro main (řádky 23-26)

**Dokumentace `kb/12_architektura_systemu.md` (řádky 107-110) uvádí:**
- Vstup: `/assets/js/main.js` ✓
- esbuild: bundling, minifikace, target ES2018, format IIFE ✓
- Výstup: `/dist/assets/js/main.min.js` ✓

**Dokumentace `kb/02_hlavni_soubory.md` (řádek 47) uvádí:**
- `build-js.mjs` pro build JavaScript ✓

### ⚠️ Nesoulady v build-js.mjs

**Chybějící dokumentace:**
1. **Source map je vypnutý** (`sourcemap: false`) není zmíněno v dokumentaci (řádek 14)

### ✅ copy-static.mjs

**Skutečnost:**
- **Kořenové soubory:** Kopíruje `index.html`, `privacy.html`, `terms.html`, `404.html`, `humans.txt`, `robots.txt`, `favicon.ico`, `site.webmanifest`, `sitemap.xml`, `CNAME`, `.nojekyll` (řádky 42-54)
- **Statické složky:** Kopíruje `images/` a `.well-known/` (řádky 60-62)
- **Přepnutí odkazů v HTML:** Nahrazuje `/assets/css/style.css` → `/assets/css/style.min.css` a `/assets/js/main.js` → `/assets/js/main.min.js` v `index.html`, `privacy.html`, `404.html` (řádky 64-71)
- **Error handling:** Try-catch pro copyFileSafe (řádek 12), replaceInFile (řádky 28-35), catch pro main (řádky 76-79)

**Dokumentace `kb/12_architektura_systemu.md` (řádek 112) uvádí:**
- Kopírování statických souborů do `/dist/` ✓

**Dokumentace `kb/02_hlavni_soubory.md` (řádek 47) uvádí:**
- `copy-static.mjs` pro kopírování statických souborů ✓

### ⚠️ Nesoulady v copy-static.mjs

**Chybějící dokumentace:**
1. **Seznam kopírovaných souborů** není detailně zmíněn v dokumentaci (řádky 42-54)
2. **Přepnutí odkazů na minifikované assety** není zmíněno v dokumentaci (řádky 64-71)
3. **Které HTML soubory se upravují** není zmíněno v dokumentaci (řádek 65 - `index.html`, `privacy.html`, `404.html`, ale ne `terms.html`)

---

## 3. Závislosti v package.json

### ✅ DevDependencies v package.json

**Skutečné závislosti v `package.json` (řádky 11-15):**
```json
{
  "cssnano": "^6.1.2",
  "esbuild": "^0.23.0",
  "postcss": "^8.4.47",
  "postcss-import": "^16.1.0"
}
```

**Dokumentace `kb/12_architektura_systemu.md` (řádek 96) uvádí:**
- Node.js, esbuild, PostCSS, cssnano, postcss-import ✓

**Dokumentace `kb/02_hlavni_soubory.md` (řádek 51) uvádí:**
- devDependencies: cssnano, esbuild, postcss, postcss-import ✓

### ⚠️ Nesoulady v závislostech

**Chybějící dokumentace:**
1. **Verze závislostí** nejsou zmíněny v dokumentaci (pouze názvy balíčků)
2. **Node.js verze** není specifikována v dokumentaci (ani v package.json není `engines`)

---

## 4. Výstupy build procesu

### ✅ CSS výstup

**Skutečnost:**
- **Výstupní soubor:** `/dist/assets/css/style.min.css` (v `build-css.mjs` řádek 10)
- **Source map:** `/dist/assets/css/style.min.css.map` (v `build-css.mjs` řádky 37-39)

**Dokumentace `kb/12_architektura_systemu.md` (řádek 105) uvádí:**
- Výstup: `/dist/assets/css/style.min.css` ✓

**Dokumentace `kb/02_hlavni_soubory.md:**
- Není explicitně zmíněn výstupní soubor

### ⚠️ Nesoulady v CSS výstupu

**Chybějící dokumentace:**
1. **Source map soubor** (`.map`) není zmíněn v dokumentaci

### ✅ JavaScript výstup

**Skutečnost:**
- **Výstupní soubor:** `/dist/assets/js/main.min.js` (v `build-js.mjs` řádek 15)
- **Source map:** Není generován (`sourcemap: false`)

**Dokumentace `kb/12_architektura_systemu.md` (řádek 110) uvádí:**
- Výstup: `/dist/assets/js/main.min.js` ✓

**Dokumentace `kb/02_hlavni_soubory.md:**
- Není explicitně zmíněn výstupní soubor

### ⚠️ Nesoulady v JavaScript výstupu

**Žádné nesoulady.** Výstup odpovídá dokumentaci. ✓

### ✅ Statické soubory výstup

**Skutečnost:**
- **Výstupní adresář:** `/dist/` (v `copy-static.mjs` řádek 6)
- **Kopírované soubory:** Kořenové soubory (index.html, privacy.html, terms.html, 404.html, humans.txt, robots.txt, favicon.ico, site.webmanifest, sitemap.xml, CNAME, .nojekyll) a složky (images/, .well-known/)
- **Upravené HTML soubory:** index.html, privacy.html, 404.html (odkazy na minifikované assety)

**Dokumentace `kb/12_architektura_systemu.md` (řádek 112) uvádí:**
- Kopírování statických souborů do `/dist/` ✓

**Dokumentace `kb/02_hlavni_soubory.md` (řádek 47) uvádí:**
- `copy-static.mjs` pro kopírování statických souborů ✓

### ⚠️ Nesoulady v statických souborech výstupu

**Chybějící dokumentace:**
1. **Detailní seznam kopírovaných souborů** není v dokumentaci
2. **Přepnutí odkazů na minifikované assety** není zmíněno v dokumentaci
3. **Které HTML soubory se upravují** není zmíněno v dokumentaci

---

## 5. Detailní kontroly

### package.json

**Kontrola:**
- ✅ Název: `lesktop-site` (řádek 2)
- ✅ Verze: `0.1.0` (řádek 3)
- ✅ Private: `true` (řádek 4)
- ✅ Skripty: všechny 4 skripty jsou správně definované (řádky 5-9)
- ✅ DevDependencies: všechny 4 závislosti jsou správně definované (řádky 11-15)
- ⚠️ Chybí `engines` field pro specifikaci Node.js verze

**Nesoulad:** Chybí specifikace Node.js verze.

### build-css.mjs

**Kontrola:**
- ✅ Importy: správné (fs, path, postcss, atImport, cssnano) (řádky 1-5)
- ✅ Vstupní soubor: `/assets/css/style.css` (řádek 8)
- ✅ Výstupní adresář: `/dist/assets/css/` (řádek 9)
- ✅ Výstupní soubor: `style.min.css` (řádek 10)
- ✅ PostCSS plugins: atImport(), cssnano() (řádky 28-29)
- ✅ Error handling: try-catch pro čtení souboru, catch pro main (řádky 21-25, 43-46)
- ✅ Source map: generuje pokud je dostupný (řádky 37-39)
- ✅ Fallback: prázdný obsah pokud soubor neexistuje (řádky 19-25)
- ✅ Komentář: PurgeCSS je zmíněn jako volitelný (řádky 32-33)

**Nesoulad:** Žádný kromě chybějící dokumentace.

### build-js.mjs

**Kontrola:**
- ✅ Importy: správné (esbuild, path) (řádky 1-2)
- ✅ Vstupní soubor: `/assets/js/main.js` (řádek 7)
- ✅ Výstupní adresář: `/dist/assets/js/` (řádek 8)
- ✅ Výstupní soubor: `main.min.js` (řádek 15)
- ✅ esbuild konfigurace:
  - `entryPoints: [entry]` (řádek 11) ✓
  - `bundle: true` (řádek 12) ✓
  - `minify: true` (řádek 13) ✓
  - `sourcemap: false` (řádek 14) ✓
  - `target: ['es2018']` (řádek 16) ✓
  - `format: 'iife'` (řádek 17) ✓
- ✅ Error handling: catch pro main (řádky 23-26)

**Nesoulad:** Žádný kromě chybějící dokumentace.

### copy-static.mjs

**Kontrola:**
- ✅ Importy: správné (fs, fssync, path) (řádky 1-3)
- ✅ Výstupní adresář: `/dist/` (řádek 6)
- ✅ Kořenové soubory: správný seznam (řádky 42-54)
- ✅ Statické složky: `images/`, `.well-known/` (řádky 60-62)
- ✅ Přepnutí odkazů: správné nahrazení v HTML souborech (řádky 64-71)
- ✅ Error handling: try-catch pro copyFileSafe, replaceInFile, catch pro main (řádky 12, 28-35, 76-79)
- ⚠️ `terms.html` není v seznamu HTML souborů pro přepnutí odkazů (řádek 65), ale je v seznamu kopírovaných souborů (řádek 45)

**Nesoulad:** `terms.html` se kopíruje, ale odkazy v něm se nepřepínají na minifikované assety.

---

## 6. Shrnutí zjištění

### ✅ Pozitivní zjištění

1. **Build skripty jsou správně definované** - všechny 4 skripty v package.json odpovídají dokumentaci
2. **Závislosti jsou správně definované** - všechny 4 devDependencies odpovídají dokumentaci
3. **CSS build proces je správně implementován** - PostCSS, postcss-import, cssnano
4. **JavaScript build proces je správně implementován** - esbuild s bundling, minifikací, target ES2018, format IIFE
5. **Statické soubory jsou správně kopírovány** - kořenové soubory a složky
6. **Error handling je implementován** - try-catch bloky ve všech skriptech
7. **Výstupní soubory odpovídají dokumentaci** - `/dist/assets/css/style.min.css`, `/dist/assets/js/main.min.js`

### ⚠️ Chybějící dokumentace

1. **Source map generování** v CSS build není zmíněno
2. **Fallback pro chybějící style.css** není zmíněn
3. **Komentář o PurgeCSS** není zmíněn
4. **Source map je vypnutý** v JS build není zmíněno
5. **Detailní seznam kopírovaných souborů** není v dokumentaci
6. **Přepnutí odkazů na minifikované assety** není zmíněno
7. **Které HTML soubory se upravují** není zmíněno
8. **Verze závislostí** nejsou zmíněny
9. **Node.js verze** není specifikována

### ❌ Problémy nalezené

1. **`terms.html` se kopíruje, ale odkazy v něm se nepřepínají** na minifikované assety (v `copy-static.mjs` řádek 65)
2. **Chybí specifikace Node.js verze** v package.json (`engines` field)

---

## 7. Doporučené opravy

**Priorita: Střední:**

1. **Opravit `copy-static.mjs`:**
   - Přidat `terms.html` do seznamu HTML souborů pro přepnutí odkazů (řádek 65)

2. **Přidat `engines` do `package.json`:**
   - Specifikovat minimální Node.js verzi (např. `"node": ">=18.0.0"`)

**Priorita: Nízká (dokumentace):**

3. **Aktualizovat `kb/12_architektura_systemu.md`:**
   - Přidat informaci o source map generování v CSS build
   - Přidat informaci o fallback pro chybějící style.css
   - Přidat informaci o PurgeCSS komentáři
   - Přidat informaci o source map vypnutém v JS build
   - Přidat detailní seznam kopírovaných souborů
   - Přidat informaci o přepnutí odkazů na minifikované assety
   - Přidat informaci o tom, které HTML soubory se upravují
   - Přidat verze závislostí
   - Přidat specifikaci Node.js verze

4. **Aktualizovat `kb/02_hlavni_soubory.md`:**
   - Přidat informaci o výstupních souborech
   - Přidat detailní popis build procesu

---

## 8. Závěr

**Celkové hodnocení:** Build proces je v **dobrém stavu**. Všechny skripty jsou správně implementované a odpovídají dokumentaci. Nalezeny jsou **2 problémy** (chybějící `terms.html` v přepnutí odkazů, chybějící `engines` field) a **9 chybějících informací v dokumentaci**.

**Nalezené problémy:**
- **1 problém v kódu:** `terms.html` se nepřepíná na minifikované assety
- **1 problém v konfiguraci:** Chybí specifikace Node.js verze
- **9 chybějících informací v dokumentaci**

**Priorita oprav:**
1. **Střední:** Opravit `terms.html` v copy-static.mjs, přidat `engines` do package.json
2. **Nízká:** Doplňující informace do dokumentace (volitelné)

**Odhadovaný čas na opravy:**
- Oprava `terms.html`: 2 minuty
- Přidání `engines`: 1 minuta
- Aktualizace dokumentace: 15-20 minut (volitelné)
