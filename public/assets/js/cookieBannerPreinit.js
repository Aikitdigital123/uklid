// Preinit cookie banner visibility before first paint.
// This script only toggles a data-attribute on <html> to prevent flash
// when consent is already known.
(function () {
  var key = 'lesktop_cookie_consent';

  function readConsent(storage) {
    if (!storage || typeof storage.getItem !== 'function') return null;
    try {
      var value = storage.getItem(key);
      return value === 'all' || value === 'necessary' ? value : null;
    } catch (e) {
      return null;
    }
  }

  var value = readConsent(window.localStorage) || readConsent(window.sessionStorage);
  if (value === 'all' || value === 'necessary') {
    document.documentElement.dataset.cookieBannerHidden = '1';
  }
})();
