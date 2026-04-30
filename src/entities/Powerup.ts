import { ENTITY_CONFIG, GAME_CONFIG } from '../constants';
import type { Decay } from '../types';

class Powerup {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  color: string;
  label: string;
  decay: Decay;

  constructor(x: number | undefined, y: number | undefined, color: string, label: string) {
    this.x = x ?? Math.random() * window.innerWidth;
    this.y = y ?? Math.random() * window.innerHeight;
    this.radius = ENTITY_CONFIG.POWERUP.RADIUS;
    this.vx = (Math.random() - 0.5) * ENTITY_CONFIG.POWERUP.SPEED_FACTOR;
    this.vy = (Math.random() - 0.5) * ENTITY_CONFIG.POWERUP.SPEED_FACTOR;
    this.color = color;
    this.label = label;
    this.decay = { expiresAt: Date.now() + GAME_CONFIG.POWERUP_LIFETIME };
  }

  update(canvas: HTMLCanvasElement): void {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = this.color;
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.label, this.x, this.y);
  }
}

export class ShieldPowerup extends Powerup {
  constructor(x?: number, y?: number) {
    super(x, y, '#0f0', 'S');
  }
}

export class LaserPowerup extends Powerup {
  constructor(x?: number, y?: number) {
    super(x, y, '#f00', 'L');
  }
}

export class AuraPowerup extends Powerup {
  constructor(x?: number, y?: number) {
    super(x, y, '#3af', 'A');
  }
}
