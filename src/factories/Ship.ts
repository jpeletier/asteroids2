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
  e.set(Position, { x, y });
  e.add(Velocity);
  e.set(Rotation, { angle: 0 });
  e.set(Thrust, { force: ENTITY_CONFIG.SHIP.THRUST_POWER });
  e.set(Friction, { value: ENTITY_CONFIG.SHIP.FRICTION });
  e.set(ShipInput, {
    thrustKey: controls.thrust,
    rotateLeftKey: controls.rotateLeft,
    rotateRightKey: controls.rotateRight,
    shootKey: controls.shoot,
    shootCooldown: 0,
  });
  e.set(Health, {
    hp: ENTITY_CONFIG.SHIP.MAX_HP,
    maxHp: ENTITY_CONFIG.SHIP.MAX_HP,
    healthBarTimer: 0,
  });
  e.add(DefaultWeapon);
  e.set(Player, { playerId });
  e.set(Collider, {
    radius: ENTITY_CONFIG.SHIP.RADIUS,
    category: CAT_PLAYER,
    mask: CAT_ASTEROID | CAT_ENEMY_BULLET | CAT_ENEMY | CAT_PICKUP,
  });
  e.set(Drawable, { zIndex: 60 });
  e.add(Wraps);
  e.set(StrokeStyle, { style: color, lineWidth: 2 });
  // Triangle: nose forward (+x), tail corners back-left/right
  e.set(Shape, {
    points: [
      { x: 15, y: 0 },
      { x: -10, y: 10 },
      { x: -10, y: -10 },
    ],
  });
  return e;
}
