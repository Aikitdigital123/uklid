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

  window.lesktopTrackEvent = (...args) => {
    if (window[`ga-disable-${measurementId}`]) return false;
    if (typeof window.gtag === 'function') {
      window.gtag(...args);
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
      window.gtag('js', new Date());
      window.gtag('consent', 'default', {
        ...consentDenied,
        wait_for_update: 500
      });

      window.gtag('config', measurementId, {
        anonymize_ip: true,
        allow_google_signals: true,
        allow_ad_personalization_signals: true
      });

      window.gtag('config', adsId, {
        allow_google_signals: true,
        allow_ad_personalization_signals: true
      });

      if (document.body?.dataset.page === '404') {
        window.gtag('event', 'error_404');
      }
    }

    applyConsent(consentValue);
  };

  const deleteGaCookies = () => {
    const cookies = document.cookie.split(';');
    cookies.forEach((cookie) => {
      const [name] = cookie.split('=');
      const trimmed = name?.trim();
      if (trimmed && (trimmed.startsWith('_ga') || trimmed === '_gid')) {
        document.cookie = `${trimmed}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
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
    banner.classList.add('is-hidden');
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

  if (acceptButton) {
    acceptButton.addEventListener('click', () => {
      setStoredConsent('all');
      applyConsentChoice('all');
    });
  }

  if (necessaryButton) {
    necessaryButton.addEventListener('click', () => {
      setStoredConsent('necessary');
      applyConsentChoice('necessary');
    });
  }
}
