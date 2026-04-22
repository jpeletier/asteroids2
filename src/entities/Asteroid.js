import { ENTITY_CONFIG } from '../constants.js';

export class Asteroid {
    constructor(x, y, radius, level = 3) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.level = level;
        this.angle = Math.random() * Math.PI * 2;
        this.vx = (Math.random() - 0.5) * (ENTITY_CONFIG.ASTEROID.SPEED_FACTOR - level);
        this.vy = (Math.random() - 0.5) * (ENTITY_CONFIG.ASTEROID.SPEED_FACTOR - level);
        this.color = ['#aaa', '#888', '#bbb', '#999', '#777'][Math.floor(Math.random() * 5)];
        this.points = [];
        const vert = 5 + Math.floor(Math.random() * 5);
        for (let i = 0; i < vert; i++) {
            const r = this.radius * (0.8 + Math.random() * 0.4);
            const a = (i / vert) * Math.PI * 2;
            this.points.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
        }
    }

    update(canvas) {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < -this.radius) this.x = canvas.width + this.radius;
        if (this.x > canvas.width + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = canvas.height + this.radius;
        if (this.y > canvas.height + this.radius) this.y = -this.radius;
    }

    draw(ctx) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + this.points[0].x, this.y + this.points[0].y);
        for (let p of this.points) ctx.lineTo(this.x + p.x, this.y + p.y);
        ctx.closePath();
        ctx.stroke();
    }
}
