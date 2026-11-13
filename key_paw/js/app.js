/* ============================================
   APP CONTROLLER
   Title screen, game flow, UI updates, events
   ============================================ */

(function () {
    'use strict';

    /* ---------- State ---------- */

    var state = null;
    var isProcessingTurn = false;
    var currentGameConfig = null;

    /* ---------- Device Detection ---------- */

    function isTouchDevice() {
        return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    }

    /* ---------- DOM References ---------- */

    function getTitleScreen()      { return document.getElementById('title-screen'); }
    function getGameScreen()       { return document.getElementById('game-screen'); }
    function getDesktopSpinPrompt(){ return document.getElementById('spin-prompt-desktop'); }
    function getMobileSpinBtn()    { return document.getElementById('spin-btn-mobile'); }
    function getActionBarDesktop() { return document.getElementById('action-bar-desktop'); }
    function getActionBarMobile()  { return document.getElementById('action-bar-mobile'); }

    /* ---------- Initialization ---------- */

    function init() {
        bindTitleScreenEvents();
    }

    /* ---------- Title Screen ---------- */

    function bindTitleScreenEvents() {
        document.addEventListener('keydown', onTitleKeydown);

        var startBtn = document.getElementById('start-btn-mobile');
        if (startBtn) {
            startBtn.addEventListener('click', onStartClick);
        }
    }

    function onTitleKeydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.removeEventListener('keydown', onTitleKeydown);
            promptForPlayerCount();
        }
    }

    function onStartClick() {
        var startBtn = document.getElementById('start-btn-mobile');
        if (startBtn) {
            startBtn.removeEventListener('click', onStartClick);
        }
        promptForPlayerCount();
    }

    /* ---------- Player Count Popup ---------- */

    function promptForPlayerCount() {
        Swal.fire({
            title: 'How many players?',
            input: 'number',
            inputValue: 1,
            inputAttributes: {
                min: 1,
                max: 4,
                step: 1
            },
            confirmButtonText: 'Next',
            allowOutsideClick: false,
            allowEscapeKey: false,
            customClass: {
                popup: 'hanukkah-popup'
            },
            inputValidator: function (value) {
                var num = parseInt(value, 10);
                if (isNaN(num) || num < 1 || num > 4) {
                    return 'Please enter a number between 1 and 4';
                }
                return null;
            }
        }).then(function (result) {
            var count = parseInt(result.value, 10);
            if (count === 1) {
                promptForName();
            } else {
                promptForMultiPlayerNames(count);
            }
        });
    }

    /* ---------- Single Player Name Popup ---------- */

    function promptForName() {
        Swal.fire({
            title: 'What\u2019s your name?',
            input: 'text',
            inputPlaceholder: 'Key Paw',
            confirmButtonText: 'Let\u2019s Play!',
            allowOutsideClick: false,
            allowEscapeKey: false,
            customClass: {
                popup: 'hanukkah-popup'
            },
            inputValidator: function () {
                return null;
            }
        }).then(function (result) {
            var name = (result.value && result.value.trim()) || 'Key Paw';
            var config = {
                mode: 'single',
                humanCount: 1,
                playerConfigs: [
                    { name: name,         image: DEFAULT_PLAYERS[0].image, isHuman: true  },
                    { name: 'Teddy',      image: DEFAULT_PLAYERS[1].image, isHuman: false },
                    { name: 'Rosy',       image: DEFAULT_PLAYERS[2].image, isHuman: false },
                    { name: 'Heart Girl', image: DEFAULT_PLAYERS[3].image, isHuman: false }
                ]
            };
            transitionToGame(config);
        });
    }

    /* ---------- Multi-Player Names Popup ---------- */

    function promptForMultiPlayerNames(count) {
        var placeholders = ['Key Paw', 'Teddy', 'Rosy', 'Heart Girl'];
        var inputsHtml = '';
        for (var i = 0; i < count; i++) {
            inputsHtml += '<input id="swal-player-' + i + '" ' +
                'class="swal2-input multiplayer-name-input" ' +
                'placeholder="' + placeholders[i] + '" ' +
                'maxlength="20">';
        }

        Swal.fire({
            title: 'Enter Player Names',
            html: inputsHtml,
            confirmButtonText: 'Let\u2019s Play!',
            allowOutsideClick: false,
            allowEscapeKey: false,
            customClass: {
                popup: 'hanukkah-popup'
            },
            focusConfirm: false,
            preConfirm: function () {
                var configs = [];
                for (var i = 0; i < count; i++) {
                    var input = document.getElementById('swal-player-' + i);
                    var val = (input.value && input.value.trim()) || placeholders[i];
                    configs.push({
                        name: val,
                        image: DEFAULT_PLAYERS[i].image,
                        isHuman: true
                    });
                }
                return configs;
            }
        }).then(function (result) {
            var config = {
                mode: 'multi',
                humanCount: count,
                playerConfigs: result.value
            };
            transitionToGame(config);
        });
    }

    /* ---------- Screen Transitions ---------- */

    function transitionToGame(config) {
        currentGameConfig = config;

        var titleScreen = getTitleScreen();
        var gameScreen = getGameScreen();

        titleScreen.classList.add('fade-out');

        setTimeout(function () {
            titleScreen.classList.add('hidden');
            titleScreen.classList.remove('fade-out');

            gameScreen.classList.remove('hidden');
            gameScreen.style.opacity = '0';

            void gameScreen.offsetHeight;

            gameScreen.style.transition = 'opacity 0.6s ease-in-out';
            gameScreen.style.opacity = '1';

            startGame(config);
        }, 600);
    }

    function goToTitleScreen() {
        unbindGameEvents();
        resetDreidel();
        showDescription('Spin the dreidel to begin!');
        isProcessingTurn = false;
        state = null;
        currentGameConfig = null;

        var gameScreen = getGameScreen();
        var titleScreen = getTitleScreen();

        gameScreen.classList.add('hidden');
        gameScreen.style.opacity = '';
        gameScreen.style.transition = '';

        titleScreen.classList.remove('hidden');
        titleScreen.style.opacity = '1';

        bindTitleScreenEvents();
    }

    /* ---------- Game Start ---------- */

    function startGame(config) {
        state = createGameState(config.playerConfigs);

        // Initial ante: each player puts 1 coin into the pot
        state = applyAnte(state);

        // Render player cards/rows dynamically
        renderDynamicPlayers(config.playerConfigs);

        // Render initial state
        renderFullUI();

        // Bind game event handlers
        bindGameEvents();

        // Small delay then start first turn
        setTimeout(function () {
            beginTurn();
        }, 800);
    }

    /* ---------- Dynamic Player Rendering ---------- */

    function renderDynamicPlayers(playerConfigs) {
        var count = playerConfigs.length;

        // --- Desktop ---
        var topRow = document.getElementById('desktop-players-top');
        var bottomRow = document.getElementById('desktop-players-bottom');
        topRow.innerHTML = '';
        bottomRow.innerHTML = '';

        // Layout: 1=bottom-left; 2=diagonal; 3=1 bottom+2 top; 4=original
        playerConfigs.forEach(function (cfg, i) {
            var card = createDesktopPlayerCard(cfg, i);
            if (count === 1) {
                bottomRow.appendChild(card);
            } else if (count === 2) {
                if (i === 0) bottomRow.appendChild(card);
                else topRow.appendChild(card);
            } else if (count === 3) {
                if (i === 0) bottomRow.appendChild(card);
                else topRow.appendChild(card);
            } else {
                if (i === 0 || i === 2) bottomRow.appendChild(card);
                else topRow.appendChild(card);
            }
        });

        // --- Mobile ---
        var mobileList = document.getElementById('mobile-players-list');
        mobileList.innerHTML = '';

        playerConfigs.forEach(function (cfg, i) {
            var row = createMobilePlayerRow(cfg, i);
            mobileList.appendChild(row);
        });
    }

    function createDesktopPlayerCard(cfg, index) {
        var card = document.createElement('div');
        card.className = 'player-card';
        card.setAttribute('data-player-index', index);
        card.id = 'pc-desktop-' + index;

        card.innerHTML =
            '<img src="' + cfg.image + '" alt="' + cfg.name + '" class="player-avatar">' +
            '<div class="player-details">' +
                '<span class="player-name font-heading">' + cfg.name + '</span>' +
                '<span class="player-coins font-body">' +
                    '<span class="coin-icon">&#x1FA99;</span> ' +
                    '<span class="coin-count">' + STARTING_COINS + '</span>' +
                '</span>' +
            '</div>';

        return card;
    }

    function createMobilePlayerRow(cfg, index) {
        var row = document.createElement('div');
        row.className = 'player-row';
        row.setAttribute('data-player-index', index);
        row.id = 'pc-mobile-' + index;

        row.innerHTML =
            '<img src="' + cfg.image + '" alt="' + cfg.name + '" class="player-row-avatar">' +
            '<span class="player-row-name font-heading flex-1">' + cfg.name + '</span>' +
            '<span class="player-row-coins font-body">' +
                '<span class="coin-icon">&#x1FA99;</span> ' +
                '<span class="coin-count">' + STARTING_COINS + '</span>' +
            '</span>';

        return row;
    }

    /* ---------- Event Binding ---------- */

    function bindGameEvents() {
        // Desktop: any key to spin
        document.addEventListener('keydown', onGameKeydown);

        // Mobile: spin button
        var spinBtn = document.getElementById('spin-btn-mobile');
        if (spinBtn) {
            spinBtn.addEventListener('click', onSpinButtonClick);
        }

        // Mobile: shake to spin
        if (isTouchDevice() && window.DeviceMotionEvent) {
            bindShakeDetection();
        }

        // Desktop: mouse shake to spin
        if (!isTouchDevice()) {
            document.addEventListener('mousemove', onMouseMove);
        }
    }

    function unbindGameEvents() {
        document.removeEventListener('keydown', onGameKeydown);

        var spinBtn = document.getElementById('spin-btn-mobile');
        if (spinBtn) {
            spinBtn.removeEventListener('click', onSpinButtonClick);
        }

        unbindShakeDetection();

        // Mouse shake cleanup
        document.removeEventListener('mousemove', onMouseMove);
        lastMouseX = null;
        lastMouseDirection = 0;
        mouseSegmentDistance = 0;
        mouseDirectionChanges = [];
    }

    /* ---------- Shake Detection ---------- */

    var shakeThreshold = 25;
    var lastShakeTime = 0;
    var shakeCooldown = 1000;
    var lastAcceleration = { x: 0, y: 0, z: 0 };

    function onDeviceMotion(e) {
        var acc = e.accelerationIncludingGravity;
        if (!acc) return;

        var dx = Math.abs(acc.x - lastAcceleration.x);
        var dy = Math.abs(acc.y - lastAcceleration.y);
        var dz = Math.abs(acc.z - lastAcceleration.z);

        lastAcceleration = { x: acc.x || 0, y: acc.y || 0, z: acc.z || 0 };

        if ((dx + dy + dz) > shakeThreshold) {
            var now = Date.now();
            if (now - lastShakeTime > shakeCooldown) {
                lastShakeTime = now;
                handleHumanSpin();
            }
        }
    }

    function bindShakeDetection() {
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            DeviceMotionEvent.requestPermission()
                .then(function (response) {
                    if (response === 'granted') {
                        window.addEventListener('devicemotion', onDeviceMotion);
                    }
                })
                .catch(function () {
                    // Permission denied
                });
        } else {
            window.addEventListener('devicemotion', onDeviceMotion);
        }
    }

    function unbindShakeDetection() {
        window.removeEventListener('devicemotion', onDeviceMotion);
    }

    /* ---------- Mouse Shake Detection (Desktop) ---------- */

    var mouseShakeThreshold = 3;
    var mouseShakeTimeWindow = 600;
    var mouseShakeMinDistance = 40;
    var mouseShakeCooldown = 1000;
    var lastMouseShakeTime = 0;
    var mouseDirectionChanges = [];
    var lastMouseX = null;
    var lastMouseDirection = 0;
    var mouseSegmentDistance = 0;

    function onMouseMove(e) {
        // Ignore if SweetAlert is open
        if (Swal.isVisible()) return;

        if (lastMouseX === null) {
            lastMouseX = e.clientX;
            return;
        }

        var dx = e.clientX - lastMouseX;
        lastMouseX = e.clientX;

        if (Math.abs(dx) < 2) return;

        var direction = dx > 0 ? 1 : -1;

        if (direction === lastMouseDirection || lastMouseDirection === 0) {
            mouseSegmentDistance += Math.abs(dx);
            lastMouseDirection = direction;
        } else {
            if (mouseSegmentDistance >= mouseShakeMinDistance) {
                var now = Date.now();

                mouseDirectionChanges = mouseDirectionChanges.filter(function (t) {
                    return now - t < mouseShakeTimeWindow;
                });

                mouseDirectionChanges.push(now);

                if (mouseDirectionChanges.length >= mouseShakeThreshold) {
                    if (now - lastMouseShakeTime > mouseShakeCooldown) {
                        lastMouseShakeTime = now;
                        mouseDirectionChanges = [];
                        handleHumanSpin();
                    }
                }
            }

            mouseSegmentDistance = Math.abs(dx);
            lastMouseDirection = direction;
        }
    }

    /* ---------- Event Handlers ---------- */

    function onGameKeydown(e) {
        if (Swal.isVisible()) return;
        e.preventDefault();
        handleHumanSpin();
    }

    function onSpinButtonClick() {
        handleHumanSpin();
    }

    /* ---------- Turn Flow ---------- */

    function beginTurn() {
        if (state.gameOver) return;

        var playerIndex = state.currentPlayerIndex;
        var player = state.players[playerIndex];

        highlightActivePlayer(playerIndex);

        if (player.isHuman) {
            showSpinPrompt(player.name);
        } else {
            hideSpinPrompt();
            showDescription(player.name + ' is spinning\u2026');

            setTimeout(function () {
                executeComputerSpin(playerIndex);
            }, 1200);
        }
    }

    function handleHumanSpin() {
        if (isProcessingTurn) return;
        if (state.gameOver) return;

        var playerIndex = state.currentPlayerIndex;
        var player = state.players[playerIndex];

        if (!player.isHuman) return;

        executeSpin(playerIndex);
    }

    function executeComputerSpin(playerIndex) {
        executeSpin(playerIndex);
    }

    function executeSpin(playerIndex) {
        if (isProcessingTurn) return;
        isProcessingTurn = true;

        hideSpinPrompt();

        var face = getRandomFace();
        var potBefore = state.pot;
        var playerName = state.players[playerIndex].name;

        spinDreidel(face, function () {
            state = applySpinResult(state, playerIndex, face);

            var desc = buildResultDescription(playerName, face, potBefore);
            showDescription(desc);

            renderCoins();
            renderPot();

            state = refillPotIfEmpty(state);
            renderCoins();
            renderPot();

            renderPlayerStates();

            if (checkAndHandleGameOver()) {
                isProcessingTurn = false;
                return;
            }

            setTimeout(function () {
                advanceToNextPlayer();
                isProcessingTurn = false;
                beginTurn();
            }, 2800);
        });
    }

    function advanceToNextPlayer() {
        var nextIndex = getNextPlayerIndex(state, state.currentPlayerIndex);
        state = assignState(state, { currentPlayerIndex: nextIndex });
    }

    /* ---------- Game Over Handling ---------- */

    function checkAndHandleGameOver() {
        if (isGameOver(state) && !state.gameOver) {
            var winnerIdx = getWinnerIndex(state);
            state = assignState(state, { gameOver: true, winnerIndex: winnerIdx });
            setTimeout(function () { showGameOverPopup(state.players[winnerIdx]); }, 1200);
            return true;
        }
        return false;
    }

    function showGameOverPopup(winner) {
        unbindGameEvents();

        var htmlContent = '<div class="game-over-content">' +
            '<img src="' + winner.image + '" alt="' + winner.name + '" class="game-over-avatar">' +
            '<p class="game-over-winner-name">' + winner.name + ' wins!</p>' +
            '<span class="menorah-emoji">\uD83D\uDD4E</span>' +
            '</div>';

        Swal.fire({
            title: 'Mazel Tov!',
            html: htmlContent,
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Play Again',
            cancelButtonText: 'Title Screen',
            allowOutsideClick: false,
            allowEscapeKey: false,
            customClass: {
                popup: 'hanukkah-popup'
            }
        }).then(function (result) {
            if (result.isConfirmed) {
                restartGame();
            } else {
                goToTitleScreen();
            }
        });
    }

    function restartGame() {
        resetDreidel();
        showDescription('Spin the dreidel to begin!');

        state = createGameState(currentGameConfig.playerConfigs);
        state = applyAnte(state);

        isProcessingTurn = false;

        renderDynamicPlayers(currentGameConfig.playerConfigs);
        renderFullUI();
        bindGameEvents();

        setTimeout(function () {
            beginTurn();
        }, 800);
    }

    /* ---------- UI Rendering ---------- */

    function renderFullUI() {
        renderCoins();
        renderPot();
        renderPlayerStates();
        renderPlayerNames();
    }

    function renderCoins() {
        state.players.forEach(function (player, index) {
            var desktopCard = document.getElementById('pc-desktop-' + index);
            if (desktopCard) {
                var coinEl = desktopCard.querySelector('.coin-count');
                if (coinEl) {
                    var oldVal = coinEl.textContent;
                    coinEl.textContent = player.coins;
                    if (oldVal !== String(player.coins)) {
                        coinEl.parentElement.classList.remove('coin-bounce');
                        void coinEl.offsetHeight;
                        coinEl.parentElement.classList.add('coin-bounce');
                    }
                }
            }

            var mobileRow = document.getElementById('pc-mobile-' + index);
            if (mobileRow) {
                var mobileCoinEl = mobileRow.querySelector('.coin-count');
                if (mobileCoinEl) {
                    mobileCoinEl.textContent = player.coins;
                }
            }
        });
    }

    function renderPot() {
        var desktopPot = document.getElementById('pot-count-desktop');
        var mobilePot = document.getElementById('pot-count-mobile');

        if (desktopPot) desktopPot.textContent = state.pot;
        if (mobilePot)  mobilePot.textContent = state.pot;
    }

    function renderPlayerStates() {
        state.players.forEach(function (player, index) {
            var desktopCard = document.getElementById('pc-desktop-' + index);
            var mobileRow = document.getElementById('pc-mobile-' + index);

            if (player.isOut) {
                if (desktopCard) {
                    desktopCard.classList.add('player-out');
                    desktopCard.classList.remove('active-player');
                }
                if (mobileRow) {
                    mobileRow.classList.add('player-out');
                    mobileRow.classList.remove('active-player');
                }
            } else {
                if (desktopCard) desktopCard.classList.remove('player-out');
                if (mobileRow) mobileRow.classList.remove('player-out');
            }
        });
    }

    function renderPlayerNames() {
        state.players.forEach(function (player, index) {
            updatePlayerNameInDOM(index, player.name);
        });
    }

    function updatePlayerNameInDOM(index, name) {
        var desktopCard = document.getElementById('pc-desktop-' + index);
        if (desktopCard) {
            var nameEl = desktopCard.querySelector('.player-name');
            if (nameEl) nameEl.textContent = name;
        }

        var mobileRow = document.getElementById('pc-mobile-' + index);
        if (mobileRow) {
            var mobileNameEl = mobileRow.querySelector('.player-row-name');
            if (mobileNameEl) mobileNameEl.textContent = name;
        }
    }

    function highlightActivePlayer(playerIndex) {
        var allDesktopCards = document.querySelectorAll('.player-card');
        allDesktopCards.forEach(function (card) { card.classList.remove('active-player'); });

        var allMobileRows = document.querySelectorAll('.player-row');
        allMobileRows.forEach(function (row) { row.classList.remove('active-player'); });

        var desktopCard = document.getElementById('pc-desktop-' + playerIndex);
        if (desktopCard && !state.players[playerIndex].isOut) {
            desktopCard.classList.add('active-player');
        }

        var mobileRow = document.getElementById('pc-mobile-' + playerIndex);
        if (mobileRow && !state.players[playerIndex].isOut) {
            mobileRow.classList.add('active-player');
        }
    }

    function showSpinPrompt(playerName) {
        var isMulti = currentGameConfig && currentGameConfig.mode === 'multi';
        var desktopText = isMulti
            ? playerName + '\u2019s turn \u2014 Press any key to spin'
            : 'Press any key to spin';

        var desktopPrompt = getDesktopSpinPrompt();
        var desktopBar = getActionBarDesktop();
        if (desktopPrompt && desktopBar) {
            desktopPrompt.textContent = desktopText;
            desktopPrompt.classList.add('animate-pulse');
            desktopBar.style.display = '';
        }

        var mobileBar = getActionBarMobile();
        var mobileBtn = getMobileSpinBtn();
        if (mobileBar) {
            mobileBar.style.display = '';
        }
        if (mobileBtn) {
            mobileBtn.disabled = false;
            mobileBtn.textContent = isMulti ? playerName + ' \u2014 Spin!' : 'Spin!';
        }
    }

    function hideSpinPrompt() {
        var desktopPrompt = getDesktopSpinPrompt();
        if (desktopPrompt) {
            desktopPrompt.classList.remove('animate-pulse');
            desktopPrompt.textContent = '';
        }

        var mobileBtn = getMobileSpinBtn();
        if (mobileBtn) {
            mobileBtn.disabled = true;
        }
    }

    function showDescription(htmlContent) {
        var desktopDesc = document.getElementById('desc-text-desktop');
        var mobileDesc = document.getElementById('desc-text-mobile');

        if (desktopDesc) desktopDesc.innerHTML = htmlContent;
        if (mobileDesc)  mobileDesc.innerHTML = htmlContent;
    }

    /* ---------- Boot ---------- */

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
