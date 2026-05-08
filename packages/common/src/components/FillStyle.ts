import type { ISerializable } from './ISerializable';

export class FillStyle implements ISerializable {
  style = '#fff';

  serialize(): Record<string, unknown> {
    return { style: this.style };
  }
}
