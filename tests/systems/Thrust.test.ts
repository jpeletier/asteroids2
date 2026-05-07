import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { world, updatePhase } from '../../src/world';
import '../../src/systems/Thrust';
import { Velocity, Thrust, Rotation } from '../../src/components/index';

beforeAll(() => world.start());
afterEach(() => world.clearAllEntities());

function tick() {
  world.beginFrame(16);
  world.runPhase(updatePhase, Date.now(), 16);
  world.endFrame();
}

describe('Thrust', () => {
  it('applies force in rotation direction when active', () => {
    const e = world
      .entity()
      .set(Velocity, { vx: 0, vy: 0 })
      .set(Thrust, { force: 1, active: true })
      .set(Rotation, { angle: 0 });
    tick();
    const vel = e.get(Velocity)!;
    expect(vel.vx).toBeCloseTo(Math.cos(0) * 1);
    expect(vel.vy).toBeCloseTo(Math.sin(0) * 1);
  });

  it('resets active to false after applying thrust', () => {
    const e = world
      .entity()
      .set(Velocity, { vx: 0, vy: 0 })
      .set(Thrust, { force: 1, active: true })
      .set(Rotation, { angle: 0 });
    tick();
    expect(e.get(Thrust)!.active).toBe(false);
  });

  it('applies force in the correct angle', () => {
    const angle = Math.PI / 2;
    const e = world
      .entity()
      .set(Velocity, { vx: 0, vy: 0 })
      .set(Thrust, { force: 2, active: true })
      .set(Rotation, { angle });
    tick();
    const vel = e.get(Velocity)!;
    expect(vel.vx).toBeCloseTo(Math.cos(angle) * 2, 5);
    expect(vel.vy).toBeCloseTo(Math.sin(angle) * 2, 5);
  });

  it('does not apply force when inactive', () => {
    const e = world
      .entity()
      .set(Velocity, { vx: 5, vy: 3 })
      .set(Thrust, { force: 10, active: false })
      .set(Rotation, { angle: 0 });
    tick();
    const vel = e.get(Velocity)!;
    expect(vel.vx).toBeCloseTo(5);
    expect(vel.vy).toBeCloseTo(3);
  });

  it('does not apply thrust a second tick (active resets)', () => {
    const e = world
      .entity()
      .set(Velocity, { vx: 0, vy: 0 })
      .set(Thrust, { force: 1, active: true })
      .set(Rotation, { angle: 0 });
    tick();
    const vxAfterFirst = e.get(Velocity)!.vx;
    tick();
    expect(e.get(Velocity)!.vx).toBeCloseTo(vxAfterFirst);
  });
});
