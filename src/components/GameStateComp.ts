import { Component } from '@vworlds/vecs';
import type { GameState } from '../types';
export class GameStateComp extends Component {
  state: GameState = 'playing';
  wave = 1;
  score = 0;
  lastAlienSpawnTime = 0;
  lastShieldSpawnTime = 0;
  lastLaserSpawnTime = 0;
  lastAuraSpawnTime = 0;
  shieldPickupExists = false;
  laserPickupExists = false;
  auraPickupExists = false;
  rocketPickupExists = false;
  lastRocketSpawnTime = 0;
  healthPickupExists = false;
  lastHealthSpawnTime = 0;
}
