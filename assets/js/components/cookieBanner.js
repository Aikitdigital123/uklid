export function initCookieBanner() {
  if (document.documentElement.dataset.cookieBannerInit === '1') return;

  const banner = document.getElementById('cookie-banner');
  if (!banner) return;
  document.documentElement.dataset.cookieBannerInit = '1';

  const acceptButton = document.getElementById('cookie-accept');
  const necessaryButton = document.getElementById('cookie-necessary');
  const storageKey = 'lesktop_cookie_consent';
  const memoryKey = '__lesktopCookieConsent';
  const measurementId = 'G-FLL5D5LE75';
  const adsId = 'AW-17893281939';

  const consentGranted = {
    analytics_storage: 'granted',
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted'
  };

  const consentDenied = {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  };

  const normalizeConsent = (value) => (value === 'all' || value === 'necessary' ? value : null);

  window.lesktopTrackEvent = function lesktopTrackEvent() {
    if (typeof window.gtag === 'function') {
      window.gtag.apply(window, arguments);
      return true;
    }
    return false;
  };

  const applyConsent = (consentValue) => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('consent', 'update', consentValue === 'all' ? consentGranted : consentDenied);
  };

  const clearCookieByName = (name) => {
    if (!name) return;

    const hostParts = (window.location.hostname || '').split('.');
    const candidateDomains = [''];

    if (hostParts.length >= 2) {
      candidateDomains.push(`.${hostParts.slice(-2).join('.')}`);
    }

    candidateDomains.forEach((domain) => {
      const domainPart = domain ? `; domain=${domain}` : '';
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domainPart}`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax${domainPart}`;
    });
  };

  const deleteGaCookies = () => {
    document.cookie.split(';').forEach((cookie) => {
      const [name] = cookie.split('=');
      const trimmed = name ? name.trim() : '';
      if (trimmed && (trimmed.indexOf('_ga') === 0 || trimmed === '_gid')) {
        clearCookieByName(trimmed);
      }
    });
  };

  const removeStoredConsent = (storage) => {
    if (!storage || typeof storage.removeItem !== 'function') return;
    try {
      storage.removeItem(storageKey);
    } catch (e) {
      // Ignore cleanup failures in restricted browsers.
    }
  };

  const readStoredConsent = (storage) => {
    if (!storage || typeof storage.getItem !== 'function') return null;

    try {
      const value = normalizeConsent(storage.getItem(storageKey));
      if (value) return value;
      removeStoredConsent(storage);
    } catch (e) {
      // Ignore inaccessible storage and fall back to another source.
    }

    return null;
  };

  const rememberConsent = (value) => {
    const normalizedValue = normalizeConsent(value);
    if (!normalizedValue) return;

    try {
      localStorage.setItem(storageKey, normalizedValue);
    } catch (e) {
      // Ignore localStorage failures.
    }

    try {
      sessionStorage.setItem(storageKey, normalizedValue);
    } catch (e) {
      // Ignore sessionStorage failures.
    }

    window[memoryKey] = normalizedValue;
  };

  const hideBanner = () => {
    banner.classList.add('is-hidden');
    banner.setAttribute('aria-hidden', 'true');
    document.documentElement.dataset.cookieBannerHidden = '1';
  };

  const showBanner = () => {
    banner.classList.remove('is-hidden');
    banner.setAttribute('aria-hidden', 'false');
    delete document.documentElement.dataset.cookieBannerHidden;
  };

  const applyConsentChoice = (value, options = {}) => {
    const { persist = true, hide = true } = options;

    applyConsent(value);

    if (value !== 'all') {
      deleteGaCookies();
    }

    if (persist) {
      rememberConsent(value);
    }

    if (hide) {
      hideBanner();
    }
  };

  const isBannerHiddenInDOM =
    banner.classList.contains('is-hidden') || banner.getAttribute('aria-hidden') === 'true';

  const storedConsent =
    readStoredConsent(window.localStorage) ||
    readStoredConsent(window.sessionStorage) ||
    normalizeConsent(window[memoryKey]);

  if (storedConsent === 'all') {
    applyConsentChoice('all', { persist: false, hide: !isBannerHiddenInDOM });
    return;
  }

  if (storedConsent === 'necessary') {
    applyConsentChoice('necessary', { persist: false, hide: !isBannerHiddenInDOM });
    return;
  }

  if (!isBannerHiddenInDOM) {
    showBanner();
  }

  const bindConsentAction = (button, value) => {
    if (!button) return;

    let recentlyHandled = false;
    const onActivate = (event) => {
      if (event && event.type === 'touchend') event.preventDefault();
      if (recentlyHandled) return;

      recentlyHandled = true;
      applyConsentChoice(value);

      if (typeof window.lesktopTrackEvent === 'function') {
        const consentEvent = value === 'all' ? 'cookie_consent_accepted' : 'cookie_consent_necessary_only';
        window.lesktopTrackEvent('event', consentEvent);
      }

      window.setTimeout(() => {
        recentlyHandled = false;
      }, 500);
    };

    button.addEventListener('click', onActivate, false);
    button.addEventListener('touchend', onActivate, false);
    button.addEventListener(
      'keyup',
      (event) => {
        if (!event) return;
        if (event.key === 'Enter' || event.key === ' ') onActivate(event);
      },
      false
    );
  };

  bindConsentAction(acceptButton, 'all');
  bindConsentAction(necessaryButton, 'necessary');
}
