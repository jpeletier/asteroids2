import { world } from '../world';
import { RandomClock } from '../components/index';

export function createClock(
  minWait: number,
  maxWait: number,
  effectFunc: () => void,
): void {
  const now = Date.now();
  world.entity().set(RandomClock, {
    minWait,
    maxWait,
    effectFunc,
    nextTick: now + minWait + Math.random() * (maxWait - minWait),
  });
}
