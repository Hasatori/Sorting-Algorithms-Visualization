import {NgZone} from '@angular/core';
import {Direction} from './direction';

export class Square {
  private strokeColor = '#433131';
  private fontColor = '#FCFAE4';
  private backgroundColor = '#75BEEE';
  x;
  y;
  private z = 30 ;
  numberValue: number;

  constructor(private ctx: CanvasRenderingContext2D, numberValue: number, x: number, y: number) {
    this.y = y;
    this.x = x;
    this.numberValue = numberValue;
    this.draw();
  }

  move(direction: Direction, by: number) {
    switch (direction) {
      case Direction.BOTTOM:
        this.y += by;
        break;
      case Direction.LEFT:
        this.x -= by;
        break;
      case Direction.RIGHT:
        this.x += by;
        break;
      case Direction.TOP:
        this.y -= by;
        break;
    }
  }


  public draw() {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(this.z * this.x, this.z * this.y, this.z, this.z);
    this.ctx.font = 'bold 10px Georgia';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = this.fontColor;
    this.ctx.fillText(this.numberValue.toString(), this.z * this.x + this.z / 2, this.z * this.y + this.z / 2);
    this.ctx.strokeStyle = this.strokeColor;
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(this.z * this.x, this.z * this.y, this.z, this.z);
  }
}
