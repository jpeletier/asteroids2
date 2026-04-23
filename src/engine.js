import { initStars, spawnWave, explode } from './utils.js';
import { Ship } from './entities/Ship.js';
import { AlienShip } from './entities/AlienShip.js';
import { Boss } from './entities/Boss.js';
import { ShieldPowerup, LaserPowerup } from './entities/Powerup.js';
import { Asteroid } from './entities/Asteroid.js';
import { GAME_CONFIG } from './constants.js';

export class GameEngine {
    constructor(canvas, scoreEl, waveEl, msgEl) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.scoreEl = scoreEl;
        this.waveEl = waveEl;
        this.msgEl = msgEl;

        this.score = 0;
        this.wave = 1;
        this.gameState = 'playing';
        this.entities = { players: [], bullets: [], asteroids: [], particles: [], boss: null, aliens: [], shieldPowerup: null, laserPowerup: null };
        this.stars = [];
        this.lastAlienSpawnTime = 0;
        this.lastShieldSpawnTime = 0;
        this.lastLaserSpawnTime = 0;
        this.keys = {};

        window.addEventListener('keydown', e => this.keys[e.code] = true);
        window.addEventListener('keyup', e => this.keys[e.code] = false);
        window.addEventListener('resize', () => this.handleResize());
    }

    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.stars = initStars(this.canvas);
    }

    init() {
        this.handleResize();
        this.entities = { players: [], bullets: [], asteroids: [], particles: [], boss: null, aliens: [], shieldPowerup: null, laserPowerup: null };
        this.entities.players = [
            new Ship(this.canvas.width * 0.3, this.canvas.height * 0.5, '#00ffcc', { thrust: 'KeyW', rotateLeft: 'KeyA', rotateRight: 'KeyD', shoot: 'Space' }),
            new Ship(this.canvas.width * 0.7, this.canvas.height * 0.5, '#ff00ff', { thrust: 'ArrowUp', rotateLeft: 'ArrowLeft', rotateRight: 'ArrowRight', shoot: 'Enter' })
        ];
        spawnWave(this.entities, this.wave, this.canvas);
        this.gameState = 'playing';
        this.score = 0;
        this.wave = 1;
        this.updateUI();
        this.msgEl.innerText = '';
        this.lastAlienSpawnTime = Date.now();
        this.lastShieldSpawnTime = Date.now();
        this.lastLaserSpawnTime = Date.now();
    }

    updateUI() {
        this.scoreEl.innerText = `Score: ${this.score}`;
        this.waveEl.innerText = `Wave: ${this.wave}`;
    }

    updateScore(amount) {
        this.score += amount;
        this.updateUI();
    }

    setGameState(state) {
        this.gameState = state;
    }

    getContext() {
        return {
            canvas: this.canvas,
            ctx: this.ctx,
            keys: this.keys,
            entities: this.entities,
            explode: (x, y, color, entities, count) => explode(x, y, color, entities, count),
            updateScore: (amount) => this.updateScore(amount),
            setGameState: (state) => this.setGameState(state)
        };
    }

    update() {
        if (this.gameState !== 'playing' && this.gameState !== 'boss') return;

        const now = Date.now();
        const context = this.getContext();

        if (this.gameState === 'playing' && now - this.lastAlienSpawnTime > GAME_CONFIG.ALIEN_SPAWN_INTERVAL && this.entities.aliens.length < 3) {
            this.entities.aliens.push(new AlienShip(this.canvas));
            this.lastAlienSpawnTime = now;
        }

        if (this.gameState === 'playing' && !this.entities.shieldPowerup && !this.entities.laserPowerup && now - this.lastShieldSpawnTime > GAME_CONFIG.SHIELD_SPAWN_INTERVAL) {
            if (Math.random() < GAME_CONFIG.SHIELD_SPAWN_CHANCE) {
                this.entities.shieldPowerup = new ShieldPowerup();
                this.lastShieldSpawnTime = now;
            } else {
                this.lastShieldSpawnTime = now;
            }
        }

        if (this.gameState === 'playing' && !this.entities.laserPowerup && now - this.lastLaserSpawnTime > GAME_CONFIG.LASER_SPAWN_INTERVAL) {
            if (Math.random() < GAME_CONFIG.LASER_SPAWN_CHANCE) {
                this.entities.laserPowerup = new LaserPowerup();
                this.lastLaserSpawnTime = now;
            } else {
                this.lastLaserSpawnTime = now;
            }
        }

        this.entities.players.forEach(p => p.update(context));
        this.entities.bullets.forEach(b => b.update(this.canvas));
        this.entities.asteroids.forEach(a => a.update(this.canvas));
        this.entities.particles.forEach(p => p.update());
        this.entities.aliens.forEach(al => al.update(this.canvas, this.entities));
        if (this.entities.boss) this.entities.boss.update(this.canvas);
        if (this.entities.shieldPowerup) this.entities.shieldPowerup.update(this.canvas);
        if (this.entities.laserPowerup) this.entities.laserPowerup.update(this.canvas);

        // Powerup collisions
        const shieldPowerup = this.entities.shieldPowerup;
        if (shieldPowerup) {
            this.entities.players.forEach(p => {
                if (Math.hypot(p.x - shieldPowerup.x, p.y - shieldPowerup.y) < p.radius + shieldPowerup.radius) {
                    p.shieldTime = 2400;
                    explode(p.x, p.y, '#0f0', this.entities, 20);
                    this.entities.shieldPowerup = null;
                    this.updateScore(50);
                }
            });
        }

        const laserPowerup = this.entities.laserPowerup;
        if (laserPowerup) {
            this.entities.players.forEach(p => {
                if (Math.hypot(p.x - laserPowerup.x, p.y - laserPowerup.y) < p.radius + laserPowerup.radius) {
                    p.laserShots = 10;
                    explode(p.x, p.y, '#f00', this.entities, 20);
                    this.entities.laserPowerup = null;
                    this.updateScore(75);
                }
            });
        }

        // Bullet collisions
        this.entities.bullets = this.entities.bullets.filter(b => {
            if (b.life <= 0) return false;

            if (b.ownerType === 'player') {
                // Asteroid collision
                for (let i = 0; i < this.entities.asteroids.length; i++) {
                    const a = this.entities.asteroids[i];
                    if (Math.hypot(b.x - a.x, b.y - a.y) < a.radius) {
                        explode(a.x, a.y, a.color, this.entities);
                        if (a.level > 1) {
                            this.entities.asteroids.push(new Asteroid(a.x, a.y, a.radius / 2, a.level - 1));
                            this.entities.asteroids.push(new Asteroid(a.x, a.y, a.radius / 2, a.level - 1));
                        }
                        this.entities.asteroids.splice(i, 1);
                        this.updateScore(10 * a.level);
                        return false;
                    }
                }

                // Alien collision
                for (let i = 0; i < this.entities.aliens.length; i++) {
                    const al = this.entities.aliens[i];
                    if (Math.hypot(b.x - al.x, b.y - al.y) < al.radius) {
                        explode(al.x, al.y, al.color, this.entities, 15);
                        this.entities.aliens.splice(i, 1);
                        this.updateScore(100);
                        return false;
                    }
                }

                // Boss collision
                if (this.entities.boss) {
                    if (Math.hypot(b.x - this.entities.boss.x, b.y - this.entities.boss.y) < this.entities.boss.radius) {
                        this.entities.boss.hp--;
                        explode(b.x, b.y, '#f00', this.entities, 3);
                        if (this.entities.boss.hp <= 0) {
                            explode(this.entities.boss.x, this.entities.boss.y, '#ff0', this.entities, 50);
                            this.entities.boss = null;
                            this.updateScore(1000);
                            this.setGameState('win');
                            this.msgEl.innerText = 'VICTORY!';
                            setTimeout(() => this.init(), 3000);
                        }
                        return false;
                    }
                }
            } else if (b.ownerType === 'alien') {
                this.entities.players.forEach(p => {
                    if (Math.hypot(b.x - p.x, b.y - p.y) < p.radius) {
                        if (p.shieldTime > 0) {
                            p.shieldTime = Math.max(0, p.shieldTime - (5 * 60));
                            explode(p.x, p.y, '#fff', this.entities, 5);
                        } else {
                            p.hp -= 10;
                            p.healthBarTimer = 60;
                            explode(p.x, p.y, p.color, this.entities, 5);
                            if (p.hp <= 0) {
                                this.setGameState('lose');
                                this.msgEl.innerText = 'GAME OVER';
                                setTimeout(() => this.init(), 3000);
                            }
                        }
                        return false;
                    }
                });
            }
            return true;
        });

        // Alien collision with asteroids and players
        this.entities.aliens.forEach((al, ai) => {
            // Alien vs Asteroid
            for (let i = 0; i < this.entities.asteroids.length; i++) {
                const a = this.entities.asteroids[i];
                if (Math.hypot(al.x - a.x, al.y - a.y) < al.radius + a.radius) {
                    explode(al.x, al.y, al.color, this.entities, 20);
                    this.entities.aliens.splice(ai, 1);
                    this.entities.asteroids.splice(i, 1);
                    this.updateScore(100);
                    return;
                }
            }

            // Alien vs Player
            this.entities.players.forEach(p => {
                if (Math.hypot(al.x - p.x, al.y - p.y) < al.radius + p.radius) {
                    if (p.shieldTime > 0) {
                        p.shieldTime = Math.max(0, p.shieldTime - (10 * 60));
                        explode(al.x, al.y, al.color, this.entities, 20);
                    } else {
                        p.hp -= 10;
                        p.healthBarTimer = 60;
                        explode(al.x, al.y, p.color, this.entities, 5);
                        if (p.hp <= 0) {
                            this.setGameState('lose');
                            this.msgEl.innerText = 'GAME OVER';
                            setTimeout(() => this.init(), 3000);
                        }
                    }
                    this.entities.aliens.splice(ai, 1);
                    this.updateScore(100);
                }
            });
        });

        // Player vs Asteroid collision
        this.entities.players.forEach(p => {
            for (let i = 0; i < this.entities.asteroids.length; i++) {
                const a = this.entities.asteroids[i];
                if (Math.hypot(p.x - a.x, p.y - a.y) < a.radius + p.radius) {
                    if (p.shieldTime > 0) {
                        p.shieldTime = Math.max(0, p.shieldTime - (5 * 60));
                        explode(a.x, a.y, a.color, this.entities);
                        this.entities.asteroids.splice(i, 1);
                        this.updateScore(10 * a.level);
                    } else {
                        p.hp -= 10;
                        p.healthBarTimer = 60;
                        explode(a.x, a.y, p.color, this.entities, 5);
                        if (p.hp <= 0) {
                            this.setGameState('lose');
                            this.msgEl.innerText = 'GAME OVER';
                            setTimeout(() => this.init(), 3000);
                        }
                        this.entities.asteroids.splice(i, 1);
                        this.updateScore(10 * a.level);
                    }
                }
            }
        });

        if (this.entities.asteroids.length === 0 && this.entities.aliens.length === 0 && this.gameState === 'playing') {
            if (this.wave % 3 === 0) {
                this.gameState = 'boss';
                this.entities.boss = new Boss(this.canvas);
                this.msgEl.innerText = 'BOSS APPEARS!';
                setTimeout(() => this.msgEl.innerText = '', 2000);
            } else {
                this.wave++;
                this.updateUI();
                spawnWave(this.entities, this.wave, this.canvas);
            }
        }

        this.entities.particles = this.entities.particles.filter(p => p.life > 0);
    }

    draw() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'white';
        this.stars.forEach(star => {
            this.ctx.globalAlpha = star.opacity;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1.0;

        this.entities.particles.forEach(p => p.draw(this.ctx));
        this.entities.bullets.forEach(b => b.draw(this.ctx));
        this.entities.asteroids.forEach(a => a.draw(this.ctx));
        this.entities.aliens.forEach(al => al.draw(this.ctx));
        if (this.entities.shieldPowerup) this.entities.shieldPowerup.draw(this.ctx);
        if (this.entities.laserPowerup) this.entities.laserPowerup.draw(this.ctx);
        this.entities.players.forEach(p => p.draw(this.ctx));
        if (this.entities.boss) this.entities.boss.draw(this.ctx);
    }

    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }

    start() {
        this.init();
        this.loop();
    }
}
