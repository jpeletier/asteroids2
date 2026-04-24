import { ENTITY_CONFIG } from '../constants';
import { Bullet } from './Bullet';
import type { Entities } from '../types';
import type { Asteroid } from './Asteroid';

export class AlienShip {
  x: number;
  y: number;
  radius: number;
  color: string;
  angle: number;
  vx: number;
  vy: number;
  shootCooldown: number;

  constructor(canvas: HTMLCanvasElement) {
    this.x = Math.random() < 0.5 ? -20 : canvas.width + 20;
    this.y = Math.random() * canvas.height;
    this.radius = ENTITY_CONFIG.ALIEN.RADIUS;
    this.color = '#ffaa00';
    this.angle = Math.random() * Math.PI * 2;
    this.vx = (Math.random() - 0.5) * ENTITY_CONFIG.ALIEN.SPEED_FACTOR;
    this.vy = (Math.random() - 0.5) * ENTITY_CONFIG.ALIEN.SPEED_FACTOR;
    this.shootCooldown = ENTITY_CONFIG.ALIEN.SHOOT_COOLDOWN_BASE;
  }

  update(canvas: HTMLCanvasElement, entities: Entities): void {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < -this.radius * 2) this.x = canvas.width + this.radius * 2;
    if (this.x > canvas.width + this.radius * 2) this.x = -this.radius * 2;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
    this.angle += 0.05;

    let closestAsteroid: Asteroid | null = null;
    let minDistAst = Infinity;
    entities.asteroids.forEach((a) => {
      const d = Math.hypot(this.x - a.x, this.y - a.y);
      if (d < minDistAst) {
        minDistAst = d;
        closestAsteroid = a;
      }
    });

    if (closestAsteroid !== null && minDistAst < 60) {
      const ast = closestAsteroid as Asteroid;
      const angleToAst = Math.atan2(ast.y - this.y, ast.x - this.x);
      if (Math.random() < 0.5) {
        this.vx += Math.cos(angleToAst + Math.PI) * 0.1;
        this.vy += Math.sin(angleToAst + Math.PI) * 0.1;
      } else {
        if (this.shootCooldown <= 0) {
          entities.bullets.push(new Bullet(this.x, this.y, angleToAst, this.color, 'alien'));
          this.shootCooldown = 30;
        }
      }
    }

    this.shootCooldown--;
    if (this.shootCooldown <= 0) {
      let target: { x: number; y: number } | null = null;
      let minDist = Infinity;
      entities.players.forEach((p) => {
        const d = Math.hypot(p.x - this.x, p.y - this.y);
        if (d < minDist) {
          minDist = d;
          target = p;
        }
      });

      if (target !== null && minDist < ENTITY_CONFIG.ALIEN.TARGET_DIST_MAX) {
        const t = target as { x: number; y: number };
        const angleToPlayer = Math.atan2(t.y - this.y, t.x - this.x);
        entities.bullets.push(new Bullet(this.x, this.y, angleToPlayer, this.color, 'alien'));
        this.shootCooldown =
          ENTITY_CONFIG.ALIEN.SHOOT_COOLDOWN_BASE +
          Math.random() * ENTITY_CONFIG.ALIEN.SHOOT_COOLDOWN_RANGE;
      } else {
        this.shootCooldown = ENTITY_CONFIG.ALIEN.SHOOT_COOLDOWN_BASE;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(-10, 10);
    ctx.lineTo(-5, 0);
    ctx.lineTo(-10, -10);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
}
