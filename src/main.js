import { GameEngine } from './engine.js';

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const scoreEl = document.getElementById('score');
    const waveEl = document.getElementById('wave');
    const msgEl = document.getElementById('msg');

    const game = new GameEngine(canvas, scoreEl, waveEl, msgEl);
    game.start();
});
