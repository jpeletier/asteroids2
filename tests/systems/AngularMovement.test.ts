import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { world, updatePhase } from '@src/world';
import '@src/systems/AngularMovement';
import { Rotation, AngularVelocity } from '@src/components';

beforeAll(() => world.start());
afterEach(() => world.clearAllEntities());

function tick() {
  world.beginFrame(16);
  world.runPhase(updatePhase, Date.now(), 16);
  world.endFrame();
}

describe('AngularMovement', () => {
  it('adds omega to angle each tick', () => {
    const e = world
      .entity()
      .set(Rotation, { angle: 0 })
      .set(AngularVelocity, { omega: 0.1 });
    tick();
    expect(e.get(Rotation)!.angle).toBeCloseTo(0.1);
  });

  it('accumulates over multiple ticks', () => {
    const e = world
      .entity()
      .set(Rotation, { angle: 1 })
      .set(AngularVelocity, { omega: 0.5 });
    tick();
    tick();
    expect(e.get(Rotation)!.angle).toBeCloseTo(2);
  });

  it('handles negative omega', () => {
    const e = world
      .entity()
      .set(Rotation, { angle: Math.PI })
      .set(AngularVelocity, { omega: -0.2 });
    tick();
    expect(e.get(Rotation)!.angle).toBeCloseTo(Math.PI - 0.2);
  });

  it('does not affect entities without AngularVelocity', () => {
    const e = world.entity().set(Rotation, { angle: 1.5 });
    tick();
    expect(e.get(Rotation)!.angle).toBeCloseTo(1.5);
  });
});
