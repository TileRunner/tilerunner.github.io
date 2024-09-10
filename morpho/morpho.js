
let info = {};
let saveInfo = {}; // The answers from the server (there can be multiple solutions, this is just one)
let nextRow; // Set it when we generate the puzzle, advance it as they click a letter on the bottom row

const tableBody = document.getElementById("table-body");
const optionsDiv = document.getElementById("options-div");
const optionsPrompt = document.getElementById("options-prompt");

for (let l = 3; l < 8; l++) {
    document.getElementById(`${l}-letter-puzzle`).addEventListener("click", () => generatePuzzle(l));  
}

function generatePuzzle(wordLength) {
    getInfo(wordLength).then(() => displayInfo(wordLength));
}

async function getInfo(wordLength) {
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
}

function displayInfo(wordLength) {
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
                tdElement.addEventListener("click", () => handleLastRowClick(wordLength, c));
            }
        }
    }
}

function handleLastRowClick(wordLength, colIndex) {
    info.puzzle.rows[nextRow].letters = "";
    for (let c = 0; c < wordLength; c++) {
        info.puzzle.rows[nextRow].letters += c === colIndex ? info.puzzle.rows[wordLength].letters[c] : info.puzzle.rows[nextRow - 1].letters[c];
    }
    nextRow++;
    displayInfo(wordLength);
    if (nextRow === wordLength) {
        optionsDiv.style.display = "block";
        optionsPrompt.textContent = "Click to generate another";
    }
}