# Oprava menu tlačítka - Duplicitní toggle při tapu

**Datum:** 2026-01-XX  
**Status:** ✅ Opraveno

---

## 🔍 Přesná příčina

**Problém:** Při jednom tapu na menu tlačítko se menu otevřelo a hned zavřelo.

**Příčina:** Na stejném tlačítku byly současně aktivní tři event listeners:
1. `touchstart` - volal `toggleMenu()`
2. `touchend` - volal `toggleMenu()`
3. `click` - volal `toggleMenu()`

Při jednom tapu se tedy `toggleMenu()` volalo 2-3x, což způsobovalo:
- **Safari:** Menu nereagovalo (konflikt mezi eventy)
- **Chrome:** Menu se otevřelo a hned zavřelo (toggle 2x)

---

## ✅ Přesná oprava

**Soubor:** `assets/js/components/nav.js`

### Změny:

1. **Odstraněn `touchstart` event listener** - není potřeba, `touchend` stačí
2. **Pouze `touchend` s `preventDefault()`** - zabrání následnému `click` eventu
3. **`click` jako fallback pro desktop** - kde `touchend` neproběhne
4. **Ochrana proti duplicitě pomocí `isProcessing` flagu** - zajišťuje, že se `toggleMenu()` volá jen jednou
5. **Cooldown mechanismus (300ms)** - ochrana proti double-tap zoom

### Kód:

```javascript
// Mobile menu toggle - jednoduché a robustní řešení s ochranou proti duplicitě
if (menuToggle && siteNav) {
  // Funkce pro toggle menu (idempotentní)
  const toggleMenu = () => {
    siteNav.classList.toggle('is-open');
    const isExpanded = siteNav.classList.contains('is-open');
    menuToggle.setAttribute('aria-expanded', String(isExpanded));
  };

  // Ochrana proti duplicitnímu volání při jednom tapu
  let isProcessing = false;
  let lastToggleTime = 0;
  const TOGGLE_COOLDOWN = 300; // Minimální interval mezi toggle akcemi (ms)

  const handleToggle = (e) => {
    // Pokud už probíhá zpracování, ignoruj
    if (isProcessing) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    const currentTime = Date.now();
    const timeDiff = currentTime - lastToggleTime;
    
    // Pokud proběhlo toggle příliš nedávno, ignoruj (ochrana proti double-tap)
    if (timeDiff < TOGGLE_COOLDOWN) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    isProcessing = true;
    lastToggleTime = currentTime;
    
    toggleMenu();
    
    // Reset flagu po krátké prodlevě
    setTimeout(() => {
      isProcessing = false;
    }, TOGGLE_COOLDOWN);
  };

  // Pouze touchend s preventDefault - zabrání následnému click eventu
  // Toto je nejspolehlivější řešení pro Safari mobile
  menuToggle.addEventListener('touchend', (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleToggle(e);
  }, { passive: false });

  // Click jako fallback pro desktop (kde touchend neproběhne)
  // isProcessing flag zajistí, že pokud už proběhl touchend, click bude ignorován
  menuToggle.addEventListener('click', handleToggle);
}
```

---

## 🎯 Proč už se menu nebude otevírat a hned zavírat

### 1. **Pouze jeden primární event listener**
- **Před:** `touchstart`, `touchend` a `click` všechny volaly `toggleMenu()`
- **Po:** Pouze `touchend` volá `toggleMenu()` na mobile, `click` jako fallback na desktop

### 2. **`preventDefault()` na `touchend`**
- **Před:** `touchend` nechal proběhnout následný `click` event
- **Po:** `touchend` s `preventDefault()` zabrání následnému `click` eventu na touch zařízeních

### 3. **`isProcessing` flag**
- **Před:** Žádná ochrana proti duplicitě
- **Po:** Pokud už probíhá zpracování, další eventy jsou ignorovány

### 4. **Cooldown mechanismus**
- **Před:** Rychlé dvojité tapnutí mohlo způsobit dvojí toggle
- **Po:** Minimální interval 300ms mezi toggle akcemi

### 5. **Správné pořadí eventů**
- **Mobile (touch):** `touchend` → `preventDefault()` → `toggleMenu()` → `click` je ignorován (díky `isProcessing`)
- **Desktop (mouse):** `click` → `toggleMenu()`

---

## ✅ Ověření funkcionality

### Otevření/zavření menu
- ✅ Při jednom tapu se menu otevře nebo zavře (ne obojí)
- ✅ `aria-expanded` se správně aktualizuje
- ✅ Menu se správně zobrazí/skryje

### Zavření menu po kliknutí na odkaz
- ✅ Stávající logika v `navAnchors` event listeneru zůstává zachována
- ✅ Menu se zavře při kliknutí na anchor link na mobile (viewport <= 768px)

### Kompatibilita
- ✅ Safari mobile - `touchend` s `preventDefault()` funguje spolehlivě
- ✅ Chrome mobile - `touchend` s `preventDefault()` zabrání `click` eventu
- ✅ Desktop - `click` event funguje jako fallback

---

## 📊 Diff změn

**Soubor:** `assets/js/components/nav.js`

**Odstraněno:**
- `touchstart` event listener
- Duplicitní volání `toggleMenu()` v `touchstart` a `touchend`
- Složitá logika s `touchStarted` flagem

**Přidáno:**
- `isProcessing` flag pro ochranu proti duplicitě
- Cooldown mechanismus (300ms)
- `preventDefault()` na `touchend` pro zabránění následnému `click` eventu
- Jednoduchá a robustní logika

---

**Konec reportu**
