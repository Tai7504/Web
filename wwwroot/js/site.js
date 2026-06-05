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

/* ===== VOUCHER SECTION LOGIC ===== */
function copyVoucherCode(code, button) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(code).then(() => {
            showVoucherSuccessState(button);
        }).catch(err => {
            console.error('Lỗi khi sao chép mã (navigator.clipboard):', err);
            fallbackCopyText(code, button);
        });
    } else {
        fallbackCopyText(code, button);
    }
}

function fallbackCopyText(code, button) {
    let textArea = document.createElement("textarea");
    textArea.value = code;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showVoucherSuccessState(button);
        } else {
            console.error('Lỗi khi sao chép mã qua execCommand');
        }
    } catch (err) {
        console.error('Lỗi khi sao chép mã', err);
    }
    textArea.remove();
}

function showVoucherSuccessState(button) {
    // Hiển thị Toast
    const toast = document.getElementById('toast-voucher');
    if (toast) {
        toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-2');
        toast.classList.add('opacity-100', 'translate-y-0');
    }

    // Thay đổi tạm thời text trên nút để tạo hiệu ứng tương tác cao
    const textSpan = button.querySelector('.btn-text');
    const iconSpan = button.querySelector('.material-symbols-outlined');
    if (textSpan && iconSpan) {
        const originalText = textSpan.innerText;
        const originalIcon = iconSpan.innerText;

        textSpan.innerText = 'Đã chép';
        iconSpan.innerText = 'check';

        button.classList.remove('bg-voucher-btn-red', 'hover:bg-red-700');
        button.classList.add('bg-green-600', 'hover:bg-green-700');

        setTimeout(() => {
            if (toast) {
                toast.classList.remove('opacity-100', 'translate-y-0');
                toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-2');
            }
        }, 2000);

        setTimeout(() => {
            textSpan.innerText = originalText;
            iconSpan.innerText = originalIcon;
            button.classList.remove('bg-green-600', 'hover:bg-green-700');
            button.classList.add('bg-voucher-btn-red', 'hover:bg-red-700');
        }, 2000);
    }
}

// Logic hiển thị và đóng modal điều kiện
function showVoucherTerms(code, terms) {
    const modal = document.getElementById("voucher-terms-modal");
    const box = document.getElementById("voucher-modal-content-box");
    if (modal && box) {
        document.getElementById("terms-modal-code").innerText = code;
        document.getElementById("terms-modal-content").innerText = terms;

        modal.classList.remove("hidden");
        modal.classList.add("flex");
        setTimeout(() => {
            box.classList.remove("scale-95");
            box.classList.add("scale-100");
        }, 10);
    }
}

// Logic đóng modal điều kiện
function closeVoucherTerms() {
    const modal = document.getElementById("voucher-terms-modal");
    const box = document.getElementById("voucher-modal-content-box");
    if (modal && box) {
        box.classList.remove("scale-100");
        box.classList.add("scale-95");
        setTimeout(() => {
            modal.classList.add("hidden");
            modal.classList.remove("flex");
        }, 150);
    }
}

// Khởi tạo Infinite Carousel cho voucher (Trượt một chiều vô hạn thực sự)
// Khởi tạo Infinite Carousel cho voucher (Trượt một chiều vô hạn thực sự, lấp ló 2 đầu)
document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.getElementById("voucher-carousel");
    const dotsContainer = document.getElementById("voucher-dots");
    if (!carousel || !dotsContainer) return;

    let items = Array.from(carousel.querySelectorAll(".voucher-slide"));
    const total = items.length;
    if (total === 0) return;

    let currentIndex = 0;
    let autoplayInterval;
    const autoplayDelay = 5000; // 5 giây 1 lần
    let isTransitioning = false;

    // Chiều rộng slide và gap
    const gap = 16; // gap-4 trong tailwind là 16px
    let slideWidth = items[0].offsetWidth;
    let moveAmount = slideWidth + gap;

    // Thiết lập ban đầu để hỗ trợ lấp ló bên trái:
    // Đưa phần tử cuối cùng lên đầu tiên của track
    const lastItem = items[total - 1];
    carousel.insertBefore(lastItem, items[0]);
    
    // Dịch chuyển track sang trái bằng đúng 1 slide + gap để slide 1 hiển thị chính ở giữa
    carousel.style.transition = "none";
    carousel.style.transform = `translateX(-${moveAmount}px)`;

    // Tạo các dots điều hướng dựa trên index gốc
    for (let i = 0; i < total; i++) {
        const dot = document.createElement("button");
        dot.className = "voucher-dot" + (i === 0 ? " active" : "");
        dot.setAttribute("aria-label", "Voucher " + (i + 1));
        dot.dataset.index = i;
        dot.addEventListener("click", function () {
            if (isTransitioning) return;
            goToVoucher(i);
        });
        dotsContainer.appendChild(dot);
    }

    const dots = dotsContainer.querySelectorAll(".voucher-dot");

    function setActiveDot(index) {
        dots.forEach((d) => {
            d.classList.toggle("active", parseInt(d.dataset.index) === index);
        });
    }

    // Hàm trượt sang slide tiếp theo (bên phải)
    function slideNext() {
        if (isTransitioning) return;
        isTransitioning = true;

        slideWidth = carousel.firstElementChild.offsetWidth;
        moveAmount = slideWidth + gap;

        // Bật transition và dịch chuyển track thêm sang trái (đến -moveAmount * 2)
        carousel.style.transition = "transform 0.5s ease-out";
        carousel.style.transform = `translateX(-${moveAmount * 2}px)`;

        // Sau khi hoàn thành hiệu ứng trượt
        setTimeout(function () {
            carousel.style.transition = "none";
            // Lấy phần tử đầu tiên hiện tại đưa xuống cuối cùng của track
            const firstCurrent = carousel.firstElementChild;
            carousel.appendChild(firstCurrent);
            // Reset transform về lại -moveAmount ngay lập tức
            carousel.style.transform = `translateX(-${moveAmount}px)`;
            
            // Cập nhật index hiện tại và dot active (slide ở vị trí index 1 là slide hiển thị chính)
            const activeSlide = carousel.children[1];
            if (activeSlide) {
                currentIndex = parseInt(activeSlide.dataset.index);
                setActiveDot(currentIndex);
            }

            isTransitioning = false;
        }, 500);
    }

    // Hàm trượt về slide trước đó (chỉ dùng cho vuốt ngược lại)
    function slidePrev() {
        if (isTransitioning) return;
        isTransitioning = true;

        slideWidth = carousel.firstElementChild.offsetWidth;
        moveAmount = slideWidth + gap;

        // Dịch chuyển track sang phải về 0
        carousel.style.transition = "transform 0.5s ease-out";
        carousel.style.transform = "translateX(0)";

        // Sau khi trượt xong
        setTimeout(function () {
            carousel.style.transition = "none";
            // Lấy phần tử cuối cùng hiện tại đưa lên đầu track
            const lastCurrent = carousel.lastElementChild;
            carousel.insertBefore(lastCurrent, carousel.firstElementChild);
            // Reset transform về -moveAmount
            carousel.style.transform = `translateX(-${moveAmount}px)`;
            
            const activeSlide = carousel.children[1];
            if (activeSlide) {
                currentIndex = parseInt(activeSlide.dataset.index);
                setActiveDot(currentIndex);
            }
            isTransitioning = false;
        }, 500);
    }

    // Hàm chuyển tới một voucher cụ thể khi click vào dot
    function goToVoucher(targetIndex) {
        if (currentIndex === targetIndex || isTransitioning) return;
        isTransitioning = true;
        
        slideWidth = carousel.firstElementChild.offsetWidth;
        moveAmount = slideWidth + gap;

        const currentItems = Array.from(carousel.children);
        const targetSlide = currentItems.find(item => parseInt(item.dataset.index) === targetIndex);
        if (!targetSlide) {
            isTransitioning = false;
            return;
        }
        
        const targetPos = currentItems.indexOf(targetSlide);

        // slide hiển thị chính đang ở vị trí index 1
        if (targetPos > 1) {
            // Cần dịch chuyển track sang trái thêm (targetPos - 1) slide
            const distance = moveAmount * (targetPos - 1);
            carousel.style.transition = "transform 0.5s ease-out";
            carousel.style.transform = `translateX(-${moveAmount + distance}px)`;

            setTimeout(function () {
                carousel.style.transition = "none";
                for (let i = 0; i < targetPos - 1; i++) {
                    carousel.appendChild(currentItems[i]);
                }
                carousel.style.transform = `translateX(-${moveAmount}px)`;
                
                currentIndex = targetIndex;
                setActiveDot(currentIndex);
                isTransitioning = false;
            }, 500);
        } else if (targetPos === 0) {
            // Slide đích là slide lấp ló bên trái (index 0), cần dịch chuyển sang phải về 0
            carousel.style.transition = "transform 0.5s ease-out";
            carousel.style.transform = "translateX(0)";

            setTimeout(function () {
                carousel.style.transition = "none";
                const lastCurrent = carousel.lastElementChild;
                carousel.insertBefore(lastCurrent, carousel.firstElementChild);
                carousel.style.transform = `translateX(-${moveAmount}px)`;
                
                currentIndex = targetIndex;
                setActiveDot(currentIndex);
                isTransitioning = false;
            }, 500);
        } else {
            isTransitioning = false;
        }
        resetAutoplay();
    }

    // Thiết lập Autoplay
    function startAutoplay() {
        clearInterval(autoplayInterval);
        autoplayInterval = setInterval(slideNext, autoplayDelay);
    }

    function resetAutoplay() {
        startAutoplay();
    }

    const wrapper = carousel.parentElement;

    // Mouse Drag support (Giữ và kéo chuột để chuyển slide trên PC)
    let isDragging = false;
    let startX = 0;
    let dragMoveAmount = 0;

    wrapper.addEventListener("mousedown", function (e) {
        if (isTransitioning) return;
        if (e.button !== 0) return; // Chỉ cho phép chuột trái
        
        isDragging = true;
        startX = e.clientX;
        clearInterval(autoplayInterval);
        
        carousel.style.transition = "none";
        wrapper.classList.add("dragging");
    });

    window.addEventListener("mousemove", function (e) {
        if (!isDragging) return;
        
        const currentX = e.clientX;
        dragMoveAmount = currentX - startX;
        
        // Dịch chuyển track theo tay kéo chuột
        const translateValue = -moveAmount + dragMoveAmount;
        carousel.style.transform = `translateX(${translateValue}px)`;
    });

    function endDrag() {
        if (!isDragging) return;
        isDragging = false;
        wrapper.classList.remove("dragging");

        carousel.style.transition = "transform 0.5s ease-out";

        if (Math.abs(dragMoveAmount) > 60) { // Ngưỡng 60px để chuyển slide
            if (dragMoveAmount < 0) {
                slideNext(); // Kéo sang trái -> trượt tới
            } else {
                slidePrev(); // Kéo sang phải -> trượt lùi
            }
        } else {
            // Trượt về vị trí cân bằng cũ
            carousel.style.transform = `translateX(-${moveAmount}px)`;
            if (total > (window.innerWidth < 640 ? 1 : 2)) {
                startAutoplay();
            }
        }
        dragMoveAmount = 0;
    }

    window.addEventListener("mouseup", endDrag);

    // Chỉ chạy autoplay nếu số lượng voucher lớn hơn số lượng hiển thị đồng thời
    const isMobile = window.innerWidth < 640;
    if (total > (isMobile ? 1 : 2)) {
        startAutoplay();
        
        // Tạm dừng khi di chuột vào
        wrapper.addEventListener("mouseenter", function () {
            clearInterval(autoplayInterval);
        });

        wrapper.addEventListener("mouseleave", function () {
            if (!isDragging) {
                startAutoplay();
            }
        });

        // Touch Drag support (Vuốt kéo theo tay thời gian thực trên Mobile)
        let touchStartX = 0;
        let touchMoveAmount = 0;
        let isTouching = false;

        wrapper.addEventListener("touchstart", function (e) {
            if (isTransitioning) return;
            isTouching = true;
            clearInterval(autoplayInterval);
            touchStartX = e.touches[0].clientX;
            carousel.style.transition = "none";
        }, { passive: true });

        wrapper.addEventListener("touchmove", function (e) {
            if (!isTouching) return;
            const currentX = e.touches[0].clientX;
            touchMoveAmount = currentX - touchStartX;
            
            // Dịch chuyển track theo tay vuốt
            const translateValue = -moveAmount + touchMoveAmount;
            carousel.style.transform = `translateX(${translateValue}px)`;
        }, { passive: true });

        wrapper.addEventListener("touchend", function (e) {
            if (!isTouching) return;
            isTouching = false;
            
            carousel.style.transition = "transform 0.5s ease-out";
            
            if (Math.abs(touchMoveAmount) > 60) {
                if (touchMoveAmount < 0) {
                    slideNext();
                } else {
                    slidePrev();
                }
            } else {
                carousel.style.transform = `translateX(-${moveAmount}px)`;
                startAutoplay();
            }
            touchMoveAmount = 0;
        }, { passive: true });
    }

    // Cập nhật khi resize
    window.addEventListener("resize", function () {
        slideWidth = carousel.firstElementChild.offsetWidth;
        moveAmount = slideWidth + gap;
        carousel.style.transition = "none";
        carousel.style.transform = `translateX(-${moveAmount}px)`;
    });
});
