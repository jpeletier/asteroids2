import { ENTITY_CONFIG } from '../constants.js';

export class Bullet {
    constructor(x, y, angle, color, ownerType = 'player') {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.color = color;
        this.speed = ENTITY_CONFIG.BULLET.SPEED;
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
        this.life = 100;
        this.ownerType = ownerType; // 'player', 'alien', 'boss'
    }

    update(canvas) {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        this.wrap(canvas);
    }

    wrap(canvas) {
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}
