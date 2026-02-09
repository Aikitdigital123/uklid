export function initAdvancedTracking() {
  if (document.documentElement.dataset.advancedTrackingInit === '1') return;
  document.documentElement.dataset.advancedTrackingInit = '1';

  const canTrack = () => typeof window.gtag === 'function';

  const thresholds = [25, 50, 75, 100];
  const sentDepths = new Set();
  let ticking = false;

  const handleScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      const doc = document.documentElement;
      const scrollTop = window.pageYOffset || doc.scrollTop || 0;
      const viewport = window.innerHeight || doc.clientHeight || 0;
      const height = Math.max(doc.scrollHeight, doc.offsetHeight, doc.clientHeight);
      const maxScroll = Math.max(height - viewport, 1);
      const depth = Math.min(100, Math.round(((scrollTop + viewport) / height) * 100));

      thresholds.forEach((percent) => {
        if (depth >= percent && !sentDepths.has(percent)) {
          sentDepths.add(percent);
          if (canTrack()) {
            window.gtag('event', 'page_scroll_depth', { depth_percent: percent });
          }
        }
      });

      if (sentDepths.has(100)) {
        window.removeEventListener('scroll', handleScroll);
      }
      ticking = false;
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  window.setTimeout(() => {
    if (canTrack()) {
      window.gtag('event', 'time_on_site_60s');
    }
  }, 60000);
}
