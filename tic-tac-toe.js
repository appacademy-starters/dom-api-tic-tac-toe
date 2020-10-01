window.addEventListener("DOMContentLoaded", (e) => {
    let currentPlayerSymbol  = "X";
    const squareValues = ["","","","","","","","",""];
    const squares = document.querySelectorAll(".square");

    const grid = document.getElementById("tic-tac-toe-board");

    grid.addEventListener("click", e => {
        const gridId = e.target.id;
        if (gridId.startsWith("square-")) {
            const sqIndex = Number.parseInt(gridId.slice(7));
            if (squareValues[sqIndex] === "") {

            }
        }
    })

})
