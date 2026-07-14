document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("bannerTrack");
    const originalSlides = Array.from(
        track.querySelectorAll(".banner-slide")
    );

    if (!track || originalSlides.length === 0) {
        return;
    }

    /*
     * Nhân bản ảnh đầu và cuối để slider chạy vòng lặp.
     */
    const firstClone = originalSlides[0].cloneNode(true);
    const lastClone =
        originalSlides[originalSlides.length - 1].cloneNode(true);

    track.appendChild(firstClone);
    track.insertBefore(lastClone, originalSlides[0]);

    let slides = Array.from(
        track.querySelectorAll(".banner-slide")
    );

    let currentIndex = 1;
    let isAnimating = false;
    let autoSlideTimer = null;

    let touchStartX = 0;
    let touchCurrentX = 0;
    let isDragging = false;

    const slideGap = 12;


    function getSlideWidth() {
        if (!slides[currentIndex]) {
            return 0;
        }

        return (
            slides[currentIndex].getBoundingClientRect().width +
            slideGap
        );
    }


    function getCenterOffset(index) {
        const viewportWidth = window.innerWidth;
        const slideWidth =
            slides[index].getBoundingClientRect().width;

        const slidePosition = index * getSlideWidth();

        return (
            viewportWidth / 2 -
            slidePosition -
            slideWidth / 2
        );
    }


    function updateActiveSlide() {
        slides.forEach((slide, index) => {
            slide.classList.toggle(
                "is-active",
                index === currentIndex
            );
        });
    }


    function updateSlider(animate = true) {
        track.style.transition = animate
            ? "transform 0.55s cubic-bezier(0.22, 0.78, 0.25, 1)"
            : "none";

        const offset = getCenterOffset(currentIndex);

        track.style.transform =
            `translate3d(${offset}px, 0, 0)`;

        updateActiveSlide();
    }


    function goToNextSlide() {
        if (isAnimating) {
            return;
        }

        isAnimating = true;
        currentIndex += 1;

        updateSlider(true);
    }


    function goToPreviousSlide() {
        if (isAnimating) {
            return;
        }

        isAnimating = true;
        currentIndex -= 1;

        updateSlider(true);
    }


    function startAutoSlide() {
        stopAutoSlide();

        autoSlideTimer = window.setInterval(() => {
            goToNextSlide();
        }, 4000);
    }


    function stopAutoSlide() {
        if (autoSlideTimer) {
            window.clearInterval(autoSlideTimer);
            autoSlideTimer = null;
        }
    }


    track.addEventListener("transitionend", () => {
        /*
         * Đang đứng tại ảnh clone cuối:
         * nhảy về ảnh thật đầu tiên.
         */
        if (currentIndex === slides.length - 1) {
            currentIndex = 1;
            updateSlider(false);
        }

        /*
         * Đang đứng tại ảnh clone đầu:
         * nhảy về ảnh thật cuối cùng.
         */
        if (currentIndex === 0) {
            currentIndex = slides.length - 2;
            updateSlider(false);
        }

        isAnimating = false;
    });


    track.addEventListener(
        "touchstart",
        (event) => {
            touchStartX = event.touches[0].clientX;
            touchCurrentX = touchStartX;

            isDragging = true;
            isAnimating = false;

            stopAutoSlide();

            track.style.transition = "none";
        },
        {
            passive: true
        }
    );


    track.addEventListener(
        "touchmove",
        (event) => {
            if (!isDragging) {
                return;
            }

            touchCurrentX = event.touches[0].clientX;

            const dragDistance =
                touchCurrentX - touchStartX;

            const normalOffset =
                getCenterOffset(currentIndex);

            track.style.transform =
                `translate3d(${normalOffset + dragDistance}px, 0, 0)`;
        },
        {
            passive: true
        }
    );


    track.addEventListener("touchend", () => {
        if (!isDragging) {
            return;
        }

        isDragging = false;

        const dragDistance =
            touchCurrentX - touchStartX;

        const swipeThreshold = 45;

        if (dragDistance < -swipeThreshold) {
            goToNextSlide();
        } else if (dragDistance > swipeThreshold) {
            goToPreviousSlide();
        } else {
            updateSlider(true);
        }

        startAutoSlide();
    });


    /*
     * Hỗ trợ kéo bằng chuột trên máy tính.
     */
    track.addEventListener("mousedown", (event) => {
        touchStartX = event.clientX;
        touchCurrentX = touchStartX;

        isDragging = true;
        isAnimating = false;

        stopAutoSlide();

        track.style.transition = "none";

        event.preventDefault();
    });


    window.addEventListener("mousemove", (event) => {
        if (!isDragging) {
            return;
        }

        touchCurrentX = event.clientX;

        const dragDistance =
            touchCurrentX - touchStartX;

        const normalOffset =
            getCenterOffset(currentIndex);

        track.style.transform =
            `translate3d(${normalOffset + dragDistance}px, 0, 0)`;
    });


    window.addEventListener("mouseup", () => {
        if (!isDragging) {
            return;
        }

        isDragging = false;

        const dragDistance =
            touchCurrentX - touchStartX;

        if (dragDistance < -45) {
            goToNextSlide();
        } else if (dragDistance > 45) {
            goToPreviousSlide();
        } else {
            updateSlider(true);
        }

        startAutoSlide();
    });


    window.addEventListener("resize", () => {
        updateSlider(false);
    });


    /*
     * Chức năng nút.
     */
  

    document
        .getElementById("qrButton")
        ?.addEventListener("click", () => {
            window.location.href = "./qr.html";
        });


    document
        .getElementById("openAccountButton")
        ?.addEventListener("click", () => {
            window.location.href = "./open-account.html";
        });


    /*
     * Khởi tạo.
     */
    requestAnimationFrame(() => {
        updateSlider(false);
        startAutoSlide();
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("loginButton");
    const loginOverlay = document.getElementById("loginOverlay");
    const loginSheet = document.getElementById("loginSheet");
    const closeLoginSheet = document.getElementById("closeLoginSheet");

    function openSheet() {
        if (!loginOverlay || !loginSheet) {
            console.error("Không tìm thấy loginOverlay hoặc loginSheet");
            return;
        }

        document.body.classList.add("login-sheet-open");
        loginOverlay.classList.add("is-visible");
        loginSheet.classList.add("is-open");
        loginSheet.setAttribute("aria-hidden", "false");
    }

    function closeSheet() {
        if (!loginOverlay || !loginSheet) {
            return;
        }

        loginOverlay.classList.remove("is-visible");
        loginSheet.classList.remove("is-open");
        loginSheet.setAttribute("aria-hidden", "true");
        document.body.classList.remove("login-sheet-open");
    }

    loginButton?.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        openSheet();
    });

    closeLoginSheet?.addEventListener("click", function (event) {
        event.preventDefault();
        closeSheet();
    });

    loginOverlay?.addEventListener("click", closeSheet);

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeSheet();
        }
    });
});
const passwordLoginOption =
    document.getElementById("passwordLoginOption");

passwordLoginOption?.addEventListener(
    "click",
    function () {
        window.location.href = "./password.html";
    }
);