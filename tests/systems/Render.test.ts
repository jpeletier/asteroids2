import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { world, renderPhase, renderCtx, canvasSize } from '@src/world';
import '@src/systems/Render';
import { Position, Drawable, Rotation } from '@src/components';

const mockCtx = {
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 1,
  globalAlpha: 1,
  fillRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
};

beforeAll(() => {
  canvasSize.width = 800;
  canvasSize.height = 600;
  world.start();
});
afterEach(() => {
  world.clearAllEntities();
  vi.clearAllMocks();
  renderCtx.ctx = null;
  renderCtx.stars = [];
});

function tick() {
  world.beginFrame(16);
  world.runPhase(renderPhase, Date.now(), 16);
  world.endFrame();
}

describe('Render', () => {
  it('does nothing when ctx is null', () => {
    renderCtx.ctx = null;
    // Should not throw
    expect(() => tick()).not.toThrow();
  });

  it('clears and fills black background', () => {
    renderCtx.ctx = mockCtx as unknown as CanvasRenderingContext2D;
    tick();
    expect(mockCtx.fillRect).toHaveBeenCalledWith(0, 0, 800, 600);
  });

  it('draws stars from renderCtx.stars', () => {
    renderCtx.ctx = mockCtx as unknown as CanvasRenderingContext2D;
    renderCtx.stars = [
      { x: 10, y: 20, size: 1, opacity: 0.5 },
      { x: 30, y: 40, size: 2, opacity: 0.8 },
    ];
    tick();
    // arc is called once per star
    expect(mockCtx.arc).toHaveBeenCalledTimes(2);
  });

  it('calls draw on each Drawable entity', () => {
    renderCtx.ctx = mockCtx as unknown as CanvasRenderingContext2D;
    const drawFn = vi.fn();
    world
      .entity()
      .set(Position, { x: 100, y: 200 })
      .set(Drawable, {
        zIndex: 0,
        _statements: [{ key: 'test', priority: 50, fn: drawFn }],
        _sortedFns: undefined,
      });
    tick();
    expect(drawFn).toHaveBeenCalled();
  });

  it('translates canvas to entity position', () => {
    renderCtx.ctx = mockCtx as unknown as CanvasRenderingContext2D;
    world
      .entity()
      .set(Position, { x: 150, y: 250 })
      .set(Drawable, { zIndex: 0, _statements: [], _sortedFns: [] });
    tick();
    expect(mockCtx.translate).toHaveBeenCalledWith(150, 250);
  });

  it('rotates canvas when entity has Rotation', () => {
    renderCtx.ctx = mockCtx as unknown as CanvasRenderingContext2D;
    world
      .entity()
      .set(Position, { x: 0, y: 0 })
      .set(Rotation, { angle: Math.PI / 4 })
      .set(Drawable, { zIndex: 0, _statements: [], _sortedFns: [] });
    tick();
    expect(mockCtx.rotate).toHaveBeenCalledWith(Math.PI / 4);
  });

  it('sorts drawables by zIndex', () => {
    renderCtx.ctx = mockCtx as unknown as CanvasRenderingContext2D;
    const order: number[] = [];
    world
      .entity()
      .set(Position, { x: 0, y: 0 })
      .set(Drawable, {
        zIndex: 30,
        _statements: [{ key: 'hi', priority: 50, fn: () => order.push(30) }],
        _sortedFns: undefined,
      });
    world
      .entity()
      .set(Position, { x: 0, y: 0 })
      .set(Drawable, {
        zIndex: 10,
        _statements: [{ key: 'lo', priority: 50, fn: () => order.push(10) }],
        _sortedFns: undefined,
      });
    tick();
    expect(order).toEqual([10, 30]);
  });
});
