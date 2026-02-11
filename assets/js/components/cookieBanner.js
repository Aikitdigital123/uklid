export function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;

  const acceptButton = document.getElementById('cookie-accept');
  const necessaryButton = document.getElementById('cookie-necessary');
  const storageKey = 'lesktop_cookie_consent';
  const measurementId = 'G-FLL5D5LE75';

  const disableGa = () => {
    window[`ga-disable-${measurementId}`] = true;
  };

  window.lesktopTrackEvent = (...args) => {
    if (window[`ga-disable-${measurementId}`]) return false;
    if (typeof window.gtag === 'function') {
      window.gtag(...args);
      return true;
    }
    return false;
  };

  const gtagSrc = 'https://www.googletagmanager.com/gtag/js?id=AW-17893281939';

  const loadGa4 = () => {
    if (window.__lesktopGtagLoaded) return;
    window.__lesktopGtagLoaded = true;

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    window.gtag('js', new Date());
    window.gtag('config', measurementId);
    window.gtag('config', 'AW-17893281939');

    const existingScript = document.querySelector(`script[src="${gtagSrc}"]`);
    if (!existingScript) {
      const script = document.createElement('script');
      script.async = true;
      script.src = gtagSrc;
      document.head.appendChild(script);
    }

    if (document.body?.dataset.page === '404') {
      window.gtag('event', 'error_404');
    }
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

  const storedConsent = localStorage.getItem(storageKey);
  if (storedConsent === 'all') {
    loadGa4();
    banner.classList.add('is-hidden');
    return;
  }
  if (storedConsent === 'necessary') {
    disableGa();
    deleteGaCookies();
    banner.classList.add('is-hidden');
    return;
  }

  if (acceptButton) {
    acceptButton.addEventListener('click', () => {
      localStorage.setItem(storageKey, 'all');
      loadGa4();
      banner.classList.add('is-hidden');
    });
  }

  if (necessaryButton) {
    necessaryButton.addEventListener('click', () => {
      localStorage.setItem(storageKey, 'necessary');
      disableGa();
      deleteGaCookies();
      banner.classList.add('is-hidden');
    });
  }
}
