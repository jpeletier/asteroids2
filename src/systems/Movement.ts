import { world, updatePhase } from '../world';
import { Position, Velocity } from '../components/index';

world.system('Movement')
  .requires(Position, Velocity)
  .phase(updatePhase)
  .each([Position, Velocity], (_e, [pos, vel]) => {
    pos.x += vel.vx;
    pos.y += vel.vy;
  });
