import { world, renderPhase } from '../../world';
import { Drawable, Shape } from '../../components/index';

world
  .system('ShapeSystem')
  .requires(Drawable, Shape)
  .phase(renderPhase)
  .enter([Drawable, Shape], (_e, [drawable, shape]) => {
    drawable.addStatement(Shape, 55, (ctx) => {
      ctx.beginPath();
      const pts = shape.points;
      if (pts.length > 0) {
        ctx.moveTo(pts[0]!.x, pts[0]!.y);
      }
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i]!.x, pts[i]!.y);
      ctx.closePath();
    });
  })
  .exit([Drawable], (_e, [drawable]) => {
    drawable.removeStatement(Shape);
  });
