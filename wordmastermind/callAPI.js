const baseurl = 'https://webappscrabbleclub.azurewebsites.net/api/Values';

async function pickRandomWord(wordLength)  {
    let url = `${baseurl}/NWL2023/random?length=${wordLength}`;
    const response = await fetch(url);
    let jdata = await response.json();
    return jdata.value.toUpperCase();
}

async function isWordValid(word) {
    let url = `${baseurl}/NWL2023/exists?word=${word}`;
    const response = await fetch(url);
    const jdata = await response.json();
    return jdata.value;
}