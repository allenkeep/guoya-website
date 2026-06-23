document.addEventListener('DOMContentLoaded', function() {
    // ===== Hero typewriter effect =====
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const fullText = heroTitle.textContent.trim();
        const chars = Array.from(fullText);
        const textSpan = document.createElement('span');
        textSpan.className = 'type-text';
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        cursor.setAttribute('aria-hidden', 'true');
        heroTitle.innerHTML = '';
        heroTitle.appendChild(textSpan);
        heroTitle.appendChild(cursor);

        let index = 0;
        const typeChar = () => {
            if (index < chars.length) {
                textSpan.textContent += chars[index];
                index++;
                setTimeout(typeChar, 130);
            } else {
                cursor.style.opacity = '0';
                setTimeout(() => cursor.remove(), 300);
            }
        };
        setTimeout(typeChar, 400);
    }

    // ===== Scroll reveal =====
    const revealElements = document.querySelectorAll('.reveal');
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // ===== Number counter animation =====
    const animateCount = (el) => {
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1600;
        const startTime = performance.now();
        const startValue = 0;

        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutQuart(progress);
            const current = Math.floor(startValue + (target - startValue) * eased);
            el.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    };

    const statNumbers = document.querySelectorAll('.stat-num[data-count]');
    const countObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => countObserver.observe(el));

    // ===== Navbar scroll effect =====
    const nav = document.querySelector('.nav');
    const scrollThreshold = 80;

    const handleScroll = () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > scrollThreshold) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ===== Filter button active state (if exists) =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
});