import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Action} from './canvas/action';
import {isUndefined} from 'util';
import {BUBBLE_SORT, INSERTION_SORT, SELECTION_SORT} from './canvas/sorting-algorithms/sorting-algorithm-names';
import {SortingAlgorithmsFactory} from './canvas/sorting-algorithms/sorting-algorithms-factory';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  canvases: Array<Canvas> = [];
  data: Observable<Array<number>>;
  dataSubscribers = [];
  actionSubscribers = [];
  action: Observable<Action>;
  numbers = [];
  animationSpeedSubscribers = [];
  sortingStarted = false;
  sortingPaused = false;
  doneCanvases: Array<Canvas> = [];
  sortingAlgorithmsFactory = new SortingAlgorithmsFactory();
  sortingAlgorithmsNames: Array<string> = [BUBBLE_SORT, INSERTION_SORT, SELECTION_SORT];
  allDone = false;

  constructor() {
    this.data = new Observable((subscriber => {
      this.dataSubscribers.push(subscriber);
      setTimeout(() => {
        subscriber.next(this.numbers);
      }, 1);

    }));
    this.action = new Observable((subscriber => {
      this.actionSubscribers.push(subscriber);
    }));
  }

  startSorting() {
    this.canvases.forEach(canvas => {
      canvas.place = -1;
      canvas.executionTime = -1;
      canvas.done = false;
    });
    this.doneCanvases = [];
    this.sortingStarted = true;
    this.actionSubscribers.forEach(subscriber => {
      subscriber.next(Action.START);
    });
  }

  pauseSorting() {
    this.sortingPaused = true;
    this.actionSubscribers.forEach(subscriber => {
      subscriber.next(Action.PAUSE);
    });
  }

  stopSorting() {
    this.sortingStarted = false;
    this.sortingPaused = false;
    this.numbers = [];
    this.doneCanvases = [];
    this.actionSubscribers.forEach(subscriber => {
      subscriber.next(Action.STOP);
    });
    this.generateData('10');
  }

  continueSorting() {
    this.sortingPaused = false;
    this.actionSubscribers.forEach(subscriber => {
      subscriber.next(Action.CONTINUE);
    });
  }

  restartSorting() {
    this.allDone = false;
    this.canvases = [];
    this.sortingAlgorithmsNames.forEach((sortingAlgorithmsName) => {
      const canvas = new Canvas();
      canvas.sortingAlgorithmName = sortingAlgorithmsName;
      this.canvases.push(canvas);
    });
    this.generateData('10');
  }

  generateData(count: string) {
    const size = Number(count);
    this.numbers = [];
    for (let i = 0; i < size; i++) {
      this.numbers = this.numbers.concat(Math.floor(Math.random() * Math.floor(1000)));
    }
    this.dataSubscribers.forEach(subscriber => {
      subscriber.next(this.numbers);
    });
  }

  ngOnInit(): void {
    this.restartSorting();
  }

  done(canvas: Canvas, executionTime: number) {
    canvas.done = true;
    canvas.executionTime = executionTime;
    const lastDoneCanvas = this.doneCanvases[this.doneCanvases.length - 1];
    if (isUndefined(lastDoneCanvas)) {
      canvas.place = 1;
    } else if (canvas.executionTime === lastDoneCanvas.executionTime) {
      canvas.place = lastDoneCanvas.place;
    } else {
      canvas.place = lastDoneCanvas.place + 1;
    }
    this.doneCanvases.push(canvas);
    if (this.doneCanvases.length === this.canvases.length) {
      this.sortingStarted = false;
      this.sortingPaused = false;
      this.numbers = [];
      this.allDone = true;
    }
  }
}

export class Canvas {
  done = false;
  executionTime = -1;
  place = -1;
  sortingAlgorithmName: string;
}
