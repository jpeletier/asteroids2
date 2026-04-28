import { world, renderPhase, gameState, scoreEl, waveEl } from '../world';

world
  .system('UI')
  .phase(renderPhase)
  .run(() => {
    if (scoreEl) scoreEl.innerText = `Score: ${gameState.score}`;
    if (waveEl) waveEl.innerText = `Wave: ${gameState.wave}`;
  });
