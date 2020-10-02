window.addEventListener("DOMContentLoaded", (e) => {
    let currentPlayerSymbol  = "x";
    let squareValues = ["","","","","","","","",""];
    const newGame = document.getElementById("new-game");
    const status = document.getElementById("game-status");
    const giveUp = document.getElementById("give-up");
    const grid = document.getElementById("tic-tac-toe-board");
    let gameStatus = "";
    let computerSymbol = "";
    let playerSymbol = "";

    (() => {
        let randomNum = Math.floor(Math.random()* 100)%2;
        if (randomNum === 0){
            computerSymbol = "x";
            playerSymbol = "o";
            computerTurn();
        } else {
            computerSymbol ="o";
            playerSymbol = "x";
        }
    })()

    restore();

    newGame.addEventListener("click", (e) => {
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
    })

    giveUp.addEventListener("click", (e) => {
        if (currentPlayerSymbol === "x") {
            gameStatus = "O";
        } else {
            gameStatus = "X"
        }
        status.innerHTML = `Player ${gameStatus} wins`;
        newGame.removeAttribute("disabled");
        giveUp.setAttribute("disabled", "true");
        clear();
    })

    function save (){
        localStorage.setItem("squarevalues", JSON.stringify(squareValues))
        localStorage.setItem("currentPlayerSymbol", currentPlayerSymbol)
    }

    function clear(){
        localStorage.removeItem("squarevalues" );
        localStorage.removeItem("currentPlayerSymbol");
    }

    function restore(){
        if (localStorage.getItem("squarevalues")){
            newGame.removeAttribute("disabled")
            currentPlayerSymbol = localStorage.getItem("currentPlayerSymbol");
            squareValues = JSON.parse(localStorage.getItem("squarevalues"));
            for (let i = 0; i < squareValues.length; i++) {
                if (squareValues[i]==="x"||squareValues[i] === "o") {
                    let img = document.createElement("img");
                    img.setAttribute("src", `player-${squareValues[i]}.svg`);
                    let square = document.querySelector("#square-"+i);
                    square.appendChild(img);
                }
            }
        }
    }

    function checkGameStatus(){
        const newArray = [];
        const checkRow1 = squareValues[0] + squareValues[1] + squareValues[2];
        const checkRow2 = squareValues[3] + squareValues[4] + squareValues[5];
        const checkRow3 = squareValues[6] + squareValues[7] + squareValues[8];
        const checkColumn1 = squareValues[0] + squareValues[3] + squareValues[6];
        const checkColumn2 = squareValues[1] + squareValues[4] + squareValues[7];
        const checkColumn3 = squareValues[2] + squareValues[5] + squareValues[8];
        const checkDiagonal1 = squareValues[0] + squareValues[4] + squareValues[8];
        const checkDiagonal2 = squareValues[2] + squareValues[4] + squareValues[6];
        newArray.push(checkRow1, checkRow2, checkRow3, checkColumn1, checkColumn2, checkColumn3, checkDiagonal1, checkDiagonal2);
        if (newArray.includes("xxx")) {
            gameStatus = "Player X";
            giveUp.setAttribute("disabled", "true");
            clear();
        } else if (newArray.includes("ooo")) {
            gameStatus = "Player O";
            giveUp.setAttribute("disabled", "true");
            clear();
        } else if (!squareValues.includes("")){
            gameStatus = "None";
            giveUp.setAttribute("disabled", "true");
            clear();
        } else {
            save();
            if (currentPlayerSymbol === computerSymbol) {
                computerTurn();
            }
            newGame.removeAttribute("disabled");
        }
        if (gameStatus !== "") {
            status.innerHTML = `${gameStatus} wins`;
        }
    }

    function computerTurn () {
        let randomNum = Math.floor(Math.random()*100) % 9;
        if (squareValues[randomNum]==="") {
            const img = document.createElement("img");
            img.setAttribute("src", `player-${computerSymbol}.svg`);
            let square = document.querySelector(`#square-${randomNum}`);
            square.appendChild(img);
            squareValues[randomNum] = computerSymbol;
            if (currentPlayerSymbol === "x") {
                currentPlayerSymbol = "o";
            } else {
                currentPlayerSymbol = "x";
            }
            checkGameStatus();
        } else {
            computerTurn();
        }
    }

    grid.addEventListener("click", e => {
        const gridId = e.target.id;
        if (gridId.startsWith("square-")) {
            const sqIndex = Number.parseInt(gridId.slice(7));
            if (squareValues[sqIndex] === "") {
                const img = document.createElement("img");
                img.setAttribute("src", `player-${playerSymbol}.svg`);
                e.target.appendChild(img);
                squareValues[sqIndex] = playerSymbol;
                if(currentPlayerSymbol === "x"){
                    currentPlayerSymbol = "o";
                } else{
                    currentPlayerSymbol = "x";
                }
                checkGameStatus();
            }
        }
    })

})
