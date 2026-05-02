import { world, updatePhase } from '../world';
import {
  Position,
  Velocity,
  Boomerang,
  BoomerangWeapon,
  DefaultWeapon,
  Dead,
} from '../components/index';
import { ENTITY_CONFIG } from '../constants';

const boomerangQuery = world.query('Boomerangs').requires(Boomerang);

world
  .system('BoomerangSystem')
  .requires(Position, Velocity, Boomerang)
  .phase(updatePhase)
  .each([Position, Velocity, Boomerang], (_e, [pos, vel, boom]) => {
    const owner = boom.owner;
    if (owner && !owner.get(Dead)) {
      const op = owner.get(Position);
      if (op) {
        const dx = op.x - pos.x;
        const dy = op.y - pos.y;
        const d = Math.hypot(dx, dy);
        if (d > 0.001) {
          vel.vx += (dx / d) * ENTITY_CONFIG.BOOMERANG.PULL;
          vel.vy += (dy / d) * ENTITY_CONFIG.BOOMERANG.PULL;
        }
        const sp = Math.hypot(vel.vx, vel.vy);
        const ms = ENTITY_CONFIG.BOOMERANG.MAX_SPEED;
        if (sp > ms) {
          vel.vx = (vel.vx / sp) * ms;
          vel.vy = (vel.vy / sp) * ms;
        }
        if (!boom.armed && d > ENTITY_CONFIG.BOOMERANG.ARM_DISTANCE) {
          boom.armed = true;
        }
      }
    }
  });

world
  .system('BoomerangWeaponEnd')
  .requires(BoomerangWeapon)
  .phase(updatePhase)
  .each([BoomerangWeapon], (e, [bw]) => {
    if (bw.shots > 0) return;
    for (const b of boomerangQuery.entities) {
      if (b.get(Dead)) continue;
      if (b.get(Boomerang)?.owner === e) return;
    }
    e.remove(BoomerangWeapon);
    e.add(DefaultWeapon);
  });
