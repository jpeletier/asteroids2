import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ShieldPowerup, LaserPowerup, AuraPowerup } from '../src/entities/Powerup';
import { GAME_CONFIG } from '../src/constants';
import type { RandomClock, Decay } from '../src/types';

describe('POWERUP_LIFETIME constant', () => {
  it('is a positive number', () => {
    expect(GAME_CONFIG.POWERUP_LIFETIME).toBeGreaterThan(0);
  });

  it('equals 15000ms', () => {
    expect(GAME_CONFIG.POWERUP_LIFETIME).toBe(15000);
  });
});

describe('Powerup decay initialization', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('ShieldPowerup sets decay.expiresAt to POWERUP_LIFETIME ms from construction', () => {
    const now = Date.now();
    const powerup = new ShieldPowerup(100, 100);
    expect(powerup.decay.expiresAt).toBe(now + GAME_CONFIG.POWERUP_LIFETIME);
  });

  it('LaserPowerup sets decay.expiresAt to POWERUP_LIFETIME ms from construction', () => {
    const now = Date.now();
    const powerup = new LaserPowerup(100, 100);
    expect(powerup.decay.expiresAt).toBe(now + GAME_CONFIG.POWERUP_LIFETIME);
  });

  it('AuraPowerup sets decay.expiresAt to POWERUP_LIFETIME ms from construction', () => {
    const now = Date.now();
    const powerup = new AuraPowerup(100, 100);
    expect(powerup.decay.expiresAt).toBe(now + GAME_CONFIG.POWERUP_LIFETIME);
  });

  it('each powerup has an independent decay object', () => {
    const shield = new ShieldPowerup(100, 100);
    const laser = new LaserPowerup(100, 100);
    expect(shield.decay).not.toBe(laser.decay);
  });

  it('powerup created 5s later expires 5s later', () => {
    const first = new ShieldPowerup(0, 0);
    vi.advanceTimersByTime(5000);
    const second = new ShieldPowerup(0, 0);
    expect(second.decay.expiresAt - first.decay.expiresAt).toBe(5000);
  });
});

describe('Decay type', () => {
  it('accepts an expiresAt timestamp in the future', () => {
    const decay: Decay = { expiresAt: Date.now() + 5000 };
    expect(decay.expiresAt).toBeGreaterThan(Date.now());
  });

  it('accepts an expiresAt timestamp in the past to represent an expired entity', () => {
    const decay: Decay = { expiresAt: Date.now() - 1 };
    expect(decay.expiresAt).toBeLessThan(Date.now());
  });
});

describe('RandomClock type', () => {
  it('can be constructed with all required fields', () => {
    let called = false;
    const clock: RandomClock = {
      minWait: 1000,
      maxWait: 5000,
      effectFunc: () => {
        called = true;
      },
      nextTick: Date.now() + 2000,
    };
    expect(clock.minWait).toBe(1000);
    expect(clock.maxWait).toBe(5000);
    expect(clock.nextTick).toBeGreaterThan(Date.now());
    clock.effectFunc();
    expect(called).toBe(true);
  });

  it('nextTick can be updated to schedule the next firing', () => {
    const clock: RandomClock = {
      minWait: 500,
      maxWait: 1000,
      effectFunc: () => {},
      nextTick: Date.now() + 500,
    };
    const originalTick = clock.nextTick;
    clock.nextTick = Date.now() + 1000;
    expect(clock.nextTick).toBeGreaterThan(originalTick);
  });
});

describe('runDecaySystem behavior (inline)', () => {
  it('expired powerup should be cleared when expiresAt is in the past', () => {
    const now = Date.now();
    const expired = { expiresAt: now - 1 };
    const live = { expiresAt: now + 10000 };

    // Replicate the decay check used in runDecaySystem
    const shouldRemoveExpired = now >= expired.expiresAt;
    const shouldRemoveLive = now >= live.expiresAt;

    expect(shouldRemoveExpired).toBe(true);
    expect(shouldRemoveLive).toBe(false);
  });
});

describe('RandomClock tick behavior (inline)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('effectFunc is called when now >= nextTick', () => {
    let fired = false;
    const clock: RandomClock = {
      minWait: 1000,
      maxWait: 1000,
      effectFunc: () => {
        fired = true;
      },
      nextTick: Date.now() + 1000,
    };

    vi.advanceTimersByTime(1000);
    const now = Date.now();

    if (now >= clock.nextTick) {
      clock.effectFunc();
    }

    expect(fired).toBe(true);
  });

  it('effectFunc is not called before nextTick', () => {
    let fired = false;
    const clock: RandomClock = {
      minWait: 1000,
      maxWait: 1000,
      effectFunc: () => {
        fired = true;
      },
      nextTick: Date.now() + 1000,
    };

    vi.advanceTimersByTime(999);
    const now = Date.now();

    if (now >= clock.nextTick) {
      clock.effectFunc();
    }

    expect(fired).toBe(false);
  });
});
