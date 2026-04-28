import { world, renderPhase, renderCtx, canvasSize } from '../world';
import { Position, Drawable, Rotation, DrawOrder } from '../components/index';
import type { Entity } from '@vworlds/vecs';

const renderQuery = world.query('RenderQuery').requires(Position, Drawable).track();

world.system('Render')
  .phase(renderPhase)
  .run(() => {
    const ctx = renderCtx.ctx;
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

    const entities = [...renderQuery.entities] as Entity[];
    entities.sort((a, b) => {
      const za = a.get(DrawOrder)?.z ?? 0;
      const zb = b.get(DrawOrder)?.z ?? 0;
      return za - zb;
    });

    for (const e of entities) {
      const pos = e.get(Position)!;
      const drawable = e.get(Drawable)!;
      const rot = e.get(Rotation);
      ctx.save();
      ctx.translate(pos.x, pos.y);
      if (rot) ctx.rotate(rot.angle);
      drawable.draw(ctx);
      ctx.restore();
    }
  });
