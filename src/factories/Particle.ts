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
  const e = world.createEntity();
  e.set(Position, { x, y });
  e.set(Velocity, {
    vx: (Math.random() - 0.5) * 5,
    vy: (Math.random() - 0.5) * 5,
  });
  e.add(Particle);
  e.set(Decay, { life: 1.0, decay: 0.02 + Math.random() * 0.02 });
  e.set(Drawable, { zIndex: 10 });
  e.set(Alpha, { value: 1.0 });
  e.set(FillStyle, { style: color });
  e.set(FilledRect, { width: 2, height: 2 });
}

export function explode(x: number, y: number, color: string, count = 10): void {
  for (let i = 0; i < count; i++) createParticle(x, y, color);
}
