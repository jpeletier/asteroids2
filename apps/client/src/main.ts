import { world, initDOM } from './world';
import { initGame } from './game';
import { setInitGameCallback } from './systems/Collision';
import { initCheats } from './cheats';
import { connectEcsMirror } from './network/ecsMirror';

window.addEventListener('DOMContentLoaded', () => {
  const canvasEl = document.getElementById('gameCanvas');
  const scoreEl = document.getElementById('score');
  const waveEl = document.getElementById('wave');
  const msgEl = document.getElementById('msg');

  if (!canvasEl || !scoreEl || !waveEl || !msgEl) {
    throw new Error('Required DOM elements not found');
  }

  initDOM(canvasEl as HTMLCanvasElement, scoreEl, waveEl, msgEl);
  setInitGameCallback(initGame);
  initCheats();

  // Start world after all systems (imported via game.ts → systems/index) are registered
  world.start();

  initGame();
  void connectEcsMirror();

  let last = 0;
  function loop(now: number): void {
    world.progress(now, now - last);
    last = now;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
});
