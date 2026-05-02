import { Component } from '@vworlds/vecs';

export class RandomClock extends Component {
  minWait = 0;
  maxWait = 0;
  effectFunc: () => void = () => {};
  nextTick = 0;
}
