import type { ISerializable } from './ISerializable';
import type { Point } from './Point';

export class Shape implements ISerializable {
  points: Point[] = [];

  serialize(): Record<string, unknown> {
    return { points: this.points };
  }
}
