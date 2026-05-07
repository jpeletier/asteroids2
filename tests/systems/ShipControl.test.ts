import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { world, updatePhase, keys } from '@src/world';
import '@src/systems/ShipControl';
import { ShipInput, Rotation, Thrust } from '@src/components';
import { ENTITY_CONFIG } from '@src/constants';

beforeAll(() => world.start());
afterEach(() => {
  world.clearAllEntities();
  for (const k of Object.keys(keys.state)) keys.state[k] = false;
});

function tick() {
  world.beginFrame(16);
  world.runPhase(updatePhase, Date.now(), 16);
  world.endFrame();
}

function makeShip() {
  return world
    .entity()
    .set(ShipInput, {
      thrustKey: 'KeyW',
      rotateLeftKey: 'KeyA',
      rotateRightKey: 'KeyD',
      shootKey: 'Space',
      shootCooldown: 0,
    })
    .set(Rotation, { angle: 0 })
    .set(Thrust, { force: 0.2, active: false });
}

describe('ShipControl', () => {
  it('rotates left when rotateLeftKey is held', () => {
    const e = makeShip();
    keys.state['KeyA'] = true;
    tick();
    expect(e.get(Rotation)!.angle).toBeCloseTo(
      -ENTITY_CONFIG.SHIP.ROTATION_SPEED,
    );
  });

  it('rotates right when rotateRightKey is held', () => {
    const e = makeShip();
    keys.state['KeyD'] = true;
    tick();
    expect(e.get(Rotation)!.angle).toBeCloseTo(
      ENTITY_CONFIG.SHIP.ROTATION_SPEED,
    );
  });

  it('activates thrust when thrustKey is held', () => {
    const e = makeShip();
    keys.state['KeyW'] = true;
    tick();
    expect(e.get(Thrust)!.active).toBe(true);
  });

  it('does not activate thrust when thrustKey is not held', () => {
    const e = makeShip();
    tick();
    expect(e.get(Thrust)!.active).toBe(false);
  });

  it('decrements shootCooldown when positive', () => {
    const e = makeShip();
    e.set(ShipInput, {
      thrustKey: 'KeyW',
      rotateLeftKey: 'KeyA',
      rotateRightKey: 'KeyD',
      shootKey: 'Space',
      shootCooldown: 5,
    });
    tick();
    expect(e.get(ShipInput)!.shootCooldown).toBe(4);
  });

  it('does not decrement shootCooldown below zero', () => {
    const e = makeShip();
    // shootCooldown starts at 0
    tick();
    expect(e.get(ShipInput)!.shootCooldown).toBe(0);
  });

  it('does not rotate when no keys are held', () => {
    const e = makeShip();
    tick();
    expect(e.get(Rotation)!.angle).toBeCloseTo(0);
  });
});
