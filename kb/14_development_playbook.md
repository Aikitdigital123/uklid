# Development Playbook – Lesktop Project

## 1. Úvod

### Pro koho je dokument

Tento dokument je určen pro:
- Vývojáře pracující na projektu Lesktop
- AI asistenty spolupracující na projektu
- Každého, kdo provádí změny v kódu

### Vztah k Master Prompt

Tento playbook je praktickým doplňkem k `kb/13_master_prompt.md`:
- **Master Prompt** definuje principy a workflow pro AI asistenta
- **Development Playbook** poskytuje konkrétní kroky a postupy pro vývoj

Oba dokumenty se vzájemně doplňují a měly by být používány společně.

### Proč je důležité ho dodržovat

- **Konzistence** - zajišťuje jednotný přístup k vývoji
- **Kvalita** - minimalizuje chyby a technický dluh
- **Údržba** - usnadňuje budoucí práci na projektu
- **Dokumentace** - zajišťuje synchronizaci kódu a dokumentace
- **Bezpečnost** - předchází bezpečnostním rizikům

## 2. Typy změn

### Malé úpravy (texty, barvy, drobné styly)

**Příklady:**
- Změna textu v HTML
- Úprava barvy v `tokens.css`
- Drobné CSS úpravy (padding, margin, font-size)

**Postup:**
1. Otevři relevantní soubor
2. Proveď změnu
3. Otestuj lokálně
4. Aktualizuj dokumentaci pouze pokud:
   - Měníš design token (`07_tema_a_tokeny.md`)
   - Měníš CSS třídu (`11_slovnik_pojmu.md`)
   - Měníš strukturu HTML (`03_napojeni_indexu.md`)

**Časová náročnost:** 5-15 minut

### Funkční změny (formuláře, JS logika)

**Příklady:**
- Přidání/odebrání inputu ve formuláři
- Změna validace formuláře
- Úprava JS logiky v modulu
- Přidání event handleru

**Postup:**
1. Přečti relevantní dokumentaci:
   - `04_architektura_js.md` - pro JS změny
   - `03_napojeni_indexu.md` - pro formuláře
   - `08_tok_fungovani_webu.md` - pro tok dat
2. Identifikuj dotčené moduly a závislosti
3. Navrhni řešení v souladu s architekturou
4. Implementuj změnu
5. Otestuj funkčnost
6. Aktualizuj dokumentaci:
   - `03_napojeni_indexu.md` - pokud měníš formulář
   - `04_architektura_js.md` - pokud měníš JS modul
   - `11_slovnik_pojmu.md` - pokud přidáváš ID/třídy/proměnné
   - `08_tok_fungovani_webu.md` - pokud měníš tok dat

**Časová náročnost:** 30-120 minut

### Nové moduly

**Příklady:**
- Nový JS modul v `/assets/js/components/`
- Nová CSS komponenta
- Nová sekce na stránce

**Postup:**
1. Přečti `04_architektura_js.md` a `06_architektura_css.md`
2. Navrhni strukturu modulu v souladu s architekturou
3. Implementuj modul s idempotentní inicializací
4. Přidej import do `main.js` (pro JS) nebo `style.css` (pro CSS)
5. Otestuj funkčnost a graceful degradation
6. Aktualizuj dokumentaci:
   - `02_hlavni_soubory.md` - přidat nový soubor
   - `04_architektura_js.md` nebo `06_architektura_css.md` - popsat modul
   - `10_index_modulu.md` - přidat do indexu
   - `11_slovnik_pojmu.md` - přidat nové ID/třídy/proměnné
   - `12_architektura_systemu.md` - aktualizovat závislosti

**Časová náročnost:** 2-4 hodiny

### Refaktoring

**Příklady:**
- Přesunutí kódu mezi moduly
- Optimalizace výkonu
- Zlepšení čitelnosti kódu
- Odstranění duplikací

**Postup:**
1. Přečti relevantní dokumentaci
2. Identifikuj všechny dotčené části
3. Navrhni refaktoring s zachováním funkcionality
4. Implementuj změny
5. Otestuj, že funkcionalita zůstala stejná
6. Aktualizuj dokumentaci:
   - Oprav čísla řádků pokud se změnila
   - Aktualizuj popisy pokud se změnila struktura
   - Aktualizuj závislosti pokud se změnily

**Časová náročnost:** 1-3 hodiny

### Bezpečnostní změny

**Příklady:**
- Oprava XSS zranitelnosti
- Zabezpečení formulářů
- Změna access key
- Aktualizace závislostí

**Postup:**
1. Identifikuj bezpečnostní riziko
2. Navrhni řešení
3. Implementuj změnu
4. Otestuj bezpečnostní fix
5. Aktualizuj dokumentaci:
   - `03_napojeni_indexu.md` - pokud měníš access key
   - `12_architektura_systemu.md` - pokud měníš bezpečnostní konfiguraci
6. Zvaž aktualizaci `09_pravidla_udrzby.md` pokud jde o nový postup

**Časová náročnost:** 1-4 hodiny

### Výkonnostní optimalizace

**Příklady:**
- Optimalizace obrázků
- Lazy loading
- Code splitting
- Minifikace

**Postup:**
1. Identifikuj výkonnostní problém
2. Změř současný výkon
3. Navrhni optimalizaci
4. Implementuj změnu
5. Změř zlepšení
6. Aktualizuj dokumentaci pouze pokud:
   - Měníš build proces (`02_hlavni_soubory.md`)
   - Měníš architekturu (`12_architektura_systemu.md`)

**Časová náročnost:** 1-3 hodiny

## 3. Standardní vývojový cyklus (End-to-End)

### Krok 1: Analýza

**Cíle:**
- Porozumět požadavku
- Identifikovat dotčené části projektu
- Zjistit závislosti a rizika

**Aktivity:**
1. Přečti zadání úkolu
2. Přečti relevantní dokumentaci v `kb/`:
   - `13_master_prompt.md` - pro principy
   - `10_index_modulu.md` - pro přehled modulů
   - Specifické dokumenty podle typu změny
3. Identifikuj dotčené soubory a moduly
4. Zjisti závislosti mezi moduly
5. Identifikuj potenciální rizika

**Výstup:** Analýza s identifikovanými dotčenými částmi a riziky

### Krok 2: Návrh

**Cíle:**
- Navrhnout řešení v souladu s architekturou
- Identifikovat všechny potřebné změny
- Naplánovat testování

**Aktivity:**
1. Navrhni řešení v souladu s architekturou
2. Identifikuj všechny soubory, které budou upraveny
3. Navrhni změny v kódu
4. Identifikuj, které dokumenty v `kb/` budou potřebovat aktualizaci
5. Navrhni testovací scénáře
6. Zvaž graceful degradation

**Výstup:** Návrh řešení s plánem změn a testování

### Krok 3: Implementace

**Cíle:**
- Implementovat změny v kódu
- Zachovat konvence a architekturu
- Přidat error handling

**Aktivity:**
1. Vytvoř branch nebo pracovní kopii
2. Implementuj změny v kódu
3. Dodržuj existující konvence:
   - JavaScript: ES6+, dynamické importy, idempotentní inicializace
   - CSS: modulární struktura, CSS custom properties
   - HTML: sémantické tagy, ARIA atributy
4. Přidej error handling kde je potřeba
5. Implementuj graceful degradation
6. Komentuj neobvyklá řešení

**Výstup:** Implementované změny v kódu

### Krok 4: Testování

**Cíle:**
- Ověřit funkčnost změn
- Otestovat edge cases
- Ověřit graceful degradation

**Aktivity:**
1. Otestuj základní funkcionalitu
2. Otestuj edge cases
3. Otestuj graceful degradation (co když modul selže)
4. Otestuj na různých zařízeních (responzivita)
5. Zkontroluj konzoli pro chyby
6. Otestuj formuláře (pokud jsou dotčeny)
7. Otestuj tracking (pokud je dotčen)

**Výstup:** Testovací výsledky

**Viz sekce 5: Testovací checklist**

### Krok 5: Dokumentace

**Cíle:**
- Aktualizovat dokumentaci v `kb/`
- Synchronizovat kód a dokumentaci
- Zajistit přesnost informací

**Aktivity:**
1. Identifikuj všechny dotčené dokumenty v `kb/`
2. Aktualizuj relevantní sekce:
   - Oprav čísla řádků pokud se změnila
   - Přidej nové informace
   - Odstraň zastaralé informace
3. Přidej nové ID/třídy/proměnné do `11_slovnik_pojmu.md`
4. Aktualizuj `10_index_modulu.md` pokud přidáváš modul
5. Zkontroluj, že dokumentace odpovídá kódu

**Výstup:** Aktualizovaná dokumentace

**Viz sekce 4: Práce s dokumentací**

### Krok 6: Review

**Cíle:**
- Zkontrolovat kvalitu změn
- Ověřit soulad s architekturou
- Zkontrolovat dokumentaci

**Aktivity:**
1. Zkontroluj kód:
   - Soulad s architekturou
   - Konvence kódu
   - Error handling
   - Graceful degradation
2. Zkontroluj dokumentaci:
   - Aktualizace všech dotčených dokumentů
   - Přesnost informací
   - Čísla řádků
3. Zkontroluj testování:
   - Všechny testy prošly
   - Edge cases otestovány
   - Graceful degradation otestována

**Výstup:** Review výsledky

### Krok 7: Release

**Cíle:**
- Bezpečně nasadit změny
- Ověřit funkčnost po nasazení
- Zajistit možnost rollbacku

**Aktivity:**
1. Zkontroluj build (`npm run build`)
2. Proveď finální test
3. Vytvoř zálohu
4. Nasazení změn
5. Smoke test po nasazení
6. Monitoruj chyby

**Výstup:** Nasazené změny

**Viz sekce 6: Release proces**

## 4. Práce s dokumentací

### Kdy aktualizovat kb

**Vždy aktualizuj dokumentaci když:**
- Měníš strukturu HTML (sekce, formuláře, elementy)
- Měníš CSS (styly, komponenty, layout, tokeny)
- Měníš JavaScript (moduly, funkce, event handlery)
- Přidáváš/odebíráš soubory
- Měníš externí služby (API, tracking, CDN)
- Měníš build proces

**NEAKTUALIZUJ dokumentaci když:**
- Opravuješ chyby (typy, překlepy)
- Refaktoruješ bez změny funkcionality
- Optimalizuješ výkon bez změny API

**Viz `09_pravidla_udrzby.md` pro detailní pravidla**

### Jak synchronizovat kód a dokumentaci

**Pravidlo:** Dokumentace musí odpovídat skutečnému kódu.

**Postup:**
1. Po každé změně kódu zkontroluj dokumentaci
2. Aktualizuj relevantní dokumenty
3. Oprav čísla řádků pokud se změnila
4. Přidej nové prvky do slovníku (`11_slovnik_pojmu.md`)
5. Odeber zastaralé informace

**Kontrola synchronizace:**
- Přečti dokumentaci a ověř v kódu
- Přečti kód a ověř v dokumentaci
- Hledej nesoulady

### Jak kontrolovat nesoulad

**Metody kontroly:**
1. **Manuální kontrola:**
   - Přečti dokumentaci a ověř v kódu
   - Přečti kód a ověř v dokumentaci
   - Hledej nesoulady

2. **Kontrola čísel řádků:**
   - Otevři soubor a ověř, že čísla řádků v dokumentaci odpovídají skutečnosti
   - Pokud ne, oprav je

3. **Kontrola ID/tříd/proměnných:**
   - Ověř v `11_slovnik_pojmu.md`, že všechny ID/třídy/proměnné existují v kódu
   - Ověř v kódu, že všechny ID/třídy/proměnné jsou v `11_slovnik_pojmu.md`

4. **Kontrola modulů:**
   - Ověř v `10_index_modulu.md`, že všechny moduly existují v kódu
   - Ověř v kódu, že všechny moduly jsou v `10_index_modulu.md`

### Jak řešit zastaralé info

**Identifikace zastaralých informací:**
1. Přečti dokumentaci a ověř v kódu
2. Hledej nesoulady
3. Identifikuj zastaralé informace

**Řešení:**
1. Pokud je informace zastaralá:
   - Aktualizuj ji podle aktuálního kódu
   - Nebo ji odstraň pokud už není relevantní

2. Pokud je informace chybná:
   - Oprav ji podle aktuálního kódu

3. Pokud chybí informace:
   - Přidej ji do dokumentace

**Priorita:** Vždy uprav dokumentaci tak, aby odpovídala skutečnému kódu.

## 5. Testovací checklist

### UI testování

**Checklist:**
- [ ] Všechny sekce jsou viditelné a správně zobrazené
- [ ] Navigace funguje (smooth scroll, mobilní menu)
- [ ] Tlačítka jsou klikatelná a mají správné styly
- [ ] Obrázky se načítají správně
- [ ] Fonty se načítají správně
- [ ] Glass efekty fungují
- [ ] Animace reveal-on-scroll fungují
- [ ] Back-to-top tlačítko funguje

**Nástroje:** Manuální kontrola v prohlížeči

### Formuláře

**Checklist:**
- [ ] Kalkulační formulář (`#kalkulacka`):
  - [ ] Všechny inputy jsou funkční
  - [ ] Validace funguje
  - [ ] Submit funguje
  - [ ] Status zpráva se zobrazuje
  - [ ] Formulář se resetuje po úspěchu
  - [ ] Chybové zprávy se zobrazují při chybě
- [ ] Kontaktní formulář (`#contactForm`):
  - [ ] Všechny inputy jsou funkční
  - [ ] Validace funguje
  - [ ] Submit funguje
  - [ ] Status zpráva se zobrazuje
  - [ ] Formulář se resetuje po úspěchu
  - [ ] Chybové zprávy se zobrazují při chybě
- [ ] Custom select komponenty fungují
- [ ] Frekvence úklidu se zobrazuje/skryje podle typu úklidu

**Nástroje:** Manuální testování, Network tab v DevTools

### Tracking

**Checklist:**
- [ ] Cookie banner se zobrazuje
- [ ] Souhlas s cookies funguje
- [ ] Google Analytics se načítá po souhlasu
- [ ] Tracking událostí funguje:
  - [ ] Navigační kliky (`nav_click`)
  - [ ] CTA kliky (`cta_click`)
  - [ ] Telefonní kliky (`phone_click`)
  - [ ] Email kliky (`email_click`)
  - [ ] Externí odkazy (`external_link_click`)
  - [ ] Viditelnost sekcí (`section_view`)
  - [ ] Odeslání formulářů (`form_submission`)
  - [ ] Konverze (`conversion`)
- [ ] Tracking funguje i když GA není načteno (graceful degradation)

**Nástroje:** Google Analytics DebugView, Network tab v DevTools, Console

### Responzivita

**Checklist:**
- [ ] Desktop (1920px+)
- [ ] Laptop (1366px - 1919px)
- [ ] Tablet (768px - 1365px)
- [ ] Mobil (320px - 767px)
- [ ] Mobilní menu funguje
- [ ] Obrázky se přizpůsobují
- [ ] Text je čitelný
- [ ] Tlačítka jsou klikatelná

**Nástroje:** DevTools responsive mode, reálná zařízení

### Chyby v konzoli

**Checklist:**
- [ ] Žádné JavaScript chyby
- [ ] Žádné CSS chyby
- [ ] Žádné chyby při načítání externích zdrojů
- [ ] Žádné chyby při načítání modulů
- [ ] Žádné chyby při inicializaci modulů

**Nástroje:** Browser Console, Network tab

### Graceful degradation

**Checklist:**
- [ ] Web funguje i když JavaScript je vypnutý
- [ ] Formuláře fungují i když `form.js` selže
- [ ] Tracking funguje i když `cookieBanner.js` selže
- [ ] Galerie funguje i když `gallery.js` selže
- [ ] Navigace funguje i když `nav.js` selže
- [ ] Reveal animace fungují i když `reveal.js` selže

**Testování:**
- Vypni JavaScript v prohlížeči
- Simuluj chybu modulu (např. throw error v modulu)
- Ověř, že ostatní moduly fungují

## 6. Release proces

### Kontrola buildu

**Aktivity:**
1. Zkontroluj, že `package.json` je aktuální
2. Spusť build: `npm run build`
3. Zkontroluj výstup:
   - `/dist/assets/css/style.min.css` existuje
   - `/dist/assets/js/main.min.js` existuje
   - Statické soubory jsou zkopírovány
4. Zkontroluj, že build neobsahuje chyby

**Kritéria úspěchu:** Build proběhl bez chyb, všechny soubory jsou vytvořeny

### Finální test

**Aktivity:**
1. Otestuj všechny funkce podle testovacího checklistu (sekce 5)
2. Otestuj na různých zařízeních
3. Zkontroluj konzoli pro chyby
4. Otestuj formuláře
5. Otestuj tracking

**Kritéria úspěchu:** Všechny testy prošly

### Nasazení

**Aktivity:**
1. Vytvoř zálohu současné verze
2. Nahraj nové soubory na server
3. Ověř, že soubory jsou nahrané správně
4. Zkontroluj, že cache je vyčištěná (pokud je použita)

**Kritéria úspěchu:** Soubory jsou nahrané, cache je vyčištěná

### Smoke test

**Aktivity:**
1. Otevři web v prohlížeči
2. Zkontroluj, že se stránka načítá
3. Zkontroluj, že CSS se načítá
4. Zkontroluj, že JavaScript se načítá
5. Otestuj základní funkce:
   - Navigace
   - Formuláře
   - Tracking
6. Zkontroluj konzoli pro chyby

**Kritéria úspěchu:** Web funguje, žádné kritické chyby

### Záloha

**Aktivity:**
1. Vytvoř zálohu před nasazením:
   - Záloha všech souborů
   - Záloha databáze (pokud je použita)
   - Záloha konfigurace
2. Ulož zálohu na bezpečné místo
3. Dokumentuj zálohu (datum, čas, verze)

**Kritéria úspěchu:** Záloha je vytvořena a uložena

## 7. Rollback postup

### Co dělat při problému po nasazení

**Okamžité kroky:**
1. Identifikuj problém
2. Zhodnoť závažnost:
   - Kritická chyba (web nefunguje) → okamžitý rollback
   - Vážná chyba (důležitá funkce nefunguje) → rollback do 1 hodiny
   - Menší chyba (kosmetická) → oprava v příštím release
3. Pokud je potřeba rollback, pokračuj podle rollback postupu

### Jak vrátit změny

**Postup:**
1. Zastav nasazení nové verze (pokud ještě probíhá)
2. Obnov zálohu:
   - Nahraj zálohované soubory
   - Obnov zálohovanou databázi (pokud je použita)
   - Obnov zálohovanou konfiguraci
3. Vyčisti cache
4. Ověř, že web funguje
5. Dokumentuj rollback

**Kritéria úspěchu:** Web funguje jako před nasazením

### Jak dokumentovat incident

**Informace k dokumentaci:**
1. **Datum a čas:**
   - Kdy se problém objevil
   - Kdy byl rollback proveden

2. **Popis problému:**
   - Co nefungovalo
   - Jak se problém projevil
   - Kdo problém nahlásil

3. **Příčina:**
   - Co způsobilo problém
   - Jaká změna způsobila problém

4. **Řešení:**
   - Co bylo provedeno
   - Rollback nebo oprava

5. **Prevence:**
   - Co lze udělat, aby se problém neopakoval
   - Jaké testy by měly být přidány

**Formát:** Dokumentuj v issue trackeru nebo v poznámkách k release

## 8. Best practices

### Práce s JS moduly

**Pravidla:**
1. **Idempotentní inicializace:**
   ```javascript
   export function initModule() {
     if (document.documentElement.dataset.moduleInit === '1') return;
     document.documentElement.dataset.moduleInit = '1';
     // ... inicializace
   }
   ```

2. **Kontrola existence elementů:**
   ```javascript
   const element = document.getElementById('id');
   if (!element) return;
   ```

3. **Kontrola závislostí:**
   ```javascript
   if (typeof window.lesktopTrackEvent === 'function') {
     window.lesktopTrackEvent(...);
   }
   ```

4. **Graceful degradation:**
   ```javascript
   import('./module.js').then(m => m.init()).catch(() => {});
   ```

5. **Error handling:**
   ```javascript
   try {
     // kód
   } catch (error) {
     logError('Chyba:', error);
   }
   ```

### CSS struktura

**Pravidla:**
1. **Modulární struktura:**
   - Tokens → Base → Layout → Components → Pages
   - Každá komponenta má svůj soubor

2. **CSS custom properties:**
   - Definuj v `tokens.css`
   - Používej přes `var(--property-name)`
   - Nehardcoduj hodnoty

3. **BEM-like konvence:**
   - `.component`
   - `.component__element`
   - `.component--modifier`

4. **Responzivita:**
   - Mobile-first přístup
   - Používej breakpointy z `tokens.css`

### Performance

**Pravidla:**
1. **Obrázky:**
   - Používej `loading="lazy"` pro obrázky pod foldem
   - Optimalizuj velikost obrázků
   - Používej správné formáty (WebP, AVIF)

2. **JavaScript:**
   - Používej `defer` pro skripty
   - Dynamické importy pro code splitting
   - Minifikace v produkci

3. **CSS:**
   - Non-blocking načtení externích CSS
   - Minifikace v produkci
   - Odstraň nepoužívaný CSS

4. **Externí zdroje:**
   - Preconnect pro externí domény
   - Non-blocking načtení fontů

### Bezpečnost

**Pravidla:**
1. **Formuláře:**
   - Validace na klientovi i serveru
   - Sanitizace vstupů
   - CSRF ochrana (pokud je backend)

2. **Externí služby:**
   - Nepoužívej nebezpečné CDN
   - Kontroluj integrity hash pro CDN
   - Nepoužívej eval() nebo innerHTML s uživatelskými daty

3. **Access keys:**
   - Nenechávej access keys v HTML (ideálně přesunout do backendu)
   - Rotuj klíče pokud jsou zneužity

4. **Tracking:**
   - Respektuj cookie consent
   - Anonymizuj IP adresy
   - Neposílej citlivá data do tracking služeb

### Práce s externími službami

**Pravidla:**
1. **Web3Forms API:**
   - Vždy kontroluj `response.ok`
   - Zpracuj chyby gracefully
   - Zobraz uživateli srozumitelnou chybovou zprávu

2. **Google Analytics:**
   - Respektuj cookie consent
   - Kontroluj existenci `window.gtag` před voláním
   - Používej `window.lesktopTrackEvent` wrapper

3. **CDN:**
   - Používej integrity hash
   - Měj fallback pro selhání CDN
   - Monitoruj dostupnost CDN

## 9. Anti-patterns (čeho se vyvarovat)

### Co nikdy nedělat

1. **Neprováděj změny bez analýzy dokumentace**
   - Vždy si přečti relevantní dokumenty v `kb/`
   - Nehádej, jak systém funguje

2. **Neporušuj architekturu**
   - Nepřidávej nové závislosti bez důvodu
   - Nepřesouvej kód mezi moduly bez důvodu
   - Neodstraňuj graceful degradation

3. **Neignoruj error handling**
   - Vždy přidej error handling pro kritické operace
   - Neignoruj chyby v konzoli

4. **Neupravuj dokumentaci bez změny kódu**
   - Dokumentace musí odpovídat skutečnému kódu
   - Neupravuj dokumentaci "pro jistotu"

5. **Nepoužívej inline JavaScript v HTML**
   - Kromě tracking handlerů (které jsou nutné)
   - Přesuň logiku do JS modulů

6. **Nehardcoduj hodnoty**
   - Používej CSS custom properties
   - Používej konstanty v JavaScriptu

### Typické chyby

1. **Zapomenutá aktualizace dokumentace**
   - Po změně kódu zapomenout aktualizovat dokumentaci
   - **Řešení:** Vždy aktualizuj dokumentaci jako součást změny

2. **Nesprávná čísla řádků**
   - Čísla řádků v dokumentaci neodpovídají skutečnosti
   - **Řešení:** Při změně kódu oprav čísla řádků v dokumentaci

3. **Zapomenutá kontrola závislostí**
   - Modul volá funkci, která ještě neexistuje
   - **Řešení:** Vždy kontroluj existenci funkcí před voláním

4. **Chybějící graceful degradation**
   - Modul selže a celý web nefunguje
   - **Řešení:** Vždy implementuj graceful degradation

5. **Zapomenutý test**
   - Změna je nasazena bez testování
   - **Řešení:** Vždy otestuj změny před nasazením

### Varovné signály

**Signály, že něco není v pořádku:**
1. **Chyby v konzoli:**
   - JavaScript chyby
   - CSS chyby
   - Chyby při načítání modulů

2. **Nesoulad dokumentace a kódu:**
   - Dokumentace popisuje něco jiného než kód
   - Čísla řádků neodpovídají

3. **Duplikace kódu:**
   - Stejný kód na více místech
   - Duplikace event listenerů

4. **Tight coupling:**
   - Moduly jsou silně závislé na sobě
   - Změna v jednom modulu rozbije jiný

5. **Chybějící error handling:**
   - Chyby nejsou zachyceny
   - Uživatel vidí nesrozumitelné chyby

## 10. Příklady reálných scénářů

### Scénář 1: Přidání nové sekce

**Zadání:** Přidat novou sekci "Reference" na stránku.

**Postup:**
1. **Analýza:**
   - Přečti `03_napojeni_indexu.md` - struktura sekcí
   - Přečti `06_architektura_css.md` - CSS struktura
   - Identifikuj, kde přidat sekci v HTML

2. **Návrh:**
   - Přidat HTML sekci s ID `#references`
   - Přidat CSS styly (použít existující `.content-section`)
   - Přidat do navigace
   - Přidat reveal-on-scroll animaci

3. **Implementace:**
   - Přidat HTML sekci do `index.html`
   - Přidat odkaz do navigace
   - Přidat třídu `.reveal-on-scroll`
   - Otestovat

4. **Dokumentace:**
   - `03_napojeni_indexu.md` - přidat novou sekci
   - `11_slovnik_pojmu.md` - přidat `#references` ID
   - `08_tok_fungovani_webu.md` - aktualizovat pokud je potřeba

**Časová náročnost:** 30-60 minut

### Scénář 2: Úprava formuláře

**Zadání:** Přidat nový input "Poznámky" do kalkulačního formuláře.

**Postup:**
1. **Analýza:**
   - Přečti `03_napojeni_indexu.md` - struktura formuláře
   - Přečti `04_architektura_js.md` - jak `form.js` funguje
   - Identifikuj, kde přidat input

2. **Návrh:**
   - Přidat `<textarea>` do `#kalkulacka`
   - `form.js` už podporuje všechny inputy (FormData)
   - Přidat CSS styly pokud je potřeba

3. **Implementace:**
   - Přidat `<textarea>` do HTML
   - Otestovat odeslání formuláře
   - Ověřit, že data se odesílají

4. **Dokumentace:**
   - `03_napojeni_indexu.md` - přidat nový input
   - `11_slovnik_pojmu.md` - přidat ID inputu
   - `08_tok_fungovani_webu.md` - aktualizovat tok dat

**Časová náročnost:** 15-30 minut

### Scénář 3: Změna designu

**Zadání:** Změnit primární barvu z `#3a4768` na `#2c3e50`.

**Postup:**
1. **Analýza:**
   - Přečti `07_tema_a_tokeny.md` - kde jsou definovány barvy
   - Identifikuj, která custom property použít

2. **Návrh:**
   - Změnit `--color-primary-dark` v `tokens.css`
   - Ověřit, že změna neovlivní jiné komponenty

3. **Implementace:**
   - Upravit `--color-primary-dark` v `/assets/css/tokens/tokens.css`
   - Otestovat na všech komponentách
   - Ověřit kontrast a čitelnost

4. **Dokumentace:**
   - `07_tema_a_tokeny.md` - aktualizovat hodnotu tokenu

**Časová náročnost:** 10-20 minut

### Scénář 4: Přidání trackingu

**Zadání:** Přidat tracking pro kliknutí na nové tlačítko "Objednat".

**Postup:**
1. **Analýza:**
   - Přečti `04_architektura_js.md` - jak tracking funguje
   - Přečti `08_tok_fungovani_webu.md` - tok trackingu
   - Identifikuj, kde přidat tracking

2. **Návrh:**
   - Přidat `onclick` handler na tlačítko
   - Použít `window.lesktopTrackEvent`
   - Přidat kontrolu existence funkce

3. **Implementace:**
   - Přidat `onclick="window.lesktopTrackEvent && window.lesktopTrackEvent('event','cta_click',{button_name:'objednat'})"` na tlačítko
   - Otestovat tracking v GA DebugView

4. **Dokumentace:**
   - `08_tok_fungovani_webu.md` - aktualizovat pokud je potřeba
   - `11_slovnik_pojmu.md` - přidat pokud je nové ID/třída

**Časová náročnost:** 5-15 minut

### Scénář 5: Refaktoring modulu

**Zadání:** Refaktorovat `form.js` - rozdělit na dva moduly (contact form a calc form).

**Postup:**
1. **Analýza:**
   - Přečti `04_architektura_js.md` - struktura modulů
   - Přečti `form.js` - současná implementace
   - Identifikuj, jak rozdělit kód

2. **Návrh:**
   - Vytvořit `contactForm.js` a `calcForm.js`
   - Přesunout společnou logiku do helper funkce
   - Aktualizovat `main.js` importy
   - Zachovat funkcionalitu

3. **Implementace:**
   - Vytvořit nové moduly
   - Přesunout kód
   - Aktualizovat importy
   - Otestovat, že funkcionalita zůstala stejná

4. **Dokumentace:**
   - `04_architektura_js.md` - aktualizovat strukturu modulů
   - `05_mainjs_skeleton.md` - aktualizovat importy
   - `10_index_modulu.md` - aktualizovat index
   - `02_hlavni_soubory.md` - aktualizovat seznam souborů

**Časová náročnost:** 2-4 hodiny
