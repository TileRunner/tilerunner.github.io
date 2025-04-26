// Enter players with their ratings in this array
const teamPlayers = [
    { firstName: 'Max', lastName: 'Panitch', rating: 1910 },
    { firstName: 'Christopher', lastName: 'Sykes', rating: 1895 },
    { firstName: 'Jared', lastName: 'Cappel', rating: 1890 },
    { firstName: 'Heather', lastName: 'McCall', rating: 1649 },
    { firstName: 'Vera', lastName: 'Bigall', rating: 1560 },
    { firstName: 'Crayne', lastName: 'Spanier', rating: 1406 },
    { firstName: 'Anna', lastName: 'Miransky', rating: 1373 },
    { firstName: 'Mad', lastName: 'Palazzo', rating: 1185 },
    { firstName: 'Nolan', lastName: 'Finkelstein', rating: 1352 },
    { firstName: 'Peter', lastName: 'Hopkins', rating: 1152 },
    { firstName: 'Sharon', lastName: 'Dalgliesh', rating: 836 },
    { firstName: 'Sheena', lastName: 'Dash', rating: 787 },
    ];

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
	const div3 = document.getElementById("showRatingsDiv");
	let disptext = "Ratings check:";
    for(p = 0; p < teamPlayers.length; p++) {
        let player = teamPlayers[p];
        disptext += await getNextInfoLine(player.firstName, player.lastName, player.rating);
    };
	div3.textContent = disptext;
}

async function getNextInfoLine(firstName, lastName, rating) {
	let playerInfo = await getPlayerInfo(firstName, lastName);
	let player = playerInfo && playerInfo.players && playerInfo.players.length ? playerInfo.players[0] : {twlrating:'Not found'};
	return ` ${firstName}=${player.twlrating} ${player.twlrating === rating.toString() ? 'Ok' : 'Mismatch!'}.`;
}

function minimizeDeviation() {
      
    const groups = 3;
    const nums = [];
    for (let i = 0; i < 12; i++) {
        nums.push(teamPlayers[i].rating);
    }
    teamPlayers.sort((a, b) => b.rating - a.rating); // Sort numbers in descending order
    const groupSums = Array(groups).fill(0);
    const result = { minDeviation: Infinity, bestGroups: [] };

    function backtrack(index, currentGroups) {
        if (index === teamPlayers.length) {
            const deviation = Math.max(...groupSums) - Math.min(...groupSums);
            if (deviation < result.minDeviation) {
                result.minDeviation = deviation;
                result.bestGroups = currentGroups.map(group => [...group]); // Copy groups
            }
            return;
        }

        for (let i = 0; i < groups; i++) {
            if (currentGroups[i].length < teamPlayers.length / groups) {
                currentGroups[i].push(teamPlayers[index]);
                groupSums[i] += teamPlayers[index].rating;

                backtrack(index + 1, currentGroups);

                currentGroups[i].pop();
                groupSums[i] -= teamPlayers[index].rating;
            }
        }
    }

    const initialGroups = Array(groups).fill().map(() => []);
    backtrack(0, initialGroups);
    return result;
}

const solution = minimizeDeviation();

// Display teams
for (let t = 0; t < solution.bestGroups.length; t++) {
    let totalRating = solution.bestGroups[t][0].rating;
    totalRating += solution.bestGroups[t][1].rating;
    totalRating += solution.bestGroups[t][2].rating;
    totalRating += solution.bestGroups[t][3].rating;
    document.getElementById(`Xt${t+1}`).textContent = `Team ${t+1}, average rating ${Math.round(totalRating/4)}`;
    for( let p = 0; p < solution.bestGroups[t].length; p++) {
      document.getElementById(`Xt${t+1}n${p+1}`).textContent = solution.bestGroups[t][p].firstName;
      document.getElementById(`Xt${t+1}r${p+1}`).textContent = solution.bestGroups[t][p].rating;
    }
  }
  
// Display pairings designed by Vera
// Pairings system designed by Vera
const XA1_1 = solution.bestGroups[0][0].firstName;
const XA1_2 = solution.bestGroups[0][1].firstName;
const XA2_1 = solution.bestGroups[0][2].firstName;
const XA2_2 = solution.bestGroups[0][3].firstName;

const XB1_1 = solution.bestGroups[1][0].firstName;
const XB1_2 = solution.bestGroups[1][1].firstName;
const XB2_1 = solution.bestGroups[1][2].firstName;
const XB2_2 = solution.bestGroups[1][3].firstName;

const XC1_1 = solution.bestGroups[2][0].firstName;
const XC1_2 = solution.bestGroups[2][1].firstName;
const XC2_1 = solution.bestGroups[2][2].firstName;
const XC2_2 = solution.bestGroups[2][3].firstName;

document.getElementById("Xr1g1").textContent = `${XA1_1} (1st) vs ${XB1_1}`;
document.getElementById("Xr1g2").textContent = `${XA1_2} (1st) vs ${XB1_2}`;
document.getElementById("Xr2g1").textContent = `${XA1_1} vs ${XB1_2} (1st)`;
document.getElementById("Xr2g2").textContent = `${XA1_2} vs ${XB1_1} (1st)`;

document.getElementById("Xr1g3").textContent = `${XA2_1} vs ${XC1_1} (1st)`;
document.getElementById("Xr1g4").textContent = `${XA2_2} vs ${XC1_2} (1st)`;
document.getElementById("Xr2g3").textContent = `${XA2_1} (1st) vs ${XC1_2}`;
document.getElementById("Xr2g4").textContent = `${XA2_2} (1st) vs ${XC1_1}`;

document.getElementById("Xr1g5").textContent = `${XB2_1} (1st) vs ${XC2_1}`;
document.getElementById("Xr1g6").textContent = `${XB2_2} (1st) vs ${XC2_2}`;
document.getElementById("Xr2g5").textContent = `${XB2_1} vs ${XC2_2} (1st)`;
document.getElementById("Xr2g6").textContent = `${XB2_2} vs ${XC2_1} (1st)`;

document.getElementById("Xr3g1").textContent = `${XA1_1} (1st) vs ${XC1_1}`;
document.getElementById("Xr3g2").textContent = `${XA1_2} (1st) vs ${XC1_2}`;
document.getElementById("Xr4g1").textContent = `${XA1_1} vs ${XC1_2} (1st)`;
document.getElementById("Xr4g2").textContent = `${XA1_2} vs ${XC1_1} (1st)`;

document.getElementById("Xr3g3").textContent = `${XA2_1} (1st) vs ${XB2_1}`;
document.getElementById("Xr3g4").textContent = `${XA2_2} (1st) vs ${XB2_2}`;
document.getElementById("Xr4g3").textContent = `${XA2_1} vs ${XB2_2} (1st)`;
document.getElementById("Xr4g4").textContent = `${XA2_2} vs ${XB2_1} (1st)`;

document.getElementById("Xr3g5").textContent = `${XB1_1} (1st) vs ${XC2_1}`;
document.getElementById("Xr3g6").textContent = `${XB1_2} (1st) vs ${XC2_2}`;
document.getElementById("Xr4g5").textContent = `${XB1_1} vs ${XC2_2} (1st)`;
document.getElementById("Xr4g6").textContent = `${XB1_2} vs ${XC2_1} (1st)`;

document.getElementById("Xr5g1").textContent = `${XA1_1} (1st) vs ${XC2_1}`;
document.getElementById("Xr5g2").textContent = `${XA1_2} (1st) vs ${XC2_2}`;
document.getElementById("Xr6g1").textContent = `${XA1_1} vs ${XC2_2} (1st)`;
document.getElementById("Xr6g2").textContent = `${XA1_2} vs ${XC2_1} (1st)`;

document.getElementById("Xr5g3").textContent = `${XA2_1} vs ${XB1_1} (1st)`;
document.getElementById("Xr5g4").textContent = `${XA2_2} vs ${XB1_2} (1st)`;
document.getElementById("Xr6g3").textContent = `${XA2_1} (1st) vs ${XB1_2}`;
document.getElementById("Xr6g4").textContent = `${XA2_2} (1st) vs ${XB1_1}`;

document.getElementById("Xr5g5").textContent = `${XB2_1} vs ${XC1_1} (1st)`;
document.getElementById("Xr5g6").textContent = `${XB2_2} vs ${XC1_2} (1st)`;
document.getElementById("Xr6g5").textContent = `${XB2_1} (1st) vs ${XC1_2}`;
document.getElementById("Xr6g6").textContent = `${XB2_2} (1st) vs ${XC1_1}`;

document.getElementById("Xr7g1").textContent = `${XA1_1} (1st) vs ${XB2_1}`;
document.getElementById("Xr7g2").textContent = `${XA1_2} (1st) vs ${XB2_2}`;
document.getElementById("Xr8g1").textContent = `${XA1_1} vs ${XB2_2} (1st)`;
document.getElementById("Xr8g2").textContent = `${XA1_2} vs ${XB2_1} (1st)`;

document.getElementById("Xr7g3").textContent = `${XA2_1} (1st) vs ${XC2_1}`;
document.getElementById("Xr7g4").textContent = `${XA2_2} (1st) vs ${XC2_2}`;
document.getElementById("Xr8g3").textContent = `${XA2_1} vs ${XC2_2} (1st)`;
document.getElementById("Xr8g4").textContent = `${XA2_2} vs ${XC2_1} (1st)`;

document.getElementById("Xr7g5").textContent = `${XB1_1} (1st) vs ${XC1_1}`;
document.getElementById("Xr7g6").textContent = `${XB1_2} (1st) vs ${XC1_2}`;
document.getElementById("Xr8g5").textContent = `${XB1_1} vs ${XC1_2} (1st)`;
document.getElementById("Xr8g6").textContent = `${XB1_2} vs ${XC1_1} (1st)`;

