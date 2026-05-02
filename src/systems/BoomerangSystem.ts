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
  })
  .exit([Boomerang], (e, [boom]) => {
    const owner = boom.owner;
    if (!owner) return;
    const bw = owner.get(BoomerangWeapon);
    if (!bw) return;
    bw.inFlight.delete(e);
    if (bw.shots === 0 && bw.inFlight.size === 0) {
      owner.remove(BoomerangWeapon);
      owner.add(DefaultWeapon);
    }
  });
