const letters = 'QWERTYUIOPASDFGHJKLZXCVBNM';
const validLengths = [3,4,5,6,7,8,9];
const correctLetterCorrectPositionKB = 'correct-letter-correct-position-KB';
const correctLetterWrongPositionKB = 'correct-letter-wrong-position-KB';
const wrongLetterKB = 'wrong-letter-KB';
let wordLength = 0;
let targetWord = '';
let guesses = [];
let currentGuess = '';
let solving = false;
let solved = false;
const e_options = document.getElementById("options-div");
const e_hint = document.getElementById("hint-div");
const e_keyboard = document.getElementById("keyboard-div");
const e_guess_table_body = document.getElementById("guess-table-body");
e_keyboard.style.display = "none";
window.addEventListener('keydown', (e) => {
    if ((e.key === 'Delete') || (e.key === 'Backspace')) handleDeleteLetter();
    if ((e.key.length === 1) && (letters.includes(e.key.toUpperCase()))) handleInputLetter(e.key.toUpperCase());
    if ((!solving || solved) && (validLengths.includes(parseInt(e.key)))) generatePuzzle(parseInt(e.key));
});

for (let l = 3; l < 10; l++) {
    document.getElementById(`${l}-letter-puzzle`).addEventListener("click", () => generatePuzzle(l));  
}
for (let l = 0; l < 26; l++) {
    document.getElementById(`click-${letters[l]}`).addEventListener("click", () => handleInputLetter(letters[l]));
}
document.getElementById("click-backspace").addEventListener("click", () => handleDeleteLetter());
document.getElementById("show-hint").addEventListener("click", () => showHint());
document.getElementById("explain-colors").addEventListener("click",() => explainColors());

if (isMobileDevice()) {
    e_hint.textContent = "Tap a number to start a new puzzle";
} else {
    document.getElementById("body").classList.add("desktopBody");
    e_hint.classList.add("desktopHint");
    e_hint.textContent = "Click or type a number to start a new puzzle";
    e_keyboard.classList.add("desktopKeyboard");
    document.getElementById("guesses-div").classList.add("desktopGuesses");
}
function generatePuzzle(chosenLength) {
    wordLength = chosenLength;
    e_options.style.display = "none";
    e_hint.textContent = "Picking a random word, hang on...";
    getInfo().then(() => displayInfo());
}

async function getInfo() {
    // Call API to get info
    targetWord = await pickRandomWord(wordLength);
    currentGuess = '';
    guesses = [];
    solving = true;
    solved = false;
    e_keyboard.style.display = "block";
    displayGuesses();
}

function displayInfo() {
    if (isMobileDevice()) {
        e_hint.textContent = "Tap letters below to form your guess";
    } else {
        e_hint.textContent = "Type letters or click letters below to form your guess";
    }
}
function isMobileDevice() {
    if (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)) {
        return true;
    }
    return false;
}
async function handleInputLetter(letter) {
    if (!solving)
    {
        return;
    }
    let saved = currentGuess;
    currentGuess = `${currentGuess}${letter}`;
    if (currentGuess.length === wordLength)
    {
        let valid = await isWordValid(currentGuess);
        if (!valid)
        {
            alert(`${currentGuess} is not in the NWL2023 lexicon`);
            currentGuess = saved;
            displayGuesses();
            return;
        }
        guesses.push(currentGuess);
        if (currentGuess === targetWord)
        {
            e_options.style.display = "block";
            if (isMobileDevice()) {
                e_hint.textContent = `Solved in ${guesses.length} moves ${guesses.length > 5 ? '.' : '!'} Tap a number to replay.`;
            } else {
                e_hint.textContent = `Solved in ${guesses.length} moves ${guesses.length > 5 ? '.' : '!'} Click or type a number to replay.`;
            }
            e_keyboard.style.display = "none";
            solved = true;
            solving = false;
        }
        currentGuess = '';
    }
    displayGuesses();
}
function handleDeleteLetter() {
    if (!solving)
    {
        return;
    }
    if (currentGuess.length === 0)
    {
        return;
    }
    currentGuess = currentGuess.substring(0,currentGuess.length - 1);
    displayGuesses();
}

function displayGuesses()
{
    e_guess_table_body.innerHTML = ''; // Clear previous
    // Clear keyboard special colours
    for (let l = 0; l < 26; l++) {
        let e = document.getElementById(`click-${letters[l]}`);
        e.classList.remove(correctLetterCorrectPositionKB);
        e.classList.remove(correctLetterWrongPositionKB);
        e.classList.remove(wrongLetterKB);
    }

    if (currentGuess.length > 0)
    {
        displayGuess(currentGuess);
    }
    for(let i = guesses.length - 1; i > -1; i--)
    {
        displayGuess(guesses[i]);
    }
}
function displayGuess(display_guess)
{
    let e_guess_row = document.createElement("tr");
    e_guess_row.classList.add("guess-row");
    for(let i = 0; i < wordLength; i++)
    {
        let e_guess_col = document.createElement("td");
        e_guess_col.classList.add("guess-col");
        if (i < display_guess.length)
        {
            e_guess_col.classList.add(calcLetterStyle(display_guess, i));
            e_guess_col.textContent = display_guess[i];
        } else {
            e_guess_col.classList.add('unguessedColumn');
            e_guess_col.textContent = '?';
        }
        e_guess_row.appendChild(e_guess_col);
    }
    e_guess_table_body.appendChild(e_guess_row);
}
function calcLetterStyle(guessLetters, guessLetterIndex) {
    if (guessLetters.length < wordLength)
    {
        return "undetermined";
    }
    let letter = guessLetters[guessLetterIndex];
    let e = document.getElementById(`click-${letter}`); // The element for the letter on the ekyboard
    // guessLetters is the whole guess, guessLetterIndex is the letter index for which we want the css style name
    if (letter === targetWord[guessLetterIndex]) {
        e.classList.add(correctLetterCorrectPositionKB);
        return "correct-letter-correct-position";
    }
    if (targetWord.indexOf(letter) > -1) {
        // the guess letter is in the secret word and is not in the right spot
        // has it already been counted earlier though?
        // will it be counted later as correct letter correct spot?
        let nextjstart = 0;
        for (let i = 0; i < targetWord.length; i++) {
            if (targetWord[i] === letter && guessLetters[i] !== letter) {
                let jfound = false;
                for(let j = nextjstart; !jfound && j < targetWord.length; j++) {
                    if (guessLetters[j] === letter && targetWord[j] !== letter) {
                        if (j === guessLetterIndex) {
                            if (!e.classList.contains(correctLetterCorrectPositionKB))
                            {
                                e.classList.add(correctLetterWrongPositionKB);
                            }
                            return "correct-letter-wrong-position";
                        }
                        jfound = true;
                        nextjstart = j + 1;
                    }
                }
            }
        }
    }
    if (!e.classList.contains(correctLetterCorrectPositionKB) && !e.classList.contains(correctLetterWrongPositionKB)) {
        e.classList.add(wrongLetterKB);
    }
    return "wrong-letter";
}
function showHint() {
    if (guesses.length === 0)
    {
        alert("Hint unavailable before first guess");
        return;
    }
    let hintIndex = -1;
    for(let i = 0; (hintIndex === -1) && (i < targetWord.length); i++)
    {
        let gotThisIndex = false;
        for(let j = 0; (!gotThisIndex) && (j < guesses.length); j++)
        {
            let check = guesses[j];
            if (check[i] === targetWord[i])
            {
                gotThisIndex = true;
            }
        }
        if (!gotThisIndex)
        {
            hintIndex = i;
        }
    }
    if (hintIndex === -1)
    {
        alert("You guesses every letter correctly at least once already, look over your guesses");
    } else {
        alert(`Letter ${hintIndex + 1} is ${targetWord[hintIndex]}`);
    }
}

function explainColors() {
    alert('Green=Correct Position, Blue=Wrong Position, Grey=Wrong Letter');
}