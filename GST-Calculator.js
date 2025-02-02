const display = document.getElementById('display');
const historyContainer = document.getElementById('history');
let history = JSON.parse(localStorage.getItem('history')) || [];
let cursorPosition = display.value.length;

function appendNumber(number) {
  const beforeCursor = display.value.slice(0, cursorPosition);
  const afterCursor = display.value.slice(cursorPosition);
  display.value = beforeCursor + number + afterCursor;
  cursorPosition++;
}

function clearDisplay() {
  display.value = '';
  cursorPosition = 0;
}

function calculateGST(percentage, operation) {
  const amount = parseFloat(display.value);
  if (isNaN(amount)) {
    alert('Please enter a valid number');
    return;
  }
  let gst, total;
  if (operation === 'add') {
    gst = (amount * percentage) / 100;
    total = amount + gst;
  } else if (operation === 'subtract') {
    gst = (amount * percentage) / (100 + percentage);
    total = amount - gst;
  }
  const historyItem = `Amount: ${amount}, GST (${operation === 'add' ? '+' : '-'}${percentage}%): ${gst.toFixed(2)}, Total: ${total.toFixed(2)}`;
  history.push(historyItem);
  localStorage.setItem('history', JSON.stringify(history));
  updateHistory();
  display.value = total.toFixed(2);
  cursorPosition = display.value.length;
}

function calculateResult() {
  try {
    display.value = eval(display.value.replace(/%/g, '/100'));
    cursorPosition = display.value.length;
  } catch (e) {
    alert('Invalid expression');
  }
}

function updateHistory() {
  historyContainer.innerHTML = '';
  history.forEach(item => {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerText = item;
    historyContainer.appendChild(div);
  });
}

function toggleHistory() {
  historyContainer.style.display = historyContainer.style.display === 'none' ? 'block' : 'none';
}

function toggleMode() {
  document.body.classList.toggle('dark-mode');
}

document.addEventListener('keydown', function(event) {
  const key = event.key;
  if (key >= '0' && key <= '9') {
    appendNumber(key);
  } else if (key === '+' || key === '-' || key === '*' || key === '/' || key === '(' || key === ')' || key === '%') {
    appendNumber(key);
  } else if (key === 'Enter') {
    calculateResult();
  } else if (key === 'Backspace') {
    if (cursorPosition > 0) {
      display.value = display.value.slice(0, cursorPosition - 1) + display.value.slice(cursorPosition);
      cursorPosition--;
    }
  } else if (key === 'Escape') {
    clearDisplay();
  } else if (key === 'ArrowLeft') {
    if (cursorPosition > 0) {
      cursorPosition--;
    }
  } else if (key === 'ArrowRight') {
    if (cursorPosition < display.value.length) {
      cursorPosition++;
    }
  }
});

display.addEventListener('mousemove', function(event) {
  const displayRect = display.getBoundingClientRect();
  const relativeX = event.clientX - displayRect.left;
  cursorPosition = Math.min(Math.max(Math.floor(relativeX / (displayRect.width / display.value.length)), 0), display.value.length);
});

updateHistory();