import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { world, renderPhase, gameState, initDOM } from '@src/world';
import '@src/systems/UI';

// Minimal canvas 2D context mock
const mockCtx = {
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 1,
  globalAlpha: 1,
  fillRect: vi.fn(),
  clearRect: vi.fn(),
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
  fillText: vi.fn(),
  strokeRect: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
};

let scoreEl: HTMLElement;
let waveEl: HTMLElement;

beforeAll(() => {
  // Patch canvas.getContext at the prototype level for jsdom
  HTMLCanvasElement.prototype.getContext = vi
    .fn()
    .mockReturnValue(mockCtx) as never;

  const canvas = document.createElement('canvas');
  scoreEl = document.createElement('div');
  waveEl = document.createElement('div');
  const msgEl = document.createElement('div');

  initDOM(canvas, scoreEl, waveEl, msgEl);
  world.start();
});

afterEach(() => {
  gameState.score = 0;
  gameState.wave = 1;
});

// UI system has 0.1s interval – pass 200ms so it runs.
function tick() {
  world.beginFrame(200);
  world.runPhase(renderPhase, Date.now(), 200);
  world.endFrame();
}

describe('UI', () => {
  it('updates score element text', () => {
    gameState.score = 1500;
    tick();
    expect(scoreEl.innerText).toBe('Score: 1500');
  });

  it('updates wave element text', () => {
    gameState.wave = 5;
    tick();
    expect(waveEl.innerText).toBe('Wave: 5');
  });

  it('reflects score changes on subsequent ticks', () => {
    gameState.score = 100;
    tick();
    expect(scoreEl.innerText).toBe('Score: 100');
    gameState.score = 250;
    tick();
    expect(scoreEl.innerText).toBe('Score: 250');
  });

  it('reflects wave changes on subsequent ticks', () => {
    gameState.wave = 2;
    tick();
    expect(waveEl.innerText).toBe('Wave: 2');
    gameState.wave = 7;
    tick();
    expect(waveEl.innerText).toBe('Wave: 7');
  });
});
