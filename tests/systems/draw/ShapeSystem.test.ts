import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { world, renderPhase } from '@src/world';
import '@src/systems/draw/ShapeSystem';
import { Drawable, Shape } from '@src/components';

beforeAll(() => world.start());
afterEach(() => world.clearAllEntities());

function tick() {
  world.beginFrame(16);
  world.runPhase(renderPhase, Date.now(), 16);
  world.endFrame();
}

describe('ShapeSystem', () => {
  it('adds Shape draw statement when entity gains Drawable + Shape', () => {
    const e = world
      .entity()
      .add(Drawable)
      .set(Shape, { points: [{ x: 0, y: 0 }] });
    tick();
    const keys = e.get(Drawable)!._statements.map((s) => s.key);
    expect(keys).toContain(Shape);
  });

  it('draws polygon using moveTo and lineTo', () => {
    const points = [
      { x: 0, y: -10 },
      { x: 10, y: 5 },
      { x: -10, y: 5 },
    ];
    const e = world.entity().add(Drawable).set(Shape, { points });
    tick();
    const stmt = e.get(Drawable)!._statements.find((s) => s.key === Shape)!;
    const ctx = {
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
    } as unknown as CanvasRenderingContext2D;
    stmt.fn(ctx);
    expect(ctx.beginPath).toHaveBeenCalled();
    expect(ctx.moveTo).toHaveBeenCalledWith(0, -10);
    expect(ctx.lineTo).toHaveBeenCalledWith(10, 5);
    expect(ctx.lineTo).toHaveBeenCalledWith(-10, 5);
    expect(ctx.closePath).toHaveBeenCalled();
  });

  it('handles empty points array without error', () => {
    const e = world.entity().add(Drawable).set(Shape, { points: [] });
    tick();
    const stmt = e.get(Drawable)!._statements.find((s) => s.key === Shape)!;
    const ctx = {
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
    } as unknown as CanvasRenderingContext2D;
    expect(() => stmt.fn(ctx)).not.toThrow();
    expect(ctx.moveTo).not.toHaveBeenCalled();
  });

  it('removes statement when Shape is removed', () => {
    const e = world.entity().add(Drawable).set(Shape, { points: [] });
    tick();
    e.remove(Shape);
    tick();
    const keys = e.get(Drawable)!._statements.map((s) => s.key);
    expect(keys).not.toContain(Shape);
  });
});
