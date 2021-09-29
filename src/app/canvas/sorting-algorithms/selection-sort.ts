import {Square} from './square';
import {Step} from './step';
import {Swap} from '../animation/swap';
import {SortingAlgorithm} from './sorting-algorithm';

export class SelectionSort implements SortingAlgorithm {
  step: Step;
  searchSection: Array<Square>;
  done = false;
  description: string = 'The selection sort algorithm sorts an array by repeatedly finding ' +
    'the minimum element (considering ascending order) from unsorted part and putting it at the beginning. ' +
    'The algorithm maintains two subarrays in a given array.';

  constructor(squares: Array<Square>) {
    this.searchSection = Array.from(squares);
    this.step = this.createNextStep();
  }

  animate() {
    if (this.searchSection.length === 0) {
      this.done = true;
    }
    if (this.step.done) {
      this.step = this.createNextStep();
    }
    this.step.execute();
  }

  private findLowestAmong(squares: Array<Square>): Square {
    return squares.reduce((min, p) => p.numberValue < min.numberValue ? p : min, squares[0]);
  }

  private createNextStep(): Step {
    let first = this.searchSection[0];
    let toSwap = this.findLowestAmong(this.searchSection);
    while (first === toSwap && this.searchSection.length > 1) {
      this.searchSection.shift();
      first = this.searchSection[0];
      toSwap = this.findLowestAmong(this.searchSection);
    }
    const swapIndex = this.searchSection.indexOf(toSwap);
    this.searchSection[0] = toSwap;
    this.searchSection[swapIndex] = first;
    this.searchSection.shift();
    this.step = {
      done: false,
      execute() {
        if (this.swapAnimation == null) {
          this.swapAnimation = new Swap(first, toSwap);
        }
        if (!this.swapAnimation.done) {
          this.swapAnimation.animate();
        } else {
          this.done = true;
        }
      }
    };
    return this.step;
  }
}
