export function initCookieBanner() {
  if (document.documentElement.dataset.cookieBannerInit === '1') return;

  const banner = document.getElementById('cookie-banner');
  if (!banner) return;
  document.documentElement.dataset.cookieBannerInit = '1';

  const acceptButton = document.getElementById('cookie-accept');
  const necessaryButton = document.getElementById('cookie-necessary');
  const storageKey = 'lesktop_cookie_consent';
  const measurementId = 'G-FLL5D5LE75';
  const adsId = 'AW-17893281939';
  const gtagSrc = `https://www.googletagmanager.com/gtag/js?id=${adsId}`;

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

  const disableTracking = () => {
    window[`ga-disable-${measurementId}`] = true;
  };

  const enableTracking = () => {
    window[`ga-disable-${measurementId}`] = false;
  };

  // Safe default: until explicit consent, tracking stays disabled.
  disableTracking();

  window.lesktopTrackEvent = function lesktopTrackEvent() {
    if (window[`ga-disable-${measurementId}`]) return false;
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

  const loadGtagScript = () => {
    const existingScript = document.querySelector(`script[src="${gtagSrc}"]`);
    if (existingScript) return;
    const script = document.createElement('script');
    script.async = true;
    script.src = gtagSrc;
    document.head.appendChild(script);
  };

  const ensureGtag = (consentValue) => {
    if (!window.__lesktopGtagLoaded) {
      window.__lesktopGtagLoaded = true;
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
      loadGtagScript();
    }

    if (!window.__lesktopGtagConfigured) {
      window.__lesktopGtagConfigured = true;
      const defaultConsent = {
        analytics_storage: consentDenied.analytics_storage,
        ad_storage: consentDenied.ad_storage,
        ad_user_data: consentDenied.ad_user_data,
        ad_personalization: consentDenied.ad_personalization,
        wait_for_update: 500
      };

      window.gtag('js', new Date());
      window.gtag('consent', 'default', defaultConsent);

      window.gtag('config', measurementId, {
        anonymize_ip: true,
        allow_google_signals: true,
        allow_ad_personalization_signals: true
      });

      window.gtag('config', adsId, {
        allow_google_signals: true,
        allow_ad_personalization_signals: true
      });

      if (document.body && document.body.dataset && document.body.dataset.page === '404') {
        window.gtag('event', 'error_404');
      }
    }

    applyConsent(consentValue);
  };

  const clearCookieByName = (name) => {
    if (!name) return;

    const hostParts = (window.location.hostname || '').split('.');
    const candidateDomains = [''];

    if (hostParts.length >= 2) {
      const rootDomain = `.${hostParts.slice(-2).join('.')}`;
      candidateDomains.push(rootDomain);
    }

    candidateDomains.forEach((domain) => {
      const domainPart = domain ? `; domain=${domain}` : '';
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domainPart}`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax${domainPart}`;
    });
  };

  const deleteGaCookies = () => {
    const cookies = document.cookie.split(';');
    cookies.forEach((cookie) => {
      const [name] = cookie.split('=');
      const trimmed = name ? name.trim() : '';
      if (trimmed && (trimmed.indexOf('_ga') === 0 || trimmed === '_gid')) {
        clearCookieByName(trimmed);
      }
    });
  };

  const setStoredConsent = (value) => {
    try {
      localStorage.setItem(storageKey, value);
    } catch (e) {
      // localStorage can be unavailable in private mode
    }
  };

  const hideBanner = () => {
    banner.classList.add('is-hidden');
    banner.setAttribute('aria-hidden', 'true');
  };

  const showBanner = () => {
    banner.classList.remove('is-hidden');
    banner.setAttribute('aria-hidden', 'false');
  };

  const applyConsentChoice = (value) => {
    if (value === 'all') {
      enableTracking();
      ensureGtag('all');
    } else {
      disableTracking();
      if (window.__lesktopGtagConfigured) {
        applyConsent('necessary');
      }
      deleteGaCookies();
    }
    hideBanner();
  };

  let storedConsent = null;
  try {
    storedConsent = localStorage.getItem(storageKey);
  } catch (e) {
    // localStorage can be unavailable in private mode
  }

  if (storedConsent === 'all') {
    applyConsentChoice('all');
    return;
  }

  if (storedConsent === 'necessary') {
    applyConsentChoice('necessary');
    return;
  }

  showBanner();

  const bindConsentAction = (button, value) => {
    if (!button) return;

    let recentlyHandled = false;
    const onActivate = (event) => {
      if (event && event.type === 'touchend') event.preventDefault();
      if (recentlyHandled) return;

      recentlyHandled = true;
      setStoredConsent(value);
      applyConsentChoice(value);

      window.setTimeout(() => {
        recentlyHandled = false;
      }, 500);
    };

    button.addEventListener('click', onActivate, false);
    button.addEventListener('touchend', onActivate, false);
    button.addEventListener('keyup', (event) => {
      if (!event) return;
      if (event.key === 'Enter' || event.key === ' ') onActivate(event);
    }, false);
  };

  bindConsentAction(acceptButton, 'all');
  bindConsentAction(necessaryButton, 'necessary');
}
