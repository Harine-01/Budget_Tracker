let transactions = JSON.parse(localStorage.getItem("transactions"));
if (!transactions) {
    transactions = [];
}

let chart = null;

/* ADD TRANSACTION */
function addTransaction() {
    let description = document.getElementById("description").value;
    let amount = document.getElementById("amount").value;
    let type = document.getElementById("type").value;

    if (description === "" || amount === "") {
        alert("Please fill all fields");
        return;
    }

    let transaction = {
        id: Date.now(),
        description: description,
        amount: Number(amount),
        type: type
    };

    transactions.push(transaction);
    saveData();

    document.getElementById("description").value = "";
    document.getElementById("amount").value = "";
}

/* DELETE TRANSACTION */
function deleteTransaction(id) {
    for (let i = 0; i < transactions.length; i++) {
        if (transactions[i].id === id) {
            transactions.splice(i, 1);
            break;
        }
    }
    saveData();
}

/* SHOW TRANSACTIONS */
function renderTransactions() {
    let list = document.getElementById("transaction-list");
    let filter = document.getElementById("filter").value;

    list.innerHTML = "";

    let income = 0;
    let expense = 0;

    for (let i = 0; i < transactions.length; i++) {
        let t = transactions[i];

        if (t.type === "income") {
            income += t.amount;
        } else {
            expense += t.amount;
        }

        if (filter !== "all" && filter !== t.type) {
            continue;
        }

        let li = document.createElement("li");
        li.className = "transaction " + t.type;
        li.innerHTML =
            t.description + " - ₹" + t.amount +
            ' <span class="delete" onclick="deleteTransaction(' + t.id + ')">X</span>';

        list.appendChild(li);
    }

    document.getElementById("income").innerText = income;
    document.getElementById("expense").innerText = expense;
    document.getElementById("balance").innerText = income - expense;

    drawChart(income, expense);
}

/* SAVE + RELOAD */
function saveData() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    renderTransactions();
}

/* CHART */
function drawChart(income, expense) {
    let ctx = document.getElementById("budgetChart");

    if (chart !== null) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Income", "Expense"],
            datasets: [{
                data: [income, expense],
                backgroundColor: ["green", "red"]
            }]
        }
    });
}

/* LOAD ON PAGE START */
renderTransactions();
