const displayEl = document.getElementById("display");
const historyEl = document.getElementById("history");
const keypadEl = document.querySelector(".keypad");

function setDisplay(text) {
  displayEl.textContent = text;
}

function setHistory(text) {
  historyEl.textContent = text;
}

keypadEl.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const action = button.dataset.action || "unknown";
  const value = button.dataset.value || "";

  setHistory(`Clicked: ${action} ${value}`.trim());
});

setDisplay("0");
setHistory("");