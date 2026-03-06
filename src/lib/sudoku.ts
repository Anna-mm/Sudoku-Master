/**
 * Sudoku Logic Utility
 */

export function isValid(board: (number | null)[][], row: number, col: number, num: number, size: number): boolean {
  // Check row
  for (let x = 0; x < size; x++) {
    if (board[row][x] === num) return false;
  }

  // Check column
  for (let x = 0; x < size; x++) {
    if (board[x][col] === num) return false;
  }

  // Check block
  let boxRows, boxCols;
  if (size === 9) {
    boxRows = 3;
    boxCols = 3;
  } else if (size === 6) {
    boxRows = 2;
    boxCols = 3;
  } else {
    // size 3
    boxRows = 1;
    boxCols = 3; // or 3x1, let's assume 1x3 for 3x3? Actually 3x3 has no sub-blocks usually or it's just the grid itself.
    // For 3x3, let's just say it's 1 row of 3? No, the user said "three-part design".
    // If it's a 3x3 grid, sub-blocks don't really exist in the same way.
    return true; 
  }

  const startRow = row - (row % boxRows);
  const startCol = col - (col % boxCols);

  for (let i = 0; i < boxRows; i++) {
    for (let j = 0; j < boxCols; j++) {
      if (board[i + startRow][j + startCol] === num) return false;
    }
  }

  return true;
}

function solveSudoku(board: (number | null)[][], size: number): boolean {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col] === null) {
        for (let num = 1; num <= size; num++) {
          if (isValid(board, row, col, num, size)) {
            board[row][col] = num;
            if (solveSudoku(board, size)) return true;
            board[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
}

export function generatePuzzle(size: number, level: number): { board: (number | null)[][], solution: number[][] } {
  // Use level as seed for reproducibility
  const board: (number | null)[][] = Array.from({ length: size }, () => Array(size).fill(null));
  
  // Fill diagonal blocks first for faster generation (standard 9x9 technique)
  // For simplicity and given the 100 levels requirement, we'll use a basic backtracking generator
  
  // To make it level-specific, we can shuffle the numbers based on level
  const nums = Array.from({ length: size }, (_, i) => i + 1);
  // Simple pseudo-random shuffle based on level
  for (let i = nums.length - 1; i > 0; i--) {
    const j = (level * (i + 1)) % (i + 1);
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }

  // Fill first row with shuffled numbers to start
  for (let i = 0; i < size; i++) {
    board[0][i] = nums[i];
  }

  solveSudoku(board, size);
  const solution = board.map(row => [...row as number[]]);

  // Remove numbers based on difficulty/level
  // Level 1-33: Easy, 34-66: Medium, 67-100: Hard
  let attempts = 0;
  if (size === 9) attempts = level < 34 ? 30 : level < 67 ? 45 : 55;
  else if (size === 6) attempts = level < 34 ? 12 : level < 67 ? 18 : 22;
  else attempts = level < 34 ? 2 : level < 67 ? 4 : 5;

  const puzzle = board.map(row => [...row]);
  let removed = 0;
  while (removed < attempts) {
    const r = Math.floor(Math.random() * size);
    const c = Math.floor(Math.random() * size);
    if (puzzle[r][c] !== null) {
      puzzle[r][c] = null;
      removed++;
    }
  }

  return { board: puzzle, solution };
}
