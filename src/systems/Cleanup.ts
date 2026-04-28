import { world, updatePhase, gameState } from '../world';
import { Dead, Pickup } from '../components/index';

world
  .system('Cleanup')
  .requires(Dead)
  .phase(updatePhase)
  .each([Dead], (e) => {
    e.destroy();
  });
