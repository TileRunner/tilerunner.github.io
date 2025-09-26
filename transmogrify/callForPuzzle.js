const baseurl = 'https://webappscrabbleclub.azurewebsites.net/api/Values';

async function callForPuzzle(numMoves)  {
    let data = {};
    data.downWords = [];
    data.upWords = [];
    data.validNextDownWords = [];
    data.validNextUpWords = [];
    data.solved = false;
    data.solving = false;
    try {
        let url = `${baseurl}/transmogrify/generatepuzzle?minMoves=${numMoves}`;
        const response = await fetch(url);
        responsedata = await response.json();
        if (responsedata.value.fail) {
            responsedata.notes = ["The cat had a hairball!", responsedata.value.fail];
        } else {
            data.startWord = responsedata.value.startWord;
            data.targetWord = responsedata.value.targetWord;
            data.validNextDownWords = await getTransmogrifyValidNextWords(data.startWord);
            data.validNextUpWords = await getTransmogrifyValidNextWords(data.targetWord);
            // Sort the valid next words alphabetically
            data.validNextDownWords.sort();
            data.validNextUpWords.sort();
            data.solving = true;
        }
    } catch (error) {
        data.notes = ["Problem with the server. Sorry about that."];
        console.log(error);
    }
    if (data.notes) {
        alert(data.notes);
    }
    return data;
}
async function getTransmogrifyValidNextWords(word) {
    let url = `${baseurl}/transmogrify/getvalidmoves?word=${word}`;
    const response = await fetch(url);
    const jdata = await response.json();
    return jdata.value;
}
async function isWordValid(word) {
    let url = `${baseurl}/NWL2023/exists?word=${word}`;
    const response = await fetch(url);
    const jdata = await response.json();
    return jdata.value;
}