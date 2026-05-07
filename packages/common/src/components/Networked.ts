import { Component } from '@vworlds/vecs';
import type { ISerializable } from './ISerializable';

export class Networked extends Component implements ISerializable {
  id = 0;

  serialize(): Record<string, unknown> {
    return { id: this.id };
  }
}
