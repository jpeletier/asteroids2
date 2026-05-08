import type { ISerializable } from './ISerializable';

export class Rotation implements ISerializable {
  angle = 0;

  serialize(): Record<string, unknown> {
    return { angle: this.angle };
  }
}
