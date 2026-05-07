import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { world, updatePhase } from '@src/world';
import '@src/systems/FrictionSystem';
import { Velocity, Friction } from '@src/components';

beforeAll(() => world.start());
afterEach(() => world.clearAllEntities());

function tick() {
  world.beginFrame(16);
  world.runPhase(updatePhase, Date.now(), 16);
  world.endFrame();
}

describe('FrictionSystem', () => {
  it('multiplies velocity by friction factor', () => {
    const e = world
      .entity()
      .set(Velocity, { vx: 10, vy: 20 })
      .set(Friction, { value: 0.5 });
    tick();
    const vel = e.get(Velocity)!;
    expect(vel.vx).toBeCloseTo(5);
    expect(vel.vy).toBeCloseTo(10);
  });

  it('applies friction repeatedly each tick', () => {
    const e = world
      .entity()
      .set(Velocity, { vx: 100, vy: 0 })
      .set(Friction, { value: 0.98 });
    tick();
    tick();
    const vel = e.get(Velocity)!;
    expect(vel.vx).toBeCloseTo(100 * 0.98 * 0.98);
  });

  it('handles zero velocity', () => {
    const e = world
      .entity()
      .set(Velocity, { vx: 0, vy: 0 })
      .set(Friction, { value: 0.98 });
    tick();
    const vel = e.get(Velocity)!;
    expect(vel.vx).toBeCloseTo(0);
    expect(vel.vy).toBeCloseTo(0);
  });

  it('does not affect entities without Friction', () => {
    const e = world.entity().set(Velocity, { vx: 10, vy: 10 });
    tick();
    const vel = e.get(Velocity)!;
    expect(vel.vx).toBeCloseTo(10);
    expect(vel.vy).toBeCloseTo(10);
  });
});
