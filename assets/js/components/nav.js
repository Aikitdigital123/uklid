/**
 * Header & navigation: smooth scroll, mobile menu, a11y.
 * Single source of truth for menu open state; all updates go through setMenuOpen().
 * iOS/iPhone: pouze click pro „tap outside“, delší suppress po otevření, resize jen při změně breakpointu.
 */
const BREAKPOINT_MOBILE_PX = 768;
const SCROLL_OFFSET_PX = 20;
const RESIZE_DEBOUNCE_MS = 200;
const INIT_GUARD_KEY = 'navInit';
const MENU_OPEN_CLASS = 'menu-open';
/** Po otevření menu ignorovat outside/duplicitní události (iOS synthetic click, dvojité fire). */
const SUPPRESS_MS = 450;

function isMobile() {
  return typeof window !== 'undefined' && window.innerWidth <= BREAKPOINT_MOBILE_PX;
}

function isMobileMedia() {
  return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
}

function scrollToY(top) {
  const behavior = isMobile() ? 'auto' : 'smooth';
  try {
    window.scrollTo({ top, behavior });
  } catch {
    window.scrollTo(0, top);
  }
}

/**
 * Compute scroll position for a section, accounting for the sticky header.
 */
function getScrollTargetY(element, headerHeight) {
  const top = element.getBoundingClientRect().top;
  const pageY = window.pageYOffset ?? document.documentElement.scrollTop ?? 0;
  return Math.max(0, top + pageY - headerHeight - SCROLL_OFFSET_PX);
}

/** V sekci scrollovat na první nadpis, aby byl hned pod headerem (sekce mají padding-top). */
function getScrollTargetElement(section) {
  if (!section) return null;
  const heading = section.querySelector('.section-title, h1, h2, h3');
  return heading || section;
}

export function initNav() {
  if (document.documentElement.dataset[INIT_GUARD_KEY] === '1') return;
  document.documentElement.dataset[INIT_GUARD_KEY] = '1';

  const header = document.querySelector('.site-header');
  if (!header) return;

  const headerInner = header.querySelector('.header-inner');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  const body = document.body;
  const docEl = document.documentElement;

  const headerHeight = () => (header ? header.offsetHeight : 0);

  /** Výška jen lišty (bez otevřeného menu) – pro scroll tak, aby sekce začínala pod headerem. */
  function getScrollOffsetForSection() {
    if (!header) return 0;
    if (isMobile() && headerInner) {
      const barHeight = headerInner.offsetHeight;
      const headerPadTop = parseFloat(getComputedStyle(header).paddingTop) || 0;
      return barHeight + headerPadTop;
    }
    return headerHeight();
  }

  // --- State: menu open (only writer is setMenuOpen) ---
  let menuOpen = false;
  let suppressOutsideUntil = 0;
  /** Čas posledního otevření menu (pro potlačení dvojitého přepnutí na iOS). */
  let lastMenuOpenTime = 0;

  function lockPageScroll() {
    if (!body) return;
    docEl.classList.add(MENU_OPEN_CLASS);
    body.classList.add(MENU_OPEN_CLASS);
  }

  function unlockPageScroll() {
    if (!body) return;
    docEl.classList.remove(MENU_OPEN_CLASS);
    body.classList.remove(MENU_OPEN_CLASS);
  }

  function setMenuOpen(open, options = {}) {
    menuOpen = open;
    if (open) lastMenuOpenTime = Date.now();
    if (!nav) return;
    nav.classList.toggle('is-open', open);
    nav.setAttribute('aria-hidden', String(!open));
    if (toggle) toggle.setAttribute('aria-expanded', String(open));
    if (isMobile() && open) {
      lockPageScroll();
      suppressOutsideUntil = Date.now() + SUPPRESS_MS;
    } else {
      unlockPageScroll(options);
    }
  }

  function closeMenuIfNeeded(options = {}) {
    if (isMobile() && menuOpen) setMenuOpen(false, options);
  }

  // --- A11y: ensure toggle and nav are linked ---
  if (toggle && nav) {
    if (!nav.id) nav.id = 'site-navigation';
    if (!toggle.getAttribute('aria-controls')) toggle.setAttribute('aria-controls', nav.id);
    if (!toggle.hasAttribute('aria-expanded')) toggle.setAttribute('aria-expanded', 'false');
    nav.setAttribute('aria-hidden', 'true');
    if (body) {
      body.classList.remove(MENU_OPEN_CLASS);
    }
    docEl.classList.remove(MENU_OPEN_CLASS);
  }

  /** Na mobilu po zavření menu přes odkaz resetovat, aby další otevření toggle fungovalo. */
  const touchHandledRef = { current: false };

  // --- Nav links: kotvy (#) = scroll + zavřít menu; odkaz na jinou stránku = jen zavřít menu ---
  const navLinksAnchor = document.querySelectorAll('.site-nav .nav-link[href^="#"]');
  navLinksAnchor.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.getAttribute('href');
      const target = id ? document.querySelector(id) : null;
      if (target) {
        const scrollToEl = getScrollTargetElement(target);
        const offset = getScrollOffsetForSection();
        const y = scrollToEl ? getScrollTargetY(scrollToEl, offset) : NaN;
        if (Number.isFinite(y)) scrollToY(y);
        else target.scrollIntoView({ behavior: isMobile() ? 'auto' : 'smooth', block: 'start' });
      }
      closeMenuIfNeeded({ restoreScroll: false });
      touchHandledRef.current = false;

      navLinksAnchor.forEach((l) => {
        l.classList.remove('active');
        l.removeAttribute('aria-current');
      });
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    });
  });

  document.querySelectorAll('.site-nav .nav-link:not([href^="#"])').forEach((link) => {
    link.addEventListener('click', () => {
      closeMenuIfNeeded({ restoreScroll: false });
      touchHandledRef.current = false;
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
      const scrollToEl = getScrollTargetElement(target);
      const offset = getScrollOffsetForSection();
      const y = scrollToEl ? getScrollTargetY(scrollToEl, offset) : NaN;
      if (Number.isFinite(y)) scrollToY(y);
      else target.scrollIntoView({ behavior: isMobile() ? 'auto' : 'smooth', block: 'start' });
    });
  }

  // --- Mobile menu toggle (iOS: jeden zdroj přepnutí, potlačení dvojitého fire) ---
  if (toggle && nav) {
    function isEventFromToggle(event) {
      const t = event && event.target;
      return t && toggle && toggle.contains(t);
    }

    function shouldSkipToggleAsDuplicate(event) {
      if (!menuOpen) return false;
      if (!isEventFromToggle(event)) return false;
      return (Date.now() - lastMenuOpenTime) < SUPPRESS_MS;
    }

    toggle.addEventListener('touchstart', () => {
      touchHandledRef.current = false;
    }, { passive: true });

    toggle.addEventListener('touchend', (e) => {
      e.preventDefault();
      e.stopPropagation();
      touchHandledRef.current = true;
      if (shouldSkipToggleAsDuplicate(e)) return;
      setMenuOpen(!menuOpen);
    }, { passive: false });

    toggle.addEventListener('click', (e) => {
      if (touchHandledRef.current) {
        e.preventDefault();
        e.stopPropagation();
        touchHandledRef.current = false;
        return;
      }
      if (shouldSkipToggleAsDuplicate(e)) return;
      e.stopPropagation();
      setMenuOpen(!menuOpen);
    });

    /* Na iOS pouze click pro zavření „tap outside“ – touchstart může mít špatný target a zavřít menu hned po otevření. */
    const outsideClickHandler = (event) => {
      if (!menuOpen || !isMobile()) return;
      if (Date.now() < suppressOutsideUntil) return;
      if (event && !event.isTrusted) return;
      const target = event && event.target;
      if (!target) return;
      if (nav.contains(target) || toggle.contains(target)) return;
      setMenuOpen(false);
      touchHandledRef.current = false;
    };

    const escapeHandler = (event) => {
      if (!menuOpen) return;
      if (!event || event.key !== 'Escape') return;
      setMenuOpen(false);
      touchHandledRef.current = false;
      if (toggle && typeof toggle.focus === 'function') toggle.focus();
    };

    if (window.__lesktopNavOutsideClickHandler) {
      document.removeEventListener('click', window.__lesktopNavOutsideClickHandler);
    }
    window.__lesktopNavOutsideClickHandler = outsideClickHandler;
    document.addEventListener('click', outsideClickHandler);

    if (window.__lesktopNavEscapeHandler) {
      document.removeEventListener('keydown', window.__lesktopNavEscapeHandler);
    }
    window.__lesktopNavEscapeHandler = escapeHandler;
    document.addEventListener('keydown', escapeHandler);

    let resizeTimer;
    let lastMobile = isMobileMedia();
    const resizeHandler = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const nowMobile = isMobileMedia();
        if (lastMobile && !nowMobile) {
          if (menuOpen) setMenuOpen(false);
          unlockPageScroll();
        }
        lastMobile = nowMobile;
      }, RESIZE_DEBOUNCE_MS);
    };
    if (window.__lesktopNavResizeHandler) {
      window.removeEventListener('resize', window.__lesktopNavResizeHandler);
    }
    window.__lesktopNavResizeHandler = resizeHandler;
    window.addEventListener('resize', resizeHandler);
  }
}
