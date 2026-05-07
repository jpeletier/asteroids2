import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { world, renderPhase } from '../../../src/world';
import '../../../src/systems/draw/LaserBeamDraw';
import { Drawable, LaserWeapon } from '../../../src/components/index';

beforeAll(() => world.start());
afterEach(() => world.clearAllEntities());

function tick() {
  world.beginFrame(16);
  world.runPhase(renderPhase, Date.now(), 16);
  world.endFrame();
}

describe('LaserBeamDraw', () => {
  it('adds LaserWeapon draw statement when entity gains Drawable + LaserWeapon', () => {
    const e = world
      .entity()
      .add(Drawable)
      .set(LaserWeapon, { shots: 5, firing: false, timer: 0 });
    tick();
    const keys = e.get(Drawable)!._statements.map((s) => s.key);
    expect(keys).toContain(LaserWeapon);
  });

  it('does not draw when laser is not firing', () => {
    const e = world
      .entity()
      .add(Drawable)
      .set(LaserWeapon, { shots: 5, firing: false, timer: 0 });
    tick();
    const stmt = e
      .get(Drawable)!
      ._statements.find((s) => s.key === LaserWeapon)!;
    const ctx = {
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      strokeStyle: '',
      lineWidth: 1,
    } as unknown as CanvasRenderingContext2D;
    stmt.fn(ctx);
    expect(ctx.beginPath).not.toHaveBeenCalled();
    expect(ctx.stroke).not.toHaveBeenCalled();
  });

  it('draws laser beam when firing', () => {
    const e = world
      .entity()
      .add(Drawable)
      .set(LaserWeapon, { shots: 5, firing: true, timer: 100 });
    tick();
    const stmt = e
      .get(Drawable)!
      ._statements.find((s) => s.key === LaserWeapon)!;
    const ctx = {
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      strokeStyle: '',
      lineWidth: 1,
    } as unknown as CanvasRenderingContext2D;
    stmt.fn(ctx);
    expect(ctx.beginPath).toHaveBeenCalled();
    expect(ctx.moveTo).toHaveBeenCalledWith(0, 0);
    expect(ctx.lineTo).toHaveBeenCalledWith(1000, 0);
    expect(ctx.stroke).toHaveBeenCalled();
  });

  it('sets laser color to red and lineWidth to 4', () => {
    const e = world
      .entity()
      .add(Drawable)
      .set(LaserWeapon, { shots: 5, firing: true, timer: 100 });
    tick();
    const stmt = e
      .get(Drawable)!
      ._statements.find((s) => s.key === LaserWeapon)!;
    const ctx = {
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      strokeStyle: '',
      lineWidth: 1,
    } as unknown as CanvasRenderingContext2D;
    stmt.fn(ctx);
    expect(ctx.strokeStyle).toBe('#ff0000');
    expect(ctx.lineWidth).toBe(4);
  });

  it('removes statement when LaserWeapon is removed', () => {
    const e = world
      .entity()
      .add(Drawable)
      .set(LaserWeapon, { shots: 5, firing: false, timer: 0 });
    tick();
    e.remove(LaserWeapon);
    tick();
    const keys = e.get(Drawable)!._statements.map((s) => s.key);
    expect(keys).not.toContain(LaserWeapon);
  });
});
