document.addEventListener("DOMContentLoaded", function () {
    const passwordPage =
        document.getElementById("passwordPage");

    const passwordInput =
        document.getElementById("passwordInput");

    const showPasswordButton =
        document.getElementById("showPasswordButton");

    const continueButton =
        document.getElementById("continueButton");

    const backButton =
        document.getElementById("backButton");

    const forgotPasswordButton =
        document.getElementById("forgotPasswordButton");

    let tapCount = 0;
    const requiredTapCount = 9;

    /*
     * Tự focus ô nhập.
     * Trên một số trình duyệt iPhone, bàn phím chỉ mở
     * sau tương tác trực tiếp của người dùng.
     */
    window.setTimeout(function () {
        passwordInput?.focus();
    }, 300);


    function enableContinueButton() {
        continueButton.disabled = false;
        continueButton.classList.add("is-active");
    }


    function registerScreenTap(event) {
        /*
         * Không tính khi nhấn các nút điều hướng.
         */
        if (
            event.target.closest(".back-button") ||
            event.target.closest(".forgot-password") ||
            event.target.closest(".continue-button") ||
            event.target.closest(".show-password-button")
        ) {
            return;
        }

        if (tapCount >= requiredTapCount) {
            return;
        }

        tapCount += 1;

        console.log(
            `Số lần chạm: ${tapCount}/${requiredTapCount}`
        );

        if (tapCount >= requiredTapCount) {
            enableContinueButton();
        }
    }


    /*
     * Dùng pointerup để hoạt động cả chuột lẫn cảm ứng.
     */
    passwordPage?.addEventListener(
        "pointerup",
        registerScreenTap
    );


    /*
     * Hiện hoặc ẩn nội dung ô nhập.
     */
    showPasswordButton?.addEventListener(
        "click",
        function () {
            const isHidden =
                passwordInput.type === "password";

            passwordInput.type =
                isHidden ? "text" : "password";

            const icon =
                showPasswordButton.querySelector("i");

            icon?.classList.toggle("bx-hide", !isHidden);
            icon?.classList.toggle("bx-show", isHidden);

            passwordInput.focus();
        }
    );


    /*
     * Quay lại trang trước.
     */
    backButton?.addEventListener("click", function () {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = "./index.html";
        }
    });


    /*
     * Sang trang kế tiếp khi nút đã được bật.
     */
    continueButton?.addEventListener(
        "click",
        function () {
            if (continueButton.disabled) {
                return;
            }

            window.location.href = "./home.html";
        }
    );


    forgotPasswordButton?.addEventListener(
        "click",
        function () {
            window.location.href = "./reset-password.html";
        }
    );
});
// continueButton?.addEventListener("click", function () {
//     if (continueButton.disabled) return;

//     window.location.href = "./home.html";
// });