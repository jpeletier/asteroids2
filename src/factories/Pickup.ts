import type { Entity } from '@vworlds/vecs';
import { world, canvasSize, gameState } from '../world';
import {
  Position,
  Velocity,
  Pickup,
  Collider,
  Drawable,
  Arc,
  StrokeStyle,
  Label,
  Wraps,
  LaserWeapon,
  AuraWeapon,
  Shield,
} from '../components/index';
import { CAT_PICKUP, CAT_PLAYER, ENTITY_CONFIG, SCORING } from '../constants';

type PickupType = 'shield' | 'laser' | 'aura';

const PICKUP_CONFIG: Record<PickupType, { color: string; label: string }> = {
  shield: { color: '#0f0', label: 'S' },
  laser: { color: '#f00', label: 'L' },
  aura: { color: '#3af', label: 'A' },
};

function makeEffectFunc(type: PickupType): (picker: Entity) => void {
  return (picker: Entity) => {
    if (type === 'shield') {
      const sh = picker.get(Shield) ?? picker.add(Shield);
      sh.shieldTime = ENTITY_CONFIG.SHIP.SHIELD_DURATION;
      gameState.score += SCORING.SHIELD;
      gameState.shieldPickupExists = false;
    } else if (type === 'laser') {
      const lw = picker.add(LaserWeapon);
      lw.shots = ENTITY_CONFIG.SHIP.LASER_SHOT_COUNT;
      lw.firing = false;
      lw.timer = 0;
      gameState.score += SCORING.LASER;
      gameState.laserPickupExists = false;
    } else {
      picker.add(AuraWeapon).shots = ENTITY_CONFIG.SHIP.AURA_SHOT_COUNT;
      gameState.score += SCORING.AURA;
      gameState.auraPickupExists = false;
    }
  };
}

export function createPickup(type: PickupType): void {
  const cfg = PICKUP_CONFIG[type];
  const e = world.createEntity();
  const pos = e.add(Position);
  pos.x = Math.random() * canvasSize.width;
  pos.y = Math.random() * canvasSize.height;
  const vel = e.add(Velocity);
  vel.vx = (Math.random() - 0.5) * ENTITY_CONFIG.POWERUP.SPEED_FACTOR;
  vel.vy = (Math.random() - 0.5) * ENTITY_CONFIG.POWERUP.SPEED_FACTOR;
  e.add(Pickup).effectFunc = makeEffectFunc(type);
  const col = e.add(Collider);
  col.radius = ENTITY_CONFIG.POWERUP.RADIUS;
  col.category = CAT_PICKUP;
  col.mask = CAT_PLAYER;
  e.add(Drawable).zIndex = 50;
  e.add(Wraps);
  const stroke = e.add(StrokeStyle);
  stroke.style = cfg.color;
  stroke.lineWidth = 2;
  e.add(Arc).radius = ENTITY_CONFIG.POWERUP.RADIUS;
  const lbl = e.add(Label);
  lbl.text = cfg.label;
  lbl.color = cfg.color;
}
