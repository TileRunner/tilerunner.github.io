

function minimizeDeviation() {
    // Enter players with their ratings in this array
    const teamPlayers = [
        { name: 'Max', rating: 1910 },
        { name: 'Christopher', rating: 1895 },
        { name: 'Jared', rating: 1890 },
        { name: 'Jean?', rating: 1182 },
        { name: 'Heather', rating: 1649 },
        { name: 'Vera', rating: 1560 },
        { name: 'Crayne', rating: 1406 },
        { name: 'Mad', rating: 1185 },
        { name: 'Nolan', rating: 1352 },
        { name: 'Peter?', rating: 1152 },
        { name: 'Sharon', rating: 836 },
        { name: 'Sheena', rating: 787 },
        ];
      
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
      document.getElementById(`Xt${t+1}n${p+1}`).textContent = solution.bestGroups[t][p].name;
      document.getElementById(`Xt${t+1}r${p+1}`).textContent = solution.bestGroups[t][p].rating;
    }
  }
  
// Display pairings designed by Vera
// Pairings system designed by Vera
const XA1_1 = solution.bestGroups[0][0].name;
const XA1_2 = solution.bestGroups[0][1].name;
const XA2_1 = solution.bestGroups[0][2].name;
const XA2_2 = solution.bestGroups[0][3].name;

const XB1_1 = solution.bestGroups[1][0].name;
const XB1_2 = solution.bestGroups[1][1].name;
const XB2_1 = solution.bestGroups[1][2].name;
const XB2_2 = solution.bestGroups[1][3].name;

const XC1_1 = solution.bestGroups[2][0].name;
const XC1_2 = solution.bestGroups[2][1].name;
const XC2_1 = solution.bestGroups[2][2].name;
const XC2_2 = solution.bestGroups[2][3].name;

document.getElementById("Xr1g1").textContent = `${XA1_1} vs ${XB1_1}`;
document.getElementById("Xr1g2").textContent = `${XA1_2} vs ${XB1_2}`;
document.getElementById("Xr2g1").textContent = `${XA1_1} vs ${XB1_2}`;
document.getElementById("Xr2g2").textContent = `${XA1_2} vs ${XB1_1}`;

document.getElementById("Xr1g3").textContent = `${XA2_1} vs ${XC1_1}`;
document.getElementById("Xr1g4").textContent = `${XA2_2} vs ${XC1_2}`;
document.getElementById("Xr2g3").textContent = `${XA2_1} vs ${XC1_2}`;
document.getElementById("Xr2g4").textContent = `${XA2_2} vs ${XC1_1}`;

document.getElementById("Xr1g5").textContent = `${XB2_1} vs ${XC2_1}`;
document.getElementById("Xr1g6").textContent = `${XB2_2} vs ${XC2_2}`;
document.getElementById("Xr2g5").textContent = `${XB2_1} vs ${XC2_2}`;
document.getElementById("Xr2g6").textContent = `${XB2_2} vs ${XC2_1}`;

document.getElementById("Xr3g1").textContent = `${XA1_1} vs ${XC1_1}`;
document.getElementById("Xr3g2").textContent = `${XA1_2} vs ${XC1_2}`;
document.getElementById("Xr4g1").textContent = `${XA1_1} vs ${XC1_2}`;
document.getElementById("Xr4g2").textContent = `${XA1_2} vs ${XC1_1}`;

document.getElementById("Xr3g3").textContent = `${XA2_1} vs ${XB2_1}`;
document.getElementById("Xr3g4").textContent = `${XA2_2} vs ${XB2_2}`;
document.getElementById("Xr4g3").textContent = `${XA2_1} vs ${XB2_2}`;
document.getElementById("Xr4g4").textContent = `${XA2_2} vs ${XB2_1}`;

document.getElementById("Xr3g5").textContent = `${XB1_1} vs ${XC2_1}`;
document.getElementById("Xr3g6").textContent = `${XB1_2} vs ${XC2_2}`;
document.getElementById("Xr4g5").textContent = `${XB1_1} vs ${XC2_2}`;
document.getElementById("Xr4g6").textContent = `${XB1_2} vs ${XC2_1}`;

document.getElementById("Xr5g1").textContent = `${XA1_1} vs ${XC2_1}`;
document.getElementById("Xr5g2").textContent = `${XA1_2} vs ${XC2_2}`;
document.getElementById("Xr6g1").textContent = `${XA1_1} vs ${XC2_2}`;
document.getElementById("Xr6g2").textContent = `${XA1_2} vs ${XC2_1}`;

document.getElementById("Xr5g3").textContent = `${XA2_1} vs ${XB1_1}`;
document.getElementById("Xr5g4").textContent = `${XA2_2} vs ${XB1_2}`;
document.getElementById("Xr6g3").textContent = `${XA2_1} vs ${XB1_2}`;
document.getElementById("Xr6g4").textContent = `${XA2_2} vs ${XB1_1}`;

document.getElementById("Xr5g5").textContent = `${XB2_1} vs ${XC1_1}`;
document.getElementById("Xr5g6").textContent = `${XB2_2} vs ${XC1_2}`;
document.getElementById("Xr6g5").textContent = `${XB2_1} vs ${XC1_2}`;
document.getElementById("Xr6g6").textContent = `${XB2_2} vs ${XC1_1}`;

document.getElementById("Xr7g1").textContent = `${XA1_1} vs ${XB2_1}`;
document.getElementById("Xr7g2").textContent = `${XA1_2} vs ${XB2_2}`;
document.getElementById("Xr8g1").textContent = `${XA1_1} vs ${XB2_2}`;
document.getElementById("Xr8g2").textContent = `${XA1_2} vs ${XB2_1}`;

document.getElementById("Xr7g3").textContent = `${XA2_1} vs ${XC2_1}`;
document.getElementById("Xr7g4").textContent = `${XA2_2} vs ${XC2_2}`;
document.getElementById("Xr8g3").textContent = `${XA2_1} vs ${XC2_2}`;
document.getElementById("Xr8g4").textContent = `${XA2_2} vs ${XC2_1}`;

document.getElementById("Xr7g5").textContent = `${XB1_1} vs ${XC1_1}`;
document.getElementById("Xr7g6").textContent = `${XB1_2} vs ${XC1_2}`;
document.getElementById("Xr8g5").textContent = `${XB1_1} vs ${XC1_2}`;
document.getElementById("Xr8g6").textContent = `${XB1_2} vs ${XC1_1}`;

