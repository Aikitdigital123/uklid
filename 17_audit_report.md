# Audit projektu Lesktop

**Datum:** 2025-01-XX
**Verze auditu:** 1.0
**Rozsah:** HTML, Humans.txt, Dokumentace architektury (Partial audit - chybí zdrojové kódy CSS/JS)

## 1. Shrnutí

Projekt má velmi dobře zpracovanou dokumentaci, která přesně odráží strukturu `index.html`. Architektura je modulární a promyšlená (idempotence modulů, graceful degradation).

**Hlavní silné stránky:**
- **Konzistence:** HTML struktura (ID, třídy) přesně odpovídá popisu v `12_architektura_systemu.md`.
- **Tracking:** Implementace trackingu přes `window.lesktopTrackEvent` je robustní a konzistentní napříč HTML.
- **Dokumentace:** Existuje detailní popis architektury i build procesu.

**Největší rizika:**
- **Placeholder data:** Soubor `humans.txt` obsahuje neplatné údaje.
- **Security:** Web3Forms Access Key je veřejně viditelný v HTML (architektonické rozhodnutí, ale riziko spamu).

## 2. Kritické problémy

### 2.1 Placeholder data v produkčním souboru
**Soubor:** `humans.txt`
**Problém:** Obsahuje generické údaje:
```text
Site: https://example.com
```
**Riziko:** Působí neprofesionálně a může mást boty/crawlery.
**Řešení:** Změnit na `https://lesktop.cz`.

## 3. Dokumentační nesoulady

### 3.1 HTML vs Architektura
**Stav:** ✅ V pořádku.
- Všechna ID sekcí (`#about`, `#services`, `#pricing`, `#contact`) v `index.html` odpovídají dokumentaci.
- Formuláře `#kalkulacka` a `#contactForm` jsou správně popsány.
- Inline handlery pro tracking (řádky 144-147, 171 atd.) přesně odpovídají popisu v `12_architektura_systemu.md`.

### 3.2 Build Proces
**Stav:** ⚠️ Částečný nesoulad (převzato z `AUDIT_BUILD_PROCESU.md`).
- V `copy-static.mjs` se kopíruje `terms.html`, ale nedochází v něm k přepsání odkazů na minifikované assety, což může vést k načítání neoptimalizovaných souborů na produkci.
- V `package.json` chybí specifikace verze Node.js (`engines`), což je v rozporu s best practices v dokumentaci.

## 4. Technický dluh

### 4.1 Inline JavaScript v HTML
**Soubor:** `index.html`
**Kód:**
```html
onclick="window.lesktopTrackEvent && window.lesktopTrackEvent(...)"
```
**Popis:** Ačkoliv je toto v dokumentaci popsáno jako zamýšlené chování pro tracking, `14_development_playbook.md` označuje inline JS jako "Anti-pattern".
**Doporučení:** Do budoucna zvážit přesun trackingu do `enhancedTracking.js` pomocí data atributů (např. `data-track-click="nav_o_nas"`), aby bylo HTML čistší.

### 4.2 Web3Forms Key
**Soubor:** `index.html` (řádek 280, 462)
**Popis:** Access key `4e724eab-1a15-4f9c-9c19-caa25c2b95fc` je veřejný.
**Riziko:** Možnost zneužití pro spamování schránky klienta.
**Doporučení:** Pokud to backend Web3Forms umožňuje, omezit doménu (CORS/Referer) pouze na `lesktop.cz`.

## 5. Doporučené kroky

**Priorita: Vysoká (Ihned)**
1. **Opravit `humans.txt`:** Nahradit `example.com` za `lesktop.cz`.
2. **Opravit build proces:** Zajistit, aby se v `terms.html` přepisovaly odkazy na `.min.css` a `.min.js`.

**Priorita: Střední**
1. **Doplnit `engines` do `package.json`:** Definovat minimální verzi Node.js.
2. **Audit CSS/JS kódů:** Provést fyzickou kontrolu souborů `/assets/`, jakmile budou k dispozici pro audit (nyní kontrolováno jen dle dokumentace).

**Priorita: Nízká**
1. **Refactoring trackingu:** Zvážit odstranění inline `onclick` atributů ve prospěch `data-*` atributů a globálního listeneru.