// Reveal-on-scroll component via IntersectionObserver (with fallback)
// Adds 'js' class to <html> for CSS fallbacks
// Idempotent: safe to call multiple times

export function initReveal() {
  if (document.documentElement.dataset.revealInit === '1') return;
  document.documentElement.dataset.revealInit = '1';
  document.documentElement.classList.add('js');

  const revealSections = document.querySelectorAll('.reveal-on-scroll');
  if (!revealSections.length) return;

  if (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealSections.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10%',
    threshold: 0.05,
  };

  const revealNowInView = () => {
    const windowHeight = window.innerHeight;
    revealSections.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < windowHeight * 0.95 && rect.bottom > 0;
      if (inView && !el.classList.contains('is-visible')) {
        el.classList.add('is-visible');
      }
    });
  };

  // Fallback: zobrazit všechny sekce po timeoutu, pokud IntersectionObserver selže
  // Používáme querySelector místo closure, aby funkce vždy používala aktuální DOM
  const forceRevealAll = () => {
    // Vždy použít aktuální DOM elementy, ne closure na staré revealSections
    const currentSections = document.querySelectorAll('.reveal-on-scroll:not(.is-visible)');
    currentSections.forEach((section) => {
      section.classList.add('is-visible');
    });
  };

  // Exportovaná funkce pro externí použití (např. pageshow event)
  // Aktualizujeme při každé inicializaci, aby vždy používala aktuální logiku
  window.__lesktopForceReveal = forceRevealAll;

  // Timeout fallback pro Safari - zobrazí všechny sekce po 2 sekundách
  let fallbackTimeout = setTimeout(() => {
    const hiddenCount = document.querySelectorAll('.reveal-on-scroll:not(.is-visible)').length;
    if (hiddenCount > 0) {
      forceRevealAll();
    }
  }, 2000);

  // Flag pro jednorázové zrušení timeoutu
  let timeoutCleared = false;
  const clearFallbackTimeout = () => {
    if (!timeoutCleared && fallbackTimeout) {
      clearTimeout(fallbackTimeout);
      fallbackTimeout = null;
      timeoutCleared = true;
    }
  };

  try {
    if ('IntersectionObserver' in window) {
      let observer;
      try {
        observer = new IntersectionObserver((entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              obs.unobserve(entry.target);
              // Zrušit timeout jednorázově, pokud IntersectionObserver funguje
              clearFallbackTimeout();
            }
          });
        }, observerOptions);

        revealSections.forEach((section) => {
          try {
            observer.observe(section);
          } catch (err) {
            // Pokud observe selže, zobrazit sekci okamžitě
            section.classList.add('is-visible');
          }
        });

        // Immediately reveal items currently in viewport
        revealNowInView();

        // FIX: iPhone/Mobile Safari reload fix
        // Při obnovení stránky (reload) si prohlížeč pamatuje pozici scrollování,
        // ale IntersectionObserver se nemusí spustit správně. Vynutíme kontrolu znovu.
        setTimeout(revealNowInView, 100);
        setTimeout(revealNowInView, 400);
      } catch (err) {
        // Pokud IntersectionObserver selže, zobrazit všechny sekce
        clearFallbackTimeout();
        forceRevealAll();
      }
    } else {
      // IntersectionObserver není dostupný - zobrazit všechny sekce
      clearFallbackTimeout();
      revealSections.forEach((section) => section.classList.add('is-visible'));
    }
  } catch (err) {
    // Pokud dojde k jakékoli chybě, zobrazit všechny sekce jako fallback
    clearFallbackTimeout();
    forceRevealAll();
  }
}
