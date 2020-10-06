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

    function combinations (includeCells) {
        const cellsCombinations = [
            [3, 4, 5], //row2
            [6, 7, 8], //row3
            [0, 3, 6], //column1
            [0, 1, 2], //row1
            [1, 4, 7], //column2
            [2, 5, 8], //column3
            [0, 4, 8], //diagonal1
            [2, 4, 6]  //diagonal2
        ];

        const newArray = [];

        cellsCombinations.forEach(cells => {
            let combination = "";
            cells.forEach(i => {combination += squareValues[i]});
            newArray.push(combination);
        })
        if (includeCells) newArray.push(cellsCombinations);
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
            squareValues = [winner, winner, winner, winner, winner, winner, winner, winner, winner]
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

    function smartChoice() {
        const crazypart = Math.floor(Math.random()*100) % 2;
        const danger = playerSymbol+playerSymbol;
        const smellOfVictory = computerSymbol+computerSymbol;
        const sets = combinations(true);
        //if center is empty - take center
        if (squareValues[4] === "" && crazypart === 1) {
            return 4;
        }
        //if there is combination close to victory
        else if (sets.includes(smellOfVictory) && crazypart === 1) {
            const set = sets.indexOf(smellOfVictory);
            const cells = sets[sets.length - 1][set];
            for (let c = 0; c < 3; c++) {
                let i = cells[c];
                if (squareValues[i] === "") return i;
            }
        }
        //if there is combination close to fail
        else if (sets.includes(danger) && crazypart === 1) {
            const set = sets.indexOf(danger);
            const cells = sets[sets.length-1][set];
            for (let c = 0; c < 3; c++) {
                let i = cells[c];
                if(squareValues[i]==="") return i;
            }
        }
        //if it doesn't have close to win or to lose, but sequence already started and has potential
        else if (sets.includes(computerSymbol) && crazypart === 1) {
            const set = sets.indexOf(computerSymbol);
            const cells = sets[sets.length - 1][set];
            for (let c = 0; c < 3; c++) {
                let i = cells[c];
                if (squareValues[i] === "") return i;
            }
        }
        //if it doest't matter
        else {
            let randomNum = Math.floor(Math.random() * 100) % 9;
            if (squareValues[randomNum] === "") {
               return  randomNum;
            }
            else {
                return smartChoice();
            }
        }
    }

    function computerTurn () {
        let randomNum = smartChoice();
        let block = document.querySelector(`#square-${randomNum}`);
        createImage(computerSymbol, block);
        squareValues[randomNum] = computerSymbol;
        switchCurrentPlayer();
        save();
        checkGameStatus();
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
