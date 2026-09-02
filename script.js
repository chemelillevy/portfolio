/* ==========================================================================
   Levy Chemelil — Portfolio
   Theme, navigation, scroll state, reveal animations, contact form
   ========================================================================== */

(function () {
    'use strict';

    const EMAIL = 'levichelal87@gmail.com';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ------------------------------------------------------------- Theme -- */
    const themeToggle = document.getElementById('theme-toggle');

    function applyTheme(theme) {
        // The sun/moon SVGs are swapped by CSS off this attribute.
        document.documentElement.setAttribute('data-theme', theme);
        themeToggle.setAttribute(
            'aria-label',
            theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
        );
    }

    let stored = null;
    try {
        stored = localStorage.getItem('theme');
    } catch (e) { /* storage unavailable — fall back to system preference */ }

    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(stored || (systemDark ? 'dark' : 'light'));

    themeToggle.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        try {
            localStorage.setItem('theme', next);
        } catch (e) { /* ignore */ }
    });

    /* -------------------------------------------------------- Mobile nav -- */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    function closeMenu() {
        hamburger.classList.remove('is-open');
        navMenu.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open menu');
    }

    hamburger.addEventListener('click', () => {
        const open = navMenu.classList.toggle('is-open');
        hamburger.classList.toggle('is-open', open);
        hamburger.setAttribute('aria-expanded', String(open));
        hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    navMenu.addEventListener('click', (e) => {
        if (e.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', (e) => {
        if (!navMenu.classList.contains('is-open')) return;
        if (e.target.closest('#nav-menu, #hamburger')) return;
        closeMenu();
    });

    /* ------------------------------------------- Header state + nav spy -- */
    const header = document.getElementById('header');
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    const sections = navLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    let ticking = false;

    function onScroll() {
        header.classList.toggle('is-scrolled', window.scrollY > 8);

        // Highlight the section currently under the header.
        const probe = window.scrollY + header.offsetHeight + 80;
        let active = null;

        for (const section of sections) {
            if (section.offsetTop <= probe) active = section.id;
        }

        // At the very bottom, the last section wins even if it's short.
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2 && sections.length) {
            active = sections[sections.length - 1].id;
        }

        navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + active);
        });

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(onScroll);
    }, { passive: true });

    onScroll();

    /* ---------------------------------------------------------- Reveals -- */
    const revealItems = document.querySelectorAll('.reveal');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        revealItems.forEach((el) => el.classList.add('is-visible'));
    } else {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealItems.forEach((el) => observer.observe(el));
    }

    /* ----------------------------------------------------- Contact form -- */
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');

    function setStatus(message, kind) {
        status.textContent = message;
        status.className = 'form-status is-visible is-' + kind;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const data = new FormData(form);
        const name = (data.get('name') || '').toString().trim();
        const email = (data.get('email') || '').toString().trim();
        const subject = (data.get('subject') || '').toString().trim();
        const message = (data.get('message') || '').toString().trim();

        const fields = { name, email, subject, message };
        let firstInvalid = null;

        Object.keys(fields).forEach((key) => {
            const input = form.elements[key];
            const invalid = !fields[key];
            input.setAttribute('aria-invalid', String(invalid));
            if (invalid && !firstInvalid) firstInvalid = input;
        });

        if (firstInvalid) {
            setStatus('Please fill in every field before sending.', 'error');
            firstInvalid.focus();
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            form.elements.email.setAttribute('aria-invalid', 'true');
            setStatus('That email address does not look right.', 'error');
            form.elements.email.focus();
            return;
        }

        const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
        window.location.href =
            `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        setStatus('Opening your email client — thanks for reaching out.', 'success');
        form.reset();
        Object.keys(fields).forEach((key) => form.elements[key].removeAttribute('aria-invalid'));

        setTimeout(() => { status.className = 'form-status'; }, 6000);
    });

    /* ------------------------------------------------------------ Misc -- */
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    console.log(
        '%cLevy Chemelil%c — Project Manager & Full-Stack Developer\n' + EMAIL,
        'font-size:15px;font-weight:700;color:#4f46e5',
        'font-size:12px;color:#64748b'
    );
})();
