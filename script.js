

// Sentences by difficulty
const sentences = {
    easy: [
        "The quick brown fox jumps over the lazy dog.",
        "Typing is fun and easy to learn.",
        "Practice makes perfect.",
        "I love to code every day.",
        "Keep learning new things.",
        "This game improves your typing speed.",
        "Good habits make a good programmer.",
        "Focus on accuracy first.",
        "Small steps lead to big results.",
        "Consistency is the key to success.",
        "Never give up on coding challenges."
    ],
    medium: [
        "JavaScript is a versatile programming language used for web development.",
        "Artificial Intelligence and Machine Learning are changing the world.",
        "Building small projects improves your coding skills.",
        "Debugging code requires patience and logic.",
        "Web development involves HTML, CSS, and JavaScript.",
        "Practicing algorithms enhances problem-solving ability.",
        "Time management is essential for a programmer.",
        "Always test your code before submission.",
        "Version control with Git helps track changes effectively.",
        "Learning new frameworks keeps your skills up to date.",
        "Clean code is easier to read and maintain."
    ],
    hard: [
        "Developing interactive web applications requires knowledge of HTML, CSS, and JavaScript.",
        "Optimizing code and algorithms ensures better performance and user experience.",
        "Consistently practicing programming challenges strengthens problem-solving skills.",
        "Understanding data structures deeply improves software efficiency.",
        "Complex projects require careful planning and teamwork.",
        "Debugging intricate systems requires analytical thinking and patience.",
        "Refactoring legacy code is often more challenging than writing new code.",
        "Advanced algorithms like dynamic programming solve complex problems efficiently.",
        "Version control workflows like Git branching improve collaborative development.",
        "Learning multiple programming paradigms expands a developer's versatility.",
        "Software engineering principles guide developers to write maintainable and scalable code."
    ]
};

// DOM Elements
const textElem = document.getElementById('text-to-type');
const inputText = document.getElementById('input-text');
const timeDisplay = document.getElementById('time');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const streakDisplay = document.getElementById('streak');
const sentenceNumberDisplay = document.getElementById('sentence-number');
const totalSentencesDisplay = document.getElementById('total-sentences');

const submitBtn = document.getElementById('submit');
const restartBtn = document.getElementById('restart');
const difficultySelect = document.getElementById('difficulty');
const toggleThemeBtn = document.getElementById('toggle-theme');
const ratingStars = document.getElementById('rating-stars');
// Show star rating based on accuracy
function showRating(accuracy) {
    ratingStars.innerHTML = ""; // Clear previous stars
    let stars = 0;
    if (accuracy >= 81) stars = 5;
    else if (accuracy >= 61) stars = 4;
    else if (accuracy >= 41) stars = 3;
    else if (accuracy >= 21) stars = 2;
    else stars = 1;
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.classList.add('star');
        star.innerHTML = '★';
        if (i <= stars) star.classList.add('filled');
        ratingStars.appendChild(star);
    }
}

// Game variables
let currentSentenceIndex = 0;
let currentSentences = [];
let currentText = "";
let streak = 0;
let startTime;
let timerInterval;

// Initialize Game
function initGame() {
    const level = difficultySelect.value;
    currentSentences = [...sentences[level]]; // copy array
    currentSentenceIndex = 0;
    streak = 0;
    streakDisplay.innerText = streak;
    timeDisplay.innerText = 0;
    wpmDisplay.innerText = 0;
    accuracyDisplay.innerText = 0;
    sentenceNumberDisplay.innerText = currentSentenceIndex + 1;
    totalSentencesDisplay.innerText = currentSentences.length;
    setSentence();
    inputText.value = "";
    clearInterval(timerInterval);
    timerInterval = null;
}

// Set Current Sentence
function setSentence() {
    currentText = currentSentences[currentSentenceIndex];
    textElem.innerHTML = "";
    currentText.split("").forEach(char => {
        const span = document.createElement("span");
        span.innerText = char;
        textElem.appendChild(span);
    });
}

// Start Timer
function startTimer() {
    if (timerInterval) return;
    startTime = new Date();
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((new Date() - startTime) / 1000);
        timeDisplay.innerText = elapsed;
        calculateWPM(elapsed);
        calculateAccuracy();
    }, 1000);
}

// Calculate WPM
function calculateWPM(elapsed) {
    const wordsTyped = inputText.value.trim().split(/\s+/).length;
    const minutes = elapsed / 60;
    const wpm = minutes > 0 ? Math.floor(wordsTyped / minutes) : 0;
    wpmDisplay.innerText = wpm;
}

// Calculate Accuracy + Highlight
function calculateAccuracy() {
    const typed = inputText.value;
    const spans = textElem.querySelectorAll("span");
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

// Submit Sentence
submitBtn.addEventListener('click', () => {
    calculateAccuracy();
    calculateWPM(Math.floor((new Date() - startTime)/1000));
    const accuracy = parseInt(accuracyDisplay.innerText);
    showRating(accuracy); // Show stars based on accuracy
    streak = Math.max(streak, parseInt(wpmDisplay.innerText));
    streakDisplay.innerText = streak;
    inputText.value = "";
    currentSentenceIndex++;
    if (currentSentenceIndex >= currentSentences.length) {
        alert("🎉 All sentences completed! Your best WPM: " + streak);
        clearInterval(timerInterval);
    } else {
        setSentence();
        sentenceNumberDisplay.innerText = currentSentenceIndex + 1;
    }
});

// Input focus starts timer
inputText.addEventListener('focus', startTimer);

// Restart Game
restartBtn.addEventListener('click', initGame);
difficultySelect.addEventListener('change', initGame);

// Dark/Light Mode
toggleThemeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    toggleThemeBtn.innerText = document.body.classList.contains('dark') ? "☀️ Light Mode" : "🌙 Dark Mode";
});

// Initialize on load
initGame();
