import { Component } from '@vworlds/vecs';
import type { Star } from '../types';
export class RenderContext extends Component {
  ctx: CanvasRenderingContext2D | null = null;
  stars: Star[] = [];
}
