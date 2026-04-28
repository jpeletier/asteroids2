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
  const dec = e.add(Decay);
  dec.life = 1.0;
  dec.decay = 0.02 + Math.random() * 0.02;
  const drawable = e.add(Drawable);
  const alpha = e.add(Alpha); alpha.value = 1.0;
  const fill = e.add(FillStyle); fill.style = color;
  e.add(FilledRect);
  const order = e.add(DrawOrder); order.z = 10;

  drawable.addStatement(Alpha, 200, 'ctx.globalAlpha = vars.alpha.value', { alpha });
  drawable.addStatement(FillStyle, 100, 'ctx.fillStyle = vars.fill.style', { fill });
  drawable.addStatement(FilledRect, 50, 'ctx.fillRect(-1,-1,2,2)', {});
}

export function explode(x: number, y: number, color: string, count = 10): void {
  for (let i = 0; i < count; i++) createParticle(x, y, color);
}
