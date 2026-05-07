import { world, updatePhase } from '../world';
import { Rotation, AngularVelocity } from '../components/index';

world
  .system('AngularMovement')
  .requires(Rotation, AngularVelocity)
  .phase(updatePhase)
  .each([Rotation, AngularVelocity], (_e, [rot, av]) => {
    rot.angle += av.omega;
  });
