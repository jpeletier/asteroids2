import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { world, renderPhase } from '../../../src/world';
import '../../../src/systems/draw/AlphaSystem';
import { Drawable, Alpha } from '../../../src/components/index';

beforeAll(() => world.start());
afterEach(() => world.clearAllEntities());

// Draw systems use renderPhase; running it triggers enter/exit callbacks.
function tick() {
  world.beginFrame(16);
  world.runPhase(renderPhase, Date.now(), 16);
  world.endFrame();
}

describe('AlphaSystem', () => {
  it('adds alpha draw statement when entity gains Drawable + Alpha', () => {
    const e = world.entity().add(Drawable).set(Alpha, { value: 0.5 });
    tick();
    const keys = e.get(Drawable)!._statements.map((s) => s.key);
    expect(keys).toContain(Alpha);
  });

  it('adds a restore draw statement (two statements total)', () => {
    const e = world.entity().add(Drawable).set(Alpha, { value: 0.5 });
    tick();
    expect(e.get(Drawable)!._statements.length).toBeGreaterThanOrEqual(2);
  });

  it('alpha statement sets globalAlpha on the context', () => {
    const e = world.entity().add(Drawable).set(Alpha, { value: 0.7 });
    tick();
    const alphaStmt = e
      .get(Drawable)!
      ._statements.find((s) => s.key === Alpha)!;
    const ctx = { globalAlpha: 1 } as unknown as CanvasRenderingContext2D;
    alphaStmt.fn(ctx);
    expect(ctx.globalAlpha).toBe(0.7);
  });

  it('restore statement resets globalAlpha to the value it had before alpha was applied', () => {
    const e = world.entity().add(Drawable).set(Alpha, { value: 0.3 });
    tick();
    const stmts = e.get(Drawable)!._statements;
    // Sort descending priority; restore is the lowest-priority statement
    const sorted = [...stmts].sort((a, b) => b.priority - a.priority);
    const restore = sorted[sorted.length - 1]!;
    const alphaStmt = stmts.find((s) => s.key === Alpha)!;
    const ctx = { globalAlpha: 0.8 } as unknown as CanvasRenderingContext2D;
    alphaStmt.fn(ctx); // captures oldAlpha=0.8, sets globalAlpha to 0.3
    expect(ctx.globalAlpha).toBe(0.3);
    restore.fn(ctx);
    expect(ctx.globalAlpha).toBe(0.8);
  });

  it('removes statements when Alpha is removed from entity', () => {
    const e = world.entity().add(Drawable).set(Alpha, { value: 0.5 });
    tick();
    e.remove(Alpha);
    tick();
    const keys = e.get(Drawable)!._statements.map((s) => s.key);
    expect(keys).not.toContain(Alpha);
  });
});
