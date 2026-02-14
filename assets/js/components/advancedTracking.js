export function initAdvancedTracking() {
  if (document.documentElement.dataset.advancedTrackingInit === '1') return;
  document.documentElement.dataset.advancedTrackingInit = '1';

  const canTrack = () => typeof window.lesktopTrackEvent === 'function';
  const raf = typeof window.requestAnimationFrame === 'function'
    ? window.requestAnimationFrame.bind(window)
    : (callback) => window.setTimeout(callback, 16);

  const thresholds = [25, 50, 75, 100];
  const sentDepths = {};
  let ticking = false;

  const handleScroll = () => {
    if (ticking) return;
    ticking = true;
    raf(() => {
      const doc = document.documentElement;
      const scrollTop = window.pageYOffset || doc.scrollTop || 0;
      const viewport = window.innerHeight || doc.clientHeight || 0;
      const height = Math.max(doc.scrollHeight, doc.offsetHeight, doc.clientHeight);
      const depth = Math.min(100, Math.round(((scrollTop + viewport) / height) * 100));

      thresholds.forEach((percent) => {
        if (depth >= percent && !sentDepths[String(percent)]) {
          sentDepths[String(percent)] = true;
          if (canTrack()) {
            window.lesktopTrackEvent('event', 'page_scroll_depth', { depth_percent: percent });
          }
        }
      });

      if (sentDepths['100']) {
        window.removeEventListener('scroll', handleScroll);
      }
      ticking = false;
    });
  };

  window.addEventListener('scroll', handleScroll, false);
  handleScroll();

  window.setTimeout(() => {
    if (canTrack()) {
      window.lesktopTrackEvent('event', 'time_on_site_60s');
    }
  }, 60000);
}
