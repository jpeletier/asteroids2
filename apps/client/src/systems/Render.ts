import { world, renderPhase, renderCtx, canvasSize } from '../world';
import { Position, Drawable, Rotation } from '../components/index';

let ctx: CanvasRenderingContext2D | null = null;

world
  .system('Render')
  .requires(Position, Drawable)
  .phase(renderPhase)
  .sort([Drawable], (entityA, [a], entityB, [b]) => {
    return a.zIndex !== b.zIndex
      ? a.zIndex - b.zIndex
      : entityA.eid - entityB.eid;
  })
  .run(() => {
    ctx = renderCtx.ctx ?? null;
    if (!ctx) return;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

    ctx.fillStyle = 'white';
    for (const star of renderCtx.stars) {
      ctx.globalAlpha = star.opacity;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  })
  .each([Position, Drawable], (e, [pos, drawable]) => {
    if (!ctx) return;
    const rot = e.get(Rotation);
    ctx.save();
    ctx.translate(pos.x, pos.y);
    if (rot) ctx.rotate(rot.angle);
    drawable.draw(ctx);
    ctx.restore();
  });
