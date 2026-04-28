import { world, canvasSize } from '../world';
import {
  Position, Velocity, Rotation, Alien, Collider, Drawable, Shape, StrokeStyle, Wraps,
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
  e.add(Rotation).angle = Math.random() * Math.PI * 2;
  e.add(Alien).shootCooldown = ENTITY_CONFIG.ALIEN.SHOOT_COOLDOWN_BASE;
  const col = e.add(Collider);
  col.radius = ENTITY_CONFIG.ALIEN.RADIUS;
  col.category = CAT_ENEMY;
  col.mask = CAT_PLAYER | CAT_ASTEROID | CAT_PLAYER_BULLET;
  e.add(Drawable).zIndex = 40;
  e.add(Wraps);
  const stroke = e.add(StrokeStyle); stroke.style = '#ffaa00'; stroke.lineWidth = 2;
  // UFO-like diamond shape
  e.add(Shape).points = [{ x: 15, y: 0 }, { x: -10, y: 10 }, { x: -5, y: 0 }, { x: -10, y: -10 }];
}
