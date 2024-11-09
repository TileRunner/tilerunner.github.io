const scrabbleDataUrl = 'https://webappscrabbleclub.azurewebsites.net/API/Values';

async function getClubs() {
    let fullUrl = `${scrabbleDataUrl}/GetClubs`;
    const response = await fetch(fullUrl, {
        method: 'GET', // It is a GET
        mode: 'cors', // I need the data so do not quietly ignore what cors permissions does not allow
        headers: {
            'Accept': 'application/json' // I want json response
        }
    });
    const jdata = await response.json();
    jdata.sort((a,b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
    return jdata;
};

async function getPlayers() {
    let fullUrl = `${scrabbleDataUrl}/GetPlayers`;
    const response = await fetch(fullUrl, {
        method: 'GET', // It is a GET
        mode: 'cors', // I need the data so do not quietly ignore what cors permissions does not allow
        headers: {
            'Accept': 'application/json' // I want json response
        }
    });
    const jdata = await response.json();
    jdata.sort((a,b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
    return jdata;
};

async function getClubNights() {
    let fullUrl = `${scrabbleDataUrl}/GetClubNights`;
    const response = await fetch(fullUrl, {
        method: 'GET', // It is a GET
        mode: 'cors', // I need the data so do not quietly ignore what cors permissions does not allow
        headers: {
            'Accept': 'application/json' // I want json response
        }
    });
    const jdata = await response.json();
    return jdata;
};

async function getClubGames() {
    let fullUrl = `${scrabbleDataUrl}/GetClubGames`;
    const response = await fetch(fullUrl, {
        method: 'GET', // It is a GET
        mode: 'cors', // I need the data so do not quietly ignore what cors permissions does not allow
        headers: {
            'Accept': 'application/json' // I want json response
        }
    });
    let jdata = await response.json();
    // Make it so Player (as opposed to Opponent) is never the loser
    jdata.forEach(g => {
        if (g.playerScore < g.opponentScore) {
            let old = {playerId: g.playerId, playerScore: g.playerScore, opponentId: g.opponentId, opponentScore: g.opponentScore};
            g.playerId = old.opponentId;
            g.playerScore = old.opponentScore;
            g.opponentId = old.playerId;
            g.opponentScore = old.playerScore;
        }
    });
    // I accidentally posted a club night to the wrong club and there is no delete logic. I zeroed the scores.
    jdata = jdata.filter(g => {return (g.playerScore !== 0) || (g.opponentScore !== 0);});
    return jdata;
};
