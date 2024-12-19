export class DrawData {
  startX: number;
  startY: number;
  x: number;
  y: number;
  color: string = 'black';
  thickness: number = 2;

  constructor(
    startX: number,
    startY: number,
    x: number,
    y: number,
    color: string = 'black',
    thickness: number = 2,
  ) {
    this.startX = startX;
    this.startY = startY;
    this.x = x;
    this.y = y;
    this.color = color;
    this.thickness = thickness;
  }
}
