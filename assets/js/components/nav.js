// Navigation component: mobile menu toggle + smooth scroll + a11y
// Idempotent: safe to call multiple times
// Upraveno pro strukturu z návrhu (site-header, brand, nav-toggle, site-nav, nav-link)

export function initNav() {
  if (document.documentElement.dataset.navInit === '1') return;
  document.documentElement.dataset.navInit = '1';

  const headerEl = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');
  const scrollToY = (top) => {
    try {
      window.scrollTo({ top: top, behavior: 'smooth' });
    } catch (e) {
      window.scrollTo(0, top);
    }
  };

  // A11y attributes
  if (menuToggle) {
    if (!menuToggle.hasAttribute('aria-expanded')) menuToggle.setAttribute('aria-expanded', 'false');
    if (siteNav) {
      if (!siteNav.id) siteNav.id = 'main-menu';
      if (!menuToggle.hasAttribute('aria-controls')) menuToggle.setAttribute('aria-controls', siteNav.id);
    }
  }

  // Smooth scroll for main nav anchors
  const navAnchors = document.querySelectorAll('.site-nav .nav-link[href^="#"]');
  navAnchors.forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      // Close mobile menu if open (mobile only)
      if (siteNav && menuToggle && siteNav.classList.contains('is-open') && window.innerWidth <= 768) {
        siteNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        try {
          const headerOffset = headerEl ? headerEl.offsetHeight : 0;
          const rect = targetElement.getBoundingClientRect();
          
          // Bezpečná kontrola, zda getBoundingClientRect vrátil validní hodnoty
          if (rect && typeof rect.top === 'number' && isFinite(rect.top)) {
            const pageYOffset = window.pageYOffset || document.documentElement.scrollTop || 0;
            const elementPosition = rect.top + pageYOffset;
            const offsetPosition = Math.max(0, elementPosition - headerOffset - 20);
            scrollToY(offsetPosition);
          } else {
            // Fallback: použij offsetTop pokud getBoundingClientRect selhal
            const offsetTop = targetElement.offsetTop || 0;
            const offsetPosition = Math.max(0, offsetTop - headerOffset - 20);
            scrollToY(offsetPosition);
          }
        } catch (e) {
          // Fallback při chybě: použij offsetTop
          try {
            const headerOffset = headerEl ? headerEl.offsetHeight : 0;
            const offsetTop = targetElement.offsetTop || 0;
            const offsetPosition = Math.max(0, offsetTop - headerOffset - 20);
            scrollToY(offsetPosition);
          } catch (fallbackError) {
            // Pokud i fallback selhal, scrolluj na začátek sekce
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }

      // Active state within nav only
      document.querySelectorAll('.site-nav .nav-link').forEach((link) => link.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Smooth scroll for logo link (doesn't touch nav active state)
  const logoLink = document.querySelector('a.brand[href^="#"]');
  if (logoLink) {
    logoLink.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      e.preventDefault();
      try {
        const headerOffset = headerEl ? headerEl.offsetHeight : 0;
        const rect = targetElement.getBoundingClientRect();
        
        // Bezpečná kontrola, zda getBoundingClientRect vrátil validní hodnoty
        if (rect && typeof rect.top === 'number' && isFinite(rect.top)) {
          const pageYOffset = window.pageYOffset || document.documentElement.scrollTop || 0;
          const elementPosition = rect.top + pageYOffset;
          const offsetPosition = Math.max(0, elementPosition - headerOffset - 20);
          scrollToY(offsetPosition);
        } else {
          // Fallback: použij offsetTop pokud getBoundingClientRect selhal
          const offsetTop = targetElement.offsetTop || 0;
          const offsetPosition = Math.max(0, offsetTop - headerOffset - 20);
          scrollToY(offsetPosition);
        }
      } catch (e) {
        // Fallback při chybě: použij offsetTop
        try {
          const headerOffset = headerEl ? headerEl.offsetHeight : 0;
          const offsetTop = targetElement.offsetTop || 0;
          const offsetPosition = Math.max(0, offsetTop - headerOffset - 20);
          scrollToY(offsetPosition);
        } catch (fallbackError) {
          // Pokud i fallback selhal, scrolluj na začátek sekce
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  // Mobile menu toggle - jednoduché a robustní řešení s ochranou proti duplicitě
  if (menuToggle && siteNav) {
    // Funkce pro toggle menu (idempotentní)
    const toggleMenu = () => {
      siteNav.classList.toggle('is-open');
      const isExpanded = siteNav.classList.contains('is-open');
      menuToggle.setAttribute('aria-expanded', String(isExpanded));
    };

    // Ochrana proti duplicitnímu volání při jednom tapu
    let isProcessing = false;
    let lastToggleTime = 0;
    const TOGGLE_COOLDOWN = 300; // Minimální interval mezi toggle akcemi (ms)

    const handleToggle = (e) => {
      // Pokud už probíhá zpracování, ignoruj
      if (isProcessing) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      const currentTime = Date.now();
      const timeDiff = currentTime - lastToggleTime;
      
      // Pokud proběhlo toggle příliš nedávno, ignoruj (ochrana proti double-tap)
      if (timeDiff < TOGGLE_COOLDOWN) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      
      isProcessing = true;
      lastToggleTime = currentTime;
      
      toggleMenu();
      
      // Reset flagu po krátké prodlevě
      setTimeout(() => {
        isProcessing = false;
      }, TOGGLE_COOLDOWN);
    };

    // Pouze touchend s preventDefault - zabrání následnému click eventu
    // Toto je nejspolehlivější řešení pro Safari mobile
    menuToggle.addEventListener('touchend', (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleToggle(e);
    }, { passive: false });

    // Click jako fallback pro desktop (kde touchend neproběhne)
    // isProcessing flag zajistí, že pokud už proběhl touchend, click bude ignorován
    menuToggle.addEventListener('click', handleToggle);

    // Resize handler with throttling to prevent excessive calls
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (window.innerWidth > 768 && siteNav.classList.contains('is-open')) {
          siteNav.classList.remove('is-open');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      }, 150);
    };
    window.addEventListener('resize', handleResize, false);
  }

  // Header scroll effect - vypnuto (header nemá měnit barvu)
  // if (headerEl) {
  //   function handleScroll() {
  //     if (window.scrollY > 20) {
  //       headerEl.classList.add('is-scrolled');
  //     } else {
  //       headerEl.classList.remove('is-scrolled');
  //     }
  //   }
  //   
  //   // Check on load
  //   handleScroll();
  //   
  //   // Listen to scroll events
  //   window.addEventListener('scroll', handleScroll, { passive: true });
  // }
}
