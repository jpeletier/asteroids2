export type OwnerType = 'player' | 'alien';
export type GameState = 'playing' | 'lose';

export interface Controls {
  thrust: string;
  rotateLeft: string;
  rotateRight: string;
  shoot: string;
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
