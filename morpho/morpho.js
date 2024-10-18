
let info = {};
let saveInfo = {}; // The answers from the server (there can be multiple solutions, this is just one)
let nextRow; // Set it when we generate the puzzle, advance it as they click a letter on the bottom row
let wordLength;

const tableBody = document.getElementById("table-body");
const optionsDiv = document.getElementById("options-div");
const infoDiv = document.getElementById("info-div");
const restartButton = document.getElementById("restart-puzzle");
const artworkBefore = document.getElementById("artwork-before");
const artworkAfter = document.getElementById("artwork-after");
infoDiv.style.display = "none";
restartButton.addEventListener("click", () => handleRestartClick());
for (let l = 3; l < 8; l++) {
    document.getElementById(`${l}-letter-puzzle`).addEventListener("click", () => generatePuzzle(l));  
}
artworkBefore.style.display = "none";
artworkBefore.classList.add("artwork");
artworkBefore.classList.add("caterpillar");
artworkAfter.classList.add("artwork");
artworkAfter.classList.add("cocoon");

function generatePuzzle(chosenLength) {
    wordLength = chosenLength;
    getInfo().then(() => displayInfo()).then(() => displayCaterpillar());
}

async function getInfo() {
    // Call API to get info
    info = await callForPuzzle(wordLength);
    saveInfo = JSON.parse(JSON.stringify(info));
    // Clear the answers from info except for the essential top and bottom rows
    for (let r = 1; r < wordLength; r++) {
        info.puzzle.rows[r].letters = '';
        for (let c = 0; c < wordLength; c++) {
            info.puzzle.rows[r].letters += '?';
        }
    }
    nextRow = 1;
    optionsDiv.style.display = "none";
    infoDiv.style.display = "block";
}

function displayInfo() {
    tableBody.innerHTML = ""; // Clear previous
    for (let r = 0; r <= wordLength; r++) {
        let trElement = document.createElement("tr");
        trElement.classList.add(r === 0 ? "top-row" : r === wordLength ? "bottom-row" : "middle-row");
        tableBody.append(trElement);
        for (let c = 0; c < wordLength; c++) {
            let tdElement = document.createElement("td");
            tdElement.textContent = info.puzzle.rows[r].letters[c];
            trElement.append(tdElement);
            if (r === wordLength && nextRow < wordLength) {
                if (info.puzzle.rows[r].letters[c] === info.puzzle.rows[nextRow-1].letters[c])
                {
                    tdElement.classList.add('clicked');
                } else {
                    tdElement.classList.add('unclicked');
                    tdElement.addEventListener("click", () => handleLastRowClick(c));
                }
            }
        }
    }
}

async function handleLastRowClick(colIndex) {
    let newWord = "";
    info.puzzle.rows[nextRow].letters = "";
    for (let c = 0; c < wordLength; c++) {
        newWord += c === colIndex ? info.puzzle.rows[wordLength].letters[c] : info.puzzle.rows[nextRow - 1].letters[c];
    }
    let newWordExists = await isWordValid(newWord);
    if (!newWordExists) {
        alert(`${newWord.toUpperCase()} is not in the NWL2023 lexicon`);
        return;
    }
    info.puzzle.rows[nextRow].letters = newWord;
    nextRow++;
    displayInfo();
    if (nextRow === wordLength) {
        optionsDiv.style.display = "block";
        displayButterfly();
    }
}

function handleRestartClick() {
    nextRow = 1;
    for (let r = 1; r < wordLength; r++) {
        info.puzzle.rows[r].letters = "";
        for (let c = 0; c < wordLength; c++) {
            info.puzzle.rows[r].letters += '?';
        }
    }
    optionsDiv.style.display = "none";
    displayInfo();
    displayCaterpillar();
}

function displayCocoon() {
    artworkAfter.innerHTML = ""; // Clear previous
    let pic = document.createElement("div");
    pic.classList.add("artwork");
    pic.classList.add("cocoon");
    artworkAfter.appendChild(pic);
    artworkAfter.style.display = "block";
    artworkBefore.style.display = "none";
}
function displayCaterpillar() {
    artworkAfter.innerHTML = ""; // Clear previous
    let pic = document.createElement("div");
    pic.classList.add("artwork");
    pic.classList.add("caterpillar");
    artworkAfter.appendChild(pic);
    artworkAfter.style.display = "block";
    artworkBefore.style.display = "none";
}
function displayButterfly() {
    artworkBefore.innerHTML = ""; // Clear previous
    let pic = document.createElement("div");
    pic.classList.add("artwork");
    pic.classList.add("butterfly");
    artworkBefore.appendChild(pic);
    artworkBefore.style.display = "block";
    artworkAfter.style.display = "none";
}
