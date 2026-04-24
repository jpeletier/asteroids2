import { describe, it, expect } from 'vitest';
import { explode } from '../src/utils';
import type { Entities } from '../src/types';

function makeEntities(): Entities {
  return {
    players: [],
    bullets: [],
    asteroids: [],
    particles: [],
    aliens: [],
    boss: null,
    shieldPowerup: null,
    laserPowerup: null,
    auraPowerup: null,
  };
}

describe('explode', () => {
  it('pushes the default number of particles (10) into entities', () => {
    const entities = makeEntities();
    explode(100, 200, '#ff0', entities);
    expect(entities.particles).toHaveLength(10);
  });

  it('pushes the specified count of particles into entities', () => {
    const entities = makeEntities();
    explode(0, 0, '#fff', entities, 25);
    expect(entities.particles).toHaveLength(25);
  });
});
