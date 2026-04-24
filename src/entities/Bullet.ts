import { ENTITY_CONFIG } from '../constants';
import type { OwnerType } from '../types';

export class Bullet {
  x: number;
  y: number;
  angle: number;
  color: string;
  speed: number;
  vx: number;
  vy: number;
  life: number;
  ownerType: OwnerType;

  constructor(
    x: number,
    y: number,
    angle: number,
    color: string,
    ownerType: OwnerType = 'player',
  ) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.color = color;
    this.speed = ENTITY_CONFIG.BULLET.SPEED;
    this.vx = Math.cos(angle) * this.speed;
    this.vy = Math.sin(angle) * this.speed;
    this.life = 100;
    this.ownerType = ownerType;
  }

  update(canvas: HTMLCanvasElement): void {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    this.wrap(canvas);
  }

  wrap(canvas: HTMLCanvasElement): void {
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}
