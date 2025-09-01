document.addEventListener('DOMContentLoaded', () => {
    // Označ, že je JS aktivní (CSS fallback pro reveal-on-scroll)
    document.documentElement.classList.add('js');
    // Smooth Scrolling pouze pro odkazy v hlavní navigaci
    const headerEl = document.querySelector('.main-header');
    const navAnchors = document.querySelectorAll('.main-nav .nav-list a[href^="#"]');
    navAnchors.forEach(anchor => {
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
                // Důležité: pro přístupnost
                menuToggle.setAttribute('aria-expanded', 'false');
            }

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Přizpůsobení scrollu s ohledem na fixní header
                const headerOffset = headerEl ? headerEl.offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = Math.max(0, elementPosition - headerOffset - 20);

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            } else {
                console.warn(`Cílový prvek pro smooth scroll nebyl nalezen: ${targetId}`);
            }

            // Aktivní stav pouze v rámci navigace
            document.querySelectorAll('.main-nav .nav-list a').forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Samostatný smooth scroll pro klik na logo (bez měnění stavů v menu)
    const logoLink = document.querySelector('a.logo[href^="#"]');
    if (logoLink) {
        logoLink.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return; // přenecháme default

            e.preventDefault();

            const headerOffset = headerEl ? headerEl.offsetHeight : 0;
            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = Math.max(0, elementPosition - headerOffset - 20);

            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        });
    }

    // Intersection Observer pro animace reveal-on-scroll
    const revealSections = document.querySelectorAll('.reveal-on-scroll');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.15 // 15% prvku je viditelných
    };

    if ('IntersectionObserver' in window) {
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
    } else {
        // Fallback: pokud není IntersectionObserver, zobraz hned
        revealSections.forEach(section => section.classList.add('is-visible'));
    }

    // Mobilní menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');

    // A11y: doplnění ARIA a id pro mobilní menu, pokud chybí
    if (menuToggle) {
        if (!menuToggle.hasAttribute('aria-expanded')) {
            menuToggle.setAttribute('aria-expanded', 'false');
        }
        if (navList) {
            if (!navList.id) {
                navList.id = 'main-menu';
            }
            if (!menuToggle.hasAttribute('aria-controls')) {
                menuToggle.setAttribute('aria-controls', navList.id);
            }
        }
    }

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            const isExpanded = navList.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded); // Nastavení aria-expanded

            if (icon) {
                if (isExpanded) {
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
                menuToggle.setAttribute('aria-expanded', 'false'); // Aktualizace aria-expanded
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

    // --- Moderní glass custom select pro Typ úklidu a Frekvenci ---
    const buildCustomSelect = (nativeSelect) => {
        if (!nativeSelect) return;

        // Wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'select-modern';
        wrapper.setAttribute('data-name', nativeSelect.name || '');

        // Trigger
        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'select-trigger';
        trigger.setAttribute('aria-haspopup', 'listbox');
        trigger.setAttribute('aria-expanded', 'false');
        const triggerLabel = document.createElement('span');
        triggerLabel.className = 'select-label';
        trigger.appendChild(triggerLabel);
        const caret = document.createElement('span');
        caret.className = 'select-caret';
        trigger.appendChild(caret);

        // Menu
        const menu = document.createElement('ul');
        menu.className = 'select-menu';
        menu.setAttribute('role', 'listbox');

        // Build options
        const options = Array.from(nativeSelect.options);
        options.forEach((opt, idx) => {
            const li = document.createElement('li');
            li.className = 'select-option';
            li.setAttribute('role', 'option');
            li.dataset.value = opt.value;
            li.textContent = opt.textContent;
            if (opt.selected) {
                li.classList.add('is-selected');
                li.setAttribute('aria-selected', 'true');
            }
            menu.appendChild(li);
        });

        // Insert elements
        nativeSelect.classList.add('select-hidden');
        nativeSelect.parentNode.insertBefore(wrapper, nativeSelect);
        wrapper.appendChild(nativeSelect);
        wrapper.appendChild(trigger);
        wrapper.appendChild(menu);

        const syncLabel = () => {
            const sel = options[nativeSelect.selectedIndex];
            triggerLabel.textContent = sel ? sel.textContent : '';
        };
        syncLabel();

        const openMenu = () => { wrapper.classList.add('open'); trigger.setAttribute('aria-expanded', 'true'); };
        const closeMenu = () => { wrapper.classList.remove('open'); trigger.setAttribute('aria-expanded', 'false'); };

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            if (wrapper.classList.contains('open')) closeMenu(); else openMenu();
        });

        // Click option
        menu.addEventListener('click', (e) => {
            const li = e.target.closest('.select-option');
            if (!li) return;
            const value = li.dataset.value;
            nativeSelect.value = value;
            // update selected classes
            menu.querySelectorAll('.select-option').forEach(o => { o.classList.remove('is-selected'); o.removeAttribute('aria-selected'); });
            li.classList.add('is-selected');
            li.setAttribute('aria-selected', 'true');
            syncLabel();
            nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));
            closeMenu();
        });

        // Keyboard support on trigger
        trigger.addEventListener('keydown', (e) => {
            const key = e.key;
            if (key === ' ' || key === 'Enter') { e.preventDefault(); openMenu(); return; }
            if (key === 'Escape') { closeMenu(); return; }
            if (key === 'ArrowDown' || key === 'ArrowUp') {
                e.preventDefault();
                let idx = nativeSelect.selectedIndex;
                idx += (key === 'ArrowDown') ? 1 : -1;
                idx = Math.max(0, Math.min(options.length - 1, idx));
                nativeSelect.selectedIndex = idx;
                syncLabel();
                // update visual selection if menu is open
                const lis = menu.querySelectorAll('.select-option');
                lis.forEach(o => { o.classList.remove('is-selected'); o.removeAttribute('aria-selected'); });
                const selLi = lis[idx];
                if (selLi) { selLi.classList.add('is-selected'); selLi.setAttribute('aria-selected', 'true'); selLi.scrollIntoView({ block: 'nearest' }); }
            }
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target)) closeMenu();
        });

        // Sync when native select changes (e.g., programmatically)
        nativeSelect.addEventListener('change', syncLabel);
    };

    buildCustomSelect(document.getElementById('cleaningType'));
    buildCustomSelect(document.getElementById('cleaningFrequency'));
    // (reverted) odstraněno přidávání třídy is-open pro selecty

    // --- Logika pro kalkulační formulář a checkboxy ---
    const cleaningCalculatorForm = document.getElementById('kalkulacka');
    const formStatusCalculator = document.getElementById('calculator-status');
    const cleaningTypeSelect = document.getElementById('cleaningType');
    const frequencyGroup = document.getElementById('frequencyGroup');
    const frequencySelect = document.getElementById('cleaningFrequency');

    if (cleaningCalculatorForm && formStatusCalculator && cleaningTypeSelect && frequencyGroup && frequencySelect) {
        // Logika pro zobrazení/skrytí pole "Frekvence úklidu"
        const toggleFrequencyDisplay = () => {
            // Kontrolujeme jak anglické, tak české hodnoty, pokud se v HTML používají obě varianty
            if (cleaningTypeSelect.value === 'regular_home' || cleaningTypeSelect.value === 'commercial' || cleaningTypeSelect.value === 'Pravidelný úklid domácnosti' || cleaningTypeSelect.value === 'Komerční úklid') {
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
            formStatusCalculator.style.color = "#007bff"; // Modrá barva
            formStatusCalculator.style.fontWeight = "bold";
            formStatusCalculator.style.display = 'block';

            const formData = new FormData(cleaningCalculatorForm);
            
            // Přidáme předmět pro email, pokud již není nastaven v HTML inputu
            if (!formData.has('subject')) {
                formData.append('subject', 'Nová poptávka z kalkulačky úklidu - Lesktop');
            }

            // *** ÚPRAVY PRO DOPLŇKOVÉ SLUŽBY ***
            // Získání všech zaškrtnutých checkboxů pro doplňkové služby
            const extraServicesCheckboxes = cleaningCalculatorForm.querySelectorAll('input[name="Doplňkové služby[]"]:checked');
            const selectedServices = [];
            extraServicesCheckboxes.forEach(checkbox => {
                selectedServices.push(checkbox.value);
            });

            // Odstraníme původní pole "Doplňkové služby[]" a přidáme jedno nové s formátovaným textem
            formData.delete('Doplňkové služby[]'); // Odstraníme původní pole s hranatými závorkami
            if (selectedServices.length > 0) {
                // Přidáme nové pole s názvem "Doplňkové služby" (BEZ hranatých závorek)
                // Hodnoty se spojí do jednoho řetězce odděleného čárkou a mezerou.
                formData.append('Doplňkové služby', selectedServices.join(', '));
            } else {
                // Pokud nebyly vybrány žádné služby, odešleme text "Žádné".
                formData.append('Doplňkové služby', 'Žádné');
            }
            // *** KONEC ÚPRAV PRO DOPLŇKOVÉ SLUŽBY ***

            // *** ÚPRAVA PRO DOMÁCÍ MAZLÍČKY ***
            const hasPetsCheckbox = cleaningCalculatorForm.querySelector('input[name="Domácí mazlíčci"]:checked');
            if (hasPetsCheckbox) {
                formData.set('Domácí mazlíčci', 'Ano'); // Ujistíme se, že se odešle jen 'Ano' pokud je zaškrtnuto
            } else {
                formData.set('Domácí mazlíčci', 'Ne'); // Pokud není zaškrtnuto, odešleme 'Ne'
            }
            // *** KONEC ÚPRAV PRO DOMÁCÍ MAZLÍČKY ***


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
                    formStatusCalculator.style.color = "green";
                    formStatusCalculator.classList.remove('error');
                    formStatusCalculator.classList.add('success');
                    cleaningCalculatorForm.reset(); // Vyčistí formulář
                    toggleFrequencyDisplay(); // Resetuje zobrazení frekvence po odeslání
                } else {
                    console.error('Web3Forms response error for calculator form:', result);
                    formStatusCalculator.textContent = result.message || 'Při odesílání poptávky došlo k chybě. Zkuste to prosím později.';
                    formStatusCalculator.style.color = "red";
                    formStatusCalculator.classList.remove('success');
                    formStatusCalculator.classList.add('error');
                }
            } catch (error) {
                console.error('Chyba při odesílání kalkulačního formuláře:', error);
                formStatusCalculator.textContent = 'Při odesílání poptávky došlo k chybě sítě. Zkuste to prosím později.';
                formStatusCalculator.style.color = "red";
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
