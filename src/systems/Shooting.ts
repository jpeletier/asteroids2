import { world, updatePhase, keys } from '../world';
import { Position, Rotation, ShipInput, LaserWeapon, AuraWeapon, DefaultWeapon, StrokeStyle } from '../components/index';
import { createBullet } from '../factories/Bullet';
import { CAT_PLAYER_BULLET, CAT_ASTEROID, CAT_ENEMY, ENTITY_CONFIG } from '../constants';

world.system('Shooting')
  .requires(Position, ShipInput, Rotation)
  .phase(updatePhase)
  .each([Position, ShipInput, Rotation], (e, [pos, input, rot]) => {
    if (!keys.state[input.shootKey] || input.shootCooldown > 0) return;

    const color = e.get(StrokeStyle)?.style ?? '#fff';
    const aura = e.get(AuraWeapon);
    const laser = e.get(LaserWeapon);

    if (aura && aura.shots > 0) {
      for (let i = 0; i < 8; i++) {
        createBullet(pos.x, pos.y, (i * Math.PI) / 4, color, 'player', CAT_PLAYER_BULLET, CAT_ASTEROID | CAT_ENEMY);
      }
      aura.shots--;
      if (aura.shots <= 0) {
        e.remove(AuraWeapon);
        e.add(DefaultWeapon);
      }
      input.shootCooldown = ENTITY_CONFIG.SHIP.SHOOT_COOLDOWN;
    } else if (laser && laser.shots > 0) {
      laser.firing = true;
      laser.timer = ENTITY_CONFIG.SHIP.LASER_TIMER;
      laser.shots--;
      input.shootCooldown = ENTITY_CONFIG.SHIP.SHOOT_COOLDOWN;
    } else if (e.get(DefaultWeapon)) {
      createBullet(pos.x, pos.y, rot.angle, color, 'player', CAT_PLAYER_BULLET, CAT_ASTEROID | CAT_ENEMY);
      input.shootCooldown = ENTITY_CONFIG.SHIP.SHOOT_COOLDOWN;
    }
  });
