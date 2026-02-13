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
        const phoneNumber = this.getAttribute('href').replace('tel:', '');
        
        window.lesktopTrackEvent('event', 'phone_click', {
          phone_number: phoneNumber,
          location: location
        });
        
        // Google Ads conversion pro telefonní hovory
        window.lesktopTrackEvent('event', 'conversion', {
          'send_to': 'AW-17893281939/phone_click'
        });
      }
    });
  });

  // Track email odkazů
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  emailLinks.forEach((link) => {
    link.addEventListener('click', function() {
      if (canTrack()) {
        const email = this.getAttribute('href').replace('mailto:', '');
        window.lesktopTrackEvent('event', 'email_click', {
          email: email
        });
      }
    });
  });

  // Track externích odkazů (sociální sítě)
  const externalLinks = document.querySelectorAll('a[target="_blank"]');
  externalLinks.forEach((link) => {
    if (link.hostname && link.hostname !== window.location.hostname) {
      link.addEventListener('click', function() {
        if (canTrack()) {
          window.lesktopTrackEvent('event', 'external_link_click', {
            link_url: this.href,
            link_text: this.textContent.trim()
          });
        }
      });
    }
  });

  // Track viditelnosti sekcí (pro lepší engagement tracking)
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && canTrack()) {
        const sectionId = entry.target.id;
        if (!entry.target.dataset.tracked) {
          entry.target.dataset.tracked = 'true';
          window.lesktopTrackEvent('event', 'section_view', {
            section_id: sectionId,
            section_name: entry.target.querySelector('.section-title')?.textContent || sectionId
          });
        }
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
}
