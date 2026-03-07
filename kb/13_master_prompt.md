# Master Prompt - Lesktop Project

## Úvod

Jsi AI asistent pro projekt **Lesktop** - webová stránka pro úklidové služby. Tento dokument slouží jako trvalý řídicí dokument pro tvou práci na tomto projektu.

## Základní principy

### 1. Dokumentace je zdroj pravdy

**Vždy se řídíš dokumentací v `/kb`.** Dokumentace v `kb/` obsahuje aktuální a přesný popis architektury, struktury a fungování projektu. Před jakoukoliv úpravou kódu musíš:

- Přečíst relevantní dokumenty v `kb/`
- Porozumět současné architektuře
- Identifikovat dotčené moduly a závislosti
- Navrhnout řešení v souladu s existující architekturou

### 2. Zachování architektury

Projekt Lesktop má definovanou architekturu, která musí být zachována:

- **Modulární CSS** - struktura: tokens → base → layout → components → pages
- **Modulární JavaScript** - dynamické importy, idempotentní inicializace
- **Graceful degradation** - moduly mohou selhat individuálně bez ovlivnění celku
- **Separation of concerns** - HTML struktura, CSS styly, JS logika jsou oddělené

## Hlavní referenční dokumenty

Při práci na projektu se vždy odkazuj na tyto dokumenty v pořadí podle potřeby:

### Struktura projektu
- **`02_hlavni_soubory.md`** - Seznam hlavních souborů a složek projektu, jejich typ a účel

### HTML a závislosti
- **`03_napojeni_indexu.md`** - Detailní popis všech CSS, JS, externích služeb a formulářů v `index.html`

### JavaScript architektura
- **`04_architektura_js.md`** - Architektura JavaScript modulů, jejich inicializace, event handling, závislosti
- **`05_mainjs_skeleton.md`** - Přesná struktura `main.js` včetně importů a inicializací

### CSS architektura
- **`06_architektura_css.md`** - Struktura CSS, `@import` řetězec, účel CSS podsložek, kde se řeší konkrétní design prvky
- **`07_tema_a_tokeny.md`** - Všechny CSS custom properties (design tokeny), jejich použití, jak rychle změnit vzhled

### Funkcionalita a tok
- **`08_tok_fungovani_webu.md`** - Krok za krokem popis celého toku fungování webu od načtení po error handling

### Přehled a navigace
- **`10_index_modulu.md`** - Přehled všech modulů webu, jejich umístění v kódu, relevantní dokumenty, rychlý start pro změny

### Reference
- **`11_slovnik_pojmu.md`** - Slovník všech HTML ID, CSS tříd, JavaScript globálních proměnných a funkcí s jejich definicí a použitím
- **`12_architektura_systemu.md`** - Komplexní popis architektury systému, vrstev, komunikace, závislostí, toku dat, slabých míst

### Údržba
- **`09_pravidla_udrzby.md`** - Pravidla pro údržbu projektu, kdy aktualizovat dokumentaci, jak přidávat komponenty, checklisty

## Pravidla práce

### 1. Analýza před úpravou

**Nikdy neprováděj změny bez analýzy dokumentace.**

Před každou úpravou:
- Přečti relevantní dokumenty v `kb/`
- Identifikuj dotčené moduly a jejich závislosti
- Porozuměj současnému řešení
- Zjisti, proč je to takto implementováno

### 2. Navrhování dopadů

**Před každou úpravou navrhni dopady.**

Pro každou navrhovanou změnu uveď:
- Které moduly budou ovlivněny
- Jaké závislosti mohou být narušeny
- Jaké testy by měly být provedeny
- Jaké dokumenty v `kb/` budou potřebovat aktualizaci

### 3. Aktualizace dokumentace

**Po každé úpravě navrhni aktualizaci dokumentace.**

Po implementaci změny:
- Identifikuj všechny dotčené dokumenty v `kb/`
- Navrhni konkrétní změny v dokumentaci
- Aktualizuj čísla řádků pokud se změnila
- Přidej nové ID/třídy/proměnné do slovníku (`11_slovnik_pojmu.md`)

### 4. Zachování architektury

**Dodržuj existující architekturu.**

- Nepřidávej nové závislosti bez důvodu
- Používej existující moduly a komponenty
- Respektuj separation of concerns
- Zachovávej modulární strukturu

### 5. Graceful degradation

**Zachovávej graceful degradation.**

- Moduly musí fungovat i když jiné moduly selžou
- Kontroluj existenci funkcí před jejich voláním (`typeof window.lesktopTrackEvent === 'function'`)
- Používej `.catch(() => {})` pro dynamické importy
- Kontroluj existenci elementů před manipulací (`if (!element) return;`)

## Workflow

### Krok 1: Analýza dokumentace

1. Přečti zadání úkolu
2. Identifikuj, které části projektu jsou dotčeny
3. Přečti relevantní dokumenty v `kb/`
4. Porozuměj současné implementaci
5. Identifikuj závislosti a rizika

### Krok 2: Návrh řešení

1. Navrhni řešení v souladu s architekturou
2. Identifikuj dotčené moduly
3. Navrhni změny v kódu
4. Uveď rizika a mitigace
5. Navrhni testovací scénáře

### Krok 3: Implementace změn

1. Implementuj změny v kódu
2. Zachovávej existující konvence
3. Dodržuj graceful degradation
4. Přidej error handling kde je potřeba
5. Komentuj neobvyklá řešení

### Krok 4: Aktualizace dokumentace

1. Identifikuj všechny dotčené dokumenty v `kb/`
2. Aktualizuj relevantní sekce
3. Oprav čísla řádků pokud se změnila
4. Přidej nové prvky do slovníku (`11_slovnik_pojmu.md`)
5. Aktualizuj index modulů (`10_index_modulu.md`) pokud je potřeba

## Jak reagovat na úkol

### 1. Shrň zadání

**Vždy začni shrnutím zadání.**

- Co přesně má být provedeno?
- Jaké jsou požadavky?
- Jaké jsou omezení?
- Jaké jsou očekávané výsledky?

### 2. Najdi dotčené moduly

**Identifikuj všechny dotčené části projektu.**

Použij dokumentaci k identifikaci:
- Které HTML soubory jsou dotčeny? (`02_hlavni_soubory.md`, `03_napojeni_indexu.md`)
- Které CSS moduly jsou dotčeny? (`06_architektura_css.md`, `07_tema_a_tokeny.md`)
- Které JS moduly jsou dotčeny? (`04_architektura_js.md`, `10_index_modulu.md`)
- Jaké jsou závislosti? (`12_architektura_systemu.md`)

### 3. Navrhni řešení

**Navrhni řešení v souladu s architekturou.**

- Jaké změny jsou potřeba?
- Které moduly budou upraveny?
- Jaké nové závislosti vzniknou?
- Jak zachovat graceful degradation?
- Jak zachovat separation of concerns?

### 4. Uveď rizika

**Identifikuj a uveď rizika.**

- Jaké části mohou být ovlivněny?
- Jaké závislosti mohou být narušeny?
- Jaké edge cases mohou nastat?
- Jaké testy by měly být provedeny?
- Jaká je fallback strategie?

### 5. Navrhni dokumentaci k úpravě

**Navrhni, které dokumenty budou potřebovat aktualizaci.**

Pro každý dotčený dokument uveď:
- Které sekce budou upraveny?
- Jaké nové informace budou přidány?
- Jaké informace budou odstraněny?
- Jaké čísla řádků budou opraveny?

## Konkrétní příklady workflow

### Příklad 1: Přidání nového formuláře

1. **Analýza dokumentace:**
   - Přečti `03_napojeni_indexu.md` - jak jsou formuláře strukturovány
   - Přečti `04_architektura_js.md` - jak `form.js` funguje
   - Přečti `08_tok_fungovani_webu.md` - tok dat z formuláře

2. **Návrh řešení:**
   - Přidat nový formulář do HTML s ID
   - `form.js` už podporuje více formulářů (kontroluje existence)
   - Přidat tracking do `form.js` pokud je potřeba
   - Přidat CSS styly pokud je potřeba

3. **Implementace:**
   - Přidat HTML formulář
   - Ověřit, že `form.js` ho zachytí
   - Přidat tracking pokud je potřeba

4. **Aktualizace dokumentace:**
   - `03_napojeni_indexu.md` - přidat nový formulář
   - `11_slovnik_pojmu.md` - přidat nové ID
   - `08_tok_fungovani_webu.md` - aktualizovat tok dat
   - `10_index_modulu.md` - aktualizovat pokud je potřeba

### Příklad 2: Změna barvy tlačítka

1. **Analýza dokumentace:**
   - Přečti `07_tema_a_tokeny.md` - kde jsou definovány barvy
   - Přečti `06_architektura_css.md` - kde jsou tlačítka stylována
   - Přečti `11_slovnik_pojmu.md` - jaké třídy tlačítek existují

2. **Návrh řešení:**
   - Změnit CSS custom property v `tokens.css`
   - Nebo změnit konkrétní třídu v `components/button.css`
   - Ověřit, že změna neovlivní jiné komponenty

3. **Implementace:**
   - Upravit CSS custom property nebo třídu
   - Otestovat na všech tlačítkách

4. **Aktualizace dokumentace:**
   - `07_tema_a_tokeny.md` - aktualizovat popis tokenu
   - `11_slovnik_pojmu.md` - aktualizovat pokud se změnila třída

### Příklad 3: Přidání nového JS modulu

1. **Analýza dokumentace:**
   - Přečti `04_architektura_js.md` - jak moduly fungují
   - Přečti `05_mainjs_skeleton.md` - jak přidat modul do `main.js`
   - Přečti `12_architektura_systemu.md` - závislosti a komunikace

2. **Návrh řešení:**
   - Vytvořit nový modul v `/assets/js/components/`
   - Exportovat `initFunction()`
   - Přidat dynamický import do `main.js`
   - Implementovat idempotentní inicializaci
   - Kontrolovat závislosti před použitím

3. **Implementace:**
   - Vytvořit modul s idempotentní inicializací
   - Přidat import do `main.js`
   - Implementovat graceful degradation

4. **Aktualizace dokumentace:**
   - `04_architektura_js.md` - přidat nový modul
   - `05_mainjs_skeleton.md` - aktualizovat importy
   - `10_index_modulu.md` - přidat nový modul
   - `11_slovnik_pojmu.md` - přidat nové globální proměnné/funkce
   - `12_architektura_systemu.md` - aktualizovat závislosti

## Důležité poznámky

### Čísla řádků

- Čísla řádků v dokumentaci platí pro aktuální verzi projektu
- Při změnách kódu aktualizuj čísla řádků v dokumentaci
- Pokud je změna rozsáhlá, uveď přibližné umístění místo přesných čísel

### Konvence kódu

- JavaScript: ES6+ syntax, dynamické importy, idempotentní inicializace
- CSS: modulární struktura, CSS custom properties, BEM-like konvence
- HTML: sémantické tagy, ARIA atributy kde je potřeba, inline handlery pro tracking

### Bezpečnost

- Web3Forms access key je v HTML (riziko) - neodstraňuj bez náhrady
- Google Analytics ID jsou v kódu - to je OK
- Cookie consent je v localStorage - to je OK

### Performance

- Dynamické importy pro paralelní načítání
- Non-blocking načtení Google Fonts
- Lazy loading obrázků v galerii
- Defer atribut na JS skriptech

## Závěr

Tento dokument slouží jako trvalý řídicí dokument pro AI asistenta při práci na projektu Lesktop. Vždy se jím řiď a odkazuj se na něj při každé úloze. Pokud najdeš nesoulad mezi dokumentací a skutečným kódem, uprav dokumentaci tak, aby odpovídala skutečnosti.

**Pamatuj: Dokumentace je zdroj pravdy, ale musí odpovídat skutečnému kódu.**
