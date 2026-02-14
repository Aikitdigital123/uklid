// Page-specific skript pro index — po refaktoringu
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
      if (value === 'Pravidelný úklid domácnosti' || value === 'Úklid komerčních prostor (kanceláře, obchody)') {
        frequencyGroup.classList.remove('form-group-hidden');
        frequencySelect.setAttribute('required', 'required');
      } else {
        frequencyGroup.classList.add('form-group-hidden');
        frequencySelect.removeAttribute('required');
        frequencySelect.value = ''; // Reset hodnoty
      }
    };

    // Naslouchání na změnu výběru typu úklidu
    cleaningTypeSelect.addEventListener('change', toggleFrequencyDisplay);

  // Zajistit správné zobrazení při načtení stránky
  toggleFrequencyDisplay();
});
