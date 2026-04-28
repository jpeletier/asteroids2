import { describe, it, expect, beforeEach } from 'vitest';
import { world } from '../src/world';
import { createParticle, explode } from '../src/factories/Particle';
import { Particle } from '../src/components/index';
import '../src/systems/Cleanup';

function countParticles(): number {
  let count = 0;
  (world as any)._forEachEntity((e: any) => {
    if (e.get(Particle)) count++;
  });
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
