
// Sample players with their ratings
const players = [
  { name: 'Max', rating: 1910 },
  { name: 'Jared', rating: 1890 },
  { name: 'Christopher', rating: 1895 },
  { name: 'Sheena', rating: 787 },
  { name: 'Sharon', rating: 836 },
  { name: 'Peter?', rating: 1152 },
  { name: 'Heather', rating: 1649 },
  { name: 'Vera', rating: 1560 },
  { name: 'Arie?', rating: 1846 },
  { name: 'tbd', rating: 1170 },
  { name: 'Mad', rating: 1185 },
  { name: 'Crayne', rating: 1406 },
  ];
  
// Function to create balanced teams
function createTeams(players) {
  // Sort players by rating in descending order
  players.sort((a, b) => b.rating - a.rating);

  // Create 3 empty teams
  const teams = [[], [], []];

  // Distribute players into teams
  for (let i = 0; i < players.length; i++) {
    teams[i % teams.length].push(players[i]);
  }

  return teams;
}
  
// Function to calculate the total rating of a team
function calculateTotalRating(team) {
  return team.reduce((total, player) => total + player.rating, 0);
}
  
// Function to balance teams further
function balanceTeams(teams) {
  let iterations = 10; // Number of iterations to improve team balance
  while (iterations-- > 0) {
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const team1Rating = calculateTotalRating(teams[i]);
        const team2Rating = calculateTotalRating(teams[j]);
        if (Math.abs(team1Rating - team2Rating) > 150) {
          const player1 = teams[i].pop();
          const player2 = teams[j].pop();
          teams[i].push(player2);
          teams[j].push(player1);
        }
      }
    }
  }
  return teams;
}
  
// Generate and balance teams
let teams = createTeams(players);
teams = balanceTeams(teams);

// Display teams
for (let t = 0; t < teams.length; t++) {
  document.getElementById(`t${t+1}`).textContent = `Team ${t+1}, average rating ${Math.round(calculateTotalRating(teams[t])/4)}`;
  for( let p = 0; p < teams[t].length; p++) {
    document.getElementById(`t${t+1}n${p+1}`).textContent = teams[t][p].name;
    document.getElementById(`t${t+1}r${p+1}`).textContent = teams[t][p].rating;
  }
}

// Pairings system designed by Vera
const A1_1 = teams[0][0].name;
const A1_2 = teams[0][1].name;
const A2_1 = teams[0][2].name;
const A2_2 = teams[0][3].name;

const B1_1 = teams[1][0].name;
const B1_2 = teams[1][1].name;
const B2_1 = teams[1][2].name;
const B2_2 = teams[1][3].name;

const C1_1 = teams[2][0].name;
const C1_2 = teams[2][1].name;
const C2_1 = teams[2][2].name;
const C2_2 = teams[2][3].name;

document.getElementById("r1g1").textContent = `${A1_1} vs ${B1_1}`;
document.getElementById("r1g2").textContent = `${A1_2} vs ${B1_2}`;
document.getElementById("r2g1").textContent = `${A1_1} vs ${B1_2}`;
document.getElementById("r2g2").textContent = `${A1_2} vs ${B1_1}`;

document.getElementById("r1g3").textContent = `${A2_1} vs ${C1_1}`;
document.getElementById("r1g4").textContent = `${A2_2} vs ${C1_2}`;
document.getElementById("r2g3").textContent = `${A2_1} vs ${C1_2}`;
document.getElementById("r2g4").textContent = `${A2_2} vs ${C1_1}`;

document.getElementById("r1g5").textContent = `${B2_1} vs ${C2_1}`;
document.getElementById("r1g6").textContent = `${B2_2} vs ${C2_2}`;
document.getElementById("r2g5").textContent = `${B2_1} vs ${C2_2}`;
document.getElementById("r2g6").textContent = `${B2_2} vs ${C2_1}`;

document.getElementById("r3g1").textContent = `${A1_1} vs ${C1_1}`;
document.getElementById("r3g2").textContent = `${A1_2} vs ${C1_2}`;
document.getElementById("r4g1").textContent = `${A1_1} vs ${C1_2}`;
document.getElementById("r4g2").textContent = `${A1_2} vs ${C1_1}`;

document.getElementById("r3g3").textContent = `${A2_1} vs ${B2_1}`;
document.getElementById("r3g4").textContent = `${A2_2} vs ${B2_2}`;
document.getElementById("r4g3").textContent = `${A2_1} vs ${B2_2}`;
document.getElementById("r4g4").textContent = `${A2_2} vs ${B2_1}`;

document.getElementById("r3g5").textContent = `${B1_1} vs ${C2_1}`;
document.getElementById("r3g6").textContent = `${B1_2} vs ${C2_2}`;
document.getElementById("r4g5").textContent = `${B1_1} vs ${C2_2}`;
document.getElementById("r4g6").textContent = `${B1_2} vs ${C2_1}`;

document.getElementById("r5g1").textContent = `${A1_1} vs ${C2_1}`;
document.getElementById("r5g2").textContent = `${A1_2} vs ${C2_2}`;
document.getElementById("r6g1").textContent = `${A1_1} vs ${C2_2}`;
document.getElementById("r6g2").textContent = `${A1_2} vs ${C2_1}`;

document.getElementById("r5g3").textContent = `${A2_1} vs ${B1_1}`;
document.getElementById("r5g4").textContent = `${A2_2} vs ${B1_2}`;
document.getElementById("r6g3").textContent = `${A2_1} vs ${B1_2}`;
document.getElementById("r6g4").textContent = `${A2_2} vs ${B1_1}`;

document.getElementById("r5g5").textContent = `${B2_1} vs ${C1_1}`;
document.getElementById("r5g6").textContent = `${B2_2} vs ${C1_2}`;
document.getElementById("r6g5").textContent = `${B2_1} vs ${C1_2}`;
document.getElementById("r6g6").textContent = `${B2_2} vs ${C1_1}`;

document.getElementById("r7g1").textContent = `${A1_1} vs ${B2_1}`;
document.getElementById("r7g2").textContent = `${A1_2} vs ${B2_2}`;
document.getElementById("r8g1").textContent = `${A1_1} vs ${B2_2}`;
document.getElementById("r8g2").textContent = `${A1_2} vs ${B2_1}`;

document.getElementById("r7g3").textContent = `${A2_1} vs ${C2_1}`;
document.getElementById("r7g4").textContent = `${A2_2} vs ${C2_2}`;
document.getElementById("r8g3").textContent = `${A2_1} vs ${C2_2}`;
document.getElementById("r8g4").textContent = `${A2_2} vs ${C2_1}`;

document.getElementById("r7g5").textContent = `${B1_1} vs ${C1_1}`;
document.getElementById("r7g6").textContent = `${B1_2} vs ${C1_2}`;
document.getElementById("r8g5").textContent = `${B1_1} vs ${C1_2}`;
document.getElementById("r8g6").textContent = `${B1_2} vs ${C1_1}`;

