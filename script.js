document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scrolling pro navigační odkazy
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Zavře mobilní menu, pokud je otevřené
            const navList = document.querySelector('.nav-list');
            const menuToggle = document.querySelector('.menu-toggle');
            if (navList.classList.contains('active')) {
                navList.classList.remove('active');
                // Změna ikony zpět na hamburgra
                if (menuToggle) {
                    menuToggle.querySelector('i').classList.remove('fa-times');
                    menuToggle.querySelector('i').classList.add('fa-bars');
                }
            }

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });

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
                entry.target.classList.add('is-visible');
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
            if (navList.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times'); // Křížek
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars'); // Hamburgra
            }
        });
    }

    // --- Zde začíná upravená část pro odesílání kontaktního formuláře pomocí Web3Forms ---
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Zabrání výchozímu odeslání prohlížeče

            // Zobrazíme "Odesílám..." hned po kliknutí
            formStatus.textContent = 'Odesílám...';
            formStatus.classList.remove('success', 'error');
            formStatus.style.display = 'block';

            const formData = new FormData(contactForm); // Získáme data z formuláře

            try {
                // Používáme Web3Forms API endpoint a metodu POST, jak je definováno v HTML action a method
                const response = await fetch(contactForm.action, {
                    method: contactForm.method,
                    body: formData, // FormData automaticky nastaví správný Content-Type
                    headers: {
                        'Accept': 'application/json' // Očekáváme JSON odpověď z Web3Forms
                    }
                });

                const result = await response.json(); // Převedeme odpověď na JSON

                if (result.success) {
                    formStatus.textContent = 'Děkujeme! Vaše zpráva byla úspěšně odeslána.';
                    formStatus.classList.remove('error');
                    formStatus.classList.add('success');
                    contactForm.reset(); // Vymaže formulář po úspěšném odeslání
                } else {
                    // Web3Forms vrátí zprávu o chybě v 'message' atributu
                    formStatus.textContent = result.message || 'Při odesílání zprávy došlo k chybě. Zkuste to prosím později.';
                    formStatus.classList.remove('success');
                    formStatus.classList.add('error');
                }
            } catch (error) {
                console.error('Chyba při odesílání formuláře:', error);
                formStatus.textContent = 'Při odesílání zprávy došlo k chybě sítě. Zkuste to prosím později.';
                formStatus.classList.remove('success');
                formStatus.classList.add('error');
            } finally {
                // Zpráva zmizí po 5 sekundách
                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.classList.remove('success', 'error');
                    formStatus.style.display = 'none';
                }, 5000); 
            }
        });
    }
    // --- Konec upravené části pro odesílání kontaktního formuláře ---


    // Volitelné: Automatické nastavení aktivní třídy navigace při scrollování
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.main-nav .nav-list a');

    const scrollSpyOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Když je 50% sekce viditelné
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
