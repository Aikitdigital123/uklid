document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scrolling pro navigační odkazy
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const navList = document.querySelector('.nav-list');
            const menuToggle = document.querySelector('.menu-toggle');
            if (navList && menuToggle && navList.classList.contains('active')) {
                navList.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Přizpůsobení scrollu s ohledem na fixní header
                const headerOffset = document.querySelector('.main-header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset - 20; // -20px pro malé odsazení navíc

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            } else {
                console.warn(`Cílový prvek pro smooth scroll nebyl nalezen: ${targetId}`);
            }

            // Odebrání active třídy ze všech odkazů a přidání na aktuální
            document.querySelectorAll('.main-nav .nav-list a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // Intersection Observer pro animace reveal-on-scroll
    const revealSections = document.querySelectorAll('.reveal-on-scroll');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.15 // 15% prvku je viditelných
    };

    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observerInstance.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealSections.forEach(section => {
        observer.observe(section);
    });

    // Mobilní menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (navList.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navList.classList.contains('active')) {
                navList.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // --- Logika pro odesílání kontaktního formuláře pomocí Web3Forms ---
    const contactForm = document.getElementById('contactForm');
    const formStatusContact = document.getElementById('form-status');

    if (contactForm && formStatusContact) {
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Zabrání výchozímu odeslání formuláře

            formStatusContact.textContent = 'Odesílám...';
            formStatusContact.classList.remove('success', 'error');
            formStatusContact.style.display = 'block';

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: contactForm.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                const result = await response.json();

                if (result.success) {
                    formStatusContact.textContent = 'Děkujeme! Vaše zpráva byla úspěšně odeslána.';
                    formStatusContact.classList.remove('error');
                    formStatusContact.classList.add('success');
                    contactForm.reset(); // Vyčistí formulář
                } else {
                    console.error('Web3Forms response error for contact form:', result);
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
                // Skryje stavovou zprávu po 5 sekundách
                setTimeout(() => {
                    formStatusContact.textContent = '';
                    formStatusContact.classList.remove('success', 'error');
                    formStatusContact.style.display = 'none';
                }, 5000);
            }
        });
    }

    // --- Logika pro kalkulační formulář a checkboxy ---
    const cleaningCalculatorForm = document.getElementById('kalkulacka');
    const formStatusCalculator = document.getElementById('calculator-status');
    const cleaningTypeSelect = document.getElementById('cleaningType');
    const frequencyGroup = document.getElementById('frequencyGroup');
    const frequencySelect = document.getElementById('cleaningFrequency');

    if (cleaningCalculatorForm && formStatusCalculator && cleaningTypeSelect && frequencyGroup && frequencySelect) {
        // Logika pro zobrazení/skrytí pole "Frekvence úklidu"
        const toggleFrequencyDisplay = () => {
            if (cleaningTypeSelect.value === 'regular_home' || cleaningTypeSelect.value === 'commercial') {
                frequencyGroup.style.display = 'block';
                frequencySelect.setAttribute('required', 'required'); // Nastaví required, když je viditelný
            } else {
                frequencyGroup.style.display = 'none';
                frequencySelect.removeAttribute('required'); // Odebere required, když je skrytý
                frequencySelect.value = ''; // Resetuje hodnotu, aby se neodesílala nesmyslná hodnota
            }
        };

        // Naslouchání na změnu výběru typu úklidu
        cleaningTypeSelect.addEventListener('change', toggleFrequencyDisplay);

        // Zajistit správné zobrazení při načtení stránky
        toggleFrequencyDisplay();

        // Odesílání kalkulačního formuláře na Web3Forms
        cleaningCalculatorForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Zabrání výchozímu odeslání formuláře

            formStatusCalculator.textContent = 'Odesílám poptávku...';
            formStatusCalculator.classList.remove('success', 'error');
            formStatusCalculator.style.display = 'block';

            const formData = new FormData(cleaningCalculatorForm);
            
            // Přidáme předmět pro email, pokud již není nastaven v HTML inputu
            if (!formData.has('subject')) {
                formData.append('subject', 'Nová poptávka z kalkulačky úklidu - Lesktop');
            }

            try {
                const formAction = cleaningCalculatorForm.action || 'https://api.web3forms.com/submit';
                const response = await fetch(formAction, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                const result = await response.json();

                if (result.success) {
                    formStatusCalculator.textContent = 'Děkujeme! Vaše poptávka byla úspěšně odeslána.';
                    formStatusCalculator.classList.remove('error');
                    formStatusCalculator.classList.add('success');
                    cleaningCalculatorForm.reset(); // Vyčistí formulář
                    toggleFrequencyDisplay(); // Resetuje zobrazení frekvence po odeslání
                } else {
                    console.error('Web3Forms response error for calculator form:', result);
                    formStatusCalculator.textContent = result.message || 'Při odesílání poptávky došlo k chybě. Zkuste to prosím později.';
                    formStatusCalculator.classList.remove('success');
                    formStatusCalculator.classList.add('error');
                }
            } catch (error) {
                console.error('Chyba při odesílání kalkulačního formuláře:', error);
                formStatusCalculator.textContent = 'Při odesílání poptávky došlo k chybě sítě. Zkuste to prosím později.';
                formStatusCalculator.classList.remove('success');
                formStatusCalculator.classList.add('error');
            } finally {
                // Skryje stavovou zprávu po 5 sekundách
                setTimeout(() => {
                    formStatusCalculator.textContent = '';
                    formStatusCalculator.classList.remove('success', 'error');
                    formStatusCalculator.style.display = 'none';
                }, 5000);
            }
        });
    }

});
