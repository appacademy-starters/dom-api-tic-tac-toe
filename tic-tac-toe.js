// const X = document.createElement('img')
let currentPlayerSymbol = 'x';
let squareValues = ["", "", "", "", "", "", "", "", ""]; // Size of tic-tac-toe board

window.addEventListener('DOMContentLoaded', event => {
    const ticTacToeGrid = document.getElementById('tic-tac-toe-board');
    ticTacToeGrid.addEventListener('click', event => {
        const targetID = event.target.id;
        if (event.target.id.includes('square-') > 0) {
            const num = Number.parseInt(targetID[targetID.length - 1]); // Get last character of targetID (which is the grid num in the tic-tac-toe-board) and cast into type int
            console.log(targetID);
            if (squareValues[num] !== "") {
                return; // Square already taken, make no changes
            } else {
                const playerSymbol = document.createElement('img');
                playerSymbol.src = `https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-${currentPlayerSymbol}.svg`;
                event.target.appendChild(playerSymbol);
                squareValues[num] = currentPlayerSymbol;
                if (currentPlayerSymbol === 'x') {
                    currentPlayerSymbol = 'o';
                } else {
                    currentPlayerSymbol = 'x';
                }
            }
        }
    })

})