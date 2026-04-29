import { world, canvasSize } from '../world';
import {
  Position,
  Velocity,
  Rotation,
  Alien,
  Collider,
  Drawable,
  Shape,
  StrokeStyle,
  Wraps,
} from '../components/index';
import {
  CAT_ENEMY,
  CAT_PLAYER,
  CAT_ASTEROID,
  CAT_PLAYER_BULLET,
  ENTITY_CONFIG,
} from '../constants';

export function createAlien(): void {
  const e = world.createEntity();
  e.set(Position, {
    x: Math.random() < 0.5 ? -20 : canvasSize.width + 20,
    y: Math.random() * canvasSize.height,
  });
  e.set(Velocity, {
    vx: (Math.random() - 0.5) * ENTITY_CONFIG.ALIEN.SPEED_FACTOR,
    vy: (Math.random() - 0.5) * ENTITY_CONFIG.ALIEN.SPEED_FACTOR,
  });
  e.set(Rotation, { angle: Math.random() * Math.PI * 2 });
  e.set(Alien, { shootCooldown: ENTITY_CONFIG.ALIEN.SHOOT_COOLDOWN_BASE });
  e.set(Collider, {
    radius: ENTITY_CONFIG.ALIEN.RADIUS,
    category: CAT_ENEMY,
    mask: CAT_PLAYER | CAT_ASTEROID | CAT_PLAYER_BULLET,
  });
  e.set(Drawable, { zIndex: 40 });
  e.add(Wraps);
  e.set(StrokeStyle, { style: '#ffaa00', lineWidth: 2 });
  // UFO-like diamond shape
  e.set(Shape, {
    points: [
      { x: 15, y: 0 },
      { x: -10, y: 10 },
      { x: -5, y: 0 },
      { x: -10, y: -10 },
    ],
  });
}
