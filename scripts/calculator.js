const displayEl = document.getElementById("display");
const historyEl = document.getElementById("history");
const keypadEl = document.querySelector(".keypad");

let currentInput = "0";

let hasDecimal = false;

let firstNumber = null;

let pendingOperator = null;

let waitingForSecondNumber = false;

const MAX_LENGTH = 14;

function setDisplay(text) {
  displayEl.textContent = text;
}

function setHistory(text) {
  historyEl.textContent = text;
}

function formatForDisplay(number) {
  const text = String(number);
  if(text.length <= MAX_LENGTH) return text;
  return Number(number).toExponential(6);
}

function resetInputFlagsFromText(text) {
  hasDecimal = text.includes(".");
}

function clearAll() {
  currentInput = "0";
  hasDecimal = false;
  firstNumber = null;
  pendingOperator = null;
  waitingForSecondNumber = null;

  setDisplay(currentInput);
  setHistory("");
}

function startNewNumberIfNeeded() {
  if(!waitingForSecondNumber) return;

  currentInput = '0';
  hasDecimal = false;
  waitingForSecondNumber = false;
}

function appendDigit(digit) {

  startNewNumberIfNeeded();

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
  startNewNumberIfNeeded();
  if (hasDecimal) return;

  if(currentInput.length >= MAX_LENGTH) return;

  currentInput += '.';
  hasDecimal = true;

  setDisplay(currentInput);
  setHistory('Typing...')
}

function deleteOne() {
  startNewNumberIfNeeded();
   if(currentInput.length <= 1){
    currentInput = '0';
   } else {
    currentInput = currentInput.slice(0, -1);
   }

   resetInputFlagsFromText(currentInput);
   setDisplay(currentInput);
   setHistory('Typing...');
}

function percent() {
  const number = Number(currentInput);
  const result = number / 100;

  currentInput = formatForDisplay(result);
  resetInputFlagsFromText(currentInput);

  setDisplay(currentInput);
  setHistory("Percent");
}

function calculate(a, operator, b) {
  if (operator === "+") return a + b;
  if (operator === "-") return a - b;
  if (operator === "*") return a * b;

  if (operator === "/") {
    if (b === 0) return null; 
    return a / b;
  }

  return null;
}

function operatorSymbol(operator) {
  if (operator === "*") return "×";
  if (operator === "/") return "÷";
  return operator;
}

function chooseOperator(operator) {
  const typedNumber = Number(currentInput);

  if (firstNumber === null) {
    firstNumber = typedNumber;
    pendingOperator = operator;
    waitingForSecondNumber = true;

    setHistory(`${formatForDisplay(firstNumber)} ${operatorSymbol(operator)}`);
    return;
  }

  if (waitingForSecondNumber) {
    pendingOperator = operator;
    setHistory(`${formatForDisplay(firstNumber)} ${operatorSymbol(operator)}`);
    return;
  }

  const result = calculate(firstNumber, pendingOperator, typedNumber);

  if (result === null) {
    setDisplay("Error");
    setHistory("Cannot divide by 0");

    firstNumber = null;
    pendingOperator = null;
    waitingForSecondNumber = false;
    currentInput = "0";
    hasDecimal = false;
    return;
  }

  firstNumber = result;
  pendingOperator = operator;
  waitingForSecondNumber = true;

  const displayText = formatForDisplay(result);
  currentInput = displayText;
  resetInputFlagsFromText(currentInput);

  setDisplay(currentInput);
  setHistory(`${formatForDisplay(firstNumber)} ${operatorSymbol(operator)}`);
}

function equals() {
  if (firstNumber === null || pendingOperator === null) return;
  if (waitingForSecondNumber) return; 

  const secondNumber = Number(currentInput);
  const result = calculate(firstNumber, pendingOperator, secondNumber);

  if (result === null) {
    setDisplay("Error");
    setHistory("Cannot divide by 0");
    clearAll();
    return;
  }

  setHistory(
    `${formatForDisplay(firstNumber)} ${operatorSymbol(pendingOperator)} ${formatForDisplay(secondNumber)} =`
  );

  currentInput = formatForDisplay(result);
  resetInputFlagsFromText(currentInput);

  firstNumber = null;
  pendingOperator = null;
  waitingForSecondNumber = false;

  setDisplay(currentInput);
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

  if(action === 'delete'){
    deleteOne()
    return;
  }

  if(action === 'percent'){
    percent();
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

  if(action === 'operator') {
    chooseOperator(value);
    return;
  }

  if(action === 'equals') {
    equals();
    return;
  }

  setHistory(`Clicked: ${action} ${value}`.trim());
});

/* ===========================
   Step 4: Keyboard support (AZERTY-friendly)
   =========================== */

function getDigitFromEvent(event) {
  // 1) Cas simple: event.key est déjà un chiffre (souvent sur numpad ou clavier US)
  if (event.key >= "0" && event.key <= "9") {
    return event.key;
  }

  // 2) Cas AZERTY: on utilise event.code (la touche physique)
  // Digit1..Digit0 (rangée du haut) + Numpad1..Numpad0
  const code = event.code;

  if (code.startsWith("Digit")) {
    return code.replace("Digit", "");
  }

  if (code.startsWith("Numpad")) {
    const rest = code.replace("Numpad", "");
    if (rest >= "0" && rest <= "9") return rest;
  }

  return null;
}

function handleKeydown(event) {
  const digit = getDigitFromEvent(event);
  if (digit !== null) {
    event.preventDefault();
    appendDigit(digit);
    return;
  }

  if (event.key === "." || event.key === ",") {
    event.preventDefault();
    appendDecimal();
    return;
  }

  if (event.key === "+" || event.key === "-" || event.key === "*" || event.key === "/") {
    event.preventDefault();
    chooseOperator(event.key);
    return;
  }

  if (event.key === "x" || event.key === "X") {
    event.preventDefault();
    chooseOperator("*");
    return;
  }

  if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    equals();
    return;
  }

  if (event.key === "Backspace") {
    event.preventDefault();
    deleteOne();
    return;
  }

  if (event.key === "Escape") {
    event.preventDefault();
    clearAll();
    return;
  }

  if (event.key === "%") {
    event.preventDefault();
    percent();
    return;
  }
}

window.addEventListener("keydown", handleKeydown, true);


setDisplay(currentInput);
setHistory("");