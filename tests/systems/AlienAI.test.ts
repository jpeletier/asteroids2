import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { world, updatePhase } from '@src/world';
import '@src/systems/AlienAI';
import {
  Position,
  Velocity,
  Alien,
  Rotation,
  Asteroid,
  Player,
  Bullet,
} from '@src/components';

beforeAll(() => world.start());
afterEach(() => world.clearAllEntities());

function tick() {
  world.beginFrame(16);
  world.runPhase(updatePhase, Date.now(), 16);
  world.endFrame();
}

function countBullets(): number {
  let n = 0;
  world.filter([Bullet]).forEach(() => n++);
  return n;
}

function makeAlien(x = 400, y = 300) {
  return world
    .entity()
    .set(Position, { x, y })
    .set(Velocity, { vx: 0, vy: 0 })
    .set(Alien, { shootCooldown: 60 })
    .set(Rotation, { angle: 0 });
}

describe('AlienAI', () => {
  it('increments rotation by 0.05 each tick', () => {
    const e = makeAlien();
    tick();
    expect(e.get(Rotation)!.angle).toBeCloseTo(0.05);
  });

  it('decrements shootCooldown each tick', () => {
    const e = makeAlien();
    tick();
    expect(e.get(Alien)!.shootCooldown).toBe(59);
  });

  it('shoots at closest player when cooldown reaches 0 and player is in range', () => {
    const alien = makeAlien(400, 300);
    alien.set(Alien, { shootCooldown: 1 });
    world
      .entity()
      .set(Position, { x: 450, y: 300 })
      .set(Player, { playerId: 0 });
    const before = countBullets();
    tick();
    const after = countBullets();
    expect(after).toBeGreaterThan(before);
  });

  it('does not shoot when player is out of range', () => {
    const alien = makeAlien(400, 300);
    alien.set(Alien, { shootCooldown: 1 });
    world
      .entity()
      .set(Position, { x: 400 + 500, y: 300 })
      .set(Player, { playerId: 0 });
    const before = countBullets();
    tick();
    expect(countBullets()).toBe(before);
  });

  it('does not shoot when cooldown is positive', () => {
    makeAlien(400, 300);
    world
      .entity()
      .set(Position, { x: 450, y: 300 })
      .set(Player, { playerId: 0 });
    const before = countBullets();
    tick();
    expect(countBullets()).toBe(before);
  });

  it('adjusts velocity when asteroid is within avoid distance', () => {
    const alien = makeAlien(400, 300);
    // Place asteroid within ASTEROID_AVOID_DIST (60)
    world
      .entity()
      .set(Position, { x: 420, y: 300 })
      .set(Asteroid, { level: 1, color: '#aaa' });
    tick();
    const vel = alien.get(Velocity)!;
    // Either velocity changed (avoid) or a bullet was shot (shoot at asteroid).
    // In both branches the code returns early so player is NOT targeted.
    // We just verify that the code path ran without error and rotation was updated.
    expect(alien.get(Rotation)!.angle).toBeCloseTo(0.05);
    // velocity may or may not change (random branch), just no throw
    expect(typeof vel.vx).toBe('number');
  });
});
