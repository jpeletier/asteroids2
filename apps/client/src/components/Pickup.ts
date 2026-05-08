import type { Entity } from '@vworlds/vecs';
export class Pickup {
  effectFunc: (picker: Entity, source: Entity) => void = () => {};
}
