import { world } from '../world';
import {
  Position,
  Velocity,
  Rotation,
  Rocket,
  Collider,
  Decay,
  Drawable,
  Shape,
  FillStyle,
  Wraps,
} from '../components/index';
import {
  ENTITY_CONFIG,
  CAT_PLAYER_BULLET,
  CAT_ASTEROID,
  CAT_ENEMY,
} from '../constants';

export function createRocket(x: number, y: number, angle: number): void {
  const speed = ENTITY_CONFIG.ROCKET.SPEED;
  world
    .entity()
    .set(Position, { x, y })
    .set(Velocity, { vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed })
    .set(Rotation, { angle })
    .set(Rocket, { straightTimer: ENTITY_CONFIG.ROCKET.STRAIGHT_FRAMES })
    .set(Collider, {
      radius: 4,
      category: CAT_PLAYER_BULLET,
      mask: CAT_ASTEROID | CAT_ENEMY,
    })
    .set(Decay, { life: ENTITY_CONFIG.ROCKET.LIFE, decay: 1 })
    .set(Drawable, { zIndex: 20 })
    .add(Wraps)
    .set(FillStyle, { style: '#ff6600' })
    .set(Shape, {
      points: [
        { x: 6, y: 0 },
        { x: -3, y: 3 },
        { x: -3, y: -3 },
      ],
    });
}
