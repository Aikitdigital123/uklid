// Navigation component: mobile menu toggle + smooth scroll + a11y
// Idempotent: safe to call multiple times

export function initNav() {
  if (document.documentElement.dataset.navInit === '1') return;
  document.documentElement.dataset.navInit = '1';

  const headerEl = document.querySelector('.main-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('.nav-list');

  // Note: we avoid mutating CSS variables from JS to keep layout stable.

  // A11y attributes
  if (menuToggle) {
    if (!menuToggle.hasAttribute('aria-expanded')) menuToggle.setAttribute('aria-expanded', 'false');
    if (navList) {
      if (!navList.id) navList.id = 'main-menu';
      if (!menuToggle.hasAttribute('aria-controls')) menuToggle.setAttribute('aria-controls', navList.id);
    }
  }

  // Smooth scroll for main nav anchors
  const navAnchors = document.querySelectorAll('.main-nav .nav-list a[href^="#"]');
  navAnchors.forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      // Close mobile menu if open
      if (navList && menuToggle && navList.classList.contains('active')) {
        navList.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
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
      document.querySelectorAll('.main-nav .nav-list a').forEach((link) => link.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Smooth scroll for logo link (doesn't touch nav active state)
  const logoLink = document.querySelector('a.logo[href^="#"]');
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
  if (menuToggle && navList) {
    menuToggle.addEventListener('click', () => {
      navList.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      const isExpanded = navList.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', String(isExpanded));
      // Keep hamburger icon even when menu is open (no X icon)
      if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
        icon.classList.remove('fa-xmark');
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navList.classList.contains('active')) {
        navList.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });
  }
}
