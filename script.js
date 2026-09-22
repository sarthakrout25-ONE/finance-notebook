// ===============================
// Personal Finance Notebook
// Day 2 - Account Setup
// ===============================


// Load saved accounts from localStorage

let accounts = JSON.parse(localStorage.getItem("financeAccounts")) || {
    acc1: 0,
    acc2: 0,
    cash: 0
};


// Save accounts

function saveAccounts() {

    localStorage.setItem(
        "financeAccounts",
        JSON.stringify(accounts)
    );
}


// Update account display

function updateTotalBalance() {

    const total =
        accounts.acc1 +
        accounts.acc2 +
        accounts.cash;


    document.getElementById("totalBalance").textContent =
        `₹${total.toLocaleString("en-IN")}`;


    document.getElementById("acc1Balance").textContent =
        `₹${accounts.acc1.toLocaleString("en-IN")}`;


    document.getElementById("acc2Balance").textContent =
        `₹${accounts.acc2.toLocaleString("en-IN")}`;


    document.getElementById("cashBalance").textContent =
        `₹${accounts.cash.toLocaleString("en-IN")}`;
}
    // ===============================
    // Display Recent Transactions
    // ===============================

    function displayRecentTransactions() {

        const container =
            document.getElementById("recentTransactions");

        const transactions =
            JSON.parse(
                localStorage.getItem("financeTransactions")
            ) || [];

        // No transactions

        if (transactions.length === 0) {

            container.innerHTML = `
                <p>No transactions yet</p>
            `;

            return;
        }


        // Show newest transactions first

        const recentTransactions =
            transactions.slice(-5).reverse();


        container.innerHTML = "";


        recentTransactions.forEach(function (transaction) {

            const accountName = {

                acc1: "ACC-1",
                acc2: "ACC-2",
                cash: "Cash"

            }[transaction.account];


            // Expense

            if (transaction.type === "expense") {

                const icons = {

                    Food: "🍔",
                    Travel: "🚌",
                    College: "🎓",
                    Shopping: "🛒",
                    Entertainment: "🎮",
                    Recharge: "📱",
                    Bills: "🏠",
                    Other: "📦"

                };

                const icon =
                    icons[transaction.category] || "📦";


                const item = document.createElement("div");

                item.className = "recent-item";


                item.innerHTML = `

                    <div class="recent-icon">
                        ${icon}
                    </div>

                    <div class="recent-details">

                        <strong>
                            ${transaction.category}
                        </strong>

                        <span>
                            ${accountName}
                            ${transaction.note
                                ? " • " + transaction.note
                                : ""}
                        </span>

                        <small>
                            ${transaction.date}
                        </small>

                    </div>

                    <div class="recent-amount expense-amount">
                        -₹${Number(transaction.amount).toLocaleString("en-IN")}
                    </div>

                `;


                container.appendChild(item);

            }


            // Income

            else if (transaction.type === "income") {

                const icons = {

                    Salary: "💼",
                    Received: "💰",
                    "Pocket Money": "👛",
                    Refund: "↩️",
                    College: "🎓",
                    Other: "📦"

                };

                const icon =
                    icons[transaction.source] || "💰";


                const item = document.createElement("div");

                item.className = "recent-item";


                item.innerHTML = `

                    <div class="recent-icon">
                        ${icon}
                    </div>

                    <div class="recent-details">

                        <strong>
                            ${transaction.source}
                        </strong>

                        <span>
                            ${accountName}
                            ${transaction.note
                                ? " • " + transaction.note
                                : ""}
                        </span>

                        <small>
                            ${transaction.date}
                        </small>

                    </div>

                    <div class="recent-amount income-amount">
                        +₹${Number(transaction.amount).toLocaleString("en-IN")}
                    </div>

                `;


                container.appendChild(item);

            }
            // Transfer

            else if (transaction.type === "transfer") {

                const item = document.createElement("div");

                item.className = "recent-item";

                const fromName = {
                    acc1: "ACC-1",
                    acc2: "ACC-2",
                    cash: "Cash"
                }[transaction.fromAccount];

                const toName = {
                    acc1: "ACC-1",
                    acc2: "ACC-2",
                    cash: "Cash"
                }[transaction.toAccount];


                item.innerHTML = `

                    <div class="recent-icon">
                        🔄
                    </div>

                    <div class="recent-details">

                        <strong>
                            Transfer
                        </strong>

                        <span>
                            ${fromName} → ${toName}
                            ${transaction.note
                                ? " • " + transaction.note
                                : ""}
                        </span>

                        <small>
                            ${transaction.date}
                        </small>

                    </div>

                    <div class="recent-amount">
                        ₹${Number(transaction.amount).toLocaleString("en-IN")}
                    </div>

                `;

                container.appendChild(item);

            }

        });

    }
    // ===============================
    // Update Total Expense
    // ===============================

    function updateTotalExpense() {

        const transactions =
            JSON.parse(
                localStorage.getItem("financeTransactions")
            ) || [];

        const totalExpense =
            transactions
                .filter(transaction => transaction.type === "expense")
                .reduce(
                    (total, transaction) =>
                        total + Number(transaction.amount),
                    0
                );

        document.getElementById("totalExpense").textContent =
            `₹${totalExpense.toLocaleString("en-IN")}`;
    }
    function updateCategories() {
        const categoryList = document.getElementById("categoryList");
        const categoryChart = document.getElementById("categoryChart");

        if (!categoryList) return;

        let transactions =
            JSON.parse(localStorage.getItem("financeTransactions")) || [];

        const categoryTotals = {
            Food: 0,
            Travel: 0,
            College: 0,
            Shopping: 0,
            Entertainment: 0,
            Recharge: 0,
            Bills: 0,
            Other: 0
        };

        transactions.forEach(function (transaction) {

            if (transaction.type !== "expense") return;

            const category = transaction.category;

            if (categoryTotals.hasOwnProperty(category)) {
                categoryTotals[category] += Number(transaction.amount);
            }
        });

        /* Update category cards */

        const cards =
            categoryList.querySelectorAll(".category-card");

        cards.forEach(function (card) {

            const categoryText =
                card.querySelector("strong").textContent;

            const category =
                categoryText.substring(
                    categoryText.indexOf(" ") + 1
                );

            const amount =
                categoryTotals[category] || 0;

            card.querySelector("p").textContent =
                "₹" + amount + " spent";

            card.querySelector("span").textContent =
                "₹" + amount;
        });


        /* Create spending chart */

        if (!categoryChart) return;

        categoryChart.innerHTML = "";

        const amounts =
            Object.values(categoryTotals);

        const maxAmount =
            Math.max(...amounts, 1);

        Object.entries(categoryTotals).forEach(function ([category, amount]) {

            const row = document.createElement("div");
            row.className = "chart-row";

            const percentage =
                (amount / maxAmount) * 100;

            row.innerHTML = `
                <div class="chart-label">
                    <span>${category}</span>
                    <span>₹${amount}</span>
                </div>

                <div class="chart-bar">
                    <div
                        class="chart-fill"
                        style="width: ${percentage}%;">
                    </div>
                </div>
            `;

            categoryChart.appendChild(row);
        });
    }
// Initial display

updateTotalBalance();

// ===============================
// Add Transaction Menu
// ===============================

const addButton = document.getElementById("addButton");

const transactionMenu =
    document.getElementById("transactionMenu");

const cancelTransaction =
    document.getElementById("cancelTransaction");

const expenseOption =
    document.getElementById("expenseOption");

const incomeOption =
    document.getElementById("incomeOption");

const transferOption =
    document.getElementById("transferOption");


// Open transaction menu

addButton.addEventListener("click", function () {

    transactionMenu.classList.add("show");

});


// Close transaction menu

cancelTransaction.addEventListener("click", function () {

    transactionMenu.classList.remove("show");

});

// ===============================
// Expense Form
// ===============================

const expenseForm =
    document.getElementById("expenseForm");

const cancelExpense =
    document.getElementById("cancelExpense");

const saveExpense =
    document.getElementById("saveExpense");

// ===============================
// Income Form
// ===============================

const incomeForm =
    document.getElementById("incomeForm");

const cancelIncome =
    document.getElementById("cancelIncome");

const saveIncome =
    document.getElementById("saveIncome");

// ===============================
// Transfer Form
// ===============================

const transferForm = 
    document.getElementById("transferForm");

const cancelTransfer = 
    document.getElementById("cancelTransfer");

const saveTransfer = 
    document.getElementById("saveTransfer");

// Set today's date

document.getElementById("transferDate").value =
    new Date().toISOString().split("T")[0];


// Cancel Transfer

cancelTransfer.addEventListener("click", function () {

    transferForm.classList.remove("show");

});

// Set today's date

document.getElementById("incomeDate").value =
    new Date().toISOString().split("T")[0];


// Cancel Income

cancelIncome.addEventListener("click", function () {

    incomeForm.classList.remove("show");

});


// Set today's date

document.getElementById("expenseDate").value =
    new Date().toISOString().split("T")[0];


// Cancel Expense

cancelExpense.addEventListener("click", function () {

    expenseForm.classList.remove("show");

});

// Expense

expenseOption.addEventListener("click", function () {

    transactionMenu.classList.remove("show");

    document.getElementById("expenseForm").classList.add("show");

});


// Income

incomeOption.addEventListener("click", function () {

    transactionMenu.classList.remove("show");

    document.getElementById("incomeForm").classList.add("show");

});


// Transfer

transferOption.addEventListener("click", function () {

    transactionMenu.classList.remove("show");

    document.getElementById("transferForm").classList.add("show");

});
// ===============================
// Save Expense
// ===============================

saveExpense.addEventListener("click", function () {

    const amount = Number(
        document.getElementById("expenseAmount").value
    );

    const category =
        document.getElementById("expenseCategory").value;

    const account =
        document.getElementById("expenseAccount").value;

    const date =
        document.getElementById("expenseDate").value;

    const note =
        document.getElementById("expenseNote").value.trim();


    // Check amount

    if (!amount || amount <= 0) {

        alert("Please enter a valid amount.");

        return;
    }


    // Check account balance

    if (amount > accounts[account]) {

        alert("Insufficient balance in this account.");

        return;
    }


    // Deduct money

    accounts[account] -= amount;


    // Save updated accounts

    saveAccounts();


    // Get existing transactions

    let transactions =
        JSON.parse(localStorage.getItem("financeTransactions")) || [];


    // Create expense

    const expense = {

        id: Date.now(),

        type: "expense",

        amount: amount,

        category: category,

        account: account,

        date: date,

        note: note

    };


    // Add expense

    transactions.push(expense);


    // Save transactions

    localStorage.setItem(
        "financeTransactions",
        JSON.stringify(transactions)
    );


    // Update balance display

    updateTotalBalance();

    // Update total expense

    updateTotalExpense();

    displayRecentTransactions();

    // Close form

    expenseForm.classList.remove("show");


    // Clear form

    document.getElementById("expenseAmount").value = "";

    document.getElementById("expenseNote").value = "";


    alert("Expense saved successfully.");

});
updateTotalBalance();
displayRecentTransactions();
updateTotalExpense();
updateTotalIncome();
// ===============================
// Save Income
// ===============================

saveIncome.addEventListener("click", function () {

    const amount = Number(
        document.getElementById("incomeAmount").value
    );

    const source =
        document.getElementById("incomeSource").value;

    const account =
        document.getElementById("incomeAccount").value;

    const date =
        document.getElementById("incomeDate").value;

    const note =
        document.getElementById("incomeNote").value.trim();


    // Check amount

    if (!amount || amount <= 0) {

        alert("Please enter a valid amount.");

        return;
    }


    // Add money to account

    accounts[account] += amount;


    // Save updated accounts

    saveAccounts();


    // Get existing transactions

    let transactions =
        JSON.parse(
            localStorage.getItem("financeTransactions")
        ) || [];


    // Create income transaction

    const income = {

        id: Date.now(),

        type: "income",

        amount: amount,

        source: source,

        account: account,

        date: date,

        note: note

    };


    // Add income

    transactions.push(income);


    // Save transactions

    localStorage.setItem(
        "financeTransactions",
        JSON.stringify(transactions)
    );


    // Update balance

    updateTotalBalance();
    updateTotalIncome();
    displayRecentTransactions();
    updateCategories();
    updateMonthlyOverview();


    // Close form

    incomeForm.classList.remove("show");


    // Clear form

    document.getElementById("incomeAmount").value = "";

    document.getElementById("incomeNote").value = "";


    alert("Income saved successfully.");

});
// ===============================
// Update Total Income
// ===============================

function updateTotalIncome() {

    const transactions =
        JSON.parse(
            localStorage.getItem("financeTransactions")
        ) || [];


    const totalIncome =
        transactions
            .filter(transaction => transaction.type === "income")
            .reduce(
                (total, transaction) =>
                    total + Number(transaction.amount),
                0
            );


    document.getElementById("totalIncome").textContent =
        `₹${totalIncome.toLocaleString("en-IN")}`;
}
// ===============================
// Save Transfer
// ===============================

saveTransfer.addEventListener("click", function () {

    const amount = Number(
        document.getElementById("transferAmount").value
    );

    const fromAccount =
        document.getElementById("transferFrom").value;

    const toAccount =
        document.getElementById("transferTo").value;

    const date =
        document.getElementById("transferDate").value;

    const note =
        document.getElementById("transferNote").value.trim();


    // Check amount

    if (!amount || amount <= 0) {

        alert("Please enter a valid amount.");

        return;
    }


    // Check different accounts

    if (fromAccount === toAccount) {

        alert("From and To accounts must be different.");

        return;
    }


    // Check balance

    if (amount > accounts[fromAccount]) {

        alert("Insufficient balance in this account.");

        return;
    }


    // Move money

    accounts[fromAccount] -= amount;
    accounts[toAccount] += amount;


    // Save updated accounts

    saveAccounts();


    // Get existing transactions

    let transactions =
        JSON.parse(
            localStorage.getItem("financeTransactions")
        ) || [];


    // Create transfer transaction

    const transfer = {

        id: Date.now(),

        type: "transfer",

        amount: amount,

        fromAccount: fromAccount,

        toAccount: toAccount,

        date: date,

        note: note

    };


    // Add transfer

    transactions.push(transfer);


    // Save transactions

    localStorage.setItem(
        "financeTransactions",
        JSON.stringify(transactions)
    );


    // Update display

    updateTotalBalance();
    updateTotalExpense();
    updateTotalIncome();
    displayRecentTransactions();


    // Close form

    transferForm.classList.remove("show");


    // Clear form

    document.getElementById("transferAmount").value = "";
    document.getElementById("transferNote").value = "";


    alert("Transfer completed successfully.");

});
// ===============================
// History Navigation
// ===============================

const historyButton =
    document.getElementById("historyButton");

const historySection =
    document.getElementById("historySection");

const homeSection =
    document.getElementById("homeSection");


historyButton.addEventListener("click", function () {

    hideAllSections();

    historySection.style.setProperty("display", "block", "important");

    homeButton.classList.remove("active");
    statsButton.classList.remove("active");
    wishlistButton.classList.remove("active");
    moreButton.classList.remove("active");
    historyButton.classList.add("active");

    displayTransactionHistory();
});
// ===============================
// Home Navigation
// ===============================

const homeButton =
    document.getElementById("homeButton");

homeButton.addEventListener("click", function () {

    // Hide every other section
    hideAllSections();

    // Show Home only
    homeSection.style.setProperty(
        "display",
        "block",
        "important"
    );

    // Active navigation
    homeButton.classList.add("active");

    historyButton.classList.remove("active");
    statsButton.classList.remove("active");
    wishlistButton.classList.remove("active");
    moreButton.classList.remove("active");

    // Refresh Home data
    updateTotalBalance();
    updateTotalExpense();
    updateTotalIncome();
    displayRecentTransactions();
    updateOwedTotals();
    displayOwedEntries();
    displayWishlist();

    window.scrollTo(0, 0);
});
// ===============================
// Display Transaction History
// ===============================

function displayTransactionHistory() {

    const container =
        document.getElementById("historyTransactions");

    const transactions =
        JSON.parse(
            localStorage.getItem("financeTransactions")
        ) || [];

    const searchInput =
        document.getElementById("historySearchInput");

    const filterSelect =
        document.getElementById("historyFilter");

    const searchText =
        searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

    const selectedFilter =
        filterSelect
            ? filterSelect.value
            : "all";


    // Filter transactions

    const filteredTransactions =
        transactions.filter(function (transaction) {

            // Type filter
            if (
                selectedFilter !== "all" &&
                transaction.type !== selectedFilter
            ) {
                return false;
            }

            // Search filter
            if (searchText) {

                const searchableText = [

                    transaction.category,
                    transaction.source,
                    transaction.note,
                    transaction.date,
                    transaction.account,
                    transaction.fromAccount,
                    transaction.toAccount

                ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

                if (!searchableText.includes(searchText)) {
                    return false;
                }
            }

            return true;
        });


    // No matching transactions

    if (filteredTransactions.length === 0) {

        container.innerHTML = `
            <p>No matching transactions found.</p>
        `;

        return;
    }


    // Newest first

    const historyTransactions =
        filteredTransactions.slice().reverse();

    container.innerHTML = "";


    historyTransactions.forEach(function (transaction) {

        const item =
            document.createElement("div");

        item.className = "recent-item";

        item.dataset.id = transaction.id;


        const accountName = {

            acc1: "ACC-1",
            acc2: "ACC-2",
            cash: "Cash"

        };


        // Expense

        if (transaction.type === "expense") {

            item.innerHTML = `

                <div class="recent-icon">
                    💸
                </div>

                <div class="recent-details">

                    <strong>
                        ${transaction.category}
                    </strong>

                    <span>
                        ${accountName[transaction.account]}
                    </span>

                    <small>
                        ${transaction.date}
                    </small>

                    ${transaction.note ? `
                        <small>
                            ${transaction.note}
                        </small>
                    ` : ""}

                </div>

                <div class="recent-amount expense-amount">
                    -₹${Number(transaction.amount).toLocaleString("en-IN")}
                </div>

            `;
        }


        // Income

        else if (transaction.type === "income") {

            item.innerHTML = `

                <div class="recent-icon">
                    💰
                </div>

                <div class="recent-details">

                    <strong>
                        ${transaction.source}
                    </strong>

                    <span>
                        ${accountName[transaction.account]}
                    </span>

                    <small>
                        ${transaction.date}
                    </small>

                    ${transaction.note ? `
                        <small>
                            ${transaction.note}
                        </small>
                    ` : ""}

                </div>

                <div class="recent-amount income-amount">
                    +₹${Number(transaction.amount).toLocaleString("en-IN")}
                </div>

            `;
        }


        // Transfer

        else if (transaction.type === "transfer") {

            item.innerHTML = `

                <div class="recent-icon">
                    🔄
                </div>

                <div class="recent-details">

                    <strong>
                        Transfer
                    </strong>

                    <span>
                        ${accountName[transaction.fromAccount]}
                        →
                        ${accountName[transaction.toAccount]}
                    </span>

                    <small>
                        ${transaction.date}
                    </small>

                    ${transaction.note ? `
                        <small>
                            ${transaction.note}
                        </small>
                    ` : ""}

                </div>

                <div class="recent-amount">
                    ₹${Number(transaction.amount).toLocaleString("en-IN")}
                </div>

            `;
        }


        // Delete button

        const deleteButton =
            document.createElement("button");

        deleteButton.className =
            "delete-transaction";

        deleteButton.textContent = "🗑️";


        item.appendChild(deleteButton);


        deleteButton.addEventListener(
            "click",
            function () {

                const confirmed =
                    confirm(
                        "Delete this transaction?"
                    );

                if (!confirmed) {
                    return;
                }


                // Reverse transaction effect

                if (transaction.type === "expense") {

                    accounts[transaction.account] +=
                        Number(transaction.amount);

                }

                else if (transaction.type === "income") {

                    accounts[transaction.account] -=
                        Number(transaction.amount);

                }

                else if (transaction.type === "transfer") {

                    accounts[transaction.fromAccount] +=
                        Number(transaction.amount);

                    accounts[transaction.toAccount] -=
                        Number(transaction.amount);

                }


                saveAccounts();


                let transactions =
                    JSON.parse(
                        localStorage.getItem(
                            "financeTransactions"
                        )
                    ) || [];


                transactions =
                    transactions.filter(
                        function (t) {
                            return t.id !== transaction.id;
                        }
                    );


                localStorage.setItem(
                    "financeTransactions",
                    JSON.stringify(transactions)
                );


                displayTransactionHistory();
                displayRecentTransactions();

                updateTotalBalance();
                updateTotalExpense();
                updateTotalIncome();

            }
        );


        container.appendChild(item);

    });

}
const historySearchInput =
    document.getElementById("historySearchInput");

const historyFilter =
    document.getElementById("historyFilter");


historySearchInput.addEventListener(
    "input",
    function () {
        displayTransactionHistory();
    }
);


historyFilter.addEventListener(
    "change",
    function () {
        displayTransactionHistory();
    }
);
const moreButton = document.getElementById("moreButton");
const owedSection = document.getElementById("owedSection");

moreButton.addEventListener("click", function () {

    hideAllSections();

    owedSection.style.setProperty("display", "block", "important");

    homeButton.classList.remove("active");
    historyButton.classList.remove("active");
    statsButton.classList.remove("active");
    wishlistButton.classList.remove("active");
    moreButton.classList.add("active");

    displayOwedEntries();
    updateOwedTotals();
});
const openBackupButton =
    document.getElementById("openBackupButton");

const backupSection =
    document.getElementById("backupSection");

openBackupButton.addEventListener("click", function () {

    hideAllSections();

    backupSection.style.setProperty("display", "block", "important");

    window.scrollTo(0, 0);
});
const statsButton = document.getElementById("statsButton");
const categoriesSection = document.getElementById("categoriesSection");
const statisticsSection =
    document.getElementById("statisticsSection");
const wishlistButton =
    document.getElementById("wishlistButton");

const wishlistSection =
    document.getElementById("wishlistSection");

const addWishlistButton =
    document.getElementById("addWishlistButton");

const wishlistForm =
    document.getElementById("wishlistForm");

const cancelWishlistButton =
    document.getElementById("cancelWishlistButton");

const wishlistLink =
    document.getElementById("wishlistLink")
// ===============================
// Statistics
// ===============================

function updateStatisticsOverview() {

    const transactions =
        JSON.parse(localStorage.getItem("financeTransactions")) || [];

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(function (transaction) {

        if (transaction.type === "income") {
            totalIncome += Number(transaction.amount);
        }

        if (transaction.type === "expense") {
            totalExpense += Number(transaction.amount);
        }

    });

    const moneyFlow = totalIncome - totalExpense;

    document.getElementById("statsIncome").textContent =
        "₹" + totalIncome.toFixed(2);

    document.getElementById("statsExpense").textContent =
        "₹" + totalExpense.toFixed(2);

    document.getElementById("statsFlow").textContent =
        "₹" + moneyFlow.toFixed(2);
}
// ===============================
// Statistics - Category Spending
// ===============================
function updateStatisticsCategories() {

    const transactions =
        JSON.parse(localStorage.getItem("financeTransactions")) || [];

    const categories = {
        Food: 0,
        Travel: 0,
        College: 0,
        Shopping: 0,
        Entertainment: 0,
        Recharge: 0,
        Bills: 0,
        Other: 0
    };

    const categoryTransactions = {};

    Object.keys(categories).forEach(function (category) {
        categoryTransactions[category] = 0;
    });

    transactions.forEach(function (transaction) {

        if (transaction.type !== "expense") return;

        const category =
            categories.hasOwnProperty(transaction.category)
                ? transaction.category
                : "Other";

        categories[category] += Number(transaction.amount);
        categoryTransactions[category]++;
    });

    const total =
        Object.values(categories).reduce(
            (sum, amount) => sum + amount,
            0
        );

    const totalAmount =
        document.getElementById("categoryTotalAmount");

    if (totalAmount) {
        totalAmount.textContent =
            "₹" + total.toFixed(2);
    }

    const colors = [
        "#39ff14",
        "#00e5ff",
        "#ff3cac",
        "#ffd000",
        "#9d4edd",
        "#ff6b35",
        "#00ff9d",
        "#ffffff"
    ];

    const legend =
        document.getElementById("categoryChartLegend");

    legend.innerHTML = "";

    let gradientParts = [];
    let currentPercentage = 0;

    Object.keys(categories).forEach(function (category, index) {

        const amount = categories[category];

        if (amount <= 0) return;

        const percentage =
            total > 0
                ? (amount / total) * 100
                : 0;

        const start = currentPercentage;
        const end = currentPercentage + percentage;

        gradientParts.push(
            `${colors[index]} ${start}% ${end}%`
        );

        currentPercentage = end;

        const item =
            document.createElement("div");

        item.className =
            "category-legend-item";


        item.innerHTML = `
            <span
                class="category-color"
                style="background:${colors[index]}"
            ></span>

            <span class="category-name">
                ${category}
            </span>

            <strong>
                ${percentage.toFixed(1)}%
            </strong>
        `;


        legend.appendChild(item);
    });
    const donut =
    document.querySelector(".category-donut");

if (donut && gradientParts.length > 0) {

    donut.style.background =
        `conic-gradient(${gradientParts.join(", ")})`;

    donut.style.cursor = "pointer";

    donut.onclick = function (event) {

        const rect = donut.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const x = event.clientX - centerX;
        const y = event.clientY - centerY;

        let angle =
            Math.atan2(y, x) * (180 / Math.PI);

        angle = angle + 90;

        if (angle < 0) {
            angle += 360;
        }

        let clickedPercentage =
            (angle / 360) * 100;

        let accumulated = 0;

        Object.keys(categories).forEach(function (category) {

            const amount = categories[category];

            if (amount <= 0) return;

            const percentage =
                (amount / total) * 100;

            const start = accumulated;
            const end = accumulated + percentage;

            if (
                clickedPercentage >= start &&
                clickedPercentage < end
            ) {

                const detail =
                    document.getElementById("categoryDetail");

                document.getElementById(
                    "categoryDetailName"
                ).textContent = category;

                document.getElementById(
                    "categoryDetailAmount"
                ).textContent =
                    "₹" + amount.toFixed(2);

                document.getElementById(
                    "categoryDetailPercentage"
                ).textContent =
                    percentage.toFixed(1) + "%";

                document.getElementById(
                    "categoryDetailTransactions"
                ).textContent =
                    categoryTransactions[category];

                detail.style.display = "block";
            }

            accumulated = end;
        });
    };

} else if (donut) {

    donut.style.background = "#ddd";
}


    const categoryList =
        document.getElementById("statsCategoryList");

    categoryList.innerHTML = "";

    Object.keys(categories).forEach(function (category) {

        const amount = categories[category];

        if (amount <= 0) return;

        const percentage =
            total > 0
                ? (amount / total) * 100
                : 0;

        const item =
            document.createElement("div");

        item.className =
            "stats-category-item";

        item.innerHTML = `
            <div class="stats-category-row">
                <span>${category}</span>
                <strong>₹${amount.toFixed(2)}</strong>
            </div>

            <div class="stats-category-bar">
                <div
                    class="stats-category-progress"
                    style="width: ${percentage}%"
                ></div>
            </div>
        `;

        categoryList.appendChild(item);
    });
}

// ===============================
// Statistics - Monthly Expenses
// ===============================

function updateStatisticsMonthly() {

    const transactions =
        JSON.parse(localStorage.getItem("financeTransactions")) || [];

    const monthlyTotals = {};

    transactions.forEach(function (transaction) {

        if (transaction.type !== "expense") return;

        const date = new Date(transaction.date);

        const month =
            date.toLocaleString("en-US", {
                month: "short"
            });

        const year = date.getFullYear();

        const key = month + " " + year;

        if (!monthlyTotals[key]) {
            monthlyTotals[key] = 0;
        }

        monthlyTotals[key] += Number(transaction.amount);
    });
    const monthlyChart =
        document.getElementById("statsMonthlyChart");

    if (monthlyChart) {
        monthlyChart.innerHTML = "";
    }

    const monthlyList =
        document.getElementById("statsMonthlyList");

    monthlyList.innerHTML = "";
    if (monthlyChart) {

        Object.keys(monthlyTotals).forEach(function (month) {

            const amount = monthlyTotals[month];

            const barItem =
                document.createElement("div");

            barItem.className = "monthly-chart-item";

            barItem.innerHTML = `
                <div class="monthly-chart-label">
                    <span>${month}</span>
                    <strong>₹${amount.toFixed(2)}</strong>
                </div>

                <div class="monthly-chart-bar">
                    <div
                        class="monthly-chart-progress"
                        data-amount="${amount}"
                    ></div>
                </div>
            `;

            monthlyChart.appendChild(barItem);
        });

        const bars =
            monthlyChart.querySelectorAll(
                ".monthly-chart-progress"
            );

        let maxAmount = 0;

        Object.values(monthlyTotals).forEach(function (amount) {
            if (amount > maxAmount) {
                maxAmount = amount;
            }
        });

        bars.forEach(function (bar) {

            const amount =
                Number(bar.dataset.amount);

            const width =
                maxAmount > 0
                    ? (amount / maxAmount) * 100
                    : 0;

            bar.style.width = width + "%";
        });
    }

    Object.keys(monthlyTotals).forEach(function (month) {

        const item = document.createElement("div");

        item.className = "stats-monthly-item";

        item.innerHTML = `
            <div class="stats-monthly-row">
                <span>${month}</span>
                <strong>₹${monthlyTotals[month].toFixed(2)}</strong>
            </div>
        `;

        monthlyList.appendChild(item);
    });
}
// ===============================
// Statistics - Account Spending
// ===============================

function updateStatisticsAccounts() {

    const transactions =
        JSON.parse(localStorage.getItem("financeTransactions")) || [];

    const accountTotals = {
        acc1: 0,
        acc2: 0,
        cash: 0
    };

    transactions.forEach(function (transaction) {

        if (transaction.type !== "expense") return;

        const account = transaction.account;

        if (accountTotals.hasOwnProperty(account)) {
            accountTotals[account] += Number(transaction.amount);
        }
    });

    const accountList =
        document.getElementById("statsAccountList");

    accountList.innerHTML = "";

    const accountNames = {
        acc1: "ACC-1",
        acc2: "ACC-2",
        cash: "Cash"
    };

    Object.keys(accountTotals).forEach(function (account) {

        const item = document.createElement("div");

        item.className = "stats-account-item";

        item.innerHTML = `
            <div class="stats-account-row">
                <span>${accountNames[account]}</span>
                <strong>₹${accountTotals[account].toFixed(2)}</strong>
            </div>
        `;

        accountList.appendChild(item);
    });
}
statsButton.addEventListener("click", function () {

    hideAllSections();

    statisticsSection.style.setProperty("display", "block", "important");

    homeButton.classList.remove("active");
    historyButton.classList.remove("active");
    moreButton.classList.remove("active");
    wishlistButton.classList.remove("active");
    statsButton.classList.add("active");
    updateStatisticsOverview();
    updateStatisticsCategories();
    updateStatisticsMonthly();
    updateStatisticsAccounts();
    window.scrollTo(0, 0);
});
addWishlistButton.addEventListener("click", function () {

    wishlistForm.style.display = "block";

    addWishlistButton.style.display = "none";

});


cancelWishlistButton.addEventListener("click", function () {

    wishlistForm.style.display = "none";

    addWishlistButton.style.display = "block";

    displayWishlistItems();
    updateWishlistTotal();

});
wishlistButton.addEventListener("click", function () {

    hideAllSections();

    wishlistSection.style.setProperty("display", "block", "important");

    homeButton.classList.remove("active");
    historyButton.classList.remove("active");
    moreButton.classList.remove("active");
    statsButton.classList.remove("active");
    wishlistButton.classList.add("active");

    displayWishlistItems();
    updateWishlistTotal();

    window.scrollTo(0, 0);
});
const addOwedButton = document.getElementById("addOwedButton");
const owedForm = document.getElementById("owedForm");
const cancelOwed = document.getElementById("cancelOwed");

addOwedButton.addEventListener("click", function () {
    owedForm.style.display = "block";
    addOwedButton.style.display = "none";
});

cancelOwed.addEventListener("click", function () {
    owedForm.style.display = "none";
    addOwedButton.style.display = "block";
});
const saveOwed = document.getElementById("saveOwed");

saveOwed.addEventListener("click", function () {

    const person = document.getElementById("owedPerson").value.trim();
    const amount = Number(document.getElementById("owedAmount").value);
    const type = document.getElementById("owedType").value;
    const reason = document.getElementById("owedReason").value.trim();
    const date = document.getElementById("owedDate").value;

    if (!person || !amount || amount <= 0 || !date) {
        alert("Please enter person, amount and date");
        return;
    }

    const owedEntry = {
        id: Date.now(),
        person: person,
        amount: amount,
        type: type,
        reason: reason,
        date: date,
        paid: false
    };

    let owedEntries =
        JSON.parse(localStorage.getItem("financeOwed")) || [];

    owedEntries.push(owedEntry);

    localStorage.setItem(
        "financeOwed",
        JSON.stringify(owedEntries)
    );
    // Update the page immediately
    displayOwedEntries();
    updateOwedTotals();

    alert("Money owed entry saved");

    owedForm.style.display = "none";
    addOwedButton.style.display = "block";

    document.getElementById("owedPerson").value = "";
    document.getElementById("owedAmount").value = "";
    document.getElementById("owedReason").value = "";
    document.getElementById("owedDate").value = "";
});
function displayOwedEntries() {

    const owedList = document.getElementById("owedList");

    let owedEntries =
        JSON.parse(localStorage.getItem("financeOwed")) || [];

    owedList.innerHTML = "";

    if (owedEntries.length === 0) {
        owedList.innerHTML = "<p>No money owed</p>";
        return;
    }

    owedEntries.reverse().forEach(function (entry) {

        const item = document.createElement("div");
        item.className = "recent-item";

        const direction =
            entry.type === "give"
                ? "💸 I Have To Give"
                : "💰 I Have To Receive";

        item.innerHTML = `
            <div>
                <strong>${entry.person}</strong>
                <p>${direction}</p>
                ${entry.reason ? `<small>${entry.reason}</small>` : ""}
                <small>${entry.date}</small>
            </div>

            <div>
                <strong>₹${entry.amount}</strong>
                <button class="owed-paid-button" data-id="${entry.id}">
                    ${entry.paid ? "✅ Paid" : "⏳ Unpaid"}
                </button>
                
                <button class="edit-owed-button" data-id="${entry.id}">
                    ✏️ Edit
                </button>
                
                <button class="delete-owed-button" data-id="${entry.id}">
                    🗑️
                </button>
            </div>
        `;

        owedList.appendChild(item);
        const paidButton = item.querySelector(".owed-paid-button");

        paidButton.addEventListener("click", function () {

            let entries =
                JSON.parse(localStorage.getItem("financeOwed")) || [];

            const selectedEntry = entries.find(function (e) {
                return e.id === entry.id;
            });

            if (!selectedEntry) {
                return;
            }

            selectedEntry.paid = !selectedEntry.paid;

            localStorage.setItem(
                "financeOwed",
                JSON.stringify(entries)
            );

            displayOwedEntries();
            updateOwedTotals();
        });
        const deleteOwedButton =
            item.querySelector(".delete-owed-button");

        deleteOwedButton.addEventListener("click", function () {

            const confirmed =
                confirm("Delete this money owed entry?");

            if (!confirmed) {
                return;
            }

            let entries =
                JSON.parse(localStorage.getItem("financeOwed")) || [];

            entries = entries.filter(function (e) {
                return e.id !== entry.id;
            });

            localStorage.setItem(
                "financeOwed",
                JSON.stringify(entries)
            );

            displayOwedEntries();
            updateOwedTotals();
        });
    });
}
function updateOwedTotals() {

    const moneyGiveTotal =
        document.getElementById("moneyGiveTotal");

    const moneyReceiveTotal =
        document.getElementById("moneyReceiveTotal");

    let owedEntries =
        JSON.parse(localStorage.getItem("financeOwed")) || [];

    let giveTotal = 0;
    let receiveTotal = 0;

    owedEntries.forEach(function (entry) {

        if (entry.paid) {
            return;
        }

        if (entry.type === "give") {
            giveTotal += Number(entry.amount);
        }

        if (entry.type === "receive") {
            receiveTotal += Number(entry.amount);
        }
    });

    moneyGiveTotal.textContent = "₹" + giveTotal;
    moneyReceiveTotal.textContent = "₹" + receiveTotal;
    const homeMoneyGive = document.getElementById("moneyToGive");
    const homeMoneyReceive = document.getElementById("moneyToReceive");

    if (homeMoneyGive) {
        homeMoneyGive.textContent = "₹" + giveTotal;
    }

    if (homeMoneyReceive) {
        homeMoneyReceive.textContent = "₹" + receiveTotal;
    }
}
updateOwedTotals();
const viewOwedButton =
    document.getElementById("viewOwedButton");

viewOwedButton.addEventListener("click", function () {

    homeSection.style.setProperty("display", "none", "important");
    historySection.style.setProperty("display", "none", "important");
    owedSection.style.setProperty("display", "block", "important");

    homeButton.classList.remove("active");
    historyButton.classList.remove("active");
    moreButton.classList.add("active");

    displayOwedEntries();
    updateOwedTotals();
    updateCategories();
});
    function updateMonthlyOverview() {

    const monthlyExpense =
        document.getElementById("monthlyExpense");

    const monthlyTransactions =
        document.getElementById("monthlyTransactions");

    if (!monthlyExpense || !monthlyTransactions) return;
    let transactions =
        JSON.parse(localStorage.getItem("financeTransactions")) || [];

    const now = new Date();

    const currentYear = now.getFullYear();
    const currentMonth =
        String(now.getMonth() + 1).padStart(2, "0");

    let totalSpent = 0;
    let transactionCount = 0;

    transactions.forEach(function (transaction) {

        if (transaction.type !== "expense") return;

        const dateParts = transaction.date.split("-");

        if (dateParts.length !== 3) return;

        if (
            Number(dateParts[0]) === currentYear &&
            dateParts[1] === currentMonth
        ) {
            totalSpent += Number(transaction.amount);
            transactionCount++;
        }
    });

    monthlyExpense.textContent =
        "₹" + totalSpent.toLocaleString("en-IN");

    monthlyTransactions.textContent =
        transactionCount;
}

updateMonthlyOverview();
// Wishlist

let wishlistItems =
    JSON.parse(localStorage.getItem("financeWishlist")) || [];

const saveWishlistButton =
    document.getElementById("saveWishlistButton");

saveWishlistButton.addEventListener("click", function () {

    const name =
        document.getElementById("wishlistName").value.trim();

    const price =
        parseFloat(document.getElementById("wishlistPrice").value);

    const link =
        wishlistLink.value.trim();

    if (!name || isNaN(price)) {
        alert("Please enter product name and price.");
        return;
    }

    const item = {
        id: Date.now(),
        name: name,
        price: price,
        link: link,
        purchased: false
    };

    wishlistItems.push(item);

    localStorage.setItem(
        "financeWishlist",
        JSON.stringify(wishlistItems)
    );

    alert("Item added to wishlist.");

    document.getElementById("wishlistName").value = "";
    document.getElementById("wishlistPrice").value = "";
    wishlistLink.value = "";

    wishlistForm.style.display = "none";
    addWishlistButton.style.display = "block";

    displayWishlistItems();
    updateWishlistTotal();


});
function displayWishlistItems() {

    const wishlistList =
        document.getElementById("wishlistList");

    const activeItems =
        wishlistItems.filter(function (item) {
            return item.purchased !== true;
        });

    if (activeItems.length === 0) {

        wishlistList.innerHTML = `
            <p class="wishlist-empty">
                Your wishlist is empty.
            </p>
        `;

        return;
    }

    wishlistList.innerHTML = "";

    activeItems.forEach(function (item) {

        const card = document.createElement("div");

        card.className = "wishlist-card";

        card.innerHTML = `
            <div>
                <h3>${item.name}</h3>

                <p>₹${Number(item.price).toFixed(2)}</p>

                ${
                    item.link
                    ? `<a href="${item.link}" target="_blank">
                        View Product
                       </a>`
                    : ""
                }

                <button class="purchased-wishlist" data-id="${item.id}">
                    ✓ Purchased
                </button>
            </div>

            <button class="delete-wishlist" data-id="${item.id}">
                🗑️
            </button>
        `;

        wishlistList.appendChild(card);


        // Purchased button

        card.querySelector(".purchased-wishlist")
            .addEventListener("click", function () {

                wishlistItems =
                    wishlistItems.map(function (wishlistItem) {

                        if (wishlistItem.id === item.id) {
                            wishlistItem.purchased = true;
                        }

                        return wishlistItem;
                    });

                localStorage.setItem(
                    "financeWishlist",
                    JSON.stringify(wishlistItems)
                );

                displayWishlistItems();
                updateWishlistTotal();
            });


        // Delete button

        card.querySelector(".delete-wishlist")
            .addEventListener("click", function () {

                wishlistItems =
                    wishlistItems.filter(function (wishlistItem) {
                        return wishlistItem.id !== item.id;
                    });

                localStorage.setItem(
                    "financeWishlist",
                    JSON.stringify(wishlistItems)
                );

                displayWishlistItems();
                updateWishlistTotal();
            });

    });

}


function updateWishlistTotal() {
    const wishlistCount =
        document.getElementById("wishlistCount");

    const activeWishlistItems =
        wishlistItems.filter(function (item) {
            return item.purchased !== true;
        });

    wishlistCount.textContent =
        activeWishlistItems.length +
        (activeWishlistItems.length === 1 ? " item" : " items");

    const wishlistTotal =
        document.getElementById("wishlistTotal");

    const homeWishlistTotal =
        document.getElementById("homeWishlistTotal");

    const total = wishlistItems
        .filter(function (item) {
            return item.purchased !== true;
        })
        .reduce(function (sum, item) {
            return sum + Number(item.price);
        }, 0);

    wishlistTotal.textContent =
        "₹" + total.toFixed(2);

    if (homeWishlistTotal) {
        homeWishlistTotal.textContent =
            "₹" + total.toFixed(2);
    }   
}
displayWishlistItems();
updateWishlistTotal();
const viewWishlistButton =
    document.getElementById("viewWishlistButton");

viewWishlistButton.addEventListener("click", function () {

    homeSection.style.setProperty("display", "none", "important");
    historySection.style.setProperty("display", "none", "important");
    owedSection.style.setProperty("display", "none", "important");
    categoriesSection.style.setProperty("display", "none", "important");

    wishlistSection.style.setProperty("display", "block", "important");

    homeButton.classList.remove("active");
    historyButton.classList.remove("active");
    moreButton.classList.remove("active");
    statsButton.classList.remove("active");
    wishlistButton.classList.add("active");

    displayWishlistItems();
    updateWishlistTotal();

    window.scrollTo(0, 0);
});
// =========================
// BACKUP & RESTORE
// =========================

const exportBackupBtn =
    document.getElementById("exportBackupBtn");

exportBackupBtn.addEventListener("click", function () {

    const backupData = {

        accounts: JSON.parse(
            localStorage.getItem("financeAccounts")
        ) || {
            acc1: 0,
            acc2: 0,
            cash: 0
        },

        transactions: JSON.parse(
            localStorage.getItem("financeTransactions")
        ) || [],

        owed: JSON.parse(
            localStorage.getItem("financeOwed")
        ) || [],

        wishlist: JSON.parse(
            localStorage.getItem("financeWishlist")
        ) || []
    };

    const backupJSON =
        JSON.stringify(backupData, null, 2);

    const blob =
        new Blob([backupJSON], {
            type: "application/json"
        });

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "finance-notebook-backup.json";

    link.click();

    URL.revokeObjectURL(url);

    alert("Backup exported successfully!");
});
// =========================
// IMPORT / RESTORE BACKUP
// =========================

const importBackupInput =
    document.getElementById("importBackupInput");

const importBackupBtn =
    document.getElementById("importBackupBtn");

importBackupBtn.addEventListener("click", function () {

    const file = importBackupInput.files[0];

    if (!file) {
        alert("Please select a backup file first.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {

        try {

            const backupData =
                JSON.parse(event.target.result);

            localStorage.setItem(
                "financeAccounts",
                JSON.stringify(backupData.accounts || {
                    acc1: 0,
                    acc2: 0,
                    cash: 0
                })
            );

            localStorage.setItem(
                "financeTransactions",
                JSON.stringify(
                    backupData.transactions || []
                )
            );

            localStorage.setItem(
                "financeOwed",
                JSON.stringify(
                    backupData.owed || []
                )
            );

            localStorage.setItem(
                "financeWishlist",
                JSON.stringify(
                    backupData.wishlist || []
                )
            );

            alert("Backup restored successfully!");

            location.reload();

        } catch (error) {

            alert(
                "Invalid backup file. Please select a valid Finance Notebook backup."
            );

        }

    };

    reader.readAsText(file);

});
// =========================
// PIN SETUP
// =========================

const pinInput =
    document.getElementById("pinInput");

const confirmPinInput =
    document.getElementById("confirmPinInput");

const savePinBtn =
    document.getElementById("savePinBtn");

savePinBtn.addEventListener("click", function () {

    const pin = pinInput.value.trim();
    const confirmPin = confirmPinInput.value.trim();

    if (pin === "" || confirmPin === "") {
        alert("Please enter and confirm your PIN.");
        return;
    }

    if (!/^\d{4,6}$/.test(pin)) {
        alert("PIN must contain 4 to 6 digits.");
        return;
    }

    if (pin !== confirmPin) {
        alert("PINs do not match.");
        return;
    }

    localStorage.setItem("financePIN", pin);

    alert("PIN saved successfully!");

    pinInput.value = "";
    confirmPinInput.value = "";
});
// =========================
// OPEN PRIVACY / PIN SECTION
// =========================

const openPinButton =
    document.getElementById("openPinButton");

const pinSection =
    document.getElementById("pinSection");

openPinButton.addEventListener("click", function () {

    hideAllSections();

    pinSection.style.setProperty("display", "block", "important");

    window.scrollTo(0, 0);
});
// =========================
// STARTUP PIN LOCK
// =========================

const savedPIN =
    localStorage.getItem("financePIN");

if (savedPIN) {

    const lockScreen =
        document.createElement("div");

    lockScreen.id = "lockScreen";

    lockScreen.innerHTML = `
        <div class="lock-card">

            <h2>🔐 Finance Notebook</h2>

            <p>Enter your PIN to continue</p>

            <input
                type="password"
                id="unlockPIN"
                inputmode="numeric"
                maxlength="6"
                placeholder="Enter PIN"
            >

            <button id="unlockButton">
                🔓 Unlock
            </button>

        </div>
    `;

    document.body.appendChild(lockScreen);

    document.body.style.overflow = "hidden";

    document
        .getElementById("unlockButton")
        .addEventListener("click", function () {

            const enteredPIN =
                document.getElementById("unlockPIN").value;

            if (enteredPIN === savedPIN) {

                lockScreen.remove();

                document.body.style.overflow = "";

            } else {

                alert("Incorrect PIN.");

                document.getElementById("unlockPIN").value = "";
            }
        });
}
// =========================
// FIX PAGE NAVIGATION
// =========================

function hideAllSections() {

    homeSection.style.setProperty("display", "none", "important");
    historySection.style.setProperty("display", "none", "important");
    owedSection.style.setProperty("display", "none", "important");
    categoriesSection.style.setProperty("display", "none", "important");
    wishlistSection.style.setProperty("display", "none", "important");
    statisticsSection.style.setProperty("display", "none", "important");
    backupSection.style.setProperty("display", "none", "important");
    pinSection.style.setProperty("display", "none", "important");
}
// =========================
// HOME - VIEW ALL HISTORY
// =========================

const viewHistoryButton =
    document.getElementById("viewHistoryButton");

viewHistoryButton.addEventListener("click", function () {

    hideAllSections();

    historySection.style.setProperty("display", "block", "important");

    homeButton.classList.remove("active");
    statsButton.classList.remove("active");
    wishlistButton.classList.remove("active");
    moreButton.classList.remove("active");
    historyButton.classList.add("active");

    displayTransactionHistory();

    window.scrollTo(0, 0);
});
