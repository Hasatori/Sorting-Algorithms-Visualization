import {Square} from '../sorting-algorithms/square';
import {Direction} from '../sorting-algorithms/direction';

export class Swap {
  private second: Square;
  private first: Square;
  private bottomLimit: number;
  private topLimit: number;
  private secondHorizontalLimit: number;
  private firstHorizontalLimit: number;
  public done = false;
  private movementUnit = 0.1;
  private secondOnPlace: boolean;
  private firstOnPlace: boolean;
  private firstDone: boolean;
  private secondDone: boolean;
  private firstHorizontalDirection: Direction;
  private secondHorizontalDirection: Direction;
  private initY: number;

  constructor(first: Square, second: Square) {
    this.first = first;
    this.second = second;

    this.initY = this.first.y;
    this.topLimit = first.y - 1;
    this.firstHorizontalLimit = second.x;
    this.firstHorizontalDirection = this.first.x < this.second.x ? Direction.RIGHT : Direction.LEFT;
    this.bottomLimit = first.y + 1;
    this.secondHorizontalLimit = first.x;
    this.secondHorizontalDirection = this.second.x < this.first.x ? Direction.RIGHT : Direction.LEFT;
    this.firstOnPlace = false;
    this.secondOnPlace = false;
    this.firstDone = false;
    this.secondDone = false;
  }

  animate() {
    if (!this.firstOnPlace) {
      if (this.first.y > this.topLimit) {

        this.first.move(Direction.TOP, this.movementUnit);
      } else {
        if (!this.checkOneOnPlaceOfAnother(this.first, this.firstHorizontalLimit, this.firstHorizontalDirection)) {
          this.first.move(this.firstHorizontalDirection, this.movementUnit);
        } else {
          this.first.x = this.firstHorizontalLimit;
          this.firstOnPlace = true;
        }
      }
    } else {
      if (!(this.first.y + this.movementUnit > this.initY)) {
        this.first.move(Direction.BOTTOM, this.movementUnit);
      } else {
        this.firstDone = true;
      }
    }
    if (!this.secondOnPlace) {
      if (this.second.y < this.bottomLimit) {

        this.second.move(Direction.BOTTOM, this.movementUnit);
      } else {
        if (!this.checkOneOnPlaceOfAnother(this.second, this.secondHorizontalLimit, this.secondHorizontalDirection)) {
          this.second.move(this.secondHorizontalDirection, this.movementUnit);
        } else {
          this.second.x = this.secondHorizontalLimit;
          this.secondOnPlace = true;
        }
      }
    } else {
      if (!(this.second.y - this.movementUnit < this.initY)) {
        this.second.move(Direction.TOP, this.movementUnit);
      } else {
        this.secondDone = true;
      }
    }
    this.done = this.firstDone && this.secondDone;

  }

  checkOneOnPlaceOfAnother(first: Square, horizontalLimit: number, direction: Direction): boolean {
    switch (direction) {
      case Direction.RIGHT:
        return first.x + this.movementUnit >= horizontalLimit;
      case Direction.LEFT:
        return first.x - this.movementUnit <= horizontalLimit;
    }

  }

  getOppositeDirection(direction: Direction) {
    switch (direction) {
      case Direction.LEFT:
        return Direction.RIGHT;
      case Direction.RIGHT:
        return Direction.LEFT;

    }
  }
}


