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

    // --- Zde začíná upravená část pro odesílání kontaktního formuláře pomocí Web3Forms ---
    const contactForm = document.getElementById('contactForm');
    const formStatusContact = document.getElementById('form-status');

    if (contactForm && formStatusContact) {
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault();

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
                    contactForm.reset();
                } else {
                    console.error('Web3Forms response error for contact form:', result);
                    formStatusContact.textContent = result.message || 'Při odesílání zprávy došlo k chybě. Zkuste to prosím později.';
                    formStatusContact.classList.remove('success');
                    formStatusContact.classList.add('error');
                }
            } catch (error) {
                console.error('Chyba při odesílání formuláře:', error);
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
    // --- Konec upravené části pro odesílání kontaktního formuláře ---


    // --- NOVÁ ČÁST: Logika pro kalkulační formulář (odesílání na Web3Forms) ---
    const cleaningCalculatorForm = document.getElementById('kalkulacka');
    const formStatusCalculator = document.getElementById('calculator-status');
    const cleaningTypeSelect = document.getElementById('cleaningType');
    const frequencyGroup = document.getElementById('frequencyGroup');
    const frequencySelect = document.getElementById('cleaningFrequency'); // Opraveno: přímo ID

    if (cleaningCalculatorForm && formStatusCalculator && cleaningTypeSelect && frequencyGroup && frequencySelect) {
        // Logika pro zobrazení/skrytí pole "Frekvence úklidu"
        const toggleFrequencyDisplay = () => {
            if (cleaningTypeSelect.value === 'regular_home' || cleaningTypeSelect.value === 'commercial') {
                frequencyGroup.style.display = 'block';
                frequencySelect.setAttribute('required', 'required');
            } else {
                frequencyGroup.style.display = 'none';
                frequencySelect.removeAttribute('required');
                frequencySelect.value = ''; // Resetujeme hodnotu, aby se neodesílala nesmyslná hodnota
            }
        };

        cleaningTypeSelect.addEventListener('change', toggleFrequencyDisplay);

        // Zajistit správné zobrazení při načtení stránky
        toggleFrequencyDisplay();


        cleaningCalculatorForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            formStatusCalculator.textContent = 'Odesílám poptávku...';
            formStatusCalculator.classList.remove('success', 'error');
            formStatusCalculator.style.display = 'block';

            const formData = new FormData(cleaningCalculatorForm);
            
            formData.append('subject', 'Nová poptávka z kalkulačky úklidu - Lesktop');

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
                    formStatusCalculator.textContent = 'Vaše poptávka byla úspěšně odeslána! Brzy se vám ozveme s nezávaznou nabídkou.';
                    formStatusCalculator.classList.remove('error');
                    formStatusCalculator.classList.add('success');
                    cleaningCalculatorForm.reset();
                    toggleFrequencyDisplay();
                } else {
                    console.error('Chyba při odesílání poptávky z kalkulačky:', result);
                    formStatusCalculator.textContent = result.message || 'Chyba při odesílání poptávky. Zkuste to prosím znovu.';
                    formStatusCalculator.classList.remove('success');
                    formStatusCalculator.classList.add('error');
                }
            } catch (error) {
                console.error('Network error for calculator form:', error);
                formStatusCalculator.textContent = 'Problém s připojením. Zkuste to prosím znovu.';
                formStatusCalculator.classList.remove('success');
                formStatusCalculator.classList.add('error');
            } finally {
                setTimeout(() => {
                    formStatusCalculator.textContent = '';
                    formStatusCalculator.classList.remove('success', 'error');
                    formStatusCalculator.style.display = 'none';
                }, 5000);
            }
        });
    } else {
        console.warn('Jeden nebo více elementů pro kalkulační formulář nebyly nalezeny. Inicializace kalkulačky přeskočena.');
        console.log({
            cleaningCalculatorForm: !!cleaningCalculatorForm,
            formStatusCalculator: !!formStatusCalculator,
            cleaningTypeSelect: !!cleaningTypeSelect,
            frequencyGroup: !!frequencyGroup,
            frequencySelect: !!frequencySelect
        });
    }
    // --- KONEC NOVÉ ČÁSTI pro kalkulační formulář ---


    // Volitelné: Automatické nastavení aktivní třídy navigace při scrollování
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-nav .nav-list a');

    const scrollSpyOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };

    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentSectionId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentSectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, scrollSpyOptions);

    sections.forEach(section => {
        scrollSpyObserver.observe(section);
    });
});
