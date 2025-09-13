document.addEventListener('DOMContentLoaded', () => {
    // OznaÄŤ, Ĺľe je JS aktivnĂ­ (CSS fallback pro reveal-on-scroll)
    document.documentElement.classList.add('js');
    // Smooth Scrolling pouze pro odkazy v hlavnĂ­ navigaci
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
                // DĹŻleĹľitĂ©: pro pĹ™Ă­stupnost
                menuToggle.setAttribute('aria-expanded', 'false');
            }

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // PĹ™izpĹŻsobenĂ­ scrollu s ohledem na fixnĂ­ header
                const headerOffset = headerEl ? headerEl.offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = Math.max(0, elementPosition - headerOffset - 20);

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            } else {
                console.warn(`CĂ­lovĂ˝ prvek pro smooth scroll nebyl nalezen: ${targetId}`);
            }

            // AktivnĂ­ stav pouze v rĂˇmci navigace
            document.querySelectorAll('.main-nav .nav-list a').forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // SamostatnĂ˝ smooth scroll pro klik na logo (bez mÄ›nÄ›nĂ­ stavĹŻ v menu)
    const logoLink = document.querySelector('a.logo[href^="#"]');
    if (logoLink) {
        logoLink.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return; // pĹ™enechĂˇme default

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
        // Triggruje o nÄ›co dĹ™Ă­v, aby se obsah jevil sviĹľnÄ›ji
        rootMargin: '0px 0px -10%',
        threshold: 0.05
    };

    const revealNowInView = () => {
        revealSections.forEach(el => {
            const rect = el.getBoundingClientRect();
            const inView = rect.top < (window.innerHeight * 0.95) && rect.bottom > 0;
            if (inView) el.classList.add('is-visible');
        });
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
        // ihned po startu zobraz prvky, kterĂ© uĹľ jsou ve viewportu
        revealNowInView();
    } else {
        // Fallback: pokud nenĂ­ IntersectionObserver, zobraz hned
        revealSections.forEach(section => section.classList.add('is-visible'));
    }

    // MobilnĂ­ menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');

    // A11y: doplnÄ›nĂ­ ARIA a id pro mobilnĂ­ menu, pokud chybĂ­
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
            menuToggle.setAttribute('aria-expanded', isExpanded); // NastavenĂ­ aria-expanded

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

    // --- Logika pro odesĂ­lĂˇnĂ­ kontaktnĂ­ho formulĂˇĹ™e pomocĂ­ Web3Forms ---
    const contactForm = document.getElementById('contactForm');
    const formStatusContact = document.getElementById('form-status');

    if (contactForm && formStatusContact) {
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // ZabrĂˇnĂ­ vĂ˝chozĂ­mu odeslĂˇnĂ­ formulĂˇĹ™e

            formStatusContact.textContent = 'Odesilam...';
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
                    formStatusContact.textContent = 'Dekujeme! Vase zprava byla uspesne odeslana.';
                    formStatusContact.classList.remove('error');
                    formStatusContact.classList.add('success');
                    contactForm.reset(); // VyÄŤistĂ­ formulĂˇĹ™
                } else {
                    console.error('Web3Forms response error for contact form:', result);
                    formStatusContact.textContent = result.message || 'Pri odesilani zpravy doslo k chybe. Zkuste to prosim pozdeji.';
                    formStatusContact.classList.remove('success');
                    formStatusContact.classList.add('error');
                }
            } catch (error) {
                console.error('Chyba pri odesilani kontaktniho formulare:', error);
                formStatusContact.textContent = 'Pri odesilani zpravy doslo k chybe site. Zkuste to prosim pozdeji.';
                formStatusContact.classList.remove('success');
                formStatusContact.classList.add('error');
            } finally {
                // Skryje stavovou zprĂˇvu po 5 sekundĂˇch
                setTimeout(() => {
                    formStatusContact.textContent = '';
                    formStatusContact.classList.remove('success', 'error');
                    formStatusContact.style.display = 'none';
                }, 5000);
            }
        });
    }

    // --- ModernĂ­ glass custom select pro Typ Ăşklidu a Frekvenci ---
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
    // (reverted) odstranÄ›no pĹ™idĂˇvĂˇnĂ­ tĹ™Ă­dy is-open pro selecty

    // --- Logika pro kalkulaÄŤnĂ­ formulĂˇĹ™ a checkboxy ---
    const cleaningCalculatorForm = document.getElementById('kalkulacka');
    const formStatusCalculator = document.getElementById('calculator-status');
    const cleaningTypeSelect = document.getElementById('cleaningType');
    const frequencyGroup = document.getElementById('frequencyGroup');
    const frequencySelect = document.getElementById('cleaningFrequency');

    if (cleaningCalculatorForm && formStatusCalculator && cleaningTypeSelect && frequencyGroup && frequencySelect) {
        // Logika pro zobrazenĂ­/skrytĂ­ pole "Frekvence Ăşklidu"
        const toggleFrequencyDisplay = () => {
            // Kontrolujeme jak anglickĂ©, tak ÄŤeskĂ© hodnoty, pokud se v HTML pouĹľĂ­vajĂ­ obÄ› varianty
            if (cleaningTypeSelect.value === 'regular_home' || cleaningTypeSelect.value === 'commercial' || cleaningTypeSelect.value === 'PravidelnĂ˝ Ăşklid domĂˇcnosti' || cleaningTypeSelect.value === 'KomerÄŤnĂ­ Ăşklid') {
                frequencyGroup.style.display = 'block';
                frequencySelect.setAttribute('required', 'required'); // NastavĂ­ required, kdyĹľ je viditelnĂ˝
            } else {
                frequencyGroup.style.display = 'none';
                frequencySelect.removeAttribute('required'); // Odebere required, kdyĹľ je skrytĂ˝
                frequencySelect.value = ''; // Resetuje hodnotu, aby se neodesĂ­lala nesmyslnĂˇ hodnota
            }
        };

        // NaslouchĂˇnĂ­ na zmÄ›nu vĂ˝bÄ›ru typu Ăşklidu
        cleaningTypeSelect.addEventListener('change', toggleFrequencyDisplay);

        // Zajistit sprĂˇvnĂ© zobrazenĂ­ pĹ™i naÄŤtenĂ­ strĂˇnky
        toggleFrequencyDisplay();

        // OdesĂ­lĂˇnĂ­ kalkulaÄŤnĂ­ho formulĂˇĹ™e na Web3Forms
        cleaningCalculatorForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // ZabrĂˇnĂ­ vĂ˝chozĂ­mu odeslĂˇnĂ­ formulĂˇĹ™e

            formStatusCalculator.textContent = 'OdesĂ­lĂˇm poptĂˇvku...';
            formStatusCalculator.classList.remove('success', 'error');
            formStatusCalculator.style.color = "#007bff"; // ModrĂˇ barva
            formStatusCalculator.style.fontWeight = "bold";
            formStatusCalculator.style.display = 'block';

            const formData = new FormData(cleaningCalculatorForm);
            
            // PĹ™idĂˇme pĹ™edmÄ›t pro email, pokud jiĹľ nenĂ­ nastaven v HTML inputu
            if (!formData.has('subject')) {
                formData.append('subject', 'NovĂˇ poptĂˇvka z kalkulaÄŤky Ăşklidu - Lesktop');
            }

            // *** ĂšPRAVY PRO DOPLĹ‡KOVĂ‰ SLUĹ˝BY ***
            // ZĂ­skĂˇnĂ­ vĹˇech zaĹˇkrtnutĂ˝ch checkboxĹŻ pro doplĹkovĂ© sluĹľby
            const extraServicesCheckboxes = cleaningCalculatorForm.querySelectorAll('input[name="DoplĹkovĂ© sluĹľby[]"]:checked');
            const selectedServices = [];
            extraServicesCheckboxes.forEach(checkbox => {
                selectedServices.push(checkbox.value);
            });

            // OdstranĂ­me pĹŻvodnĂ­ pole "DoplĹkovĂ© sluĹľby[]" a pĹ™idĂˇme jedno novĂ© s formĂˇtovanĂ˝m textem
            formData.delete('DoplĹkovĂ© sluĹľby[]'); // OdstranĂ­me pĹŻvodnĂ­ pole s hranatĂ˝mi zĂˇvorkami
            if (selectedServices.length > 0) {
                // PĹ™idĂˇme novĂ© pole s nĂˇzvem "DoplĹkovĂ© sluĹľby" (BEZ hranatĂ˝ch zĂˇvorek)
                // Hodnoty se spojĂ­ do jednoho Ĺ™etÄ›zce oddÄ›lenĂ©ho ÄŤĂˇrkou a mezerou.
                formData.append('DoplĹkovĂ© sluĹľby', selectedServices.join(', '));
            } else {
                // Pokud nebyly vybrĂˇny ĹľĂˇdnĂ© sluĹľby, odeĹˇleme text "Ĺ˝ĂˇdnĂ©".
                formData.append('DoplĹkovĂ© sluĹľby', 'Ĺ˝ĂˇdnĂ©');
            }
            // *** KONEC ĂšPRAV PRO DOPLĹ‡KOVĂ‰ SLUĹ˝BY ***

            // *** ĂšPRAVA PRO DOMĂCĂŤ MAZLĂŤÄŚKY ***
            const hasPetsCheckbox = cleaningCalculatorForm.querySelector('input[name="DomĂˇcĂ­ mazlĂ­ÄŤci"]:checked');
            if (hasPetsCheckbox) {
                formData.set('DomĂˇcĂ­ mazlĂ­ÄŤci', 'Ano'); // UjistĂ­me se, Ĺľe se odeĹˇle jen 'Ano' pokud je zaĹˇkrtnuto
            } else {
                formData.set('DomĂˇcĂ­ mazlĂ­ÄŤci', 'Ne'); // Pokud nenĂ­ zaĹˇkrtnuto, odeĹˇleme 'Ne'
            }
            // *** KONEC ĂšPRAV PRO DOMĂCĂŤ MAZLĂŤÄŚKY ***


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
                    formStatusCalculator.textContent = 'DÄ›kujeme! VaĹˇe poptĂˇvka byla ĂşspÄ›ĹˇnÄ› odeslĂˇna.';
                    formStatusCalculator.style.color = "";
                    formStatusCalculator.classList.remove('error');
                    formStatusCalculator.classList.add('success');
                    cleaningCalculatorForm.reset(); // VyÄŤistĂ­ formulĂˇĹ™
                    toggleFrequencyDisplay(); // Resetuje zobrazenĂ­ frekvence po odeslĂˇnĂ­
                } else {
                    console.error('Web3Forms response error for calculator form:', result);
                    formStatusCalculator.textContent = result.message || 'PĹ™i odesĂ­lĂˇnĂ­ poptĂˇvky doĹˇlo k chybÄ›. Zkuste to prosĂ­m pozdÄ›ji.';
                    formStatusCalculator.style.color = "";
                    formStatusCalculator.classList.remove('success');
                    formStatusCalculator.classList.add('error');
                }
            } catch (error) {
                console.error('Chyba pĹ™i odesĂ­lĂˇnĂ­ kalkulaÄŤnĂ­ho formulĂˇĹ™e:', error);
                formStatusCalculator.textContent = 'PĹ™i odesĂ­lĂˇnĂ­ poptĂˇvky doĹˇlo k chybÄ› sĂ­tÄ›. Zkuste to prosĂ­m pozdÄ›ji.';
                formStatusCalculator.style.color = "red";
                formStatusCalculator.classList.remove('success');
                formStatusCalculator.classList.add('error');
            } finally {
                // Skryje stavovou zprĂˇvu po 5 sekundĂˇch
                setTimeout(() => {
                    formStatusCalculator.textContent = '';
                    formStatusCalculator.classList.remove('success', 'error');
                    formStatusCalculator.style.display = 'none';
                }, 5000);
            }
        });
    }

    // --- DodateÄŤnĂ© vylepĹˇenĂ­: sprĂˇvnĂ© zobrazenĂ­ frekvence podle skuteÄŤnĂ˝ch hodnot ---
    (function enhanceFrequencyVisibility(){
        const typeEl = document.getElementById('cleaningType');
        const groupEl = document.getElementById('frequencyGroup');
        const freqEl = document.getElementById('cleaningFrequency');
        if (!typeEl || !groupEl || !freqEl) return;
        const apply = () => {
            const v = typeEl.value || '';
            const show = (v === 'PravidelnĂ˝ Ăşklid domĂˇcnosti' || v.startsWith('Ăšklid komerÄŤnĂ­ch prostor'));
            if (show) {
                groupEl.style.display = 'block';
                freqEl.setAttribute('required', 'required');
            } else {
                groupEl.style.display = 'none';
                freqEl.removeAttribute('required');
                freqEl.value = '';
            }
        };
        typeEl.addEventListener('change', apply);
        apply();
    })();

    // --- ZachycenĂ­ submitu (capture) pro vlastnĂ­ validaci a odeslĂˇnĂ­ ---
    const withFetchSubmit = async (form, statusEl, buildFormData) => {
    const formData = buildFormData ? buildFormData(new FormData(form)) : new FormData(form);
    try {
        const response = await fetch(form.action || 'https://api.web3forms.com/submit', {
            method: form.method || 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        });
        const result = await response.json();
        if (result.success) {
            statusEl.textContent = 'Dekujeme! Vase zprava byla uspesne odeslana.';
            statusEl.classList.remove('error');
            statusEl.classList.add('success');
            statusEl.style.color = '';
            form.reset();
        } else {
            statusEl.textContent = result.message || 'Pri odesilani doslo k chybe. Zkuste to prosim pozdeji.';
            statusEl.classList.remove('success');
            statusEl.classList.add('error');
            statusEl.style.color = '';
        }
    } catch (e) {
        console.error('Chyba pri odesilani formulare:', e);
        statusEl.textContent = 'Pri odesilani doslo k chybe site. Zkuste to prosim pozdeji.';
        statusEl.classList.remove('success');
        statusEl.classList.add('error');
        statusEl.style.color = '';
    } finally {
        setTimeout(() => {
            statusEl.textContent = '';
            statusEl.classList.remove('success', 'error');
            statusEl.style.display = 'none';
        }, 5000);
    }
};

    // Kontakt: validace a odeslĂˇnĂ­ (capture zastavĂ­ pĹŻvodnĂ­ listener)
    (function enhanceContactForm(){
        const form = document.getElementById('contactForm');
        const statusEl = document.getElementById('form-status');
        if (!form || !statusEl) return;
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();

            const nameField = document.getElementById('name');
            const emailField = document.getElementById('email');
            const messageField = document.getElementById('message');
            let valid = true;
            [nameField, emailField, messageField].forEach(el => el && el.setAttribute('aria-invalid', 'false'));
            if (!nameField.checkValidity()) { valid = false; nameField.setAttribute('aria-invalid', 'true'); }
            if (!emailField.checkValidity()) { valid = false; emailField.setAttribute('aria-invalid', 'true'); }
            if (!messageField.checkValidity()) { valid = false; messageField.setAttribute('aria-invalid', 'true'); }

            if (!valid) {
                statusEl.textContent = 'Zkontrolujte prosĂ­m zvĂ˝raznÄ›nĂˇ pole.';
                statusEl.classList.remove('success');
                statusEl.classList.add('error');
                statusEl.style.display = 'block';
                return;
            }

            statusEl.textContent = 'OdesĂ­lĂˇm...';
            statusEl.classList.remove('success', 'error');
            statusEl.textContent = 'Odesilam...';
            statusEl.style.display = 'block';

            await withFetchSubmit(form, statusEl);
        }, true);
    })();

    // KalkulaÄŤka: validace, normalizace polĂ­ a odeslĂˇnĂ­ (capture)
    (function enhanceCalculatorForm(){
        const form = document.getElementById('kalkulacka');
        const statusEl = document.getElementById('calculator-status');
        const typeEl = document.getElementById('cleaningType');
        if (!form || !statusEl || !typeEl) return;
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();

            const email = document.getElementById('customerEmail');
            const area = document.getElementById('areaSize');
            const nameInput = document.getElementById('customerName');
            const phoneInput = document.getElementById('customerPhone');
            let valid = true;
            const phoneRe = /^\+?[0-9\s-]{7,18}$/;
            [email, area, nameInput, phoneInput].forEach(el => el && el.setAttribute('aria-invalid', 'false'));
            if (!typeEl.value) { valid = false; }
            if (!email.checkValidity()) { valid = false; email.setAttribute('aria-invalid', 'true'); }
            if (!area.checkValidity()) { valid = false; area.setAttribute('aria-invalid', 'true'); }
            if (!nameInput.checkValidity()) { valid = false; nameInput.setAttribute('aria-invalid', 'true'); }
            if (phoneInput && phoneInput.value && !phoneRe.test(phoneInput.value)) { valid = false; phoneInput.setAttribute('aria-invalid', 'true'); }

            if (!valid) {
                statusEl.textContent = 'Zkontrolujte prosĂ­m zvĂ˝raznÄ›nĂˇ pole.';
                statusEl.classList.remove('success');
                statusEl.classList.add('error');
                statusEl.style.display = 'block';
                return;
            }

            statusEl.textContent = 'OdesĂ­lĂˇm poptĂˇvku...';
            statusEl.classList.remove('success', 'error');
            statusEl.style.color = '#007bff';
            statusEl.style.fontWeight = 'bold';
            statusEl.style.display = 'block';

            const buildFormData = (fd) => {
    if (!fd.has('subject')) {
        fd.append('subject', 'Nova poptavka z kalkulacky uklidu - Lesktop');
    }
    // Sloucit doplnkove sluzby do jedne polozky
    const checked = form.querySelectorAll('input[name="Doplňkové služby[]"]:checked');
    const selected = Array.from(checked).map(c => c.value);
    fd.delete('Doplňkové služby[]');
    fd.append('Doplňkové služby', selected.length ? selected.join(', ') : 'Zadne');
    // Domaci mazlicci Ano/Ne
    const pets = form.querySelector('input[name="Domácí mazlíčci"]:checked');
    fd.set('Domácí mazlíčci', pets ? 'Ano' : 'Ne');
    return fd;
};

            await withFetchSubmit(form, statusEl, buildFormData);
        }, true);
    })();

});

// --- Lightweight i18n (CS/EN) ---
document.addEventListener('DOMContentLoaded', () => { return; // i18n disabled
  const htmlEl = document.documentElement;
  const elements = [
    { sel: '.main-nav .nav-list a[href="#about"]', type: 'text', en: 'About Us' },
    { sel: '.main-nav .nav-list a[href="#services"]', type: 'text', en: 'Services' },
    { sel: '.main-nav .nav-list a[href="#pricing"]', type: 'text', en: 'Pricing' },
    { sel: '.main-nav .nav-list a[href="#contact"]', type: 'text', en: 'Contact' },

    { sel: '#about .section-title', type: 'text', en: 'About Us' },
    { sel: '#services .section-title', type: 'text', en: 'Our Services' },
    { sel: '#pricing .section-title', type: 'text', en: 'Pricing & Quote' },
    { sel: '#pricing .section-subtitle', type: 'text', en: 'Non-binding Cleaning Quote' },
    { sel: '#contact .section-title', type: 'text', en: 'Contact Us' },
    { sel: '#contact .container > p', type: 'text', en: 'Interested in our services? Fill the form or contact us directly!' },

    // Calculator labels
    { sel: '#kalkulacka label[for="cleaningType"]', type: 'text', en: 'Cleaning type:' },
    { sel: '#kalkulacka label[for="areaSize"]', type: 'text', en: 'Approx. area size (mÂ˛):' },
    { sel: '#kalkulacka small', type: 'text', en: 'Please enter the total area to be cleaned.' },
    { sel: '#kalkulacka label[for="cleaningFrequency"]', type: 'text', en: 'Cleaning frequency:' },
    { sel: '#kalkulacka label[for="extraServices"]', type: 'text', en: 'Additional services (optional):' },
    { sel: '#kalkulacka .form-group label', type: 'text-contains:DomĂˇcĂ­', en: 'Do you have pets?' },
    { sel: '#kalkulacka .form-group small', type: 'text-contains:mazlĂ­ÄŤ', en: 'This helps us calculate correctly and choose suitable products.' },
    { sel: '#kalkulacka label[for="customerName"]', type: 'text', en: 'Your name:' },
    { sel: '#kalkulacka label[for="customerEmail"]', type: 'text', en: 'Your email:' },
    { sel: '#kalkulacka label[for="customerPhone"]', type: 'text', en: 'Your phone (optional):' },
    { sel: '#kalkulacka label[for="notes"]', type: 'text', en: 'Additional notes (specification, preferred date):' },
    { sel: '#kalkulacka button[type="submit"]', type: 'text', en: 'Get a free quote' },

    // Contact form labels
    { sel: '#contactForm label[for="name"]', type: 'text', en: 'Name:' },
    { sel: '#contactForm label[for="email"]', type: 'text', en: 'Email:' },
    { sel: '#contactForm label[for="message"]', type: 'text', en: 'Message:' },
    { sel: '#contactForm button[type="submit"]', type: 'text', en: 'Send request' },
  ];

  const placeholders = [
    { sel: '#areaSize', en: 'e.g. 80' },
    { sel: '#customerName', en: 'Full name' },
    { sel: '#customerEmail', en: 'your@email.com' },
    { sel: '#customerPhone', en: '+420 123 456 789' },
    { sel: '#notes', en: 'e.g. 2-room flat, prefer Tuesday morningsâ€¦' },
    { sel: '#name', en: 'Your name' },
    { sel: '#email', en: 'your@email.com' },
    { sel: '#message', en: 'Describe how we can helpâ€¦' },
  ];

  // Save original texts/placeholders lazily
  const saveOriginal = (el, attr) => {
    const key = attr ? 'i18nOrig_' + attr : 'i18nOrig';
    if (!el.dataset[key]) {
      el.dataset[key] = attr ? (el.getAttribute(attr) || '') : (el.textContent || '');
    }
  };

  const setLang = (lang) => {
    const toEn = lang === 'en';
    htmlEl.setAttribute('lang', toEn ? 'en' : 'cs');
    // Toggle pressed state
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.setAttribute('aria-pressed', btn.dataset.lang === lang ? 'true' : 'false');
    });

    // Text nodes
    elements.forEach(item => {
      if (item.type && item.type.startsWith('text-contains:')) {
        const needle = item.type.split(':')[1];
        document.querySelectorAll(item.sel).forEach(el => {
          if (el.textContent && el.textContent.indexOf(needle) !== -1) {
            saveOriginal(el);
            el.textContent = toEn ? item.en : (el.dataset.i18nOrig || el.textContent);
          }
        });
        return;
      }
      const el = document.querySelector(item.sel);
      if (!el) return;
      saveOriginal(el);
      el.textContent = toEn ? item.en : (el.dataset.i18nOrig || el.textContent);
    });

    // Placeholders
    placeholders.forEach(item => {
      const el = document.querySelector(item.sel);
      if (!el) return;
      saveOriginal(el, 'placeholder');
      el.setAttribute('placeholder', toEn ? item.en : (el.dataset.i18nOrig_placeholder || el.getAttribute('placeholder') || ''));
    });

    // About/Services/Pricing intro paragraphs
    const setText = (sel, enText) => {
      const el = document.querySelector(sel);
      if (!el) return;
      // prefer preserving markup when restoring CS
      if (!el.dataset.i18nOrigHTML) el.dataset.i18nOrigHTML = el.innerHTML;
      if (toEn) {
        el.textContent = enText;
      } else {
        el.innerHTML = el.dataset.i18nOrigHTML || el.innerHTML;
      }
    };
    setText('#about .container p', 'We are a professional cleaning company providing comprehensive services for homes and businesses across Prague and Central Bohemia. We value thoroughness, reliability and efficiency. With a personal approach and care, we deliver the cleanliness you deserve.');
    setText('#services .container > p', 'We provide comprehensive cleaning services for homes and businesses. Everything is tailored to your individual needs.');
    setText('#pricing .container > p', 'Our pricing is transparent and flexible, tailored to your needs. Get a quick estimate using our calculator.');

    // Services section: headings and buttons
    const serviceHeads = document.querySelectorAll('.services-grid .service-item h3');
    const serviceParas = document.querySelectorAll('.services-grid .service-item p');
    const serviceHeadsEN = [
      'Regular home cleaning',
      'One-off & deep cleaning',
      'Office and commercial cleaning',
      'Window cleaning and extras',
      'Proven and effective cleaning agents',
      'Custom plan and flexibility',
    ];
    serviceHeads.forEach((h, i) => { if (serviceHeadsEN[i]) { saveOriginal(h); h.textContent = toEn ? serviceHeadsEN[i] : (h.dataset.i18nOrig || h.textContent); } });
    const serviceParasEN = [
      'Keep your home fresh and clean with our regular cleaning plans. We tailor frequency and scope precisely to your needs.',
      'Need a thorough clean after moving, renovation, a party, or spring cleaning? We are ready to clean every corner of your flat or house.',
      'We ensure professional cleanliness for your business. From regular maintenance to deep cleaning of offices, shops and common areas.',
      'We offer precise window cleaning, ironing, carpet and upholstery cleaning. All tailored to your preferences.',
      'We use only proven cleaning agents that deliver excellent results and meet hygiene standards.',
      'Each client is unique. We create a custom cleaning plan and adapt to your schedule and specific requirements.',
    ];
    serviceParas.forEach((p, i) => { if (serviceParasEN[i]) { saveOriginal(p); p.textContent = toEn ? serviceParasEN[i] : (p.dataset.i18nOrig || p.textContent); } });
    document.querySelectorAll('.services-grid .service-item a.btn').forEach(a => {
      saveOriginal(a);
      const en = a.getAttribute('href') === '#pricing' ? 'Learn more & quote' : (a.getAttribute('href') === '#contact' ? 'Contact us' : 'Learn more');
      a.textContent = toEn ? en : (a.dataset.i18nOrig || a.textContent);
    });

    // Pricing cards headings/info/notes
    const cards = document.querySelectorAll('.pricing-grid .price-card');
    if (cards[0]) {
      const h = cards[0].querySelector('h3'); if (h){ saveOriginal(h); h.textContent = toEn ? 'Regular home cleaning' : (h.dataset.i18nOrig || h.textContent); }
      const info = cards[0].querySelector('.price-info'); if (info){ saveOriginal(info); info.textContent = toEn ? 'Price by area' : (info.dataset.i18nOrig || info.textContent); }
      const note = cards[0].querySelector('.price-note'); if (note){ saveOriginal(note); note.textContent = toEn ? 'Prices are indicative; final quote depends on your specific requirements and scope.' : (note.dataset.i18nOrig || note.textContent); }
      // Translate list labels and currency in card 0
      cards[0].querySelectorAll('.price-list li').forEach(li => {
        saveOriginal(li);
        if (toEn) {
          let t = li.textContent.replace(/^\s*Do\s+/i, 'Up to ').replace('KÄŤ', 'CZK');
          li.textContent = t;
        } else {
          li.textContent = li.dataset.i18nOrig || li.textContent;
        }
      });
    }
    if (cards[1]) {
      const h = cards[1].querySelector('h3'); if (h){ saveOriginal(h); h.textContent = toEn ? 'One-off cleaning' : (h.dataset.i18nOrig || h.textContent); }
      const info = cards[1].querySelector('.price-info'); if (info){ saveOriginal(info); info.textContent = toEn ? 'Price by area (+50% vs. regular)' : (info.dataset.i18nOrig || info.textContent); }
      const note = cards[1].querySelector('.price-note'); if (note){ saveOriginal(note); note.textContent = toEn ? 'Suitable after moving, renovation, or for deep cleaning.' : (note.dataset.i18nOrig || note.textContent); }
      // Translate list labels and currency in card 1
      cards[1].querySelectorAll('.price-list li').forEach(li => {
        saveOriginal(li);
        if (toEn) {
          let t = li.textContent.replace(/^\s*Do\s+/i, 'Up to ').replace('KÄŤ', 'CZK');
          li.textContent = t;
        } else {
          li.textContent = li.dataset.i18nOrig || li.textContent;
        }
      });
    }
    if (cards[2]) {
      const h = cards[2].querySelector('h3'); if (h){ saveOriginal(h); h.textContent = toEn ? 'Commercial spaces' : (h.dataset.i18nOrig || h.textContent); }
      const from = cards[2].querySelector('.price-from'); if (from){ saveOriginal(from); from.textContent = toEn ? 'Custom quote' : (from.dataset.i18nOrig || from.textContent); }
      const note = cards[2].querySelector('.price-note'); if (note){ saveOriginal(note); note.textContent = toEn ? 'Please contact us for a tailored quote.' : (note.dataset.i18nOrig || note.textContent); }
      const lis = cards[2].querySelectorAll('ul li');
      if (lis[0]) { saveOriginal(lis[0]); lis[0].textContent = toEn ? 'Offices, shops' : (lis[0].dataset.i18nOrig || lis[0].textContent); }
      if (lis[1]) { saveOriginal(lis[1]); lis[1].textContent = toEn ? 'Flexible hours' : (lis[1].dataset.i18nOrig || lis[1].textContent); }
      if (lis[2]) { saveOriginal(lis[2]); lis[2].textContent = toEn ? 'Regular care' : (lis[2].dataset.i18nOrig || lis[2].textContent); }
    }

    // Update document title and meta description
    document.title = toEn ? 'Lesktop | Professional Cleaning Services for Homes and Offices' : document.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      const descEN = 'Lesktop provides reliable, thorough cleaning services. We specialize in homes, offices and common areas across Prague and Central Bohemia.';
      if (toEn) metaDesc.setAttribute('content', descEN);
    }

    // Update menu toggle aria-label
    const menuToggleBtn = document.querySelector('.menu-toggle');
    if (menuToggleBtn) menuToggleBtn.setAttribute('aria-label', toEn ? 'Toggle menu' : 'PĹ™epnout menu');

    // Footer copyright
    const foot = document.querySelector('.main-footer .container > p');
    if (foot) { saveOriginal(foot); foot.textContent = toEn ? 'Â© 2025 Lesktop. All rights reserved.' : (foot.dataset.i18nOrig || foot.textContent); }

    // Contact info lines
    const saveOrigHTML = (el) => { if (el && !el.dataset.i18nOrigHTML) el.dataset.i18nOrigHTML = el.innerHTML; };
    const infoPs = document.querySelectorAll('#contact .contact-info p');
    if (infoPs[0]) { saveOrigHTML(infoPs[0]); infoPs[0].innerHTML = toEn ? '<i class="fas fa-phone-alt"></i> Phone: <strong>+420 775 344 145</strong>' : (infoPs[0].dataset.i18nOrigHTML || infoPs[0].innerHTML); }
    if (infoPs[1]) { saveOrigHTML(infoPs[1]); infoPs[1].innerHTML = toEn ? '<a href="https://wa.me/420775344145" class="btn btn-whatsapp" target="_blank" rel="noopener noreferrer"><i class="fab fa-whatsapp"></i> WhatsApp</a>' : (infoPs[1].dataset.i18nOrigHTML || infoPs[1].innerHTML); }
    if (infoPs[2]) { saveOrigHTML(infoPs[2]); infoPs[2].innerHTML = toEn ? '<i class="fas fa-envelope"></i> Email: <a href="mailto:team@lesktop.cz"><strong>team@lesktop.cz</strong></a>' : (infoPs[2].dataset.i18nOrigHTML || infoPs[2].innerHTML); }
    if (infoPs[3]) { saveOrigHTML(infoPs[3]); infoPs[3].innerHTML = toEn ? '<i class="fas fa-map-marker-alt"></i> We operate in Prague and Central Bohemia' : (infoPs[3].dataset.i18nOrigHTML || infoPs[3].innerHTML); }

    // Extra services labels by id
    const setLabel = (id, enText) => {
      const lab = document.querySelector(`label[for="${id}"]`);
      if (!lab) return;
      saveOriginal(lab);
      lab.textContent = toEn ? enText : (lab.dataset.i18nOrig || lab.textContent);
    };
    const extraMap = [
      ['windowsCleaningGeneral', 'Window cleaning (general)'],
      ['windowsCleaningStandard', 'Window cleaning'],
      ['balconyWindows', 'Balcony and terrace windows'],
      ['blindsCleaning', 'Blind cleaning'],
      ['carpetCleaning', 'Carpet shampooing'],
      ['sofaCleaning', 'Sofa shampooing'],
      ['mattressCleaning', 'Mattress shampooing'],
      ['ovenCleaning', 'Oven cleaning'],
      ['fridgeCleaning', 'Fridge cleaning'],
      ['freezerCleaning', 'Freezer cleaning'],
      ['microwaveCleaning', 'Microwave cleaning'],
      ['hoodCleaning', 'Extractor hood cleaning'],
      ['applianceInteriorCleaning', 'Inside of appliances (dishwasher, washing machine)'],
      ['kitchenCabinetCleaning', 'Inside kitchen cabinet cleaning'],
      ['closetCleaning', 'Closet interior cleaning'],
      ['balconyTerraceCleaning', 'Balcony or terrace cleaning'],
      ['radiatorCleaning', 'Radiator cleaning'],
      ['doorFrameCleaning', 'Door and frame cleaning'],
      ['lightFixtureCleaning', 'Light fixtures and chandelier cleaning'],
      ['extraBathroomToilet', 'Additional bathroom/toilet'],
      ['ironingService', 'Ironing'],
      ['disinfection', 'Disinfection (bathrooms, WC, kitchen)'],
      ['keyHandling', 'Key handover/pickup'],
      ['cellarAtticCleaning', 'Cellar and attic cleaning'],
      ['moveInMoveOutCleaning', 'Move-in/out deep cleaning'],
    ];
    extraMap.forEach(([id, en]) => setLabel(id, en));

// Select options: cleaning type
    const typeSelect = document.getElementById('cleaningType');
    if (typeSelect) {
      const enByIndex = [
        'Choose cleaning type',
        'Regular home cleaning',
        'One-off home cleaning',
        'Post-renovation/move cleaning',
        'Commercial spaces (offices, shops)',
        'Window cleaning (standalone)'
      ];
      Array.from(typeSelect.options).forEach((opt, idx) => {
        if (!opt.dataset.i18nOrig) opt.dataset.i18nOrig = opt.textContent;
        opt.textContent = toEn ? (enByIndex[idx] || opt.dataset.i18nOrig) : opt.dataset.i18nOrig;
      });
    }
    // Select options: frequency
    const freqSelect = document.getElementById('cleaningFrequency');
    if (freqSelect) {
      const enByIndex = ['Weekly', 'Every 2 weeks', 'Monthly', 'Other (see notes)'];
      Array.from(freqSelect.options).forEach((opt, idx) => {
        if (!opt.dataset.i18nOrig) opt.dataset.i18nOrig = opt.textContent;
        opt.textContent = toEn ? (enByIndex[idx] || opt.dataset.i18nOrig) : opt.dataset.i18nOrig;
      });
    }
    localStorage.setItem('lang', lang);
  };

  // Bind UI
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });

  // Init
  try {
    const saved = localStorage.getItem('lang');
    const initial = saved || 'cs';
    setLang(initial);
  } catch (e) {
    // Fail-safe: stick to CS if anything goes wrong
    setLang('cs');
  }
});



