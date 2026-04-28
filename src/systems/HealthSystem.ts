import { world, updatePhase } from '../world';
import { Health } from '../components/index';

world.system('HealthSystem')
  .requires(Health)
  .phase(updatePhase)
  .each([Health], (_e, [health]) => {
    if (health.healthBarTimer > 0) health.healthBarTimer--;
  });
