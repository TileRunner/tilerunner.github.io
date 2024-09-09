const baseurl = 'https://webappscrabbleclub.azurewebsites.net/api/Values';

async function callForPuzzle(wordLength)  {
    let data = {};
    try {
        let url = `${baseurl}/morpho?rows=${wordLength+1}&cols=${wordLength}`;
        const response = await fetch(url);
        let json = await response.json();
        if (json.value.fail) {
            data.notes = ['The cat had a hairball!', json.value.fail];
        } else {
            data.puzzle = json.value;
        }
    } catch (error) {
        data.notes = ["The cat escaped. Sorry about that."];
        console.log(error);
    }
    return data;
}
