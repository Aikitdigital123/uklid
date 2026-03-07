/**
 * Header & navigation: smooth scroll, mobile menu, a11y.
 * Single source of truth for menu open state; all updates go through setMenuOpen().
 */
const BREAKPOINT_MOBILE_PX = 768;
const SCROLL_OFFSET_PX = 20;
const RESIZE_DEBOUNCE_MS = 150;
const INIT_GUARD_KEY = 'navInit';

function isMobile() {
  return typeof window !== 'undefined' && window.innerWidth <= BREAKPOINT_MOBILE_PX;
}

function scrollToY(top) {
  try {
    window.scrollTo({ top, behavior: 'smooth' });
  } catch {
    window.scrollTo(0, top);
  }
}

/**
 * Compute scroll position for a section, accounting for fixed header.
 */
function getScrollTargetY(element, headerHeight) {
  const top = element.getBoundingClientRect().top;
  const pageY = window.pageYOffset ?? document.documentElement.scrollTop ?? 0;
  return Math.max(0, top + pageY - headerHeight - SCROLL_OFFSET_PX);
}

export function initNav() {
  if (document.documentElement.dataset[INIT_GUARD_KEY] === '1') return;
  document.documentElement.dataset[INIT_GUARD_KEY] = '1';

  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');

  const headerHeight = () => (header ? header.offsetHeight : 0);

  // --- State: menu open (only writer is setMenuOpen) ---
  let menuOpen = false;

  function setMenuOpen(open) {
    menuOpen = open;
    if (!nav) return;
    nav.classList.toggle('is-open', open);
    if (toggle) toggle.setAttribute('aria-expanded', String(open));
  }

  function closeMenuIfNeeded() {
    if (isMobile() && menuOpen) setMenuOpen(false);
  }

  // --- A11y: ensure toggle and nav are linked ---
  if (toggle && nav) {
    if (!nav.id) nav.id = 'site-navigation';
    if (!toggle.getAttribute('aria-controls')) toggle.setAttribute('aria-controls', nav.id);
    if (!toggle.hasAttribute('aria-expanded')) toggle.setAttribute('aria-expanded', 'false');
  }

  // --- Nav links: smooth scroll, close mobile menu, set active ---
  const navLinks = document.querySelectorAll('.site-nav .nav-link[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      closeMenuIfNeeded();

      const id = link.getAttribute('href');
      const target = id ? document.querySelector(id) : null;
      if (target) {
        const y = getScrollTargetY(target, headerHeight());
        if (Number.isFinite(y)) scrollToY(y);
        else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      navLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // --- Logo link: smooth scroll only ---
  const logo = document.querySelector('a.brand[href^="#"]');
  if (logo) {
    logo.addEventListener('click', (e) => {
      const id = logo.getAttribute('href');
      const target = id ? document.querySelector(id) : null;
      if (!target) return;
      e.preventDefault();
      const y = getScrollTargetY(target, headerHeight());
      if (Number.isFinite(y)) scrollToY(y);
      else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // --- Mobile menu toggle (Safari: touchend + click without double toggle) ---
  if (toggle && nav) {
    let touchHandled = false;

    toggle.addEventListener('touchstart', () => {
      touchHandled = false;
    }, { passive: true });

    toggle.addEventListener('touchend', (e) => {
      e.preventDefault();
      e.stopPropagation();
      touchHandled = true;
      setMenuOpen(!menuOpen);
    }, { passive: false });

    toggle.addEventListener('click', (e) => {
      if (touchHandled) {
        e.preventDefault();
        e.stopPropagation();
        touchHandled = false;
        return;
      }
      setMenuOpen(!menuOpen);
    });

    let resizeTimer;
    const resizeHandler = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > BREAKPOINT_MOBILE_PX && menuOpen) setMenuOpen(false);
      }, RESIZE_DEBOUNCE_MS);
    };
    if (window.__lesktopNavResizeHandler) {
      window.removeEventListener('resize', window.__lesktopNavResizeHandler);
    }
    window.__lesktopNavResizeHandler = resizeHandler;
    window.addEventListener('resize', resizeHandler);
  }
}
