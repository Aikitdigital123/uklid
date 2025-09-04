// Reveal-on-scroll component via IntersectionObserver (with fallback)
// Adds 'js' class to <html> for CSS fallbacks
// Idempotent: safe to call multiple times

export function initReveal() {
  if (document.documentElement.dataset.revealInit === '1') return;
  document.documentElement.dataset.revealInit = '1';
  document.documentElement.classList.add('js');

  const revealSections = document.querySelectorAll('.reveal-on-scroll');
  if (!revealSections.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10%',
    threshold: 0.05,
  };

  const revealNowInView = () => {
    revealSections.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.95 && rect.bottom > 0;
      if (inView) el.classList.add('is-visible');
    });
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealSections.forEach((section) => observer.observe(section));
    // Immediately reveal items currently in viewport
    revealNowInView();
  } else {
    revealSections.forEach((section) => section.classList.add('is-visible'));
  }
}

