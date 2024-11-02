const letters = 'QWERTYUIOPASDFGHJKLZXCVBNM';
let wordLength = 0;
let targetWord = '';
let guesses = [];
let currentGuess = '';
let solving = false;
let solved = false;
const e_options = document.getElementById("options-div");
const e_hint = document.getElementById("hint-div");
const e_guess_table_body = document.getElementById("guess-table-body");
const e_legend = document.getElementById("legend");
e_legend.style.display = "none";

for (let l = 3; l < 10; l++) {
    document.getElementById(`${l}-move-puzzle`).addEventListener("click", () => generatePuzzle(l));  
}
for (let l = 0; l < 26; l++) {
    document.getElementById(`click-${letters[l]}`).addEventListener("click", () => handleInputLetter(letters[l]));
}
document.getElementById("click-backspace").addEventListener("click", () => handleDeleteLetter());
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
    e_legend.style.display = "block";
    displayGuesses();
}

function displayInfo() {
    console.log(`Random word is ${targetWord}`);
    e_hint.textContent = "Click letters below to form your guess";
}

function handleInputLetter(letter) {
    if (!solving)
    {
        return;
    }
    currentGuess = `${currentGuess}${letter}`;
    if (currentGuess.length === wordLength)
    {
        guesses.push(currentGuess);
        if (currentGuess === targetWord)
        {
            e_legend.style.display = "none";
            e_options.style.display = "block";
            e_hint.textContent = `Solved in ${guesses.length} moves ${guesses.length > 5 ? '.' : '!'} Click a number to replay.`;
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
    for(let i = 0; i < display_guess.length; i++)
    {
        let e_guess_col = document.createElement("td");
        e_guess_col.classList.add("guess-col");
        e_guess_col.classList.add(calcLetterStyle(display_guess, i));
        e_guess_col.textContent = display_guess[i];
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
    // guessLetters is the whole guess, guessLetterIndex is the letter index for which we want the css style name
    if (letter === targetWord[guessLetterIndex]) {
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
                            return "correct-letter-wrong-position";
                        }
                        jfound = true;
                        nextjstart = j + 1;
                    }
                }
            }
        }
    }
    return "wrong-letter";
}
