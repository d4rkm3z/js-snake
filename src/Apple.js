function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export default class Apple {
  constructor(x, y, grid) {
    this.x = x;
    this.y = y;
    this.grid = grid;
  }

  generate() {
    this.x = getRandomInt(0, 25) * this.grid;
    this.y = getRandomInt(0, 25) * this.grid;
  }
}
