import { trackFormConversion } from '../components/form.js';
import {
  FEEDBACK_AREAS_CS,
  FEEDBACK_BEST_CHIPS_CS,
  FEEDBACK_IMPROVE_CHIPS_CS,
  FEEDBACK_NOTE_PLACEHOLDER_CS,
} from '../../../tools/feedback-areas-data.mjs';

const MESSAGES = {
  cs: {
    sending: 'Odesíláme vaše hodnocení, děkujeme za chvíli strpení.',
    success: 'Děkujeme, vaše hodnocení jsme úspěšně přijali.',
    successFollowup: 'Pokud chcete, můžete hned odeslat další hodnocení.',
    fillAgain: 'Vyplnit další hodnocení',
    missingRating: 'Vyberte prosim hodnoceni alespon u jedne oblasti.',
    invalidCleaningDate: 'Vyberte datum úklidu v kalendáři.',
    missingConfig: 'Formular neni spravne nastaven. Zkuste to prosim pozdeji.',
    fastSubmit: 'Odeslani probehlo prilis rychle. Chvili pockejte a zkuste to znovu.',
    photoUploadError: 'Fotku se nepodařilo nahrát. Ostatní údaje zůstaly ve formuláři, zkuste to prosím znovu.',
    submitError: 'Odeslání se tentokrát nepodařilo. Zkuste to prosím za chvíli znovu.',
    anonymousYes: 'Ano',
    anonymousNo: 'Ne',
    anonymousLabel: 'Anonymně',
    signatureLabel: 'Podpis',
    cleaningDateLabel: 'Datum úklidu',
    photoLabel: 'Fotka',
    pageLabel: 'Stranka',
    submittedAtLabel: 'Odesláno',
    languageLabel: 'Jazyk',
    ratedAreasLabel: 'Hodnocené oblasti',
    areaKeysLabel: 'Klice oblasti',
    areasCountLabel: 'Počet oblastí',
    ratingLabel: 'Hodnocení',
    bestLabel: 'Co bylo dobré',
    improveLabel: 'Co je potřeba zlepšit',
    noteLabel: 'Doplnění',
    noValue: '-',
    summaryTitle: 'Nové hodnocení úklidu',
    languageValue: 'CS'
  },
  en: {
    sending: 'Sending feedback...',
    success: 'Thank you, your feedback has been received successfully.',
    successFollowup: 'If you want, you can submit another feedback right away.',
    fillAgain: 'Submit another feedback',
    missingRating: 'Please select a rating for at least one area.',
    invalidCleaningDate: 'Please select the cleaning date using the calendar picker.',
    missingConfig: 'The form is not configured correctly. Please try again later.',
    fastSubmit: 'Submission was too fast. Please wait a moment and try again.',
    photoUploadError: 'The photo could not be uploaded. Please try again.',
    submitError: 'The submission failed. Please try again later.',
    anonymousYes: 'Yes',
    anonymousNo: 'No',
    anonymousLabel: 'Anonymous',
    signatureLabel: 'Signature',
    cleaningDateLabel: 'Cleaning date',
    photoLabel: 'Photo',
    pageLabel: 'Page',
    submittedAtLabel: 'Submitted',
    languageLabel: 'Language',
    ratedAreasLabel: 'Rated areas',
    areaKeysLabel: 'Area keys',
    ratingLabel: 'Rating',
    bestLabel: 'What was good',
    improveLabel: 'What to improve',
    noteLabel: 'Additional note',
    noValue: '-',
    summaryTitle: 'New cleaning feedback',
    areasCountLabel: 'Number of areas',
    languageValue: 'EN'
  }
};

const RATING_LABELS = {
  cs: {
    1: 'Nespokojen/a',
    2: 'Spíše nespokojen/a',
    3: 'Dobře',
    4: 'Spokojen/a',
    5: 'Výborně'
  },
  en: {
    1: 'Dissatisfied',
    2: 'Rather dissatisfied',
    3: 'Good',
    4: 'Satisfied',
    5: 'Excellent'
  }
};

const MIN_FEEDBACK_FILL_MS = 1500;

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderFeedbackChips(areaKey, groupKey, chips) {
  return chips
    .map((chip) => `                    <label class="chip">
                      <input type="checkbox" name="area[${escapeHtml(areaKey)}][${escapeHtml(groupKey)}][]" value="${escapeHtml(chip.value)}">
                      ${escapeHtml(chip.label)}
                    </label>`)
    .join('\n');
}

function renderFeedbackRatings(areaKey) {
  return [5, 4, 3, 2, 1]
    .map((rating) => {
      const stars = '\u2605'.repeat(rating) + '\u2606'.repeat(5 - rating);
      return `                    <label class="rating-chip">
                      <input type="radio" name="area[${escapeHtml(areaKey)}][rating]" value="${rating}">
                      ${stars}
                    </label>`;
    })
    .join('\n');
}

function renderFeedbackArea(area) {
  const areaKey = area.key;
  const noteName = `area[${areaKey}][note]`;

  return `            <!-- ${escapeHtml(area.comment)} -->
            <details class="area-item" data-area-key="${escapeHtml(areaKey)}">
              <summary class="area-summary">
                <span class="area-name">${escapeHtml(area.areaName)}</span>
                <span class="area-summary-icon" aria-hidden="true">\u25BE</span>
              </summary>
              <div class="area-panel">
                <fieldset class="form-group">
                  <legend><strong>${escapeHtml(area.legendText)}</strong></legend>
                  <div class="rating-block" role="radiogroup" aria-label="${escapeHtml(area.ratingAriaLabel)}">
${renderFeedbackRatings(areaKey)}
                  </div>
                </fieldset>
                <fieldset class="form-group">
                  <legend><strong>Co bylo dobré?</strong></legend>
                  <div class="chip-group best-chip-group" role="group">
${renderFeedbackChips(areaKey, 'best', FEEDBACK_BEST_CHIPS_CS)}
                  </div>
                </fieldset>
                <fieldset class="form-group">
                  <legend><strong>Co je potřeba zlepšit?</strong></legend>
                  <div class="chip-group improve-chip-group" role="group">
${renderFeedbackChips(areaKey, 'improve', FEEDBACK_IMPROVE_CHIPS_CS)}
                  </div>
                </fieldset>
                <div class="form-group">
                  <label for="${escapeHtml(area.noteId)}">${escapeHtml(area.noteLabel)}</label>
                  <textarea id="${escapeHtml(area.noteId)}" name="${escapeHtml(noteName)}" rows="2" placeholder="${escapeHtml(FEEDBACK_NOTE_PLACEHOLDER_CS)}"></textarea>
                </div>
              </div>
            </details>`;
}

function ensureFeedbackAreasRendered(form) {
  const lang = getFormLanguage(form);
  if (lang !== 'cs') return;

  const areasSection = form.querySelector('.feedback-areas');
  if (!areasSection) return;
  if (areasSection.querySelector('details.area-item[data-area-key]')) return;

  const renderedAreas = FEEDBACK_AREAS_CS.map(renderFeedbackArea).join('\n\n');
  areasSection.innerHTML = `${renderedAreas}

            <!-- Volitelné další oblasti (dětský pokoj, pracovna, jídelna, sklep, garáž) lze doplnit stejným vzorem. -->
          `;
}

function safeTrim(value) {
  return String(value || '').trim();
}

function getMessages(lang) {
  return MESSAGES[lang] || MESSAGES.cs;
}

function getRatingLabel(value, lang) {
  return (RATING_LABELS[lang] && RATING_LABELS[lang][value]) || '';
}

function getFormLanguage(form) {
  const lang = safeTrim(form?.dataset?.lang || document.documentElement.lang || 'cs').toLowerCase();
  return lang === 'en' ? 'en' : 'cs';
}

function markFeedbackFormStart(form) {
  if (!form) return;
  form.dataset.startedAt = String(Date.now());
}

function isFeedbackSubmitTooFast(form) {
  const startedAt = Number(form?.dataset?.startedAt || '0');
  if (!Number.isFinite(startedAt) || startedAt <= 0) return false;
  return Date.now() - startedAt < MIN_FEEDBACK_FILL_MS;
}

// Chips (checkboxy) jsou renderované staticky v HTML – JS je pouze čte při sběru dat.

function bindRatingToggle(form) {
  const ratingRadios = Array.from(form.querySelectorAll('input[type="radio"][name$="[rating]"]'));
  if (!ratingRadios.length) return;

  // Map: radio group name -> list of radios
  const groupMap = new Map();
  ratingRadios.forEach((radio) => {
    const name = radio.name;
    if (!groupMap.has(name)) groupMap.set(name, []);
    groupMap.get(name).push(radio);
  });

  // Track which input was checked BEFORE click, so we can toggle it off on second tap.
  const checkedByGroup = new Map();
  groupMap.forEach((radios, name) => {
    const checked = radios.find((r) => r.checked);
    if (checked) checkedByGroup.set(name, checked);
  });

  function setGroupChecked(name, checkedRadio) {
    const radios = groupMap.get(name) || [];
    radios.forEach((r) => {
      const shouldCheck = checkedRadio && r === checkedRadio;
      r.checked = Boolean(shouldCheck);
      r.setAttribute('aria-checked', shouldCheck ? 'true' : 'false');
    });
  }

  ratingRadios.forEach((radio) => {
    const toggleOffIfAlreadySelected = (event) => {
      const prevChecked = checkedByGroup.get(radio.name);
      if (prevChecked !== radio) return;

      // Klíčové: dělej toggle-off dřív, než radio input nativně znovu nastaví checked=true.
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      setGroupChecked(radio.name, null);
      checkedByGroup.delete(radio.name);

      // Trigger form "change" listeners (completion sync etc.).
      radio.dispatchEvent(new Event('change', { bubbles: true }));
    };

    // Mobil / touch
    radio.addEventListener('pointerdown', toggleOffIfAlreadySelected);
    // Klávesnice (Enter/Space)
    radio.addEventListener('keydown', (event) => {
      if (event.key === ' ' || event.key === 'Enter') toggleOffIfAlreadySelected(event);
    });
  });

  // Keep map in sync after any normal radio selection change.
  form.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (target.type !== 'radio' || !target.name?.endsWith('[rating]')) return;

    const radios = groupMap.get(target.name) || [];
    const checked = radios.find((r) => r.checked);
    if (checked) checkedByGroup.set(target.name, checked);
    else checkedByGroup.delete(target.name);
  });

  // Nulování ARIA stavů při úspěšném odeslání
  form.addEventListener('reset', () => {
    checkedByGroup.clear();
    // Timeout je zde nutný, aby proběhl nativní reset prohlížeče před re-synchronizací ARIA
    setTimeout(() => {
      ratingRadios.forEach((r) => r.setAttribute('aria-checked', 'false'));
    }, 0);
  });
}

function readConfig(form) {
  return {
    formspreeEndpoint: safeTrim(form.dataset.formspreeEndpoint),
    cloudinaryCloudName: safeTrim(form.dataset.cloudinaryCloudName),
    cloudinaryUploadPreset: safeTrim(form.dataset.cloudinaryUploadPreset),
    lang: getFormLanguage(form)
  };
}

function getLabelTextForInput(input) {
  const label = input && input.closest('label');
  if (!label) return safeTrim(input?.value);
  const cloned = label.cloneNode(true);
  cloned.querySelectorAll('input').forEach((node) => node.remove());
  return safeTrim(cloned.textContent.replace(/\s+/g, ' '));
}

function getCheckedInputs(root, selector) {
  return Array.from(root.querySelectorAll(selector)).filter((input) => input.checked);
}

function hasAreaInteraction(areaItem) {
  if (!areaItem) return false;

  const checkedInput = areaItem.querySelector('input:checked');
  if (checkedInput) return true;

  const note = areaItem.querySelector('textarea');
  return Boolean(note && safeTrim(note.value));
}

function ensureAreaCompletionCheckInjected(areaItem) {
  const summary = areaItem?.querySelector('.area-summary');
  if (!summary) return;
  if (areaItem.querySelector('.area-summary-check')) return;

  const arrowIcon = summary.querySelector('.area-summary-icon');
  if (!arrowIcon) return;

  const check = document.createElement('span');
  check.className = 'area-summary-check';
  check.setAttribute('aria-hidden', 'true');
  check.textContent = '\u2713';
  const isEn = String(document.documentElement.lang || '').toLowerCase().startsWith('en');
  check.title = isEn ? 'Completed' : 'Dokončeno';

  // Zabalíme šipku + fajfku do jednoho pravého bloku, aby se nezměnilo rozdělení prostoru ve summary.
  const rightWrap = document.createElement('span');
  rightWrap.className = 'area-summary-right';

  summary.insertBefore(rightWrap, arrowIcon);
  rightWrap.appendChild(check);
  rightWrap.appendChild(arrowIcon);
}

function updateAreaCompletionState(areaItem) {
  const completed = hasAreaInteraction(areaItem);
  if (completed) {
    areaItem.dataset.areaCompleted = '1';
    areaItem.classList.add('is-completed');
  } else {
    delete areaItem.dataset.areaCompleted;
    areaItem.classList.remove('is-completed');
  }
}

function updateAllAreaCompletionStates(form) {
  const areas = Array.from(form.querySelectorAll('details.area-item[data-area-key]'));
  areas.forEach((areaItem) => {
    ensureAreaCompletionCheckInjected(areaItem);
    updateAreaCompletionState(areaItem);
  });
}

function collectAreaData(areaItem, lang) {
  const key = safeTrim(areaItem.dataset.areaKey);
  const label = safeTrim(areaItem.querySelector('.area-name')?.textContent || key);

  // Tyto selektory záměrně vycházejí ze statického HTML naming patternu:
  // area[<key>][best][] / area[<key>][improve][] / area[<key>][note]
  const ratingInput = areaItem.querySelector(`input[type="radio"][name="area[${key}][rating]"]:checked`);
  const bestInputs = getCheckedInputs(areaItem, `input[type="checkbox"][name="area[${key}][best][]"]`);
  const improveInputs = getCheckedInputs(areaItem, `input[type="checkbox"][name="area[${key}][improve][]"]`);
  const noteInput = areaItem.querySelector(`textarea[name="area[${key}][note]"]`);

  const rating = ratingInput ? Number(ratingInput.value) : null;
  const note = safeTrim(noteInput?.value);

  return {
    key,
    label,
    rating,
    rating_label: rating ? getRatingLabel(rating, lang) : '',
    best_keys: bestInputs.map((input) => safeTrim(input.value)).filter(Boolean),
    best_labels: bestInputs.map(getLabelTextForInput).filter(Boolean),
    improve_keys: improveInputs.map((input) => safeTrim(input.value)).filter(Boolean),
    improve_labels: improveInputs.map(getLabelTextForInput).filter(Boolean),
    note,
    has_interaction: hasAreaInteraction(areaItem),
    element: areaItem
  };
}

function collectAreas(form, lang) {
  return Array.from(form.querySelectorAll('details.area-item[data-area-key]')).map((areaItem) =>
    collectAreaData(areaItem, lang)
  );
}

function findAreaToOpen(areas) {
  return areas.find((area) => area.has_interaction)?.element || areas[0]?.element || null;
}

function openArea(areaElement) {
  if (areaElement && typeof areaElement.open !== 'undefined') {
    areaElement.open = true;
    areaElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function getHumanDateTime(isoValue, lang) {
  try {
    return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'cs-CZ', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(isoValue));
  } catch (error) {
    return isoValue;
  }
}

function formatDateOnly(isoValue, lang) {
  const trimmed = safeTrim(isoValue);
  if (!trimmed) return '';

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!match) return trimmed;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  try {
    return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'cs-CZ', {
      dateStyle: 'medium',
      timeZone: 'UTC'
    }).format(date);
  } catch (error) {
    return trimmed;
  }
}

function isValidCleaningDateFormat(value) {
  const trimmed = safeTrim(value);
  if (!trimmed) return true;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) return false;
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;

  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function bindCleaningDatePickerOnly(form) {
  const cleaningDateInput = form.querySelector('#cleaningDate');
  if (!(cleaningDateInput instanceof HTMLInputElement)) return;
  if (cleaningDateInput.type !== 'date') return;

  // Keep native date picker UX and block manual free-text editing.
  cleaningDateInput.setAttribute('inputmode', 'none');

  cleaningDateInput.addEventListener('keydown', (event) => {
    const allowedKeys = new Set(['Tab', 'Shift', 'Escape']);
    if (!allowedKeys.has(event.key)) {
      event.preventDefault();
    }
  });

  cleaningDateInput.addEventListener('paste', (event) => event.preventDefault());
  cleaningDateInput.addEventListener('drop', (event) => event.preventDefault());

  cleaningDateInput.addEventListener('click', () => {
    if (typeof cleaningDateInput.showPicker === 'function') {
      try {
        cleaningDateInput.showPicker();
      } catch (error) {
        // browser může showPicker blokovat; nesmí to rozbít formulář
      }
    }
  });
}

function bindSingleOpenAccordion(form) {
  const areas = Array.from(form.querySelectorAll('details.area-item[data-area-key]'));
  if (!areas.length) return;

  areas.forEach((area) => {
    const summary = area.querySelector('.area-summary');
    if (!summary) return;

    summary.addEventListener('click', (event) => {
      // If already open, keep native close behavior.
      if (area.open) return;

      event.preventDefault();

      const beforeTop = summary.getBoundingClientRect().top;

      areas.forEach((otherArea) => {
        if (otherArea !== area && otherArea.open) {
          otherArea.open = false;
        }
      });

      area.open = true;

      const afterTop = summary.getBoundingClientRect().top;
      const delta = afterTop - beforeTop;
      if (delta !== 0) {
        window.scrollBy(0, delta);
      }
    });
  });
}

function buildSummaryText({ submittedAt, anonymous, signature, cleaningDate, hasPhoto, photoUrl, areas }) {
  const cleaningDateHuman = formatDateOnly(cleaningDate, 'cs') || '-';
  const lines = [
    'Nové hodnocení úklidu',
    `Odesláno: ${getHumanDateTime(submittedAt, 'cs')}`,
    `Anonymně: ${anonymous ? 'Ano' : 'Ne'}`,
    `Podpis: ${anonymous ? 'neuveden' : (signature || 'neuveden')}`,
    `Datum úklidu: ${cleaningDateHuman}`,
    `Fotka: ${hasPhoto ? 'Ano' : 'Ne'}`,
    `Počet oblastí: ${areas.length}`
  ].filter(Boolean);

  if (hasPhoto && photoUrl) {
    const obfuscatedPhotoUrl = String(photoUrl).replace(/^https:\/\//i, 'https[:]//');
    lines.push(`Odkaz na fotografii: ${obfuscatedPhotoUrl}`);
  }

  areas.forEach((area) => {
    const ratingLabel = (RATING_LABELS.cs && RATING_LABELS.cs[area.rating]) || area.rating_label || '-';
    lines.push('');
    lines.push(area.label);
    lines.push(`Hodnocení: ${ratingLabel}`);
    lines.push(`Co bylo dobré: ${area.best_labels.length ? area.best_labels.join(', ') : '-'}`);
    lines.push(`Co je potřeba zlepšit: ${area.improve_labels.length ? area.improve_labels.join(', ') : '-'}`);
    lines.push(`Doplnění: ${area.note || '-'}`);
  });

  return lines.join('\n');
}

function buildPayload(form, config, areas, photoUrl, photoPublicId) {
  const anonymous = Boolean(form.querySelector('#feedbackAnonymous')?.checked);
  const signatureValue = safeTrim(form.querySelector('#feedbackSignature')?.value);
  const cleaningDate = safeTrim(form.querySelector('#cleaningDate')?.value);
  const baseSubject = safeTrim(form.querySelector('input[name="subject"]')?.value || 'Lesktop | Hodnocení úklidu');
  const gotcha = safeTrim(form.querySelector('input[name="_gotcha"]')?.value);
  const submittedAt = new Date().toISOString();
  const pageUrl = window.location.href;
  const formType = safeTrim(form.querySelector('input[name="form_type"]')?.value || 'cleaning_satisfaction');
  const lang = config.lang;
  const safeSignature = anonymous ? '' : signatureValue;
  const areaPayload = areas.map((area) => ({
    key: area.key,
    label: area.label,
    rating: area.rating,
    rating_label: area.rating_label,
    best_keys: area.best_keys,
    best_labels: area.best_labels,
    improve_keys: area.improve_keys,
    improve_labels: area.improve_labels,
    note: area.note
  }));
  const areasCount = areaPayload.length;
  const cleaningDateHuman = formatDateOnly(cleaningDate, 'cs');
  const getAreasNoun = (count) => {
    if (count === 1) return 'oblast';
    if (count >= 2 && count <= 4) return 'oblasti';
    return 'oblastí';
  };

  const anonSubjectPart = anonymous ? 'anonymně' : 's podpisem';

  const subjectParts = [baseSubject, `${areasCount} ${getAreasNoun(areasCount)}`];
  if (cleaningDateHuman) subjectParts.push(cleaningDateHuman);
  if (!cleaningDateHuman || anonymous) subjectParts.push(anonSubjectPart);

  const subject = subjectParts.join(' | ');

  const messageText = buildSummaryText({
    submittedAt,
    anonymous,
    signature: safeSignature,
    cleaningDate,
    hasPhoto: Boolean(photoUrl),
    photoUrl,
    areas: areaPayload
  });

  return {
    subject,
    _gotcha: gotcha,
    form_type: formType,
    lang,
    submitted_at: submittedAt,
    page_url: pageUrl,
    anonymous,
    signature: safeSignature,
    cleaning_date: cleaningDate || '',
    has_photo: Boolean(photoUrl),
    photo_public_id: photoPublicId || '',
    areas_count: areaPayload.length,
    areas_keys_csv: areaPayload.map((area) => area.key).join(','),
    message: messageText
  };
}

async function uploadPhotoToCloudinary(file, config) {
  const endpoint = `https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudinaryCloudName)}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', config.cloudinaryUploadPreset);

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('cloudinary_upload_failed');
  }

  let result;
  try {
    result = await response.json();
  } catch (error) {
    throw new Error('cloudinary_upload_invalid_json');
  }

  if (!result || !result.secure_url || !result.public_id) {
    throw new Error('cloudinary_upload_invalid_response');
  }

  return {
    secureUrl: result.secure_url,
    publicId: result.public_id
  };
}

async function submitToFormspree(payload, config) {
  const response = await fetch(config.formspreeEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('formspree_submit_failed');
  }

  const result = await response.json().catch(() => ({}));
  if (result && result.errors && result.errors.length) {
    throw new Error('formspree_submit_invalid_response');
  }

  return result;
}

function scrollStatusIntoView(statusNode) {
  if (!statusNode) return;
  const rect = statusNode.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const isFullyVisible = rect.top >= 0 && rect.bottom <= viewportHeight;
  if (!isFullyVisible) {
    statusNode.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function clearStatus(statusNode) {
  if (!statusNode) return;
  statusNode.textContent = '';
  statusNode.classList.add('form-status-hidden');
  statusNode.classList.remove('success', 'error', 'is-loading');
  statusNode.setAttribute('aria-live', 'polite');
  statusNode.setAttribute('role', 'status');
}

function showStatus(statusNode, message, tone, options = {}) {
  if (!statusNode) return;
  const { secondaryMessage = '', actionText = '', onAction = null } = options;

  statusNode.textContent = '';
  const messageNode = document.createElement('div');
  messageNode.className = 'feedback-status-message';
  messageNode.textContent = message;
  statusNode.appendChild(messageNode);

  if (secondaryMessage) {
    const secondaryNode = document.createElement('div');
    secondaryNode.className = 'feedback-status-secondary';
    secondaryNode.textContent = secondaryMessage;
    statusNode.appendChild(secondaryNode);
  }

  if (actionText && typeof onAction === 'function') {
    const actionButton = document.createElement('button');
    actionButton.type = 'button';
    actionButton.className = 'btn btn-outline feedback-status-action';
    actionButton.textContent = actionText;
    actionButton.addEventListener('click', onAction, { once: true });
    statusNode.appendChild(actionButton);
  }

  statusNode.classList.remove('form-status-hidden', 'success', 'error', 'is-loading');

  if (tone === 'success') {
    statusNode.classList.add('success');
    statusNode.setAttribute('aria-live', 'polite');
    statusNode.setAttribute('role', 'status');
  } else if (tone === 'error') {
    statusNode.classList.add('error');
    statusNode.setAttribute('aria-live', 'assertive');
    statusNode.setAttribute('role', 'alert');
  } else if (tone === 'loading') {
    statusNode.classList.add('is-loading');
    statusNode.setAttribute('aria-live', 'polite');
    statusNode.setAttribute('role', 'status');
  } else {
    statusNode.classList.remove('form-status-hidden');
  }

  statusNode.setAttribute('aria-atomic', 'true');

  scrollStatusIntoView(statusNode);
}

function setSubmitButtonLoading(submitButton, isSubmitting, loadingMessage) {
  if (!submitButton) return;

  if (!submitButton.dataset.defaultText) {
    submitButton.dataset.defaultText = submitButton.textContent || '';
  }

  submitButton.disabled = isSubmitting;
  submitButton.setAttribute('aria-disabled', isSubmitting ? 'true' : 'false');
  submitButton.classList.toggle('is-loading', isSubmitting);

  if (isSubmitting) {
    submitButton.textContent = '';
    const spinner = document.createElement('span');
    spinner.className = 'btn-spinner';
    spinner.setAttribute('aria-hidden', 'true');
    submitButton.appendChild(spinner);
    submitButton.appendChild(document.createTextNode(` ${loadingMessage}`));
    return;
  }

  submitButton.textContent = submitButton.dataset.defaultText || 'Odeslat hodnocení';
}

function setSubmittingState(form, submitButton, isSubmitting, message) {
  setSubmitButtonLoading(submitButton, isSubmitting, 'Odesílám...');

  if (form) {
    form.setAttribute('aria-busy', isSubmitting ? 'true' : 'false');
  }

  if (message) {
    const statusNode = form.querySelector('#feedback-form-status');
    showStatus(statusNode, message, isSubmitting ? 'loading' : undefined);
  }
}

function resetFeedbackForm(form) {
  form.reset();
  form.querySelectorAll('details.area-item[open]').forEach((areaItem) => {
    areaItem.open = false;
  });
  syncAnonymousState(form);
  updateAllAreaCompletionStates(form);
}

function isConfigValid(config, requiresPhotoUpload) {
  if (!config.formspreeEndpoint) return false;
  if (!requiresPhotoUpload) return true;
  return Boolean(config.cloudinaryCloudName && config.cloudinaryUploadPreset);
}

function syncAnonymousState(form) {
  const anonymousCheckbox = form.querySelector('#feedbackAnonymous');
  const signatureInput = form.querySelector('#feedbackSignature');
  if (!anonymousCheckbox || !signatureInput) return;

  const isAnonymous = Boolean(anonymousCheckbox.checked);
  if (isAnonymous) {
    signatureInput.value = '';
  }

  signatureInput.disabled = isAnonymous;
  signatureInput.setAttribute('aria-disabled', isAnonymous ? 'true' : 'false');
}

function bindAnonymousToggle(form) {
  const anonymousCheckbox = form.querySelector('#feedbackAnonymous');
  if (!anonymousCheckbox) return;

  // Použijeme change event, který se spustí i při kliknutí na label (díky for="feedbackAnonymous")
  anonymousCheckbox.addEventListener('change', () => {
    syncAnonymousState(form);
  });

  // Také přidáme click handler přímo na checkbox pro jistotu
  anonymousCheckbox.addEventListener('click', () => {
    // Necháme default chování proběhnout, pak synchronizujeme
    setTimeout(() => {
      syncAnonymousState(form);
    }, 0);
  });

  // Inicializace stavu
  syncAnonymousState(form);
}

async function handleSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  if (form.dataset.submitting === '1') return;
  const config = readConfig(form);
  const msg = getMessages(config.lang);
  const statusNode = form.querySelector('#feedback-form-status');
  const submitButton = form.querySelector('#feedbackSubmitButton');
  const botcheckValue = safeTrim(form.querySelector('input[name="botcheck"]')?.value);
  const gotchaValue = safeTrim(form.querySelector('input[name="_gotcha"]')?.value);
  const photoInput = form.querySelector('#feedbackPhoto');
  const photoFile = photoInput?.files?.[0] || null;
  const cleaningDate = safeTrim(form.querySelector('#cleaningDate')?.value);
  const areas = collectAreas(form, config.lang);
  const ratedAreas = areas.filter((area) => Number.isInteger(area.rating) && area.rating >= 1 && area.rating <= 5);

  if (botcheckValue || gotchaValue) {
    showStatus(statusNode, msg.submitError, 'error');
    return;
  }

  if (isFeedbackSubmitTooFast(form)) {
    showStatus(statusNode, msg.fastSubmit, 'error');
    return;
  }

  if (!isConfigValid(config, Boolean(photoFile))) {
    showStatus(statusNode, msg.missingConfig, 'error');
    return;
  }

  if (ratedAreas.length === 0) {
    showStatus(statusNode, msg.missingRating, 'error');
    openArea(findAreaToOpen(areas));
    return;
  }

  if (!isValidCleaningDateFormat(cleaningDate)) {
    showStatus(statusNode, msg.invalidCleaningDate, 'error');
    form.querySelector('#cleaningDate')?.focus();
    return;
  }

  form.dataset.submitting = '1';
  setSubmittingState(form, submitButton, true, msg.sending);

  try {
    let photoUrl = '';
    let photoPublicId = '';

    if (photoFile) {
      try {
        const uploadResult = await uploadPhotoToCloudinary(photoFile, config);
        photoUrl = uploadResult.secureUrl;
        photoPublicId = uploadResult.publicId;
      } catch (error) {
        throw new Error('photo_upload_failed');
      }
    }

    const payload = buildPayload(form, config, ratedAreas, photoUrl, photoPublicId);
    await submitToFormspree(payload, config);
    trackFormConversion('feedback', 'Feedback formular', {
      rated_areas_count: ratedAreas.length,
      has_photo: Boolean(photoUrl)
    });

    resetFeedbackForm(form);
    markFeedbackFormStart(form);
    showStatus(statusNode, msg.success, 'success', {
      secondaryMessage: msg.successFollowup,
      actionText: msg.fillAgain,
      onAction: () => {
        clearStatus(statusNode);
        const firstSummary = form.querySelector('details.area-item[data-area-key] .area-summary');
        if (firstSummary) {
          firstSummary.focus();
        } else {
          form.querySelector('#cleaningDate')?.focus();
        }
      }
    });
  } catch (error) {
    if (error && error.message === 'photo_upload_failed') {
      showStatus(statusNode, msg.photoUploadError, 'error');
    } else {
      showStatus(statusNode, msg.submitError, 'error');
    }
  } finally {
    setSubmittingState(form, submitButton, false);
    delete form.dataset.submitting;
  }
}

export function initFeedbackForm() {
  const form = document.getElementById('feedbackForm');
  if (!form || form.dataset.feedbackInitialized === 'true') return;

  ensureFeedbackAreasRendered(form);
  form.dataset.feedbackInitialized = 'true';
  markFeedbackFormStart(form);
  updateAllAreaCompletionStates(form);
  bindAnonymousToggle(form);
  bindRatingToggle(form);
  bindCleaningDatePickerOnly(form);
  bindSingleOpenAccordion(form);

  // Sledujeme změny v dané accordion sekci a aktualizujeme fajfku "vyplněno".
  form.addEventListener('change', (event) => {
    const areaItem = event.target?.closest?.('details.area-item[data-area-key]');
    if (!areaItem) return;
    updateAreaCompletionState(areaItem);
  });

  form.addEventListener('input', (event) => {
    if (event.target?.tagName !== 'TEXTAREA') return;
    const areaItem = event.target.closest('details.area-item[data-area-key]');
    if (!areaItem) return;
    updateAreaCompletionState(areaItem);
  });

  form.addEventListener('submit', handleSubmit);
}

initFeedbackForm();
