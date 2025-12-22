// Page-specific skript pro index — po refaktoringu
// Globální komponenty (nav, reveal, form, select) se inicializují z assets/js/main.js
// Tady ponecháváme prostor jen pro případné budoucí chování specifické pro tuto stránku.

document.addEventListener('DOMContentLoaded', () => {
  // Logika pro zobrazení/skrytí pole "Frekvence úklidu" podle typu úklidu
  const cleaningTypeSelect = document.getElementById('cleaningType');
  const frequencyGroup = document.getElementById('frequencyGroup');
  const frequencySelect = document.getElementById('cleaningFrequency');

  if (cleaningTypeSelect && frequencyGroup && frequencySelect) {
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
  }

});
