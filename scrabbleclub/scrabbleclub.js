const is_mobile = isMobile();
const e_body = document.getElementById("body");
let club_list = [];
let player_list = [];
let club_night_list = [];
let club_game_list = [];
let player_totals = [];
let all_clubs_stat = {games: 0, points: 0, winnerPoints: 0, loserPoints: 0, ties: 0, tiePoints: 0, highgame: 0, avgPoints: 0, avgWinnerPoints: 0, avgLoserPoints: 0, avgTiePoints: 0};

const e_clubs = document.createElement("div");
e_body.appendChild(e_clubs);

const e_players = document.createElement("div");
e_body.appendChild(e_players);

const e_player = document.createElement("div");
e_body.appendChild(e_player);

getInfo().then(() => displayClubsInfo()).then(() => displayPlayersInfo());

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

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
                all_clubs_stat.games++;
                stat.points += (game.playerScore + game.opponentScore);
                all_clubs_stat.points += (game.playerScore + game.opponentScore);
                if (game.playerScore > stat.highgame) {
                    stat.highgame = game.playerScore;
                }
                if (game.playerScore > all_clubs_stat.highgame) {
                    all_clubs_stat.highgame = game.playerScore;
                }
                if (game.opponentScore > stat.highgame) {
                    stat.highgame = game.opponentScore;
                }
                if (game.opponentScore > all_clubs_stat.highgame) {
                    all_clubs_stat.highgame = game.opponentScore;
                }
                if (game.playerScore > game.opponentScore) {
                    stat.winnerPoints += game.playerScore;
                    stat.loserPoints += game.opponentScore;
                    all_clubs_stat.winnerPoints += game.playerScore;
                    all_clubs_stat.loserPoints += game.opponentScore;
                } else if (game.playerScore === game.opponentScore) {
                    stat.ties++;
                    stat.tiePoints += game.playerScore;
                    all_clubs_stat.ties++;
                    all_clubs_stat.tiePoints += game.playerScore;
                } else {
                    stat.winnerPoints += game.opponentScore;
                    stat.loserPoints += game.playerScore;
                    all_clubs_stat.winnerPoints += game.opponentScore;
                    all_clubs_stat.loserPoints += game.playerScore;
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
    if (all_clubs_stat.games > 0) {
        all_clubs_stat.avgPoints = all_clubs_stat.points / all_clubs_stat.games;
        if (all_clubs_stat.games > all_clubs_stat.ties) {
            all_clubs_stat.avgWinnerPoints = all_clubs_stat.winnerPoints / (all_clubs_stat.games - all_clubs_stat.ties);
            all_clubs_stat.avgLoserPoints = all_clubs_stat.loserPoints / (all_clubs_stat.games - all_clubs_stat.ties);
        }
        if (all_clubs_stat.ties > 0) {
            all_clubs_stat.avgTiePoints = all_clubs_stat.tiePoints / all_clubs_stat.ties;
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
        h2h.sort(function(a,b) {
            if (a.name.toUpperCase() > b.name.toUpperCase()) {return 1;} // by name
            return -1;
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

    let e_clubs_title = document.createElement("h1");
    e_clubs.appendChild(e_clubs_title);
    e_clubs_title.textContent = "Clubs";

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

    let e_clubs_tbody = document.createElement("tbody");
    e_club_table.appendChild(e_clubs_tbody);
    club_list.forEach(club => {
        let e_club_row = document.createElement("tr");
        e_clubs_tbody.appendChild(e_club_row);
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
    let e_clubs_tfoot = document.createElement("tfoot");
    e_club_table.appendChild(e_clubs_tfoot);
    let e_clubs_footrow = document.createElement("tr");
    e_clubs_tfoot.appendChild(e_clubs_footrow);
    let e_clubs_footcol_name = document.createElement("td");
    e_clubs_footrow.appendChild(e_clubs_footcol_name);
    e_clubs_footcol_name.textContent = "All clubs";
    let e_clubs_footcol_games = document.createElement("td");
    e_clubs_footrow.appendChild(e_clubs_footcol_games);
    e_clubs_footcol_games.textContent = formatNumber(all_clubs_stat.games);
    e_clubs_footcol_games.classList.add("right");
    let e_clubs_footcol_highgame = document.createElement("td");
    e_clubs_footrow.appendChild(e_clubs_footcol_highgame);
    e_clubs_footcol_highgame.textContent = formatNumber(all_clubs_stat.highgame);
    e_clubs_footcol_highgame.classList.add("center");
}

function displayPlayersInfo() {
    e_players.textContent = ""; // Clear previous

    let e_players_title = document.createElement("h1");
    e_players.appendChild(e_players_title);
    e_players_title.textContent = "Players (click player for info)";

    let e_player_table = document.createElement("table");
    e_players.appendChild(e_player_table);

    let e_player_thead = document.createElement("thead");
    e_player_table.appendChild(e_player_thead);

    let e_player_headrow = document.createElement("tr");
    e_player_thead.appendChild(e_player_headrow);

    let e_player_headcol_name = document.createElement("td");
    e_player_headrow.appendChild(e_player_headcol_name);
    e_player_headcol_name.textContent = "Player Name";

    let e_player_headcol_wins = document.createElement("td");
    e_player_headrow.appendChild(e_player_headcol_wins);
    e_player_headcol_wins.textContent = "Wins";

    let e_player_headcol_losses = document.createElement("td");
    e_player_headrow.appendChild(e_player_headcol_losses);
    e_player_headcol_losses.textContent = "Losses";

    let e_player_headcol_highgame = document.createElement("td");
    e_player_headrow.appendChild(e_player_headcol_highgame);
    e_player_headcol_highgame.textContent = "High Game";

    let e_players_tbody = document.createElement("tbody");
    e_player_table.appendChild(e_players_tbody);
    player_totals.forEach(player_total => {
        if (!is_mobile || (player_total.wins + player_total.losses >= 39)) {
            let e_player_row = document.createElement("tr");
            e_players_tbody.appendChild(e_player_row);
            e_player_row.addEventListener("click", () => selectPlayer(player_total));
    
            let e_player_col_name = document.createElement("td");
            e_player_row.appendChild(e_player_col_name);
            e_player_col_name.textContent = player_total.name;
    
    
            let e_player_col_wins = document.createElement("td");
            e_player_row.appendChild(e_player_col_wins);
            e_player_col_wins.textContent = formatNumber(player_total.wins);
            e_player_col_wins.classList.add("right");
    
            let e_player_col_losses = document.createElement("td");
            e_player_row.appendChild(e_player_col_losses);
            e_player_col_losses.textContent = formatNumber(player_total.losses);
            e_player_col_losses.classList.add("right");
    
            let e_player_col_highgame = document.createElement("td");
            e_player_row.appendChild(e_player_col_highgame);
            e_player_col_highgame.textContent = formatNumber(player_total.highgame);
            e_player_col_highgame.classList.add("center");
        }
    });
}

function selectPlayer(player_total) {
    e_player.textContent = ""; // Clear previous

    let e_player_title = document.createElement("h1");
    e_player.appendChild(e_player_title);
    e_player_title.textContent = `${player_total.name}`;

    let e_done = document.createElement("button");
    e_player_title.appendChild(e_done);
    e_done.textContent = "CLOSE";
    e_done.addEventListener("click", () => closeHeadToHead());

    let e_h2h_table = document.createElement("table");
    e_player.appendChild(e_h2h_table);

    let e_h2h_thead = document.createElement("thead");
    e_h2h_table.appendChild(e_h2h_thead);

    let e_h2h_headrow = document.createElement("tr");
    e_h2h_thead.appendChild(e_h2h_headrow);

    let e_h2h_headcol_name = document.createElement("td");
    e_h2h_headrow.appendChild(e_h2h_headcol_name);
    e_h2h_headcol_name.textContent = "Opponent Name";

    let e_h2h_headcol_wins = document.createElement("td");
    e_h2h_headrow.appendChild(e_h2h_headcol_wins);
    e_h2h_headcol_wins.textContent = "Wins";

    let e_h2h_headcol_losses = document.createElement("td");
    e_h2h_headrow.appendChild(e_h2h_headcol_losses);
    e_h2h_headcol_losses.textContent = "Losses";

    let e_h2h_headcol_spread = document.createElement("td");
    e_h2h_headrow.appendChild(e_h2h_headcol_spread);
    e_h2h_headcol_spread.textContent = "Spread";

    let e_h2h_tbody = document.createElement("tbody");
    e_h2h_table.appendChild(e_h2h_tbody);

    player_total.h2h.forEach(h2h => {
        let e_h2h_row = document.createElement("tr");
        e_h2h_tbody.appendChild(e_h2h_row);

        let e_h2h_col_name = document.createElement("td");
        e_h2h_row.appendChild(e_h2h_col_name);
        e_h2h_col_name.textContent = h2h.name;


        let e_h2h_col_wins = document.createElement("td");
        e_h2h_row.appendChild(e_h2h_col_wins);
        e_h2h_col_wins.textContent = formatNumber(h2h.wins);
        e_h2h_col_wins.classList.add("right");

        let e_h2h_col_losses = document.createElement("td");
        e_h2h_row.appendChild(e_h2h_col_losses);
        e_h2h_col_losses.textContent = formatNumber(h2h.losses);
        e_h2h_col_losses.classList.add("right");

        let e_h2h_col_spread = document.createElement("td");
        e_h2h_row.appendChild(e_h2h_col_spread);
        e_h2h_col_spread.textContent = formatNumber(h2h.pointsFor - h2h.pointsAgainst);
        e_h2h_col_spread.classList.add("center");
    });
    e_players.style.display = "none"; // So they can see head to head without scrolling down
}

function closeHeadToHead() {
    e_players.style.display = "block";
    e_player.textContent = "";
}

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
