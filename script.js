const display = document.getElementById("display");
const question = document.getElementById("question");
const startBtn = document.getElementById("starts");
const countdownOverlay = document.getElementById("countdown");
const resultModal = document.getElementById("result");
const modalBackground = document.getElementById("modal-background");

// variables
let userText = "";
let errorCount = 0;
let startTime;
let questionText = "";

// Load and display question
fetch("./texts.json")
    .then((res) => res.json())
    .then((data) => {
        questionText = data[Math.floor(Math.random() * data.length)];
        question.innerHTML = questionText;
    });

// checks the user typed character and displays accordingly
const typeController = (e) => {
    const newLetter = e.key;

    // Handle backspace press
    if (newLetter == "Backspace") {
        userText = userText.slice(0, userText.length - 1);
        return display.removeChild(display.lastChild);
    }

    // these are the valid character we are allowing to type
    const validLetters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890!@#$%^&*()_+-={}[]'\".,?";

    // if it is not a valid character like Control/Alt then skip displaying anything
    if (!validLetters.includes(newLetter)) {
        return;
    }

    userText += newLetter;

    const newLetterCorrect = validate(newLetter);

    if (newLetterCorrect) {
        display.innerHTML += `<span class="green">${newLetter === " " ? "▪" : newLetter}</span>`;
    } else {
        display.innerHTML += `<span class="red">${newLetter === " " ? "▪" : newLetter}</span>`;
        errorCount++;
    }

    // check if given question text is equal to user typed text
    if (questionText === userText) {
        gameOver();
    }
};

const validate = (key) => {
    if (key === questionText[userText.length - 1]) {
        return true;
    }
    return false;
};

// FINISHED TYPING
const gameOver = () => {
    document.removeEventListener("keydown", typeController);
    // the current time is the finish time
    // so total time taken is current time - start time
    const finishTime = new Date().getTime();
    const timeTaken = (finishTime - startTime) / 1000;
    const timeTakenDecimal = timeTaken.toFixed();

    // type Speed Feed Back
    const massage = typeSpeedFeedBack(questionText.length, timeTakenDecimal);

    // show result modal
    resultModal.innerHTML = "";
    resultModal.classList.toggle("hidden");
    modalBackground.style.display = "flex";
    // clear user text
    display.innerHTML = "";
    // make it inactive
    display.classList.add("inactive");
    // show result
    resultModal.innerHTML += `
        <h1>Finished!</h1>
        <p>You took: <span class="bold">${timeTakenDecimal}</span> seconds</p>
        <p>You made <span class="bold red">${errorCount}</span> mistakes</p>
        <p style="margin-bottom: 8px"><span class="bold">Feedback : </span>${massage}</p>
        <button onclick="closeModal()">Close</button>
    `;

    addHistory(questionText, timeTakenDecimal, errorCount);

    // restart everything
    startTime = null;
    errorCount = 0;
    userText = "";
    display.classList.add("inactive");
};

const closeModal = () => {
    modalBackground.style.display = "none";
    resultModal.classList.toggle("hidden");
};

const start = () => {
    // If already started, do not start again
    if (startTime) return;

    let count = 3;
    countdownOverlay.style.display = "flex";

    const startCountdown = setInterval(() => {
        countdownOverlay.innerHTML = `<h1>${count}</h1>`;

        // finished timer
        if (count == 0) {
            // -------------- START TYPING -----------------
            document.addEventListener("keydown", typeController);
            countdownOverlay.style.display = "none";
            display.classList.remove("inactive");

            clearInterval(startCountdown);
            startTime = new Date().getTime();
        }
        count--;
    }, 1000);
};

// START Countdown
startBtn.addEventListener("click", start);

// If history exists, show it
displayHistory();

// Show typing time spent
setInterval(() => {
    const currentTime = new Date().getTime();
    const timeSpent = (currentTime - startTime) / 1000;
    const timeSpentDecimal = timeSpent.toFixed();
    document.getElementById("show-time").innerHTML = `${startTime ? timeSpentDecimal : 0} seconds`;
}, 1000);

// Type Speed Feedback
const typeSpeedFeedBack = (sentenceLength, seconds) => {
    const sentenceLengthHalf = sentenceLength / 2;
    if (sentenceLengthHalf >= seconds) {
        const massage = "You done A great Job";
        return massage;
    } else if (sentenceLength >= seconds) {
        const massage = "Nice ! Keep Practice";
        return massage;
    } else {
        const massage = "Keep trying will improve";
        return massage;
    }
};
