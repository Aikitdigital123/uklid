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

const minFormFillMs = 2500;
const fastSubmitMessage = 'Prosim vyplnte formular a odeslete ho znovu za par sekund.';
const conversionCurrency = 'CZK';
const conversionValueByForm = {
  contact: 900,
  calculation: 1200
};
const conversionSendToByForm = {
  contact: 'AW-17893281939/contact_form_submission',
  calculation: 'AW-17893281939/calculation_form_submission'
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

function showFastSubmitError(statusNode) {
  if (!statusNode) return;
  statusNode.textContent = fastSubmitMessage;
  statusNode.classList.remove('success', 'form-status-hidden');
  statusNode.classList.add('error');
  window.setTimeout(() => {
    if (!statusNode.classList.contains('error')) return;
    statusNode.textContent = '';
    statusNode.classList.remove('success', 'error');
    statusNode.classList.add('form-status-hidden');
  }, 3500);
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
        window.setTimeout(() => {
          formStatusContact.textContent = '';
          formStatusContact.classList.remove('success', 'error');
          formStatusContact.classList.add('form-status-hidden');
        }, 5000);
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
        window.setTimeout(() => {
          formStatusCalc.textContent = '';
          formStatusCalc.classList.remove('success', 'error');
          formStatusCalc.classList.add('form-status-hidden');
        }, 5000);
      }
    });
  }
}
