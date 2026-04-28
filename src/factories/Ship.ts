import { world } from '../world';
import {
  Position,
  Velocity,
  Rotation,
  Friction,
  Thrust,
  Drawable,
  Shape,
  StrokeStyle,
  Wraps,
  Collider,
  Health,
  DefaultWeapon,
  Player,
  ShipInput,
} from '../components/index';
import {
  CAT_PLAYER,
  CAT_ASTEROID,
  CAT_ENEMY_BULLET,
  CAT_ENEMY,
  CAT_PICKUP,
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
  const pos = e.add(Position);
  pos.x = x;
  pos.y = y;
  e.add(Velocity);
  const rot = e.add(Rotation);
  rot.angle = 0;
  const thrust = e.add(Thrust);
  thrust.force = ENTITY_CONFIG.SHIP.THRUST_POWER;
  e.add(Friction).value = ENTITY_CONFIG.SHIP.FRICTION;
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
  e.add(Player).playerId = playerId;
  const col = e.add(Collider);
  col.radius = ENTITY_CONFIG.SHIP.RADIUS;
  col.category = CAT_PLAYER;
  col.mask = CAT_ASTEROID | CAT_ENEMY_BULLET | CAT_ENEMY | CAT_PICKUP;
  e.add(Drawable).zIndex = 60;
  e.add(Wraps);
  const stroke = e.add(StrokeStyle);
  stroke.style = color;
  stroke.lineWidth = 2;
  // Triangle: nose forward (+x), tail corners back-left/right
  e.add(Shape).points = [
    { x: 15, y: 0 },
    { x: -10, y: 10 },
    { x: -10, y: -10 },
  ];
  return e;
}
