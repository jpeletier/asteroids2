import { world, updatePhase, gameState } from '../world';
import { RandomClock } from '../components/index';

world
  .system('RandomClockSystem')
  .interval(0.5)
  .requires(RandomClock)
  .phase(updatePhase)
  .each([RandomClock], (_e, [clock]) => {
    if (gameState.state !== 'playing') return;
    if (Date.now() >= clock.nextTick) {
      clock.effectFunc();
      clock.schedule();
    }
  });
