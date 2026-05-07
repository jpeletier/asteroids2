import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { world, renderPhase } from '../../../src/world';
import '../../../src/systems/draw/ShieldDraw';
import { Drawable, Shield } from '../../../src/components/index';
import { ENTITY_CONFIG } from '../../../src/constants';

beforeAll(() => world.start());
afterEach(() => world.clearAllEntities());

function tick() {
  world.beginFrame(16);
  world.runPhase(renderPhase, Date.now(), 16);
  world.endFrame();
}

describe('ShieldDraw', () => {
  it('adds Shield draw statement when entity gains Drawable + Shield', () => {
    const e = world.entity().add(Drawable).set(Shield, { shieldTime: 2400 });
    tick();
    const keys = e.get(Drawable)!._statements.map((s) => s.key);
    expect(keys).toContain(Shield);
  });

  it('draws arc for shield circle', () => {
    const e = world.entity().add(Drawable).set(Shield, { shieldTime: 2400 });
    tick();
    const stmt = e.get(Drawable)!._statements.find((s) => s.key === Shield)!;
    const ctx = {
      beginPath: vi.fn(),
      arc: vi.fn(),
      stroke: vi.fn(),
      strokeStyle: '',
      lineWidth: 1,
    } as unknown as CanvasRenderingContext2D;
    stmt.fn(ctx);
    expect(ctx.beginPath).toHaveBeenCalled();
    expect(ctx.arc).toHaveBeenCalledWith(
      0,
      0,
      ENTITY_CONFIG.SHIP.RADIUS + 8,
      0,
      Math.PI * 2,
    );
    expect(ctx.stroke).toHaveBeenCalled();
    expect(ctx.lineWidth).toBe(3);
  });

  it('uses green color at full shield', () => {
    const full = ENTITY_CONFIG.SHIP.SHIELD_DURATION;
    const e = world.entity().add(Drawable).set(Shield, { shieldTime: full });
    tick();
    const stmt = e.get(Drawable)!._statements.find((s) => s.key === Shield)!;
    const ctx = {
      beginPath: vi.fn(),
      arc: vi.fn(),
      stroke: vi.fn(),
      strokeStyle: '',
      lineWidth: 1,
    } as unknown as CanvasRenderingContext2D;
    stmt.fn(ctx);
    // progress=1.0, >=0.5 branch: t=(1-1)*2=0, r=0, g=255
    expect(ctx.strokeStyle).toBe('rgb(0,255,0)');
  });

  it('uses red color at near-zero shield', () => {
    const e = world.entity().add(Drawable).set(Shield, { shieldTime: 1 });
    tick();
    const stmt = e.get(Drawable)!._statements.find((s) => s.key === Shield)!;
    const ctx = {
      beginPath: vi.fn(),
      arc: vi.fn(),
      stroke: vi.fn(),
      strokeStyle: '',
      lineWidth: 1,
    } as unknown as CanvasRenderingContext2D;
    stmt.fn(ctx);
    // progress≈0, <0.5 branch: t≈1, r=255, g=0
    expect(ctx.strokeStyle).toBe('rgb(255,0,0)');
  });

  it('removes statement when Shield is removed', () => {
    const e = world.entity().add(Drawable).set(Shield, { shieldTime: 2400 });
    tick();
    e.remove(Shield);
    tick();
    const keys = e.get(Drawable)!._statements.map((s) => s.key);
    expect(keys).not.toContain(Shield);
  });
});
