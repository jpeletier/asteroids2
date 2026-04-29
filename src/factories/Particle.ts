import { world } from '../world';
import {
  Position,
  Velocity,
  Particle,
  Decay,
  Drawable,
  Alpha,
  FilledRect,
  FillStyle,
} from '../components/index';

export function createParticle(x: number, y: number, color: string): void {
  world
    .entity()
    .set(Position, { x, y })
    .set(Velocity, {
      vx: (Math.random() - 0.5) * 5,
      vy: (Math.random() - 0.5) * 5,
    })
    .add(Particle)
    .set(Decay, { life: 1.0, decay: 0.02 + Math.random() * 0.02 })
    .set(Drawable, { zIndex: 10 })
    .set(Alpha, { value: 1.0 })
    .set(FillStyle, { style: color })
    .set(FilledRect, { width: 2, height: 2 });
}

export function explode(x: number, y: number, color: string, count = 10): void {
  for (let i = 0; i < count; i++) createParticle(x, y, color);
}
