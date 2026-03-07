// Back to top button component
// Creates a floating button that appears after scrolling down

export function initBackToTop() {
  if (document.documentElement.dataset.backToTopInit === '1') return;
  document.documentElement.dataset.backToTopInit = '1';

  // Kontrola, zda už existuje back-to-top tlačítko v DOM (při reinicializaci z bfcache)
  let btn = document.querySelector('.back-to-top');
  
  if (!btn) {
    // Tlačítko neexistuje, vytvořit nové
    btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Zpět na začátek');
    btn.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
    document.body.appendChild(btn);
  } else {
    // Tlačítko už existuje, odstranit staré event listeners (pokud existují)
    // a připravit pro nové použití
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    btn = newBtn;
  }

  const scrollToTop = () => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      window.scrollTo(0, 0);
    }
  };

  btn.addEventListener('click', () => {
    scrollToTop();
  });

  const isCookieBannerVisible = () => {
    const cookieBanner = document.getElementById('cookie-banner');
    return !!(cookieBanner && !cookieBanner.classList.contains('is-hidden'));
  };

  const toggle = () => {
    if (isCookieBannerVisible()) {
      btn.classList.remove('visible');
      return;
    }

    const y = window.pageYOffset || document.documentElement.scrollTop;
    if (y > 200) btn.classList.add('visible');
    else btn.classList.remove('visible');
  };

  // Throttled scroll handler for better performance
  let scrollTimeout;
  const handleScroll = () => {
    if (!scrollTimeout) {
      scrollTimeout = requestAnimationFrame(() => {
        toggle();
        scrollTimeout = null;
      });
    }
  };

  if (window.__lesktopBackToTopScroll) {
    window.removeEventListener('scroll', window.__lesktopBackToTopScroll, { passive: true });
    window.removeEventListener('load', window.__lesktopBackToTopLoad);
  }
  window.__lesktopBackToTopScroll = handleScroll;
  window.__lesktopBackToTopLoad = toggle;
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('load', toggle);
}
