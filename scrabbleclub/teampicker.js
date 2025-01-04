// Sample players with their ratings
const players = [
    { name: 'Agnes', rating: 1784 },
    { name: 'Christopher', rating: 1929 },
    { name: 'Josh', rating: 1504 },
    { name: 'Vera', rating: 1554 },
    { name: 'Crayne', rating: 1406 },
    { name: 'Heather', rating: 1649 },
    { name: 'Mad', rating: 1232 },
    { name: 'Arie', rating: 1888 },
    { name: 'Sharon', rating: 825 },
    { name: 'Peter', rating: 1149 },
    { name: 'John', rating: 1486 },
    { name: 'Su', rating: 1395 }
  ];
  
  // Function to create balanced teams
  function createTeams(players) {
    // Sort players by rating in descending order
    players.sort((a, b) => b.rating - a.rating);
  
    // Create 3 empty teams
    const teams = [[], [], []];
  
    // Distribute players into teams
    for (let i = 0; i < players.length; i++) {
      teams[i % 3].push(players[i]);
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
          if (Math.abs(team1Rating - team2Rating) > 200) {
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
  document.getElementById("t1").textContent = `Team 1, avg rating ${calculateTotalRating(teams[0])/4}`;
  document.getElementById("t1n1").textContent = teams[0][0].name;
  document.getElementById("t1r1").textContent = teams[0][0].rating;
  document.getElementById("t1n2").textContent = teams[0][1].name;
  document.getElementById("t1r2").textContent = teams[0][1].rating;
  document.getElementById("t1n3").textContent = teams[0][2].name;
  document.getElementById("t1r3").textContent = teams[0][2].rating;
  document.getElementById("t1n4").textContent = teams[0][3].name;
  document.getElementById("t1r4").textContent = teams[0][3].rating;

  document.getElementById("t2").textContent = `Team 2, avg rating ${calculateTotalRating(teams[1])/4}`;
  document.getElementById("t2n1").textContent = teams[1][0].name;
  document.getElementById("t2r1").textContent = teams[1][0].rating;
  document.getElementById("t2n2").textContent = teams[1][1].name;
  document.getElementById("t2r2").textContent = teams[1][1].rating;
  document.getElementById("t2n3").textContent = teams[1][2].name;
  document.getElementById("t2r3").textContent = teams[1][2].rating;
  document.getElementById("t2n4").textContent = teams[1][3].name;
  document.getElementById("t2r4").textContent = teams[1][3].rating;

  document.getElementById("t3").textContent = `Team 3, avg rating ${calculateTotalRating(teams[2])/4}`;
  document.getElementById("t3n1").textContent = teams[2][0].name;
  document.getElementById("t3r1").textContent = teams[2][0].rating;
  document.getElementById("t3n2").textContent = teams[2][1].name;
  document.getElementById("t3r2").textContent = teams[2][1].rating;
  document.getElementById("t3n3").textContent = teams[2][2].name;
  document.getElementById("t3r3").textContent = teams[2][2].rating;
  document.getElementById("t3n4").textContent = teams[2][3].name;
  document.getElementById("t3r4").textContent = teams[2][3].rating;

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

