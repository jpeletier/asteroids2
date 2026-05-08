import type { Entity } from '@vworlds/vecs';

export class Boomerang {
  owner: Entity | null = null;
  armed = false;
}
