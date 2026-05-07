import { Component } from '@vworlds/vecs';

export class Networked extends Component {
  id = 0;
}

export class Position extends Component {
  x = 0;
  y = 0;
}

export class Rotation extends Component {
  angle = 0;
}

export class Drawable extends Component {
  zIndex = 0;
}

export class Arc extends Component {
  radius = 10;
  startAngle = 0;
  endAngle = Math.PI * 2;
}

export class Shape extends Component {
  points: { x: number; y: number }[] = [];
}

export class StrokeStyle extends Component {
  style = '#fff';
  lineWidth = 2;
}

export class FillStyle extends Component {
  style = '#fff';
}

export class FilledRect extends Component {
  width = 2;
  height = 2;
}
