const textToType = document.getElementById('text-to-type').innerText;
const inputText = document.getElementById('input-text');
const timeDisplay = document.getElementById('time');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const restartBtn = document.getElementById('restart');

let startTime;
let timerInterval;

function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((new Date() - startTime) / 1000);
        timeDisplay.innerText = elapsed;
        calculateWPM(elapsed);
        calculateAccuracy();
    }, 1000);
}

function calculateWPM(elapsed) {
    const wordsTyped = inputText.value.trim().split(/\s+/).length;
    const minutes = elapsed / 60;
    const wpm = minutes > 0 ? Math.floor(wordsTyped / minutes) : 0;
    wpmDisplay.innerText = wpm;
}

function calculateAccuracy() {
    const typed = inputText.value;
    let correctChars = 0;
    for (let i = 0; i < typed.length; i++) {
        if (typed[i] === textToType[i]) correctChars++;
    }
    const accuracy = typed.length > 0 ? Math.floor((correctChars / typed.length) * 100) : 0;
    accuracyDisplay.innerText = accuracy;
}

inputText.addEventListener('focus', () => {
    if (!timerInterval) startTimer();
});

restartBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    inputText.value = '';
    timeDisplay.innerText = 0;
    wpmDisplay.innerText = 0;
    accuracyDisplay.innerText = 0;
});
