window.addEventListener("DOMContentLoaded", (e) => {
/********************* DEFINE VARIABLES ***********************************/
    let currentPlayerSymbol  = "x";
    let squareValues = ["","","","","","","","",""];

    let gameStatus = "";
    let computerSymbol = "";
    let playerSymbol = "";

/********************* GRAB NODES ***********************************/
    const status = document.getElementById("game-status");
    const newGame = document.getElementById("new-game");
    const giveUp = document.getElementById("give-up");
    const grid = document.getElementById("tic-tac-toe-board");
    const computerMode = document.getElementById("computer-mode");

/********************* HELPER FUNCTIONS ***********************************/

    function combinations () {
        const cellsCombinations = {
            row1: [0, 1, 2],
            row2: [3, 4, 5],
            row3: [6, 7, 8],
            column1: [0, 3, 6],
            column2: [1, 4, 7],
            column3: [2, 5, 8],
            diagonal1: [0, 4, 8],
            diagonal2: [2, 4, 6]
        };
        const newArray = [];

        for (let key in cellsCombinations) {
            let cells = cellsCombinations[key];

            let combination = "";
            cells.forEach(i => {combination += squareValues[i]});
            newArray.push(combination);
        }

        return newArray;
    }

    function save () {
        localStorage.setItem("squarevalues", JSON.stringify(squareValues))
        localStorage.setItem("currentPlayerSymbol", currentPlayerSymbol)
    }

    function clear () {
        localStorage.removeItem("squarevalues" );
        localStorage.removeItem("currentPlayerSymbol");
    }

    function restore () {
        if (localStorage.getItem("squarevalues")
        && localStorage.getItem("currentPlayerSymbol")){
            newGame.removeAttribute("disabled")
            currentPlayerSymbol = localStorage.getItem("currentPlayerSymbol");
            squareValues = JSON.parse(localStorage.getItem("squarevalues"));
            for (let i = 0; i < squareValues.length; i++) {
                if (squareValues[i]==="x"||squareValues[i] === "o") {
                    let block = document.querySelector("#square-"+i);
                    createImage(squareValues[i],block);
                }
            }
        }
        if (localStorage.getItem("computerSymbol")) {
            computerSymbol = localStorage.getItem("computerSymbol");
            if (computerSymbol === "x") {
                playerSymbol = "o"
            } else {
                playerSymbol = "x"
            }
            computerMode.checked = "true";
        }

    }

    function createImage (xo, targetItem) {
        const img = document.createElement("img");
        img.setAttribute("src", `player-${xo}.svg`);
        targetItem.appendChild(img);
    }

    function giveComputerSymbol () {
        let randomNum = Math.floor(Math.random()* 100)%2;
        if (randomNum === 0){
            computerSymbol = "x";
            playerSymbol = "o";
            computerTurn();
        } else {
            computerSymbol ="o";
            playerSymbol = "x";
        }
    }

    function isWinner (arr) {
        if (arr.includes("xxx")) return "x"
        else if (arr.includes("ooo")) return "o"
        else return false;
    }

    function checkGameStatus () {
        const newArray = combinations();
        const winner = isWinner(newArray);
        if (winner || !squareValues.includes("")){
            if (computerMode.checked){
                if (winner === computerSymbol) gameStatus = "Computer"
                else if ( winner === playerSymbol) gameStatus = "Player"
                else gameStatus = "Nobody"
            } else {
                if (winner) gameStatus = `Player ${winner.toUpperCase()}`
                else gameStatus = "Nobody";
            }

            status.innerHTML = `${gameStatus} wins`;
            giveUp.setAttribute("disabled", "true");
            clear();

        } else {
            save();
            newGame.removeAttribute("disabled");
            if ((currentPlayerSymbol === computerSymbol) && computerMode.checked) {
                computerTurn();
            }
        }
    }

    function switchCurrentPlayer () {
        if (currentPlayerSymbol === "x") {
            currentPlayerSymbol = "o";
        } else {
            currentPlayerSymbol = "x";
        }
    }

    function computerTurn () {
        let randomNum = Math.floor(Math.random()*100) % 9;
        if (squareValues[randomNum]==="") {
            let block = document.querySelector(`#square-${randomNum}`);
            createImage(computerSymbol, block);
            squareValues[randomNum] = computerSymbol;
            switchCurrentPlayer();
            save();
            checkGameStatus();
        } else {
            computerTurn();
        }
    }

    function resetGame () {
        currentPlayerSymbol = "x";
        squareValues = ["", "", "", "", "", "", "", "", ""];
        gameStatus = "";
        status.innerHTML = "";
        for (let i = 0; i <= 8; i++) {
            let image = document.getElementById(`square-${i}`);
            image.innerHTML = "";
        }
        newGame.setAttribute("disabled", "true");
        giveUp.removeAttribute("disabled");
        clear();
        if (computerMode.checked) {
            giveComputerSymbol();
            localStorage.setItem("computerSymbol", computerSymbol);
        } else {
            localStorage.removeItem("computerSymbol");
        }
    }
/********************* EVENT LISTENERS ************************************/
    newGame.addEventListener("click", resetGame)

giveUp.addEventListener("click", e => {

    /*If not a computer mode*/
    if (currentPlayerSymbol === "x") {
        gameStatus = "O";
    } else {
        gameStatus = "X"
    }
    /*  */
    status.innerHTML = `Player ${gameStatus} wins`;
    newGame.removeAttribute("disabled");
    giveUp.setAttribute("disabled", "true");
    clear();
})

grid.addEventListener("click", e => {
    const gridId = e.target.id;
    if (gridId.startsWith("square-")) {
        const sqIndex = Number.parseInt(gridId.slice(7));
        if (squareValues[sqIndex] === "") {
            createImage(currentPlayerSymbol, e.target);
            squareValues[sqIndex] = currentPlayerSymbol;
            switchCurrentPlayer();
            checkGameStatus();
        }
    }
})

    computerMode.addEventListener("input", resetGame)
/********************* EXECUTION ON LOAD **********************************/

    restore();

})
