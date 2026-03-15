# Nastavení webu pro Google

Cíl: aby Google stránku správně indexoval, zobrazoval rich výsledky a aby Analytics i Ads fungovaly bez problémů.

---

## 1. Google Search Console (GSC)

- [ ] **Přidat nemovitost** na [search.google.com/search-console](https://search.google.com/search-console) – URL prefix `https://lesktop.cz`
- [ ] **Ověření vlastníka** – v `index.html` je placeholder pro meta tag. Po přidání nemovitosti v GSC zkopíruj hodnotu a vlož do zdrojového HTML:
  ```html
  <meta name="google-site-verification" content="TVŮJ_KÓD_Z_GSC" />
  ```
  (V projektu hledej komentář `<!-- Google Search Console` a vlož řádek pod něj.)
- [ ] **Odeslat sitemap** v GSC: `https://lesktop.cz/sitemap.xml`
- [ ] Po nasazení zkontrolovat „Pokrytí“ a „Stránky“ – žádné kritické chyby

---

## 2. Strukturovaná data (Rich Results)

- [ ] **Rich Results Test** – [search.google.com/test/rich-results](https://search.google.com/test/rich-results) – zadej URL stránky (např. `https://lesktop.cz/`) a ověř, že Google vidí **LocalBusiness** a **WebSite** bez chyb
- [ ] Stejně ověř **FAQ stránku**: `https://lesktop.cz/faq.html` – měla by mít platné **FAQPage** (rozbalitelné FAQ ve výsledcích)
- **Co je na webu:**
  - **Homepage:** LocalBusiness (adresa, telefon, e-mail, ceník, oblasti, služby, **otevírací doba**), WebSite (název, popis, jazyk, publisher)
  - **FAQ:** FAQPage s otázkami a odpověďmi
- **Otevírací doba** v JSON-LD je nastavená jako Po–Pá 8:00–18:00, So 9:00–14:00. Pokud máš jinou, uprav v `index.html` v objektu `openingHoursSpecification`.

---

## 3. robots.txt a indexace

- Soubor **robots.txt** v kořeni: `Allow: /`, `Sitemap: https://lesktop.cz/sitemap.xml`
- Stránka **404** má v HTML `<meta name="robots" content="noindex, nofollow">` – Google ji nebude indexovat (správně)
- Ostatní stránky mají `index, follow`

---

## 4. Google Analytics 4 a Google Ads

- **Cookies a souhlas:** Měření (GA4 + Ads) se načítá až po kliknutí na „Souhlasím“ v cookie liště. Výchozí stav = vše vypnuté (soulad s GDPR).
- **ID v kódu:** V `assets/js/components/cookieBanner.js` jsou nastavená:
  - GA4: `G-FLL5D5LE75`
  - Google Ads: `AW-17893281939`
- Pokud změníš měřicí nebo reklamní účet, uprav tato ID v `cookieBanner.js`.
- **CSP** v `vite.config.js` povoluje domény potřebné pro GTM, GA a Ads (script-src, connect-src, img-src).

---

## 5. Doporučené kontroly po nasazení

1. **Mobile-Friendly Test** – [search.google.com/test/mobile-friendly](https://search.google.com/test/mobile-friendly) – ověř mobilní zobrazení
2. **PageSpeed Insights** – [pagespeed.web.dev](https://pagespeed.web.dev) – výkon a Core Web Vitals (LCP, CLS, INP)
3. V GSC: **Prostředí** → „Prohlížení jako Google“ – ověř, že Googlebot vidí obsah a ne blokovanou stránku
4. V GSC: **Nastavení** → „Odeslat adresu URL k indexaci“ – po větších změnách můžeš ručně požádat o projmutí hlavní stránky

---

## 6. Shrnutí – co je už nastavené

| Položka | Stav |
|--------|------|
| Sitemap | Automaticky generovaná z `htmlPages` při buildu |
| robots.txt | Allow /, Sitemap URL, 404 noindex v HTML |
| Canonical + meta | Na všech stránkách (title, description, canonical, OG) |
| LocalBusiness JSON-LD | Adresa, kontakt, ceník, služby, **openingHoursSpecification** |
| WebSite JSON-LD | Název, popis, jazyk, publisher |
| FAQPage JSON-LD | Na faq.html pro rich výsledky |
| GA4 + Ads | Načítání až po souhlasu s cookies |
| CSP | Povolené Google domény pro skripty a měření |

Po doplnění **google-site-verification** v HTML a odeslání sitemap v GSC je web připravený pro plnou spolupráci s Googlem.
