import { world, updatePhase } from '../world';
import { Velocity, Thrust, Rotation } from '../components/index';

world
  .system('Thrust')
  .requires(Velocity, Thrust, Rotation)
  .phase(updatePhase)
  .each([Velocity, Thrust, Rotation], (_e, [vel, thrust, rot]) => {
    if (thrust.active) {
      vel.vx += Math.cos(rot.angle) * thrust.force;
      vel.vy += Math.sin(rot.angle) * thrust.force;
      thrust.active = false;
    }
  });
