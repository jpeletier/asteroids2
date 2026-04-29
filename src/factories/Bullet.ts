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
  const e = world.createEntity();
  e.set(Position, { x, y });
  e.set(Velocity, { vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed });
  e.set(Rotation, { angle });
  e.set(Bullet, { ownerType });
  e.set(Collider, { radius: 2, category: categoryBits, mask: maskBits });
  e.set(Decay, { life: ENTITY_CONFIG.BULLET.LIFE, decay: 1 });
  e.set(Drawable, { zIndex: 20 });
  e.add(Wraps);
  e.set(FillStyle, { style: color });
  e.set(Arc, { radius: 2 });
}
