
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
  startsOutsidePen?: boolean;
  hasMadeInitialForcedMove?: boolean;
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
const inkyStartPos = { row: 9, col: 12 };

const baseGhostConfig: Omit<GhostStartConfig, 'id' | 'char' | 'color' | 'defaultColor' | 'patrolPath' | 'behavior' | 'row' | 'col' | 'releaseDelay' | 'startsOutsidePen' | 'hasMadeInitialForcedMove'> = {
  lastMove: null,
};

// Canonical Pac-Man Level 1 Layout
const level1Layout: string[][] = [
  ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
  ['W','.','.','.','.','.','.','.','.','.','.','.','.','W','W','.','.','.','.','.','.','.','.','.','.','.','.','W'],
  ['W','.','W','W','W','W','.','W','W','W','W','W','.','W','W','.','W','W','W','W','W','.','W','W','W','W','.','W'],
  ['W','O','W','W','W','W','.','W','W','W','W','W','.','W','W','.','W','W','W','W','W','.','W','W','W','W','O','W'],
  ['W','.','W','W','W','W','.','W','W','W','W','W','.','W','W','.','W','W','W','W','W','.','W','W','W','W','.','W'],
  ['W','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','W'],
  ['W','.','W','W','W','W','.','W','W','.','W','W','W','W','W','W','W','W','.','W','W','.','W','W','W','W','.','W'],
  ['W','.','W','W','W','W','.','W','W','.','W','W','W','W','W','W','W','W','.','W','W','.','W','W','W','W','.','W'],
  ['W','.','.','.','.','.','.','W','W','.','W','W','W','W','W','W','W','W','.','W','W','.','.','.','.','.','.','W'],
  ['W','W','W','W','W','W','.','W','W','.','.','.','.','W','W','.','.','.','.','W','W','.','W','W','W','W','W','W'], // Row 9 (inkyStartPos.row is 9)
  ['W','W','W','W','W','W','.','W','W','W','W','W','E','W','W','E','W','W','W','W','W','.','W','W','W','W','W','W'], // Row 10
  ['W','W','W','W','W','W','.','W','W','E','E','E','E','E','E','E','E','E','E','W','W','.','W','W','W','W','W','W'], // Row 11 (ghostPenExits)
  ['W','W','W','W','W','W','.','W','W','E','W','W','W','E','E','W','W','W','E','W','W','.','W','W','W','W','W','W'], // Row 12
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
  ['W','.','.','.','.','.','.','.','.','.','.','.','.','E','.','.','.','.','.','.','.','.','.','.','.','.','.','W'], // Row 23 (pacmanStartActual.row)
  ['W','W','W','W','W','W','.','W','W','.','W','W','W','W','W','W','W','W','.','W','W','.','W','W','W','W','.','W'],
  ['W','W','W','W','W','W','.','W','W','.','W','W','W','W','W','W','W','W','.','W','W','.','W','W','W','W','.','W'],
  ['W','.','.','.','.','.','.','W','W','.','.','.','.','W','W','.','.','.','.','W','W','.','.','.','.','.','.','W'],
  ['W','.','W','W','W','W','W','W','W','W','W','W','.','W','W','.','W','W','W','W','W','W','W','W','W','W','.','W'],
  ['W','.','W','W','W','W','W','W','W','W','W','W','.','W','W','.','W','W','W','W','W','W','W','W','W','W','.','W'],
  ['W','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','W'],
  ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W']
];

const pacmanStartActual = { row: 23, col: 13 };

// Ensure Pacman starting position is clear
if (level1Layout[pacmanStartActual.row][pacmanStartActual.col] === 'W') {
    level1Layout[pacmanStartActual.row][pacmanStartActual.col] = '.';
}
// Ensure Ghost pen exits are clear
if (level1Layout[commonGhostPenExit.row][commonGhostPenExit.col] !== 'E') {
    level1Layout[commonGhostPenExit.row][commonGhostPenExit.col] = 'E';
}
if (commonGhostPenExitPinky && level1Layout[commonGhostPenExitPinky.row][commonGhostPenExitPinky.col] !== 'E') {
    level1Layout[commonGhostPenExitPinky.row][commonGhostPenExitPinky.col] = 'E';
}
// Ensure Inky's starting position is clear if it was defined on a wall originally
if (level1Layout[inkyStartPos.row][inkyStartPos.col] === 'W') {
    level1Layout[inkyStartPos.row][inkyStartPos.col] = '.';
}


// Level 2 Layout modifications
const level2LayoutModified = level1Layout.map((row, rIdx) => {
    const newRow = [...row];
    if (rIdx === pacmanStartActual.row && newRow[pacmanStartActual.col] === 'W') {
        newRow[pacmanStartActual.col] = '.';
    }
    if (rIdx === inkyStartPos.row && newRow[inkyStartPos.col] === 'W') {
        newRow[inkyStartPos.col] = '.';
    }
    // Open up a path in the top-middle section
    if (rIdx === 6 && newRow[13] === 'W') newRow[13] = '.';
    if (rIdx === 7 && newRow[13] === 'W') newRow[13] = '.';
    // Open up a path in the bottom-left section
    if (rIdx === 24 && newRow[6] === 'W') newRow[6] = '.';
    if (rIdx === 25 && newRow[6] === 'W') newRow[6] = '.';
    return newRow;
});

// Level 3 Layout modifications
const level3LayoutModified = level1Layout.map((row, rIdx) => {
    const newRow = [...row];
     if (rIdx === pacmanStartActual.row && newRow[pacmanStartActual.col] === 'W') {
        newRow[pacmanStartActual.col] = '.';
    }
    if (rIdx === inkyStartPos.row && newRow[inkyStartPos.col] === 'W') {
        newRow[inkyStartPos.col] = '.';
    }
    // More significant changes for Level 3
    // Create a new horizontal path through the middle-right
    if (rIdx === 15) {
        for(let c = 19; c < 25; c++) {
            if (newRow[c] === 'W') newRow[c] = '.';
        }
    }
    // Open up the top-left corner more
    if (rIdx === 2 && newRow[2] === 'W') newRow[2] = '.';
    if (rIdx === 3 && newRow[2] === 'W') newRow[2] = '.';
    if (rIdx === 4 && newRow[2] === 'W') newRow[2] = '.';
    // Open up bottom-right corner
    if (rIdx === 27 && newRow[25] === 'W') newRow[25] = '.';
    if (rIdx === 28 && newRow[25] === 'W') newRow[25] = '.';
    // Connect a small isolated section in the middle
    if (rIdx === 9 && newRow[17] === 'W') newRow[17] = '.';
    if (rIdx === 10 && newRow[17] === 'W') newRow[17] = '.';
    return newRow;
});
// Add Pooplit to Level 3
if (level3LayoutModified[1] && level3LayoutModified[1][26] !== undefined) {
    level3LayoutModified[1][26] = 'F'; // 'F' for Fruit/Pooplit
}


export const levelConfigs: LevelConfig[] = [
  {
    levelNumber: 1,
    layout: level1Layout.map(row => [...row]), // Ensure a fresh copy for level 1
    pacmanStartPos: pacmanStartActual,
    ghostStartConfig: [
      { ...baseGhostConfig, id: 'blinky', char: 'B', row: commonGhostPenExit.row, col: commonGhostPenExit.col, color: 'bg-red-500', defaultColor: 'bg-red-500', releaseDelay: 0, behavior: 'chase', startsOutsidePen: false, hasMadeInitialForcedMove: false },
      { ...baseGhostConfig, id: 'pinky', char: 'K', row: commonGhostPenExitPinky.row, col: commonGhostPenExitPinky.col, color: 'bg-pink-500', defaultColor: 'bg-pink-500', releaseDelay: 2000, behavior: 'chase', startsOutsidePen: false, hasMadeInitialForcedMove: false },
      { ...baseGhostConfig, id: 'inky', char: 'I', row: inkyStartPos.row, col: inkyStartPos.col, color: 'bg-cyan-500', defaultColor: 'bg-cyan-500', releaseDelay: 0, behavior: 'chase', startsOutsidePen: true, hasMadeInitialForcedMove: false },
    ],
    ghostPenExit: commonGhostPenExit,
    ghostPenExitPinky: commonGhostPenExitPinky,
    wallClassName: 'bg-blue-700',
    gameTickInterval: 170,
    powerPelletDuration: 7000,
  },
  {
    levelNumber: 2,
    layout: level2LayoutModified,
    pacmanStartPos: pacmanStartActual,
    ghostStartConfig: [
      { ...baseGhostConfig, id: 'blinky-l2', char: 'B', row: commonGhostPenExit.row, col: commonGhostPenExit.col, color: 'bg-red-500', defaultColor: 'bg-red-500', releaseDelay: 0, behavior: 'chase', startsOutsidePen: false, hasMadeInitialForcedMove: false },
      { ...baseGhostConfig, id: 'pinky-l2', char: 'K', row: commonGhostPenExitPinky.row, col: commonGhostPenExitPinky.col, color: 'bg-pink-500', defaultColor: 'bg-pink-500', releaseDelay: 1500, behavior: 'chase', startsOutsidePen: false, hasMadeInitialForcedMove: false },
      { ...baseGhostConfig, id: 'inky-l2', char: 'I', row: inkyStartPos.row, col: inkyStartPos.col, color: 'bg-cyan-500', defaultColor: 'bg-cyan-500', releaseDelay: 0, behavior: 'chase', startsOutsidePen: true, hasMadeInitialForcedMove: false },
    ],
    ghostPenExit: commonGhostPenExit,
    ghostPenExitPinky: commonGhostPenExitPinky,
    wallClassName: 'bg-red-700',
    gameTickInterval: 154, // Changed from 220
    powerPelletDuration: 6000,
  },
  {
    levelNumber: 3,
    layout: level3LayoutModified,
    pacmanStartPos: pacmanStartActual,
    ghostStartConfig: [
      { ...baseGhostConfig, id: 'blinky-l3', char: 'B', row: commonGhostPenExit.row, col: commonGhostPenExit.col, color: 'bg-red-500', defaultColor: 'bg-red-500', releaseDelay: 0, behavior: 'chase', startsOutsidePen: false, hasMadeInitialForcedMove: false },
      { ...baseGhostConfig, id: 'pinky-l3', char: 'K', row: commonGhostPenExitPinky.row, col: commonGhostPenExitPinky.col, color: 'bg-pink-500', defaultColor: 'bg-pink-500', releaseDelay: 1000, behavior: 'chase', startsOutsidePen: false, hasMadeInitialForcedMove: false },
      { ...baseGhostConfig, id: 'inky-l3', char: 'I', row: inkyStartPos.row, col: inkyStartPos.col, color: 'bg-cyan-500', defaultColor: 'bg-cyan-500', releaseDelay: 0, behavior: 'chase', startsOutsidePen: true, hasMadeInitialForcedMove: false },
    ],
    ghostPenExit: commonGhostPenExit,
    ghostPenExitPinky: commonGhostPenExitPinky,
    wallClassName: 'bg-purple-700',
    gameTickInterval: 70,
    powerPelletDuration: 5000,
  },
];
