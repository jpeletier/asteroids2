import { world, renderPhase } from '../../world';
import { Drawable, FilledRect } from '../../components/index';

world.system('FilledRectSystem')
  .requires(Drawable, FilledRect)
  .phase(renderPhase)
  .enter([Drawable, FilledRect], (_e, [drawable, rect]) => {
    drawable.addStatement(FilledRect, 50,
      'ctx.fillRect(-vars.rect.width / 2, -vars.rect.height / 2, vars.rect.width, vars.rect.height)',
      { rect });
  })
  .exit([Drawable], (_e, [drawable]) => {
    drawable.removeStatement(FilledRect);
  });
