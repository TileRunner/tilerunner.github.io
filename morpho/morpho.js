
let info = {};

getInfo().then(() => displayInfo());

async function getInfo() {
    // Call API to get info
    info = await callForPuzzle(5);
}

function displayInfo() {
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 5; c++) {
            let id = `r${r}c${c}`;
            let cell = document.getElementById(id);
            cell.textContent = info.puzzle.rows[r].letters[c];
        }
    }
}