export type SudokuSize = 3 | 6 | 9;

export interface GameState {
  board: (number | null)[][];
  initialBoard: (number | null)[][];
  solution: number[][];
  size: SudokuSize;
  level: number;
  status: 'playing' | 'won' | 'lost';
  mistakes: number;
  time: number;
  selectedCell: [number, number] | null;
  selectedAnimal: string | null;
  accentColor: string;
}

export interface LevelData {
  id: number;
  difficulty: 'easy' | 'medium' | 'hard';
}
