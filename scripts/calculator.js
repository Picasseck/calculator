const displayEl = document.getElementById("display");
const historyEl = document.getElementById("history");
const keypadEl = document.querySelector(".keypad");

let currentInput = "0";

let hasDecimal = false;

const MAX_LENGTH = 14;

function setDisplay(text) {
  displayEl.textContent = text;
}

function setHistory(text) {
  historyEl.textContent = text;
}

function clearAll() {
  currentInput = "0";
  hasDecimal = false;
  setDisplay(currentInput);
  setHistory("");
}

function appendDigit(digit) {

  if(currentInput.length >= MAX_LENGTH)
    return;

  if(currentInput === '0') {
    currentInput = digit;
  } else {
    currentInput += digit;
  }

  setDisplay(currentInput);
  setHistory('Typing...')
}

function appendDecimal() {
  if (hasDecimal) return;

  if(currentInput.length >= MAX_LENGTH) return;

  currentInput += '.';
  hasDecimal = true;

  setDisplay(currentInput);
  setHistory('Typing...')
}

keypadEl.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const action = button.dataset.action;
  const value = button.dataset.value;

  if(action === 'clear') {
    clearAll();
    return;
  }

  if(action === 'digit'){
    appendDigit(value);
    return;
  }

  if(action === 'decimal') {
    appendDecimal();
    return;
  }

  setHistory(`Clicked: ${action} ${value}`.trim());
});

setDisplay(currentInput);
setHistory("");