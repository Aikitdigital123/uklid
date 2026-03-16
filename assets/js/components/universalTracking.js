// Universal tracking for CTA buttons and navigation across all pages
// Tracks CTA clicks and navigation clicks with consistent parameters

export function initUniversalTracking() {
  if (document.documentElement.dataset.universalTrackingInit === '1') return;
  document.documentElement.dataset.universalTrackingInit = '1';

  const canTrack = () => typeof window.lesktopTrackEvent === 'function';

  // Helper function to get page type from body data attribute
  const getPageType = () => {
    const pageData = document.body?.dataset?.page;
    return pageData || 'unknown';
  };

  // Helper function to get section name from element context
  const getSectionName = (element) => {
    // Try to find parent section
    let parent = element.closest('section');
    if (parent && parent.id) {
      return parent.id;
    }
    // Try to find parent with class containing 'section'
    parent = element.closest('[class*="section"]');
    if (parent) {
      return parent.className.split(' ').find(cls => cls.includes('section')) || 'unknown';
    }
    return 'unknown';
  };

  // Track CTA buttons across all pages
  // This catches buttons that don't have data-track-event attribute
  const trackCTAButtons = () => {
    // Find all buttons and links with btn class that don't have data-track-event
    const ctaButtons = document.querySelectorAll('a.btn, button.btn');
    
    ctaButtons.forEach((button) => {
      // Skip if already tracked via data-track-event (homepage uses this)
      if (button.hasAttribute('data-track-event')) return;
      // Skip cookie banner buttons
      if (button.id === 'cookie-accept' || button.id === 'cookie-necessary') return;
      // Skip nav toggle
      if (button.classList.contains('nav-toggle')) return;
      // Skip form submit buttons (tracked separately in form.js)
      if (button.type === 'submit') return;
      // Skip social links (tracked as external links)
      if (button.closest('.social-links')) return;
      // Skip WhatsApp buttons (tracked via enhancedTracking as generate_lead)
      if (button.href && (button.href.includes('wa.me') || button.href.includes('whatsapp'))) return;
      if (button.classList.contains('btn-whatsapp')) return;

      button.addEventListener('click', function() {
        if (canTrack()) {
          const buttonText = this.textContent?.trim() || this.innerText?.trim() || 'unknown';
          const buttonName = this.dataset.buttonName || this.id || this.className || 'unknown';
          const section = getSectionName(this);
          
          window.lesktopTrackEvent('event', 'cta_click', {
            button_name: buttonName,
            button_text: buttonText,
            page_type: getPageType(),
            section: section
          });
        }
      });
    });
  };

  // Track navigation clicks across all pages
  const trackNavigation = () => {
    const navLinks = document.querySelectorAll('.nav-list a, .main-nav a');
    
    navLinks.forEach((link) => {
      // Skip if already tracked via data-track-event (homepage)
      if (link.hasAttribute('data-track-event')) return;

      link.addEventListener('click', function() {
        if (canTrack()) {
          const menuItem = this.textContent?.trim() || this.innerText?.trim() || 'unknown';
          const href = this.getAttribute('href') || 'unknown';
          
          window.lesktopTrackEvent('event', 'nav_click', {
            menu_item: menuItem,
            page_type: getPageType(),
            link_href: href
          });
        }
      });
    });
  };

  // Initialize tracking
  trackCTAButtons();
  trackNavigation();
}
