import { World } from '@vworlds/vecs';
import {
  Position,
  Velocity,
  Rotation,
  AngularVelocity,
  Friction,
  Thrust,
  Drawable,
  Shape,
  Arc,
  FillStyle,
  StrokeStyle,
  Label,
  Alpha,
  FilledRect,
  Collider,
  Health,
  Shield,
  LaserWeapon,
  AuraWeapon,
  RocketWeapon,
  BoomerangWeapon,
  Boomerang,
  DefaultWeapon,
  Pickup,
  HealthPickup,
  Player,
  ShipInput,
  Bullet,
  Rocket,
  Asteroid,
  Alien,
  Particle,
  Decay,
  Wraps,
  Dead,
  CanvasSize,
  GameStateComp,
  RenderContext,
  Keys,
  RandomClock,
} from './components/index';
import { initStars } from './utils';

export const world = new World();

// ── Register all components ───────────────────────────────────────────────
world.registerComponent(Position);
world.registerComponent(Velocity);
world.registerComponent(Rotation);
world.registerComponent(AngularVelocity);
world.registerComponent(Friction);
world.registerComponent(Thrust);
world.registerComponent(Drawable);
world.registerComponent(Shape);
world.registerComponent(Arc);
world.registerComponent(FillStyle);
world.registerComponent(StrokeStyle);
world.registerComponent(Label);
world.registerComponent(Alpha);
world.registerComponent(FilledRect);
world.registerComponent(Collider);
world.registerComponent(Health);
world.registerComponent(Shield);
world.registerComponent(LaserWeapon);
world.registerComponent(AuraWeapon);
world.registerComponent(RocketWeapon);
world.registerComponent(BoomerangWeapon);
world.registerComponent(Boomerang);
world.registerComponent(DefaultWeapon);
world.registerComponent(Pickup);
world.registerComponent(HealthPickup);
world.registerComponent(Player);
world.registerComponent(ShipInput);
world.registerComponent(Bullet);
world.registerComponent(Rocket);
world.registerComponent(Asteroid);
world.registerComponent(Alien);
world.registerComponent(Particle);
world.registerComponent(Decay);
world.registerComponent(Wraps);
world.registerComponent(Dead);
world.registerComponent(CanvasSize);
world.registerComponent(GameStateComp);
world.registerComponent(RenderContext);
world.registerComponent(Keys);
world.registerComponent(RandomClock);

// Weapons are mutually exclusive
world.setExclusiveComponents(
  LaserWeapon,
  AuraWeapon,
  RocketWeapon,
  BoomerangWeapon,
  DefaultWeapon,
);

// ── Singleton resource entity ─────────────────────────────────────────────
export const resourceEntity = world
  .entity()
  .add(CanvasSize)
  .add(GameStateComp)
  .add(RenderContext)
  .add(Keys);
export const canvasSize = resourceEntity.get(CanvasSize)!;
export const gameState = resourceEntity.get(GameStateComp)!;
export const renderCtx = resourceEntity.get(RenderContext)!;
export const keys = resourceEntity.get(Keys)!;

// ── Phases ────────────────────────────────────────────────────────────────
export const updatePhase = world.addPhase('update');
export const renderPhase = world.addPhase('render');

// ── DOM refs (set before world.start()) ──────────────────────────────────
export let scoreEl: HTMLElement;
export let waveEl: HTMLElement;
export let msgEl: HTMLElement;
export let canvas: HTMLCanvasElement;

export function initDOM(
  canvasEl: HTMLCanvasElement,
  score: HTMLElement,
  wave: HTMLElement,
  msg: HTMLElement,
): void {
  canvas = canvasEl;
  scoreEl = score;
  waveEl = wave;
  msgEl = msg;

  canvasSize.width = canvasEl.width = window.innerWidth;
  canvasSize.height = canvasEl.height = window.innerHeight;

  const ctx = canvasEl.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context');
  renderCtx.ctx = ctx;
  renderCtx.stars = initStars(canvasSize.width, canvasSize.height);

  window.addEventListener('keydown', (e) => {
    keys.state[e.code] = true;
  });
  window.addEventListener('keyup', (e) => {
    keys.state[e.code] = false;
  });
  window.addEventListener('resize', () => {
    canvasSize.width = canvasEl.width = window.innerWidth;
    canvasSize.height = canvasEl.height = window.innerHeight;
    renderCtx.stars = initStars(canvasSize.width, canvasSize.height);
  });
}
