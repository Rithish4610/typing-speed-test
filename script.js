
const texts = {
    easy: [
        "The quick brown fox jumps over the lazy dog.",
        "Typing is fun and easy to learn."
    ],
    medium: [
        "JavaScript is a versatile programming language used for web development.",
        "Artificial Intelligence and Machine Learning are changing the world."
    ],
    hard: [
        "Developing interactive web applications requires knowledge of HTML, CSS, and JavaScript.",
        "Optimizing code and algorithms ensures better performance and user experience."
    ]
};

const textToTypeElem = document.getElementById('text-to-type');
const inputText = document.getElementById('input-text');
const timeDisplay = document.getElementById('time');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const streakDisplay = document.getElementById('streak');
const restartBtn = document.getElementById('restart');
const difficultySelect = document.getElementById('difficulty');
const toggleThemeBtn = document.getElementById('toggle-theme');

let timerInterval;
let timeLeft = 60;
let streak = 0;
let currentText = "";

// Pick random text based on difficulty
function setRandomText() {
    const level = difficultySelect.value;
    const arr = texts[level];
    currentText = arr[Math.floor(Math.random() * arr.length)];
    textToTypeElem.innerHTML = "";
    currentText.split("").forEach(char => {
        const span = document.createElement("span");
        span.innerText = char;
        textToTypeElem.appendChild(span);
    });
}

// Start Timer
function startTimer() {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
        timeLeft--;
        timeDisplay.innerText = timeLeft;
        calculateWPM();
        calculateAccuracy();
        if (timeLeft <= 0) endTest();
    }, 1000);
}

// Calculate WPM
function calculateWPM() {
    const wordsTyped = inputText.value.trim().split(/\s+/).length;
    const minutes = (60 - timeLeft) / 60;
    const wpm = minutes > 0 ? Math.floor(wordsTyped / minutes) : 0;
    wpmDisplay.innerText = wpm;
}

// Calculate Accuracy + Highlight
function calculateAccuracy() {
    const typed = inputText.value;
    const spans = textToTypeElem.querySelectorAll("span");
    let correctChars = 0;

    spans.forEach((span, idx) => {
        const char = typed[idx];
        if (char == null) {
            span.classList.remove("correct", "wrong");
        } else if (char === span.innerText) {
            span.classList.add("correct");
            span.classList.remove("wrong");
            correctChars++;
        } else {
            span.classList.add("wrong");
            span.classList.remove("correct");
        }
    });

    const accuracy = typed.length > 0 ? Math.floor((correctChars / typed.length) * 100) : 0;
    accuracyDisplay.innerText = accuracy;
}

// End Test
function endTest() {
    clearInterval(timerInterval);
    timerInterval = null;
    if (wpmDisplay.innerText > streak) streak = wpmDisplay.innerText;
    streakDisplay.innerText = streak;
}

// Event Listeners
inputText.addEventListener('focus', startTimer);
restartBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = 60;
    timeDisplay.innerText = timeLeft;
    wpmDisplay.innerText = 0;
    accuracyDisplay.innerText = 0;
    inputText.value = "";
    setRandomText();
});
difficultySelect.addEventListener('change', setRandomText);

// Dark/Light Mode
toggleThemeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    toggleThemeBtn.innerText = document.body.classList.contains('dark') ? "☀️ Light Mode" : "🌙 Dark Mode";
});

// Initialize
setRandomText();
