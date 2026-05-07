import { world, canvasSize } from '../world';
import {
  Position,
  Velocity,
  Rotation,
  Alien,
  Collider,
  Drawable,
  Health,
  Shape,
  StrokeStyle,
  Wraps,
} from '../components/index';
import {
  CAT_ENEMY,
  CAT_PLAYER,
  CAT_ASTEROID,
  CAT_PLAYER_BULLET,
  CAT_BOOMERANG,
  ENTITY_CONFIG,
} from '../constants';

export function createAlien(): void {
  // UFO-like diamond shape
  world
    .entity()
    .set(Position, {
      x: Math.random() < 0.5 ? -20 : canvasSize.width + 20,
      y: Math.random() * canvasSize.height,
    })
    .set(Velocity, {
      vx: (Math.random() - 0.5) * ENTITY_CONFIG.ALIEN.SPEED_FACTOR,
      vy: (Math.random() - 0.5) * ENTITY_CONFIG.ALIEN.SPEED_FACTOR,
    })
    .set(Rotation, { angle: Math.random() * Math.PI * 2 })
    .set(Alien, { shootCooldown: ENTITY_CONFIG.ALIEN.SHOOT_COOLDOWN_BASE })
    .set(Health, {
      hp: ENTITY_CONFIG.ALIEN.MAX_HP,
      maxHp: ENTITY_CONFIG.ALIEN.MAX_HP,
      healthBarTimer: 0,
    })
    .set(Collider, {
      radius: ENTITY_CONFIG.ALIEN.RADIUS,
      category: CAT_ENEMY,
      mask: CAT_PLAYER | CAT_ASTEROID | CAT_PLAYER_BULLET | CAT_BOOMERANG,
    })
    .set(Drawable, { zIndex: 40 })
    .add(Wraps)
    .set(StrokeStyle, { style: '#ffaa00', lineWidth: 2 })
    .set(Shape, {
      points: [
        { x: 15, y: 0 },
        { x: -10, y: 10 },
        { x: -5, y: 0 },
        { x: -10, y: -10 },
      ],
    });
}
