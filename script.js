document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scrolling pro navigační odkazy
    // Vybereme všechny odkazy, které začínají '#' a nejsou prázdné
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => { // Změna: přidáno :not([href="#"]) aby se ignorovaly prázdné # odkazy
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Zavře mobilní menu, pokud je otevřené
            const navList = document.querySelector('.nav-list');
            const menuToggle = document.querySelector('.menu-toggle');
            if (navList && menuToggle && navList.classList.contains('active')) { // Změna: Přidány kontroly, zda elementy existují
                navList.classList.remove('active');
                // Změna ikony zpět na hamburgra
                const icon = menuToggle.querySelector('i'); // Změna: Referenci na ikonu získáváme přímo
                if (icon) { // Změna: Kontrola, zda ikona existuje
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) { // Změna: Kontrola, zda cílový prvek existuje
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            } else {
                console.warn(`Cílový prvek pro smooth scroll nebyl nalezen: ${targetId}`);
            }

            // Volitelné: Přidat třídu 'active' k odkazu po kliknutí (pro vizuální zvýraznění)
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

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible'); // Změna: Třída je nyní 'is-visible' pro konzistenci s CSS
                observer.unobserve(entry.target); // Zastaví pozorování, jakmile je animace spuštěna
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
            // Změna ikony hamburgra na křížek a zpět
            const icon = menuToggle.querySelector('i');
            if (icon) { // Změna: Kontrola, zda ikona existuje
                if (navList.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times'); // Křížek
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars'); // Hamburgra
                }
            }
        });

        // Změna: Zavření menu při změně velikosti okna (pokud se přepne na desktop)
        // Toto zabrání situaci, kdy mobilní menu zůstane otevřené na desktopu
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navList.classList.contains('active')) { // Předpokládáme breakpoint 768px
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
                    console.error('Web3Forms response error for contact form:', result); // Logujeme celou odpověď
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
    const cleaningCalculatorForm = document.getElementById('cleaningCalculator');
    const formStatusCalculator = document.getElementById('calculator-status');
    const cleaningTypeSelect = document.getElementById('cleaningType');
    const frequencyGroup = document.getElementById('frequencyGroup');
    const frequencySelect = frequencyGroup ? frequencyGroup.querySelector('select') : null; // Změna: Získání reference na select prvek

    if (cleaningCalculatorForm && formStatusCalculator && cleaningTypeSelect && frequencyGroup && frequencySelect) { // Změna: Všechny potřebné elementy musí existovat
        // Logika pro zobrazení/skrytí pole "Frekvence úklidu"
        const toggleFrequencyDisplay = () => {
            if (cleaningTypeSelect.value === 'regular_home' || cleaningTypeSelect.value === 'commercial') {
                frequencyGroup.style.display = 'block';
                frequencySelect.setAttribute('required', 'required'); // Změna: Použijeme získanou referenci
            } else {
                frequencyGroup.style.display = 'none';
                frequencySelect.removeAttribute('required'); // Změna: Použijeme získanou referenci
                frequencySelect.value = ''; // Změna: Resetujeme hodnotu, aby se neodesílala nesmyslná hodnota
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
            
            // Přidáme předmět e-mailu pro kalkulačku, aby se lépe identifikoval
            formData.append('subject', 'Nová poptávka z kalkulačky úklidu - Lesktop');

            try {
                // Změna: Ověříme, že action atribut formuláře existuje, jinak použijeme default
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
                    // Znovu skryjeme frekvenci a odebereme required, pokud se formulář resetuje
                    toggleFrequencyDisplay(); // Změna: Znovu zavoláme funkci pro správné skrytí/reset
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
        // Změna: Přidáme logování, pokud některý z elementů pro kalkulačku chybí
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
    const sections = document.querySelectorAll('section[id]'); // Změna: Pouze sekce s ID, které mohou být cílem odkazů
    const navLinks = document.querySelectorAll('.main-nav .nav-list a');

    const scrollSpyOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Změna: Centrujeme threshold, aby byl aktivní, když je sekce uprostřed viewportu
        threshold: 0 // Změna: Nulový threshold je efektivnější s rootMargin
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
