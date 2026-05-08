import type { ISerializable } from './ISerializable';

export class Position implements ISerializable {
  x = 0;
  y = 0;

  serialize(): Record<string, unknown> {
    return { x: this.x, y: this.y };
  }
}
