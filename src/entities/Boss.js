import { ENTITY_CONFIG } from '../constants.js';

export class Boss {
    constructor(canvas) {
        this.x = canvas.width / 2;
        this.y = -100;
        this.targetY = canvas.height * ENTITY_CONFIG.BOSS.TARGET_Y_FACTOR;
        this.radius = ENTITY_CONFIG.BOSS.RADIUS;
        this.hp = ENTITY_CONFIG.BOSS.HP;
        this.maxHp = ENTITY_CONFIG.BOSS.HP;
        this.angle = 0;
        this.vx = ENTITY_CONFIG.BOSS.SPEED_X;
    }

    update(canvas) {
        if (this.y < this.targetY) this.y += 2;
        this.x += this.vx;
        if (this.x < this.radius || this.x > canvas.width - this.radius) this.vx *= -1;
        this.angle += 0.02;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 4;
        ctx.strokeRect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
        ctx.restore();
        ctx.fillStyle = '#333';
        ctx.fillRect(this.x - 50, this.y - 80, 100, 10);
        ctx.fillStyle = '#f00';
        ctx.fillRect(this.x - 50, this.y - 80, (this.hp / this.maxHp) * 100, 10);
    }
}
