import * as C from "js-combinatorics";

type Grid = { [key: number]: "X" | "O" | null };

const keys = [2, 7, 6, 9, 5, 1, 4, 3, 8];

// get every unique combination of numbers and only keep the ones that sum to 15
const winningCombos = [...new C.Combination(keys, 3)].filter(
  (nums) => nums.reduce((acc, num) => acc + num) === 15
);

const hasWinner = (grid: Grid) =>
  // get every unique three number combo
  !!winningCombos
    // get the corresponding grid items
    .map((comboNumbers) => comboNumbers.map((num) => grid[num]))
    // if you find at least one with all Xs or all Os, there's a winner!
    .find(
      (comboValues) =>
        comboValues.every((v) => v === "X") ||
        comboValues.every((v) => v === "O")
    );

export default class Game {
  private _grid: Grid;

  constructor() {
    // using reduce to add all our keys to an object with initial value null;
    this._grid = keys.reduce(
      (grid, key) => Object.assign(grid, { [key]: null }),
      {}
    );
  }

  get turn() {
    const counts = Object.values(this._grid) // get the grid items
      // count all the Xs and Os
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
    else return this.turn === "X" ? "O" : "x";
  }

  get isFull() {
    // no null values in the grid? full board
    return Object.entries(this._grid).every(([_, value]) => !!value);
  }

  getCell = (name: number) => (name in this._grid ? this._grid[name] : null);

  setCell = (name: number) => {
    // no winner yet, a valid name and an empty cell? Set the value.
    if (!this.winner && name in this._grid && !this._grid[name])
      this._grid[name] = this.turn;
  };

  get cellNames() {
    return keys;
  }
}
