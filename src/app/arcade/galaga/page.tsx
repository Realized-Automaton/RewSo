
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';

const ENEMY_BLUE_URL = "https://i.ibb.co/2YFdmHJ7/image.png"; 
const ENEMY_RED_URL = "https://i.ibb.co/vvDDxWz4/image.png";   
const ENEMY_GREEN_URL = "https://i.ibb.co/RTp0NjG8/image.png"; 
const ENEMY_GREEN_BOSS_URL = "https://i.ibb.co/ymhvs1pY/image.png"; 
const PLAYER_SHIP_URL = "https://i.ibb.co/8D6dLmYp/image.png";
const PLAYER_LASER_URL = "https://i.ibb.co/VpxHqBs/laser.png"; 

const GAME_WIDTH = 448; 
const GAME_HEIGHT = 450;
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 40;
const ENEMY_WIDTH = 32;
const ENEMY_HEIGHT = 32;
const LASER_WIDTH = 6;
const LASER_HEIGHT = 20;
const PLAYER_SPEED = 10;
const LASER_SPEED = 12;
const ENEMY_BASE_SPEED = 2; 

interface GameObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'player' | 'enemy' | 'laser';
  enemyType?: 'blue' | 'red' | 'green' | 'green-boss';
  imageUrl?: string;
}

interface Laser extends GameObject {
  type: 'laser';
}

interface Enemy extends GameObject {
  type: 'enemy';
  isAlive: boolean;
  formationX: number; 
  formationY: number; 
  path: { x: number; y: number }[];
  currentPathIndex: number;
  status: 'pendingEnter' | 'entering' | 'inFormation' | 'hit';
  speed: number;
  spawnDelayTicks: number;
}

const initialEnemyFormationConfig = [
    { id: 'g1',  rowGrid: 0, colGrid: 4, type: 'green' as const, pathType: 'swoopLeft' as const, spawnDelayTicks: 0 },
    { id: 'gb1', rowGrid: 0, colGrid: 7, type: 'green-boss' as const, pathType: 'straightDown' as const, spawnDelayTicks: 20 },
    { id: 'g2',  rowGrid: 0, colGrid: 10, type: 'green' as const, pathType: 'straightDown' as const, spawnDelayTicks: 40 },
    { id: 'g3',  rowGrid: 0, colGrid: 13, type: 'green' as const, pathType: 'swoopRight' as const, spawnDelayTicks: 60 },

    { id: 'b1', rowGrid: 2, colGrid: 4, type: 'blue' as const, pathType: 'swoopLeft' as const, spawnDelayTicks: 80 },
    { id: 'b2', rowGrid: 2, colGrid: 7, type: 'blue' as const, pathType: 'straightDown' as const, spawnDelayTicks: 100 },
    { id: 'b3', rowGrid: 2, colGrid: 10, type: 'blue' as const, pathType: 'straightDown' as const, spawnDelayTicks: 120 },
    { id: 'b4', rowGrid: 2, colGrid: 13, type: 'blue' as const, pathType: 'swoopRight' as const, spawnDelayTicks: 140 },

    { id: 'r1',  rowGrid: 4, colGrid: 2, type: 'red' as const, pathType: 'swoopLeft' as const, spawnDelayTicks: 160 },
    { id: 'r2',  rowGrid: 4, colGrid: 5, type: 'red' as const, pathType: 'straightDown' as const, spawnDelayTicks: 180 },
    { id: 'r3',  rowGrid: 4, colGrid: 8, type: 'red' as const, pathType: 'straightDown' as const, spawnDelayTicks: 200 },
    { id: 'r4',  rowGrid: 4, colGrid: 11, type: 'red' as const, pathType: 'straightDown' as const, spawnDelayTicks: 220 },
    { id: 'r5',  rowGrid: 4, colGrid: 14, type: 'red' as const, pathType: 'straightDown' as const, spawnDelayTicks: 240 },
    { id: 'r6',  rowGrid: 4, colGrid: 17, type: 'red' as const, pathType: 'swoopRight' as const, spawnDelayTicks: 260 },

    { id: 'b5', rowGrid: 6, colGrid: 4, type: 'blue' as const, pathType: 'swoopLeft' as const, spawnDelayTicks: 280 },
    { id: 'b6', rowGrid: 6, colGrid: 7, type: 'blue' as const, pathType: 'straightDown' as const, spawnDelayTicks: 300 },
    { id: 'b7', rowGrid: 6, colGrid: 10, type: 'blue' as const, pathType: 'straightDown' as const, spawnDelayTicks: 320 },
    { id: 'b8', rowGrid: 6, colGrid: 13, type: 'blue' as const, pathType: 'swoopRight' as const, spawnDelayTicks: 340 },
];

const gridCols = 20; 
const gridRows = 12; 

function getEnemyImageUrl(type: 'blue' | 'red' | 'green' | 'green-boss'): string {
  if (type === 'red') return ENEMY_RED_URL;
  if (type === 'green') return ENEMY_GREEN_URL;
  if (type === 'green-boss') return ENEMY_GREEN_BOSS_URL;
  return ENEMY_BLUE_URL; 
}

const generateEnterPath = (
    targetX: number, 
    targetY: number, 
    pathType: 'swoopLeft' | 'swoopRight' | 'straightDown'
): {x: number, y: number}[] => {
  const path: {x: number, y: number}[] = [];
  const offscreenY = -ENEMY_HEIGHT * 2; 
  const offscreenXMargin = ENEMY_WIDTH * 2;

  switch (pathType) {
    case 'straightDown':
      path.push({ x: targetX, y: offscreenY }); 
      path.push({ x: targetX, y: targetY }); 
      break;
    case 'swoopLeft':
      path.push({ x: -offscreenXMargin, y: targetY - 60 }); 
      path.push({ x: targetX - 80, y: targetY - 40 });
      path.push({ x: targetX - 40, y: targetY - 15 });
      path.push({ x: targetX, y: targetY });
      break;
    case 'swoopRight':
      path.push({ x: GAME_WIDTH + offscreenXMargin, y: targetY - 60 }); 
      path.push({ x: targetX + 80, y: targetY - 40 });
      path.push({ x: targetX + 40, y: targetY - 15 });
      path.push({ x: targetX, y: targetY });
      break;
  }
  return path;
};


export default function GalagaPage() {
  const [player, setPlayer] = useState<GameObject>({ 
    id: 'player', 
    x: (GAME_WIDTH - PLAYER_WIDTH) / 2, 
    y: GAME_HEIGHT - PLAYER_HEIGHT - 10, 
    width: PLAYER_WIDTH, 
    height: PLAYER_HEIGHT, 
    type: 'player',
    imageUrl: PLAYER_SHIP_URL,
  });
  const [lasers, setLasers] = useState<Laser[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [gameTicksElapsed, setGameTicksElapsed] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const startGame = useCallback(() => {
    setScore(0);
    setGameTicksElapsed(0);
    const initializedEnemies = initialEnemyFormationConfig.map((ef, index) => {
        const formationXPos = (ef.colGrid / gridCols) * (GAME_WIDTH - ENEMY_WIDTH); 
        const formationYPos = (ef.rowGrid / gridRows) * (GAME_HEIGHT / 2.5) + 30; 
        
        const path = generateEnterPath(formationXPos, formationYPos, ef.pathType);
        
        return {
            id: ef.id + `-${index}`, 
            x: path[0].x, 
            y: path[0].y,
            width: ENEMY_WIDTH,
            height: ENEMY_HEIGHT,
            type: 'enemy' as const,
            enemyType: ef.type,
            imageUrl: getEnemyImageUrl(ef.type),
            isAlive: true,
            formationX: formationXPos,
            formationY: formationYPos,
            path: path.slice(1), 
            currentPathIndex: 0,
            status: 'pendingEnter' as const, 
            speed: ENEMY_BASE_SPEED + (Math.random() * 1) - 0.5, 
            spawnDelayTicks: ef.spawnDelayTicks,
        };
    });
    setEnemies(initializedEnemies);
    setLasers([]);
    setPlayer(p => ({...p, x: (GAME_WIDTH - PLAYER_WIDTH) / 2}));
    setGameActive(true);
    if(gameAreaRef.current) gameAreaRef.current.focus();
  }, []); 

  const movePlayer = useCallback((direction: 'left' | 'right') => {
    if (!gameActive) return;
    setPlayer(p => {
      let newX = p.x;
      if (direction === 'left') {
        newX = Math.max(0, p.x - PLAYER_SPEED);
      } else {
        newX = Math.min(GAME_WIDTH - p.width, p.x + PLAYER_SPEED);
      }
      return { ...p, x: newX };
    });
  }, [gameActive]);

  const fireLaser = useCallback(() => {
    if (!gameActive) return;
    setLasers(prevLasers => {
        if (prevLasers.length > 1) return prevLasers; 
        return [
            ...prevLasers,
            {
                id: `laser-${Date.now()}`,
                x: player.x + player.width / 2 - LASER_WIDTH / 2,
                y: player.y - LASER_HEIGHT,
                width: LASER_WIDTH,
                height: LASER_HEIGHT,
                type: 'laser',
                imageUrl: PLAYER_LASER_URL,
            }
        ];
    });
  }, [player, gameActive]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !gameActive) {
          startGame();
          return;
      }
      if (!gameActive) return;

      if (e.key === 'ArrowLeft') {
        movePlayer('left');
      } else if (e.key === 'ArrowRight') {
        movePlayer('right');
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault(); 
        fireLaser();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer, fireLaser, gameActive, startGame]);

  useEffect(() => {
    if (!gameActive) return;

    const gameLoop = setInterval(() => {
      setGameTicksElapsed(prev => prev + 1);

      let scoreToAddThisTick = 0;
      const hitEnemyIdsThisTick = new Set<string>();
      const spentLaserIdsThisTick = new Set<string>();

      const currentLasersForCollision = lasers; 
      const currentEnemiesForCollision = enemies;

      for (const laser of currentLasersForCollision) {
        if (spentLaserIdsThisTick.has(laser.id)) continue;

        for (const enemy of currentEnemiesForCollision) {
          if (enemy.isAlive && enemy.status !== 'hit' && enemy.status !== 'pendingEnter' && !hitEnemyIdsThisTick.has(enemy.id) &&
              laser.x < enemy.x + enemy.width &&
              laser.x + laser.width > enemy.x &&
              laser.y < enemy.y + enemy.height &&
              laser.y + laser.height > enemy.y) {
            
            hitEnemyIdsThisTick.add(enemy.id);
            spentLaserIdsThisTick.add(laser.id);
            scoreToAddThisTick += 100;
            break; 
          }
        }
      }
      
      if (scoreToAddThisTick > 0) {
        setScore(s => s + scoreToAddThisTick);
      }

      if (hitEnemyIdsThisTick.size > 0) {
        setEnemies(prevEnemies =>
          prevEnemies.map(e =>
            hitEnemyIdsThisTick.has(e.id) ? { ...e, isAlive: false, status: 'hit' } : e
          )
        );
      }
      
      setLasers(prevLasers =>
        prevLasers
          .filter(laser => !spentLaserIdsThisTick.has(laser.id))
          .map(laser => ({ ...laser, y: laser.y - LASER_SPEED }))
          .filter(laser => laser.y + laser.height > 0)
      );
      
      setEnemies(prevEnemies =>
        prevEnemies.map(enemy => {
          if (!enemy.isAlive || enemy.status === 'hit') return enemy;
          
          let newX = enemy.x;
          let newY = enemy.y;
          let newStatus = enemy.status;
          let newPathIndex = enemy.currentPathIndex;

          if (enemy.status === 'pendingEnter' && gameTicksElapsed >= enemy.spawnDelayTicks) {
            newStatus = 'entering';
          }
          
          if (newStatus === 'entering') {
            if (enemy.currentPathIndex >= enemy.path.length) {
              newStatus = 'inFormation';
              newX = enemy.formationX; 
              newY = enemy.formationY;
            } else {
              const targetPoint = enemy.path[enemy.currentPathIndex];
              const dx = targetPoint.x - enemy.x;
              const dy = targetPoint.y - enemy.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < enemy.speed) {
                newX = targetPoint.x;
                newY = targetPoint.y;
                newPathIndex = enemy.currentPathIndex + 1;
                if (newPathIndex >= enemy.path.length) {
                  newStatus = 'inFormation';
                  newX = enemy.formationX;
                  newY = enemy.formationY;
                }
              } else {
                newX += (dx / distance) * enemy.speed;
                newY += (dy / distance) * enemy.speed;
              }
            }
          }
          return { ...enemy, x: newX, y: newY, status: newStatus, currentPathIndex: newPathIndex };
        })
      );

    }, 50); 

    return () => clearInterval(gameLoop);
  }, [gameActive, gameTicksElapsed, enemies, lasers]);


  const allEnemiesDefeated = enemies.every(e => !e.isAlive || e.status === 'hit');


  return (
    <div className="space-y-8 p-4 md:p-8">
      <h1 className="text-5xl font-pixel text-center text-primary [text-shadow:0_0_3px_theme(colors.primary),0_0_6px_theme(colors.accent/80),0_0_10px_theme(colors.accent/60)]">
        GALAGA: ALIEN INVASION
      </h1>

      <Card className="neon-border">
        <CardHeader className="text-center">
          <CardTitle className="font-pixel text-3xl text-primary">Wave 1: Engage!</CardTitle>
          <CardDescription className="font-pixel text-lg text-muted-foreground mt-2">
            Enemies enter formation. Move: Arrow Keys, Shoot: Spacebar.
          </CardDescription>
           <p className="font-pixel text-2xl text-primary">Score: {score}</p>
        </CardHeader>
        <CardContent className="space-y-6 flex flex-col items-center">
          <div
            ref={gameAreaRef}
            className="w-full max-w-md h-[450px] bg-black border-2 border-accent rounded-md p-0 relative overflow-hidden"
            style={{ width: `${GAME_WIDTH}px`, height: `${GAME_HEIGHT}px` }}
            tabIndex={0} 
          >
            <div style={{ position: 'absolute', left: `${player.x}px`, top: `${player.y}px`, width: `${player.width}px`, height: `${player.height}px` }}>
              <Image
                src={player.imageUrl!}
                alt="Player Ship"
                fill
                style={{ objectFit: 'contain' }}
                unoptimized={true}
              />
            </div>

            {enemies.map(enemy => enemy.isAlive && enemy.status !== 'hit' && enemy.status !== 'pendingEnter' && ( 
              <div 
                key={enemy.id} 
                style={{ position: 'absolute', left: `${enemy.x}px`, top: `${enemy.y}px`, width: `${enemy.width}px`, height: `${enemy.height}px` }}
              >
                <Image
                  src={enemy.imageUrl!}
                  alt={`Enemy ${enemy.enemyType}`}
                  fill
                  style={{ objectFit: 'contain' }}
                  unoptimized={true}
                />
              </div>
            ))}

            {lasers.map(laser => (
              <div 
                key={laser.id} 
                style={{ position: 'absolute', left: `${laser.x}px`, top: `${laser.y}px`, width: `${laser.width}px`, height: `${laser.height}px` }}
              >
                 <Image
                  src={laser.imageUrl!}
                  alt="Laser"
                  fill
                  style={{ objectFit: 'contain' }}
                  unoptimized={true}
                />
              </div>
            ))}
            
            {gameActive && allEnemiesDefeated && enemies.length > 0 && enemies.some(e => e.status !== 'pendingEnter') && ( 
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
                    <p className="font-pixel text-4xl text-accent">WAVE CLEARED!</p>
                </div>
            )}
          </div>

          {!gameActive ? (
            <Button onClick={startGame} variant="outline" className="font-pixel border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg">
              Start Wave 1
            </Button>
          ) : allEnemiesDefeated && enemies.length > 0 && enemies.some(e => e.status !== 'pendingEnter') ? (
             <Button onClick={startGame} variant="outline" className="font-pixel border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg">
              Play Again
            </Button>
          ) : null }

          <div className="text-center mt-4">
            <Link href="/arcade" passHref>
              <Button variant="outline" className="font-pixel border-accent text-accent hover:bg-accent hover:text-accent-foreground px-6 py-3 text-lg">
                Back to Arcade Zone
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

