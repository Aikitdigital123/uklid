// Custom select component (progressive enhancement)
// Transforms native <select> into accessible custom UI
// Idempotent via data-select-init to avoid duplicate wiring

export function initSelects() {
  if (document.documentElement.dataset.selectInit === '1') return;
  document.documentElement.dataset.selectInit = '1';

  const buildCustomSelect = (nativeSelect) => {
    if (!nativeSelect || nativeSelect.classList.contains('select-hidden')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'select-modern';
    wrapper.setAttribute('data-name', nativeSelect.name || '');

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'select-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    const triggerLabel = document.createElement('span');
    triggerLabel.className = 'select-label';
    trigger.appendChild(triggerLabel);
    const caret = document.createElement('span');
    caret.className = 'select-caret';
    trigger.appendChild(caret);

    const menu = document.createElement('ul');
    menu.className = 'select-menu';
    menu.setAttribute('role', 'listbox');

    const options = Array.from(nativeSelect.options);
    options.forEach((opt) => {
      const li = document.createElement('li');
      li.className = 'select-option';
      li.setAttribute('role', 'option');
      li.dataset.value = opt.value;
      li.textContent = opt.textContent;
      if (opt.selected) {
        li.classList.add('is-selected');
        li.setAttribute('aria-selected', 'true');
      }
      menu.appendChild(li);
    });

    nativeSelect.classList.add('select-hidden');
    nativeSelect.parentNode.insertBefore(wrapper, nativeSelect);
    wrapper.appendChild(nativeSelect);
    wrapper.appendChild(trigger);
    wrapper.appendChild(menu);

    const syncLabel = () => {
      const sel = options[nativeSelect.selectedIndex];
      triggerLabel.textContent = sel ? sel.textContent : '';
    };
    syncLabel();

    const openMenu = () => { wrapper.classList.add('open'); trigger.setAttribute('aria-expanded', 'true'); };
    const closeMenu = () => { wrapper.classList.remove('open'); trigger.setAttribute('aria-expanded', 'false'); };
    trigger.addEventListener('click', () => {
      if (wrapper.classList.contains('open')) closeMenu(); else openMenu();
    });

    menu.addEventListener('click', (e) => {
      const li = e.target.closest('.select-option');
      if (!li) return;
      const value = li.dataset.value;
      const idx = options.findIndex((o) => o.value === value);
      if (idx >= 0) {
        nativeSelect.selectedIndex = idx;
        options.forEach((o) => (o.selected = false));
        options[idx].selected = true;
        menu.querySelectorAll('.select-option').forEach((o) => { o.classList.remove('is-selected'); o.removeAttribute('aria-selected'); });
        li.classList.add('is-selected');
        li.setAttribute('aria-selected', 'true');
        syncLabel();
        nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));
        closeMenu();
      }
    });

    // Close on outside click / escape
    document.addEventListener('click', (e) => { if (!wrapper.contains(e.target)) closeMenu(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  };

  // Initialize specific selects if present
  buildCustomSelect(document.getElementById('cleaningType'));
  buildCustomSelect(document.getElementById('cleaningFrequency'));
}

