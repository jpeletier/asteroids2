import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { world, renderPhase } from '@src/world';
import '@src/systems/draw/FillStyleSystem';
import { Drawable, FillStyle } from '@src/components';

beforeAll(() => world.start());
afterEach(() => world.clearAllEntities());

function tick() {
  world.beginFrame(16);
  world.runPhase(renderPhase, Date.now(), 16);
  world.endFrame();
}

describe('FillStyleSystem', () => {
  it('adds FillStyle and fill-exec statements when entity gains Drawable + FillStyle', () => {
    const e = world.entity().add(Drawable).set(FillStyle, { style: '#f00' });
    tick();
    const stmts = e.get(Drawable)!._statements;
    expect(stmts.length).toBeGreaterThanOrEqual(2);
    expect(stmts.some((s) => s.key === FillStyle)).toBe(true);
  });

  it('FillStyle statement sets ctx.fillStyle', () => {
    const e = world.entity().add(Drawable).set(FillStyle, { style: '#abc' });
    tick();
    const stmt = e.get(Drawable)!._statements.find((s) => s.key === FillStyle)!;
    const ctx = { fillStyle: '' } as unknown as CanvasRenderingContext2D;
    stmt.fn(ctx);
    expect(ctx.fillStyle).toBe('#abc');
  });

  it('fill-exec statement calls ctx.fill()', () => {
    const e = world.entity().add(Drawable).set(FillStyle, { style: '#fff' });
    tick();
    const stmts = e.get(Drawable)!._statements;
    const fillExec = stmts.find((s) => s.key !== FillStyle)!;
    const ctx = { fill: vi.fn() } as unknown as CanvasRenderingContext2D;
    fillExec.fn(ctx);
    expect(ctx.fill).toHaveBeenCalled();
  });

  it('removes statements when FillStyle is removed', () => {
    const e = world.entity().add(Drawable).set(FillStyle, { style: '#fff' });
    tick();
    e.remove(FillStyle);
    tick();
    const stmts = e.get(Drawable)!._statements;
    expect(stmts.some((s) => s.key === FillStyle)).toBe(false);
  });
});
