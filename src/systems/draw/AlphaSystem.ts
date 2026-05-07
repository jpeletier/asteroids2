import { world, renderPhase } from '../../world';
import { Drawable, Alpha } from '../../components/index';

const RESTORE_KEY = {};

world
  .system('AlphaSystem')
  .requires(Drawable, Alpha)
  .phase(renderPhase)
  .enter([Drawable, Alpha], (_e, [drawable, alpha]) => {
    let oldAlpha = 1;
    drawable.addStatement(Alpha, 200, (ctx) => {
      oldAlpha = ctx.globalAlpha;
      ctx.globalAlpha = alpha.value;
    });
    drawable.addStatement(RESTORE_KEY, -100, (ctx) => {
      ctx.globalAlpha = oldAlpha;
    });
  })
  .exit([Drawable], (_e, [drawable]) => {
    drawable.removeStatement(Alpha);
    drawable.removeStatement(RESTORE_KEY);
  });
