import { Component } from '@vworlds/vecs';
import type { ISerializable } from './ISerializable';

export class Rotation extends Component implements ISerializable {
  angle = 0;

  serialize(): Record<string, unknown> {
    return { angle: this.angle };
  }
}
