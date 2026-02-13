# Audit HTML vs Dokumentace - Lesktop Project

**Datum auditu:** 2025-01-XX  
**Soubory kontrolované:** `index.html`, `privacy.html`, `terms.html`, `404.html`  
**Dokumentace kontrolovaná:** `kb/03_napojeni_indexu.md`, `kb/11_slovnik_pojmu.md`

---

## 1. ID atributy v HTML vs dokumentace

### ✅ ID v HTML, která JSOU v dokumentaci (`kb/11_slovnik_pojmu.md`)

- `#main-content` (index.html:153) ✓
- `#about` (index.html:154) ✓
- `#services` (index.html:161) ✓
- `#before-after` (index.html:220) ✓
- `#before-after-gallery` (index.html:225) ✓
- `#before-after-empty` (index.html:226) ✓
- `#pricing` (index.html:230) ✓
- `#kalkulacka` (index.html:279) ✓
- `#cleaningType` (index.html:285) ✓
- `#areaSize` (index.html:297) ✓
- `#frequencyGroup` (index.html:301) ✓
- `#cleaningFrequency` (index.html:303) ✓
- `#calc-form-status` (index.html:445) ✓
- `#contact` (index.html:451) ✓
- `#contactForm` (index.html:461) ✓
- `#form-status` (index.html:478) ✓
- `#cookie-banner` (index.html:503, privacy.html:93, terms.html:83, 404.html:25) ✓
- `#cookie-accept` (index.html:509, privacy.html:99, terms.html:89, 404.html:31) ✓
- `#cookie-necessary` (index.html:510, privacy.html:100, terms.html:90, 404.html:32) ✓
- `#name` (index.html:467) ✓
- `#email` (index.html:471) ✓
- `#message` (index.html:475) ✓
- `#customerName` (index.html:426) ✓
- `#customerEmail` (index.html:431) ✓
- `#customerPhone` (index.html:436) ✓
- `#notes` (index.html:441) ✓

### ❌ ID v HTML, která NEOBSAHUJE dokumentace

**Chybějící ID v `kb/11_slovnik_pojmu.md`:**

1. **`#windowsCleaningGeneral`** (index.html:315)
   - Checkbox pro "Mytí a čištění oken - obecně"
   - **Doporučení:** Přidat do slovníku

2. **`#windowsCleaningStandard`** (index.html:319)
   - Checkbox pro "Mytí oken"
   - **Doporučení:** Přidat do slovníku

3. **`#balconyWindows`** (index.html:323)
   - Checkbox pro "Mytí balkonových a terasových oken"
   - **Doporučení:** Přidat do slovníku

4. **`#blindsCleaning`** (index.html:327)
   - Checkbox pro "Mytí žaluzií"
   - **Doporučení:** Přidat do slovníku

5. **`#carpetCleaning`** (index.html:332)
   - Checkbox pro "Tepování koberců"
   - **Doporučení:** Přidat do slovníku

6. **`#sofaCleaning`** (index.html:336)
   - Checkbox pro "Tepování sedaček"
   - **Doporučení:** Přidat do slovníku

7. **`#mattressCleaning`** (index.html:340)
   - Checkbox pro "Tepování matrací"
   - **Doporučení:** Přidat do slovníku

8. **`#ovenCleaning`** (index.html:345)
   - Checkbox pro "Čištění trouby"
   - **Doporučení:** Přidat do slovníku

9. **`#fridgeCleaning`** (index.html:349)
   - Checkbox pro "Čištění lednice"
   - **Doporučení:** Přidat do slovníku

10. **`#freezerCleaning`** (index.html:353)
    - Checkbox pro "Čištění mrazáku"
    - **Doporučení:** Přidat do slovníku

11. **`#hoodCleaning`** (index.html:357)
    - Checkbox pro "Čištění digestoře"
    - **Doporučení:** Přidat do slovníku

12. **`#applianceInteriorCleaning`** (index.html:361)
    - Checkbox pro "Mytí vnitřku kuchyňských spotřebičů"
    - **Doporučení:** Přidat do slovníku

13. **`#kitchenCabinetCleaning`** (index.html:365)
    - Checkbox pro "Úklid v kuchyňské skříňce"
    - **Doporučení:** Přidat do slovníku

14. **`#closetCleaning`** (index.html:369)
    - Checkbox pro "Úklid ve skříni"
    - **Doporučení:** Přidat do slovníku

15. **`#balconyTerraceCleaning`** (index.html:373)
    - Checkbox pro "Úklid balkónu nebo terasy"
    - **Doporučení:** Přidat do slovníku

16. **`#radiatorCleaning`** (index.html:377)
    - Checkbox pro "Mytí radiátorů"
    - **Doporučení:** Přidat do slovníku

17. **`#doorFrameCleaning`** (index.html:381)
    - Checkbox pro "Mytí dveří a zárubní"
    - **Doporučení:** Přidat do slovníku

18. **`#lightFixtureCleaning`** (index.html:385)
    - Checkbox pro "Mytí světel a lustru"
    - **Doporučení:** Přidat do slovníku

19. **`#extraBathroomToilet`** (index.html:390)
    - Checkbox pro "Další koupelna/toaleta"
    - **Doporučení:** Přidat do slovníku

20. **`#ironingService`** (index.html:394)
    - Checkbox pro "Žehlení prádla"
    - **Doporučení:** Přidat do slovníku

21. **`#keyHandling`** (index.html:398)
    - Checkbox pro "Předání nebo převzetí klíčů"
    - **Doporučení:** Přidat do slovníku

22. **`#cellarAtticCleaning`** (index.html:402)
    - Checkbox pro "Úklid sklepních a půdních prostor"
    - **Doporučení:** Přidat do slovníku

23. **`#moveInMoveOutCleaning`** (index.html:406)
    - Checkbox pro "Generální úklid před/po stěhování"
    - **Doporučení:** Přidat do slovníku

24. **`#hasPets`** (index.html:417)
    - Checkbox pro "Máte domácí mazlíčky?"
    - **Doporučení:** Přidat do slovníku

25. **`#main-menu`** (privacy.html:25, terms.html:25)
    - ID navigačního menu v privacy.html a terms.html
    - **Doporučení:** Přidat do slovníku (pokud je relevantní)

### ⚠️ ID v dokumentaci, která NEOBSAHUJE HTML

**Žádná ID v dokumentaci nejsou v HTML chybějící.** ✓

---

## 2. Sekce v HTML vs dokumentace

### ✅ Sekce v HTML, které JSOU v dokumentaci

- `#about` (index.html:154) ✓
- `#services` (index.html:161) ✓
- `#before-after` (index.html:220) ✓
- `#pricing` (index.html:230) ✓
- `#contact` (index.html:451) ✓

### ⚠️ Sekce v dokumentaci vs HTML

Všechny sekce z dokumentace existují v HTML. ✓

---

## 3. Formuláře v HTML vs dokumentace

### ✅ Formuláře v HTML, které JSOU v dokumentaci (`kb/03_napojeni_indexu.md`)

**Formulář 1: Kalkulačka úklidu (`#kalkulacka`)**
- ID: `kalkulacka` (index.html:279) ✓
- Action: `https://api.web3forms.com/submit` ✓
- Method: `POST` ✓
- Status element: `#calc-form-status` (index.html:445) ✓
- Všechny inputy jsou dokumentované ✓

**Formulář 2: Kontaktní formulář (`#contactForm`)**
- ID: `contactForm` (index.html:461) ✓
- Action: `https://api.web3forms.com/submit` ✓
- Method: `POST` ✓
- Status element: `#form-status` (index.html:478) ✓
- Všechny inputy jsou dokumentované ✓

### ⚠️ Nesoulady v dokumentaci formulářů

**Žádné zásadní nesoulady.** Dokumentace odpovídá HTML. ✓

**Poznámka:** V dokumentaci (`kb/03_napojeni_indexu.md`) jsou uvedeny všechny hlavní inputy, ale chybí detailní seznam všech checkboxů pro doplňkové služby. To je však v pořádku, protože jsou uvedeny jako `additional_services[]` s poznámkou "více checkboxů s různými hodnotami".

---

## 4. Inline onclick handlery v HTML vs dokumentace

### ✅ Onclick handlery v HTML, které JSOU v dokumentaci

**Navigační odkazy:**
- Řádek 144: `nav_click` s `menu_item:'o_nas'` ✓
- Řádek 145: `nav_click` s `menu_item:'sluzby'` ✓
- Řádek 146: `nav_click` s `menu_item:'cenik'` ✓
- Řádek 147: `nav_click` s `menu_item:'kontakt'` ✓

**CTA tlačítka:**
- Řádek 171: `cta_click` s `button_name:'kalkulace'` ✓
- Řádek 177: `cta_click` s `button_name:'dotaz_nebo_poptavka'` ✓
- Řádek 183: `cta_click` s `button_name:'zjistit_vice_kalkulace'` ✓
- Řádek 189: `cta_click` s `button_name:'zjistit_vice_kalkulace'` ✓
- Řádek 195: `cta_click` s `button_name:'zjistit_vice_kalkulace'` ✓
- Řádek 201: `cta_click` s `button_name:'kontaktujte_nas'` ✓
- Řádek 207: `cta_click` s `button_name:'zjistete_vice'` ✓
- Řádek 213: `cta_click` s `button_name:'domluvit_detaily'` ✓
- Řádek 444: `cta_click` s `button_name:'ziskat_nezavaznou_nabidku'` ✓
- Řádek 477: `cta_click` s `button_name:'odeslat_poptavku'` ✓

**Telefonní a WhatsApp odkazy:**
- Řádek 456: `phone_click` s `location:'contact_section'` ✓
- Řádek 457: `click_whatsapp` s `location:'contact_section'` + `conversion` ✓

### ⚠️ Nesoulady v dokumentaci onclick handlerů

**Všechny onclick handlery jsou v dokumentaci uvedeny.** ✓

**Poznámka:** V `kb/03_napojeni_indexu.md` jsou uvedeny řádky 144-147, 171, 177, 183, 189, 195, 201, 207, 213, 444, 456, 457, 477, což odpovídá skutečnosti.

---

## 5. Data-* atributy v HTML vs dokumentace

### ✅ Data-* atributy v HTML

**index.html:**
- `data-track="phone"` (řádek 456) - na telefonním odkazu
- `data-location="contact_section"` (řádek 456) - na telefonním odkazu

**privacy.html:**
- `data-track="phone"` (řádek 42) - na telefonním odkazu
- `data-location="privacy"` (řádek 42) - na telefonním odkazu

**terms.html:**
- `data-track="phone"` (řádek 73) - na telefonním odkazu
- `data-location="terms"` (řádek 73) - na telefonním odkazu

**404.html:**
- `data-page="404"` (řádek 12) - na `<body>` elementu

### ⚠️ Data-* atributy v dokumentaci

**Chybějící v dokumentaci:**
- `data-track` atribut není v `kb/11_slovnik_pojmu.md`
- `data-location` atribut není v `kb/11_slovnik_pojmu.md`
- `data-page` atribut není v `kb/11_slovnik_pojmu.md`

**Doporučení:** Přidat sekci "Data atributy" do `kb/11_slovnik_pojmu.md` s popisem těchto atributů.

---

## 6. Kontrola čísel řádků

### ⚠️ Nesoulady v číslech řádků

**Všechna čísla řádků v dokumentaci odpovídají skutečnosti v `index.html`.** ✓

**Ověřeno:**
- `#main-content` - dokumentace: 153, skutečnost: 153 ✓
- `#about` - dokumentace: 154, skutečnost: 154 ✓
- `#services` - dokumentace: 161, skutečnost: 161 ✓
- `#before-after` - dokumentace: 220, skutečnost: 220 ✓
- `#before-after-gallery` - dokumentace: 225, skutečnost: 225 ✓
- `#before-after-empty` - dokumentace: 226, skutečnost: 226 ✓
- `#pricing` - dokumentace: 230, skutečnost: 230 ✓
- `#kalkulacka` - dokumentace: 279, skutečnost: 279 ✓
- `#cleaningType` - dokumentace: 285, skutečnost: 285 ✓
- `#areaSize` - dokumentace: 297, skutečnost: 297 ✓
- `#frequencyGroup` - dokumentace: 301, skutečnost: 301 ✓
- `#cleaningFrequency` - dokumentace: 303, skutečnost: 303 ✓
- `#calc-form-status` - dokumentace: 445, skutečnost: 445 ✓
- `#contact` - dokumentace: 451, skutečnost: 451 ✓
- `#contactForm` - dokumentace: 461, skutečnost: 461 ✓
- `#form-status` - dokumentace: 478, skutečnost: 478 ✓
- `#cookie-banner` - dokumentace: 503, skutečnost: 503 ✓
- `#cookie-accept` - dokumentace: 509, skutečnost: 509 ✓
- `#cookie-necessary` - dokumentace: 510, skutečnost: 510 ✓
- `#name` - dokumentace: 467, skutečnost: 467 ✓
- `#email` - dokumentace: 471, skutečnost: 471 ✓
- `#message` - dokumentace: 475, skutečnost: 475 ✓
- `#customerName` - dokumentace: 426, skutečnost: 426 ✓
- `#customerEmail` - dokumentace: 431, skutečnost: 431 ✓
- `#customerPhone` - dokumentace: 436, skutečnost: 436 ✓
- `#notes` - dokumentace: 441, skutečnost: 441 ✓

---

## 7. Shrnutí zjištění

### ✅ Pozitivní zjištění

1. **Všechna hlavní ID jsou v dokumentaci** - základní struktura je dobře zdokumentována
2. **Formuláře jsou správně dokumentované** - oba formuláře mají kompletní dokumentaci
3. **Onclick handlery jsou v dokumentaci** - všechny tracking handlery jsou uvedeny
4. **Čísla řádků jsou přesná** - dokumentace odpovídá aktuálnímu stavu kódu
5. **Sekce jsou správně dokumentované** - všechny hlavní sekce jsou v dokumentaci

### ❌ Problémy nalezené

1. **Chybí 24 ID checkboxů** v `kb/11_slovnik_pojmu.md`:
   - Všechny checkboxy pro doplňkové služby v kalkulačním formuláři
   - Checkbox `#hasPets`
   - ID `#main-menu` z privacy.html a terms.html

2. **Chybí data-* atributy** v `kb/11_slovnik_pojmu.md`:
   - `data-track`
   - `data-location`
   - `data-page`

### 📋 Doporučené opravy

1. **Přidat do `kb/11_slovnik_pojmu.md`:**
   - Sekci s všemi checkboxy pro doplňkové služby (24 ID)
   - Sekci "Data atributy" s popisem `data-track`, `data-location`, `data-page`

2. **Aktualizovat `kb/03_napojeni_indexu.md`:**
   - Uvést, že privacy.html, terms.html a 404.html také obsahují cookie banner s ID `#cookie-banner`, `#cookie-accept`, `#cookie-necessary`
   - Uvést data-* atributy na telefonních odkazech

---

## 8. Závěr

**Celkové hodnocení:** Dokumentace je v dobrém stavu, ale chybí detailní dokumentace všech checkboxů a data-* atributů.

**Priorita oprav:**
1. **Vysoká:** Přidat chybějící ID checkboxů do slovníku (24 ID)
2. **Střední:** Přidat data-* atributy do slovníku
3. **Nízká:** Aktualizovat `kb/03_napojeni_indexu.md` o cookie banner v ostatních HTML souborech

**Odhadovaný čas na opravy:** 30-45 minut
