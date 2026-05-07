import { Component } from '@vworlds/vecs';
import type { GameState } from '../types';
export class GameStateComp extends Component {
  state: GameState = 'playing';
  wave = 1;
  score = 0;
}
