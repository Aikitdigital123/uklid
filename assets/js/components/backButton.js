// Header back button: safe history.back() with fallback to the homepage of the current language.
export function initBackButton() {
  const INIT_KEY = 'backButtonInit';
  if (document.documentElement.dataset[INIT_KEY] === '1') return;
  document.documentElement.dataset[INIT_KEY] = '1';

  const buttons = document.querySelectorAll('[data-back-button]');
  if (!buttons.length) return;

  function canUseBack() {
    // Prefer referrer because it's the safest indicator of a same-site history.
    const ref = document.referrer;
    if (ref) {
      try {
        return new URL(ref).origin === window.location.origin;
      } catch {
        return false;
      }
    }

    // Fallback: only when history is likely available.
    try {
      return (history && history.length > 1) || false;
    } catch {
      return false;
    }
  }

  function getFallbackUrl(btn) {
    if (btn?.dataset?.backFallback) return btn.dataset.backFallback;
    return 'index.html';
  }

  buttons.forEach((btn) => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      const fallback = getFallbackUrl(btn);
      if (canUseBack()) window.history.back();
      else window.location.assign(fallback);
    });
  });
}

