import { ENTITY_CONFIG } from '../constants';
import { Bullet } from './Bullet';
import { Asteroid } from './Asteroid';
import type { Controls, GameContext, Point } from '../types';

export class Ship {
  x: number;
  y: number;
  radius: number;
  color: string;
  angle: number;
  vx: number;
  vy: number;
  controls: Controls;
  friction: number;
  shootCooldown: number;
  shieldTime: number;
  laserShots: number;
  isFiringLaser: boolean;
  laserTimer: number;
  auraShots: number;
  hp: number;
  maxHp: number;
  healthBarTimer: number;

  constructor(x: number, y: number, color: string, controls: Controls) {
    this.x = x;
    this.y = y;
    this.radius = ENTITY_CONFIG.SHIP.RADIUS;
    this.color = color;
    this.angle = 0;
    this.vx = 0;
    this.vy = 0;
    this.controls = controls;
    this.friction = ENTITY_CONFIG.SHIP.FRICTION;
    this.shootCooldown = 0;
    this.shieldTime = 0;
    this.laserShots = 0;
    this.isFiringLaser = false;
    this.laserTimer = 0;
    this.auraShots = 0;
    this.hp = ENTITY_CONFIG.SHIP.MAX_HP;
    this.maxHp = ENTITY_CONFIG.SHIP.MAX_HP;
    this.healthBarTimer = 0;
  }

  update(context: GameContext): void {
    const { keys, entities, canvas, explode } = context;
    const prevAngle = this.angle;
    if (keys[this.controls.rotateLeft]) this.angle -= ENTITY_CONFIG.SHIP.ROTATION_SPEED;
    if (keys[this.controls.rotateRight]) this.angle += ENTITY_CONFIG.SHIP.ROTATION_SPEED;

    if (this.isFiringLaser && this.angle !== prevAngle) {
      this.isFiringLaser = false;
    }

    if (this.healthBarTimer > 0) {
      this.healthBarTimer--;
    }

    if (keys[this.controls.thrust]) {
      this.vx += Math.cos(this.angle) * ENTITY_CONFIG.SHIP.THRUST_POWER;
      this.vy += Math.sin(this.angle) * ENTITY_CONFIG.SHIP.THRUST_POWER;
    }

    this.x += this.vx;
    this.y += this.vy;
    this.vx *= this.friction;
    this.vy *= this.friction;

    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;

    if (this.shootCooldown > 0) this.shootCooldown--;

    if (keys[this.controls.shoot] && this.shootCooldown <= 0) {
      if (this.auraShots > 0) {
        for (let i = 0; i < 8; i++) {
          const a = (i * Math.PI) / 4;
          entities.bullets.push(new Bullet(this.x, this.y, a, this.color, 'player'));
        }
        this.auraShots--;
        this.shootCooldown = ENTITY_CONFIG.SHIP.SHOOT_COOLDOWN;
      } else if (this.laserShots > 0) {
        this.isFiringLaser = true;
        this.laserTimer = ENTITY_CONFIG.SHIP.LASER_TIMER;
        this.laserShots--;
        this.shootCooldown = ENTITY_CONFIG.SHIP.SHOOT_COOLDOWN;
      } else {
        entities.bullets.push(new Bullet(this.x, this.y, this.angle, this.color, 'player'));
        this.shootCooldown = ENTITY_CONFIG.SHIP.SHOOT_COOLDOWN;
      }
    }

    if (this.isFiringLaser) {
      this.laserTimer--;
      this.fireLaser(context);
      if (this.laserTimer <= 0) {
        this.isFiringLaser = false;
      }
    }

    if (this.shieldTime > 0) {
      this.shieldTime--;
    }

    void explode; // used in fireLaser via context
  }

  fireLaser(context: GameContext): void {
    const { entities, explode } = context;
    const laserLen = 1000;
    const laserXEnd = this.x + Math.cos(this.angle) * laserLen;
    const laserYEnd = this.y + Math.sin(this.angle) * laserLen;

    // Collision with Asteroids
    entities.asteroids.forEach((a, ai) => {
      const dist = this.distToSegment(
        { x: a.x, y: a.y },
        { x: this.x, y: this.y },
        { x: laserXEnd, y: laserYEnd },
      );
      if (dist < a.radius) {
        explode(a.x, a.y, a.color, entities);
        if (a.level > 1) {
          entities.asteroids.push(new Asteroid(a.x, a.y, a.radius / 2, a.level - 1));
          entities.asteroids.push(new Asteroid(a.x, a.y, a.radius / 2, a.level - 1));
        }
        entities.asteroids.splice(ai, 1);
        context.updateScore(10 * a.level);
      }
    });

    // Collision with Aliens
    entities.aliens.forEach((al, ai) => {
      const dist = this.distToSegment(
        { x: al.x, y: al.y },
        { x: this.x, y: this.y },
        { x: laserXEnd, y: laserYEnd },
      );
      if (dist < al.radius) {
        explode(al.x, al.y, al.color, entities, 15);
        entities.aliens.splice(ai, 1);
        context.updateScore(100);
      }
    });

    // Collision with Boss
    if (entities.boss) {
      const dist = this.distToSegment(
        { x: entities.boss.x, y: entities.boss.y },
        { x: this.x, y: this.y },
        { x: laserXEnd, y: laserYEnd },
      );
      if (dist < entities.boss.radius) {
        entities.boss.hp--;
        explode(entities.boss.x, entities.boss.y, '#f00', entities, 3);
        if (entities.boss.hp <= 0) {
          explode(entities.boss.x, entities.boss.y, '#ff0', entities, 50);
          entities.boss = null;
          context.updateScore(1000);
          context.setGameState('win');
        }
      }
    }
  }

  distToSegment(p: Point, v: Point, w: Point): number {
    const l2 = Math.pow(v.x - w.x, 2) + Math.pow(v.y - w.y, 2);
    if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
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
    ctx.lineTo(-10, -10);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    if (this.isFiringLaser) {
      ctx.beginPath();
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 4;
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + Math.cos(this.angle) * 1000, this.y + Math.sin(this.angle) * 1000);
      ctx.stroke();
    }

    if (this.shieldTime > 0) {
      const progress = this.shieldTime / ENTITY_CONFIG.SHIP.SHIELD_DURATION;
      let r: number;
      let g: number;
      if (progress >= 0.5) {
        const t = (1 - progress) * 2;
        r = Math.floor(255 * t);
        g = 255;
      } else {
        const t = (0.5 - progress) * 2;
        r = 255;
        g = Math.floor(255 * (1 - t));
      }
      const shieldColor = `rgb(${r}, ${g}, 0)`;

      ctx.beginPath();
      ctx.strokeStyle = shieldColor;
      ctx.lineWidth = 3;
      ctx.arc(this.x, this.y, this.radius + 8, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (this.healthBarTimer > 0) {
      const barWidth = 30;
      const barHeight = 5;
      const bx = this.x - barWidth / 2;
      const by = this.y - this.radius - 15;

      ctx.strokeStyle = '#0f0';
      ctx.lineWidth = 1;
      ctx.strokeRect(bx, by, barWidth, barHeight);

      let fillCol = '#0f0';
      if (this.hp <= 33) fillCol = '#f00';
      else if (this.hp <= 66) fillCol = '#ff0';

      ctx.fillStyle = fillCol;
      ctx.fillRect(bx, by, barWidth * (this.hp / this.maxHp), barHeight);
    }
  }
}
