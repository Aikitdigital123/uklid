# REPORT – Hero background přesun z body na .hero-section

## Proč bylo body / body::before špatné řešení

- **Pozadí na `body`** způsobovalo, že hero obrázek byl za celou stránkou (header, main, footer). Kvůli tomu působil layout rozbitě: pozadí zasahovalo do všech sekcí, overlay (gradient) byl aplikovaný globálně nebo chyběl, a hero vypadalo posunuté/rozmazané (zejména v kombinaci s `backdrop-filter` na skleněných panelech).
- **`body::before`** (pokud by se používal) by přidával pseudo-element na úroveň celého dokumentu, takže by byl ovlivněn stacking contextem, `z-index` ostatních bloků a šířkou/výškou body. Hero by nebyl omezen na první sekci a mohl by se vizuálně prolínat s dalšími sekcemi nebo footeren.
- Hero má být **jen za první sekcí** (úvodní blok „O nás“), ne za celou stránkou. Správné řešení je umístit pozadí přímo na konkrétní blok – `.hero-section`.

## Kde je teď hero background

- **Pouze na `.hero-section`** – první sekce na homepage (`<section id="about" class="content-section glass-panel hero-section ...">`).
- **Obrázek:** `background-image: url("/images/hero.jpg")` (desktop), na mobilu (max-width: 480px) `url("/images/hero-mobile.jpg")`.
- **Nastavení:** `background-size: cover`, `background-position: center`, `background-repeat: no-repeat`, `min-height: 100vh`.
- **Overlay:** `.hero-section::before` – `position: absolute`, `inset: 0`, `background: linear-gradient(rgba(255,255,255,0.75), rgba(255,255,255,0.9))`, `pointer-events: none`. Obsah sekce má `position: relative` a `z-index: 1`, takže je nad overlayem.
- Hero se **nezobrazuje na dalších stránkách** – třídu `.hero-section` má jen první sekce na index.html; faq, impresum, privacy, terms, sluzby, 404 ji nemají.

## Které soubory byly změněny

| Soubor | Změny |
|--------|--------|
| **index.html** | Odstraněn celý inline `<style>` s pozadím na `body[data-page="index"]`. První sekci (#about) přidána třída `hero-section`. Úprava komentáře u preload. |
| **assets/css/pages/index/hero.css** | Odstraněno pravidlo pro `body[data-page="index"]`. Hero pozadí a overlay přeneseny na `.hero-section` a `.hero-section::before` (pattern dle zadání). Přidán `backdrop-filter: none` na `.hero-section`, aby obrázek nebyl rozmazán. `.hero-section .container` a `.hero-content` mají `position: relative` a `z-index: 1`. |
| **assets/css/pages/index/responsive.css** | Odstraněn blok `body[data-page="index"]` (background, barva) v @media (max-width: 480px). Odstraněn řádek `body[data-page="index"] { background-position: center center; }` v @media (max-width: 768px). V obou breakpointech upravena `.hero-section`: pouze padding a `min-height: 100vh`; na 480px navíc `background-image: url("/images/hero-mobile.jpg")`, `background-size: cover`, `background-position: center`, `background-repeat: no-repeat`. |
| **assets/css/pages/index/print.css** | Beze změn – nepoužívá `body::before`; pro tisk zůstává `body { background: white }` a `.hero-section { display: none }`. |

## Kontrola požadavků

- Hero obrázek je jen na `.hero-section`, čistý (cover, bez zbytečného zoomu), bez pozadí na body.
- Hero je vidět jen za první sekcí (ta první sekce je zároveň hero sekce).
- Hero nepřekrývá footer – končí na konci `.hero-section`, pod ní následují další sekce a footer.
- Layout homepage zůstává stejný (jedna úvodní sekce s O nás, pod ní Služby, Před/po, Ceník, Kontakt).
- Žádná jiná sekce nepřepisuje hero background – ostatní sekce nemají třídu `hero-section`.
- Na ostatních stránkách se hero nezobrazuje.
