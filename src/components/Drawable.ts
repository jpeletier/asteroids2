import { Component } from '@vworlds/vecs';

export interface Statement {
  key: unknown;
  priority: number;
  code: string;
  vars: Record<string, unknown>;
}

export class Drawable extends Component {
  zIndex = 0;
  _statements: Statement[] = [];
  _draw: ((ctx: CanvasRenderingContext2D, vars: Record<string, unknown>) => void) | undefined = undefined;

  addStatement(key: unknown, priority: number, code: string, vars: Record<string, unknown> = {}): void {
    this._statements = this._statements.filter(s => s.key !== key);
    this._statements.push({ key, priority, code, vars });
    this._draw = undefined;
  }

  removeStatement(key: unknown): void {
    const before = this._statements.length;
    this._statements = this._statements.filter(s => s.key !== key);
    if (this._statements.length !== before) this._draw = undefined;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this._draw) {
      const sorted = [...this._statements].sort((a, b) => b.priority - a.priority);
      const code = sorted.map(s => s.code).join(';');
      const mergedVars: Record<string, unknown> = {};
      for (let i = sorted.length - 1; i >= 0; i--) {
        Object.assign(mergedVars, sorted[i]!.vars);
      }
      this._draw = new Function('ctx', 'vars', code) as (ctx: CanvasRenderingContext2D, vars: Record<string, unknown>) => void;
      this._cachedVars = mergedVars;
    }
    this._draw(ctx, this._cachedVars!);
  }

  _cachedVars: Record<string, unknown> | undefined = undefined;
}
