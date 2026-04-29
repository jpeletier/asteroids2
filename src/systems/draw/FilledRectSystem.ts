import { world, renderPhase } from '../../world';
import { Drawable, FilledRect } from '../../components/index';

world
  .system('FilledRectSystem')
  .requires(Drawable, FilledRect)
  .phase(renderPhase)
  .enter([Drawable, FilledRect], (_e, [drawable, rect]) => {
    drawable.addStatement(FilledRect, 50, (ctx) => {
      ctx.fillRect(-rect.width / 2, -rect.height / 2, rect.width, rect.height);
    });
  })
  .exit([Drawable], (_e, [drawable]) => {
    drawable.removeStatement(FilledRect);
  });
