import { Component } from '@vworlds/vecs';
import type { ISerializable } from './ISerializable';

export class FillStyle extends Component implements ISerializable {
  style = '#fff';

  serialize(): Record<string, unknown> {
    return { style: this.style };
  }
}
