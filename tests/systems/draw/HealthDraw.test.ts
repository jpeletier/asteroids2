import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { world, renderPhase } from '@src/world';
import '@src/systems/draw/HealthDraw';
import { Drawable, Health } from '@src/components';

beforeAll(() => world.start());
afterEach(() => world.clearAllEntities());

function tick() {
  world.beginFrame(16);
  world.runPhase(renderPhase, Date.now(), 16);
  world.endFrame();
}

describe('HealthDraw', () => {
  it('adds Health draw statement when entity gains Drawable + Health', () => {
    const e = world
      .entity()
      .add(Drawable)
      .set(Health, { hp: 100, maxHp: 100, healthBarTimer: 0 });
    tick();
    const keys = e.get(Drawable)!._statements.map((s) => s.key);
    expect(keys).toContain(Health);
  });

  it('does not draw health bar when healthBarTimer is 0', () => {
    const e = world
      .entity()
      .add(Drawable)
      .set(Health, { hp: 80, maxHp: 100, healthBarTimer: 0 });
    tick();
    const stmt = e.get(Drawable)!._statements.find((s) => s.key === Health)!;
    const ctx = {
      strokeRect: vi.fn(),
      fillRect: vi.fn(),
      strokeStyle: '',
      lineWidth: 1,
      fillStyle: '',
    } as unknown as CanvasRenderingContext2D;
    stmt.fn(ctx);
    expect(ctx.strokeRect).not.toHaveBeenCalled();
    expect(ctx.fillRect).not.toHaveBeenCalled();
  });

  it('draws health bar when healthBarTimer > 0', () => {
    const e = world
      .entity()
      .add(Drawable)
      .set(Health, { hp: 80, maxHp: 100, healthBarTimer: 30 });
    tick();
    const stmt = e.get(Drawable)!._statements.find((s) => s.key === Health)!;
    const ctx = {
      strokeRect: vi.fn(),
      fillRect: vi.fn(),
      strokeStyle: '',
      lineWidth: 1,
      fillStyle: '',
    } as unknown as CanvasRenderingContext2D;
    stmt.fn(ctx);
    expect(ctx.strokeRect).toHaveBeenCalled();
    expect(ctx.fillRect).toHaveBeenCalled();
  });

  it('uses green fill for hp > 66%', () => {
    const e = world
      .entity()
      .add(Drawable)
      .set(Health, { hp: 100, maxHp: 100, healthBarTimer: 10 });
    tick();
    const stmt = e.get(Drawable)!._statements.find((s) => s.key === Health)!;
    const ctx = {
      strokeRect: vi.fn(),
      fillRect: vi.fn(),
      strokeStyle: '',
      lineWidth: 1,
      fillStyle: '',
    } as unknown as CanvasRenderingContext2D;
    stmt.fn(ctx);
    expect(ctx.fillStyle).toBe('#0f0');
  });

  it('uses yellow fill for hp between 33% and 66%', () => {
    const e = world
      .entity()
      .add(Drawable)
      .set(Health, { hp: 50, maxHp: 100, healthBarTimer: 10 });
    tick();
    const stmt = e.get(Drawable)!._statements.find((s) => s.key === Health)!;
    const ctx = {
      strokeRect: vi.fn(),
      fillRect: vi.fn(),
      strokeStyle: '',
      lineWidth: 1,
      fillStyle: '',
    } as unknown as CanvasRenderingContext2D;
    stmt.fn(ctx);
    expect(ctx.fillStyle).toBe('#ff0');
  });

  it('uses red fill for hp <= 33%', () => {
    const e = world
      .entity()
      .add(Drawable)
      .set(Health, { hp: 20, maxHp: 100, healthBarTimer: 10 });
    tick();
    const stmt = e.get(Drawable)!._statements.find((s) => s.key === Health)!;
    const ctx = {
      strokeRect: vi.fn(),
      fillRect: vi.fn(),
      strokeStyle: '',
      lineWidth: 1,
      fillStyle: '',
    } as unknown as CanvasRenderingContext2D;
    stmt.fn(ctx);
    expect(ctx.fillStyle).toBe('#f00');
  });
});
