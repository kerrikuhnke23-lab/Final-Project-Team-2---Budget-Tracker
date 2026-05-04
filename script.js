const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const list = document.getElementById("list");
const form = document.getElementById("form");

let transactions = [];

function updateUI() {
  let total = 0, inc = 0, exp = 0;

  list.innerHTML = "";

  transactions.forEach((t, index) => {
    total += t.amount;

    if (t.amount > 0) inc += t.amount;
    else exp += t.amount;

    const li = document.createElement("li");
    li.innerHTML = `
      ${t.text}: $${t.amount}
      <button onclick="deleteTransaction(${index})">x</button>
    `;
    list.appendChild(li);
  });

  balance.textContent = total;
  income.textContent = inc;
  expense.textContent = Math.abs(exp);
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
