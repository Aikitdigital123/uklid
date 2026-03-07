/**
 * Page init: homepage (index). Jen viditelnost pole „Frekvence úklidu“ podle „Typ úklidu“.
 * Guard: indexPageInit. Volá main.bundle.js po DOM ready a při bfcache reinit.
 */
const PAGE_INIT_KEY = 'indexPageInit';

/** Typy úklidu, u kterých se zobrazí pole frekvence */
const TYPES_REQUIRING_FREQUENCY = [
  'Pravidelný úklid domácnosti',
  'Úklid komerčních prostor (kanceláře, obchody)',
];

export function initIndexPage() {
  if (document.documentElement.dataset[PAGE_INIT_KEY] === '1') return;

  const cleaningTypeSelect = document.getElementById('cleaningType');
  const frequencyGroup = document.getElementById('frequencyGroup');
  const frequencySelect = document.getElementById('cleaningFrequency');
  if (!cleaningTypeSelect || !frequencyGroup || !frequencySelect) return;

  document.documentElement.dataset[PAGE_INIT_KEY] = '1';

  function toggleFrequencyDisplay() {
    const show = TYPES_REQUIRING_FREQUENCY.includes(cleaningTypeSelect.value);
    if (show) {
      frequencyGroup.classList.remove('form-group-hidden');
      frequencySelect.setAttribute('required', 'required');
    } else {
      frequencyGroup.classList.add('form-group-hidden');
      frequencySelect.removeAttribute('required');
      frequencySelect.value = '';
      frequencySelect.classList.remove('is-valid', 'is-invalid');
    }
  }

  if (window.__lesktopIndexPageChangeHandler) {
    cleaningTypeSelect.removeEventListener('change', window.__lesktopIndexPageChangeHandler);
  }
  window.__lesktopIndexPageChangeHandler = toggleFrequencyDisplay;
  cleaningTypeSelect.addEventListener('change', toggleFrequencyDisplay);
  toggleFrequencyDisplay();
}
