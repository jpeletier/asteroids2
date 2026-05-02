import { describe, it, expect } from 'vitest';
import { world } from '../src/world';
import { explode } from '../src/factories/Particle';
import { Particle } from '../src/components/index';

function countParticles(): number {
  let count = 0;
  world.filter([Particle]).forEach(() => count++);
  return count;
}

describe('explode', () => {
  it('creates the default number of particles (10)', () => {
    const before = countParticles();
    explode(100, 200, '#ff0');
    expect(countParticles() - before).toBe(10);
  });

  it('creates the specified count of particles', () => {
    const before = countParticles();
    explode(0, 0, '#fff', 25);
    expect(countParticles() - before).toBe(25);
  });
});
