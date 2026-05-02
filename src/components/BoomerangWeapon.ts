import { Component } from '@vworlds/vecs';
import type { Entity } from '@vworlds/vecs';

export class BoomerangWeapon extends Component {
  shots = 0;
  inFlight: Set<Entity> = new Set();
}
