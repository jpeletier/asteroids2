import { world, renderPhase } from '../../world';
import { Drawable, Shield } from '../../components/index';
import { ENTITY_CONFIG } from '../../constants';

world
  .system('ShieldDraw')
  .requires(Drawable, Shield)
  .phase(renderPhase)
  .enter([Drawable, Shield], (_e, [drawable, shield]) => {
    drawable.addStatement(
      Shield,
      150,
      `const progress = vars.shield.shieldTime / ${ENTITY_CONFIG.SHIP.SHIELD_DURATION};
       let r, g;
       if (progress >= 0.5) { const t = (1 - progress) * 2; r = Math.floor(255 * t); g = 255; }
       else { const t = (0.5 - progress) * 2; r = 255; g = Math.floor(255 * (1 - t)); }
       ctx.beginPath(); ctx.strokeStyle = 'rgb(' + r + ',' + g + ',0)';
       ctx.lineWidth = 3; ctx.arc(0, 0, ${ENTITY_CONFIG.SHIP.RADIUS + 8}, 0, Math.PI * 2); ctx.stroke();`,
      { shield },
    );
  })
  .exit([Drawable], (_e, [drawable]) => {
    drawable.removeStatement(Shield);
  });
