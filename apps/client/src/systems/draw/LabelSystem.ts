import { world, renderPhase } from '../../world';
import { Drawable, Label } from '../../components/index';

world
  .system('LabelSystem')
  .requires(Drawable, Label)
  .phase(renderPhase)
  .enter([Drawable, Label], (_e, [drawable, lbl]) => {
    drawable.addStatement(Label, 60, (ctx) => {
      ctx.fillStyle = lbl.color;
      ctx.font = lbl.font;
      ctx.textAlign = lbl.textAlign;
      ctx.textBaseline = lbl.textBaseline;
      ctx.fillText(lbl.text, 0, 0);
    });
  })
  .exit([Drawable], (_e, [drawable]) => {
    drawable.removeStatement(Label);
  });
