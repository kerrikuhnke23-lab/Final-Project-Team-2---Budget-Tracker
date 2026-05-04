const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const list = document.getElementById("list");
const form = document.getElementById("form");
const clearBtn = document.getElementById("clearAll");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

let barChart, pieChart;

function save() {
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
        ${t.text} (${t.category}) - ${t.date}: $${t.amount}
      </span>
      <button onclick="deleteTransaction(${index})">x</button>
    `;
    list.appendChild(li);
  });

  balance.textContent = total.toFixed(2);
  income.textContent = inc.toFixed(2);
  expense.textContent = Math.abs(exp).toFixed(2);

  updateCharts();
  renderCategories();
  save();
}

function deleteTransaction(index) {
  transactions.splice(index, 1);
  updateUI();
}

clearBtn.addEventListener("click", () => {
  transactions = [];
  updateUI();
});

form.addEventListener("submit", e => {
  e.preventDefault();

  const text = document.getElementById("text").value;
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;
  const amount = +document.getElementById("amount").value;

  transactions.push({ text, category, date, amount });

  form.reset();
  updateUI();
});

function updateCharts() {
  if (barChart) barChart.destroy();
  if (pieChart) pieChart.destroy();

  const inc = transactions.filter(t => t.amount > 0)
                          .reduce((a,b) => a + b.amount, 0);

  const exp = transactions.filter(t => t.amount < 0)
                          .reduce((a,b) => a + b.amount, 0);

  // Bar chart
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

  // Pie chart by category
  const categories = {};
  transactions.filter(t => t.amount < 0).forEach(t => {
    categories[t.category] = (categories[t.category] || 0) + Math.abs(t.amount);
  });

  pieChart = new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
      labels: Object.keys(categories),
      datasets: [{
        data: Object.values(categories),
        backgroundColor: ["#ff6384","#36a2eb","#ffce56","#4bc0c0","#9966ff"]
      }]
    }
  });
}
function renderCategories() {
  const container = document.getElementById("categoryBreakdown");
  container.innerHTML = "";

  const categories = {};

  transactions.forEach(t => {
    if (t.amount < 0) {
      categories[t.category] = (categories[t.category] || 0) + Math.abs(t.amount);
    }
  });

  Object.keys(categories).forEach(cat => {
    const value = categories[cat];

    const div = document.createElement("div");
    div.classList.add("category");

    div.innerHTML = `
      <h3>${cat} - $${value}</h3>
      <div class="progress-bar">
        <div class="progress" style="width:${Math.min(value, 100)}%"></div>
      </div>
    `;

    container.appendChild(div);
  });
}
updateUI();
