import { Particle } from './entities/Particle.js';
import { Asteroid } from './entities/Asteroid.js';

export function explode(x, y, color, entities, count = 10) {
    for (let i = 0; i < count; i++) {
        entities.particles.push(new Particle(x, y, color));
    }
}

export function initStars(canvas) {
    const stars = [];
    for (let i = 0; i < 200; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            opacity: Math.random()
        });
    }
    return stars;
}

export function spawnWave(entities, wave, canvas) {
    const count = 3 + wave * 2;
    for (let i = 0; i < count; i++) {
        let x, y;
        do {
            x = Math.random() * canvas.width;
            y = Math.random() * canvas.height;
        } while (Math.hypot(x - canvas.width / 2, y - canvas.height / 2) < 200);
        entities.asteroids.push(new Asteroid(x, y, 40, 3));
    }
}
