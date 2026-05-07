import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { world, renderPhase } from '../../../src/world';
import '../../../src/systems/draw/LabelSystem';
import { Drawable, Label } from '../../../src/components/index';

beforeAll(() => world.start());
afterEach(() => world.clearAllEntities());

function tick() {
  world.beginFrame(16);
  world.runPhase(renderPhase, Date.now(), 16);
  world.endFrame();
}

describe('LabelSystem', () => {
  it('adds Label draw statement when entity gains Drawable + Label', () => {
    const e = world
      .entity()
      .add(Drawable)
      .set(Label, {
        text: 'Hi',
        font: 'bold 14px Arial',
        textAlign: 'center',
        textBaseline: 'middle',
        color: '#fff',
      });
    tick();
    const keys = e.get(Drawable)!._statements.map((s) => s.key);
    expect(keys).toContain(Label);
  });

  it('label statement sets ctx properties and calls fillText', () => {
    const e = world
      .entity()
      .add(Drawable)
      .set(Label, {
        text: 'Score: 100',
        font: 'bold 16px sans-serif',
        textAlign: 'left',
        textBaseline: 'top',
        color: '#ff0',
      });
    tick();
    const stmt = e.get(Drawable)!._statements.find((s) => s.key === Label)!;
    const ctx = {
      fillStyle: '',
      font: '',
      textAlign: '' as CanvasTextAlign,
      textBaseline: '' as CanvasTextBaseline,
      fillText: vi.fn(),
    } as unknown as CanvasRenderingContext2D;
    stmt.fn(ctx);
    expect(ctx.fillStyle).toBe('#ff0');
    expect(ctx.font).toBe('bold 16px sans-serif');
    expect(ctx.textAlign).toBe('left');
    expect(ctx.textBaseline).toBe('top');
    expect(ctx.fillText).toHaveBeenCalledWith('Score: 100', 0, 0);
  });

  it('removes label statement when Label is removed', () => {
    const e = world
      .entity()
      .add(Drawable)
      .set(Label, {
        text: 'test',
        font: '',
        textAlign: 'center',
        textBaseline: 'middle',
        color: '#fff',
      });
    tick();
    e.remove(Label);
    tick();
    const keys = e.get(Drawable)!._statements.map((s) => s.key);
    expect(keys).not.toContain(Label);
  });
});
