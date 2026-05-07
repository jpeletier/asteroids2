import { world, updatePhase } from '../world';
import { Shield } from '../components/index';

world
  .system('ShieldSystem')
  .requires(Shield)
  .phase(updatePhase)
  .each([Shield], (e, [shield]) => {
    shield.shieldTime--;
    if (shield.shieldTime <= 0) e.remove(Shield);
  });
