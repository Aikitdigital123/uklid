// main.js - browser bootstrap with a compatibility fallback for older browsers.
// Loads the module entry for modern browsers and keeps cookie consent functional
// when module scripts are unavailable.

(function bootstrapMain() {
  var isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  var logError = isDev && window.console && typeof window.console.error === 'function'
    ? function logErrorFn() { window.console.error.apply(window.console, arguments); }
    : function noop() {};

  var measurementId = 'G-FLL5D5LE75';
  var storageKey = 'lesktop_cookie_consent';

  var bundlePath = '/assets/js/main.bundle.js';
  if (document.currentScript && document.currentScript.src) {
    bundlePath = document.currentScript.src.replace(/main\.js(?:\?.*)?$/, 'main.bundle.js');
  }

  function supportsModuleScripts() {
    var script = document.createElement('script');
    return 'noModule' in script;
  }

  function setGaDisabled(isDisabled) {
    window['ga-disable-' + measurementId] = !!isDisabled;
  }

  function safeGetStorage(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function safeSetStorage(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      // localStorage can be unavailable in private mode
    }
  }

  function addClass(el, className) {
    if (!el) return;
    if (el.classList) {
      el.classList.add(className);
      return;
    }
    if ((' ' + el.className + ' ').indexOf(' ' + className + ' ') === -1) {
      el.className = (el.className + ' ' + className).replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '');
    }
  }

  function removeClass(el, className) {
    if (!el) return;
    if (el.classList) {
      el.classList.remove(className);
      return;
    }
    el.className = (' ' + el.className + ' ')
      .replace(' ' + className + ' ', ' ')
      .replace(/\s+/g, ' ')
      .replace(/^\s+|\s+$/g, '');
  }

  function initLegacyCookieBannerFallback() {
    if (document.documentElement.getAttribute('data-cookie-banner-fallback-init') === '1') return;

    var banner = document.getElementById('cookie-banner');
    if (!banner) return;

    document.documentElement.setAttribute('data-cookie-banner-fallback-init', '1');
    setGaDisabled(true);

    var acceptButton = document.getElementById('cookie-accept');
    var necessaryButton = document.getElementById('cookie-necessary');
    var storedConsent = safeGetStorage(storageKey);

    function hideBanner() {
      addClass(banner, 'is-hidden');
      banner.setAttribute('aria-hidden', 'true');
    }

    function showBanner() {
      removeClass(banner, 'is-hidden');
      banner.setAttribute('aria-hidden', 'false');
    }

    function setConsent(value) {
      safeSetStorage(storageKey, value);
      setGaDisabled(value !== 'all');
      hideBanner();
    }

    function bindConsentAction(button, value) {
      if (!button) return;

      var recentlyHandled = false;
      var onActivate = function onActivate(event) {
        if (event && event.type === 'touchend' && typeof event.preventDefault === 'function') {
          event.preventDefault();
        }
        if (recentlyHandled) return;

        recentlyHandled = true;
        setConsent(value);

        window.setTimeout(function resetTouchGuard() {
          recentlyHandled = false;
        }, 500);
      };

      button.addEventListener('click', onActivate, false);
      button.addEventListener('touchend', onActivate, false);
      button.addEventListener('keyup', function onKeyUp(event) {
        var key = event && (event.key || event.keyCode);
        if (key === 'Enter' || key === ' ' || key === 13 || key === 32) onActivate(event);
      }, false);
    }

    if (storedConsent === 'all' || storedConsent === 'necessary') {
      setGaDisabled(storedConsent !== 'all');
      hideBanner();
      return;
    }

    showBanner();
    bindConsentAction(acceptButton, 'all');
    bindConsentAction(necessaryButton, 'necessary');
  }

  function loadModuleEntry() {
    var moduleScript = document.createElement('script');
    moduleScript.type = 'module';
    moduleScript.src = bundlePath;
    moduleScript.async = true;
    moduleScript.addEventListener('error', function onModuleError(err) {
      logError('[main.js] Failed to load main.bundle.js:', err);
      initLegacyCookieBannerFallback();
    });
    document.head.appendChild(moduleScript);
  }

  if (supportsModuleScripts()) {
    loadModuleEntry();
    return;
  }

  logError('[main.js] Module scripts are not supported in this browser.');
  initLegacyCookieBannerFallback();
})();
