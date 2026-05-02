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
  CAT_BOOMERANG,
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
  // Triangle: nose forward (+x), tail corners back-left/right
  return world
    .entity()
    .set(Position, { x, y })
    .add(Velocity)
    .set(Rotation, { angle: 0 })
    .set(Thrust, { force: ENTITY_CONFIG.SHIP.THRUST_POWER })
    .set(Friction, { value: ENTITY_CONFIG.SHIP.FRICTION })
    .set(ShipInput, {
      thrustKey: controls.thrust,
      rotateLeftKey: controls.rotateLeft,
      rotateRightKey: controls.rotateRight,
      shootKey: controls.shoot,
      shootCooldown: 0,
    })
    .set(Health, {
      hp: ENTITY_CONFIG.SHIP.MAX_HP,
      maxHp: ENTITY_CONFIG.SHIP.MAX_HP,
      healthBarTimer: 0,
    })
    .add(DefaultWeapon)
    .set(Player, { playerId })
    .set(Collider, {
      radius: ENTITY_CONFIG.SHIP.RADIUS,
      category: CAT_PLAYER,
      mask:
        CAT_ASTEROID |
        CAT_ENEMY_BULLET |
        CAT_ENEMY |
        CAT_PICKUP |
        CAT_BOOMERANG,
    })
    .set(Drawable, { zIndex: 60 })
    .add(Wraps)
    .set(StrokeStyle, { style: color, lineWidth: 2 })
    .set(Shape, {
      points: [
        { x: 15, y: 0 },
        { x: -10, y: 10 },
        { x: -10, y: -10 },
      ],
    });
}
