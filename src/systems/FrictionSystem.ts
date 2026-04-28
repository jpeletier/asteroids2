import { world, updatePhase } from '../world';
import { Velocity, Friction } from '../components/index';

world.system('FrictionSystem')
  .requires(Velocity, Friction)
  .phase(updatePhase)
  .each([Velocity, Friction], (_e, [vel, fric]) => {
    vel.vx *= fric.value;
    vel.vy *= fric.value;
  });
