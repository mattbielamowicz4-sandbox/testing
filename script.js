const minutesInput = document.getElementById('minutesInput');
const timerDisplay = document.getElementById('timerDisplay');
const timeMessage = document.getElementById('timeMessage');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const soundToggle = document.getElementById('soundToggle');
const enableNotificationsBtn = document.getElementById('enableNotificationsBtn');
const notificationStatus = document.getElementById('notificationStatus');

const SOUND_STORAGE_KEY = 'timerSoundEnabled';

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


function loadSoundPreference() {
  const stored = localStorage.getItem(SOUND_STORAGE_KEY);
  if (stored === null) {
    soundToggle.checked = true;
    return;
  }
  soundToggle.checked = stored === 'true';
}

function persistSoundPreference() {
  localStorage.setItem(SOUND_STORAGE_KEY, String(soundToggle.checked));
}

function playCompletionBeep() {
  if (!soundToggle.checked || typeof AudioContext === 'undefined') {
    return;
  }

  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.value = 880;
  gain.gain.value = 0.0001;

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  const now = audioContext.currentTime;
  gain.gain.exponentialRampToValueAtTime(0.04, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

  oscillator.start(now);
  oscillator.stop(now + 0.2);
  oscillator.onended = () => {
    audioContext.close();
  };
}

function updateNotificationStatus() {
  if (!('Notification' in window)) {
    notificationStatus.textContent = 'Notifications: Unavailable in this browser';
    enableNotificationsBtn.disabled = true;
    return;
  }

  if (Notification.permission === 'granted') {
    notificationStatus.textContent = 'Notifications: Enabled';
    return;
  }

  if (Notification.permission === 'denied') {
    notificationStatus.textContent = 'Notifications: Blocked';
    return;
  }

  notificationStatus.textContent = 'Notifications: Not enabled';
}

async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    updateNotificationStatus();
    return;
  }

  try {
    await Notification.requestPermission();
  } finally {
    updateNotificationStatus();
  }
}

function notifyCompletion() {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  try {
    new Notification('Time!', { body: 'Your timer finished.' });
  } catch (_error) {
    // Graceful fallback: ignore notification errors.
  }
}

function triggerCompletionAlerts() {
  playCompletionBeep();
  notifyCompletion();
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
      triggerCompletionAlerts();
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

soundToggle.addEventListener('change', persistSoundPreference);
enableNotificationsBtn.addEventListener('click', requestNotificationPermission);
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

loadSoundPreference();
updateNotificationStatus();
resetTimer();
