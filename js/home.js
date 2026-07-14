document.addEventListener("DOMContentLoaded", function () {
    const toggleBalance =
        document.getElementById("toggleBalance");

    const balanceValue =
        document.getElementById("balanceValue");

    const transferButton =
        document.getElementById("transferButton");

    const scanQrButton =
        document.getElementById("scanQrButton");


    toggleBalance?.addEventListener("click", function () {
        const isHidden =
            balanceValue.classList.contains("is-hidden");

        const icon =
            toggleBalance.querySelector("i");

        if (isHidden) {
            balanceValue.textContent =
                `${balanceValue.dataset.balance} VND`;

            balanceValue.classList.remove("is-hidden");

            icon?.classList.remove("bx-hide");
            icon?.classList.add("bx-show");

            toggleBalance.setAttribute(
                "aria-label",
                "Ẩn số dư"
            );
        } else {
            balanceValue.textContent = "*** *** VND";

            balanceValue.classList.add("is-hidden");

            icon?.classList.remove("bx-show");
            icon?.classList.add("bx-hide");

            toggleBalance.setAttribute(
                "aria-label",
                "Hiện số dư"
            );
        }
    });


    transferButton?.addEventListener("click", function () {
        window.location.href = "./transfer.html";
    });


    scanQrButton?.addEventListener("click", function () {
        window.location.href = "./qr.html";
    });
});
const transactionHistoryButton =
    document.getElementById("transactionHistoryButton");

transactionHistoryButton?.addEventListener("click", function () {
    window.location.href = "./history.html";
});