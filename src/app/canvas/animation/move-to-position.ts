import {Square} from '../sorting-algorithms/square';
import {Direction} from '../sorting-algorithms/direction';

export class MoveToPosition {

  private squareToMove: Square;
  private replacedSquare: Square;
  private squaresBetween: Array<Square>;
  private squareHorizontalDirection: Direction;
  private restOfTheSquaresHorizontalDirection: Direction;
  private movementUnit = 0.1;
  private movedSquareTopLimit: number;
  private movedSquareHorizontalLimit: number;
  private squaresBetweenHorizontalLimit: Map<Square, number>;
  private squaresBetweenOnPlace = false;
  private squaresOnPlaceCount = 0;
  private movedSquareOnPlace = false;
  done = false;
  private initY: number;

  constructor(squareToMove: Square, replacedSquare: Square, squaresBetweenInclusiveReplaced: Array<Square>) {
    this.squareToMove = squareToMove;
    this.replacedSquare = replacedSquare;
    this.squaresBetween = squaresBetweenInclusiveReplaced;
    this.squareHorizontalDirection = this.squareToMove.x < this.replacedSquare.x ? Direction.RIGHT : Direction.LEFT;
    this.restOfTheSquaresHorizontalDirection = this.getOppositeDirection(this.squareHorizontalDirection);
    this.movedSquareTopLimit = squareToMove.y - 1;
    this.initY = squareToMove.y;
    this.movedSquareHorizontalLimit = this.replacedSquare.x;
    this.squaresBetweenHorizontalLimit = new Map<Square, number>();
    const squaresBetweenHorizontalLimitVal = squareToMove.x > replacedSquare.x ? 1 : -1;
    squaresBetweenInclusiveReplaced.forEach(square => {
      this.squaresBetweenHorizontalLimit.set(square, square.x + squaresBetweenHorizontalLimitVal);
    });
  }

  animate() {
    if (!this.movedSquareOnPlace) {
      if (this.squaresOnPlaceCount < this.squaresBetweenHorizontalLimit.size) {
        if (this.squareToMove.y > this.movedSquareTopLimit) {
          this.squareToMove.move(Direction.TOP, this.movementUnit);
        } else {
          let limit;
          let key: Square;
          for (key of Array.from(this.squaresBetweenHorizontalLimit.keys())) {
            limit = this.squaresBetweenHorizontalLimit.get(key);
            if (!this.checkOneOnPlaceOfAnother(key, limit, this.restOfTheSquaresHorizontalDirection)) {
              key.move(this.restOfTheSquaresHorizontalDirection, this.movementUnit);
            } else {
              key.x = limit;
              this.squaresOnPlaceCount++;
            }
          }
        }
      } else {
        if (!this.checkOneOnPlaceOfAnother(this.squareToMove, this.movedSquareHorizontalLimit, this.squareHorizontalDirection)) {
          this.squareToMove.move(this.squareHorizontalDirection, this.movementUnit);
        } else {
          this.squareToMove.x = this.movedSquareHorizontalLimit;
          this.movedSquareOnPlace = true;
        }
      }
    } else {
      if (this.squareToMove.y < this.initY) {
        this.squareToMove.move(Direction.BOTTOM, this.movementUnit);
      } else {
        this.done = true;
      }
    }
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
