window.addEventListener("DOMcontentLoaded", (e) => {
const turn = "X";
const squares = document.querySelectorAll(".square");

squares.forEach(square => {
    square.addEventListener("click", (e) => {
        e.target.innerHTML = "<img src='player-x.svg'>"
    })
})






})