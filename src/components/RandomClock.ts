import { Component } from '@vworlds/vecs';

export class RandomClock extends Component {
  private _minWait = 0;
  private _maxWait = 0;
  effectFunc: () => void = () => {};
  nextTick = 0;

  get minWait(): number { return this._minWait; }
  set minWait(v: number) {
    this._minWait = v;
    this.schedule();
  }

  get maxWait(): number { return this._maxWait; }
  set maxWait(v: number) {
    this._maxWait = v;
    this.schedule();
  }

  schedule(): void {
    if (this._minWait > 0 && this._maxWait > 0) {
      const now = Date.now();
      this.nextTick = now + this._minWait + Math.random() * (this._maxWait - this._minWait);
    }
  }
}
