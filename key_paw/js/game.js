/* ============================================
   GAME LOGIC - Pure Functions
   Dreidel Game State & Rules
   ============================================ */

/**
 * The four dreidel faces.
 */
var FACES = Object.freeze(['nun', 'gimmel', 'hey', 'shin']);

/**
 * Descriptions for each dreidel face result.
 */
var FACE_INFO = Object.freeze({
    nun: {
        hebrew: '\u05E0',
        name: 'Nun',
        yiddish: 'Nisht (Nothing)',
        description: 'Nothing happens! The next player spins.'
    },
    gimmel: {
        hebrew: '\u05D2',
        name: 'Gimmel',
        yiddish: 'Gantz (All)',
        description: 'Takes ALL the chocolate coins from the pot!'
    },
    hey: {
        hebrew: '\u05D4',
        name: 'Hey',
        yiddish: 'Halb (Half)',
        description: 'Takes HALF the chocolate coins from the pot!'
    },
    shin: {
        hebrew: '\u05E9',
        name: 'Shin',
        yiddish: 'Shtel (Put in)',
        description: 'Puts 2 chocolate coins into the pot!'
    }
});

/**
 * Starting coins per player.
 */
var STARTING_COINS = 10;

/**
 * Default player data.
 */
var DEFAULT_PLAYERS = Object.freeze([
    { name: 'Key Paw',    image: 'images/player_1_key_paw.png',      isHuman: true  },
    { name: 'Teddy',      image: 'images/player_2_teddy.png',        isHuman: false },
    { name: 'Rosy',       image: 'images/player_3_rosey.png',        isHuman: false },
    { name: 'Heart Girl', image: 'images/player_4_heart_girl.png',   isHuman: false }
]);


/* ---------- State Creation ---------- */

/**
 * Creates the initial game state.
 * @param {Array} playerConfigs - Array of {name, image, isHuman} objects.
 * @returns {object} A fresh game state.
 */
function createGameState(playerConfigs) {
    var players = playerConfigs.map(function (cfg) {
        return {
            name: cfg.name,
            image: cfg.image,
            isHuman: cfg.isHuman,
            coins: STARTING_COINS,
            isOut: false
        };
    });

    return {
        players: players,
        pot: 0,
        currentPlayerIndex: 0,
        isSpinning: false,
        gameOver: false,
        winnerIndex: -1
    };
}


/* ---------- Ante ---------- */

/**
 * Each active player puts 1 coin into the pot (initial ante).
 * @param {object} state - Current game state.
 * @returns {object} New state after ante.
 */
function applyAnte(state) {
    var newPlayers = deepCopyPlayers(state.players);
    var potAdd = 0;

    newPlayers.forEach(function (player) {
        if (!player.isOut && player.coins > 0) {
            player.coins -= 1;
            potAdd += 1;
        }
    });

    return assignState(state, {
        players: markEliminated(newPlayers),
        pot: state.pot + potAdd
    });
}


/* ---------- Spin Result ---------- */

/**
 * Returns a random dreidel face.
 * @returns {string} One of 'nun', 'gimmel', 'hey', 'shin'.
 */
function getRandomFace() {
    return FACES[Math.floor(Math.random() * 4)];
}

/**
 * Applies the result of a spin to the game state.
 * Pure function — returns a new state.
 * @param {object} state - Current game state.
 * @param {number} playerIndex - Index of the spinning player.
 * @param {string} face - The dreidel face result.
 * @returns {object} New game state after applying the result.
 */
function applySpinResult(state, playerIndex, face) {
    var newPlayers = deepCopyPlayers(state.players);
    var player = newPlayers[playerIndex];
    var newPot = state.pot;

    switch (face) {
        case 'nun':
            // Do nothing
            break;

        case 'gimmel':
            // Take all from pot
            player.coins += newPot;
            newPot = 0;
            break;

        case 'hey':
            // Take half from pot (round up)
            var half = Math.ceil(newPot / 2);
            player.coins += half;
            newPot -= half;
            break;

        case 'shin':
            // Put 2 coins in pot (or all remaining if fewer than 2)
            var amount = Math.min(2, player.coins);
            player.coins -= amount;
            newPot += amount;
            break;
    }

    return assignState(state, {
        players: markEliminated(newPlayers),
        pot: newPot
    });
}

/**
 * Builds a human-readable description of a spin result.
 * @param {string} playerName - Name of the player who spun.
 * @param {string} face - The dreidel face.
 * @param {number} potBefore - Pot value before the spin.
 * @returns {string} Description HTML.
 */
function buildResultDescription(playerName, face, potBefore) {
    var info = FACE_INFO[face];
    var hebrewChar = info.hebrew;
    var faceName = info.name;
    var detail = '';

    switch (face) {
        case 'nun':
            detail = playerName + ' does nothing. Next player\u2019s turn!';
            break;
        case 'gimmel':
            detail = playerName + ' takes all ' + potBefore + ' chocolate coins from the pot!';
            break;
        case 'hey':
            var taken = Math.ceil(potBefore / 2);
            detail = playerName + ' takes ' + taken + ' chocolate coin' + (taken !== 1 ? 's' : '') + ' from the pot!';
            break;
        case 'shin':
            detail = playerName + ' puts 2 chocolate coins into the pot!';
            break;
    }

    return '<span class="result-hebrew">' + hebrewChar + '</span>' +
           '<span class="result-face">' + faceName + ' \u2014 ' + info.yiddish + '</span>' +
           detail;
}


/* ---------- Pot Refill ---------- */

/**
 * If the pot is empty, each active player donates 1 coin.
 * @param {object} state - Current game state.
 * @returns {object} New state (unchanged if pot wasn't empty).
 */
function refillPotIfEmpty(state) {
    if (state.pot > 0) {
        return state;
    }

    var newPlayers = deepCopyPlayers(state.players);
    var potAdd = 0;

    newPlayers.forEach(function (player) {
        if (!player.isOut && player.coins > 0) {
            player.coins -= 1;
            potAdd += 1;
        }
    });

    if (potAdd === 0) {
        return state;
    }

    return assignState(state, {
        players: markEliminated(newPlayers),
        pot: state.pot + potAdd
    });
}


/* ---------- Turn Management ---------- */

/**
 * Returns the index of the next active (non-eliminated) player.
 * @param {object} state - Current game state.
 * @param {number} currentIndex - Current player index.
 * @returns {number} Next active player index.
 */
function getNextPlayerIndex(state, currentIndex) {
    var count = state.players.length;

    for (var i = 1; i <= count; i++) {
        var idx = (currentIndex + i) % count;
        if (!state.players[idx].isOut) {
            return idx;
        }
    }

    return currentIndex;
}


/* ---------- Win Conditions ---------- */

/**
 * Returns the list of active (non-eliminated) players.
 * @param {object} state - Current game state.
 * @returns {Array} Active players.
 */
function getActivePlayers(state) {
    return state.players.filter(function (p) { return !p.isOut; });
}

/**
 * Checks if the game is over (1 or fewer active players).
 * @param {object} state - Current game state.
 * @returns {boolean}
 */
function isGameOver(state) {
    return getActivePlayers(state).length <= 1;
}

/**
 * Returns the index of the winning player, or -1 if game isn't over.
 * @param {object} state - Current game state.
 * @returns {number}
 */
function getWinnerIndex(state) {
    var active = state.players
        .map(function (p, i) { return { player: p, index: i }; })
        .filter(function (entry) { return !entry.player.isOut; });

    if (active.length === 1) {
        return active[0].index;
    }
    return -1;
}

/**
 * Checks if the human player (index 0) is eliminated.
 * @param {object} state - Current game state.
 * @returns {boolean}
 */
function isHumanPlayerOut(state) {
    return state.players[0].isOut;
}


/* ---------- Helpers (Internal) ---------- */

/**
 * Deep copies the players array.
 */
function deepCopyPlayers(players) {
    return players.map(function (p) {
        return {
            name: p.name,
            image: p.image,
            isHuman: p.isHuman,
            coins: p.coins,
            isOut: p.isOut
        };
    });
}

/**
 * Marks players with 0 coins as eliminated.
 */
function markEliminated(players) {
    return players.map(function (p) {
        if (p.coins <= 0 && !p.isOut) {
            return assignPlayer(p, { coins: 0, isOut: true });
        }
        return p;
    });
}

/**
 * Creates a new state object with overridden properties.
 */
function assignState(state, overrides) {
    return {
        players: overrides.players !== undefined ? overrides.players : state.players,
        pot: overrides.pot !== undefined ? overrides.pot : state.pot,
        currentPlayerIndex: overrides.currentPlayerIndex !== undefined ? overrides.currentPlayerIndex : state.currentPlayerIndex,
        isSpinning: overrides.isSpinning !== undefined ? overrides.isSpinning : state.isSpinning,
        gameOver: overrides.gameOver !== undefined ? overrides.gameOver : state.gameOver,
        winnerIndex: overrides.winnerIndex !== undefined ? overrides.winnerIndex : state.winnerIndex
    };
}

/**
 * Creates a new player object with overridden properties.
 */
function assignPlayer(player, overrides) {
    return {
        name: overrides.name !== undefined ? overrides.name : player.name,
        image: overrides.image !== undefined ? overrides.image : player.image,
        isHuman: overrides.isHuman !== undefined ? overrides.isHuman : player.isHuman,
        coins: overrides.coins !== undefined ? overrides.coins : player.coins,
        isOut: overrides.isOut !== undefined ? overrides.isOut : player.isOut
    };
}
