import type { ISerializable } from './ISerializable';

export class StrokeStyle implements ISerializable {
  style = '#fff';
  lineWidth = 2;

  serialize(): Record<string, unknown> {
    return { style: this.style, lineWidth: this.lineWidth };
  }
}
