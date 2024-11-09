const e_body = document.getElementById("body");
let club_list = [];
let player_list = [];
let club_night_list = [];
let club_game_list = [];
let player_totals = [];
let allstat = {games: 0, points: 0, winnerPoints: 0, loserPoints: 0, ties: 0, tiePoints: 0, highgame: 0, avgPoints: 0, avgWinnerPoints: 0, avgLoserPoints: 0, avgTiePoints: 0};
const e_clubs = document.createElement("div");
e_body.appendChild(e_clubs);
getInfo().then(() => displayClubsInfo());

async function getInfo() {
    club_list = await getClubs();
    player_list = await getPlayers();
    club_night_list = await getClubNights();
    club_game_list = await getClubGames();

    // Put clubid and player names on each game
    club_game_list.forEach(game => {
        game.clubId = club_night_list.filter(n => {return n.id === game.clubNightId;})[0].clubId;
        game.playerName = player_list.filter(p => {return p.id === game.playerId;})[0].name;
        game.opponentName = player_list.filter(p => {return p.id === game.opponentId;})[0].name;
    });


    // Calculate some stuff about the club night
    club_night_list.forEach(clubnight => {
        let clubnightgamelist = club_game_list.filter(g => {return g.clubNightId === clubnight.id;});
        clubnight.numGames = clubnightgamelist.length;
        let clubnightplayers = [];
        clubnight.highgame = 0;
        clubnightgamelist.forEach(g => {
            if (g.playerScore > clubnight.highgame) {
                clubnight.highgame = g.playerScore;
            }
            if (g.opponentScore > clubnight.highgame) {
                clubnight.highgame = g.opponentScore;
            }
            let foundPlayer = false; // found player
            let foundOpponent = false; // found opponent
            for (let i = 0; i < clubnightplayers.length; i++) {
                let p = clubnightplayers[i];
                if (g.playerId === p.id) {
                    foundPlayer = true;
                    p.wins = p.wins + (g.playerScore === g.opponentScore ? 0.5 : g.playerScore > g.opponentScore ? 1 : 0);
                    p.spread = p.spread + g.playerScore - g.opponentScore;
                }
                if (g.opponentId === p.id) {
                    foundOpponent = true;
                    p.wins = p.wins + (g.playerScore === g.opponentScore ? 0.5 : g.playerScore < g.opponentScore ? 1 : 0);
                    p.spread = p.spread - g.playerScore + g.opponentScore;
                }
            }
            if (!foundPlayer) {
                clubnightplayers.push({
                    id: g.playerId,
                    wins: g.playerScore === g.opponentScore ? 0.5 : g.playerScore > g.opponentScore ? 1 : 0,
                    spread: g.playerScore - g.opponentScore,
                    name: g.playerName
                });
            }
            if (!foundOpponent) {
                clubnightplayers.push({
                    id: g.opponentId,
                    wins: g.playerScore === g.opponentScore ? 0.5 : g.playerScore < g.opponentScore ? 1 : 0,
                    spread: g.opponentScore - g.playerScore,
                    name: g.opponentName
                });
            }
        });
        clubnight.numPlayers = clubnightplayers.length;
        if (clubnightplayers.length > 0) {
            clubnightplayers.sort((a,b) => a.wins > b.wins ? -1 : a.wins < b.wins ? 1 : b.spread - a.spread);
            clubnight.winner = clubnightplayers[0];
        }
    });

    // Calculate club stats
    club_list.forEach(club => {
        let stat = {games: 0, points: 0, winnerPoints: 0, loserPoints: 0, ties: 0, tiePoints: 0, highgame: 0, avgPoints: 0, avgWinnerPoints: 0, avgLoserPoints: 0, avgTiePoints: 0};
        club_game_list.forEach(game => {
            if (game.clubId === club.id) {
                stat.games++;
                allstat.games++;
                stat.points += (game.playerScore + game.opponentScore);
                allstat.points += (game.playerScore + game.opponentScore);
                if (game.playerScore > stat.highgame) {
                    stat.highgame = game.playerScore;
                }
                if (game.playerScore > allstat.highgame) {
                    allstat.highgame = game.playerScore;
                }
                if (game.opponentScore > stat.highgame) {
                    stat.highgame = game.opponentScore;
                }
                if (game.opponentScore > allstat.highgame) {
                    allstat.highgame = game.opponentScore;
                }
                if (game.playerScore > game.opponentScore) {
                    stat.winnerPoints += game.playerScore;
                    stat.loserPoints += game.opponentScore;
                    allstat.winnerPoints += game.playerScore;
                    allstat.loserPoints += game.opponentScore;
                } else if (game.playerScore === game.opponentScore) {
                    stat.ties++;
                    stat.tiePoints += game.playerScore;
                    allstat.ties++;
                    allstat.tiePoints += game.playerScore;
                } else {
                    stat.winnerPoints += game.opponentScore;
                    stat.loserPoints += game.playerScore;
                    allstat.winnerPoints += game.opponentScore;
                    allstat.loserPoints += game.playerScore;
                }
            }
        });
        stat.avgPoints = 0;
        stat.avgWinnerPoints = 0;
        stat.avgLoserPoints = 0;
        stat.avgTiePoints = 0;
        if (stat.games > 0) {
            stat.avgPoints = stat.points / stat.games;
            if (stat.games > stat.ties) {
                stat.avgWinnerPoints = stat.winnerPoints / (stat.games - stat.ties);
                stat.avgLoserPoints = stat.loserPoints / (stat.games - stat.ties);
            }
            if (stat.ties > 0) {
                stat.avgTiePoints = stat.tiePoints / stat.ties;
            }
        }
        club.stat = stat;
    });
    if (allstat.games > 0) {
        allstat.avgPoints = allstat.points / allstat.games;
        if (allstat.games > allstat.ties) {
            allstat.avgWinnerPoints = allstat.winnerPoints / (allstat.games - allstat.ties);
            allstat.avgLoserPoints = allstat.loserPoints / (allstat.games - allstat.ties);
        }
        if (allstat.ties > 0) {
            allstat.avgTiePoints = allstat.tiePoints / allstat.ties;
        }
    }
    calcPlayerTotals();
}
function calcPlayerTotals() {
    player_totals = [];
    for (let index = 0; index < club_game_list.length; index++) {
        const game = club_game_list[index];
        let foundPlayer = false;
        let foundOpponent = false;
        for (let index2 = 0; index2 < player_totals.length; index2++) {
            const total = player_totals[index2];
            if (total.name === game.playerName) {
                foundPlayer = true;
                total.for = total.for + game.playerScore;
                total.against = total.against + game.opponentScore;
                if (game.playerScore > game.opponentScore) {
                    total.wins = total.wins + 1;
                }
                if (game.playerScore < game.opponentScore) {
                    total.losses = total.losses + 1;
                }
                if (game.playerScore === game.opponentScore) {
                    total.wins = total.wins + 0.5;
                    total.losses = total.losses + 0.5;
                }
                if (game.playerScore > total.highgame) {
                    total.highgame = game.playerScore;
                }
            }
            if (total.name === game.opponentName) {
                foundOpponent = true;
                total.against = total.against + game.playerScore;
                total.for = total.for + game.opponentScore;
                if (game.playerScore < game.opponentScore) {
                    total.wins = total.wins + 1;
                }
                if (game.playerScore > game.opponentScore) {
                    total.losses = total.losses + 1;
                }
                if (game.playerScore === game.opponentScore) {
                    total.wins = total.wins + 0.5;
                    total.losses = total.losses + 0.5;
                }
                if (game.opponentScore > total.highgame) {
                    total.highgame = game.opponentScore;
                }
            }
        }
        if (!foundPlayer) {
            let total = {
                name: game.playerName,
                for: game.playerScore,
                against: game.opponentScore,
                wins: game.playerScore > game.opponentScore ? 1 : game.playerScore < game.opponentScore ? 0 : 0.5,
                losses: game.playerScore < game.opponentScore ? 1 : game.playerScore > game.opponentScore ? 0 : 0.5,
                highgame: game.playerScore
            };
            player_totals.push(total);
        }
        if (!foundOpponent) {
            let total = {
                name: game.opponentName,
                for: game.opponentScore,
                against: game.playerScore,
                wins: game.playerScore < game.opponentScore ? 1 : game.playerScore > game.opponentScore ? 0 : 0.5,
                losses: game.playerScore > game.opponentScore ? 1 : game.playerScore < game.opponentScore ? 0 : 0.5,
                highgame: game.opponentScore
            };
            player_totals.push(total);
        }
    }
    player_totals.forEach(total => {
        total.avgFor = Math.round(total.for / (total.wins + total.losses));
        total.avgAgainst = Math.round(total.against / (total.wins + total.losses));
        // Head to head
        let h2h = [];
        for (let index = 0; index < club_game_list.length; index++) {
            const game = club_game_list[index];
            if (game.playerName === total.name) {
                let foundOpponent = false;
                for (let index2 = 0; index2 < h2h.length; index2++) {
                    let opponent = h2h[index2];
                    if (opponent.name === game.opponentName) {
                        foundOpponent = true;
                        opponent.pointsFor += game.playerScore;
                        opponent.pointsAgainst += game.opponentScore;
                        if (game.playerScore > game.opponentScore) {
                            opponent.wins++;
                        } else if (game.playerScore === game.opponentScore) {
                            opponent.wins += 0.5;
                            opponent.losses += 0.5;
                        } else {
                            opponent.losses++;
                        }
                    }
                }
                if (!foundOpponent) {
                    let opponent = {name: game.opponentName, pointsFor: game.playerScore, pointsAgainst: game.opponentScore, wins: 0, losses: 0};
                    if (game.playerScore > game.opponentScore) {
                        opponent.wins++;
                    } else if (game.playerScore === game.opponentScore) {
                        opponent.wins += 0.5;
                        opponent.losses += 0.5;
                    } else {
                        opponent.losses++;
                    }
                    h2h.push(opponent);
                }
            }
            // other way round
            if (game.opponentName === total.name) {
                let foundOpponent = false;
                for (let index2 = 0; index2 < h2h.length; index2++) {
                    let opponent = h2h[index2];
                    if (opponent.name === game.playerName) {
                        foundOpponent = true;
                        opponent.pointsFor += game.opponentScore;
                        opponent.pointsAgainst += game.playerScore;
                        if (game.playerScore < game.opponentScore) {
                            opponent.wins++;
                        } else if (game.playerScore === game.opponentScore) {
                            opponent.wins += 0.5;
                            opponent.losses += 0.5;
                        } else {
                            opponent.losses++;
                        }
                    }
                }
                if (!foundOpponent) {
                    let opponent = {name: game.playerName, pointsFor: game.opponentScore, pointsAgainst: game.playerScore, wins: 0, losses: 0};
                    if (game.playerScore < game.opponentScore) {
                        opponent.wins++;
                    } else if (game.playerScore === game.opponentScore) {
                        opponent.wins += 0.5;
                        opponent.losses += 0.5;
                    } else {
                        opponent.losses++;
                    }
                    h2h.push(opponent);
                }
            }
        }
        h2h.forEach(opponent => {
            opponent.avgFor = Math.round(opponent.pointsFor / (opponent.wins + opponent.losses));
            opponent.avgAgainst = Math.round(opponent.pointsAgainst / (opponent.wins + opponent.losses));
        });
        total.h2h = h2h;
    })
    // Game counts
    player_totals.forEach(t => {
        t.numGames = 0;
    })
    club_game_list.forEach(g => {
        let p1 = player_totals.filter(t => { return (t.name === g.playerName); })[0];
        let p2 = player_totals.filter(t => { return (t.name === g.opponentName); })[0];
        p1.numGames = p1.numGames + 1;
        p2.numGames = p2.numGames + 1;
    });
    player_totals.sort(function(a,b) {
        if (a.name.toUpperCase() > b.name.toUpperCase()) {return 1;} // by name
        return -1;});
}

function displayClubsInfo() {
    e_clubs.textContent = ""; // Clear previous
    let e_club_table = document.createElement("table");
    e_clubs.appendChild(e_club_table);

    let e_club_thead = document.createElement("thead");
    e_club_table.appendChild(e_club_thead);
    let e_club_headrow = document.createElement("tr");
    e_club_thead.appendChild(e_club_headrow);
    let e_club_headcol_name = document.createElement("td");
    e_club_headrow.appendChild(e_club_headcol_name);
    e_club_headcol_name.textContent = "Club Name";
    let e_club_headcol_games = document.createElement("td");
    e_club_headrow.appendChild(e_club_headcol_games);
    e_club_headcol_games.textContent = "Games";
    let e_club_headcol_highgame = document.createElement("td");
    e_club_headrow.appendChild(e_club_headcol_highgame);
    e_club_headcol_highgame.textContent = "High Game";

    let e_allclubs_tbody = document.createElement("tbody");
    e_club_table.appendChild(e_allclubs_tbody);
    club_list.forEach(club => {
        // club has id, name, location, openingBalance, openingBalanceDate
        let e_club_row = document.createElement("tr");
        e_allclubs_tbody.appendChild(e_club_row);
        let e_club_col_name = document.createElement("td");
        e_club_row.appendChild(e_club_col_name);
        e_club_col_name.textContent = club.name;
        let e_club_col_games = document.createElement("td");
        e_club_row.appendChild(e_club_col_games);
        e_club_col_games.textContent = formatNumber(club.stat.games);
        e_club_col_games.classList.add("right");
        let e_club_col_highgame = document.createElement("td");
        e_club_row.appendChild(e_club_col_highgame);
        e_club_col_highgame.textContent = formatNumber(club.stat.highgame);
        e_club_col_highgame.classList.add("center");
    });

    // Stats for all clubs
    let e_allclubs_tfoot = document.createElement("tfoot");
    e_club_table.appendChild(e_allclubs_tfoot);
    let e_allclubs_row = document.createElement("tr");
    e_allclubs_tfoot.appendChild(e_allclubs_row);
    let e_allclubs_col_name = document.createElement("td");
    e_allclubs_row.appendChild(e_allclubs_col_name);
    e_allclubs_col_name.textContent = "All clubs";
    let e_allclubs_col_games = document.createElement("td");
    e_allclubs_row.appendChild(e_allclubs_col_games);
    e_allclubs_col_games.textContent = formatNumber(allstat.games);
    e_allclubs_col_games.classList.add("right");
    let e_allclubs_col_highgame = document.createElement("td");
    e_allclubs_row.appendChild(e_allclubs_col_highgame);
    e_allclubs_col_highgame.textContent = formatNumber(allstat.highgame);
    e_allclubs_col_highgame.classList.add("center");
}

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}