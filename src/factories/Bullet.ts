import { world } from '../world';
import {
  Position,
  Velocity,
  Rotation,
  Bullet,
  Collider,
  Decay,
  Drawable,
  Arc,
  FillStyle,
  Wraps,
} from '../components/index';
import { ENTITY_CONFIG } from '../constants';
import type { OwnerType } from '../types';

export function createBullet(
  x: number,
  y: number,
  angle: number,
  color: string,
  ownerType: OwnerType,
  categoryBits: number,
  maskBits: number,
): void {
  const speed = ENTITY_CONFIG.BULLET.SPEED;
  world
    .entity()
    .set(Position, { x, y })
    .set(Velocity, { vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed })
    .set(Rotation, { angle })
    .set(Bullet, { ownerType })
    .set(Collider, { radius: 2, category: categoryBits, mask: maskBits })
    .set(Decay, { life: ENTITY_CONFIG.BULLET.LIFE, decay: 1 })
    .set(Drawable, { zIndex: 20 })
    .add(Wraps)
    .set(FillStyle, { style: color })
    .set(Arc, { radius: 2 });
}
