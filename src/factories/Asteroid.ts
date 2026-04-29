import { world } from '../world';
import {
  Position,
  Velocity,
  Asteroid,
  Collider,
  Drawable,
  Shape,
  StrokeStyle,
  Wraps,
} from '../components/index';
import {
  CAT_ASTEROID,
  CAT_PLAYER,
  CAT_PLAYER_BULLET,
  CAT_ENEMY_BULLET,
  CAT_ENEMY,
  ENTITY_CONFIG,
} from '../constants';
import type { Point } from '../types';

const ASTEROID_COLORS = ['#aaa', '#888', '#bbb', '#999', '#777'] as const;
const ASTEROID_RADII: Record<number, number> = { 1: 10, 2: 20, 3: 40 };

export function createAsteroid(x: number, y: number, level: 1 | 2 | 3): void {
  const radius = ASTEROID_RADII[level] ?? 40;
  const color =
    ASTEROID_COLORS[Math.floor(Math.random() * ASTEROID_COLORS.length)] ??
    '#aaa';

  const e = world.createEntity();
  e.set(Position, { x, y });
  e.set(Velocity, {
    vx: (Math.random() - 0.5) * (ENTITY_CONFIG.ASTEROID.SPEED_FACTOR - level),
    vy: (Math.random() - 0.5) * (ENTITY_CONFIG.ASTEROID.SPEED_FACTOR - level),
  });
  e.set(Asteroid, { level, color });
  e.set(Collider, {
    radius,
    category: CAT_ASTEROID,
    mask: CAT_PLAYER | CAT_PLAYER_BULLET | CAT_ENEMY_BULLET | CAT_ENEMY,
  });
  e.set(Drawable, { zIndex: 30 });
  e.add(Wraps);
  e.set(StrokeStyle, { style: color, lineWidth: 2 });
  const vert = 5 + Math.floor(Math.random() * 5);
  const points: Point[] = [];
  for (let i = 0; i < vert; i++) {
    const r = radius * (0.8 + Math.random() * 0.4);
    const a = (i / vert) * Math.PI * 2;
    points.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
  }
  e.set(Shape, { points });
}
