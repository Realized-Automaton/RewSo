
// src/app/arcade/pac-man/levelConfigs.ts

export interface GhostStartConfig {
  id: string;
  row: number;
  col: number;
  char: string;
  color: string;
  defaultColor: string;
  releaseDelay: number;
  behavior: 'chase' | 'patrol';
  patrolPath?: { row: number; col: number }[];
  lastMove: { dr: number; dc: number } | null;
}

export interface LevelConfig {
  levelNumber: number;
  layout: string[][];
  pacmanStartPos: { row: number; col: number };
  ghostStartConfig: GhostStartConfig[];
  ghostPenExit: { row: number; col: number };
  ghostPenExitPinky: { row: number; col: number };
  wallClassName: string;
  gameTickInterval: number;
  powerPelletDuration: number;
}

const commonGhostPenExit = { row: 11, col: 13 };
const commonGhostPenExitPinky = { row: 11, col: 14 };

const baseGhostConfig: Omit<GhostStartConfig, 'id' | 'char' | 'color' | 'defaultColor' | 'patrolPath' | 'behavior' | 'row' | 'col' | 'releaseDelay'> = {
  lastMove: null,
};

// Canonical Pac-Man Level 1 Layout (meticulously transcribed from provided image)
const level1Layout: string[][] = [
  ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
  ['W','.','.','.','.','.','.','.','.','.','.','.','.','W','W','.','.','.','.','.','.','.','.','.','.','.','.','W'],
  ['W','.','W','W','W','W','.','W','W','W','W','W','.','W','W','.','W','W','W','W','W','.','W','W','W','W','.','W'],
  ['W','O','W','W','W','W','.','W','W','W','W','W','.','W','W','.','W','W','W','W','W','.','W','W','W','W','O','W'],
  ['W','.','W','W','W','W','.','W','W','W','W','W','.','W','W','.','W','W','W','W','W','.','W','W','W','W','.','W'],
  ['W','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','W'],
  ['W','.','W','W','W','W','.','W','W','.','W','W','W','W','W','W','W','W','.','W','W','.','W','W','W','W','.','W'],
  ['W','.','W','W','W','W','.','W','W','.','W','W','W','W','W','W','W','W','.','W','W','.','W','W','W','W','.','W'],
  ['W','.','.','.','.','.','.','W','W','.','.','.','.','W','W','.','.','.','.','W','W','.','.','.','.','.','.','W'],
  ['W','W','W','W','W','W','.','W','W','W','W','W','E','W','W','E','W','W','W','W','W','.','W','W','W','W','W','W'],
  ['W','W','W','W','W','W','.','W','W','W','W','W','E','W','W','E','W','W','W','W','W','.','W','W','W','W','W','W'],
  ['W','W','W','W','W','W','.','W','W','E','E','E','E','E','E','E','E','E','E','W','W','.','W','W','W','W','W','W'],
  ['W','W','W','W','W','W','.','W','W','E','W','W','W','E','E','W','W','W','E','W','W','.','W','W','W','W','W','W'],
  ['W','W','W','W','W','W','.','W','W','E','W','E','E','E','E','E','E','W','E','W','W','.','W','W','W','W','W','W'],
  ['E','E','E','E','E','E','.','E','E','E','W','E','E','E','E','E','E','W','E','E','E','.','E','E','E','E','E','E'],
  ['W','W','W','W','W','W','.','W','W','E','W','E','E','E','E','E','E','W','E','W','W','.','W','W','W','W','W','W'],
  ['W','W','W','W','W','W','.','W','W','E','W','W','W','W','W','W','W','W','E','W','W','.','W','W','W','W','W','W'],
  ['W','W','W','W','W','W','.','W','W','.','.','.','.','.','.','.','.','.','.','W','W','.','W','W','W','W','W','W'],
  ['W','.','.','.','.','.','.','W','W','.','W','W','W','W','W','W','W','W','.','W','W','.','.','.','.','.','.','W'],
  ['W','.','W','W','W','W','.','W','W','.','W','W','W','W','W','W','W','W','.','W','W','.','W','W','W','W','.','W'],
  ['W','O','W','W','W','W','.','W','W','.','.','.','.','W','W','.','.','.','.','W','W','.','W','W','W','W','O','W'],
  ['W','.','W','W','W','W','.','W','W','W','W','W','.','W','W','.','W','W','W','W','W','.','W','W','W','W','.','W'],
  ['W','.','W','W','W','W','.','W','W','W','W','W','.','W','W','.','W','W','W','W','W','.','W','W','W','W','.','W'],
  ['W','.','.','.','.','.','.','.','.','.','.','.','.','E','.','.','.','.','.','.','.','.','.','.','.','.','.','W'],
  ['W','W','W','W','W','W','.','W','W','.','W','W','W','W','W','W','W','W','.','W','W','.','W','W','W','W','.','W'],
  ['W','W','W','W','W','W','.','W','W','.','W','W','W','W','W','W','W','W','.','W','W','.','W','W','W','W','.','W'],
  ['W','.','.','.','.','.','.','W','W','.','.','.','.','W','W','.','.','.','.','W','W','.','.','.','.','.','.','W'],
  ['W','.','W','W','W','W','W','W','W','W','W','W','.','W','W','.','W','W','W','W','W','W','W','W','W','W','.','W'],
  ['W','.','W','W','W','W','W','W','W','W','W','W','.','W','W','.','W','W','W','W','W','W','W','W','W','W','.','W'],
  ['W','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','W'],
  ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W']
];

// Ensure Pacman starts on a pellet, and ghost exits are empty
const pacmanStartActual = { row: 23, col: 13 };
if (level1Layout[pacmanStartActual.row][pacmanStartActual.col] !== '.') {
    level1Layout[pacmanStartActual.row][pacmanStartActual.col] = '.';
}
if (level1Layout[commonGhostPenExit.row][commonGhostPenExit.col] !== 'E') {
    level1Layout[commonGhostPenExit.row][commonGhostPenExit.col] = 'E';
}
if (commonGhostPenExitPinky && level1Layout[commonGhostPenExitPinky.row][commonGhostPenExitPinky.col] !== 'E') {
    level1Layout[commonGhostPenExitPinky.row][commonGhostPenExitPinky.col] = 'E';
}
// Ensure internal ghost pen cells (formerly 'G') are 'E'
if (level1Layout[12][13] === 'G') level1Layout[12][13] = 'E';
if (level1Layout[12][14] === 'G') level1Layout[12][14] = 'E';


export const levelConfigs: LevelConfig[] = [
  {
    levelNumber: 1,
    layout: level1Layout.map(row => [...row]),
    pacmanStartPos: pacmanStartActual,
    ghostStartConfig: [
      { ...baseGhostConfig, id: 'blinky', char: 'B', row: commonGhostPenExit.row, col: commonGhostPenExit.col, color: 'bg-red-500', defaultColor: 'bg-red-500', releaseDelay: 0, behavior: 'chase' },
      { ...baseGhostConfig, id: 'pinky', char: 'K', row: commonGhostPenExitPinky.row, col: commonGhostPenExitPinky.col, color: 'bg-pink-500', defaultColor: 'bg-pink-500', releaseDelay: 2000, behavior: 'chase' },
    ],
    ghostPenExit: commonGhostPenExit,
    ghostPenExitPinky: commonGhostPenExitPinky,
    wallClassName: 'bg-blue-700',
    gameTickInterval: 170,
    powerPelletDuration: 7000,
  },
  {
    levelNumber: 2,
    layout: level1Layout.map((row, rIdx) => {
        const newRow = [...row];
        if (rIdx === pacmanStartActual.row && newRow[pacmanStartActual.col] === 'E') {
            newRow[pacmanStartActual.col] = '.';
        }
        // Level 2 specific modifications
        if (rIdx === 6 && newRow[8] === 'W') newRow[8] = '.';
        if (rIdx === 7 && newRow[8] === 'W') newRow[8] = '.';
        return newRow;
    }),
    pacmanStartPos: pacmanStartActual,
    ghostStartConfig: [
      { ...baseGhostConfig, id: 'blinky', char: 'B', row: commonGhostPenExit.row, col: commonGhostPenExit.col, color: 'bg-red-500', defaultColor: 'bg-red-500', releaseDelay: 0, behavior: 'chase' },
      { ...baseGhostConfig, id: 'pinky', char: 'K', row: commonGhostPenExitPinky.row, col: commonGhostPenExitPinky.col, color: 'bg-pink-500', defaultColor: 'bg-pink-500', releaseDelay: 1500, behavior: 'chase' },
    ],
    ghostPenExit: commonGhostPenExit,
    ghostPenExitPinky: commonGhostPenExitPinky,
    wallClassName: 'bg-red-700',
    gameTickInterval: 85,
    powerPelletDuration: 6000,
  },
  {
    levelNumber: 3,
    layout: level1Layout.map((row, rIdx) => {
        const newRow = [...row];
        if (rIdx === pacmanStartActual.row && newRow[pacmanStartActual.col] === 'E') {
            newRow[pacmanStartActual.col] = '.';
        }
        // Level 3 specific modifications (includes Level 2 mods plus more)
        if (rIdx === 6 && newRow[8] === 'W') newRow[8] = '.';
        if (rIdx === 7 && newRow[8] === 'W') newRow[8] = '.';
        if (rIdx === 24 && newRow[2] === 'W') newRow[2] = '.';
        if (rIdx === 25 && newRow[2] === 'W') newRow[2] = '.';
        if (rIdx === 16 && newRow[20] === 'W') newRow[20] = '.';
        if (rIdx === 17 && newRow[20] === 'W') newRow[20] = '.';
        return newRow;
    }),
    pacmanStartPos: pacmanStartActual,
    ghostStartConfig: [
      { ...baseGhostConfig, id: 'blinky', char: 'B', row: commonGhostPenExit.row, col: commonGhostPenExit.col, color: 'bg-red-500', defaultColor: 'bg-red-500', releaseDelay: 0, behavior: 'chase' },
      { ...baseGhostConfig, id: 'pinky', char: 'K', row: commonGhostPenExitPinky.row, col: commonGhostPenExitPinky.col, color: 'bg-pink-500', defaultColor: 'bg-pink-500', releaseDelay: 1000, behavior: 'chase' },
    ],
    ghostPenExit: commonGhostPenExit,
    ghostPenExitPinky: commonGhostPenExitPinky,
    wallClassName: 'bg-purple-700',
    gameTickInterval: 70,
    powerPelletDuration: 5000,
  },
];
