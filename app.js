const grid = document.querySelector(".grid");
const resultsDisplay = document.querySelector(".results");
const scoreDisplay = document.querySelector(".score");
let currentShooterIndex = 202;
let width = 15;
let direction = 1;
let invadersId;
let goingRight = true;
let aliensRemoved = [];
let results = 0;

for (let i = 0; i < 225; i++) {
  const square = document.createElement("div");
  grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll(".grid div"));

const alienInvaders = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39];

function draw() {
  for (let i = 0; i < alienInvaders.length; i++) {
    if (!aliensRemoved.includes(i)) {
      squares[alienInvaders[i]].classList.add("invader");
    }
  }
}

function remove() {
  for (let i = 0; i < alienInvaders.length; i++) {
    if (squares[alienInvaders[i]]) {
      squares[alienInvaders[i]].classList.remove("invader");
    }
  }
}

draw();

squares[currentShooterIndex].classList.add("shooter");

// function to control moving the shooter, and ensure it doesn't go through the edges of the box
function moveShooter(e) {
  squares[currentShooterIndex].classList.remove("shooter");
  switch (e.key) {
    case "ArrowLeft":
      if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
      break;
    case "ArrowRight":
      if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
      break;
  }
  squares[currentShooterIndex].classList.add("shooter");
}

// run the moveShooter function when keys are pressed
document.addEventListener("keydown", moveShooter);

// function to move the Invaders slowly down the page and change direction
// when hitting side of box
function moveInvaders() {
  const leftEdge = alienInvaders[0] % width === 0;
  const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;
  remove();

  if (rightEdge && goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width + 1;
      direction = -1;
      goingRight = false;
    }
  }

  if (leftEdge && !goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width - 1;
      direction = 1;
      goingRight = true;
    }
  }
  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction;
  }

  draw();

  // if the invaders hit the shooter then game over
  if (squares[currentShooterIndex].classList.contains("invader") && squares[currentShooterIndex].classList.contains("shooter")) {
    resultsDisplay.innerHTML = "YOU LOSE";
    document.removeEventListener("keydown", moveShooter);
    document.removeEventListener("keydown", shoot);
    clearInterval(invadersId);
  }

  // if the invaders hit the bottom of the box then game over
  for (let i = 0; i < alienInvaders.length; i++) {
    if (alienInvaders[i] + width >= squares.length) {
      resultsDisplay.innerHTML = "YOU LOSE";
      document.removeEventListener("keydown", moveShooter);
      document.removeEventListener("keydown", shoot);
      clearInterval(invadersId);
    }
  }
  if (aliensRemoved.length === alienInvaders.length) {
    resultsDisplay.innerHTML = "YOU WIN!";
    clearInterval(invadersId);
  }
}

invadersId = setInterval(moveInvaders, 500);

function shoot(e) {
  let laserId;
  let currentLaserIndex = currentShooterIndex;

  function moveLaser() {
    if (squares[currentLaserIndex] && squares[currentLaserIndex].classList.contains("laser")) {
      squares[currentLaserIndex].classList.remove("laser");
    }
    currentLaserIndex -= width;
    if (squares[currentLaserIndex]) {
      squares[currentLaserIndex].classList.add("laser");
    }

    if (squares[currentLaserIndex] && squares[currentLaserIndex].classList.contains("invader")) {
      if (squares[currentLaserIndex] && squares[currentLaserIndex].classList.contains("laser")) {
        squares[currentLaserIndex].classList.remove("laser");
      }
      squares[currentLaserIndex].classList.remove("invader");
      let explosion = document.createElement("img");
      explosion.src = "images/explosion.png";
      explosion.classList.add("boom");
      squares[currentLaserIndex].appendChild(explosion);

      setTimeout(() => (squares[currentLaserIndex].innerHTML = ""), 200);
      clearInterval(laserId);

      const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
      aliensRemoved.push(alienRemoved);
      results++;
      scoreDisplay.innerHTML = results;
    }
  }

  switch (e.key) {
    case "ArrowUp":
      laserId = setInterval(moveLaser, 100);
  }
}

document.addEventListener("keydown", shoot);
