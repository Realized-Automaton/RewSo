
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useCallback, useRef } from 'react';
import type { LevelConfig, GhostStartConfig } from './levelConfigs';
import { levelConfigs } from './levelConfigs';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const GHOST_EAT_SCORE = 200;
const POOPLIT_SCORE = 5555; 
const INITIAL_LIVES = 3;
const POOPLIT_IMAGE_URL = "https://i.ibb.co/p6m700jG/image-93.png";


interface GhostState extends GhostStartConfig {
  status: 'inPen' | 'exitingPen' | 'chasing' | 'frightened' | 'eaten';
  isReleased: boolean;
  currentPatrolIndex?: number;
  lastMove: { dr: number; dc: number } | null;
  hasMadeInitialForcedMove?: boolean;
}

type PacmanAnimationState = 'normal' | 'dying1' | 'dying2' | 'hidden';
type PacmanDirection = 'up' | 'down' | 'left' | 'right';

const pacmanImageUrls = {
  right: 'https://i.ibb.co/VYn2pwCm/image-80.png',
  left: 'https://i.ibb.co/bMfmS2sQ/left-pac-man.png',
  up: 'https://i.ibb.co/Wdqd0cy/up-pac-man.png',
  down: 'https://i.ibb.co/PsQhXRBd/down-pac-man.png',
};
const defaultPacmanImageUrl = pacmanImageUrls.right;


function PacManLevelDisplay({ board, ghosts, pacmanPos, wallClassName, pacmanAnimationState, pacmanDirection }: { board: string[][]; ghosts: GhostState[]; pacmanPos: {row:number, col:number}, wallClassName: string, pacmanAnimationState: PacmanAnimationState, pacmanDirection: PacmanDirection }) {
  const cellSize = 'w-3 h-3 md:w-4 md:h-4'; 

  return (
    <div className="grid border-2 border-blue-800 bg-black p-1" style={{ gridTemplateColumns: `repeat(${board[0].length}, minmax(0, 1fr))` }}>
      {board.map((row, rowIndex) =>
        row.map((cellValue, colActualIndex) => {
          let cellContent = null;
          let currentBgColor = 'bg-black';
          let displayCell = board[rowIndex][colActualIndex];
          let cellExtraClasses = '';

          const ghostInCell = ghosts.find(g => g.row === rowIndex && g.col === colActualIndex && g.status !== 'eaten');

          if (rowIndex === pacmanPos.row && colActualIndex === pacmanPos.col && pacmanAnimationState !== 'hidden') {
            displayCell = 'P';
          } else if (ghostInCell) {
            displayCell = ghostInCell.status === 'frightened' ? `FrightGhost-${ghostInCell.id}` : ghostInCell.char;
          }


          if (displayCell === 'W') {
            currentBgColor = wallClassName;
            cellExtraClasses = 'rounded-xs sm:rounded-sm';
          } else if (displayCell === '.') {
            cellContent = <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-yellow-300 rounded-full mx-auto my-auto"></div>;
          } else if (displayCell === 'O') {
            cellContent = <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full animate-pulse mx-auto my-auto"></div>;
          } else if (displayCell === 'F') { 
            cellContent = (
              <div className="w-full h-full relative flex items-center justify-center">
                <Image
                  src={POOPLIT_IMAGE_URL}
                  alt="Pooplit"
                  fill
                  sizes="12px md:16px"
                  style={{ objectFit: 'contain' }}
                  unoptimized={true}
                  data-ai-hint="pooplit item"
                />
              </div>
            );
          } else if (displayCell === 'P') {
            let currentPacmanImageSrc = defaultPacmanImageUrl;
             if (pacmanAnimationState === 'normal') {
              currentPacmanImageSrc = pacmanImageUrls[pacmanDirection] || defaultPacmanImageUrl;
            } else {
              currentPacmanImageSrc = defaultPacmanImageUrl;
            }

            let animationClass = '';
            if (pacmanAnimationState === 'dying1') {
              animationClass = 'transform scale-75 animate-pulse';
            } else if (pacmanAnimationState === 'dying2') {
              animationClass = 'transform scale-50 animate-pulse';
            }

            cellContent = (
              <div className={`w-full h-full relative flex items-center justify-center ${animationClass}`}>
                <Image
                  src={currentPacmanImageSrc}
                  alt="Pac-Man"
                  fill
                  sizes="12px md:16px"
                  style={{ objectFit: 'contain' }}
                  unoptimized={true}
                />
              </div>
            );
          } else if (['B', 'K', 'I', 'C'].includes(displayCell) || displayCell.startsWith('FrightGhost-')) {
            const ghostToDisplay = ghosts.find(g =>
                g.row === rowIndex &&
                g.col === colActualIndex &&
                g.status !== 'eaten' &&
                (g.status === 'frightened' ? displayCell === `FrightGhost-${g.id}` : g.char === displayCell)
            );

            if (ghostToDisplay) {
              let ghostColorClass = ghostToDisplay.color;
              if (ghostToDisplay.status === 'frightened') {
                ghostColorClass = 'bg-blue-500';
              }
              let ghostDivClasses = `w-full h-full ${ghostColorClass} rounded-t-full relative`;
              if (ghostToDisplay.status === 'frightened') {
                ghostDivClasses += ' animate-pulse';
              }

              cellContent = (
                <div className={ghostDivClasses}>
                  <div className="absolute top-1/4 left-1/4 w-1/2 h-1/4 flex justify-around items-center">
                      <div className="w-1/3 h-full bg-white rounded-full relative">
                         <div className="absolute inset-0 m-auto w-1/2 h-1/2 bg-black rounded-full hidden md:block"></div>
                      </div>
                      <div className="w-1/3 h-full bg-white rounded-full relative">
                         <div className="absolute inset-0 m-auto w-1/2 h-1/2 bg-black rounded-full hidden md:block"></div>
                      </div>
                  </div>
                </div>
              );
            }
          }
          return (
            <div
              key={`${rowIndex}-${colActualIndex}-${displayCell}`}
              className={`flex items-center justify-center ${cellSize} ${currentBgColor} ${cellExtraClasses}`}
            >
              {cellContent}
            </div>
          );
        })
      )}
    </div>
  );
}

export default function PacManPage() {
  const initialLevelConfig = levelConfigs[0];
  const [currentLevel, setCurrentLevel] = useState(initialLevelConfig.levelNumber);
  const [board, setBoard] = useState<string[][]>(initialLevelConfig.layout.map(row => [...row]));

  const pacmanPosRef = useRef(initialLevelConfig.pacmanStartPos);
  const [pacmanPosDisplay, setPacmanPosDisplay] = useState(initialLevelConfig.pacmanStartPos);

  const [pacmanDirection, setPacmanDirection] = useState<PacmanDirection>('right');
  const [ghosts, setGhosts] = useState<GhostState[]>(
    initialLevelConfig.ghostStartConfig.map(gConfig => {
      const initialStatus = gConfig.startsOutsidePen
        ? 'chasing'
        : (gConfig.releaseDelay === 0 ? 'exitingPen' : 'inPen');
      const isInitiallyReleased = gConfig.startsOutsidePen || gConfig.releaseDelay === 0;
      return {
        ...gConfig,
        status: initialStatus,
        isReleased: isInitiallyReleased,
        currentPatrolIndex: gConfig.behavior === 'patrol' ? 0 : undefined,
        lastMove: null,
        hasMadeInitialForcedMove: gConfig.hasMadeInitialForcedMove ?? false,
      };
    })
  );
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [gameStatus, setGameStatus] = useState<'paused' | 'playing' | 'wonLevel' | 'wonGame' | 'lost' | 'dyingAnimation' | 'lostLifeReady'>('paused');

  const [pacmanAnimationState, setPacmanAnimationState] = useState<PacmanAnimationState>('normal');

  const powerPelletTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const ghostReleaseTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const ghostEatenRespawnTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const deathAnimationTimerRef = useRef<NodeJS.Timeout[]>([]);

  const gameStatusRef = useRef(gameStatus);
  const livesRef = useRef(lives);
  const isPowerPelletActiveRef = useRef(false);
  const nextDirectionRef = useRef<PacmanDirection>('right');
  const gameTickIntervalRef = useRef(initialLevelConfig.gameTickInterval);
  const powerPelletDurationRef = useRef(initialLevelConfig.powerPelletDuration);
  
  const pooplitCollectedThisAttemptRef = useRef(false);
  const [showPooplitToast, setShowPooplitToast] = useState(false);
  const { toast } = useToast();


  useEffect(() => {
    gameStatusRef.current = gameStatus;
  }, [gameStatus]);

  useEffect(() => {
    livesRef.current = lives;
  }, [lives]);

  useEffect(() => {
    if (showPooplitToast) {
      toast({
        title: "✨ Pooplit Found! ✨",
        description: `You got the special item! +${POOPLIT_SCORE} points!`,
        duration: 3000,
      });
      setShowPooplitToast(false);
    }
  }, [showPooplitToast, toast]);

  const getCurrentLevelConfig = useCallback((): LevelConfig => {
    return levelConfigs.find(lc => lc.levelNumber === currentLevel) || levelConfigs[0];
  }, [currentLevel]);

  const releaseGhost = useCallback((ghostId: string) => {
    setGhosts(prevGhosts => prevGhosts.map(g =>
      g.id === ghostId ? { ...g, isReleased: true, status: 'exitingPen', lastMove: null, hasMadeInitialForcedMove: g.hasMadeInitialForcedMove ?? false } : g
    ));
  }, []);


  const resetGame = useCallback((levelNum: number, initialScore = 0, initialLivesVal = INITIAL_LIVES) => {
    if (powerPelletTimeoutRef.current) {
      clearTimeout(powerPelletTimeoutRef.current);
      powerPelletTimeoutRef.current = null;
    }
    ghostReleaseTimersRef.current.forEach(clearTimeout);
    ghostReleaseTimersRef.current.clear();
    ghostEatenRespawnTimersRef.current.forEach(clearTimeout);
    ghostEatenRespawnTimersRef.current.clear();
    deathAnimationTimerRef.current.forEach(clearTimeout);
    deathAnimationTimerRef.current = [];

    const config = levelConfigs.find(lc => lc.levelNumber === levelNum) || levelConfigs[0];
    setCurrentLevel(levelNum);
    gameTickIntervalRef.current = config.gameTickInterval;
    powerPelletDurationRef.current = config.powerPelletDuration;

    const newBoard = config.layout.map(row => [...row]);
    setBoard(newBoard);

    pacmanPosRef.current = config.pacmanStartPos;
    setPacmanPosDisplay(config.pacmanStartPos);

    setPacmanDirection('right');
    nextDirectionRef.current = 'right';
    setPacmanAnimationState('normal');

    setScore(initialScore);
    setLives(initialLivesVal);
    pooplitCollectedThisAttemptRef.current = false;


    setGhosts(config.ghostStartConfig.map(gConfig => {
      const initialStatus = gConfig.startsOutsidePen
        ? 'chasing'
        : (gConfig.releaseDelay === 0 ? 'exitingPen' : 'inPen');
      const isInitiallyReleased = gConfig.startsOutsidePen || gConfig.releaseDelay === 0;

      const newGhost: GhostState = {
        ...gConfig,
        status: initialStatus,
        isReleased: isInitiallyReleased,
        currentPatrolIndex: gConfig.behavior === 'patrol' ? 0 : undefined,
        lastMove: null,
        hasMadeInitialForcedMove: gConfig.hasMadeInitialForcedMove ?? false,
      };

      if (!isInitiallyReleased && gConfig.releaseDelay > 0) {
        const timerId = setTimeout(() => releaseGhost(gConfig.id), gConfig.releaseDelay);
        ghostReleaseTimersRef.current.set(gConfig.id, timerId);
      }
      return newGhost;
    }));

    isPowerPelletActiveRef.current = false;
    setGameStatus('playing');
  }, [releaseGhost]);


  const resetLevelAfterLifeLost = useCallback(() => {
    const config = getCurrentLevelConfig();
    if (powerPelletTimeoutRef.current) {
        clearTimeout(powerPelletTimeoutRef.current);
        powerPelletTimeoutRef.current = null;
    }

    pacmanPosRef.current = config.pacmanStartPos;
    setPacmanPosDisplay(config.pacmanStartPos);
    setPacmanDirection('right');
    nextDirectionRef.current = 'right';
    setPacmanAnimationState('normal');
    pooplitCollectedThisAttemptRef.current = false;

    ghostReleaseTimersRef.current.forEach(clearTimeout);
    ghostReleaseTimersRef.current.clear();

    setGhosts(prevGhosts => prevGhosts.map(g => {
        if (g.status === 'eaten' && ghostEatenRespawnTimersRef.current.has(g.id)) {
            return g; 
        }

        const gConfig = config.ghostStartConfig.find(gc => gc.id === g.id)!;
        const initialStatus = gConfig.startsOutsidePen
            ? 'chasing'
            : (gConfig.releaseDelay === 0 ? 'exitingPen' : 'inPen');
        const isInitiallyReleased = gConfig.startsOutsidePen || gConfig.releaseDelay === 0;

        const newGhost: GhostState = {
            ...gConfig,
            status: initialStatus,
            isReleased: isInitiallyReleased,
            currentPatrolIndex: gConfig.behavior === 'patrol' ? 0 : undefined,
            lastMove: null,
            hasMadeInitialForcedMove: gConfig.hasMadeInitialForcedMove ?? false,
        };

        if (!isInitiallyReleased && gConfig.releaseDelay > 0) {
            const timerId = setTimeout(() => releaseGhost(gConfig.id), gConfig.releaseDelay);
            ghostReleaseTimersRef.current.set(gConfig.id, timerId);
        }
        return newGhost;
    }));
    isPowerPelletActiveRef.current = false;

  }, [getCurrentLevelConfig, releaseGhost]);


  const calculateNewGhostPositions = useCallback((currentGhosts: GhostState[], currentPacmanPosVal: {row: number, col: number}, currentBoardLayout: string[][], currentIsPowerPelletActiveVal: boolean): GhostState[] => {
    const config = getCurrentLevelConfig();

    return currentGhosts.map(ghost => {
      let newRow = ghost.row;
      let newCol = ghost.col;
      let newStatus = ghost.status;
      let newLastMove = ghost.lastMove;
      let newPatrolIndex = ghost.currentPatrolIndex;
      let newHasMadeInitialForcedMove = ghost.hasMadeInitialForcedMove ?? false;
      const ghostConfigFromLevel = config.ghostStartConfig.find(gsc => gsc.id === ghost.id)!;


      if (ghost.status === 'eaten' || (!ghost.isReleased && ghost.status === 'inPen')) {
        return { ...ghost, hasMadeInitialForcedMove: newHasMadeInitialForcedMove };
      }

      if (newStatus === 'inPen' && ghost.isReleased) {
        newStatus = 'exitingPen';
        newLastMove = null;
      }

      if (newStatus === 'exitingPen') {
        const targetExit = ghost.id.includes('pinky') && config.ghostPenExitPinky ? config.ghostPenExitPinky : config.ghostPenExit;
        let dr = 0, dc = 0;

        if (newRow > targetExit.row) dr = -1;
        else if (newRow < targetExit.row) dr = 1;
        else if (newCol < targetExit.col) dc = 1;
        else if (newCol > targetExit.col) dc = -1;

        const tempNewRow = newRow + dr;
        const tempNewCol = newCol + dc;

        if (tempNewRow >= 0 && tempNewRow < currentBoardLayout.length &&
            tempNewCol >= 0 && tempNewCol < currentBoardLayout[0].length &&
            (currentBoardLayout[tempNewRow][tempNewCol] !== 'W' ||
             (tempNewRow === targetExit.row && tempNewCol === targetExit.col)
            )
           ) {
            newRow = tempNewRow;
            newCol = tempNewCol;
        }
        newLastMove = (dr !== 0 || dc !== 0) ? { dr, dc } : newLastMove;

        if (newRow === targetExit.row && newCol === targetExit.col) {
          newStatus = currentIsPowerPelletActiveVal ? 'frightened' : (ghostConfigFromLevel.behavior === 'chase' ? 'chasing' : 'chasing');
          newPatrolIndex = ghostConfigFromLevel.behavior === 'patrol' ? 0 : undefined;
          newLastMove = null;
        }
      }

      if (newStatus === 'chasing' && !newHasMadeInitialForcedMove && !ghost.startsOutsidePen) { 
          let forcedMoveDirection: { dr: number; dc: number } | null = null;
          if (ghost.id.startsWith('blinky')) {
              forcedMoveDirection = { dr: 0, dc: -1 };
          } else if (ghost.id.startsWith('pinky')) {
              forcedMoveDirection = { dr: 0, dc: 1 };
          }

          if (forcedMoveDirection) {
              const targetR = newRow + forcedMoveDirection.dr;
              const targetC = newCol + forcedMoveDirection.dc;

              if (targetR >= 0 && targetR < currentBoardLayout.length &&
                  targetC >= 0 && targetC < currentBoardLayout[0].length &&
                  currentBoardLayout[targetR][targetC] !== 'W') {

                  return {
                      ...ghost,
                      row: targetR,
                      col: targetC,
                      status: newStatus,
                      lastMove: forcedMoveDirection,
                      hasMadeInitialForcedMove: true,
                      isReleased: ghost.isReleased,
                      currentPatrolIndex: ghost.currentPatrolIndex,
                      behavior: ghost.behavior,
                      char: ghost.char,
                      color: ghost.color,
                      defaultColor: ghost.defaultColor,
                      startsOutsidePen: ghost.startsOutsidePen,
                  };
              } else {
                newHasMadeInitialForcedMove = true; 
              }
          } else {
            newHasMadeInitialForcedMove = true; 
          }
      }


      if (newStatus === 'chasing' || newStatus === 'frightened') {
          const potentialMoves = [{ dr: -1, dc: 0 }, { dr: 1, dc: 0 }, { dr: 0, dc: -1 }, { dr: 0, dc: 1 }];
          let validMoves = potentialMoves.filter(move => {
              const r = newRow + move.dr;
              const c = newCol + move.dc;

              const isTargetExit = (r === config.ghostPenExit.row && c === config.ghostPenExit.col) ||
                                 (ghost.id.includes('pinky') && config.ghostPenExitPinky && r === config.ghostPenExitPinky.row && c === config.ghostPenExitPinky.col);

              return r >= 0 && r < currentBoardLayout.length && c >= 0 && c < currentBoardLayout[0].length &&
                     (currentBoardLayout[r][c] !== 'W' || isTargetExit) &&
                     currentBoardLayout[r][c] !== 'G'; 
          });

          if (ghost.lastMove && validMoves.length > 1) {
              const nonReversingMoves = validMoves.filter(move =>
                  !(move.dr === -ghost.lastMove!.dr && move.dc === -ghost.lastMove!.dc)
              );
              if (nonReversingMoves.length > 0) {
                  validMoves = nonReversingMoves;
              }
          }

          if (validMoves.length > 0) {
            let chosenMove = validMoves[0];

            if (newStatus === 'frightened') {
              chosenMove = validMoves[Math.floor(Math.random() * validMoves.length)];
            } else {
                let preferredMoves = [...validMoves];
                const isAbovePenDoor =
                  newRow === config.ghostPenExit.row - 1 &&
                  (newCol === config.ghostPenExit.col ||
                    (config.ghostPenExitPinky && newCol === config.ghostPenExitPinky.col));

                if (isAbovePenDoor) {
                  preferredMoves = preferredMoves.filter(move => !(move.dr === 1));
                }

                const movesToConsider = preferredMoves.length > 0 ? preferredMoves : validMoves;

                if (movesToConsider.length > 0) {
                    chosenMove = movesToConsider[0];
                    if (ghostConfigFromLevel.behavior === 'chase') {
                        let minDistance = Infinity;
                        for (const move of movesToConsider) {
                            const nextR_eval = newRow + move.dr;
                            const nextC_eval = newCol + move.dc;
                            const distance = Math.sqrt(Math.pow(nextR_eval - currentPacmanPosVal.row, 2) + Math.pow(nextC_eval - currentPacmanPosVal.col, 2));
                            if (distance < minDistance) {
                                minDistance = distance;
                                chosenMove = move;
                            }
                        }
                    } else if (ghostConfigFromLevel.behavior === 'patrol' && ghostConfigFromLevel.patrolPath && newPatrolIndex !== undefined) {
                        const target = ghostConfigFromLevel.patrolPath[newPatrolIndex];
                        let minDistanceToTarget = Infinity;
                        chosenMove = movesToConsider[0];
                        for (const move of movesToConsider) {
                            const nextR_eval = newRow + move.dr;
                            const nextC_eval = newCol + move.dc;
                            const distance = Math.sqrt(Math.pow(nextR_eval - target.row, 2) + Math.pow(nextC_eval - target.col, 2));
                            if (distance < minDistanceToTarget) {
                                minDistanceToTarget = distance;
                                chosenMove = move;
                            }
                        }
                        if (newRow + chosenMove.dr === target.row && newCol + chosenMove.dc === target.col) {
                          newPatrolIndex = (newPatrolIndex + 1) % ghostConfigFromLevel.patrolPath.length;
                        }
                    }
                }
            }
            newRow = newRow + chosenMove.dr;
            newCol = newCol + chosenMove.dc;
            newLastMove = { dr: chosenMove.dr, dc: chosenMove.dc };
          } else {
             newLastMove = ghost.lastMove;
          }
      }

      return {
        ...ghost,
        row: newRow,
        col: newCol,
        status: newStatus,
        lastMove: newLastMove,
        currentPatrolIndex: newPatrolIndex,
        hasMadeInitialForcedMove: newHasMadeInitialForcedMove,
        isReleased: ghost.isReleased,
        startsOutsidePen: ghost.startsOutsidePen,
      };
    });
  }, [getCurrentLevelConfig]);


  const gameTick = useCallback(() => {
    if (gameStatusRef.current !== 'playing') return;

    let currentPacmanPosInternal = { ...pacmanPosRef.current };
    let currentBoardInternal = board.map(r => [...r]);
    let scoreChangeThisTick = 0;
    let powerPelletConsumedThisTick = false;

    const config = getCurrentLevelConfig();
    const numRows = config.layout.length;
    const numCols = config.layout[0].length;
    const tunnelRow = 14;

    let attemptedMoveRow = currentPacmanPosInternal.row;
    let attemptedMoveCol = currentPacmanPosInternal.col;
    let actualNewPacmanDir = pacmanDirection;

    switch (nextDirectionRef.current) {
        case 'up': attemptedMoveRow--; break;
        case 'down': attemptedMoveRow++; break;
        case 'left': attemptedMoveCol--; break;
        case 'right': attemptedMoveCol++; break;
    }

    if (attemptedMoveRow === tunnelRow) {
        if (attemptedMoveCol < 0) attemptedMoveCol = numCols - 1;
        else if (attemptedMoveCol >= numCols) attemptedMoveCol = 0;
    }

    if (attemptedMoveRow >= 0 && attemptedMoveRow < numRows &&
        attemptedMoveCol >= 0 && attemptedMoveCol < numCols &&
        config.layout[attemptedMoveRow][attemptedMoveCol] !== 'W')
    {
        currentPacmanPosInternal = { row: attemptedMoveRow, col: attemptedMoveCol };
        actualNewPacmanDir = nextDirectionRef.current;

        const cellMovingOnto = currentBoardInternal[currentPacmanPosInternal.row]?.[currentPacmanPosInternal.col];
        if (cellMovingOnto === '.') {
            currentBoardInternal[currentPacmanPosInternal.row][currentPacmanPosInternal.col] = 'E';
            scoreChangeThisTick += 10;
        } else if (cellMovingOnto === 'O') {
            currentBoardInternal[currentPacmanPosInternal.row][currentPacmanPosInternal.col] = 'E';
            scoreChangeThisTick += 50;
            powerPelletConsumedThisTick = true;
        } else if (cellMovingOnto === 'F' && config.levelNumber === 3 && !pooplitCollectedThisAttemptRef.current) {
            currentBoardInternal[currentPacmanPosInternal.row][currentPacmanPosInternal.col] = 'E';
            scoreChangeThisTick += POOPLIT_SCORE;
            pooplitCollectedThisAttemptRef.current = true;
            setShowPooplitToast(true);
        }
    } else {
      actualNewPacmanDir = nextDirectionRef.current; 
    }

    pacmanPosRef.current = currentPacmanPosInternal;
    setPacmanPosDisplay(currentPacmanPosInternal);
    setPacmanDirection(actualNewPacmanDir);
    if (scoreChangeThisTick > 0) setScore(s => s + scoreChangeThisTick);
    setBoard(currentBoardInternal);


    let ghostsForMovement = [...ghosts];
    if (powerPelletConsumedThisTick) {
        isPowerPelletActiveRef.current = true;
        ghostsForMovement = ghosts.map(g => {
            if (g.status !== 'inPen' && g.status !== 'eaten') {
                const gConfigCurrent = getCurrentLevelConfig().ghostStartConfig.find(s => s.id === g.id)!;
                return { ...g, status: 'frightened' as const, color: 'bg-blue-500', char: `FrightGhost-${g.id}`, lastMove: null, hasMadeInitialForcedMove: g.hasMadeInitialForcedMove ?? false, startsOutsidePen: g.startsOutsidePen };
            }
            return g;
        });

        if (powerPelletTimeoutRef.current) clearTimeout(powerPelletTimeoutRef.current);
        powerPelletTimeoutRef.current = setTimeout(() => {
            isPowerPelletActiveRef.current = false;
            setGhosts(prevGs => prevGs.map(g => {
                if (g.status === 'frightened') {
                    const gConfig = getCurrentLevelConfig().ghostStartConfig.find(s => s.id === g.id)!;
                    return { ...g, status: 'chasing', color: gConfig.defaultColor, char: gConfig.char, lastMove: null, hasMadeInitialForcedMove: g.hasMadeInitialForcedMove ?? false, startsOutsidePen: g.startsOutsidePen };
                }
                return g;
            }));
        }, powerPelletDurationRef.current);
    }


    const newGhostStates = calculateNewGhostPositions(ghostsForMovement, currentPacmanPosInternal, currentBoardInternal, isPowerPelletActiveRef.current);


    let pacmanCaughtThisTick = false;
    let eatenGhostIdThisTick: string | null = null;

    for (const ghost of newGhostStates) {
        if (ghost.row === currentPacmanPosInternal.row && ghost.col === currentPacmanPosInternal.col && ghost.status !== 'eaten') {
            if (ghost.status === 'frightened') { 
                 eatenGhostIdThisTick = ghost.id;
                 break;
            } else if (ghost.status === 'chasing' || ghost.status === 'exitingPen' || ghost.status === 'inPen') { 
                 pacmanCaughtThisTick = true;
                 break;
            }
        }
    }


    if (pacmanCaughtThisTick) {
        if (powerPelletTimeoutRef.current) {
            clearTimeout(powerPelletTimeoutRef.current);
            powerPelletTimeoutRef.current = null;
        }
        isPowerPelletActiveRef.current = false;
        setGameStatus('dyingAnimation');
        return;
    }

    let updatedGhostsAfterCollisionHandling = [...newGhostStates];
    if (eatenGhostIdThisTick) {
        setScore(s => s + GHOST_EAT_SCORE);
        const ghostIdToUpdate = eatenGhostIdThisTick;

        updatedGhostsAfterCollisionHandling = updatedGhostsAfterCollisionHandling.map(g => {
            if (g.id === ghostIdToUpdate) {
                if (ghostEatenRespawnTimersRef.current.has(g.id)) {
                    clearTimeout(ghostEatenRespawnTimersRef.current.get(g.id)!);
                    ghostEatenRespawnTimersRef.current.delete(g.id);
                }
                const gConfigForRespawn = getCurrentLevelConfig().ghostStartConfig.find(gs => gs.id === g.id)!;
                const respawnTimerId = setTimeout(() => {
                    setGhosts(gState => gState.map(gToRespawn => {
                        if (gToRespawn.id === g.id) {
                            let initialStatusRespawn = gConfigForRespawn.startsOutsidePen
                                ? 'chasing'
                                : (gConfigForRespawn.releaseDelay === 0 ? 'exitingPen' : 'inPen');
                            let initialColorRespawn = gConfigForRespawn.defaultColor;
                            let initialCharRespawn = gConfigForRespawn.char;

                            if (isPowerPelletActiveRef.current && initialStatusRespawn !== 'inPen' && initialStatusRespawn !== 'eaten') {
                                initialStatusRespawn = 'frightened';
                                initialColorRespawn = 'bg-blue-500'; 
                                initialCharRespawn = `FrightGhost-${gToRespawn.id}`; 
                            }

                            const isInitiallyReleasedRespawn = gConfigForRespawn.startsOutsidePen || gConfigForRespawn.releaseDelay === 0;

                            const respawnedGhost = {
                                ...gConfigForRespawn,
                                row: gConfigForRespawn.row, 
                                col: gConfigForRespawn.col,
                                status: initialStatusRespawn as GhostState['status'],
                                isReleased: isInitiallyReleasedRespawn,
                                color: initialColorRespawn,
                                char: initialCharRespawn,
                                currentPatrolIndex: gConfigForRespawn.behavior === 'patrol' ? 0 : undefined,
                                lastMove: null,
                                hasMadeInitialForcedMove: false, 
                            };
                            if (ghostReleaseTimersRef.current.has(gToRespawn.id)) { clearTimeout(ghostReleaseTimersRef.current.get(gToRespawn.id)!); }
                            
                            if (gameStatusRef.current === 'playing' && !respawnedGhost.startsOutsidePen) {
                                if(!isInitiallyReleasedRespawn && gConfigForRespawn.releaseDelay > 0) {
                                     const releaseDelay = gConfigForRespawn.releaseDelay > 0 ? gConfigForRespawn.releaseDelay : 2000; 
                                     const releaseTimerId = setTimeout(() => releaseGhost(gToRespawn.id), releaseDelay);
                                     ghostReleaseTimersRef.current.set(gToRespawn.id, releaseTimerId);
                                } else if (gConfigForRespawn.releaseDelay === 0 && !isInitiallyReleasedRespawn) {
                                    return {...respawnedGhost, status: 'exitingPen' as const };
                                }
                            }
                            return respawnedGhost;
                        }
                        return gToRespawn;
                    }));
                    ghostEatenRespawnTimersRef.current.delete(g.id);
                }, 3000); 
                ghostEatenRespawnTimersRef.current.set(g.id, respawnTimerId);
                return { ...g, status: 'eaten' as const, color: 'bg-gray-600', char: 'E', lastMove: null, hasMadeInitialForcedMove: g.hasMadeInitialForcedMove ?? false, startsOutsidePen: g.startsOutsidePen };
            }
            return g;
        });
    }
    setGhosts(updatedGhostsAfterCollisionHandling);


    let pelletsRemaining = 0;
    currentBoardInternal.forEach(r => r.forEach(cell => {
        if (cell === '.' || cell === 'O') pelletsRemaining++;
    }));

    if (pelletsRemaining === 0) {
        const currentConfig = getCurrentLevelConfig();
        if (currentConfig.levelNumber < levelConfigs.length) {
            setGameStatus('wonLevel');
        } else {
            setGameStatus('wonGame');
        }
    }

  }, [board, pacmanDirection, ghosts, calculateNewGhostPositions, releaseGhost, getCurrentLevelConfig]);

  const gameTickRef = useRef(gameTick);
  useEffect(() => {
    gameTickRef.current = gameTick;
  }, [gameTick]);


  useEffect(() => {
    return () => {
      if (powerPelletTimeoutRef.current) clearTimeout(powerPelletTimeoutRef.current);
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      ghostReleaseTimersRef.current.forEach(clearTimeout);
      ghostEatenRespawnTimersRef.current.forEach(clearTimeout);
      deathAnimationTimerRef.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (gameStatus === 'playing') {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
      const intervalId = setInterval(() => {
        if (gameTickRef.current) {
          gameTickRef.current();
        }
      }, gameTickIntervalRef.current);
      gameLoopRef.current = intervalId;

      return () => {
        clearInterval(intervalId);
        gameLoopRef.current = null;
      };
    } else if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }

    return () => { 
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameStatus, currentLevel]); 

  useEffect(() => {
    if (gameStatus === 'dyingAnimation') {
      deathAnimationTimerRef.current.forEach(clearTimeout);
      deathAnimationTimerRef.current = [];

      const currentLivesVal = livesRef.current -1;
      setLives(currentLivesVal);

      const t1 = setTimeout(() => setPacmanAnimationState('dying1'), 100);
      const t2 = setTimeout(() => setPacmanAnimationState('dying2'), 400);
      const t3 = setTimeout(() => {
        setPacmanAnimationState('hidden');
        if (currentLivesVal > 0) {
          resetLevelAfterLifeLost();
          setGameStatus('lostLifeReady');
        } else {
          setGameStatus('lost');
        }
      }, 800);
      deathAnimationTimerRef.current = [t1, t2, t3];
    }
  }, [gameStatus, resetLevelAfterLifeLost]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (gameStatusRef.current !== 'playing' || gameStatusRef.current === 'dyingAnimation' || event.repeat) {
        return;
    }

    let newDirection: PacmanDirection | null = null;
    switch (event.key) {
      case 'ArrowUp': newDirection = 'up'; break;
      case 'ArrowDown': newDirection = 'down'; break;
      case 'ArrowLeft': newDirection = 'left'; break;
      case 'ArrowRight': newDirection = 'right'; break;
      default: return;
    }
    event.preventDefault();

    if (newDirection) {
        nextDirectionRef.current = newDirection;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleDirectionButton = (direction: PacmanDirection) => {
    if (gameStatusRef.current !== 'playing' || gameStatusRef.current === 'dyingAnimation') {
        return;
    }
    nextDirectionRef.current = direction;
  }

  const handleStartGame = () => {
    resetGame(1, 0, INITIAL_LIVES);
  };

  const handleContinueAfterLifeLost = () => {
    setGameStatus('playing');
    const config = getCurrentLevelConfig();
    ghosts.forEach(g => {
      const gConfig = config.ghostStartConfig.find(gc => gc.id === g.id)!;
      setGhosts(prev => prev.map(pg => pg.id === g.id ? {...pg, hasMadeInitialForcedMove: gConfig.hasMadeInitialForcedMove ?? false} : pg));
      if (gConfig.startsOutsidePen) return;
      if (g.status === 'inPen' && !g.isReleased && gConfig.releaseDelay > 0) {
        if (ghostReleaseTimersRef.current.has(g.id)) clearTimeout(ghostReleaseTimersRef.current.get(g.id)!);
        const timerId = setTimeout(() => releaseGhost(g.id), gConfig.releaseDelay);
        ghostReleaseTimersRef.current.set(g.id, timerId);
      } else if (gConfig.releaseDelay === 0 && !g.isReleased) {
          releaseGhost(g.id);
      }
    });
  };

  const handleNextLevel = () => {
    const nextLevelNum = currentLevel + 1;
    if (nextLevelNum <= levelConfigs.length) {
        resetGame(nextLevelNum, score, livesRef.current);
    } else {
        setGameStatus('wonGame');
    }
  };

  const renderActionButton = () => {
    if (gameStatus === 'paused' && board.length > 0) {
      return (
        <Button onClick={handleStartGame} className="mt-4 font-pixel bg-primary text-primary-foreground hover:bg-primary/80 px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-lg">
          Start Game
        </Button>
      );
    }
    if (gameStatus === 'lostLifeReady') {
      return (
        <Button onClick={handleContinueAfterLifeLost} className="mt-4 font-pixel bg-primary text-primary-foreground hover:bg-primary/80 px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-lg">
          Continue Game
        </Button>
      );
    }
    if (gameStatus === 'wonLevel') {
      return (
        <div className="mt-4 p-3 sm:p-4 bg-card/80 border-2 border-accent rounded-md text-center">
            <p className="font-pixel text-lg sm:text-xl text-accent">LEVEL {currentLevel} CLEARED!</p>
            <p className="font-pixel text-base sm:text-lg text-foreground">Current Score: {score}</p>
            <Button onClick={handleNextLevel} className="mt-2 font-pixel bg-primary text-primary-foreground hover:bg-primary/80 px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-base">
                Next Level
            </Button>
        </div>
      );
    }
    if (gameStatus === 'wonGame') {
      return (
        <div className="mt-4 p-3 sm:p-4 bg-card/80 border-2 border-accent rounded-md text-center">
            <p className="font-pixel text-lg sm:text-xl text-accent">YOU BEAT THE GAME!</p>
            <p className="font-pixel text-base sm:text-lg text-foreground">Final Score: {score}</p>
            <Button onClick={handleStartGame} className="mt-2 font-pixel bg-primary text-primary-foreground hover:bg-primary/80 px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-base">
                Play Again (Level 1)
            </Button>
        </div>
      );
    }
    if (gameStatus === 'lost') {
      return (
        <div className="mt-4 p-3 sm:p-4 bg-card/80 border-2 border-destructive rounded-md text-center">
            <p className="font-pixel text-lg sm:text-xl text-destructive">GAME OVER!</p>
             <p className="font-pixel text-base sm:text-lg text-foreground">Final Score: {score}</p>
            <Button onClick={handleStartGame} className="mt-2 font-pixel bg-primary text-primary-foreground hover:bg-primary/80 px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-base">
                Play Again (Level 1)
            </Button>
        </div>
      );
    }
    if (gameStatus === 'dyingAnimation') {
        return <p className="font-pixel text-lg sm:text-xl text-primary mt-4">Oh no!</p>;
    }
    return null;
  };

  return (
    <div className="space-y-4 p-2 sm:p-4 md:p-8">
      <div className="text-center my-2 sm:my-4">
        <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto h-auto">
          <Image
            src="https://i.ibb.co/SXXX2Nbt/image-88-1.png"
            alt="Pac-Man Game Title"
            width={450}
            height={113}
            className="w-full h-auto object-contain"
            unoptimized={true}
            data-ai-hint="Pac-Man title logo"
            priority
          />
        </div>
      </div>

      <Card className="neon-border">
        <CardHeader className="text-center p-3 sm:p-4 md:p-6">
          <CardTitle className="font-pixel text-xl sm:text-2xl md:text-3xl text-primary">Level: {currentLevel}</CardTitle>
          <CardDescription className="font-pixel text-sm sm:text-base md:text-lg text-muted-foreground">
            Use ARROW KEYS or on-screen controls to move. Eat all pellets!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-2 sm:p-4 md:p-6 flex flex-col items-center"> {/* Added items-center */}
           <div className="text-center my-1 sm:my-2">
             <p className="font-pixel text-lg sm:text-xl md:text-2xl text-primary">Score: {score}</p>
             <div className="flex items-center justify-center mt-1">
                <span className="font-pixel text-base sm:text-lg md:text-xl text-primary mr-2">Lives:</span>
                <div className="flex space-x-1">
                  {Array.from({ length: lives }).map((_, index) => (
                    <div key={index} className="w-4 h-4 sm:w-5 sm:h-5 relative">
                       <Image
                        src={defaultPacmanImageUrl}
                        alt="Life"
                        fill
                        sizes="20px"
                        style={{ objectFit: 'contain' }}
                        unoptimized={true}
                       />
                    </div>
                  ))}
                </div>
              </div>
          </div>

          {board.length > 0 && pacmanPosDisplay.row !== -1 && (
            <div className="my-4 md:my-6 flex justify-center overflow-x-auto"> {/* Flex justify-center should center it if not full width */}
                <div className="min-w-max"> 
                    <PacManLevelDisplay board={board} ghosts={ghosts} pacmanPos={pacmanPosDisplay} wallClassName={getCurrentLevelConfig().wallClassName} pacmanAnimationState={pacmanAnimationState} pacmanDirection={pacmanDirection} />
                </div>
            </div>
          )}
          
          {/* On-Screen Controls */}
          {(gameStatus === 'playing' || gameStatus === 'lostLifeReady') && (
            <div className="mt-6 flex flex-col items-center space-y-3 md:hidden"> {/* Added md:hidden here */}
              {/* Up Button */}
              <Button
                variant="outline"
                size="lg"
                className="p-4 rounded-md font-pixel"
                onClick={() => handleDirectionButton('up')}
                aria-label="Move Up"
              >
                <ArrowUp className="h-8 w-8" />
              </Button>
              {/* Middle Row: Left and Right */}
              <div className="flex space-x-12">
                <Button
                  variant="outline"
                  size="lg"
                  className="p-4 rounded-md font-pixel"
                  onClick={() => handleDirectionButton('left')}
                  aria-label="Move Left"
                >
                  <ArrowLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="p-4 rounded-md font-pixel"
                  onClick={() => handleDirectionButton('right')}
                  aria-label="Move Right"
                >
                  <ArrowRight className="h-8 w-8" />
                </Button>
              </div>
              {/* Down Button */}
              <Button
                variant="outline"
                size="lg"
                className="p-4 rounded-md font-pixel"
                onClick={() => handleDirectionButton('down')}
                aria-label="Move Down"
              >
                <ArrowDown className="h-8 w-8" />
              </Button>
            </div>
          )}


          <div className="text-center mt-4 md:mt-8">
            {renderActionButton()}
          </div>
           <div className="text-center mt-4">
            <Link href="/arcade" passHref>
              <Button variant="outline" className="font-pixel border-accent text-accent hover:bg-accent hover:text-accent-foreground px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-base">
                Back to Arcade Zone
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

