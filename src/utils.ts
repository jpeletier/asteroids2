import { Particle } from './entities/Particle';
import { Asteroid } from './entities/Asteroid';
import type { Entities, Star } from './types';

export function explode(
  x: number,
  y: number,
  color: string,
  entities: Entities,
  count = 10,
): void {
  for (let i = 0; i < count; i++) {
    entities.particles.push(new Particle(x, y, color));
  }
}

export function initStars(canvas: HTMLCanvasElement): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2,
      opacity: Math.random(),
    });
  }
  return stars;
}

export function spawnWave(
  entities: Entities,
  wave: number,
  canvas: HTMLCanvasElement,
): void {
  const count = 3 + wave * 2;
  for (let i = 0; i < count; i++) {
    let x: number;
    let y: number;
    do {
      x = Math.random() * canvas.width;
      y = Math.random() * canvas.height;
    } while (Math.hypot(x - canvas.width / 2, y - canvas.height / 2) < 200);
    entities.asteroids.push(new Asteroid(x, y, 40, 3));
  }
}
