import { Combination } from "js-combinatorics";

type Grid = { [key: number]: "X" | "O" | null };

const keys = [2, 7, 6, 9, 5, 1, 4, 3, 8];

// get every unique combination of 3 numbers and only keep the ones that sum to 15
// I'll explain why this works later.
const winningCombos = new Combination(keys, 3).toArray().filter(
  (nums) => nums.reduce((acc, num) => acc + num) === 15
);

const hasWinner = (grid: Grid) =>
  winningCombos
    // get the corresponding grid items
    .map((combo) => combo.map((key) => grid[key]))
    // if you find at least one with all Xs or all Os, there's a winner!
    .some(
      (comboValues) =>
        comboValues.every((v) => v === "X") ||
        comboValues.every((v) => v === "O")
    );

export default class Game {
  private _grid: Grid;

  constructor() {
    // using reduce to add all our keys to an object with initial values of null;
    this._grid = keys.reduce(
      (grid, key) => Object.assign(grid, { [key]: null }),
      {}
    );
  }

  get turn() {
    // get the grid values
    const counts = Object.values(this._grid)
      // use reduce to make an object that counts all the Xs and Os
      .reduce(
        (acc, value) => {
          if (value === "X") acc.Xs += 1;
          else if (value === "O") acc.Os += 1;
          return acc;
        },
        { Xs: 0, Os: 0 }
      );
    // if there are more Xs on the board, it's O's turn.
    return counts.Xs > counts.Os ? "O" : "X";
  }

  get winner() {
    if (!hasWinner(this._grid)) return null;
    // if there's a winner and it's X's turn, that means O just won. Otherwise, X just won.
    else return this.turn === "X" ? "O" : "X";
  }

  get isFull() {
    // no null values in the grid? board must be full
    return Object.entries(this._grid).every(([_, value]) => !!value);
  }

  getCell = (key: number) => (key in this._grid ? this._grid[key] : null);

  setCell = (key: number) => {
    // no winner yet, a valid name and an empty cell? Set grid cell to whoever's turn this is.
    if (!this.winner && key in this._grid && !this._grid[key])
      this._grid[key] = this.turn;
  };

  get cellNames() {
    return keys;
  }
}
