// Navigation component: mobile menu toggle + smooth scroll + a11y
// Idempotent: safe to call multiple times
// Upraveno pro strukturu z návrhu (site-header, brand, nav-toggle, site-nav, nav-link)

export function initNav() {
  if (document.documentElement.dataset.navInit === '1') return;
  document.documentElement.dataset.navInit = '1';

  const headerEl = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');

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
        const headerOffset = headerEl ? headerEl.offsetHeight : 0;
        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = Math.max(0, elementPosition - headerOffset - 20);
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
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
      const headerOffset = headerEl ? headerEl.offsetHeight : 0;
      const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = Math.max(0, elementPosition - headerOffset - 20);
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    });
  }

  // Mobile menu toggle
  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
      siteNav.classList.toggle('is-open');
      const isExpanded = siteNav.classList.contains('is-open');
      menuToggle.setAttribute('aria-expanded', String(isExpanded));
    });

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
    window.addEventListener('resize', handleResize, { passive: true });
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
