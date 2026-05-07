import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { world, renderPhase } from '@src/world';
import '@src/systems/draw/StrokeStyleSystem';
import { Drawable, StrokeStyle } from '@src/components';

beforeAll(() => world.start());
afterEach(() => world.clearAllEntities());

function tick() {
  world.beginFrame(16);
  world.runPhase(renderPhase, Date.now(), 16);
  world.endFrame();
}

describe('StrokeStyleSystem', () => {
  it('adds StrokeStyle and stroke-exec statements when entity gains Drawable + StrokeStyle', () => {
    const e = world
      .entity()
      .add(Drawable)
      .set(StrokeStyle, { style: '#0f0', lineWidth: 2 });
    tick();
    const stmts = e.get(Drawable)!._statements;
    expect(stmts.length).toBeGreaterThanOrEqual(2);
    expect(stmts.some((s) => s.key === StrokeStyle)).toBe(true);
  });

  it('StrokeStyle statement sets ctx.strokeStyle and lineWidth', () => {
    const e = world
      .entity()
      .add(Drawable)
      .set(StrokeStyle, { style: '#ff0', lineWidth: 3 });
    tick();
    const stmt = e
      .get(Drawable)!
      ._statements.find((s) => s.key === StrokeStyle)!;
    const ctx = {
      strokeStyle: '',
      lineWidth: 1,
    } as unknown as CanvasRenderingContext2D;
    stmt.fn(ctx);
    expect(ctx.strokeStyle).toBe('#ff0');
    expect(ctx.lineWidth).toBe(3);
  });

  it('stroke-exec statement calls ctx.stroke()', () => {
    const e = world
      .entity()
      .add(Drawable)
      .set(StrokeStyle, { style: '#fff', lineWidth: 1 });
    tick();
    const stmts = e.get(Drawable)!._statements;
    const execStmt = stmts.find((s) => s.key !== StrokeStyle)!;
    const ctx = { stroke: vi.fn() } as unknown as CanvasRenderingContext2D;
    execStmt.fn(ctx);
    expect(ctx.stroke).toHaveBeenCalled();
  });

  it('removes statements when StrokeStyle is removed', () => {
    const e = world
      .entity()
      .add(Drawable)
      .set(StrokeStyle, { style: '#fff', lineWidth: 1 });
    tick();
    e.remove(StrokeStyle);
    tick();
    const stmts = e.get(Drawable)!._statements;
    expect(stmts.some((s) => s.key === StrokeStyle)).toBe(false);
  });
});
