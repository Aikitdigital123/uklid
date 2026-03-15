/**
 * Shared: vyplní [data-current-year] aktuálním rokem (patička na všech stránkách).
 * Idempotent, bez závislostí.
 */
export function initCurrentYear() {
  if (document.documentElement.dataset.currentYearInit === '1') return;
  document.documentElement.dataset.currentYearInit = '1';

  const year = String(new Date().getFullYear());
  document.querySelectorAll('[data-current-year]').forEach((el) => {
    el.textContent = year;
  });
}
