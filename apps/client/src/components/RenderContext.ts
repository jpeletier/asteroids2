import type { Star } from '../types';
export class RenderContext {
  ctx: CanvasRenderingContext2D | null = null;
  stars: Star[] = [];
}
