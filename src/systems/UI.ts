import { world, renderPhase, gameState, scoreEl, waveEl } from '../world';

world
  .system('UI')
  .interval(0.1)
  .phase(renderPhase)
  .run(() => {
    if (scoreEl) scoreEl.innerText = `Score: ${gameState.score}`;
    if (waveEl) waveEl.innerText = `Wave: ${gameState.wave}`;
  });
