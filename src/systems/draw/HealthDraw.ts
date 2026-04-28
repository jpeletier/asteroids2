import { world, renderPhase } from '../../world';
import { Drawable, Health } from '../../components/index';
import { ENTITY_CONFIG } from '../../constants';

world.system('HealthDraw')
  .requires(Drawable, Health)
  .phase(renderPhase)
  .enter([Drawable, Health], (_e, [drawable, health]) => {
    drawable.addStatement(Health, 70,
      `if (vars.health.healthBarTimer > 0) {
         const bw = 30; const bh = 5;
         const bx = -bw / 2; const by = -${ENTITY_CONFIG.SHIP.RADIUS} - 15;
         ctx.strokeStyle = '#0f0'; ctx.lineWidth = 1; ctx.strokeRect(bx, by, bw, bh);
         const hp = vars.health.hp; const max = vars.health.maxHp;
         ctx.fillStyle = hp <= 33 ? '#f00' : hp <= 66 ? '#ff0' : '#0f0';
         ctx.fillRect(bx, by, bw * (hp / max), bh);
       }`,
      { health });
  });
