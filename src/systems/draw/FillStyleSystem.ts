import { world, renderPhase } from '../../world';
import { Drawable, FillStyle } from '../../components/index';

const FILL_EXEC_KEY = {};

world
  .system('FillStyleSystem')
  .requires(Drawable, FillStyle)
  .phase(renderPhase)
  .enter([Drawable, FillStyle], (_e, [drawable, fs]) => {
    drawable.addStatement(FillStyle, 100, 'ctx.fillStyle = vars.fs.style', {
      fs,
    });
    drawable.addStatement(FILL_EXEC_KEY, 45, 'ctx.fill()', {});
  })
  .exit([Drawable], (_e, [drawable]) => {
    drawable.removeStatement(FillStyle);
    drawable.removeStatement(FILL_EXEC_KEY);
  });
