import { world, renderPhase } from '../../world';
import { Drawable, Alpha } from '../../components/index';

const RESTORE_KEY = {};

world.system('AlphaSystem')
  .requires(Drawable, Alpha)
  .phase(renderPhase)
  .enter([Drawable, Alpha], (_e, [drawable, alpha]) => {
    drawable.addStatement(Alpha, 200,
      'vars.old_alpha = ctx.globalAlpha; ctx.globalAlpha = vars.alpha.value',
      { alpha });
    drawable.addStatement(RESTORE_KEY, -100,
      'ctx.globalAlpha = vars.old_alpha',
      {});
  })
  .exit([Drawable], (_e, [drawable]) => {
    drawable.removeStatement(Alpha);
    drawable.removeStatement(RESTORE_KEY);
  });
