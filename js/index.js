document.addEventListener("DOMContentLoaded", function () {
    const slider =
        document.querySelector(".banner-slider");

    const track =
        document.getElementById("bannerTrack");

    if (!slider || !track) {
        return;
    }

    const originalSlides = Array.from(
        track.querySelectorAll(".banner-slide")
    );

    if (originalSlides.length < 2) {
        return;
    }


    /* =====================================
       TẠO CLONE CHO SLIDER VÒNG LẶP
    ===================================== */

    const firstClone =
        originalSlides[0].cloneNode(true);

    const lastClone =
        originalSlides[
            originalSlides.length - 1
        ].cloneNode(true);

    firstClone.classList.add("is-clone");
    lastClone.classList.add("is-clone");

    track.appendChild(firstClone);
    track.insertBefore(
        lastClone,
        originalSlides[0]
    );

    let slides = Array.from(
        track.querySelectorAll(".banner-slide")
    );

    /*
     * 0 là clone cuối.
     * 1 là ảnh thật đầu tiên.
     */
    let currentIndex = 1;
    let isAnimating = false;

    let startX = 0;
    let currentX = 0;
    let dragging = false;

    let autoTimer = null;


    /* =====================================
       GÁN CLASS VỊ TRÍ
    ===================================== */

    function updateSlideClasses() {
        slides.forEach(function (slide, index) {
            slide.classList.remove(
                "is-active",
                "is-prev",
                "is-next",
                "is-far"
            );

            if (index === currentIndex) {
                slide.classList.add("is-active");
            } else if (index === currentIndex - 1) {
                slide.classList.add("is-prev");
            } else if (index === currentIndex + 1) {
                slide.classList.add("is-next");
            } else {
                slide.classList.add("is-far");
            }
        });
    }


    /* =====================================
       TÍNH ĐÚNG TÂM ẢNH
    ===================================== */

    function getCenteredOffset(index) {
        const activeSlide = slides[index];

        if (!activeSlide) {
            return 0;
        }

        const sliderWidth =
            slider.getBoundingClientRect().width;

        /*
         * offsetLeft lấy vị trí thật chưa bị scale,
         * nên khi ảnh phóng/thu vẫn không lệch tâm.
         */
        const slideCenter =
            activeSlide.offsetLeft +
            activeSlide.offsetWidth / 2;

        return sliderWidth / 2 - slideCenter;
    }


    function renderSlider(animate = true) {
        track.style.transition = animate
            ? "transform 0.55s cubic-bezier(0.22, 0.78, 0.25, 1)"
            : "none";

        updateSlideClasses();

        const offset =
            getCenteredOffset(currentIndex);

        track.style.transform =
            `translate3d(${offset}px, 0, 0)`;
    }


    /* =====================================
       CHUYỂN ẢNH
    ===================================== */

    function nextSlide() {
        if (isAnimating) {
            return;
        }

        isAnimating = true;
        currentIndex += 1;

        renderSlider(true);
    }


    function previousSlide() {
        if (isAnimating) {
            return;
        }

        isAnimating = true;
        currentIndex -= 1;

        renderSlider(true);
    }


    /* =====================================
       XỬ LÝ CLONE
    ===================================== */

    track.addEventListener(
        "transitionend",
        function (event) {
            if (event.propertyName !== "transform") {
                return;
            }

            /*
             * Đang ở clone ảnh đầu phía cuối.
             */
            if (currentIndex === slides.length - 1) {
                currentIndex = 1;
                renderSlider(false);
            }

            /*
             * Đang ở clone ảnh cuối phía đầu.
             */
            if (currentIndex === 0) {
                currentIndex = slides.length - 2;
                renderSlider(false);
            }

            isAnimating = false;
        }
    );


    /* =====================================
       TỰ ĐỘNG CHUYỂN
    ===================================== */

    // function stopAutoSlide() {
    //     if (autoTimer) {
    //         clearInterval(autoTimer);
    //         autoTimer = null;
    //     }
    // }


    // function startAutoSlide() {
    //     stopAutoSlide();

    //     autoTimer = setInterval(function () {
    //         nextSlide();
    //     }, 4000);
    // }


    /* =====================================
       KÉO TRÊN ĐIỆN THOẠI
    ===================================== */

    slider.addEventListener(
        "touchstart",
        function (event) {
            if (isAnimating) {
                return;
            }

            dragging = true;

            startX =
                event.touches[0].clientX;

            currentX = startX;

            stopAutoSlide();

            track.classList.add("is-dragging");
        },
        {
            passive: true
        }
    );


    slider.addEventListener(
        "touchmove",
        function (event) {
            if (!dragging) {
                return;
            }

            currentX =
                event.touches[0].clientX;

            const distance =
                currentX - startX;

            const baseOffset =
                getCenteredOffset(currentIndex);

            track.style.transform =
                `translate3d(${baseOffset + distance}px, 0, 0)`;
        },
        {
            passive: true
        }
    );


    slider.addEventListener(
        "touchend",
        function () {
            if (!dragging) {
                return;
            }

            dragging = false;

            track.classList.remove("is-dragging");

            const distance =
                currentX - startX;

            if (distance < -45) {
                nextSlide();
            } else if (distance > 45) {
                previousSlide();
            } else {
                renderSlider(true);
            }

            startAutoSlide();
        }
    );


    /* =====================================
       KÉO BẰNG CHUỘT
    ===================================== */

    slider.addEventListener(
        "mousedown",
        function (event) {
            if (isAnimating) {
                return;
            }

            dragging = true;

            startX = event.clientX;
            currentX = startX;

            stopAutoSlide();

            track.classList.add("is-dragging");

            event.preventDefault();
        }
    );


    window.addEventListener(
        "mousemove",
        function (event) {
            if (!dragging) {
                return;
            }

            currentX = event.clientX;

            const distance =
                currentX - startX;

            const baseOffset =
                getCenteredOffset(currentIndex);

            track.style.transform =
                `translate3d(${baseOffset + distance}px, 0, 0)`;
        }
    );


    window.addEventListener(
        "mouseup",
        function () {
            if (!dragging) {
                return;
            }

            dragging = false;

            track.classList.remove("is-dragging");

            const distance =
                currentX - startX;

            if (distance < -45) {
                nextSlide();
            } else if (distance > 45) {
                previousSlide();
            } else {
                renderSlider(true);
            }

            startAutoSlide();
        }
    );


    /* =====================================
       RESIZE
    ===================================== */

    window.addEventListener(
        "resize",
        function () {
            renderSlider(false);
        }
    );


    /* =====================================
       KHỞI TẠO SAU KHI ẢNH TẢI
    ===================================== */

    function initializeSlider() {
        requestAnimationFrame(function () {
            renderSlider(false);
            startAutoSlide();
        });
    }

    if (document.readyState === "complete") {
        initializeSlider();
    } else {
        window.addEventListener(
            "load",
            initializeSlider,
            {
                once: true
            }
        );
    }
});

    /*
     * Hỗ trợ kéo bằng chuột trên máy tính.
     */
  
document.addEventListener("DOMContentLoaded", function () {
    /* =====================================
       SLIDER
    ===================================== */

    const slider = document.querySelector(".banner-slider");
    const track = document.getElementById("bannerTrack");

    if (slider && track) {
        const originalSlides = Array.from(
            track.querySelectorAll(".banner-slide")
        );

        if (originalSlides.length >= 2) {
            const firstClone =
                originalSlides[0].cloneNode(true);

            const lastClone =
                originalSlides[
                    originalSlides.length - 1
                ].cloneNode(true);

            firstClone.classList.add("is-clone");
            lastClone.classList.add("is-clone");

            track.appendChild(firstClone);
            track.insertBefore(
                lastClone,
                originalSlides[0]
            );

            const slides = Array.from(
                track.querySelectorAll(".banner-slide")
            );

            let currentIndex = 1;
            let isAnimating = false;

            let startX = 0;
            let currentX = 0;
            let dragging = false;

            let autoTimer = null;


            function updateSlideClasses() {
                slides.forEach(function (slide, index) {
                    slide.classList.remove(
                        "is-active",
                        "is-prev",
                        "is-next",
                        "is-far"
                    );

                    if (index === currentIndex) {
                        slide.classList.add("is-active");
                    } else if (index === currentIndex - 1) {
                        slide.classList.add("is-prev");
                    } else if (index === currentIndex + 1) {
                        slide.classList.add("is-next");
                    } else {
                        slide.classList.add("is-far");
                    }
                });
            }


            function getCenteredOffset(index) {
                const activeSlide = slides[index];

                if (!activeSlide) {
                    return 0;
                }

                const sliderWidth =
                    slider.getBoundingClientRect().width;

                const slideCenter =
                    activeSlide.offsetLeft +
                    activeSlide.offsetWidth / 2;

                return sliderWidth / 2 - slideCenter;
            }


            function renderSlider(animate = true) {
                track.style.transition = animate
                    ? "transform 0.55s cubic-bezier(0.22, 0.78, 0.25, 1)"
                    : "none";

                updateSlideClasses();

                const offset =
                    getCenteredOffset(currentIndex);

                track.style.transform =
                    `translate3d(${offset}px, 0, 0)`;
            }


            function nextSlide() {
                if (isAnimating) {
                    return;
                }

                isAnimating = true;
                currentIndex += 1;

                renderSlider(true);
            }


            function previousSlide() {
                if (isAnimating) {
                    return;
                }

                isAnimating = true;
                currentIndex -= 1;

                renderSlider(true);
            }


            track.addEventListener(
                "transitionend",
                function (event) {
                    if (event.propertyName !== "transform") {
                        return;
                    }

                    if (currentIndex === slides.length - 1) {
                        currentIndex = 1;
                        renderSlider(false);
                    }

                    if (currentIndex === 0) {
                        currentIndex = slides.length - 2;
                        renderSlider(false);
                    }

                    isAnimating = false;
                }
            );


            function stopAutoSlide() {
                if (autoTimer) {
                    window.clearInterval(autoTimer);
                    autoTimer = null;
                }
            }


            function startAutoSlide() {
                stopAutoSlide();

                autoTimer = window.setInterval(
                    nextSlide,
                    4000
                );
            }


            slider.addEventListener(
                "touchstart",
                function (event) {
                    if (isAnimating) {
                        return;
                    }

                    dragging = true;
                    startX = event.touches[0].clientX;
                    currentX = startX;

                    stopAutoSlide();
                    track.classList.add("is-dragging");
                },
                {
                    passive: true
                }
            );


            slider.addEventListener(
                "touchmove",
                function (event) {
                    if (!dragging) {
                        return;
                    }

                    currentX = event.touches[0].clientX;

                    const distance =
                        currentX - startX;

                    const baseOffset =
                        getCenteredOffset(currentIndex);

                    track.style.transform =
                        `translate3d(${baseOffset + distance}px, 0, 0)`;
                },
                {
                    passive: true
                }
            );


            slider.addEventListener(
                "touchend",
                function () {
                    if (!dragging) {
                        return;
                    }

                    dragging = false;
                    track.classList.remove("is-dragging");

                    const distance =
                        currentX - startX;

                    if (distance < -45) {
                        nextSlide();
                    } else if (distance > 45) {
                        previousSlide();
                    } else {
                        renderSlider(true);
                    }

                    startAutoSlide();
                }
            );


            slider.addEventListener(
                "mousedown",
                function (event) {
                    if (isAnimating) {
                        return;
                    }

                    dragging = true;
                    startX = event.clientX;
                    currentX = startX;

                    stopAutoSlide();
                    track.classList.add("is-dragging");

                    event.preventDefault();
                }
            );


            window.addEventListener(
                "mousemove",
                function (event) {
                    if (!dragging) {
                        return;
                    }

                    currentX = event.clientX;

                    const distance =
                        currentX - startX;

                    const baseOffset =
                        getCenteredOffset(currentIndex);

                    track.style.transform =
                        `translate3d(${baseOffset + distance}px, 0, 0)`;
                }
            );


            window.addEventListener(
                "mouseup",
                function () {
                    if (!dragging) {
                        return;
                    }

                    dragging = false;
                    track.classList.remove("is-dragging");

                    const distance =
                        currentX - startX;

                    if (distance < -45) {
                        nextSlide();
                    } else if (distance > 45) {
                        previousSlide();
                    } else {
                        renderSlider(true);
                    }

                    startAutoSlide();
                }
            );


            window.addEventListener(
                "resize",
                function () {
                    renderSlider(false);
                }
            );


            requestAnimationFrame(function () {
                renderSlider(false);

                /*
                 * Tạm dừng tự chạy để chỉnh ảnh:
                 * giữ dòng dưới ở trạng thái comment.
                 */
                // startAutoSlide();
            });
        }
    }


    /* =====================================
       LOGIN BOTTOM SHEET
    ===================================== */

    const loginButton =
        document.getElementById("loginButton");

    const loginOverlay =
        document.getElementById("loginOverlay");

    const loginSheet =
        document.getElementById("loginSheet");

    const closeLoginSheetButton =
        document.getElementById("closeLoginSheet");

    const passwordLoginOption =
        document.getElementById("passwordLoginOption");

    const otpLoginOption =
        document.getElementById("otpLoginOption");


    function openLoginSheet() {
        if (!loginOverlay || !loginSheet) {
            console.error(
                "Không tìm thấy loginOverlay hoặc loginSheet"
            );

            return;
        }

        document.body.classList.add(
            "login-sheet-open"
        );

        loginOverlay.classList.add(
            "is-visible"
        );

        loginSheet.classList.add(
            "is-open"
        );

        loginSheet.setAttribute(
            "aria-hidden",
            "false"
        );
    }


    function closeLoginSheet() {
        if (!loginOverlay || !loginSheet) {
            return;
        }

        loginOverlay.classList.remove(
            "is-visible"
        );

        loginSheet.classList.remove(
            "is-open"
        );

        loginSheet.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "login-sheet-open"
        );
    }


    loginButton?.addEventListener(
        "click",
        function (event) {
            event.preventDefault();
            openLoginSheet();
        }
    );


    closeLoginSheetButton?.addEventListener(
        "click",
        function (event) {
            event.preventDefault();
            closeLoginSheet();
        }
    );


    loginOverlay?.addEventListener(
        "click",
        closeLoginSheet
    );


    document.addEventListener(
        "keydown",
        function (event) {
            if (
                event.key === "Escape" &&
                loginSheet?.classList.contains("is-open")
            ) {
                closeLoginSheet();
            }
        }
    );


    passwordLoginOption?.addEventListener(
        "click",
        function () {
            window.location.href =
                "./password.html";
        }
    );


    otpLoginOption?.addEventListener(
        "click",
        function () {
            window.location.href =
                "./otp.html";
        }
    );


    /* =====================================
       CÁC NÚT KHÁC
    ===================================== */

    document
        .getElementById("qrButton")
        ?.addEventListener("click", function () {
            window.location.href = "./qr.html";
        });


    document
        .getElementById("openAccountButton")
        ?.addEventListener("click", function () {
            window.location.href =
                "./open-account.html";
        });
});