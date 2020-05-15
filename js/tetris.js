const grid = document.querySelector('.grid');
for (let i = 1; i <= 200; i++) {
  var div = document.createElement('div');
  grid.appendChild(div);
}
for (let i = 1; i <= 10; i++) {
  var div = document.createElement('div');
  div.className = 'taken';
  div.style.backgroundImage = 'url(images/blue_block.png)';
  grid.appendChild(div);
}
let squares = Array.from(document.querySelectorAll('.grid div'));
const scoreDisplay = document.querySelector('#score');
const startBtn = document.querySelector('#start-button');
const leftBtn = document.querySelector('#left-button');
const rightBtn = document.querySelector('#right-button');
const downBtn = document.querySelector('#down-button');
const rotateBtn = document.querySelector('#rotate-button');
const _gameOver = document.querySelector('#game-over');
let timerID;
let isPlaying = false;
let score = 0;
const width = 10;

function randomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const colors = [
  'url(images/blue_block.png)',
  'url(images/pink_block.png)',
  'url(images/purple_block.png)',
  'url(images/peach_block.png)',
  'url(images/yellow_block.png)',
];

const lTetromino = [
  [1, width + 1, width * 2 + 1, 2],
  [width, width + 1, width + 2, width * 2 + 2],
  [1, width + 1, width * 2 + 1, width * 2],
  [width, width * 2, width * 2 + 1, width * 2 + 2],
];

const zTetromino = [
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
];

const tTetromino = [
  [1, width, width + 1, width + 2],
  [1, width + 1, width + 2, width * 2 + 1],
  [width, width + 1, width + 2, width * 2 + 1],
  [1, width, width + 1, width * 2 + 1],
];

const oTetromino = [
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
];

const iTetromino = [
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
];

const tetrominos = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

let currentPosition = 4;
let currentRotation = randomNumber(0, tetrominos[0].length - 1);

let random = randomNumber(0, tetrominos.length - 1);

let current = tetrominos[random][currentRotation];

const draw = () => {
  current.forEach((index) => {
    squares[currentPosition + index].classList.add('tetromino');
    squares[currentPosition + index].style.backgroundImage = colors[random];
  });
};

const undraw = () => {
  current.forEach((index) => {
    squares[currentPosition + index].classList.remove('tetromino');
    squares[currentPosition + index].style.backgroundImage = 'none';
  });
};

// timerID = setInterval(moveDown, 500);

document.addEventListener('keydown', (event) => {
  if (isPlaying) {
    switch (event.key) {
      case 'ArrowLeft':
        moveLeft();
        break;
      case 'ArrowRight':
        moveRight();
        break;
      case 'ArrowDown':
        moveDown();
        break;
      case 'r':
        rotate();
        break;
      default:
        null;
    }
  }
});

leftBtn.addEventListener('click', () => (isPlaying ? moveLeft() : null));
rightBtn.addEventListener('click', () => (isPlaying ? moveRight() : null));
downBtn.addEventListener('click', () => (isPlaying ? moveDown() : null));
rotateBtn.addEventListener('click', () => (isPlaying ? rotate() : null));

function moveDown() {
  undraw();
  currentPosition += width;
  draw();
  freeze();
}

const freeze = () => {
  if (current.some((index) => squares[currentPosition + index + width].classList.contains('taken'))) {
    current.forEach((index) => squares[currentPosition + index].classList.add('taken'));

    random = randomNumber(0, tetrominos.length - 1);
    currentRotation = randomNumber(0, tetrominos[0].length - 1);
    current = tetrominos[random][currentRotation];
    currentPosition = 4;
    draw();
    addScore();
    gameOver();
  }
};

const moveLeft = () => {
  undraw();
  const isAtLeftEdge = current.some((index) => (currentPosition + index) % width === 0);

  if (!isAtLeftEdge) {
    currentPosition -= 1;
  }
  if (current.some((index) => squares[currentPosition + index].classList.contains('taken'))) {
    currentPosition += 1;
  }
  draw();
};

const moveRight = () => {
  undraw();
  const isAtRightEdge = current.some((index) => (currentPosition + index) % width === width - 1);

  if (!isAtRightEdge) {
    currentPosition += 1;
  }
  if (current.some((index) => squares[currentPosition + index].classList.contains('taken'))) {
    currentPosition -= 1;
  }
  draw();
};

const rotate = () => {
  undraw();
  currentRotation++;
  if (currentRotation === current.length) {
    currentRotation = 0;
  }
  current = tetrominos[random][currentRotation];
  draw();
};

startBtn.addEventListener('click', () => {
  if (timerID) {
    clearInterval(timerID);
    timerID = null;
    isPlaying = false;
  } else {
    isPlaying = true;
    draw();
    timerID = setInterval(moveDown, 500);
  }
});

const addScore = () => {
  for (let i = 0; i < 199; i += width) {
    const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];

    if (row.every((index) => squares[index].classList.contains('taken'))) {
      score += 10;
      scoreDisplay.innerHTML = score;
      row.forEach((index) => {
        squares[index].classList.remove('taken');
        squares[index].classList.remove('tetromino');
        squares[index].style.backgroundImage = 'none';
      });
      const squaresRemoved = squares.splice(i, width);
      squares = squaresRemoved.concat(squares);
      squares.forEach((cell) => grid.appendChild(cell));
    }
  }
};

const gameOver = () => {
  if (current.some((index) => squares[currentPosition + index].classList.contains('taken'))) {
    _gameOver.innerHTML = 'Game Over!';
    clearInterval(timerID);
  }
};
