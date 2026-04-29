import { Component } from '@vworlds/vecs';

export interface Statement {
  key: unknown;
  priority: number;
  fn: (ctx: CanvasRenderingContext2D) => void;
}

export class Drawable extends Component {
  zIndex = 0;
  _statements: Statement[] = [];
  _sortedFns: ((ctx: CanvasRenderingContext2D) => void)[] | undefined =
    undefined;

  addStatement(
    key: unknown,
    priority: number,
    fn: (ctx: CanvasRenderingContext2D) => void,
  ): void {
    this._statements = this._statements.filter((s) => s.key !== key);
    this._statements.push({ key, priority, fn });
    this._sortedFns = undefined;
  }

  removeStatement(key: unknown): void {
    const before = this._statements.length;
    this._statements = this._statements.filter((s) => s.key !== key);
    if (this._statements.length !== before) this._sortedFns = undefined;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this._sortedFns) {
      this._sortedFns = [...this._statements]
        .sort((a, b) => b.priority - a.priority)
        .map((s) => s.fn);
    }
    for (const fn of this._sortedFns) {
      fn(ctx);
    }
  }
}
