import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { world, renderPhase } from '@src/world';
import '@src/systems/draw/FilledRectSystem';
import { Drawable, FilledRect } from '@src/components';

beforeAll(() => world.start());
afterEach(() => world.clearAllEntities());

function tick() {
  world.beginFrame(16);
  world.runPhase(renderPhase, Date.now(), 16);
  world.endFrame();
}

describe('FilledRectSystem', () => {
  it('adds FilledRect draw statement when entity gains Drawable + FilledRect', () => {
    const e = world
      .entity()
      .add(Drawable)
      .set(FilledRect, { width: 4, height: 4 });
    tick();
    const keys = e.get(Drawable)!._statements.map((s) => s.key);
    expect(keys).toContain(FilledRect);
  });

  it('statement calls ctx.fillRect centered at origin', () => {
    const e = world
      .entity()
      .add(Drawable)
      .set(FilledRect, { width: 10, height: 6 });
    tick();
    const stmt = e
      .get(Drawable)!
      ._statements.find((s) => s.key === FilledRect)!;
    const ctx = { fillRect: vi.fn() } as unknown as CanvasRenderingContext2D;
    stmt.fn(ctx);
    expect(ctx.fillRect).toHaveBeenCalledWith(-5, -3, 10, 6);
  });

  it('removes statement when FilledRect is removed', () => {
    const e = world
      .entity()
      .add(Drawable)
      .set(FilledRect, { width: 4, height: 4 });
    tick();
    e.remove(FilledRect);
    tick();
    const keys = e.get(Drawable)!._statements.map((s) => s.key);
    expect(keys).not.toContain(FilledRect);
  });
});
