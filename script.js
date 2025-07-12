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

    // Odeslání kontaktního formuláře (simulace)
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Zabrání výchozímu odeslání

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (name && email && message) {
                // Simulace AJAX požadavku (např. odeslání na server)
                // V reálné aplikaci byste zde použili fetch() API:
                // fetch('vase_server_endpoint.php', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({ name, email, message })
                // })
                // .then(response => response.json())
                // .then(data => { /* zpracovat odpověď */ })
                // .catch(error => { /* zpracovat chybu */ });

                console.log('Formulář odeslán:', { name, email, message });

                formStatus.textContent = 'Děkujeme! Vaše zpráva byla úspěšně odeslána.';
                formStatus.classList.remove('error');
                formStatus.classList.add('success');
                contactForm.reset(); // Vymaže formulář
            } else {
                formStatus.textContent = 'Prosím, vyplňte všechna pole.';
                formStatus.classList.remove('success');
                formStatus.classList.add('error');
            }

            // Zobrazení statusu na krátkou dobu
            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.classList.remove('success', 'error');
                formStatus.style.display = 'none'; // Skryje prvek
            }, 5000); // Zpráva zmizí po 5 sekundách
        });
    }

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
