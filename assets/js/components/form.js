// Form components: contact and calculator submission via Web3Forms.
// Idempotent: safe to initialize multiple times.

const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const logError = isDev ? console.error : () => {};

const attributionStorageKey = 'lesktop_attribution_v1';
const attributionKeys = [
  'gclid',
  'gbraid',
  'wbraid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'fbclid'
];

const minFormFillMs = 500;
const fastSubmitMessage = 'Prosim vyplnte formular a odeslete ho znovu za par sekund.';
const invalidSubmitMessage = 'Prosim zkontrolujte povinna pole formulare.';
const conversionCurrency = 'CZK';
const conversionValueByForm = {
  contact: 900,
  calculation: 1200
};
const conversionSendToByForm = {
  contact: 'AW-17893281939/XoMGCP-N4-kbEJOhl9RC',
  calculation: 'AW-17893281939/XoMGCP-N4-kbEJOhl9RC'
};

function readStoredAttribution() {
  try {
    const raw = localStorage.getItem(attributionStorageKey);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (e) {
    return {};
  }
}

function writeStoredAttribution(data) {
  try {
    localStorage.setItem(attributionStorageKey, JSON.stringify(data));
  } catch (e) {
    // localStorage can be unavailable
  }
}

function cloneObject(source) {
  const target = {};
  if (!source || typeof source !== 'object') return target;

  Object.keys(source).forEach((key) => {
    target[key] = source[key];
  });

  return target;
}

function safeDecodeQueryValue(value) {
  try {
    return decodeURIComponent(String(value || '').replace(/\+/g, ' '));
  } catch (e) {
    return String(value || '');
  }
}

function getQueryParamReader() {
  if (typeof URLSearchParams === 'function') {
    const params = new URLSearchParams(window.location.search);
    return (key) => params.get(key) || '';
  }

  const legacyParams = {};
  const rawQuery = window.location.search ? window.location.search.replace(/^\?/, '') : '';

  if (rawQuery) {
    rawQuery.split('&').forEach((pair) => {
      if (!pair) return;
      const separatorIndex = pair.indexOf('=');
      const rawKey = separatorIndex >= 0 ? pair.slice(0, separatorIndex) : pair;
      const rawValue = separatorIndex >= 0 ? pair.slice(separatorIndex + 1) : '';
      const key = safeDecodeQueryValue(rawKey);
      if (!key) return;
      legacyParams[key] = safeDecodeQueryValue(rawValue);
    });
  }

  return (key) => legacyParams[key] || '';
}

function isFiniteNumber(value) {
  if (typeof Number.isFinite === 'function') return Number.isFinite(value);
  return isFinite(value);
}

function captureAttributionFromUrl() {
  const getParam = getQueryParamReader();
  const stored = readStoredAttribution();
  const next = cloneObject(stored);
  let changed = false;

  attributionKeys.forEach((key) => {
    const value = getParam(key);
    if (value) {
      next[key] = value;
      changed = true;
    }
  });

  if (changed) {
    if (!next.landing_page) {
      next.landing_page = window.location.href;
    }
    next.last_touch_page = window.location.href;
    next.updated_at = new Date().toISOString();
    writeStoredAttribution(next);
  }
}

function buildAttributionPayload() {
  const getParam = getQueryParamReader();
  const stored = readStoredAttribution();
  const payload = {};

  attributionKeys.forEach((key) => {
    payload[key] = getParam(key) || stored[key] || '';
  });

  payload.landing_page = stored.landing_page || window.location.href;
  payload.current_page = window.location.href;
  payload.referrer = document.referrer || '';

  return payload;
}

function appendAttribution(formData) {
  const payload = buildAttributionPayload();
  Object.keys(payload).forEach((key) => {
    const value = payload[key];
    if (value) {
      formData.append(`tracking_${key}`, String(value));
    }
  });
}

function markFormStart(form) {
  if (!form) return;
  form.dataset.startedAt = String(Date.now());
}

function isSubmitTooFast(form) {
  const startedAt = Number(form && form.dataset ? form.dataset.startedAt : '0');
  if (!isFiniteNumber(startedAt) || startedAt <= 0) return false;
  return Date.now() - startedAt < minFormFillMs;
}

// Helper pro správu časovačů zpráv - zabraňuje blikání a mizení zpráv
function scheduleStatusHide(statusNode, delay) {
  if (statusNode._hideTimeout) clearTimeout(statusNode._hideTimeout);
  statusNode._hideTimeout = setTimeout(() => {
    statusNode.textContent = '';
    statusNode.classList.remove('success', 'error');
    statusNode.classList.add('form-status-hidden');
    statusNode._hideTimeout = null;
  }, delay);
}

function showFastSubmitError(statusNode) {
  if (!statusNode) return;
  if (statusNode._hideTimeout) clearTimeout(statusNode._hideTimeout); // Reset předchozího časovače
  statusNode.textContent = fastSubmitMessage;
  statusNode.classList.remove('success', 'form-status-hidden');
  statusNode.classList.add('error');
  scheduleStatusHide(statusNode, 3500);
}

function showInvalidSubmitError(statusNode, message) {
  if (!statusNode) return;
  if (statusNode._hideTimeout) clearTimeout(statusNode._hideTimeout); // Chyba validace má zůstat viset
  statusNode.textContent = message || invalidSubmitMessage;
  statusNode.classList.remove('success', 'form-status-hidden');
  statusNode.classList.add('error');
}

function hideStatusNode(statusNode) {
  if (!statusNode) return;
  if (statusNode._hideTimeout) clearTimeout(statusNode._hideTimeout);
  statusNode.textContent = '';
  statusNode.classList.remove('success', 'error');
  statusNode.classList.add('form-status-hidden');
}

function bindValidationFeedback(form, statusNode) {
  if (!form || !statusNode) return;

  const updateFieldState = (field, isBlur = false) => {
    if (!field.willValidate) return;

    const isValid = field.checkValidity();
    const wasInvalid = field.classList.contains('is-invalid');

    if (isValid) {
      field.classList.remove('is-invalid');
      field.setAttribute('aria-invalid', 'false');
      // Zelená fajfka jen pokud je pole vyplněné
      if (field.value) {
        field.classList.add('is-valid');
      } else {
        field.classList.remove('is-valid');
      }
    } else if (isBlur || wasInvalid) {
      // Chybu zobrazit jen při opuštění pole (blur) nebo pokud už svítila (uživatel opravuje)
      field.classList.remove('is-valid');
      field.classList.add('is-invalid');
      field.setAttribute('aria-invalid', 'true');
    }
  };

  form.addEventListener('invalid', (event) => {
    const target = event && event.target;
    if (target) {
      target.classList.add('is-invalid');
      target.classList.remove('is-valid');
      target.setAttribute('aria-invalid', 'true');
    }
    const message = target && typeof target.validationMessage === 'string'
      ? target.validationMessage
      : invalidSubmitMessage;
    showInvalidSubmitError(statusNode, message);
  }, true);

  form.addEventListener('input', (event) => {
    const target = event.target;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
      updateFieldState(target, false);
    }

    if (!statusNode.classList.contains('error')) return;
    if (typeof form.checkValidity === 'function' && form.checkValidity()) {
      hideStatusNode(statusNode);
    }
  }, false);

  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach((input) => {
    input.addEventListener('blur', () => updateFieldState(input, true));
  });

  // Clean up validation classes on form reset
  form.addEventListener('reset', () => {
    // Timeout ensures this runs after the native reset clears values
    setTimeout(() => {
      form.querySelectorAll('.is-valid, .is-invalid').forEach((field) => {
        field.classList.remove('is-valid', 'is-invalid');
        field.removeAttribute('aria-invalid');
      });
    }, 0);
  });
}

function bindSubmitAssist(form, statusNode) {
  if (!form) return;
  const submitButton = form.querySelector('button[type="submit"]');
  if (!submitButton) return;

  const findFirstInvalidField = () => {
    if (typeof form.querySelector !== 'function') return null;
    return form.querySelector(':invalid');
  };

  const checkBeforeSubmit = (event) => {
    if (submitButton.disabled) return;
    if (typeof form.checkValidity !== 'function') return;
    if (form.checkValidity()) return;

    if (typeof form.reportValidity === 'function') {
      form.reportValidity();
    }

    const firstInvalidField = findFirstInvalidField();
    const invalidMessage = firstInvalidField && typeof firstInvalidField.validationMessage === 'string'
      ? firstInvalidField.validationMessage
      : invalidSubmitMessage;
    showInvalidSubmitError(statusNode, invalidMessage || invalidSubmitMessage);

    if (firstInvalidField && typeof firstInvalidField.focus === 'function') {
      firstInvalidField.focus();
    }

    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }
  };

  submitButton.addEventListener('click', checkBeforeSubmit, false);
  submitButton.addEventListener('touchend', checkBeforeSubmit, false);
}

function createConversionId(formType) {
  return `${formType}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function getConversionValue(formType) {
  return conversionValueByForm[formType] || 1;
}

function trackFormConversion(formType, formName, extraData = {}) {
  if (typeof window.lesktopTrackEvent !== 'function') return;

  const conversionId = createConversionId(formType);
  const value = getConversionValue(formType);
  const sendTo = conversionSendToByForm[formType];
  const eventPayload = {
    form_type: formType,
    form_name: formName,
    value: value,
    currency: conversionCurrency,
    event_id: conversionId
  };

  Object.keys(extraData || {}).forEach((key) => {
    eventPayload[key] = extraData[key];
  });

  window.lesktopTrackEvent('event', 'form_submission', eventPayload);

  // GA4 Generic Lead Event
  window.lesktopTrackEvent('event', 'generate_lead', {
    event_category: 'form',
    event_label: 'kalkulacka_nebo_kontakt'
  });

  if (sendTo) {
    window.lesktopTrackEvent('event', 'conversion', {
      send_to: sendTo,
      value: value,
      currency: conversionCurrency,
      transaction_id: conversionId
    });
  }
}

export function initForms() {
  if (document.documentElement.dataset.formInit === '1') return;
  document.documentElement.dataset.formInit = '1';
  captureAttributionFromUrl();

  const contactForm = document.getElementById('contactForm');
  const formStatusContact = document.getElementById('form-status');
  const calcForm = document.getElementById('kalkulacka');
  const formStatusCalc = document.getElementById('calc-form-status');

  markFormStart(contactForm);
  markFormStart(calcForm);
  bindValidationFeedback(contactForm, formStatusContact);
  bindValidationFeedback(calcForm, formStatusCalc);
  bindSubmitAssist(contactForm, formStatusContact);
  bindSubmitAssist(calcForm, formStatusCalc);

  // Legacy fallback: without fetch/FormData we allow classic HTML form submit.
  if (typeof window.fetch !== 'function' || typeof window.FormData !== 'function') return;

  if (contactForm && formStatusContact) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (isSubmitTooFast(contactForm)) {
        showFastSubmitError(formStatusContact);
        return;
      }

      if (contactForm.dataset.submitting === '1') return;
      contactForm.dataset.submitting = '1';

      const submitButton = contactForm.querySelector('button[type="submit"]');
      if (submitButton && submitButton.disabled) {
        delete contactForm.dataset.submitting;
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Odesilam...';
      }

      formStatusContact.textContent = 'Odesilam...';
      formStatusContact.classList.remove('success', 'error', 'form-status-hidden');

      const formData = new FormData(contactForm);
      formData.append('_charset', 'UTF-8');
      appendAttribution(formData);

      try {
        const response = await fetch(contactForm.action, {
          method: contactForm.method,
          body: formData,
          headers: { Accept: 'application/json' }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        let result;
        try {
          result = await response.json();
        } catch (jsonError) {
          logError('JSON parse error (contact form):', jsonError);
          throw new Error('Invalid server response');
        }

        if (result.success) {
          formStatusContact.textContent = 'Dekujeme! Vase zprava byla uspesne odeslana.';
          formStatusContact.classList.remove('error');
          formStatusContact.classList.add('success');

          trackFormConversion('contact', 'Kontaktni formular');
          contactForm.reset();
          markFormStart(contactForm);
          scheduleStatusHide(formStatusContact, 5000);
        } else {
          logError('Web3Forms contact submit error:', result);
          formStatusContact.textContent = result.message || 'Pri odesilani zpravy doslo k chybe. Zkuste to prosim pozdeji.';
          formStatusContact.classList.remove('success');
          formStatusContact.classList.add('error');
        }
      } catch (error) {
        logError('Network submit error (contact form):', error);
        formStatusContact.textContent = 'Pri odesilani zpravy doslo k chybe site. Zkuste to prosim pozdeji.';
        formStatusContact.classList.remove('success');
        formStatusContact.classList.add('error');
      } finally {
        delete contactForm.dataset.submitting;
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Odeslat poptavku';
        }
      }
    });
  }

  if (calcForm && formStatusCalc) {
    calcForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (isSubmitTooFast(calcForm)) {
        showFastSubmitError(formStatusCalc);
        return;
      }

      if (calcForm.dataset.submitting === '1') return;
      calcForm.dataset.submitting = '1';

      const submitButton = calcForm.querySelector('button[type="submit"]');
      if (submitButton && submitButton.disabled) {
        delete calcForm.dataset.submitting;
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Odesilam...';
      }

      formStatusCalc.textContent = 'Odesilam...';
      formStatusCalc.classList.remove('success', 'error', 'form-status-hidden');

      const formData = new FormData(calcForm);
      formData.append('_charset', 'UTF-8');
      appendAttribution(formData);

      try {
        const response = await fetch(calcForm.action, {
          method: calcForm.method,
          body: formData,
          headers: { Accept: 'application/json' }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        let result;
        try {
          result = await response.json();
        } catch (jsonError) {
          logError('JSON parse error (calculator form):', jsonError);
          throw new Error('Invalid server response');
        }

        if (result.success) {
          formStatusCalc.textContent = 'Dekujeme! Vase poptavka byla uspesne odeslana.';
          formStatusCalc.classList.remove('error');
          formStatusCalc.classList.add('success');

          const cleaningTypeField = calcForm.querySelector('#cleaningType');
          const frequencyField = calcForm.querySelector('#cleaningFrequency');
          const cleaningType = cleaningTypeField ? cleaningTypeField.value : 'unknown';
          const frequency = frequencyField ? frequencyField.value : 'unknown';

          trackFormConversion('calculation', 'Kalkulacni formular', {
            cleaning_type: cleaningType,
            frequency: frequency
          });

          calcForm.reset();
          markFormStart(calcForm);
          scheduleStatusHide(formStatusCalc, 5000);
        } else {
          logError('Web3Forms calculator submit error:', result);
          formStatusCalc.textContent = result.message || 'Pri odesilani poptavky doslo k chybe. Zkuste to prosim pozdeji.';
          formStatusCalc.classList.remove('success');
          formStatusCalc.classList.add('error');
        }
      } catch (error) {
        logError('Network submit error (calculator form):', error);
        formStatusCalc.textContent = 'Pri odesilani poptavky doslo k chybe site. Zkuste to prosim pozdeji.';
        formStatusCalc.classList.remove('success');
        formStatusCalc.classList.add('error');
      } finally {
        delete calcForm.dataset.submitting;
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Ziskat nezavaznou nabidku';
        }
      }
    });
  }
}
