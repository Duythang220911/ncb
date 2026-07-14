document.addEventListener("DOMContentLoaded", function () {
    if (!("serviceWorker" in navigator)) {
        console.warn(
            "Trình duyệt không hỗ trợ Service Worker."
        );

        return;
    }

    window.addEventListener("load", function () {
        navigator.serviceWorker
            .register("./service-worker.js")
            .then(function (registration) {
                console.log(
                    "Service Worker đã đăng ký:",
                    registration.scope
                );
            })
            .catch(function (error) {
                console.error(
                    "Không thể đăng ký Service Worker:",
                    error
                );
            });
    });
});