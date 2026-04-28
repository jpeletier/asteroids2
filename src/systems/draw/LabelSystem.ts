import { world, renderPhase } from '../../world';
import { Drawable, Label } from '../../components/index';

world.system('LabelSystem')
  .requires(Drawable, Label)
  .phase(renderPhase)
  .enter([Drawable, Label], (_e, [drawable, lbl]) => {
    drawable.addStatement(Label, 60,
      `ctx.fillStyle = vars.lbl.color;
       ctx.font = vars.lbl.font;
       ctx.textAlign = vars.lbl.textAlign;
       ctx.textBaseline = vars.lbl.textBaseline;
       ctx.fillText(vars.lbl.text, 0, 0)`,
      { lbl });
  })
  .exit([Drawable], (_e, [drawable]) => {
    drawable.removeStatement(Label);
  });
