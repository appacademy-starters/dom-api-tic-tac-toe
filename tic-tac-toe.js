window.addEventListener("DOMContentLoaded", event => {
    const gameStatus = document.getElementById('game-status');
    const squares = document.querySelectorAll('div.square');
    const buttons = document.querySelectorAll('button');
    const newGameButton = buttons[0];
    newGameButton.style.display = 'none'
    const giveUpButton = buttons[1];


    const xSymbol = document.createElement('img');
    xSymbol.setAttribute('src', 'https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-x.svg');
    let giveUp = ''
    // sets computer randomly to be X or O.
    let computer;
    if (Math.random() > .5) {
        computer = 'X'
    } else {
        computer = 'O'
    }

    // Empty board is just an array of spaces. Fill in x or o for each turn.
    let remainingIndex = ['0','1','2','3','4','5','6','7','8']
    let boardStatus = ['', '', '',
                       '', '', '',
                       '', '', '']

    // X starts the game by default. Swaps every turn
    let xTurn = true;
    loadGameState()
    // main game loop - listening for click events on the square divs

    for (let i = 0; i < squares.length; i++) {
        squares[i].addEventListener('click', event => {
            let square = squares[i];
            // sets position to the last index of squares id, which is an int - corresponding with boardStatus index
            const position = squares[i].id[squares[i].id.length - 1]

            // Creates image elements for X and O
            const xSymbol = document.createElement('img');
            xSymbol.setAttribute('src', 'https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-x.svg');
            const oSymbol = document.createElement('img');
            oSymbol.setAttribute('src', 'https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-o.svg');
            if (xTurn) {
                placeMarker('X', xSymbol, event.target, position, square);
                computerMove(oSymbol)
            } else {
                placeMarker('O', oSymbol, event.target, position, square);
                computerMove(xSymbol)

            }


        });
    }


    function computerMove(computerSymbol) {
        if (remainingIndex.length === 0) return;
        let randomIndex = Math.floor((Math.random() * remainingIndex.length - 1)  + 1)
        let square = squares[remainingIndex[randomIndex]];
        const oSymbol = document.createElement('img');
        oSymbol.setAttribute('src', 'https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-o.svg');

        square.appendChild(computerSymbol);
        square.style.pointerEvents = 'none'
        boardStatus[remainingIndex[randomIndex]] = computer
        let index = remainingIndex.indexOf(remainingIndex[randomIndex]);

        remainingIndex.splice(index, 1);

        xTurn = !xTurn
        checkDraw();
        checkWin(computer);
        storeGameState()
    }

    function placeMarker(player, playerSymbol, target, position, square) {
        let index = remainingIndex.indexOf(position);
        remainingIndex.splice(index, 1);
        target.appendChild(playerSymbol);
        square.style.pointerEvents = "none"
        boardStatus[position] = player
        xTurn = !xTurn
        checkDraw()
        checkGiveUp();
        checkWin(player);
        storeGameState()
    }

    function newGame() {
        newGameButton.style.display = 'block'
        newGameButton.addEventListener('click', event => {
            boardStatus = ['', '', '',
                           '', '', '',
                           '', '', '']

            xTurn = true;
            giveUp = '';
            remainingIndex = ['0','1','2','3','4','5','6','7','8']
            squares.forEach(square => {
                if (square.firstChild) {
                    square.removeChild(square.firstChild);
                }
                square.style.pointerEvents = "auto";
            })
            if (Math.random() > .5) {
                computer = 'X'
            } else {
                computer = 'O'
            }
            gameStatus.innerHTML = '';
            newGameButton.style.display = 'none'
            giveUpButton.style.display = 'block'
            storeGameState()
            if (computer === 'X') {
                computerMove(xSymbol)
            }
        })
    }

    function checkGiveUp() {
        giveUpButton.addEventListener('click', event => {
            squares.forEach(square => square.style.pointerEvents = "none");
            giveUpButton.style.display = 'none'
            if (xTurn) {
                gameStatus.innerHTML = 'O Wins!'
                giveUp = 'O Wins!'
            } else {
                gameStatus.innerHTML = 'X Wins!'
                giveUp = 'X Wins!'
            }
            storeGameState();
            newGame();
        })
    }

    function checkWin(player) {
        //hard coded the 8 win conditions.
        const winningPositions = [[0, 1, 2],
                                  [3, 4, 5],
                                  [6, 7, 8],
                                  [0, 3, 6],
                                  [1, 4, 7],
                                  [2, 5, 8],
                                  [0, 4, 8],
                                  [2, 4, 6]];

        // Loops through each winCondition and checks if the index corresponds with boardStatus for the player
        let userWon = winningPositions.some(winCondition => {
            return winCondition.every(index => boardStatus[index] === player)
        });

        if (userWon) {
            // disables all squares from being clickable
            squares.forEach(square => square.style.pointerEvents = "none");
            remainingIndex = []
            giveUpButton.style.display = 'none'
            gameStatus.innerHTML = `Winner: ${player}`
            return newGame()
        }

        // return playerWon;
    }

    function checkDraw() {
        // default board is full of ''. so Full is no more positions hold ''.
        let fullboard = boardStatus.every(position => {
            return position !== ''
        })

        // if X didn't won on last move, it's a tie.
        if (fullboard && !checkWin('X')) {
            gameStatus.innerHTML = `Winner: None`
            giveUpButton.style.display = 'none'
            newGame();
        }
    }

    function storeGameState() {
        localStorage.setItem('tic-tac-toe-save-state',JSON.stringify([boardStatus, xTurn, giveUp, computer, remainingIndex]))
    }

    function loadGameState() {

        if (localStorage.key('tic-tac-toe-save-state') === null) return

        let savedState = JSON.parse(localStorage.getItem('tic-tac-toe-save-state'))
        let board = savedState[0];
        let turn = savedState[1];
        let setGiveUp = savedState[2];
        let setComputer = savedState[3];
        let setRemainingIndex = savedState[4];
        remainingIndex = setRemainingIndex
        boardStatus = board;
        xTurn = turn;
        computer = setComputer
        // remainingIndex = setRemainingIndex



        for (let i = 0; i < board.length; i++) {
            let marker = board[i];
            let square = squares[i];
            const xSymbol = document.createElement('img');
            xSymbol.setAttribute('src', 'https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-x.svg');
            const oSymbol = document.createElement('img');
            oSymbol.setAttribute('src', 'https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-o.svg');

            if (marker === 'X') {
                square.appendChild(xSymbol);
                square.style.pointerEvents = 'none'
            } else if (marker === 'O') {
                square.appendChild(oSymbol);
                square.style.pointerEvents = 'none'
            }

        }

        if (setGiveUp !== '') {
            squares.forEach(square => square.style.pointerEvents = 'none');
            gameStatus.innerHTML = giveUp;
            giveUpButton.style.display = 'none'
            newGame();
        }

        checkWin('X')
        checkWin('O');
        checkDraw();

    }
})
