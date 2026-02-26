# Countdown Timer

A simple countdown timer built with plain HTML, CSS, and JavaScript.

## Files
- `index.html`
- `styles.css`
- `script.js`

## Features
- Minutes input (default: `5`)
- Timer display in `MM:SS` format
- **Start**, **Pause**, and **Reset** buttons
- Protection against multiple active intervals (prevents double-speed countdown)
- Stops at `0:00` and shows a subtle **Time!** message
- Optional completion beep (Web Audio API) with **Sound** On/Off toggle persisted in `localStorage`
- Optional desktop notification on completion after manual permission via **Enable Notifications**

## Usage
1. Open `index.html` in a browser.
2. Enter the number of minutes.
3. Click **Start** to begin.
4. Use **Pause** to stop temporarily.
5. Use **Reset** to return to the selected minutes.

## Sound and notifications
- **Sound**: Use the Sound checkbox to enable/disable the completion beep. The setting is saved for future visits.
- **Notifications**: Click **Enable Notifications** to request permission (only on click). The status label shows whether notifications are enabled, blocked, or unavailable. If allowed, you'll get `Time!` notification with `Your timer finished.` when the timer completes.
