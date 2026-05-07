import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { world, updatePhase, canvasSize } from '@src/world';
import '@src/systems/Wrap';
import { Position, Wraps } from '@src/components';

beforeAll(() => {
  canvasSize.width = 800;
  canvasSize.height = 600;
  world.start();
});
afterEach(() => world.clearAllEntities());

function tick() {
  world.beginFrame(16);
  world.runPhase(updatePhase, Date.now(), 16);
  world.endFrame();
}

describe('Wrap', () => {
  it('wraps entity from left edge to right', () => {
    const e = world.entity().set(Position, { x: -1, y: 300 }).add(Wraps);
    tick();
    expect(e.get(Position)!.x).toBe(800);
  });

  it('wraps entity from right edge to left', () => {
    const e = world.entity().set(Position, { x: 801, y: 300 }).add(Wraps);
    tick();
    expect(e.get(Position)!.x).toBe(0);
  });

  it('wraps entity from top edge to bottom', () => {
    const e = world.entity().set(Position, { x: 400, y: -1 }).add(Wraps);
    tick();
    expect(e.get(Position)!.y).toBe(600);
  });

  it('wraps entity from bottom edge to top', () => {
    const e = world.entity().set(Position, { x: 400, y: 601 }).add(Wraps);
    tick();
    expect(e.get(Position)!.y).toBe(0);
  });

  it('does not wrap entity within bounds', () => {
    const e = world.entity().set(Position, { x: 400, y: 300 }).add(Wraps);
    tick();
    const pos = e.get(Position)!;
    expect(pos.x).toBe(400);
    expect(pos.y).toBe(300);
  });

  it('wraps exactly at x=0 (not wrapped)', () => {
    const e = world.entity().set(Position, { x: 0, y: 300 }).add(Wraps);
    tick();
    expect(e.get(Position)!.x).toBe(0);
  });

  it('does not wrap at exactly x=width (condition is strictly greater than)', () => {
    const e = world.entity().set(Position, { x: 800, y: 300 }).add(Wraps);
    tick();
    // The wrap condition is pos.x > width (strict), so x==width is NOT wrapped
    expect(e.get(Position)!.x).toBe(800);
  });

  it('does not wrap entities without Wraps component', () => {
    const e = world.entity().set(Position, { x: -10, y: -10 });
    tick();
    const pos = e.get(Position)!;
    expect(pos.x).toBe(-10);
    expect(pos.y).toBe(-10);
  });
});
