async function isWordValid(word) {
    let url = `https://webappscrabbleclub.azurewebsites.net/api/Values/NWL2023/exists?word=${word}`;
    const response = await fetch(url);
    const jdata = await response.json();
    return jdata.value;
}