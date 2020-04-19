import { fromEvent, BehaviorSubject } from "rxjs";
import Apple from "./Apple";

let canvas = document.querySelector("#game");
let context = canvas.getContext("2d");

const score$ = new BehaviorSubject(0);
score$.subscribe(val => val + 1);

const grid = 16;
let count = 0;
const initState = {
  x: 160,
  y: 160,

  //velocity
  dx: grid,
  dy: 0,

  cells: [],
  maxCells: 4
};

const apple = new Apple(320, 320, grid);
let snake = { ...initState };

function loop() {
  if (!started$.value) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    snake = { ...initState };
    return;
  }

  requestAnimationFrame(loop);

  if (++count < 4) return;

  count = 0;
  context.clearRect(0, 0, canvas.width, canvas.height);

  snake.x += snake.dx;
  snake.y += snake.dy;

  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  } else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  // wrap snake position vertically on edge of screen
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  } else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  // keep track of where snake has been. front of the array is always the head
  snake.cells.unshift({ x: snake.x, y: snake.y });

  // remove cells as we move away from them
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  // draw apple
  context.fillStyle = "red";
  context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

  // draw snake one cell at a time
  context.fillStyle = "green";
  snake.cells.forEach(function(cell, index) {
    // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
    context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

    // snake ate apple
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;

      // canvas is 400x400 which is 25x25 grids
      apple.generate();
    }

    // check collision with all cells after this one (modified bubble sort)
    for (var i = index + 1; i < snake.cells.length; i++) {
      // snake occupies same space as a body part. reset game
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;

        apple.generate();
      }
    }
  });
}

//listening keyboard events
fromEvent(document, "keydown").subscribe(e => {
  if (e.key === "ArrowLeft" && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  if (e.key === "ArrowRight" && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  if (e.key === "ArrowUp" && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  if (e.key === "ArrowDown" && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

let started$ = new BehaviorSubject(false);
started$.subscribe(id => id);

fromEvent(document.querySelector(".btn-game__start"), "click").subscribe(() => {
  if (!started$.value) {
    requestAnimationFrame(loop);
    started$.next(true);
  }
});

fromEvent(document.querySelector(".btn-game__stop"), "click").subscribe(() => {
  started$.next(false);
});
