import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { world, renderPhase } from '@src/world';
import '@src/systems/draw/ArcSystem';
import { Drawable, Arc } from '@src/components';

beforeAll(() => world.start());
afterEach(() => world.clearAllEntities());

function tick() {
  world.beginFrame(16);
  world.runPhase(renderPhase, Date.now(), 16);
  world.endFrame();
}

describe('ArcSystem', () => {
  it('adds an Arc draw statement when entity gains Drawable + Arc', () => {
    const e = world
      .entity()
      .add(Drawable)
      .set(Arc, { radius: 10, startAngle: 0, endAngle: Math.PI * 2 });
    tick();
    const keys = e.get(Drawable)!._statements.map((s) => s.key);
    expect(keys).toContain(Arc);
  });

  it('arc statement calls ctx.beginPath and ctx.arc with correct parameters', () => {
    const e = world
      .entity()
      .add(Drawable)
      .set(Arc, { radius: 15, startAngle: 0.5, endAngle: 2.5 });
    tick();
    const stmt = e.get(Drawable)!._statements.find((s) => s.key === Arc)!;
    const ctx = {
      beginPath: vi.fn(),
      arc: vi.fn(),
    } as unknown as CanvasRenderingContext2D;
    stmt.fn(ctx);
    expect(ctx.beginPath).toHaveBeenCalled();
    expect(ctx.arc).toHaveBeenCalledWith(0, 0, 15, 0.5, 2.5);
  });

  it('removes arc statement when Arc component is removed', () => {
    const e = world
      .entity()
      .add(Drawable)
      .set(Arc, { radius: 10, startAngle: 0, endAngle: Math.PI * 2 });
    tick();
    e.remove(Arc);
    tick();
    const keys = e.get(Drawable)!._statements.map((s) => s.key);
    expect(keys).not.toContain(Arc);
  });
});
