import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { world, updatePhase } from '@src/world';
import '@src/systems/HealthSystem';
import { Health } from '@src/components';

beforeAll(() => world.start());
afterEach(() => world.clearAllEntities());

function tick() {
  world.beginFrame(16);
  world.runPhase(updatePhase, Date.now(), 16);
  world.endFrame();
}

describe('HealthSystem', () => {
  it('decrements healthBarTimer when positive', () => {
    const e = world
      .entity()
      .set(Health, { hp: 100, maxHp: 100, healthBarTimer: 10 });
    tick();
    expect(e.get(Health)!.healthBarTimer).toBe(9);
  });

  it('does not decrement healthBarTimer below zero', () => {
    const e = world
      .entity()
      .set(Health, { hp: 100, maxHp: 100, healthBarTimer: 0 });
    tick();
    expect(e.get(Health)!.healthBarTimer).toBe(0);
  });

  it('decrements from 1 to 0', () => {
    const e = world
      .entity()
      .set(Health, { hp: 100, maxHp: 100, healthBarTimer: 1 });
    tick();
    expect(e.get(Health)!.healthBarTimer).toBe(0);
  });

  it('does not change hp', () => {
    const e = world
      .entity()
      .set(Health, { hp: 75, maxHp: 100, healthBarTimer: 5 });
    tick();
    expect(e.get(Health)!.hp).toBe(75);
  });
});
