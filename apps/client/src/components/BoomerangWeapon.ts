import type { Entity } from '@vworlds/vecs';

export class BoomerangWeapon {
  shots = 0;
  inFlight: Set<Entity> = new Set();
}
