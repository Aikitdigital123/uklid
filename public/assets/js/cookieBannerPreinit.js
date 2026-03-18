// Preinit cookie banner visibility before first paint.
// This script ONLY toggles a data-attribute on <html> to prevent flash when consent is already stored.
// It does NOT initialize analytics/ads and does NOT change any tracking/gtag state.
(function () {
  try {
    var key = 'lesktop_cookie_consent';
    var val = window.localStorage && window.localStorage.getItem(key);
    if (val === 'all' || val === 'necessary') {
      document.documentElement.dataset.cookieBannerHidden = '1';
    }
  } catch (e) {
    // localStorage may be unavailable (private mode). In that case we keep the banner visible as a fallback.
  }
})();
