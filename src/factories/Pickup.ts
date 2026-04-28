import type { Entity } from '@vworlds/vecs';
import { world, canvasSize, gameState } from '../world';
import {
  Position, Velocity, Pickup, Collider, Drawable, Arc, StrokeStyle, Label, DrawOrder, Wraps,
  LaserWeapon, AuraWeapon, Shield, DefaultWeapon,
} from '../components/index';
import { CAT_PICKUP, CAT_PLAYER, ENTITY_CONFIG, ENTITY_CONFIG as EC, SCORING } from '../constants';

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
      const aw = picker.add(AuraWeapon);
      aw.shots = ENTITY_CONFIG.SHIP.AURA_SHOT_COUNT;
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
  const pu = e.add(Pickup);
  pu.effectFunc = makeEffectFunc(type);
  const col = e.add(Collider);
  col.radius = ENTITY_CONFIG.POWERUP.RADIUS;
  col.category = CAT_PICKUP;
  col.mask = CAT_PLAYER;
  e.add(Wraps);

  const drawable = e.add(Drawable);
  const stroke = e.add(StrokeStyle); stroke.style = cfg.color;
  const arc = e.add(Arc); arc.radius = ENTITY_CONFIG.POWERUP.RADIUS;
  const lbl = e.add(Label); lbl.text = cfg.label;
  e.add(DrawOrder).z = 50;

  drawable.addStatement(StrokeStyle, 100, 'ctx.strokeStyle = vars.stroke.style; ctx.lineWidth = 2', { stroke });
  drawable.addStatement(Arc, 50, 'ctx.beginPath(); ctx.arc(0,0,vars.arc.radius,0,Math.PI*2); ctx.stroke()', { arc });
  drawable.addStatement(Label, 60,
    `ctx.fillStyle = vars.stroke.style; ctx.font = vars.lbl.font; ctx.textAlign = vars.lbl.textAlign; ctx.textBaseline = vars.lbl.textBaseline; ctx.fillText(vars.lbl.text, 0, 0)`,
    { stroke, lbl });
}
