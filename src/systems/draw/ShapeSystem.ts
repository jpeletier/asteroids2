import { world, renderPhase } from '../../world';
import { Drawable, Shape } from '../../components/index';

world.system('ShapeSystem')
  .requires(Drawable, Shape)
  .phase(renderPhase)
  .enter([Drawable, Shape], (_e, [drawable, shape]) => {
    drawable.addStatement(Shape, 55,
      `ctx.beginPath();
       const pts = vars.shape.points;
       if (pts.length > 0) { ctx.moveTo(pts[0].x, pts[0].y); }
       for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
       ctx.closePath()`,
      { shape });
  })
  .exit([Drawable], (_e, [drawable]) => {
    drawable.removeStatement(Shape);
  });
