import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { world, updatePhase, gameState } from '../../src/world';
import '../../src/systems/LaserSystem';
import {
  Position,
  LaserWeapon,
  Rotation,
  Collider,
  Asteroid,
  Alien,
  DefaultWeapon,
} from '../../src/components/index';
import {
  CAT_ASTEROID,
  CAT_PLAYER_BULLET,
  CAT_ENEMY,
} from '../../src/constants';

beforeAll(() => world.start());
afterEach(() => {
  world.clearAllEntities();
  gameState.score = 0;
  gameState.state = 'playing';
});

function tick() {
  world.beginFrame(16);
  world.runPhase(updatePhase, Date.now(), 16);
  world.endFrame();
}

function makeShipWithLaser(x = 0, y = 0, angle = 0, shots = 5, timer = 10) {
  return world
    .entity()
    .set(Position, { x, y })
    .set(Rotation, { angle })
    .set(LaserWeapon, { shots, firing: true, timer });
}

describe('LaserSystem', () => {
  it('does nothing when laser is not firing', () => {
    const e = makeShipWithLaser(0, 0, 0, 5, 10);
    e.set(LaserWeapon, { shots: 5, firing: false, timer: 10 });
    const scoreBefore = gameState.score;
    tick();
    expect(gameState.score).toBe(scoreBefore);
  });

  it('decrements timer each tick while firing', () => {
    const e = makeShipWithLaser(0, 0, 0, 5, 10);
    tick();
    expect(e.get(LaserWeapon)!.timer).toBe(9);
  });

  it('stops firing when timer reaches zero', () => {
    const e = makeShipWithLaser(0, 0, 0, 1, 1);
    tick();
    expect(e.get(LaserWeapon)!.firing).toBe(false);
  });

  it('switches to DefaultWeapon when shots are 0 and timer expires', () => {
    const e = makeShipWithLaser(0, 0, 0, 0, 1);
    tick();
    expect(e.get(LaserWeapon)).toBeUndefined();
    expect(e.get(DefaultWeapon)).toBeDefined();
  });

  it('keeps LaserWeapon when shots remain after timer expires', () => {
    const e = makeShipWithLaser(0, 0, 0, 3, 1);
    tick();
    expect(e.get(LaserWeapon)).toBeDefined();
    expect(e.get(DefaultWeapon)).toBeUndefined();
  });

  it('destroys asteroid on the laser path', () => {
    makeShipWithLaser(0, 0, 0, 5, 10);
    let destroyed = false;
    const asteroid = world
      .entity()
      .set(Position, { x: 100, y: 0 })
      .set(Asteroid, { level: 1, color: '#aaa' })
      .set(Collider, {
        radius: 20,
        category: CAT_ASTEROID,
        mask: CAT_PLAYER_BULLET,
      });
    asteroid.events.on('destroy', () => {
      destroyed = true;
    });
    tick();
    expect(destroyed).toBe(true);
  });

  it('increases score when asteroid is hit', () => {
    makeShipWithLaser(0, 0, 0, 5, 10);
    world
      .entity()
      .set(Position, { x: 100, y: 0 })
      .set(Asteroid, { level: 2, color: '#aaa' })
      .set(Collider, {
        radius: 20,
        category: CAT_ASTEROID,
        mask: CAT_PLAYER_BULLET,
      });
    const before = gameState.score;
    tick();
    expect(gameState.score).toBeGreaterThan(before);
  });

  it('does not destroy asteroid off the laser path', () => {
    makeShipWithLaser(0, 0, 0, 5, 10);
    let destroyed = false;
    const asteroid = world
      .entity()
      .set(Position, { x: 100, y: 500 }) // far off-axis
      .set(Asteroid, { level: 1, color: '#aaa' })
      .set(Collider, {
        radius: 5,
        category: CAT_ASTEROID,
        mask: CAT_PLAYER_BULLET,
      });
    asteroid.events.on('destroy', () => {
      destroyed = true;
    });
    tick();
    expect(destroyed).toBe(false);
  });

  it('destroys alien on the laser path', () => {
    makeShipWithLaser(0, 0, 0, 5, 10);
    let destroyed = false;
    const alien = world
      .entity()
      .set(Position, { x: 100, y: 0 })
      .set(Alien, { shootCooldown: 0 })
      .set(Collider, {
        radius: 15,
        category: CAT_ENEMY,
        mask: CAT_PLAYER_BULLET,
      });
    alien.events.on('destroy', () => {
      destroyed = true;
    });
    tick();
    expect(destroyed).toBe(true);
  });

  it('increases score when alien is hit', () => {
    makeShipWithLaser(0, 0, 0, 5, 10);
    world
      .entity()
      .set(Position, { x: 100, y: 0 })
      .set(Alien, { shootCooldown: 0 })
      .set(Collider, {
        radius: 15,
        category: CAT_ENEMY,
        mask: CAT_PLAYER_BULLET,
      });
    const before = gameState.score;
    tick();
    expect(gameState.score).toBeGreaterThan(before);
  });
});
