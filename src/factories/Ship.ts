import { world } from '../world';
import {
  Position, Velocity, Rotation, Friction, Thrust,
  Drawable, Shape, StrokeStyle, DrawOrder, Wraps,
  Collider, Health, DefaultWeapon, Player, ShipInput,
} from '../components/index';
import {
  CAT_PLAYER, CAT_ASTEROID, CAT_ENEMY_BULLET, CAT_ENEMY, CAT_PICKUP,
  ENTITY_CONFIG,
} from '../constants';
import type { Controls } from '../types';
import type { Entity } from '@vworlds/vecs';

export function createShip(
  x: number,
  y: number,
  color: string,
  playerId: 0 | 1,
  controls: Controls,
): Entity {
  const e = world.createEntity();
  const pos = e.add(Position); pos.x = x; pos.y = y;
  e.add(Velocity);
  const rot = e.add(Rotation); rot.angle = 0;
  const thrust = e.add(Thrust); thrust.force = ENTITY_CONFIG.SHIP.THRUST_POWER;
  const fric = e.add(Friction); fric.value = ENTITY_CONFIG.SHIP.FRICTION;
  const input = e.add(ShipInput);
  input.thrustKey = controls.thrust;
  input.rotateLeftKey = controls.rotateLeft;
  input.rotateRightKey = controls.rotateRight;
  input.shootKey = controls.shoot;
  input.shootCooldown = 0;
  const health = e.add(Health);
  health.hp = ENTITY_CONFIG.SHIP.MAX_HP;
  health.maxHp = ENTITY_CONFIG.SHIP.MAX_HP;
  health.healthBarTimer = 0;
  e.add(DefaultWeapon);
  const pl = e.add(Player); pl.playerId = playerId;
  const col = e.add(Collider);
  col.radius = ENTITY_CONFIG.SHIP.RADIUS;
  col.category = CAT_PLAYER;
  col.mask = CAT_ASTEROID | CAT_ENEMY_BULLET | CAT_ENEMY | CAT_PICKUP;
  e.add(Wraps);

  const drawable = e.add(Drawable);
  const stroke = e.add(StrokeStyle); stroke.style = color;
  const order = e.add(DrawOrder); order.z = 60;

  // Triangle ship shape: nose at (15,0), tail corners at (-10,±10)
  drawable.addStatement(StrokeStyle, 100, 'ctx.strokeStyle = vars.stroke.style; ctx.lineWidth = 2', { stroke });
  drawable.addStatement(Shape, 55,
    `ctx.beginPath(); ctx.moveTo(15,0); ctx.lineTo(-10,10); ctx.lineTo(-10,-10); ctx.closePath(); ctx.stroke();`,
    {});

  return e;
}
