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

  initCalculatorExpandable();
}

/**
 * Progressive disclosure pro kalkulačku:
 * Pokud je v checkbox-group hodně položek, schová je a přidá tlačítko "Zobrazit více".
 */
function initCalculatorExpandable() {
  const group = document.querySelector('#kalkulacka .checkbox-group');
  if (!group) return;
  // Prevent duplication if re-initialized
  if (group.nextElementSibling && group.nextElementSibling.classList.contains('btn-expand-services')) return;

  // Získáme všechny přímé potomky (obaly checkboxů)
  const items = Array.from(group.children);
  const VISIBLE_LIMIT = 6; // Počet viditelných položek (2 řádky na desktopu)

  if (items.length <= VISIBLE_LIMIT) return;

  // Skryjeme položky nad limit
  const hiddenItems = items.slice(VISIBLE_LIMIT);
  hiddenItems.forEach(item => item.classList.add('checkbox-item-hidden'));

  // Vytvoříme tlačítko
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn-expand-services';
  btn.innerHTML = `Zobrazit další služby (+${hiddenItems.length}) <i class="fas fa-chevron-down"></i>`;
  
  // Vložíme tlačítko za grid
  group.after(btn);

  let isExpanded = false;

  btn.addEventListener('click', () => {
    isExpanded = !isExpanded;
    
    if (isExpanded) {
      hiddenItems.forEach(item => {
        item.classList.remove('checkbox-item-hidden');
        item.classList.add('checkbox-item-reveal');
      });
      btn.innerHTML = `Zobrazit méně <i class="fas fa-chevron-up"></i>`;
      btn.classList.add('is-expanded');
    } else {
      hiddenItems.forEach(item => {
        item.classList.add('checkbox-item-hidden');
        item.classList.remove('checkbox-item-reveal');
      });
      btn.innerHTML = `Zobrazit další služby (+${hiddenItems.length}) <i class="fas fa-chevron-down"></i>`;
      btn.classList.remove('is-expanded');
      
      // Scroll zpět na začátek gridu, aby uživatel neztratil kontext
      // Jen pokud je horní hrana gridu mimo viewport (aby to neposkočilo, když to není třeba)
      const rect = group.getBoundingClientRect();
      if (rect.top < 0) {
        const y = rect.top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  });
}
