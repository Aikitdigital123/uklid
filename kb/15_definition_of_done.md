# Definition of Done (DoD) – Lesktop

## 1. Obecné DoD (platí pro každou změnu)

- [ ] Změna je kompletně implementovaná
- [ ] Web se načítá bez chyb
- [ ] V konzoli nejsou žádné chyby
- [ ] Změna je otestovaná podle typu (UI / formuláře / tracking / responzivita)
- [ ] Dokumentace v `kb/` je zkontrolovaná a případně aktualizovaná podle `kb/09_pravidla_udrzby.md`
- [ ] Pokud se měnily řádky / ID / třídy / tokeny → aktualizace `kb/11_slovnik_pojmu.md`
- [ ] Pokud se přidal modul → aktualizace `kb/10_index_modulu.md`
- [ ] Pokud se měnil tok → aktualizace `kb/08_tok_fungovani_webu.md`
- [ ] Pokud se měnily importy → aktualizace `kb/05_mainjs_skeleton.md` nebo `kb/06_architektura_css.md`
- [ ] Záznam do changelogu dle `kb/09_pravidla_udrzby.md`

## 2. DoD podle typu změny

### HTML

- [ ] HTML je validní (W3C validator)
- [ ] Všechny sekce jsou správně strukturované
- [ ] Formuláře mají správné `action` a `method`
- [ ] ID atributy jsou unikátní
- [ ] ARIA atributy jsou správně použity (pokud je potřeba)
- [ ] Aktualizace `kb/03_napojeni_indexu.md` pokud se změnila struktura

### CSS

- [ ] CSS je validní
- [ ] Responzivita funguje na všech breakpointech
- [ ] Design tokeny jsou použity správně (ne hardcodované hodnoty)
- [ ] Žádné duplikace stylů
- [ ] Aktualizace `kb/06_architektura_css.md` pokud se změnila struktura
- [ ] Aktualizace `kb/07_tema_a_tokeny.md` pokud se změnily tokeny

### JavaScript

- [ ] JavaScript je bez chyb v konzoli
- [ ] Moduly mají idempotentní inicializaci
- [ ] Graceful degradation funguje (modul může selhat bez ovlivnění ostatních)
- [ ] Kontrola existence elementů před manipulací
- [ ] Kontrola závislostí před použitím (`typeof window.lesktopTrackEvent === 'function'`)
- [ ] Aktualizace `kb/04_architektura_js.md` pokud se změnily moduly

### Formuláře

- [ ] Validace funguje na klientovi
- [ ] Submit handler funguje správně
- [ ] Status zprávy se zobrazují (úspěch/chyba)
- [ ] Formulář se resetuje po úspěšném odeslání
- [ ] Chybové zprávy jsou srozumitelné
- [ ] Aktualizace `kb/03_napojeni_indexu.md` pokud se změnila struktura formuláře

### Tracking

- [ ] Cookie banner funguje správně
- [ ] Souhlas s cookies se ukládá do localStorage
- [ ] Google Analytics se načítá pouze po souhlasu
- [ ] Tracking události se odesílají správně
- [ ] Tracking funguje i když GA není načteno (graceful degradation)
- [ ] Aktualizace `kb/08_tok_fungovani_webu.md` pokud se změnil tok trackingu

### Build / Release

- [ ] Build proběhl bez chyb (`npm run build`)
- [ ] Minifikované soubory jsou vytvořeny
- [ ] Statické soubory jsou zkopírovány
- [ ] Záloha je vytvořena před nasazením
- [ ] Smoke test po nasazení proběhl úspěšně
- [ ] Rollback plán je připraven

## 3. Minimální smoke test po nasazení

- [ ] Stránka se načítá bez chyb
- [ ] Navigace funguje (smooth scroll, anchor links)
- [ ] Všechny sekce jsou viditelné a správně zobrazené (#about, #services, #before-after, #pricing, #contact)
- [ ] Kalkulační formulář (`#kalkulacka`) - alespoň validace funguje
- [ ] Kontaktní formulář (`#contactForm`) - alespoň validace funguje
- [ ] Cookie banner se zobrazuje a funguje
- [ ] Back-to-top tlačítko se zobrazuje při scrollu a funguje
- [ ] Before-after galerie se zobrazuje (nebo zpráva o prázdné galerii)
- [ ] Mobilní menu se otevírá/zavírá správně
- [ ] Responzivita funguje (zkontrolovat na mobilu/tabletu)
- [ ] V konzoli nejsou žádné chyby

## 4. Poznámky

**Definition of Done je povinné pravidlo.** Každá změna musí splnit všechny relevantní body z DoD před tím, než je považována za dokončenou. DoD není volitelný checklist, ale minimální standard kvality.

**Dokumentace musí odpovídat skutečnému kódu.** Pokud se kód změní, dokumentace musí být aktualizována. Nesoulad mezi kódem a dokumentací způsobuje technický dluh a ztěžuje budoucí práci na projektu. Vždy zkontroluj, že dokumentace v `kb/` odpovídá skutečnému stavu kódu.

**Musí se občas testovat i graceful degradation.** Ne všechny moduly jsou kritické pro fungování webu. Otestuj, že web funguje i když některé moduly selžou (např. vypni JavaScript, simuluj chybu modulu). Graceful degradation je klíčová pro stabilitu a uživatelský zážitek.

**Cílem je dlouhodobá stabilita projektu.** DoD není jen o dokončení aktuální změny, ale o zajištění, že projekt zůstane udržovatelný a stabilní i v budoucnu. Každá změna by měla zlepšit nebo alespoň zachovat kvalitu projektu, ne ji zhoršit.
