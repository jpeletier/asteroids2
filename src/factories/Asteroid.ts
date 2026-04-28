import { world } from '../world';
import {
  Position, Velocity, Asteroid, Collider, Drawable, Shape, StrokeStyle, DrawOrder, Wraps,
} from '../components/index';
import { CAT_ASTEROID, CAT_PLAYER, CAT_PLAYER_BULLET, CAT_ENEMY_BULLET, CAT_ENEMY, ENTITY_CONFIG } from '../constants';
import type { Point } from '../types';

const ASTEROID_COLORS = ['#aaa', '#888', '#bbb', '#999', '#777'] as const;
const ASTEROID_RADII: Record<number, number> = { 1: 10, 2: 20, 3: 40 };

export function createAsteroid(x: number, y: number, level: 1 | 2 | 3): void {
  const radius = ASTEROID_RADII[level] ?? 40;
  const color = ASTEROID_COLORS[Math.floor(Math.random() * ASTEROID_COLORS.length)] ?? '#aaa';

  const e = world.createEntity();
  const pos = e.add(Position); pos.x = x; pos.y = y;
  const vel = e.add(Velocity);
  vel.vx = (Math.random() - 0.5) * (ENTITY_CONFIG.ASTEROID.SPEED_FACTOR - level);
  vel.vy = (Math.random() - 0.5) * (ENTITY_CONFIG.ASTEROID.SPEED_FACTOR - level);
  const ast = e.add(Asteroid); ast.level = level; ast.color = color;
  const col = e.add(Collider);
  col.radius = radius;
  col.category = CAT_ASTEROID;
  col.mask = CAT_PLAYER | CAT_PLAYER_BULLET | CAT_ENEMY_BULLET | CAT_ENEMY;
  const drawable = e.add(Drawable);
  const stroke = e.add(StrokeStyle); stroke.style = color;
  const shape = e.add(Shape);
  const order = e.add(DrawOrder); order.z = 30;
  e.add(Wraps);

  const vert = 5 + Math.floor(Math.random() * 5);
  const points: Point[] = [];
  for (let i = 0; i < vert; i++) {
    const r = radius * (0.8 + Math.random() * 0.4);
    const a = (i / vert) * Math.PI * 2;
    points.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
  }
  shape.points = points;

  drawable.addStatement(StrokeStyle, 100, 'ctx.strokeStyle = vars.stroke.style; ctx.lineWidth = 2', { stroke });
  drawable.addStatement(Shape, 55,
    `ctx.beginPath();
     const pts = vars.pts;
     if (pts.length > 0) { ctx.moveTo(pts[0].x, pts[0].y); }
     for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
     ctx.closePath(); ctx.stroke();`,
    { pts: points });
}
