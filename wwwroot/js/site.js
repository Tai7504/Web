(function () {
    /* ===== Mobile Menu Toggle ===== */
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (btn && menu) {
        const closeMenu = () => {
            menu.classList.add('hidden');
            btn.setAttribute('aria-expanded', 'false');
            const icon = btn.querySelector('.material-symbols-outlined');
            if (icon) icon.textContent = 'menu';
        };
        btn.addEventListener('click', function () {
            const willOpen = menu.classList.contains('hidden');
            menu.classList.toggle('hidden', !willOpen);
            btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
            const icon = btn.querySelector('.material-symbols-outlined');
            if (icon) icon.textContent = willOpen ? 'close' : 'menu';
        });
        menu.querySelectorAll('a, button').forEach((el) => el.addEventListener('click', closeMenu));
        window.addEventListener('resize', function () { if (window.innerWidth >= 768) closeMenu(); });
    }

    /* ===== Scroll Animation (Intersection Observer) ===== */
    const animatedElements = document.querySelectorAll('.fade-up, .fade-left, .fade-right, .scale-in');
    const animObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                animObserver.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px 0px -80px 0px', threshold: 0.1 });

    animatedElements.forEach(function (el) { animObserver.observe(el); });

    /* ===== Messenger Button Handler ===== */
    const messengerBtn = document.getElementById('messengerBtn');
    if (messengerBtn) {
        messengerBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const messengerLink = this.getAttribute('data-messenger-link');
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

            let finalUrl = messengerLink;
            if (!isMobile) {
                // Desktop: convert m.me to facebook.com/messages/t/
                finalUrl = messengerLink.replace(
                    'https://m.me/',
                    'https://www.facebook.com/messages/t/'
                );
            }
            // Redirect to the appropriate URL
            window.location.href = finalUrl;
        });
    }

    /* ===== Active Nav Link on Scroll ===== */
    const sectionIds = ['courses-section', 'teachers-section', 'about', 'why-us', 'news-section'];
    const desktopLinks = document.querySelectorAll('#desktop-nav .nav-link');
    const mobileLinks = document.querySelectorAll('#mobile-menu .nav-link-mobile');

    function setActive(sectionId) {
        desktopLinks.forEach(function (link) {
            link.classList.toggle('active', link.dataset.section === sectionId);
        });
        mobileLinks.forEach(function (link) {
            link.classList.toggle('active', link.dataset.section === sectionId);
        });
    }

    const navObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) setActive(entry.target.id);
        });
    }, { root: null, rootMargin: '-30% 0px -60% 0px', threshold: 0 });

    sectionIds.forEach(function (id) {
        const el = document.getElementById(id);
        if (el) navObserver.observe(el);
    });

    desktopLinks.forEach(function (link) {
        link.addEventListener('click', function () { if (this.dataset.section) setActive(this.dataset.section); });
    });
    mobileLinks.forEach(function (link) {
        link.addEventListener('click', function () { if (this.dataset.section) setActive(this.dataset.section); });
    });

    /* ===== Counter Animation ===== */
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = el.getAttribute('data-count');
                const suffix = el.getAttribute('data-suffix') || '';
                const numTarget = parseInt(target);
                let current = 0;
                const step = Math.ceil(numTarget / 60);
                const timer = setInterval(function () {
                    current += step;
                    if (current >= numTarget) {
                        current = numTarget;
                        clearInterval(timer);
                    }
                    el.textContent = current.toLocaleString() + suffix;
                }, 25);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { counterObserver.observe(el); });

    /* ===== Auto-hide toast ===== */
    setTimeout(function () {
        document.querySelectorAll('.toast-message').forEach(function (el) { el.remove(); });
    }, 4000);

    /* ===== Navbar: Giữ chiều cao cố định, không shrink ===== */
    // (Bỏ navbar shrink để tránh layout shift/flickering khi scroll)

    /* ===== Hero Parallax — Zoom nhẹ slide đang hiện (Đã tắt) ===== */
    /*
    (function initHeroParallax() {
        var slides = document.querySelectorAll('.hero-carousel-slide img');
        if (!slides.length) return;
        // Kích hoạt slide đầu tiên
        slides[0].classList.add('parallax-active');
        // Theo dõi khi carousel chuyển slide
        var track = document.querySelector('.hero-carousel-track');
        if (track) {
            var mo = new MutationObserver(function () {
                slides.forEach(function (img) { img.classList.remove('parallax-active'); });
                // Tính slide hiện tại từ transform
                var tf = track.style.transform || '';
                var m = tf.match(/translateX\(-(\d+)%\)/);
                var idx = m ? Math.round(parseInt(m[1]) / 100) : 0;
                if (slides[idx]) slides[idx].classList.add('parallax-active');
            });
            mo.observe(track, { attributes: true, attributeFilter: ['style'] });
        }
    })();
    */

    /* ===== Image Reveal on Scroll ===== */
    var imgReveals = document.querySelectorAll('.img-reveal');
    if (imgReveals.length) {
        var revealObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        imgReveals.forEach(function (el) { revealObs.observe(el); });
    }
})();

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.btn-outer').forEach(function (wrapper) {
        // Ensure wrapper has position: relative for absolute positioning
        wrapper.style.position = 'relative';

        let canvas = wrapper.querySelector('canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.pointerEvents = 'none';
            wrapper.appendChild(canvas);
        }
        initBeamButton(
            canvas,
            wrapper,
            'rgba(14,165,233,A)',   // màu tia (sky blue)
            'rgba(14,165,233,0.2)', // màu viền mờ
            9999                    // border-radius pill
        );
    });
});

/**
 * Initialize a canvas animation on a button wrapper.
 * @param {HTMLCanvasElement|string} canvasElement - <canvas> element or canvas element id
 * @param {HTMLElement|string} wrapperElement - wrapper <div> element or wrapper element id
 * @param {string} beamColor - rgba color with 'A' placeholder for alpha
 * @param {string} borderColor - dim border color (rgba)
 * @param {number} radius - border-radius in px
 * @param {number} speed - animation speed (default 0.00022)
 * @param {number} tailLen - beam tail length (default 90)
 * @param {number} glowSize - glow stroke width in px (default 10)
 */
function initBeamButton(canvasElement, wrapperElement, beamColor, borderColor, radius, speed = 0.00022, tailLen = 90, glowSize = 10) {
    // Support both DOM elements and ID strings
    const wrapper = typeof wrapperElement === 'string' ? document.getElementById(wrapperElement) : wrapperElement;
    if (!wrapper) return;
    const canvas = typeof canvasElement === 'string' ? document.getElementById(canvasElement) : canvasElement;
    if (!canvas) return;

    function resize() {
        canvas.width = wrapper.offsetWidth;
        canvas.height = wrapper.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Two beams offset by 180° (0.5)
    let p1 = 0;
    let p2 = 0.5;

    function loop() {
        const w = canvas.width, h = canvas.height;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, w, h);

        // Dim border
        ctx.beginPath();
        ctx.roundRect(1, 1, w - 2, h - 2, radius);
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 1;
        ctx.stroke();

        const pts = makePath(w - 2, h - 2, radius);
        drawBeam(ctx, pts, p1, beamColor, tailLen, glowSize);
        drawBeam(ctx, pts, p2, beamColor, tailLen, glowSize);

        p1 = (p1 + speed) % 1;
        p2 = (p2 + speed) % 1;

        requestAnimationFrame(loop);
    }

    loop();
}

// Auto-initialize all dual beam buttons when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    const wrapper = document.getElementById('btn-course-cta');
    if (!wrapper) {
        console.warn('Dual Beam Button: wrapper element not found');
        return;
    }

    // Ensure wrapper has proper dimensions
    const rect = wrapper.getBoundingClientRect();
    console.log('Dual Beam Button: wrapper dimensions', { width: rect.width, height: rect.height });

    // Small delay to ensure layout is complete
    setTimeout(function () {
        initBeamButton('canvas-course-cta', 'btn-course-cta', 'rgba(14, 165, 233, A)', 'rgba(14, 165, 233, 0.2)', 9999, 0.00022, 90, 10);
    }, 100);
});

/* ================================================================
   WHY CHOOSE US — Carousel JS
   ================================================================ */
(function () {
    var wcuIdx = 0;
    var wcuTimer = null;

    function getSlides() { return document.querySelectorAll('.wcu-slide'); }
    function getDots() { return document.querySelectorAll('.wcu-dot'); }

    function wcuShow(idx) {
        var slides = getSlides();
        var dots = getDots();
        if (slides.length === 0) return;
        wcuIdx = (idx + slides.length) % slides.length;
        slides.forEach(function (s, i) {
            s.style.opacity = i === wcuIdx ? '1' : '0';
            s.classList.toggle('active', i === wcuIdx);
        });
        dots.forEach(function (d, i) {
            d.classList.toggle('active', i === wcuIdx);
        });
    }

    window.wcuSlide = function (dir) {
        wcuShow(wcuIdx + dir);
        resetTimer();
    };

    window.wcuGoto = function (idx) {
        wcuShow(idx);
        resetTimer();
    };

    function resetTimer() {
        clearInterval(wcuTimer);
        wcuTimer = setInterval(function () { wcuShow(wcuIdx + 1); }, 4000);
    }

    document.addEventListener('DOMContentLoaded', function () {
        if (getSlides().length > 1) {
            resetTimer();
        }
    });
})();

/* ===== QUY TRÌNH SECTION - Pulse animation on badge ===== */
(function () {
    const badges = document.querySelectorAll('.qt-step-badge');
    if (!badges.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.5 });

    badges.forEach(b => {
        b.style.position = 'relative'; // ensure ::after works
        observer.observe(b);
    });
})();