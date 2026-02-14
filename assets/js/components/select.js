// Select module - reliability mode.
// Uses native <select> controls for robust behavior on mobile and desktop.

export function initSelects() {
  if (document.documentElement.dataset.selectInit === '1') return;
  document.documentElement.dataset.selectInit = '1';

  const ids = ['cleaningType', 'cleaningFrequency'];

  ids.forEach((id) => {
    const select = document.getElementById(id);
    if (!(select instanceof HTMLSelectElement)) return;

    // Ensure classic dropdown behavior.
    select.multiple = false;
    select.removeAttribute('multiple');
    select.removeAttribute('size');

    // Clean wrappers from earlier custom-select experiments.
    const wrapper = select.closest('.select-modern, .dropdown-wrap, .dropdown-container');
    if (wrapper && wrapper.parentElement) {
      wrapper.parentElement.insertBefore(select, wrapper);
      wrapper.remove();
    }

    // Remove custom-select artifacts.
    select.classList.remove('select-hidden');
    select.style.position = '';
    select.style.left = '';
    select.style.width = '';
    select.style.height = '';
    select.style.opacity = '';
    select.style.pointerEvents = '';
    select.style.visibility = '';
    delete select.dataset.customSelectInit;
  });
}
