import { world, canvasSize } from '../world';
import {
  Position, Velocity, Rotation, Alien, Collider, Drawable, Shape, StrokeStyle, DrawOrder, Wraps,
} from '../components/index';
import { CAT_ENEMY, CAT_PLAYER, CAT_ASTEROID, CAT_PLAYER_BULLET, ENTITY_CONFIG } from '../constants';

export function createAlien(): void {
  const e = world.createEntity();
  const pos = e.add(Position);
  pos.x = Math.random() < 0.5 ? -20 : canvasSize.width + 20;
  pos.y = Math.random() * canvasSize.height;
  const vel = e.add(Velocity);
  vel.vx = (Math.random() - 0.5) * ENTITY_CONFIG.ALIEN.SPEED_FACTOR;
  vel.vy = (Math.random() - 0.5) * ENTITY_CONFIG.ALIEN.SPEED_FACTOR;
  const rot = e.add(Rotation); rot.angle = Math.random() * Math.PI * 2;
  const alien = e.add(Alien); alien.shootCooldown = ENTITY_CONFIG.ALIEN.SHOOT_COOLDOWN_BASE;
  const col = e.add(Collider);
  col.radius = ENTITY_CONFIG.ALIEN.RADIUS;
  col.category = CAT_ENEMY;
  col.mask = CAT_PLAYER | CAT_ASTEROID | CAT_PLAYER_BULLET;
  e.add(Wraps);

  const drawable = e.add(Drawable);
  const stroke = e.add(StrokeStyle); stroke.style = '#ffaa00';
  e.add(DrawOrder).z = 40;

  drawable.addStatement(StrokeStyle, 100, 'ctx.strokeStyle = vars.stroke.style; ctx.lineWidth = 2', { stroke });
  drawable.addStatement(Shape, 55,
    `ctx.beginPath(); ctx.moveTo(15,0); ctx.lineTo(-10,10); ctx.lineTo(-5,0); ctx.lineTo(-10,-10); ctx.closePath(); ctx.stroke();`,
    {});
}
