import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { world, updatePhase } from '../../src/world';
import '../../src/systems/ShieldSystem';
import { Shield } from '../../src/components/index';

beforeAll(() => world.start());
afterEach(() => world.clearAllEntities());

function tick() {
  world.beginFrame(16);
  world.runPhase(updatePhase, Date.now(), 16);
  world.endFrame();
}

describe('ShieldSystem', () => {
  it('decrements shieldTime each tick', () => {
    const e = world.entity().set(Shield, { shieldTime: 10 });
    tick();
    expect(e.get(Shield)!.shieldTime).toBe(9);
  });

  it('removes Shield component when shieldTime reaches zero', () => {
    const e = world.entity().set(Shield, { shieldTime: 1 });
    tick();
    expect(e.get(Shield)).toBeUndefined();
  });

  it('removes Shield component when shieldTime goes negative', () => {
    const e = world.entity().set(Shield, { shieldTime: 0 });
    tick();
    expect(e.get(Shield)).toBeUndefined();
  });

  it('keeps Shield when shieldTime is still positive after decrement', () => {
    const e = world.entity().set(Shield, { shieldTime: 5 });
    tick();
    expect(e.get(Shield)).toBeDefined();
    expect(e.get(Shield)!.shieldTime).toBe(4);
  });
});
