// Back to top button component
// Creates a floating button that appears after scrolling down

export function initBackToTop() {
  if (document.documentElement.dataset.backToTopInit === '1') return;
  document.documentElement.dataset.backToTopInit = '1';

  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Zpět na začátek');
  btn.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.body.appendChild(btn);

  const toggle = () => {
    const y = window.pageYOffset || document.documentElement.scrollTop;
    if (y > 200) btn.classList.add('visible');
    else btn.classList.remove('visible');
  };

  window.addEventListener('scroll', toggle, { passive: true });
  window.addEventListener('load', toggle);
}

