/* ==========================================================================
   Levy Chemelil — Portfolio
   Theme, navigation, scroll state, motion system, contact form
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

    /* ========================================================== Motion ==
       Entrance reveals, scroll-linked storytelling and cursor feedback.

       Everything tied to scroll is drawn from a single requestAnimationFrame
       pass, shared with the header/nav-spy handler below so the page never
       runs two competing loops. The magnetic buttons get a second loop that
       halts itself the moment they settle. Both write only transform and
       opacity, and neither starts at all under prefers-reduced-motion.
       ==================================================================== */

    const motionOK = !prefersReducedMotion;

    // The gate for every CSS rule that starts an element hidden. Setting it
    // from script, rather than in the stylesheet, means a visitor with
    // JavaScript disabled still sees the whole page.
    if (motionOK) document.documentElement.classList.add('motion-on');

    const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

    /* -------------------------------------------------------- Reveals -- */

    // A stagger container hands the reveal treatment to its own children, so
    // the markup only has to declare the step in data-stagger.
    document.querySelectorAll('[data-stagger]').forEach((box) => {
        Array.prototype.forEach.call(box.children, (child) => child.classList.add('reveal'));
    });

    const revealItems = Array.from(document.querySelectorAll('.reveal, .clip-reveal'));

    // A clip-path'd element measures as zero-area while it is still masked, so
    // it can never trip an observer watching itself. Its parent heading is not
    // clipped, so that is what gets watched; the group it stands for is
    // revealed when it crosses.
    const groups = new Map();

    revealItems.forEach((el) => {
        const watch = (el.classList.contains('clip-reveal') && el.parentElement)
            ? el.parentElement
            : el;

        const group = groups.get(watch);
        if (group) group.push(el);
        else groups.set(watch, [el]);
    });

    if (!motionOK || !('IntersectionObserver' in window)) {
        revealItems.forEach((el) => el.classList.add('is-visible'));
    } else {
        const revealObserver = new IntersectionObserver((entries) => {
            // Items that cross in the same frame — a row of cards, the stats
            // strip — are put in document order and dealt an increasing delay.
            // That batching is what makes the eye travel across them, and it
            // also keeps off-screen siblings from burning their delay early.
            const arrived = [];

            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const group = groups.get(entry.target);
                if (group) arrived.push.apply(arrived, group);
                revealObserver.unobserve(entry.target);
            });

            if (!arrived.length) return;

            arrived.sort((a, b) =>
                (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1);

            const seen = new Map();

            arrived.forEach((el) => {
                const box = el.closest('[data-stagger]');
                const step = box ? parseFloat(box.dataset.stagger) || 0 : 0;
                const base = parseFloat(el.dataset.revealDelay) ||
                             (box ? parseFloat(box.dataset.staggerBase) || 0 : 0);

                let index = 0;
                if (step) {
                    index = seen.get(box) || 0;
                    seen.set(box, index + 1);
                }

                el.style.setProperty('--d', (base + index * step) + 'ms');
                el.classList.add('is-visible');
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

        groups.forEach((group, watch) => revealObserver.observe(watch));
    }

    /* --------------------------------------------- Scroll-linked effects -- */
    // Assigned below when there is anything to draw; onScroll calls it either
    // way, so it starts life as a no-op.
    let drawFX = function () {};

    if (motionOK) {
        const layers = Array.from(document.querySelectorAll('[data-parallax]')).map((el) => ({
            el,
            // Anchored to the section rather than the layer: once we start
            // transforming a layer its own rect moves, the section's does not.
            anchor: el.closest('section') || el.parentElement,
            speed: parseFloat(el.dataset.parallax) || 0,
            top: 0
        }));

        const scrubs = Array.from(document.querySelectorAll('[data-scrub]')).map((el) => ({
            el,
            fill: el.querySelector('.roles-rail i'),
            marks: Array.from(el.querySelectorAll('.role')),
            offsets: [],
            top: 0,
            h: 0
        }));

        const pins = Array.from(document.querySelectorAll('[data-pin]')).map((el) => ({
            el,
            words: Array.from(el.querySelectorAll('.fill-word')),
            sub: el.querySelector('.statement__sub'),
            meter: el.querySelector('.pin-meter i'),
            top: 0,
            h: 0
        }));

        if (layers.length || scrubs.length || pins.length) {
            // Every layout read the effects need happens here, so the draw pass
            // is pure writes and never forces a synchronous reflow mid-scroll.
            const measure = function () {
                const y = window.scrollY;

                layers.forEach((l) => {
                    l.top = l.anchor.getBoundingClientRect().top + y;
                });

                scrubs.concat(pins).forEach((item) => {
                    const r = item.el.getBoundingClientRect();
                    item.top = r.top + y;
                    item.h = r.height;
                });

                scrubs.forEach((sc) => {
                    sc.offsets = sc.marks.map((m) => m.offsetTop);
                });
            };

            drawFX = function () {
                const y = window.scrollY;
                const vh = window.innerHeight;

                /* Parallax. A positive speed moves the layer *with* the page,
                   so it covers less ground than the copy in front of it: 0.2
                   of the scroll distance reads as one fifth the speed. Only
                   the Y axis is touched, which is why nothing can overflow
                   sideways. */
                for (const l of layers) {
                    const shift = (y - l.top) * l.speed;
                    l.el.style.transform = 'translate3d(0,' + shift.toFixed(2) + 'px,0)';
                }

                /* Scrub. Progress runs 0 → 1 linearly across the container's
                   own pass through the viewport, and the rail's scaleY is that
                   number verbatim. */
                for (const sc of scrubs) {
                    const start = sc.top - vh * 0.72;
                    const end = sc.top + sc.h - vh * 0.45;
                    const prog = end > start ? clamp((y - start) / (end - start), 0, 1) : 0;

                    if (sc.fill) sc.fill.style.setProperty('--p', prog.toFixed(4));

                    // A marker lights when the fill's leading edge reaches it.
                    const reached = sc.h * prog;
                    for (let i = 0; i < sc.marks.length; i++) {
                        sc.marks[i].classList.toggle('is-passed', sc.offsets[i] + 26 <= reached);
                    }
                }

                /* Pin. The track is taller than the viewport; progress is how
                   far through that surplus we are, which is exactly how long
                   the sticky panel stays put. */
                for (const pin of pins) {
                    const span = pin.h - vh;
                    const prog = span > 0 ? clamp((y - pin.top) / span, 0, 1)
                                          : (y >= pin.top ? 1 : 0);

                    if (pin.meter) pin.meter.style.setProperty('--p', prog.toFixed(4));

                    // Words fill left to right in an overlapping cascade that
                    // finishes at 74%, leaving the tail of the pin for the
                    // closing line to arrive before the panel lets go.
                    const words = pin.words;
                    const count = words.length;
                    const ramp = count ? (0.74 / count) * 2.4 : 1;

                    for (let i = 0; i < count; i++) {
                        const from = (i / count) * 0.74;
                        words[i].style.setProperty(
                            '--fill', clamp((prog - from) / ramp, 0, 1).toFixed(3));
                    }

                    if (pin.sub) {
                        const late = clamp((prog - 0.74) / 0.18, 0, 1);
                        pin.sub.style.opacity = late.toFixed(3);
                        pin.sub.style.transform =
                            'translate3d(0,' + ((1 - late) * 16).toFixed(2) + 'px,0)';
                    }
                }
            };

            const remeasure = function () {
                measure();
                drawFX();
            };

            let resizeTimer = null;

            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(remeasure, 150);
            }, { passive: true });

            window.addEventListener('orientationchange', remeasure);
            window.addEventListener('load', remeasure);

            // Web fonts land after first paint and shift every offset below the
            // fold, so the anchors are taken again once they are ready.
            if (document.fonts && document.fonts.ready) {
                document.fonts.ready.then(remeasure).catch(() => {});
            }

            remeasure();
        }
    }

    /* -------------------------------------------------- Magnetic buttons -- */
    // Guarded on a fine, hovering pointer: a touch screen has no cursor to
    // track, and would leave the button stuck wherever the last tap landed.
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const magnets = Array.from(document.querySelectorAll('.magnetic'));

    if (motionOK && finePointer.matches && magnets.length) {
        const THRESHOLD = 40;    // px of slack around the button that still pulls
        const PULL = 0.3;        // share of the pointer's offset the button takes
        const STIFFNESS = 0.16;
        const DAMPING = 0.74;    // under 1, so releasing overshoots then settles

        const items = magnets.map((el) => ({ el, x: 0, y: 0, vx: 0, vy: 0, live: false }));

        let px = -99999;
        let py = -99999;
        let running = false;

        const springFrame = function () {
            let alive = false;

            // Read every rect, then write every transform. Interleaving the two
            // would force one reflow per button, every frame.
            const rects = items.map((m) => m.el.getBoundingClientRect());

            for (let i = 0; i < items.length; i++) {
                const m = items[i];
                const r = rects[i];

                const dx = px - (r.left + r.width / 2);
                const dy = py - (r.top + r.height / 2);

                const near = Math.abs(dx) <= r.width / 2 + THRESHOLD &&
                             Math.abs(dy) <= r.height / 2 + THRESHOLD;

                // Cap the travel against the button's own height, so a wide
                // block button does not slide further than a compact one.
                const cap = Math.min(14, r.height * 0.45);
                const tx = near ? clamp(dx * PULL, -cap, cap) : 0;
                const ty = near ? clamp(dy * PULL, -cap, cap) : 0;

                m.vx = (m.vx + (tx - m.x) * STIFFNESS) * DAMPING;
                m.vy = (m.vy + (ty - m.y) * STIFFNESS) * DAMPING;
                m.x += m.vx;
                m.y += m.vy;

                // Retire the transform transition the moment this magnet first
                // comes alive, so the entrance lift cannot swallow the spring.
                if (near && !m.live) {
                    m.live = true;
                    m.el.classList.add('magnet-live');
                }

                m.el.classList.toggle('is-pulled', near);

                const settled = !near &&
                    Math.abs(m.x) < 0.04 && Math.abs(m.y) < 0.04 &&
                    Math.abs(m.vx) < 0.04 && Math.abs(m.vy) < 0.04;

                if (settled) {
                    m.x = m.y = m.vx = m.vy = 0;
                    m.el.style.transform = '';
                } else {
                    alive = true;
                    m.el.style.transform =
                        'translate3d(' + m.x.toFixed(2) + 'px,' + m.y.toFixed(2) + 'px,0)';
                }
            }

            running = alive;
            if (alive) requestAnimationFrame(springFrame);
        };

        const wake = function () {
            if (running) return;
            running = true;
            requestAnimationFrame(springFrame);
        };

        window.addEventListener('pointermove', (e) => {
            if (e.pointerType && e.pointerType !== 'mouse') return;
            px = e.clientX;
            py = e.clientY;
            wake();
        }, { passive: true });

        // Anything that takes the pointer away lets the buttons spring home.
        const release = function () {
            px = -99999;
            py = -99999;
            wake();
        };

        document.addEventListener('pointerleave', release);
        window.addEventListener('blur', release);

        // Scrolling moves the buttons under a stationary cursor, so the spring
        // has to keep solving while the page travels.
        window.addEventListener('scroll', () => {
            if (px > -99999) wake();
        }, { passive: true });
    }

    /* ------------------------------------------- Header state + nav spy -- */
    const header = document.getElementById('header');
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    const sections = navLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    let ticking = false;

    function onScroll() {
        drawFX();

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
