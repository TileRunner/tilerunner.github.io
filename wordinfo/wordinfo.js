document.getElementById("get-info-button").addEventListener("click", clickGetInfoButton);
let info = {};
const infoDiv = document.getElementById("info-div");
infoDiv.style.visibility = "hidden";
const inputWordElelemt = document.getElementById("input-word");
inputWordElelemt.focus();
const stemsElement = document.getElementById("stems");
const validityElement = document.getElementById("validity");
const dropsElement = document.getElementById("drops");
const insertsElement = document.getElementById("inserts");
const swapsElement = document.getElementById("swaps");
const anagramsElement = document.getElementById("anagrams");
const fex2Element = document.getElementById("ext-f2");
const bex2Element = document.getElementById("ext-b2");
const fex3Element = document.getElementById("ext-f3");
const bex3Element = document.getElementById("ext-b3");
const baseurl = 'https://webappscrabbleclub.azurewebsites.net/api/Values/NWL2023/info?word='
window.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        // Handle Enter key press
        clickGetInfoButton();
    }
});

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
    displayWord();
    displayStems();
    displayDrops();
    displayInserts();
    displaySwaps();
    displayAnagrams();
    displayFrontExtensions(fex2Element, info.fexLen2);
    displayBackExtensions(bex2Element, info.bexLen2);
    displayFrontExtensions(fex3Element, info.fexLen3);
    displayBackExtensions(bex3Element, info.bexLen3);
    infoDiv.style.visibility = "visible";
    inputWordElelemt.focus();
}
function displayWord() {
    validityElement.setAttribute("invalid",!info.exists);
    validityElement.textContent = `${info.word} is ${info.exists ? 'valid' : 'invalid'}`;
}
function displayStems() {
    stemsElement.textContent = info.stemLetters;
}
function displayDrops() {
    // info.drops is an array of "Y" / "N" if there are any drops, otherwise an empty array
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
    dropsElement.textContent = `${drops.join(", ")}`;
}
function displayInserts() {
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
    insertsElement.textContent = `${inserts.join(", ")}`;
}
function displaySwaps() {
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
    swapsElement.textContent = `${swaps.join(", ")}`;
}
function displayAnagrams() {
    anagramsElement.textContent = `${info.anagrams.join(", ").toUpperCase()}`;
}
function displayFrontExtensions(exElement, exts) {
    exElement.textContent = exts.map((ext) => {return ext + info.word;}).join(", ");
}
function displayBackExtensions(exElement, exts) {
    exElement.textContent = exts.map((ext) => {return info.word + ext;}).join(", ");
}