import type { GameState } from '../types';
export class GameStateComp {
  state: GameState = 'playing';
  wave = 1;
  score = 0;
}
