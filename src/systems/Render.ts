import { world, renderPhase, renderCtx, canvasSize } from '../world';
import { Position, Drawable, Rotation, DrawOrder } from '../components/index';

let _ctx: CanvasRenderingContext2D | null = null;

const renderSystem = world.system('Render')
  .requires(Position, Drawable)
  .phase(renderPhase)
  .track();

renderSystem.run(() => {
  _ctx = renderCtx.ctx ?? null;
  if (!_ctx) return;

  _ctx.fillStyle = 'black';
  _ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

  _ctx.fillStyle = 'white';
  for (const star of renderCtx.stars) {
    _ctx.globalAlpha = star.opacity;
    _ctx.beginPath();
    _ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    _ctx.fill();
  }
  _ctx.globalAlpha = 1.0;

  const sorted = [...renderSystem.entities].sort(
    (a, b) => (a.get(DrawOrder)?.z ?? 0) - (b.get(DrawOrder)?.z ?? 0)
  );

  for (const e of sorted) {
    const pos = e.get(Position)!;
    const drawable = e.get(Drawable)!;
    const rot = e.get(Rotation);
    _ctx.save();
    _ctx.translate(pos.x, pos.y);
    if (rot) _ctx.rotate(rot.angle);
    drawable.draw(_ctx);
    _ctx.restore();
  }
});
