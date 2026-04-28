import { world } from '../world';
import {
  Position, Velocity, Particle, Decay, Drawable, Alpha, FilledRect, FillStyle, DrawOrder,
} from '../components/index';

export function createParticle(x: number, y: number, color: string): void {
  const e = world.createEntity();
  const pos = e.add(Position); pos.x = x; pos.y = y;
  const vel = e.add(Velocity);
  vel.vx = (Math.random() - 0.5) * 5;
  vel.vy = (Math.random() - 0.5) * 5;
  e.add(Particle);
  const dec = e.add(Decay); dec.life = 1.0; dec.decay = 0.02 + Math.random() * 0.02;
  e.add(DrawOrder).z = 10;
  e.add(Drawable);
  e.add(Alpha).value = 1.0;
  e.add(FillStyle).style = color;
  const rect = e.add(FilledRect); rect.width = 2; rect.height = 2;
}

export function explode(x: number, y: number, color: string, count = 10): void {
  for (let i = 0; i < count; i++) createParticle(x, y, color);
}
