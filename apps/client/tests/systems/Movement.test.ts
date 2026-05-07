import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { world, updatePhase } from '@src/world';
import '@src/systems/Movement';
import { Position, Velocity } from '@src/components';

beforeAll(() => world.start());
afterEach(() => world.clearAllEntities());

function tick() {
  world.beginFrame(16);
  world.runPhase(updatePhase, Date.now(), 16);
  world.endFrame();
}

describe('Movement', () => {
  it('adds velocity to position each tick', () => {
    const e = world
      .entity()
      .set(Position, { x: 0, y: 0 })
      .set(Velocity, { vx: 5, vy: -3 });
    tick();
    const pos = e.get(Position)!;
    expect(pos.x).toBeCloseTo(5);
    expect(pos.y).toBeCloseTo(-3);
  });

  it('accumulates over multiple ticks', () => {
    const e = world
      .entity()
      .set(Position, { x: 10, y: 20 })
      .set(Velocity, { vx: 2, vy: 1 });
    tick();
    tick();
    const pos = e.get(Position)!;
    expect(pos.x).toBeCloseTo(14);
    expect(pos.y).toBeCloseTo(22);
  });

  it('handles negative velocity', () => {
    const e = world
      .entity()
      .set(Position, { x: 100, y: 100 })
      .set(Velocity, { vx: -10, vy: -5 });
    tick();
    const pos = e.get(Position)!;
    expect(pos.x).toBeCloseTo(90);
    expect(pos.y).toBeCloseTo(95);
  });

  it('does not affect entities without Velocity', () => {
    const e = world.entity().set(Position, { x: 42, y: 7 });
    tick();
    const pos = e.get(Position)!;
    expect(pos.x).toBeCloseTo(42);
    expect(pos.y).toBeCloseTo(7);
  });
});
