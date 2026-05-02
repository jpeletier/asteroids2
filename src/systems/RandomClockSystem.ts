import { world, updatePhase, gameState } from '../world';
import { RandomClock } from '../components/index';

world
  .system('RandomClockSystem')
  .requires(RandomClock)
  .phase(updatePhase)
  .each([RandomClock], (_e, [clock]) => {
    if (gameState.state !== 'playing') return;
    const now = Date.now();

    if (clock.nextTick === 0) {
      clock.nextTick =
        now + clock.minWait + Math.random() * (clock.maxWait - clock.minWait);
      return;
    }

    if (now >= clock.nextTick) {
      clock.effectFunc();
      clock.nextTick =
        now + clock.minWait + Math.random() * (clock.maxWait - clock.minWait);
    }
  });
