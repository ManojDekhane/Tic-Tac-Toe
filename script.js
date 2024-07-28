let clickAudio = new Audio("clickaudio.mp3");
let winAudio = new Audio("winaudio.wav");

let currentPlayer = "O";
const board = Array(9).fill(null);
let gameActive = false;

const boxes = document.querySelectorAll(".box");
const startGameButton = document.getElementById("start-game");
const displayResult = document.querySelector(".display-result");
const resultText = document.getElementById("result-text");
const celebrateImage = document.getElementById("celebration-img");

const player1Name = document.getElementById("player1-name");
const player2Name = document.getElementById("player2-name");
const editPlayer1Button = document.getElementById("edit-player1");
const editPlayer2Button = document.getElementById("edit-player2");

let playerNames = {
    "O": player1Name.textContent,
    "X": player2Name.textContent
};

celebrateImage.style.display = "none";

function changeTurn() {
    currentPlayer = currentPlayer === "O" ? "X" : "O";
}

function checkWin() {
    const wins = [ 
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const win of wins) {
        const [a, b, c] = win;
        if (board[a] && board[a] === board[b] && board[b] === board[c]) {
            return true;
        }
    }
    return false;
}

function checkTie() {
    return board.every(box => box !== null);
}

function handleClick(event) {
    if (!gameActive) return;

    const box = event.target;
    const index = box.dataset.index;

    if (board[index]) return;

    board[index] = currentPlayer;
    box.querySelector(".boxtext").textContent = currentPlayer;
    clickAudio.play();

    if (checkWin()) {
        winAudio.play();
        resultText.textContent = `${playerNames[currentPlayer]} wins!`;
        displayResult.style.display = "block";
        celebrateImage.style.display = "block";
        displayResult.style.marginTop = "60px";
        gameActive = false;
    } else if (checkTie()) {
        resultText.textContent = "It's a tie!";
        displayResult.style.display = "block";
        gameActive = false;
    } else {
        changeTurn();
    }
}

function resetGame() {
    board.fill(null);
    boxes.forEach(box => box.querySelector(".boxtext").textContent = "");
    currentPlayer = "O";
    gameActive = true;
    displayResult.style.display = "none";
    celebrateImage.style.display = "none";
}

function updatePlayerName(playerNumber) {
    const newName = prompt(`Enter name for Player ${playerNumber}:`);
    if (newName.trim() === "") {
        alert("Player name cannot be empty!");
        return;
    }
    if (playerNumber === 1) {
        player1Name.textContent = newName;
        playerNames["O"] = newName;
    } else {
        player2Name.textContent = newName;
        playerNames["X"] = newName;
    }
    enableGameIfNameEntered();
}

function enableGameIfNameEntered() {
    if (arePlayerNamesEntered()) {
        boxes.forEach(box => box.addEventListener("click", handleClick));
        startGameButton.disabled = false;
    } else {
        boxes.forEach(box => box.removeEventListener("click", handleClick));
        startGameButton.disabled = true;
    }
}

function arePlayerNamesEntered() {
    return playerNames["O"].trim() !== "" && playerNames["X"].trim() !== "";
}

startGameButton.addEventListener("click", () => {
    if (!arePlayerNamesEntered()) {
        alert("Please enter names for both players before starting the game.");
    } else {
        resetGame();
    }
});

editPlayer1Button.addEventListener("click", () => updatePlayerName(1));
editPlayer2Button.addEventListener("click", () => updatePlayerName(2));

enableGameIfNameEntered();