import {Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Square} from './sorting-algorithms/square';
import {Swap} from './animation/swap';
import {SortingAlgorithm} from './sorting-algorithms/sorting-algorithm';
import {SortingAlgorithmsFactory} from './sorting-algorithms/sorting-algorithms-factory';
import {
  BUBBLE_SORT,
  BUBBLE_SORT_DESC,
  INSERTION_SORT,
  INSERTION_SORT_DESC,
  SELECTION_SORT,
  SELECTION_SORT_DESC
} from './sorting-algorithms/sorting-algorithm-names';
import {Observable} from 'rxjs';
import {Action} from './action';


@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, OnDestroy {
  @Input() numbers: Observable<Array<number>>;
  @Input() action: Observable<Action>;
  @Input() sortingAlgorithmName: string;
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @Output() done: EventEmitter<number> = new EventEmitter();
  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('logBody', {static: true}) logBody: ElementRef<HTMLDivElement>;
  @ViewChild('sortingAlgorithmSelect', {static: true}) sortingAlgorithmsSelect: ElementRef<HTMLSelectElement>;
  ctx: CanvasRenderingContext2D;
  requestId;
  interval;
  executionInterval;
  squares: Array<Square> = [];
  swapAnimation: Swap = null;
  sortingAlgorithm: SortingAlgorithm = null;
  paused = false;
  sortingAlgorithmsFactory = new SortingAlgorithmsFactory();
  speed = 10;
  executionCounter = 0;
  executionTime: string = null;
  private scrollInterval;

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.fillStyle = 'red';
    this.ngZone.runOutsideAngular(() => {
      this.tick();
    });
    this.action.subscribe(action => {
      switch (action) {
        case Action.START:
          this.start();
          break;
        case Action.PAUSE:
          this.paused = true;
          this.clearIntervalsAndCancelAnimation();
          break;
        case Action.STOP:
          this.stop();
          break;
        case Action.CONTINUE:
          this.interval = setInterval(() => {
            this.tick();
          }, this.speed);
          this.setExecutionInterval();
          this.paused = false;
          break;

      }

    });
    this.numbers.subscribe(numbers => {
      this.paused = false;
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.squares = [];
      for (let i = 0; i < numbers.length; i++) {
        const square = new Square(this.ctx, numbers[i], i, 1.1);
        this.squares = this.squares.concat(square);
      }
      this.sortingAlgorithm = this.sortingAlgorithmsFactory
        .getSortingAlgorithm(this.sortingAlgorithmName, this.squares);
    });
  }

  tick() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    if (this.sortingAlgorithm != null && !this.paused) {
      if (!this.sortingAlgorithm.done) {
        this.sortingAlgorithm.animate();
      } else {
        this.clearIntervalsAndCancelAnimation();
        this.done.emit(this.executionCounter);
      }

    }
    this.squares.forEach(square => square.draw());
    this.requestId = requestAnimationFrame(() => this.tick);
  }


  ngOnDestroy() {
    clearInterval(this.interval);
    cancelAnimationFrame(this.requestId);
  }


  stop() {
    this.sortingAlgorithm = null;
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.squares = [];
    this.clearIntervalsAndCancelAnimation();
    this.executionCounter = 0;
    this.executionTime = null;
  }

  start() {
    this.executionCounter = 0;
    this.executionTime = 0 + ' seconds';
    this.interval = setInterval(() => {
      this.tick();
    }, this.speed);

    this.setExecutionInterval();

  }

  setExecutionInterval() {
    this.executionInterval = setInterval(() => {
      this.executionCounter = this.executionCounter + 1;
      this.executionTime = this.executionCounter + ' seconds';
    }, 1000);
  }

  clearIntervalsAndCancelAnimation() {
    clearInterval(this.interval);
    clearInterval(this.executionInterval);
    clearInterval(this.scrollInterval);
    cancelAnimationFrame(this.requestId);
  }
}

