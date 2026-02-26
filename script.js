const minutesInput = document.getElementById('minutesInput');
const timerDisplay = document.getElementById('timerDisplay');
const timeMessage = document.getElementById('timeMessage');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

let intervalId = null;
let remainingSeconds = toSeconds(minutesInput.value);

function sanitizeMinutes(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }
  return Math.floor(parsed);
}

function toSeconds(minutesValue) {
  return sanitizeMinutes(minutesValue) * 60;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsPart = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secondsPart).padStart(2, '0')}`;
}

function render() {
  timerDisplay.textContent = formatTime(remainingSeconds);
}

function clearRunningInterval() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function showTimeMessage(show) {
  timeMessage.hidden = !show;
}

function startTimer() {
  if (intervalId !== null) {
    return;
  }

  if (remainingSeconds === 0) {
    remainingSeconds = toSeconds(minutesInput.value);
    render();
  }

  showTimeMessage(false);

  intervalId = setInterval(() => {
    if (remainingSeconds > 0) {
      remainingSeconds -= 1;
      render();
    }

    if (remainingSeconds === 0) {
      clearRunningInterval();
      showTimeMessage(true);
    }
  }, 1000);
}

function pauseTimer() {
  clearRunningInterval();
}

function resetTimer() {
  clearRunningInterval();
  const safeMinutes = sanitizeMinutes(minutesInput.value);
  minutesInput.value = String(safeMinutes);
  remainingSeconds = safeMinutes * 60;
  showTimeMessage(false);
  render();
}

minutesInput.addEventListener('change', () => {
  const safeMinutes = sanitizeMinutes(minutesInput.value);
  minutesInput.value = String(safeMinutes);

  if (intervalId === null) {
    remainingSeconds = safeMinutes * 60;
    showTimeMessage(false);
    render();
  }
});

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

resetTimer();
