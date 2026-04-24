import { GameEngine } from './engine';

window.addEventListener('DOMContentLoaded', () => {
  const canvasEl = document.getElementById('gameCanvas');
  const scoreEl = document.getElementById('score');
  const waveEl = document.getElementById('wave');
  const msgEl = document.getElementById('msg');

  if (!canvasEl || !scoreEl || !waveEl || !msgEl) {
    throw new Error('Required DOM elements not found');
  }

  const canvas = canvasEl as HTMLCanvasElement;

  const game = new GameEngine(canvas, scoreEl, waveEl, msgEl);
  game.start();
});
