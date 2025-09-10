// Determine if a 9 x 9 Sudoku board is valid.
// Only the filled cells need to be validated according to the following rules:

// Each row must contain the digits 1-9 without repetition.
// Each column must contain the digits 1-9 without repetition.
// Each of the nine 3 x 3 sub-boxes of the grid must contain the digits 1-9 without repetition.
// Note:

// A Sudoku board (partially filled) could be valid but is not necessarily solvable.
// Only the filled cells need to be validated according to the mentioned rules.

/**
 * @param {character[][]} board
 * @return {boolean}
 */
var isValidSudoku = function (board) {
  let isValid = true;

  for (let i = 0; i < board.length; i++) {
    const rowSet = new Set();
    const columnSet = new Set();

    for (let j = 0; j < board[i].length; j++) {
      if (rowSet.has(board[i][j])) {
        return false;
      }
      if (board[i][j] !== '.') {
        rowSet.add(board[i][j]);
      }

      if (columnSet.has(board[j][i])) {
        return false;
      }
      if (board[j][i] !== '.') {
        columnSet.add(board[j][i]);
      }
    }
  }

  for (let outerRow = 0; outerRow < 9; outerRow += 3) {
    for (let outerColumn = 0; outerColumn < 9; outerColumn += 3) {
      const boxSet = new Set();
      for (let innerRow = outerRow; innerRow < outerRow + 3; innerRow++) {
        for (
          let innerColumn = outerColumn;
          innerColumn < outerColumn + 3;
          innerColumn++
        ) {
          if (boxSet.has(board[innerRow][innerColumn])) {
            return false;
          }
          if (board[innerRow][innerColumn] !== '.') {
            boxSet.add(board[innerRow][innerColumn]);
          }
        }
      }
    }
  }

  return isValid;
};

const board1 = [
  ['5', '3', '.', '.', '7', '.', '.', '.', '.'],
  ['6', '.', '.', '1', '9', '5', '.', '.', '.'],
  ['.', '9', '8', '.', '.', '.', '.', '6', '.'],
  ['8', '.', '.', '.', '6', '.', '.', '.', '3'],
  ['4', '.', '.', '8', '.', '3', '.', '.', '1'],
  ['7', '.', '.', '.', '2', '.', '.', '.', '6'],
  ['.', '6', '.', '.', '.', '.', '2', '8', '.'],
  ['.', '.', '.', '4', '1', '9', '.', '.', '5'],
  ['.', '.', '.', '.', '8', '.', '.', '7', '9'],
];

const board2 = [
  ['8', '3', '.', '.', '7', '.', '.', '.', '.'],
  ['6', '.', '.', '1', '9', '5', '.', '.', '.'],
  ['.', '9', '8', '.', '.', '.', '.', '6', '.'],
  ['8', '.', '.', '.', '6', '.', '.', '.', '3'],
  ['4', '.', '.', '8', '.', '3', '.', '.', '1'],
  ['7', '.', '.', '.', '2', '.', '.', '.', '6'],
  ['.', '6', '.', '.', '.', '.', '2', '8', '.'],
  ['.', '.', '.', '4', '1', '9', '.', '.', '5'],
  ['.', '.', '.', '.', '8', '.', '.', '7', '9'],
];

const board3 = [
  ['5', '3', '.', '.', '7', '.', '.', '.', '.'],
  ['6', '.', '3', '1', '9', '5', '.', '.', '.'],
  ['.', '9', '8', '.', '.', '.', '.', '6', '.'],
  ['8', '.', '.', '.', '6', '.', '.', '.', '3'],
  ['4', '.', '.', '8', '.', '3', '.', '.', '1'],
  ['7', '.', '.', '.', '2', '.', '.', '.', '6'],
  ['.', '6', '.', '.', '.', '.', '2', '8', '.'],
  ['.', '.', '.', '4', '1', '9', '.', '.', '5'],
  ['.', '.', '.', '.', '8', '.', '.', '7', '9'],
];

console.log(isValidSudoku(board1)); // true
console.log(isValidSudoku(board2)); // false
console.log(isValidSudoku(board3)); // false
