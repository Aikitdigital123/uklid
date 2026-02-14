// Small DOM/runtime polyfills for older browsers.
// Keep this file lightweight and dependency-free.

(function applyLegacyPolyfills() {
  if (typeof window === 'undefined') return;

  if (!Array.prototype.includes) {
    Array.prototype.includes = function includes(searchElement, fromIndex) {
      var length = this.length >>> 0;
      if (length === 0) return false;
      var start = fromIndex | 0;
      var index = start >= 0 ? start : Math.max(length + start, 0);
      for (; index < length; index += 1) {
        if (this[index] === searchElement) return true;
      }
      return false;
    };
  }

  if (!String.prototype.startsWith) {
    String.prototype.startsWith = function startsWith(searchString, position) {
      var pos = position > 0 ? position | 0 : 0;
      return this.substr(pos, searchString.length) === searchString;
    };
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function requestAnimationFrameFallback(callback) {
      return window.setTimeout(callback, 16);
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function cancelAnimationFrameFallback(id) {
      window.clearTimeout(id);
    };
  }

  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }

  if (window.Element && !Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.msMatchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      function matchesFallback(selector) {
        var node = this;
        var nodeList = (node.document || node.ownerDocument).querySelectorAll(selector);
        var i = 0;
        while (nodeList[i] && nodeList[i] !== node) i += 1;
        return !!nodeList[i];
      };
  }

  if (window.Element && !Element.prototype.closest) {
    Element.prototype.closest = function closestFallback(selector) {
      var el = this;
      while (el && el.nodeType === 1) {
        if (el.matches(selector)) return el;
        el = el.parentElement || el.parentNode;
      }
      return null;
    };
  }
})();
