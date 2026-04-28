import { world, renderPhase } from '../../world';
import { Drawable, Arc } from '../../components/index';

world
  .system('ArcSystem')
  .requires(Drawable, Arc)
  .phase(renderPhase)
  .enter([Drawable, Arc], (_e, [drawable, arc]) => {
    drawable.addStatement(
      Arc,
      55,
      'ctx.beginPath(); ctx.arc(0, 0, vars.arc.radius, vars.arc.startAngle, vars.arc.endAngle)',
      { arc },
    );
  })
  .exit([Drawable], (_e, [drawable]) => {
    drawable.removeStatement(Arc);
  });
