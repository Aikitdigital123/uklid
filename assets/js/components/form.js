// Form components: contact form submission via Web3Forms
// Idempotent: guarded so listeners are not duplicated

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

      formStatusContact.textContent = 'Odesílám...';
      formStatusContact.classList.remove('success', 'error');
      formStatusContact.style.display = 'block';

      const formData = new FormData(contactForm);

      try {
        const response = await fetch(contactForm.action, {
          method: contactForm.method,
          body: formData,
          headers: { Accept: 'application/json' },
        });

        const result = await response.json();

        if (result.success) {
          formStatusContact.textContent = 'Děkujeme! Vaše zpráva byla úspěšně odeslána.';
          formStatusContact.classList.remove('error');
          formStatusContact.classList.add('success');
          contactForm.reset();
        } else {
          console.error('Chyba Web3Forms při odesílání kontaktního formuláře:', result);
          formStatusContact.textContent = result.message || 'Při odesílání zprávy došlo k chybě. Zkuste to prosím později.';
          formStatusContact.classList.remove('success');
          formStatusContact.classList.add('error');
        }
      } catch (error) {
        console.error('Chyba při odesílání kontaktního formuláře:', error);
        formStatusContact.textContent = 'Při odesílání zprávy došlo k chybě sítě. Zkuste to prosím později.';
        formStatusContact.classList.remove('success');
        formStatusContact.classList.add('error');
      } finally {
        setTimeout(() => {
          formStatusContact.textContent = '';
          formStatusContact.classList.remove('success', 'error');
          formStatusContact.style.display = 'none';
        }, 5000);
      }
    });
  }

  // Kalkulační formulář (bez přesměrování; inline potvrzení)
  if (calcForm && formStatusCalc) {
    calcForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      formStatusCalc.textContent = 'Odesílám...';
      formStatusCalc.classList.remove('success', 'error');
      formStatusCalc.style.display = 'block';

      const formData = new FormData(calcForm);

      try {
        const response = await fetch(calcForm.action, {
          method: calcForm.method,
          body: formData,
          headers: { Accept: 'application/json' },
        });

        const result = await response.json();

        if (result.success) {
          formStatusCalc.textContent = 'Děkujeme! Vaše poptávka byla úspěšně odeslána.';
          formStatusCalc.classList.remove('error');
          formStatusCalc.classList.add('success');
          calcForm.reset();
        } else {
          console.error('Chyba Web3Forms při odesílání kalkulačního formuláře:', result);
          formStatusCalc.textContent = result.message || 'Při odesílání poptávky došlo k chybě. Zkuste to prosím později.';
          formStatusCalc.classList.remove('success');
          formStatusCalc.classList.add('error');
        }
      } catch (error) {
        console.error('Chyba při odesílání kalkulačního formuláře:', error);
        formStatusCalc.textContent = 'Při odesílání poptávky došlo k chybě sítě. Zkuste to prosím později.';
        formStatusCalc.classList.remove('success');
        formStatusCalc.classList.add('error');
      } finally {
        setTimeout(() => {
          formStatusCalc.textContent = '';
          formStatusCalc.classList.remove('success', 'error');
          formStatusCalc.style.display = 'none';
        }, 5000);
      }
    });
  }
}
