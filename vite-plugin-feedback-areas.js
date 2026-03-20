import {
  FEEDBACK_AREAS_CS,
  FEEDBACK_BEST_CHIPS_CS,
  FEEDBACK_IMPROVE_CHIPS_CS,
  FEEDBACK_NOTE_PLACEHOLDER_CS,
} from './tools/feedback-areas-data.mjs';

const MARKER_START = '<!-- FEEDBACK_AREAS:START -->';
const MARKER_END = '<!-- FEEDBACK_AREAS:END -->';

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderChips(areaKey, groupKey, chips) {
  return chips
    .map(
      (chip) => `                    <label class="chip">
                      <input type="checkbox" name="area[${escapeHtml(areaKey)}][${escapeHtml(groupKey)}][]" value="${escapeHtml(chip.value)}">
                      ${escapeHtml(chip.label)}
                    </label>`
    )
    .join('\n');
}

function renderRatings(areaKey) {
  return [5, 4, 3, 2, 1]
    .map((rating) => {
      const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
      return `                    <label class="rating-chip">
                      <input type="radio" name="area[${escapeHtml(areaKey)}][rating]" value="${rating}">
                      ${stars}
                    </label>`;
    })
    .join('\n');
}

function renderArea(area) {
  const areaKey = area.key;
  const noteName = `area[${areaKey}][note]`;

  return `            <!-- ${escapeHtml(area.comment)} -->
            <details class="area-item" data-area-key="${escapeHtml(areaKey)}">
              <summary class="area-summary">
                <span class="area-name">${escapeHtml(area.areaName)}</span>
                <span class="area-summary-icon" aria-hidden="true">▼</span>
              </summary>
              <div class="area-panel">
                <fieldset class="form-group">
                  <legend><strong>${escapeHtml(area.legendText)}</strong></legend>
                  <div class="rating-block" role="radiogroup" aria-label="${escapeHtml(area.ratingAriaLabel)}">
${renderRatings(areaKey)}
                  </div>
                </fieldset>
                <fieldset class="form-group">
                  <legend><strong>Co bylo dobré?</strong></legend>
                  <div class="chip-group best-chip-group" role="group">
${renderChips(areaKey, 'best', FEEDBACK_BEST_CHIPS_CS)}
                  </div>
                </fieldset>
                <fieldset class="form-group">
                  <legend><strong>Co je potřeba zlepšit?</strong></legend>
                  <div class="chip-group improve-chip-group" role="group">
${renderChips(areaKey, 'improve', FEEDBACK_IMPROVE_CHIPS_CS)}
                  </div>
                </fieldset>
                <div class="form-group">
                  <label for="${escapeHtml(area.noteId)}">${escapeHtml(area.noteLabel)}</label>
                  <textarea id="${escapeHtml(area.noteId)}" name="${escapeHtml(noteName)}" rows="2" placeholder="${escapeHtml(FEEDBACK_NOTE_PLACEHOLDER_CS)}"></textarea>
                </div>
              </div>
            </details>`;
}

function renderFeedbackAreas() {
  const renderedAreas = FEEDBACK_AREAS_CS.map(renderArea).join('\n\n');
  return `${renderedAreas}

            <!-- Volitelné další oblasti (dětský pokoj, pracovna, jídelna, sklep, garáž) lze doplnit stejným vzorem. -->
          `;
}

export function feedbackAreas() {
  return {
    name: 'feedback-areas',
    enforce: 'pre',
    transformIndexHtml: {
      order: 'pre',
      handler(html, context) {
        if (!context?.path || !context.path.endsWith('/spokojenost.html')) {
          return html;
        }

        const startIndex = html.indexOf(MARKER_START);
        const endIndex = html.indexOf(MARKER_END);
        if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
          throw new Error('[feedback-areas] Markers not found or malformed in spokojenost.html');
        }

        const before = html.slice(0, startIndex);
        const after = html.slice(endIndex + MARKER_END.length);
        return `${before}${renderFeedbackAreas()}${after}`;
      },
    },
  };
}
