import { world, renderPhase } from '../../world';
import { Drawable, StrokeStyle } from '../../components/index';

const STROKE_EXEC_KEY = {};

world.system('StrokeStyleSystem')
  .requires(Drawable, StrokeStyle)
  .phase(renderPhase)
  .enter([Drawable, StrokeStyle], (_e, [drawable, ss]) => {
    drawable.addStatement(StrokeStyle, 100,
      'ctx.strokeStyle = vars.ss.style; ctx.lineWidth = vars.ss.lineWidth',
      { ss });
    drawable.addStatement(STROKE_EXEC_KEY, 45, 'ctx.stroke()', {});
  })
  .exit([Drawable], (_e, [drawable]) => {
    drawable.removeStatement(StrokeStyle);
    drawable.removeStatement(STROKE_EXEC_KEY);
  });
