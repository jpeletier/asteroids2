import type { Ship } from './entities/Ship';
import type { Bullet } from './entities/Bullet';
import type { Asteroid } from './entities/Asteroid';
import type { Particle } from './entities/Particle';
import type { AlienShip } from './entities/AlienShip';
import type { Boss } from './entities/Boss';
import type { ShieldPowerup, LaserPowerup, AuraPowerup } from './entities/Powerup';

export type OwnerType = 'player' | 'alien' | 'boss';
export type GameState = 'playing' | 'boss' | 'win' | 'lose';

export interface Controls {
  thrust: string;
  rotateLeft: string;
  rotateRight: string;
  shoot: string;
}

export interface Entities {
  players: Ship[];
  bullets: Bullet[];
  asteroids: Asteroid[];
  particles: Particle[];
  aliens: AlienShip[];
  boss: Boss | null;
  shieldPowerup: ShieldPowerup | null;
  laserPowerup: LaserPowerup | null;
  auraPowerup: AuraPowerup | null;
}

export interface GameContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  keys: Record<string, boolean>;
  entities: Entities;
  explode: (
    x: number,
    y: number,
    color: string,
    entities: Entities,
    count?: number,
  ) => void;
  updateScore: (amount: number) => void;
  setGameState: (state: GameState) => void;
}

export interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export interface Point {
  x: number;
  y: number;
}
