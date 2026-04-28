import { world, updatePhase, canvasSize } from '../world';
import { Position, Wraps } from '../components/index';

world
  .system('Wrap')
  .requires(Position, Wraps)
  .phase(updatePhase)
  .each([Position], (_e, [pos]) => {
    const { width, height } = canvasSize;
    if (pos.x < 0) pos.x = width;
    else if (pos.x > width) pos.x = 0;
    if (pos.y < 0) pos.y = height;
    else if (pos.y > height) pos.y = 0;
  });
