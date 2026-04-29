import { world, updatePhase } from '../world';
import { Dead } from '../components/index';

world
  .system('Cleanup')
  .requires(Dead)
  .phase(updatePhase)
  .each([Dead], (e) => {
    e.destroy();
  });
