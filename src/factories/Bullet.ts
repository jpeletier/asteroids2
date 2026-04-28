import { world } from '../world';
import {
  Position, Velocity, Rotation, Bullet, Collider, Decay, Drawable, Arc, FillStyle, Wraps,
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
  const pos = e.add(Position); pos.x = x; pos.y = y;
  const vel = e.add(Velocity); vel.vx = Math.cos(angle) * speed; vel.vy = Math.sin(angle) * speed;
  const rot = e.add(Rotation); rot.angle = angle;
  e.add(Bullet).ownerType = ownerType;
  const col = e.add(Collider); col.radius = 2; col.category = categoryBits; col.mask = maskBits;
  const dec = e.add(Decay); dec.life = ENTITY_CONFIG.BULLET.LIFE; dec.decay = 1;
  e.add(Drawable).zIndex = 20;
  e.add(Wraps);
  e.add(FillStyle).style = color;
  e.add(Arc).radius = 2;
}
