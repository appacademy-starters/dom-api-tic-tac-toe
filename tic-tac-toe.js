window.addEventListener("DOMContentLoaded", (e) => {
    let currentPlayerSymbol  = "x";
    const squareValues = ["","","","","","","","",""];
    const squares = document.querySelectorAll(".square");
    const gameStatus = "";

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
    }

    const grid = document.getElementById("tic-tac-toe-board");

    grid.addEventListener("click", e => {
        const gridId = e.target.id;
        if (gridId.startsWith("square-")) {
            const sqIndex = Number.parseInt(gridId.slice(7));
            if (squareValues[sqIndex] === "") {
                const img = document.createElement("img");
                img.setAttribute("src", `player-${currentPlayerSymbol}.svg`);
                e.target.appendChild(img);
                squareValues[sqIndex] = currentPlayerSymbol;
                if(currentPlayerSymbol === "x"){
                    currentPlayerSymbol = "o";
                } else{
                    currentPlayerSymbol = "x";
                }
            }
        }
    })

})
