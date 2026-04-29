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
      picker.set(Shield, { shieldTime: ENTITY_CONFIG.SHIP.SHIELD_DURATION });
      gameState.score += SCORING.SHIELD;
      gameState.shieldPickupExists = false;
    } else if (type === 'laser') {
      picker.set(LaserWeapon, {
        shots: ENTITY_CONFIG.SHIP.LASER_SHOT_COUNT,
        firing: false,
        timer: 0,
      });
      gameState.score += SCORING.LASER;
      gameState.laserPickupExists = false;
    } else {
      picker.set(AuraWeapon, { shots: ENTITY_CONFIG.SHIP.AURA_SHOT_COUNT });
      gameState.score += SCORING.AURA;
      gameState.auraPickupExists = false;
    }
  };
}

export function createPickup(type: PickupType): void {
  const cfg = PICKUP_CONFIG[type];
  const e = world.createEntity();
  e.set(Position, {
    x: Math.random() * canvasSize.width,
    y: Math.random() * canvasSize.height,
  });
  e.set(Velocity, {
    vx: (Math.random() - 0.5) * ENTITY_CONFIG.POWERUP.SPEED_FACTOR,
    vy: (Math.random() - 0.5) * ENTITY_CONFIG.POWERUP.SPEED_FACTOR,
  });
  e.set(Pickup, { effectFunc: makeEffectFunc(type) });
  e.set(Collider, {
    radius: ENTITY_CONFIG.POWERUP.RADIUS,
    category: CAT_PICKUP,
    mask: CAT_PLAYER,
  });
  e.set(Drawable, { zIndex: 50 });
  e.add(Wraps);
  e.set(StrokeStyle, { style: cfg.color, lineWidth: 2 });
  e.set(Arc, { radius: ENTITY_CONFIG.POWERUP.RADIUS });
  e.set(Label, { text: cfg.label, color: cfg.color });
}
