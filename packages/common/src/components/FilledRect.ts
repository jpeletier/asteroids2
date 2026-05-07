import { Component } from '@vworlds/vecs';
import type { ISerializable } from './ISerializable';

export class FilledRect extends Component implements ISerializable {
  width = 2;
  height = 2;

  serialize(): Record<string, unknown> {
    return { width: this.width, height: this.height };
  }
}
