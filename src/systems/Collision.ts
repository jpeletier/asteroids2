import { world, updatePhase, gameState, msgEl } from '../world';
import {
  Collider,
  Dead,
  Shield,
  Health,
  Asteroid,
  Pickup,
  Position,
} from '../components/index';
import { SHIELD_DAMAGE, SCORING } from '../constants';
import { explode } from '../factories/Particle';
import { createAsteroid } from '../factories/Asteroid';
import type { Entity } from '@vworlds/vecs';

type CollisionHandler = (a: Entity, b: Entity) => void;
const registry = new Map<number, CollisionHandler[]>();

function regKey(bitA: number, bitB: number): number {
  return Math.min(bitA, bitB) * 100 + Math.max(bitA, bitB);
}

export function registerCollisionEffect(
  bitA: number,
  bitB: number,
  handler: CollisionHandler,
): void {
  const lo = Math.min(bitA, bitB);
  const hi = Math.max(bitA, bitB);
  const k = regKey(lo, hi);
  const arr = registry.get(k) ?? [];
  // ensure handler receives (lo-category entity, hi-category entity)
  arr.push(bitA <= bitB ? handler : (a, b) => handler(b, a));
  registry.set(k, arr);
}

function getBits(mask: number): number[] {
  const bits: number[] = [];
  let n = mask;
  while (n) {
    bits.push(31 - Math.clz32(n & -n));
    n &= n - 1;
  }
  return bits;
}

function dispatchCollision(
  a: Entity,
  b: Entity,
  colA: Collider,
  colB: Collider,
): void {
  const catAbits = colA.category & colB.mask;
  const catBbits = colB.category & colA.mask;
  const catAlist = getBits(catAbits);
  const catBlist = getBits(catBbits);
  for (const cA of catAlist) {
    for (const cB of catBlist) {
      const lo = Math.min(cA, cB);
      const hi = Math.max(cA, cB);
      const handlers = registry.get(regKey(lo, hi));
      if (handlers) {
        for (const h of handlers) {
          // h was stored with (lo-cat, hi-cat) order; a has cA, b has cB
          if (cA <= cB) h(a, b);
          else h(b, a);
        }
      }
    }
  }
}

// ── Bit indices (matching CAT_* = 1<<N) ──────────────────────────────────
export const BIT_PLAYER = 0;
export const BIT_ASTEROID = 1;
export const BIT_PLAYER_BULLET = 2;
export const BIT_ENEMY_BULLET = 3;
export const BIT_ENEMY = 4;
export const BIT_PICKUP = 5;

// ── Helpers ───────────────────────────────────────────────────────────────
let _initGame: (() => void) | null = null;
export function setInitGameCallback(fn: () => void): void {
  _initGame = fn;
}

function triggerLose(): void {
  gameState.state = 'lose';
  if (msgEl) msgEl.innerText = 'GAME OVER';
  setTimeout(() => {
    _initGame?.();
  }, 3000);
}

function damagePlayer(player: Entity, shieldDmg: number): void {
  const shield = player.get(Shield);
  if (shield) {
    shield.shieldTime = Math.max(0, shield.shieldTime - shieldDmg);
    if (shield.shieldTime <= 0) player.remove(Shield);
  } else {
    const health = player.get(Health);
    if (!health) return;
    health.hp -= 10;
    health.healthBarTimer = 60;
    if (health.hp <= 0) triggerLose();
  }
}

function getPos(e: Entity): { x: number; y: number } {
  const p = e.get(Position);
  return p ?? { x: 0, y: 0 };
}

// ── Register handlers ─────────────────────────────────────────────────────

// Player ↔ Pickup
registerCollisionEffect(BIT_PLAYER, BIT_PICKUP, (player, pickup) => {
  const pu = pickup.get(Pickup);
  if (!pu || pickup.get(Dead)) return;
  const { x, y } = getPos(player);
  pu.effectFunc(player, pickup);
  explode(x, y, '#fff', 20);
  pickup.add(Dead);
});

// Player Bullet ↔ Asteroid
registerCollisionEffect(BIT_PLAYER_BULLET, BIT_ASTEROID, (bullet, asteroid) => {
  if (bullet.get(Dead) || asteroid.get(Dead)) return;
  const acomp = asteroid.get(Asteroid)!;
  const { x, y } = getPos(asteroid);
  explode(x, y, acomp.color);
  if (acomp.level > 1) {
    const nl = (acomp.level - 1) as 1 | 2;
    createAsteroid(x, y, nl);
    createAsteroid(x, y, nl);
  }
  bullet.add(Dead);
  asteroid.add(Dead);
  gameState.score += SCORING.ASTEROID_BASE * acomp.level;
});

// Player Bullet ↔ Alien
registerCollisionEffect(BIT_PLAYER_BULLET, BIT_ENEMY, (bullet, alien) => {
  if (bullet.get(Dead) || alien.get(Dead)) return;
  explode(getPos(alien).x, getPos(alien).y, '#ffaa00', 15);
  bullet.add(Dead);
  alien.add(Dead);
  gameState.score += SCORING.ALIEN;
});

// Alien Bullet ↔ Player
registerCollisionEffect(BIT_PLAYER, BIT_ENEMY_BULLET, (player, bullet) => {
  if (player.get(Dead) || bullet.get(Dead)) return;
  damagePlayer(player, SHIELD_DAMAGE.BULLET);
  bullet.add(Dead);
});

// Alien Bullet ↔ Asteroid
registerCollisionEffect(BIT_ASTEROID, BIT_ENEMY_BULLET, (asteroid, bullet) => {
  if (asteroid.get(Dead) || bullet.get(Dead)) return;
  const acomp = asteroid.get(Asteroid);
  explode(getPos(asteroid).x, getPos(asteroid).y, acomp?.color ?? '#aaa');
  asteroid.add(Dead);
  bullet.add(Dead);
});

// Alien ↔ Asteroid
registerCollisionEffect(BIT_ASTEROID, BIT_ENEMY, (asteroid, alien) => {
  if (asteroid.get(Dead) || alien.get(Dead)) return;
  const acomp = asteroid.get(Asteroid);
  explode(
    getPos(asteroid).x,
    getPos(asteroid).y,
    acomp?.color ?? '#ffaa00',
    20,
  );
  alien.add(Dead);
  asteroid.add(Dead);
  gameState.score += SCORING.ALIEN;
});

// Alien ↔ Player
registerCollisionEffect(BIT_PLAYER, BIT_ENEMY, (player, alien) => {
  if (player.get(Dead) || alien.get(Dead)) return;
  const { x, y } = getPos(player);
  damagePlayer(player, SHIELD_DAMAGE.ALIEN_BODY);
  explode(x, y, '#ffaa00', player.get(Shield) ? 20 : 5);
  alien.add(Dead);
  gameState.score += SCORING.ALIEN;
});

// Player ↔ Asteroid
registerCollisionEffect(BIT_PLAYER, BIT_ASTEROID, (player, asteroid) => {
  if (player.get(Dead) || asteroid.get(Dead)) return;
  const acomp = asteroid.get(Asteroid)!;
  const { x: ax, y: ay } = getPos(asteroid);
  const { x: px, y: py } = getPos(player);
  damagePlayer(player, SHIELD_DAMAGE.ASTEROID);
  explode(
    player.get(Shield) ? ax : px,
    player.get(Shield) ? ay : py,
    acomp.color,
    5,
  );
  asteroid.add(Dead);
  gameState.score += SCORING.ASTEROID_BASE * acomp.level;
});

// ── Collision query + system ───────────────────────────────────────────────
const colliderQuery = world.query('Colliders').requires(Collider).track();

world
  .system('Collision')
  .phase(updatePhase)
  .run(() => {
    if (gameState.state !== 'playing') return;
    const entities = [...colliderQuery.entities] as Entity[];
    for (let i = 0; i < entities.length; i++) {
      const a = entities[i]!;
      if (a.get(Dead)) continue;
      const colA = a.get(Collider)!;
      const posA = a.get(Position)!;
      for (let j = i + 1; j < entities.length; j++) {
        const b = entities[j]!;
        if (b.get(Dead)) continue;
        const colB = b.get(Collider)!;
        if (!(colA.mask & colB.category) || !(colB.mask & colA.category))
          continue;
        const posB = b.get(Position)!;
        if (
          Math.hypot(posA.x - posB.x, posA.y - posB.y) <
          colA.radius + colB.radius
        ) {
          dispatchCollision(a, b, colA, colB);
        }
      }
    }
  });
