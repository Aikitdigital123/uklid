// Form components: contact form submission via Web3Forms
// Idempotent: guarded so listeners are not duplicated

// Helper pro podmíněné logování (jen v dev módu)
const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const logError = isDev ? console.error : () => {};

export function initForms() {
  if (document.documentElement.dataset.formInit === '1') return;
  document.documentElement.dataset.formInit = '1';

  const contactForm = document.getElementById('contactForm');
  const formStatusContact = document.getElementById('form-status');
  const calcForm = document.getElementById('kalkulacka');
  const formStatusCalc = document.getElementById('calc-form-status');

  if (contactForm && formStatusContact) {
    contactForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      const submitButton = contactForm.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Odesílám...';
      }

      formStatusContact.textContent = 'Odesílám...';
      formStatusContact.classList.remove('success', 'error', 'form-status-hidden');

      const formData = new FormData(contactForm);
      
      // Explicitně nastavit UTF-8 charset pro Web3Forms
      formData.append('_charset', 'UTF-8');

      try {
        const response = await fetch(contactForm.action, {
          method: contactForm.method,
          body: formData,
          headers: { 
            Accept: 'application/json'
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          formStatusContact.textContent = 'Děkujeme! Vaše zpráva byla úspěšně odeslána.';
          formStatusContact.classList.remove('error');
          formStatusContact.classList.add('success');
          
          // Track conversion pro Google Ads a Analytics
          if (window.lesktopTrackEvent) {
            window.lesktopTrackEvent('event', 'form_submission', {
              form_type: 'contact',
              form_name: 'Kontaktní formulář'
            });
            // Google Ads conversion
            window.lesktopTrackEvent('event', 'conversion', {
              'send_to': 'AW-17893281939/contact_form_submission'
            });
          }
          
          contactForm.reset();
        } else {
          logError('Chyba Web3Forms při odesílání kontaktního formuláře:', result);
          formStatusContact.textContent = result.message || 'Při odesílání zprávy došlo k chybě. Zkuste to prosím později.';
          formStatusContact.classList.remove('success');
          formStatusContact.classList.add('error');
        }
      } catch (error) {
        logError('Chyba při odesílání kontaktního formuláře:', error);
        formStatusContact.textContent = 'Při odesílání zprávy došlo k chybě sítě. Zkuste to prosím později.';
        formStatusContact.classList.remove('success');
        formStatusContact.classList.add('error');
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Odeslat poptávku';
        }
        setTimeout(() => {
          formStatusContact.textContent = '';
          formStatusContact.classList.remove('success', 'error');
          formStatusContact.classList.add('form-status-hidden');
        }, 5000);
      }
    });
  }

  // Kalkulační formulář (bez přesměrování; inline potvrzení)
  if (calcForm && formStatusCalc) {
    calcForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      const submitButton = calcForm.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Odesílám...';
      }

      formStatusCalc.textContent = 'Odesílám...';
      formStatusCalc.classList.remove('success', 'error', 'form-status-hidden');

      const formData = new FormData(calcForm);
      
      // Explicitně nastavit UTF-8 charset pro Web3Forms
      formData.append('_charset', 'UTF-8');

      try {
        const response = await fetch(calcForm.action, {
          method: calcForm.method,
          body: formData,
          headers: { 
            Accept: 'application/json'
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          formStatusCalc.textContent = 'Děkujeme! Vaše poptávka byla úspěšně odeslána.';
          formStatusCalc.classList.remove('error');
          formStatusCalc.classList.add('success');
          
          // Track conversion pro Google Ads a Analytics
          if (window.lesktopTrackEvent) {
            // Získat hodnotu z formuláře pro lepší tracking
            const cleaningType = calcForm.querySelector('#cleaningType')?.value || 'unknown';
            const frequency = calcForm.querySelector('#cleaningFrequency')?.value || 'unknown';
            
            window.lesktopTrackEvent('event', 'form_submission', {
              form_type: 'calculation',
              form_name: 'Kalkulační formulář',
              cleaning_type: cleaningType,
              frequency: frequency
            });
            // Google Ads conversion
            window.lesktopTrackEvent('event', 'conversion', {
              'send_to': 'AW-17893281939/calculation_form_submission'
            });
          }
          
          calcForm.reset();
        } else {
          logError('Chyba Web3Forms při odesílání kalkulačního formuláře:', result);
          formStatusCalc.textContent = result.message || 'Při odesílání poptávky došlo k chybě. Zkuste to prosím později.';
          formStatusCalc.classList.remove('success');
          formStatusCalc.classList.add('error');
        }
      } catch (error) {
        logError('Chyba při odesílání kalkulačního formuláře:', error);
        formStatusCalc.textContent = 'Při odesílání poptávky došlo k chybě sítě. Zkuste to prosím později.';
        formStatusCalc.classList.remove('success');
        formStatusCalc.classList.add('error');
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Získat nezávaznou nabídku';
        }
        setTimeout(() => {
          formStatusCalc.textContent = '';
          formStatusCalc.classList.remove('success', 'error');
          formStatusCalc.classList.add('form-status-hidden');
        }, 5000);
      }
    });
  }
}
