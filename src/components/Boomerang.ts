import { Component } from '@vworlds/vecs';
import type { Entity } from '@vworlds/vecs';

export class Boomerang extends Component {
  owner: Entity | null = null;
  armed = false;
}
