document.getElementById("get-info-button").addEventListener("click", clickGetInfoButton);
let info = {};
const infoDiv = document.getElementById("info-div");
const inputWordElelemt = document.getElementById("input-word");
const baseurl = 'https://webappscrabbleclub.azurewebsites.net/api/Values/NWL2023/info?word='

function clickGetInfoButton() {
    getInfo().then(() => displayInfo());
}

async function getInfo() {
    // Call API to get info
    let word = inputWordElelemt.value.trim().toUpperCase();
    let fullurl = `${baseurl}${word}`;
    const response = await fetch(fullurl);
    const text = await response.text();
    info = JSON.parse(text).value;
    info.word = word; // For convenient access later
}

function displayInfo() {
    infoDiv.innerHTML = "";
    let tableElement = document.createElement("table");
    let tbodyElement = document.createElement("tbody");
    displayWord(tbodyElement);
    displayDrops(tbodyElement);
    displayInserts(tbodyElement);
    displaySwaps(tbodyElement);
    displayAnagrams(tbodyElement);
    tableElement.appendChild(tbodyElement);
    infoDiv.appendChild(tableElement);
}
function displayWord(tbodyElement) {
    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    td2.classList.add("word-display");
    if (!info.exists) {
        td2.classList.toggle("invalid");
    }
    td1.textContent = 'Validity:';
    td2.textContent = `${info.word} is ${info.exists ? 'valid' : 'invalid'}`;
    tr.appendChild(td1);
    tr.appendChild(td2);
    tbodyElement.appendChild(tr);
}
function displayDrops(tbodyElement) {
    // info.drops is an array of "Y" / "N" if there are any drops, otherwise an empty array
    if (info.drops.length === 0) {
        return;
    }
    let drops = [];
    info.drops.forEach((drop,index) => {
        if (drop === "Y") {
            // Letter at info.word[index] may be dropped to form a new word
            let newWord = info.word.substring(0,index) + info.word.substring(index+1);
            if (!drops.includes(newWord)) {
                drops.push(newWord);
            }
        }
    });
    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    td2.classList.add("drops-display");
    td1.textContent = `Drops:`;
    td2.textContent = `${drops.join(", ")}`;
    tr.appendChild(td1);
    tr.appendChild(td2);
    tbodyElement.appendChild(tr);
}
function displayInserts(tbodyElement) {
    // info.inserts array has the insertable letters at 0 (front hooks) through (inner hooks) word length (back hooks)
    let inserts = [];
    info.inserts.forEach((insert,index) => {
        if (insert != '') {
            for (let i = 0; i < insert.length; i++) {
                const letter = insert[i];
                let newWord = info.word.substring(0,index) + letter + info.word.substring(index);
                inserts.push(newWord);
            }
        }
    });
    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    td2.classList.add("inserts-display");
    td1.textContent = `Inserts:`;
    td2.textContent = `${inserts.join(", ")}`;
    tr.appendChild(td1);
    tr.appendChild(td2);
    tbodyElement.appendChild(tr);
}
function displaySwaps(tbodyElement) {
    // info.swaps array has the swappable letters at 0 (1st letter) through word length - 1 (last letter)
    let swaps = [];
    info.swaps.forEach((swap,index) => {
        if (swap != '') {
            for (let i = 0; i < swap.length; i++) {
                const letter = swap[i];
                let newWord = info.word.substring(0,index) + letter + info.word.substring(index+1);
                swaps.push(newWord);
            }
        }
    });
    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    td2.classList.add("swaps-display");
    td1.textContent = `Swaps:`;
    td2.textContent = `${swaps.join(", ")}`;
    tr.appendChild(td1);
    tr.appendChild(td2);
    tbodyElement.appendChild(tr);
}
function displayAnagrams(tbodyElement) {
    if (info.anagrams.length === 0) {
        return;
    }
    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    td2.classList.add("anagrams-display");
    td1.textContent = `Anagrams:`;
    td2.textContent = `${info.anagrams.join(", ").toUpperCase()}`;
    tr.appendChild(td1);
    tr.appendChild(td2);
    tbodyElement.appendChild(tr);
}