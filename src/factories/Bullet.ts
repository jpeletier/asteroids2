import { world } from '../world';
import {
  Position, Velocity, Rotation, Bullet, Collider, Decay, Drawable, Arc, FillStyle, DrawOrder, Wraps,
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
  const vel = e.add(Velocity);
  vel.vx = Math.cos(angle) * speed;
  vel.vy = Math.sin(angle) * speed;
  const rot = e.add(Rotation); rot.angle = angle;
  const b = e.add(Bullet); b.ownerType = ownerType;
  const col = e.add(Collider); col.radius = 2; col.category = categoryBits; col.mask = maskBits;
  const dec = e.add(Decay); dec.life = ENTITY_CONFIG.BULLET.LIFE; dec.decay = 1;
  const drawable = e.add(Drawable);
  const fill = e.add(FillStyle); fill.style = color;
  const arc = e.add(Arc); arc.radius = 2;
  const order = e.add(DrawOrder); order.z = 20;
  e.add(Wraps);

  drawable.addStatement(FillStyle, 100, 'ctx.fillStyle = vars.fill.style', { fill });
  drawable.addStatement(Arc, 50, 'ctx.beginPath(); ctx.arc(0,0,vars.arc.radius,0,Math.PI*2); ctx.fill()', { arc });
}
