﻿// Page-specific skript pro index — po refaktoringu
// Globální komponenty (nav, reveal, form, select) se inicializují z assets/js/main.js
// Tady ponecháváme prostor jen pro případné budoucí chování specifické pro tuto stránku.

document.addEventListener('DOMContentLoaded', () => {
  const currentYear = String(new Date().getFullYear());
  document.querySelectorAll('[data-current-year]').forEach((node) => {
    node.textContent = currentYear;
  });

  // Logika pro zobrazení/skrytí pole "Frekvence úklidu" podle typu úklidu
  const cleaningTypeSelect = document.getElementById('cleaningType');
  const frequencyGroup = document.getElementById('frequencyGroup');
  const frequencySelect = document.getElementById('cleaningFrequency');

  // Ověření existence elementů před inicializací
  if (!cleaningTypeSelect || !frequencyGroup || !frequencySelect) return;

  // Idempotence guard - nastavuje se až po ověření existence elementů
  if (document.documentElement.dataset.indexPageInit === '1') return;
  document.documentElement.dataset.indexPageInit = '1';

  const toggleFrequencyDisplay = () => {
      const value = cleaningTypeSelect.value;
      // Zobrazit frekvenci pouze pro pravidelný úklid domácnosti nebo komerční úklid
      const typesRequiringFrequency = [
        'Pravidelný úklid domácnosti',
        'Úklid komerčních prostor (kanceláře, obchody)'
      ];

      if (typesRequiringFrequency.includes(value)) {
        frequencyGroup.classList.remove('form-group-hidden');
        frequencySelect.setAttribute('required', 'required');
      } else {
        frequencyGroup.classList.add('form-group-hidden');
        frequencySelect.removeAttribute('required');
        frequencySelect.value = ''; // Reset hodnoty
        // Odstranit validační třídy, aby při opětovném zobrazení nesvítila validace na prázdném poli
        frequencySelect.classList.remove('is-valid', 'is-invalid');
      }
    };

    // Naslouchání na změnu výběru typu úklidu
    cleaningTypeSelect.addEventListener('change', toggleFrequencyDisplay);

  // Zajistit správné zobrazení při načtení stránky
  toggleFrequencyDisplay();

});

// --- FIX PRO IPHONE / SAFARI (White Screen & Back Button Issue) ---
// Tento kód musí být mimo DOMContentLoaded, aby reagoval i na načtení z bfcache (tlačítko Zpět)
window.addEventListener('pageshow', (event) => {
  // Spustí se při každém zobrazení stránky (i z historie)
  
  // Pokud stránka byla načtena z cache (tlačítko Zpět), počkáme na dokončení reinicializace
  if (event.persisted) {
    // Čekat na dokončení reinicializace v main.bundle.js
    const waitForReinit = () => {
      if (window.__lesktopReinitializing) {
        // Stále probíhá reinicializace, zkusit znovu
        setTimeout(waitForReinit, 10);
        return;
      }
      
      // Reinicializace dokončena, nyní můžeme použít force reveal
      setTimeout(() => {
        // Pokud reveal.js poskytuje force reveal funkci, použijeme ji
        if (typeof window.__lesktopForceReveal === 'function') {
          window.__lesktopForceReveal();
        } else {
          // Fallback: pokud reveal.js ještě není načten, použijeme jednoduchou logiku
          const hiddenElements = document.querySelectorAll('.reveal-on-scroll:not(.is-visible)');
          hiddenElements.forEach(el => {
            el.classList.add('is-visible');
          });
        }
      }, 50);
    };
    
    waitForReinit();
    
    // Vynutíme překreslení pomocí requestAnimationFrame
    requestAnimationFrame(() => {
      document.body.offsetHeight;
    });
  } else {
    // Normální načtení (ne bfcache) - použijeme standardní logiku
    setTimeout(() => {
      if (typeof window.__lesktopForceReveal === 'function') {
        window.__lesktopForceReveal();
      } else {
        const hiddenElements = document.querySelectorAll('.reveal-on-scroll:not(.is-visible)');
        hiddenElements.forEach(el => {
          el.classList.add('is-visible');
        });
      }
    }, 100);
  }
});
