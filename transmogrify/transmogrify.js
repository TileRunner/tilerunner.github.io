let info = {}; // No info yet
let saveInfo = "{}";
let numMoves = 0; // No puzzle yet
const e_options = document.getElementById("options-div");
const e_loading = document.getElementById("loading-div");
const e_restartButton = document.getElementById("restart-puzzle");
const e_artwork = document.getElementById("artwork");
const e_startWord = document.getElementById("start-word");
const e_targetWord = document.getElementById("target-word");
const e_solutionRows = document.getElementById("solution-rows");
const e_numMoves = document.getElementById("num-moves");
const e_validWords = document.getElementById("valid-words-div");
const e_solved = document.getElementById("solved");
e_restartButton.style.display = "none";
e_restartButton.addEventListener("click", () => handleRestartClick());
e_artwork.style.display = "none";
for (let l = 2; l < 8; l++) {
    document.getElementById(`${l}-move-puzzle`).addEventListener("click", () => generatePuzzle(l));  
}

function handleRestartClick() {
    info = JSON.parse(saveInfo);
    displayInfo();
}
function generatePuzzle(chosenLength) {
    e_options.style.display = "none";
    e_loading.textContent = "Feeding the cat, hang on...";
    numMoves = chosenLength;
    getInfo().then(() => displayInfo());
}

async function getInfo() {
    // Call API to get info
    info = await callForPuzzle(numMoves);
    saveInfo = JSON.stringify(info);
    e_solved.textContent = "Happy Solving!";
}

function displayInfo() {
    e_solved.textContent = "";
    e_startWord.textContent = info.startWord;
    e_targetWord.textContent = info.targetWord;
    e_numMoves.textContent = numMoves;
    e_validWords.innerHTML = ""; // Clear previous
    e_solutionRows.innerHTML = ""; // Clear previous
    let e_solving_r = document.createElement("tr");
    let e_solving_c = document.createElement("td");
    if (info.solving || info.solved) {
        // Start word
        let e_sw_r = document.createElement("tr");
        let e_sw_c = document.createElement("td");
        let e_sw_s = document.createElement("span");
        e_sw_s.textContent = info.startWord;
        e_solutionRows.appendChild(e_sw_r);
        e_sw_r.appendChild(e_sw_c);
        e_sw_c.appendChild(e_sw_s);
        // Down words used
        let lastDownWord = info.startWord;
        for (let i = 0; i < info.downWords.length; i++) {
            lastDownWord = info.downWords[i];
            let e_dw_r = document.createElement("tr");
            let e_dw_c = document.createElement("td");
            let e_dw_s = document.createElement("span");
            e_dw_s.textContent = lastDownWord;
            e_dw_c.appendChild(e_dw_s);
            e_dw_r.appendChild(e_dw_c);
            e_solutionRows.appendChild(e_dw_r);
        }
        // Solving row
        e_solutionRows.appendChild(e_solving_r);
        // Up words used
        let lastUpWord = info.targetWord;
        for (let i = info.upWords.length - 1; i > -1; i--) {
            lastUpWord = info.upWords[i];
            let e_uw_r = document.createElement("tr");
            let e_uw_c = document.createElement("td");
            let e_uw_s = document.createElement("span");
            e_uw_s.textContent = lastUpWord;
            e_uw_c.appendChild(e_uw_s);
            e_uw_r.appendChild(e_uw_c);
            e_solutionRows.appendChild(e_uw_r);
        }
        // Target word
        let e_tw_r = document.createElement("tr");
        let e_tw_c = document.createElement("td");
        let e_tw_s = document.createElement("span");
        e_tw_s.textContent = info.targetWord;
        e_solutionRows.appendChild(e_tw_r);
        e_tw_r.appendChild(e_tw_c);
        e_tw_c.appendChild(e_tw_s);
        // Solved?
        if (info.validNextDownWords.includes(lastUpWord) || info.validNextUpWords.includes(lastDownWord)) {
            info.solved = true;
            info.solving = false;
            e_solved.textContent = `Solved in ${info.downWords.length + info.upWords.length + 1} moves!`;
            e_options.style.display = "block";
        } else {
            e_solving_c.textContent = "? ? ?";
            e_solving_r.appendChild(e_solving_c);
        }

    }
    if (info.solving) {
        let e_validDownWordsLabel = document.createElement("p");
        e_validDownWordsLabel.textContent = "Valid Down Words";
        e_validWords.appendChild(e_validDownWordsLabel);
        for (let i = 0; i < info.validNextDownWords.length; i++) {
            let e_vnw = document.createElement("span");
            let spacer = "";
            if (i < info.validNextDownWords.length - 1) {
                spacer = ", ";
            }
            e_vnw.textContent = info.validNextDownWords[i] + spacer;
            e_vnw.addEventListener("click", () => handleClickValidDownWord(info.validNextDownWords[i]));
            e_validWords.appendChild(e_vnw);
        }
        let e_validUpWordsLabel = document.createElement("p");
        e_validUpWordsLabel.textContent = "Valid Up Words";
        e_validWords.appendChild(e_validUpWordsLabel);
        for (let i = 0; i < info.validNextUpWords.length; i++) {
            let e_vnw = document.createElement("span");
            let spacer = "";
            if (i < info.validNextUpWords.length - 1) {
                spacer = ", ";
            }
            e_vnw.textContent = info.validNextUpWords[i] + spacer;
            e_vnw.addEventListener("click", () => handleClickValidUpWord(info.validNextUpWords[i]));
            e_validWords.appendChild(e_vnw);
        }
    }
    if (info.solving)
    {
        e_restartButton.style.display = "block";
        e_artwork.style.display = "none";
    }
    else
    {
        e_restartButton.style.display = "none";
        e_artwork.style.display = "block";
    }
    e_loading.textContent = "";
}

async function handleClickValidDownWord(word) {
    info.downWords.push(word);
    info.validNextDownWords = await getTransmogrifyValidNextWords(word);
    info.validNextDownWords.sort();
    displayInfo();
}
async function handleClickValidUpWord(word) {
    info.upWords.push(word);
    info.validNextUpWords = await getTransmogrifyValidNextWords(word);
    info.validNextUpWords.sort();
    displayInfo();
}
