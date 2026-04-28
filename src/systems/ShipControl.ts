import { world, updatePhase, keys } from '../world';
import { ShipInput, Rotation, Thrust } from '../components/index';
import { ENTITY_CONFIG } from '../constants';

world
  .system('ShipControl')
  .requires(ShipInput, Rotation, Thrust)
  .phase(updatePhase)
  .each([ShipInput, Rotation, Thrust], (_e, [input, rot, thrust]) => {
    if (keys.state[input.rotateLeftKey])
      rot.angle -= ENTITY_CONFIG.SHIP.ROTATION_SPEED;
    if (keys.state[input.rotateRightKey])
      rot.angle += ENTITY_CONFIG.SHIP.ROTATION_SPEED;
    if (keys.state[input.thrustKey]) thrust.active = true;
    if (input.shootCooldown > 0) input.shootCooldown--;
  });
