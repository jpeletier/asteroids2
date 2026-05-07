import { Component } from '@vworlds/vecs';
import type { ISerializable } from './ISerializable';

export class Arc extends Component implements ISerializable {
  radius = 10;
  startAngle = 0;
  endAngle = Math.PI * 2;

  serialize(): Record<string, unknown> {
    return {
      radius: this.radius,
      startAngle: this.startAngle,
      endAngle: this.endAngle,
    };
  }
}
