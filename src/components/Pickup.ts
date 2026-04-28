import { Component } from '@vworlds/vecs';
import type { Entity } from '@vworlds/vecs';
export class Pickup extends Component { effectFunc: (picker: Entity) => void = () => {}; }
