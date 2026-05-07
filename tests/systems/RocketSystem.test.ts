import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { world, updatePhase } from '@src/world';
import '@src/systems/RocketSystem';
import {
  Position,
  Velocity,
  Rotation,
  Rocket,
  Alien,
  Asteroid,
} from '@src/components';
import { ENTITY_CONFIG } from '@src/constants';

beforeAll(() => world.start());
afterEach(() => world.clearAllEntities());

function tick() {
  world.beginFrame(16);
  world.runPhase(updatePhase, Date.now(), 16);
  world.endFrame();
}

function makeRocket(x = 0, y = 0, angle = 0, straightTimer = 0) {
  return world
    .entity()
    .set(Position, { x, y })
    .set(Velocity, {
      vx: Math.cos(angle) * ENTITY_CONFIG.ROCKET.SPEED,
      vy: Math.sin(angle) * ENTITY_CONFIG.ROCKET.SPEED,
    })
    .set(Rotation, { angle })
    .set(Rocket, { straightTimer });
}

describe('RocketSystem', () => {
  it('does not steer while straightTimer is positive', () => {
    const r = makeRocket(0, 0, 0, 10);
    const vxBefore = r.get(Velocity)!.vx;
    const vyBefore = r.get(Velocity)!.vy;
    world
      .entity()
      .set(Position, { x: 50, y: 0 })
      .set(Alien, { shootCooldown: 0 });
    tick();
    expect(r.get(Velocity)!.vx).toBeCloseTo(vxBefore);
    expect(r.get(Velocity)!.vy).toBeCloseTo(vyBefore);
    expect(r.get(Rocket)!.straightTimer).toBe(9);
  });

  it('steers toward alien when within HOME_RANGE', () => {
    const r = makeRocket(0, 0, Math.PI / 2); // pointing down
    world
      .entity()
      .set(Position, { x: 0, y: 100 })
      .set(Alien, { shootCooldown: 0 });
    tick();
    const vel = r.get(Velocity)!;
    // After steering toward (0,100), vy should be positive
    expect(vel.vy).toBeGreaterThan(0);
  });

  it('steers toward asteroid when no alien in range', () => {
    const r = makeRocket(0, 0, Math.PI / 2); // pointing down
    world
      .entity()
      .set(Position, { x: 0, y: 100 })
      .set(Asteroid, { level: 1, color: '#aaa' });
    tick();
    const vel = r.get(Velocity)!;
    expect(vel.vy).toBeGreaterThan(0);
  });

  it('prefers alien over asteroid when both in range', () => {
    const r = makeRocket(0, 0, 0);
    // Alien to the right, asteroid above
    world
      .entity()
      .set(Position, { x: 100, y: 0 })
      .set(Alien, { shootCooldown: 0 });
    world
      .entity()
      .set(Position, { x: 0, y: -100 })
      .set(Asteroid, { level: 1, color: '#aaa' });
    tick();
    const vel = r.get(Velocity)!;
    // Rocket should steer toward alien (positive x direction)
    expect(vel.vx).toBeGreaterThan(0);
  });

  it('does not steer when no targets are in range', () => {
    const r = makeRocket(0, 0, 0);
    const vxBefore = r.get(Velocity)!.vx;
    // No targets
    tick();
    expect(r.get(Velocity)!.vx).toBeCloseTo(vxBefore);
  });

  it('does not steer when targets are out of HOME_RANGE', () => {
    const r = makeRocket(0, 0, 0);
    const range = ENTITY_CONFIG.ROCKET.HOME_RANGE;
    world
      .entity()
      .set(Position, { x: range + 100, y: 0 })
      .set(Alien, { shootCooldown: 0 });
    const vxBefore = r.get(Velocity)!.vx;
    tick();
    expect(r.get(Velocity)!.vx).toBeCloseTo(vxBefore);
  });

  it('caps turn rate to TURN_RATE', () => {
    // Rocket pointing right (angle=0), target directly up (90° away)
    const r = makeRocket(0, 0, 0);
    world
      .entity()
      .set(Position, { x: 0, y: -100 })
      .set(Alien, { shootCooldown: 0 });
    tick();
    const newAngle = r.get(Rotation)!.angle;
    // Turn should be exactly -TURN_RATE (toward up)
    expect(Math.abs(newAngle)).toBeCloseTo(ENTITY_CONFIG.ROCKET.TURN_RATE);
  });

  it('updates rotation to match new velocity direction', () => {
    const r = makeRocket(0, 0, 0);
    world
      .entity()
      .set(Position, { x: 0, y: 100 })
      .set(Alien, { shootCooldown: 0 });
    tick();
    const vel = r.get(Velocity)!;
    const rot = r.get(Rotation)!;
    expect(rot.angle).toBeCloseTo(Math.atan2(vel.vy, vel.vx), 5);
  });
});
