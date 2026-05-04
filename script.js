const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const list = document.getElementById("list");
const form = document.getElementById("form");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

let barChart, pieChart;

function saveToLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function updateUI() {
  let total = 0, inc = 0, exp = 0;
  list.innerHTML = "";

  transactions.forEach((t, index) => {
    total += t.amount;
    if (t.amount > 0) inc += t.amount;
    else exp += t.amount;

    const li = document.createElement("li");
    li.innerHTML = `
      <span class="${t.amount > 0 ? 'income-text' : 'expense-text'}">
        ${t.text}: $${t.amount}
      </span>
      <button onclick="deleteTransaction(${index})">x</button>
    `;
    list.appendChild(li);
  });

  balance.textContent = total.toFixed(2);
  income.textContent = inc.toFixed(2);
  expense.textContent = Math.abs(exp).toFixed(2);

  updateCharts(inc, exp);
  saveToLocalStorage();
}

function deleteTransaction(index) {
  transactions.splice(index, 1);
  updateUI();
}

form.addEventListener("submit", e => {
  e.preventDefault();

  const text = document.getElementById("text").value;
  const amount = +document.getElementById("amount").value;

  transactions.push({ text, amount });

  form.reset();
  updateUI();
});

function updateCharts(inc, exp) {
  if (barChart) barChart.destroy();
  if (pieChart) pieChart.destroy();

  // Bar Chart
  barChart = new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels: ["Income", "Expenses"],
      datasets: [{
        data: [inc, Math.abs(exp)],
        backgroundColor: ["green", "red"]
      }]
    }
  });

  // Pie Chart (expenses only)
  const expenseItems = transactions.filter(t => t.amount < 0);
  const labels = expenseItems.map(t => t.text);
  const data = expenseItems.map(t => Math.abs(t.amount));

  pieChart = new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          "#ff6384","#36a2eb","#ffce56","#4bc0c0","#9966ff"
        ]
      }]
    }
  });
}

updateUI();
