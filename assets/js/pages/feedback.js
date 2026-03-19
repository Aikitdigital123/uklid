const MESSAGES = {
  cs: {
    sending: 'Odesilam hodnoceni...',
    success: 'Dekujeme, vase hodnoceni bylo uspesne odeslano.',
    missingRating: 'Vyberte prosim hodnoceni alespon u jedne oblasti.',
    invalidCleaningDate: 'Vyberte datum úklidu v kalendáři.',
    missingConfig: 'Formular neni spravne nastaven. Zkuste to prosim pozdeji.',
    photoUploadError: 'Fotku se nepodarilo nahrat. Zkuste to prosim znovu.',
    submitError: 'Odeslani se nepodarilo. Zkuste to prosim znovu pozdeji.',
    anonymousYes: 'Ano',
    anonymousNo: 'Ne',
    anonymousLabel: 'Anonymne',
    signatureLabel: 'Podpis',
    cleaningDateLabel: 'Datum úklidu',
    photoLabel: 'Fotka',
    pageLabel: 'Stranka',
    submittedAtLabel: 'Odeslano',
    languageLabel: 'Jazyk',
    ratedAreasLabel: 'Hodnocene oblasti',
    areaKeysLabel: 'Klice oblasti',
    ratingLabel: 'Hodnoceni',
    bestLabel: 'Co bylo dobré',
    improveLabel: 'Co je potřeba zlepšit',
    noteLabel: 'Doplneni',
    noValue: '-',
    summaryTitle: 'Nova zpetna vazba k uklidu',
    languageValue: 'CS'
  },
  en: {
    sending: 'Sending feedback...',
    success: 'Thank you, your feedback has been sent successfully.',
    missingRating: 'Please select a rating for at least one area.',
    invalidCleaningDate: 'Please select the cleaning date using the calendar picker.',
    missingConfig: 'The form is not configured correctly. Please try again later.',
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
    languageValue: 'EN'
  }
};

const RATING_LABELS = {
  cs: {
    1: 'Nespokojen/a',
    2: 'Spise nespokojen/a',
    3: 'Dobre',
    4: 'Spokojen/a',
    5: 'Vyborne'
  },
  en: {
    1: 'Dissatisfied',
    2: 'Rather dissatisfied',
    3: 'Good',
    4: 'Satisfied',
    5: 'Excellent'
  }
};

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

// Autoritativní sety chipů pro sekce "Co bylo dobré?" / "Co je potřeba zlepšit?"
// (napříč všemi oblastmi + obě jazykové mutace) – aby UI i odesílané hodnoty byly konzistentní.
const FEEDBACK_CHIP_SETS = {
  cs: {
    best: [
      { label: 'Čistota', value: 'cleanliness' },
      { label: 'Lesk', value: 'shine' },
      { label: 'Vůně', value: 'fragrance' },
      { label: 'Pořádek', value: 'tidiness' },
      { label: 'Rychlost', value: 'speed' },
      { label: 'Kompletnost', value: 'completeness' },
    ],
    improve: [
      { label: 'Prach', value: 'dust' },
      { label: 'Šmouhy', value: 'streaks' },
      { label: 'Zápach', value: 'odor' },
      { label: 'Detaily', value: 'details' },
      { label: 'Rychlost', value: 'speed' },
      { label: 'Vynecháno', value: 'missed' },
      { label: 'Vše v pořádku', value: 'none_ok' },
    ],
  },
  en: {
    best: [
      { label: 'Cleanliness', value: 'cleanliness' },
      { label: 'Shine', value: 'shine' },
      { label: 'Fragrance', value: 'fragrance' },
      { label: 'Tidiness', value: 'tidiness' },
      { label: 'Speed', value: 'speed' },
      { label: 'Completeness', value: 'completeness' },
    ],
    improve: [
      { label: 'Dust', value: 'dust' },
      { label: 'Streaks', value: 'streaks' },
      { label: 'Odor', value: 'odor' },
      { label: 'Details', value: 'details' },
      { label: 'Speed', value: 'speed' },
      { label: 'Missed', value: 'missed' },
      { label: 'Everything was fine', value: 'none_ok' },
    ],
  },
};

function getChipSets(lang) {
  return FEEDBACK_CHIP_SETS[lang] || FEEDBACK_CHIP_SETS.cs;
}

function replaceChipGroup(groupEl, items, checkboxName) {
  if (!groupEl) return;

  const checkedValues = Array.from(groupEl.querySelectorAll('input[type="checkbox"]:checked')).map((i) => i.value);

  // Zachováme wrapper (kvůli CSS) a přestavíme pouze obsah.
  while (groupEl.firstChild) groupEl.removeChild(groupEl.firstChild);

  items.forEach((chip) => {
    const labelEl = document.createElement('label');
    labelEl.className = 'chip';

    const inputEl = document.createElement('input');
    inputEl.type = 'checkbox';
    inputEl.name = checkboxName;
    inputEl.value = chip.value;
    if (checkedValues.includes(chip.value)) inputEl.checked = true;

    labelEl.appendChild(inputEl);
    labelEl.appendChild(document.createTextNode(chip.label));

    groupEl.appendChild(labelEl);
  });
}

function applyFeedbackChipSets(form) {
  const lang = getFormLanguage(form);
  const chipSets = getChipSets(lang);

  const areas = Array.from(form.querySelectorAll('details.area-item[data-area-key]'));
  areas.forEach((areaItem) => {
    const areaKey = safeTrim(areaItem?.dataset?.areaKey);
    if (!areaKey) return;

    const bestGroup = areaItem.querySelector('.chip-group.best-chip-group');
    const improveGroup = areaItem.querySelector('.chip-group.improve-chip-group');

    replaceChipGroup(bestGroup, chipSets.best, `area[${areaKey}][best][]`);
    replaceChipGroup(improveGroup, chipSets.improve, `area[${areaKey}][improve][]`);
  });
}

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
  if (completed) areaItem.dataset.areaCompleted = '1';
  else delete areaItem.dataset.areaCompleted;
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

function buildSummaryText({ lang, submittedAt, pageUrl, anonymous, signature, cleaningDate, photoUrl, areas }) {
  const msg = getMessages(lang);
  const areaKeys = areas.map((area) => area.key).join(',');
  const lines = [
    msg.summaryTitle,
    '',
    `${msg.languageLabel}: ${msg.languageValue}`,
    `${msg.submittedAtLabel}: ${getHumanDateTime(submittedAt, lang)}`,
    `${msg.pageLabel}: ${pageUrl}`,
    `${msg.anonymousLabel}: ${anonymous ? msg.anonymousYes : msg.anonymousNo}`,
    `${msg.signatureLabel}: ${anonymous ? msg.noValue : (signature || msg.noValue)}`,
    `${msg.cleaningDateLabel}: ${cleaningDate || msg.noValue}`,
    `${msg.photoLabel}: ${photoUrl || msg.noValue}`,
    '',
    `${msg.ratedAreasLabel}: ${areas.length}`,
    `${msg.areaKeysLabel}: ${areaKeys || msg.noValue}`
  ];

  areas.forEach((area) => {
    lines.push('');
    lines.push(`[${area.label}]`);
    lines.push(`${msg.ratingLabel}: ${area.rating} - ${area.rating_label || msg.noValue}`);
    lines.push(`${msg.bestLabel}: ${area.best_labels.length ? area.best_labels.join(', ') : msg.noValue}`);
    lines.push(`${msg.improveLabel}: ${area.improve_labels.length ? area.improve_labels.join(', ') : msg.noValue}`);
    lines.push(`${msg.noteLabel}: ${area.note || msg.noValue}`);
  });

  return lines.join('\n');
}

function buildPayload(form, config, areas, photoUrl) {
  const anonymous = Boolean(form.querySelector('#feedbackAnonymous')?.checked);
  const signatureValue = safeTrim(form.querySelector('#feedbackSignature')?.value);
  const cleaningDate = safeTrim(form.querySelector('#cleaningDate')?.value);
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

  return {
    form_type: formType,
    lang,
    submitted_at: submittedAt,
    page_url: pageUrl,
    anonymous,
    signature: safeSignature,
    cleaning_date: cleaningDate || '',
    photo_url: photoUrl || '',
    areas_count: areaPayload.length,
    areas_keys_csv: areaPayload.map((area) => area.key).join(','),
    areas_json: JSON.stringify(areaPayload),
    summary_text: buildSummaryText({
      lang,
      submittedAt,
      pageUrl,
      anonymous,
      signature: safeSignature,
      cleaningDate,
      photoUrl,
      areas: areaPayload
    })
  };
}

async function uploadPhotoToCloudinary(file, config) {
  console.log('[feedback] cloudinary upload start:', {
    has_file: Boolean(file),
    cloud_name: config.cloudinaryCloudName || null,
    preset: config.cloudinaryUploadPreset || null,
  });
  const endpoint = `https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudinaryCloudName)}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', config.cloudinaryUploadPreset);

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData
  });
  console.log('[feedback] cloudinary status:', response.status, response.statusText);

  if (!response.ok) {
    throw new Error('cloudinary_upload_failed');
  }

  let result;
  try {
    result = await response.json();
  } catch (error) {
    throw new Error('cloudinary_upload_invalid_json');
  }

  if (!result || !result.secure_url) {
    throw new Error('cloudinary_upload_invalid_response');
  }

  console.log('[feedback] cloudinary secure_url:', result.secure_url);
  return result.secure_url;
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
  console.log('[feedback] formspree status:', response.status, response.statusText);

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

function showStatus(statusNode, message, tone) {
  if (!statusNode) return;
  statusNode.textContent = message;
  statusNode.classList.remove('form-status-hidden', 'success', 'error', 'is-loading');

  if (tone === 'success') {
    statusNode.classList.add('success');
    statusNode.setAttribute('aria-live', 'polite');
  } else if (tone === 'error') {
    statusNode.classList.add('error');
    statusNode.setAttribute('aria-live', 'assertive');
  } else if (tone === 'loading') {
    statusNode.classList.add('is-loading');
    statusNode.setAttribute('aria-live', 'polite');
  } else {
    statusNode.classList.remove('form-status-hidden');
  }

  scrollStatusIntoView(statusNode);
}

function setSubmittingState(form, submitButton, isSubmitting, message) {
  if (submitButton) {
    submitButton.disabled = isSubmitting;
    submitButton.setAttribute('aria-disabled', isSubmitting ? 'true' : 'false');
  }

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
  const config = readConfig(form);
  const msg = getMessages(config.lang);
  const statusNode = form.querySelector('#feedback-form-status');
  const submitButton = form.querySelector('#feedbackSubmitButton');
  const photoInput = form.querySelector('#feedbackPhoto');
  const photoFile = photoInput?.files?.[0] || null;
  console.log('[feedback] selected file:', photoFile ? {
    name: photoFile.name,
    size: photoFile.size,
    type: photoFile.type
  } : null);
  const cleaningDate = safeTrim(form.querySelector('#cleaningDate')?.value);
  const areas = collectAreas(form, config.lang);
  const ratedAreas = areas.filter((area) => Number.isInteger(area.rating) && area.rating >= 1 && area.rating <= 5);

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

  setSubmittingState(form, submitButton, true, msg.sending);

  try {
    let photoUrl = '';

    if (photoFile) {
      try {
        photoUrl = await uploadPhotoToCloudinary(photoFile, config);
      } catch (error) {
        console.error('[feedback] cloudinary upload error:', error?.message || error);
        throw new Error('photo_upload_failed');
      }
    }

    const payload = buildPayload(form, config, ratedAreas, photoUrl);
    console.log('[feedback] payload photo_url before formspree:', payload.photo_url || null);
    await submitToFormspree(payload, config);

    resetFeedbackForm(form);
    showStatus(statusNode, msg.success, 'success');
  } catch (error) {
    if (error && error.message === 'photo_upload_failed') {
      showStatus(statusNode, msg.photoUploadError, 'error');
    } else {
      showStatus(statusNode, msg.submitError, 'error');
    }
  } finally {
    setSubmittingState(form, submitButton, false);
  }
}

export function initFeedbackForm() {
  const form = document.getElementById('feedbackForm');
  if (!form || form.dataset.feedbackInitialized === 'true') return;

  form.dataset.feedbackInitialized = 'true';
  // Nahrazuje existující chipy v každé oblasti přesně definovaným setem (CZ/EN).
  applyFeedbackChipSets(form);
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
