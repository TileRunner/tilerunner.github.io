/*
https://cross-tables.com/rest/players.php?search=Peter+Saw
Gives all players matching "Peter" AND "Saw"
{
	"players": [
		{
			"playerid": "19599",
			"name": "Peter Sawatzky",
			"prizemoney": "205",
			"w": "225",
			"l": "270",
			"t": "0",
			"b": "15",
			"games": "75",
			"twlrating": "1149",
			"twlranking": "0",
			"cswrating": "0",
			"cswranking": "0",
			"photourl": "https:\/\/www.cross-tables.com\/pix\/anon.gif",
			"city": "Kitchener",
			"state": "ON",
			"country": "CAN",
			"pid": "12320",
			"naspa_id": "AA000636",
			"naspa_expiry": "2022-07-17",
			"deceased": "0",
			"lastplayed": "2020-01-30"
		}
	],
	"query": "Peter saw"
}
*/
const getPlayerInfoUrl = 'https://cross-tables.com/rest/players.php?search=';
async function getPlayerInfo(firstName, lastName) {
    let fullUrl = `${getPlayerInfoUrl}${firstName}+${lastName}`;
    const response = await fetch(fullUrl, {
        method: 'GET', // It is a GET
        mode: 'cors', // I need the data so do not quietly ignore what cors permissions does not allow
        headers: {
            'Accept': 'application/json' // I want json response
        }
    });
    const jdata = await response.json();
    return jdata
}

async function showRatings() {
	const div3 = document.getElementById("try3");
	let disptext = "Ratings check:";
	disptext += await getNextInfoLine('Anna','Miransky');
	disptext += await getNextInfoLine('Christopher','Sykes');
	disptext += await getNextInfoLine('Crayne','Spanier');
	disptext += await getNextInfoLine('Jared','Cappel');
	disptext += await getNextInfoLine('Heather','McCall');
	disptext += await getNextInfoLine('Mad','Palazzo');
	disptext += await getNextInfoLine('Max','Panitch');
	disptext += await getNextInfoLine('Nolan','Finkelstein');
	disptext += await getNextInfoLine('Peter','Hopkins');
	disptext += await getNextInfoLine('Sharon','Dalgliesh');
	disptext += await getNextInfoLine('Sheena','Dash');
	disptext += await getNextInfoLine('Vera','Bigall');
	div3.textContent = disptext;
}
async function getNextInfoLine(firstName, lastName) {
	let playerInfo = await getPlayerInfo(firstName, lastName);
	let player = playerInfo && playerInfo.players && playerInfo.players.length ? playerInfo.players[0] : {twlrating:'Not found'};
	return ` ${firstName}=${player.twlrating}.`;

}