let players = [];
let previousRoundPlayers = []; // To store players from the previous round

// Function to Generate Players with Input Fields for Ratings
function generatePlayers() {
  const numPlayers = parseInt(document.getElementById("numPlayers").value);
  if (isNaN(numPlayers) || numPlayers < 1 || numPlayers > 10) {
    alert("Please enter a valid number of players between 1 and 10.");
    return;
  }

  players = [];
  const playersContainer = document.querySelector(".players-container");
  playersContainer.innerHTML = ""; // Clear previous players

  for (let i = 1; i <= numPlayers; i++) {
    const playerDiv = document.createElement("div");
    playerDiv.classList.add("player");

    playerDiv.innerHTML = `
      Player ${i} <input type="number" value="0.0" min="0" max="100" step="0.1" id="rating${i}" onchange="updatePlayerRating(${i})">
    `;
    players.push({ id: i, name: `Player ${i}`, rating: 0.0 });
    playersContainer.appendChild(playerDiv);
  }

  // Enable Generate Matches button only after players are generated
  document.getElementById("generateMatchesBtn").disabled = false;
}

// Function to Update Player Ratings
function updatePlayerRating(playerId) {
  const rating = parseFloat(
    document.getElementById(`rating${playerId}`).value
  ).toFixed(1);
  players.find((player) => player.id === playerId).rating = parseFloat(rating);
}

// Function to Generate Matches and Assign Courts
function generateMatches() {
  const numCourts = parseInt(document.getElementById("numCourts").value);

  if (isNaN(numCourts) || numCourts < 1 || numCourts > 2) {
    alert("Please enter a valid number of courts (maximum 2).");
    return;
  }

  const totalPlayers = players.length;
  if (totalPlayers < 2) {
    alert("Please generate at least 2 players to create matches.");
    return;
  }

  const maxPlayersInMatch = numCourts * 4;

  // Filter players based on their ratings and prioritize ones who haven't played in previous rounds
  const sortedPlayers = [...players].sort((a, b) => b.rating - a.rating);
  const playersInPlay = sortedPlayers.filter(
    (player) => !previousRoundPlayers.includes(player.id)
  );

  // Add back players from the previous round if fewer than maxPlayersInMatch available
  if (playersInPlay.length < maxPlayersInMatch) {
    const remainingPlayers = sortedPlayers.filter((player) =>
      previousRoundPlayers.includes(player.id)
    );
    playersInPlay.push(...remainingPlayers);
  }

  // Limit the number of players to maxPlayersInMatch
  const selectedPlayers = playersInPlay.slice(0, maxPlayersInMatch);

  // Store the players selected in this round for the next round
  previousRoundPlayers = selectedPlayers.map((player) => player.id);

  const matchesContainer = document.querySelector(".matches-container");
  matchesContainer.innerHTML = "";

  // Split players for court distribution and match types (1v1 or 2v2)
  const matches = [];
  let playersForMatches = [...selectedPlayers];

  // Counter for match index
  let matchIndex = 1;

  while (playersForMatches.length > 0) {
    const courtMatches = [];
    if (playersForMatches.length >= 4 && Math.random() > 0.5) {
      // Generate 2v2 match
      courtMatches.push({
        players: playersForMatches.splice(0, 4),
        type: "2v2",
      });
    } else {
      // Generate 1v1 match
      courtMatches.push({
        players: playersForMatches.splice(0, 2),
        type: "1v1",
      });
    }
    matches.push(courtMatches);
  }

  // Display matches on courts
  for (let court = 1; court <= numCourts; court++) {
    const matchContainer = document.createElement("div");
    matchContainer.classList.add("match-container");

    const matchesForCourt = matches[court - 1];
    matchContainer.innerHTML = `<h3>Court ${court}</h3>`;

    matchesForCourt.forEach((match) => {
      const matchDiv = document.createElement("div");
      matchDiv.classList.add("match");

      // Add index to match
      matchDiv.innerHTML = `<span class="match-index">${matchIndex++}.</span> `;

      if (match.type === "2v2") {
        matchDiv.innerHTML += `
          <span>${match.players[0].name} (Rating: ${match.players[0].rating}) & ${match.players[1].name} (Rating: ${match.players[1].rating})
          vs
          ${match.players[2].name} (Rating: ${match.players[2].rating}) & ${match.players[3].name} (Rating: ${match.players[3].rating})</span>
        `;
      } else {
        matchDiv.innerHTML += `
          <span>${match.players[0].name} (Rating: ${match.players[0].rating})
          vs
          ${match.players[1].name} (Rating: ${match.players[1].rating})</span>
        `;
      }

      matchContainer.appendChild(matchDiv);
    });

    matchesContainer.appendChild(matchContainer);
  }
}
