import {Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Square} from './square';
import {Swap} from './animation/swap';
import {SortingAlgorithm} from './sorting-algorithms/sorting-algorithm';
import {SortingAlgorithmsFactory} from './sorting-algorithms/sorting-algorithms-factory';
import {BUBBLE_SORT, INSERTION_SORT, MERGE_SORT, SELECTION_SORT} from './sorting-algorithms/sorting-algorithm-names';
import {Observable} from 'rxjs';
import {Action} from '../action';


@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, OnDestroy {
  @Input() numbers: Observable<Array<number>>;
  @Input() action: Observable<Action>;
  @Input() canvasSize: number;
  @Input() animationSpeed: Observable<number>;
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('sortingAlgorithmSelect', {static: true}) sortingAlgorithmsSelect: ElementRef<HTMLSelectElement>;
  ctx: CanvasRenderingContext2D;
  requestId;
  interval;
  private counter = 10;
  squares: Array<Square> = [];
  swapAnimation: Swap = null;

  sortingAlgorithm: SortingAlgorithm = null;
  paused = false;
  sortingAlgorithmsFactory = new SortingAlgorithmsFactory();
  speed: number;

  constructor(private ngZone: NgZone) {

  }

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
          clearInterval(this.interval);
          cancelAnimationFrame(this.requestId);
          break;
        case Action.STOP:
          this.stop();
          break;
        case Action.CONTINUE:
          this.interval = setInterval(() => {
            this.tick();
          }, this.speed);
          this.paused = false;
          break;

      }

    });
    this.numbers.subscribe(numbers => {
      this.paused = false;
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.squares = [];
      for (let i = 0; i < numbers.length; i++) {
        const square = new Square(this.ctx, numbers[i], i + 10, 6);
        this.squares = this.squares.concat(square);
      }
    });
    this.animationSpeed.subscribe(speed => {
      this.speed = speed;
      clearInterval(this.interval);
      cancelAnimationFrame(this.requestId);
      if (this.sortingAlgorithm !== null && !this.paused) {
        this.interval = setInterval(() => {
          this.tick();
        }, speed);
      }
    });
  }

  tick() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    if (this.sortingAlgorithm != null && !this.paused) {
      if (!this.sortingAlgorithm.done) {
        this.sortingAlgorithm.animate();
      } else {
        this.sortingAlgorithm = null;
        clearInterval(this.interval);
        cancelAnimationFrame(this.requestId);
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
    clearInterval(this.interval);
    cancelAnimationFrame(this.requestId);
  }

  start() {
    this.interval = setInterval(() => {
      this.tick();
    }, this.speed);
    this.sortingAlgorithm = this.sortingAlgorithmsFactory
      .getSortingAlgorithm(this.sortingAlgorithmsSelect.nativeElement.value, this.squares);
  }

  bubbleSortName(): string {
    return BUBBLE_SORT;
  }

  selectionSortName(): string {
    return SELECTION_SORT;
  }

  insertionSortName(): string {
    return INSERTION_SORT;
  }

  mergeSortName(): string {
    return MERGE_SORT;
  }

}
