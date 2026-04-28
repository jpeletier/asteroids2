import { world, renderPhase } from '../../world';
import { Drawable, LaserWeapon } from '../../components/index';

world
  .system('LaserBeamDraw')
  .requires(Drawable, LaserWeapon)
  .phase(renderPhase)
  .enter([Drawable, LaserWeapon], (_e, [drawable, lw]) => {
    // Render is called after ctx.rotate(angle), so +x is forward
    drawable.addStatement(
      LaserWeapon,
      160,
      `if (vars.lw.firing) {
         ctx.beginPath(); ctx.strokeStyle = '#ff0000'; ctx.lineWidth = 4;
         ctx.moveTo(0, 0); ctx.lineTo(1000, 0); ctx.stroke();
       }`,
      { lw },
    );
  })
  .exit([Drawable], (_e, [drawable]) => {
    drawable.removeStatement(LaserWeapon);
  });
