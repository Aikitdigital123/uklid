// Enhanced tracking pro Google Ads a Analytics
// Trackuje telefonní hovory, email kliky a další interakce

export function initEnhancedTracking() {
  if (document.documentElement.dataset.enhancedTrackingInit === '1') return;
  document.documentElement.dataset.enhancedTrackingInit = '1';

  const canTrack = () => typeof window.lesktopTrackEvent === 'function';

  // Track telefonních odkazů
  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
  phoneLinks.forEach((link) => {
    link.addEventListener('click', function() {
      if (canTrack()) {
        const location = this.dataset.location || 'unknown';
        
        window.lesktopTrackEvent('event', 'generate_lead', {
          event_category: 'engagement',
          event_label: 'phone_click'
        });
      }
    });
  });

  // Track email odkazů
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  emailLinks.forEach((link) => {
    link.addEventListener('click', function() {
      if (canTrack()) {
        const rawHref = this.getAttribute('href').replace('mailto:', '');
        const [email, queryString] = rawHref.split('?');
        const params = {};
        if (queryString) {
          const urlParams = new URLSearchParams(queryString);
          if (urlParams.has('subject')) params.subject = urlParams.get('subject');
        }
        params.email = email;
        
        window.lesktopTrackEvent('event', 'email_click', params);
      }
    });
  });

  // Track externích odkazů (sociální sítě)
  const externalLinks = document.querySelectorAll('a[target="_blank"]');
  externalLinks.forEach((link) => {
    if (link.hostname && link.hostname !== window.location.hostname) {
      link.addEventListener('click', function() {
        if (canTrack()) {
          const url = this.href;
          // Pokud je to WhatsApp a nemá inline onclick (pojistka)
          if (url.includes('wa.me') && !this.getAttribute('onclick')) {
            window.lesktopTrackEvent('event', 'generate_lead', {
              event_category: 'engagement',
              event_label: 'whatsapp_click'
            });
          } else if (!url.includes('wa.me')) {
            window.lesktopTrackEvent('event', 'external_link_click', {
              link_url: this.href,
              link_text: this.textContent.trim()
            });
          }
        }
      });
    }
  });

  // Track viditelnosti sekcí (pro lepší engagement tracking)
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
  };

  if (!('IntersectionObserver' in window)) return;

  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && canTrack()) {
        const sectionId = entry.target.id;
        if (!entry.target.dataset.tracked) {
          entry.target.dataset.tracked = 'true';
          const sectionTitleEl = entry.target.querySelector('.section-title');
          const sectionName = sectionTitleEl && sectionTitleEl.textContent ? sectionTitleEl.textContent : sectionId;
          window.lesktopTrackEvent('event', 'section_view', {
            section_id: sectionId,
            section_name: sectionName
          });
          
          // Stop observing this section once tracked to save resources
          observer.unobserve(entry.target);
        }
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
}
