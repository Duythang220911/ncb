document.addEventListener("DOMContentLoaded", function () {
    const detailBackButton =
        document.getElementById("detailBackButton");

    const bottomBackButton =
        document.getElementById("bottomBackButton");

    const downloadButton =
        document.getElementById("downloadButton");

    const shareButton =
        document.getElementById("shareButton");

    const detailToast =
        document.getElementById("detailToast");

    let toastTimer = null;


    function goBack() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href =
                "./transaction-history.html";
        }
    }


    function showToast(message) {
        if (!detailToast) {
            return;
        }

        window.clearTimeout(toastTimer);

        detailToast.textContent = message;
        detailToast.classList.add("is-visible");

        toastTimer = window.setTimeout(function () {
            detailToast.classList.remove("is-visible");
        }, 2200);
    }


    detailBackButton?.addEventListener(
        "click",
        goBack
    );

    bottomBackButton?.addEventListener(
        "click",
        goBack
    );


    downloadButton?.addEventListener(
        "click",
        function () {
            showToast(
                "Đã chuẩn bị nội dung giao dịch để tải xuống"
            );
        }
    );


    shareButton?.addEventListener(
        "click",
        async function () {
            const shareData = {
                title: "Chi tiết giao dịch",
                text:
                    "Giao dịch nhận tiền +55,555 VND lúc 23:54, 14/07/2026"
            };

            try {
                if (navigator.share) {
                    await navigator.share(shareData);
                } else if (navigator.clipboard) {
                    await navigator.clipboard.writeText(
                        shareData.text
                    );

                    showToast(
                        "Đã sao chép thông tin giao dịch"
                    );
                } else {
                    showToast(
                        "Thiết bị chưa hỗ trợ chia sẻ"
                    );
                }
            } catch (error) {
                if (error.name !== "AbortError") {
                    showToast(
                        "Không thể chia sẻ giao dịch"
                    );
                }
            }
        }
    );
});