import { ENTITY_CONFIG } from '../constants';
import type { Point } from '../types';

const ASTEROID_COLORS = ['#aaa', '#888', '#bbb', '#999', '#777'] as const;

export class Asteroid {
  x: number;
  y: number;
  radius: number;
  level: number;
  angle: number;
  vx: number;
  vy: number;
  color: string;
  points: Point[];

  constructor(x: number, y: number, radius: number, level = 3) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.level = level;
    this.angle = Math.random() * Math.PI * 2;
    this.vx = (Math.random() - 0.5) * (ENTITY_CONFIG.ASTEROID.SPEED_FACTOR - level);
    this.vy = (Math.random() - 0.5) * (ENTITY_CONFIG.ASTEROID.SPEED_FACTOR - level);
    const idx = Math.floor(Math.random() * ASTEROID_COLORS.length);
    this.color = ASTEROID_COLORS[idx] ?? ASTEROID_COLORS[0];
    this.points = [];
    const vert = 5 + Math.floor(Math.random() * 5);
    for (let i = 0; i < vert; i++) {
      const r = this.radius * (0.8 + Math.random() * 0.4);
      const a = (i / vert) * Math.PI * 2;
      this.points.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
    }
  }

  update(canvas: HTMLCanvasElement): void {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < -this.radius) this.x = canvas.width + this.radius;
    if (this.x > canvas.width + this.radius) this.x = -this.radius;
    if (this.y < -this.radius) this.y = canvas.height + this.radius;
    if (this.y > canvas.height + this.radius) this.y = -this.radius;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    const first = this.points[0];
    if (first) {
      ctx.moveTo(this.x + first.x, this.y + first.y);
    }
    for (const p of this.points) ctx.lineTo(this.x + p.x, this.y + p.y);
    ctx.closePath();
    ctx.stroke();
  }
}
