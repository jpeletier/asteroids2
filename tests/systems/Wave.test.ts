import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { world, updatePhase, gameState, canvasSize } from '../../src/world';
import '../../src/systems/Wave';
import { Asteroid, Alien } from '../../src/components/index';

beforeAll(() => {
  canvasSize.width = 800;
  canvasSize.height = 600;
  world.start();
});
afterEach(() => {
  world.clearAllEntities();
  gameState.state = 'playing';
  gameState.wave = 1;
  gameState.score = 0;
});

// Wave system has 0.25s interval – pass 500ms so it runs.
function tick() {
  world.beginFrame(500);
  world.runPhase(updatePhase, Date.now(), 500);
  world.endFrame();
}

function countAsteroids(): number {
  let n = 0;
  world.filter([Asteroid]).forEach(() => n++);
  return n;
}

describe('Wave', () => {
  it('spawns asteroids when arena is empty and state is playing', () => {
    gameState.wave = 1;
    tick();
    const count = countAsteroids();
    expect(count).toBeGreaterThan(0);
  });

  it('spawns correct number of asteroids (3 + wave*2 after increment)', () => {
    gameState.wave = 1;
    tick();
    // System does wave++ before computing count, so wave becomes 2, count = 3 + 2*2 = 7
    expect(countAsteroids()).toBe(3 + 2 * 2);
  });

  it('increments wave counter when arena is empty', () => {
    gameState.wave = 1;
    tick();
    expect(gameState.wave).toBe(2);
  });

  it('does not spawn when asteroids are present', () => {
    gameState.wave = 1;
    world.entity().set(Asteroid, { level: 1, color: '#aaa' });
    const before = countAsteroids();
    tick();
    expect(countAsteroids()).toBe(before);
  });

  it('does not spawn when aliens are present', () => {
    gameState.wave = 1;
    world.entity().set(Alien, { shootCooldown: 0 });
    tick();
    expect(countAsteroids()).toBe(0);
  });

  it('does not spawn when gameState is not playing', () => {
    gameState.state = 'lose';
    gameState.wave = 1;
    tick();
    expect(countAsteroids()).toBe(0);
  });

  it('spawns more asteroids for higher wave numbers', () => {
    gameState.wave = 3;
    tick();
    // wave++ makes it 4, count = 3 + 4*2 = 11
    expect(countAsteroids()).toBe(3 + 4 * 2);
  });
});
