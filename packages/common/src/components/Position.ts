import { Component } from '@vworlds/vecs';
import type { ISerializable } from './ISerializable';

export class Position extends Component implements ISerializable {
  x = 0;
  y = 0;

  serialize(): Record<string, unknown> {
    return { x: this.x, y: this.y };
  }
}
