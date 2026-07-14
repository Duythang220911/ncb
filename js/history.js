document.addEventListener("DOMContentLoaded", function () {
    const backButton =
        document.getElementById("backButton");

    const showBalanceButton =
        document.getElementById("showBalanceButton");

    const availableBalance =
        document.getElementById("availableBalance");

    const collapseButton =
        document.getElementById("collapseButton");

    const transactionListWrapper =
        document.getElementById("transactionListWrapper");

    const transactionSearch =
        document.getElementById("transactionSearch");

    const transactionItems =
        Array.from(
            document.querySelectorAll(".transaction-item")
        );

    const transactionTabs =
        Array.from(
            document.querySelectorAll(".transaction-tab")
        );

    const emptyMessage =
        document.getElementById("emptyMessage");

    const typeFilterButton =
        document.getElementById("typeFilterButton");

    const typeFilterText =
        document.getElementById("typeFilterText");

    const filterOverlay =
        document.getElementById("filterOverlay");

    const filterSheet =
        document.getElementById("filterSheet");

    const closeFilterSheet =
        document.getElementById("closeFilterSheet");

    const filterOptions =
        Array.from(
            document.querySelectorAll(".filter-option")
        );


    let currentFilter = "all";


    backButton?.addEventListener("click", function () {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = "./home.html";
        }
    });


    showBalanceButton?.addEventListener("click", function () {
        const currentlyHidden =
            availableBalance.dataset.hidden !== "false";

        const icon =
            showBalanceButton.querySelector("i");

        const label =
            showBalanceButton.querySelector("span");

        if (currentlyHidden) {
            availableBalance.innerHTML =
                `${availableBalance.dataset.balance} <span>VND</span>`;

            availableBalance.dataset.hidden = "false";

            icon?.classList.remove("bxs-show");
            icon?.classList.add("bxs-hide");

            label.textContent = "Ẩn";
        } else {
            availableBalance.innerHTML =
                `*** *** <span>VND</span>`;

            availableBalance.dataset.hidden = "true";

            icon?.classList.remove("bxs-hide");
            icon?.classList.add("bxs-show");

            label.textContent = "Hiện";
        }
    });


    collapseButton?.addEventListener("click", function () {
        const isCollapsed =
            transactionListWrapper.hidden;

        transactionListWrapper.hidden =
            !isCollapsed;

        collapseButton.textContent =
            isCollapsed ? "Thu gọn" : "Mở rộng";
    });


    function applyFilters() {
        const keyword =
            transactionSearch.value
                .trim()
                .toLowerCase();

        let visibleCount = 0;

        transactionItems.forEach(function (item) {
            const typeMatches =
                currentFilter === "all" ||
                item.dataset.type === currentFilter;

            const searchText =
                item.dataset.search.toLowerCase();

            const keywordMatches =
                !keyword ||
                searchText.includes(keyword);

            const isVisible =
                typeMatches && keywordMatches;

            item.hidden = !isVisible;

            if (isVisible) {
                visibleCount += 1;
            }
        });

        emptyMessage.hidden =
            visibleCount !== 0;
    }


    transactionSearch?.addEventListener(
        "input",
        applyFilters
    );


    transactionTabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            transactionTabs.forEach(function (button) {
                button.classList.remove("active");
            });

            tab.classList.add("active");

            currentFilter =
                tab.dataset.filter;

            applyFilters();
        });
    });


    function openFilterSheet() {
        filterOverlay.classList.add("is-open");
        filterSheet.classList.add("is-open");

        filterSheet.setAttribute(
            "aria-hidden",
            "false"
        );
    }


    function closeFilterMenu() {
        filterOverlay.classList.remove("is-open");
        filterSheet.classList.remove("is-open");

        filterSheet.setAttribute(
            "aria-hidden",
            "true"
        );
    }


    typeFilterButton?.addEventListener(
        "click",
        openFilterSheet
    );

    closeFilterSheet?.addEventListener(
        "click",
        closeFilterMenu
    );

    filterOverlay?.addEventListener(
        "click",
        closeFilterMenu
    );


    filterOptions.forEach(function (option) {
        option.addEventListener("click", function () {
            currentFilter =
                option.dataset.value;

            typeFilterText.textContent =
                option.dataset.label;

            transactionTabs.forEach(function (tab) {
                tab.classList.toggle(
                    "active",
                    tab.dataset.filter === currentFilter
                );
            });

            applyFilters();
            closeFilterMenu();
        });
    });
});

const clickableTransactions =
    document.querySelectorAll(
        ".transaction-item[data-detail-url]"
    );

clickableTransactions.forEach(function (item) {
    function openTransactionDetail() {
        const detailUrl = item.dataset.detailUrl;

        if (detailUrl) {
            window.location.href = detailUrl;
        }
    }

    item.addEventListener("click", openTransactionDetail);

    item.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openTransactionDetail();
        }
    });
});