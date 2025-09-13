// Form components: contact form submission via Web3Forms
// Idempotent: guarded so listeners are not duplicated

export function initForms() {
  if (document.documentElement.dataset.formInit === '1') return;
  document.documentElement.dataset.formInit = '1';

  const contactForm = document.getElementById('contactForm');
  const formStatusContact = document.getElementById('form-status');

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
}
