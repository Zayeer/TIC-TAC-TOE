const boxes = document.querySelectorAll('.box');
const statusDisplay = document.querySelector(".result");
const button = document.querySelector("button");
let gameBoard = Array.from(Array(9).keys());

const gameProperties = () => {
	return {
		user: "O",
		comp: "X",
		winningPos: [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[6, 4, 2]
		]
	}
};

//tells you everything about this game's process in short if you read all function calls inside the below function.
const gameProcess = (e) => {
	const { user, comp } = gameProperties();
	userTurn(e);
	if(checkForWin(user)) return;
	if(checkForTie()) return;
	compTurn();
	if(checkForWin(comp)) return;
	if(checkForTie()) return;
}

for(let i = 0; i<boxes.length; i++) {
	boxes[i].addEventListener("click", gameProcess);
}

function userTurn(event) {
	const{user} = gameProperties();
	statusDisplay.innerText = "";
	event.target.innerText = user;
	gameBoard[event.target.id] = user;
}

function compTurn() {
	const {user, comp} = gameProperties();
	gameAlg(user, comp);
	setTimeout(()=> displayGameBoard(), 500);
}

function gameAlg(human, ai) {
	/*check if there are two Xs in one of the elements of WinningPos along with a number, 
	and replace the number with X*/
	let valOfCheckForTwoXs = checkForTwoPlayers(ai);
	if (valOfCheckForTwoXs) {
		for (let val of valOfCheckForTwoXs) {
			if (typeof (gameBoard[val]) === "number") {
				gameBoard[val] = ai;
			}
		}
		return;
	}

	/*Same as above, but checks for Os instead of Xs to stop opponent from winning */
	let valOfCheckForTwoOs = checkForTwoPlayers(human);
	if (valOfCheckForTwoOs) {
		for (let val of valOfCheckForTwoOs) {
			if (typeof (gameBoard[val]) === "number") {
				gameBoard[val] = ai;
			}
		}
		return;
	}

	/*check for adjacent Xs and replace the empty field with X to increase the possibility of win*/
	let valOfCheckForAdjacentXs = CheckForAdjacentPlayers(ai);
	if (valOfCheckForAdjacentXs) {
		gameBoard[valOfCheckForAdjacentXs] = ai;
		return;
	}

	/*same as above, but check for Os and replace the empty field with X to decrease the possibility of win
	  for opponent*/
	let valOfCheckForAdjacentOs = CheckForAdjacentPlayers(human);
	if (valOfCheckForAdjacentOs) {
		gameBoard[valOfCheckForAdjacentOs] = ai;
		return;
	}
	
	/*stop user from utilizing diagonal position advantage */
	const valOfCfd = checkForDiagonal(human);
	if(valOfCfd) {
		gameBoard[7] = ai;
		return;
	}

	/*choose center position if it's empty*/
	if (typeof (gameBoard[4]) === "number") {
		gameBoard[4] = ai;
		return;
	}

	/*choose corners opposite to opponent's corner moves*/
	const cornerCombos = [[0, 2], [0, 6], [6, 8], [8, 2]];
	for (let val of cornerCombos) {
		if (gameBoard[val[0]] === human && typeof (gameBoard[val[1]]) === "number") {
			gameBoard[val[1]] = ai;
			return;
		} else if (gameBoard[val[1]] === human && typeof (gameBoard[val[0]]) === "number") {
			gameBoard[val[0]] = ai;
			return;
		}
	}

	/*choose any corner if it's empty*/
	const corners = [0, 2, 6, 8];
	for (let val of corners) {
		if (typeof (val) === "number") {
			gameBoard[val] = ai;
			return;
		}
	}

	/*choose random position in case all the above conditions fail*/
	let availSpots = emptyFields();
	gameBoard[Math.floor(Math.random() * (availSpots.length + 1))] = ai;
	return;
}

function checkForTwoPlayers(player) {
	const{winningPos} = gameProperties();
	for (let val of winningPos) {
		if ((gameBoard[val[0]] === player) &&
			(gameBoard[val[1]] === player) &&
			(typeof (gameBoard[val[2]]) === "number") ||
			(gameBoard[val[1]] === player) &&
			(gameBoard[val[2]] === player) &&
			(typeof (gameBoard[val[0]]) === "number") ||
			(gameBoard[val[2]] === player) &&
			(gameBoard[val[0]] === player) &&
			(typeof (gameBoard[val[1]]) === "number")) {
			return val;
		}
	}
}

function CheckForAdjacentPlayers(player) {
	if (gameBoard[1] === player &&
		gameBoard[3] === player &&
		typeof (gameBoard[0]) === "number" &&
		typeof (gameBoard[2]) === "number" &&
		typeof (gameBoard[6]) === "number") {
		return gameBoard[0];
	}
	else if (gameBoard[1] === player &&
		gameBoard[5] === player &&
		typeof (gameBoard[2]) === "number" &&
		typeof (gameBoard[0]) === "number" &&
		typeof (gameBoard[8]) === "number") {
		return gameBoard[2];
	}
	else if (gameBoard[3] === player &&
		gameBoard[7] === player &&
		typeof (gameBoard[6]) === "number" &&
		typeof (gameBoard[0]) === "number" &&
		typeof (gameBoard[8]) === "number") {
		return gameBoard[6];
	}
	else if (gameBoard[7] === player &&
		gameBoard[5] === player &&
		typeof (gameBoard[8]) === "number" &&
		typeof (gameBoard[2]) === "number" &&
		typeof (gameBoard[6]) === "number") {
		return gameBoard[8];
	} 
}

function checkForDiagonal(player) {
	let diagonals = [[0, 8], [2, 6]];
	for(let val of diagonals) {
		if(gameBoard[val[0]] === player &&
			gameBoard[val[1]] === player &&
			emptyFields().length === 6) {
				return val;
			}
	}
}

function displayGameBoard() {
	for(let i = 0; i<boxes.length; i++) {
		typeof(gameBoard[i]) === "number" ? boxes[i].innerText = "":
										boxes[i].innerText = gameBoard[i]; 
	}
}

//check if the player already won
function checkForWin(player) {
	const { winningPos, comp } = gameProperties();
	for(let val of winningPos) {
		if(gameBoard[val[0]] === player &&
		   gameBoard[val[1]] === player &&
		   gameBoard[val[2]] === player) {
			   player === comp ? statusDisplay.innerText = "You Lose!":
								 statusDisplay.innerText = "You Win!";
			   
			   boxes.forEach(box => {
				   if (box.id == (val[0]).toString() ||
					   box.id == (val[1]).toString() ||
					   box.id == (val[2]).toString()) {
						   box.style.color = "red";
					   }
				   box.removeEventListener('click', gameProcess);
			   });
			   return true;
		   }
	}
	return false;
}

//check if the game is tie
function checkForTie() {
	if(emptyFields().length === 0) {
		statusDisplay.innerText = "Tie game!";
		boxes.forEach(box => {
			box.removeEventListener("click", gameProcess);
		});
		return true;
	}
	return false;
}

//return empty fields, in other words return all the number fields from gameBoard
function emptyFields() {
	return gameBoard.filter(elem => typeof (elem) === "number");
}

//clear the board if use clicks the "clear" button
button.addEventListener("click", clearBoard);

function clearBoard() {
	boxes.forEach(box => {
		box.innerText = "";
		box.style.color = "#000";
		statusDisplay.innerText = "";
		statusDisplay.innerText = "Start the Game!";
		gameBoard = Array.from(Array(9).keys());
		box.addEventListener("click", gameProcess);
	});
	for(let i = 0; i<boxes.length; i++) {
		boxes[i].addEventListener('click', gameProcess);
	}
}

