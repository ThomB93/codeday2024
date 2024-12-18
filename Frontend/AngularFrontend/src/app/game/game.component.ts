import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  @ViewChild('canvas')
  private canvas!: ElementRef<HTMLCanvasElement>;
  private context!: CanvasRenderingContext2D;

  ngAfterViewInit() {
    this.canvas.nativeElement.width = 1024;
    this.canvas.nativeElement.height = 576;
    this.context = this.canvas.nativeElement.getContext('2d')!;

    this.drawSomething();
  }

  private drawSomething() {
    this.context.lineWidth = 10;
    this.context.strokeStyle = 'blue';

    const rectSize = 100;
    const p1 = { x: 512 - rectSize / 2, y: 288 - rectSize / 2 };
    const p2 = { x: 512 + rectSize / 2, y: 288 - rectSize / 2 };
    const p3 = { x: 512 + rectSize / 2, y: 288 + rectSize / 2 };
    const p4 = { x: 512 - rectSize / 2, y: 288 + rectSize / 2 };

    this.context.beginPath();
    this.context.moveTo(p1.x, p1.y);
    this.context.lineTo(p2.x, p2.y);
    this.context.stroke();

    this.context.beginPath();
    this.context.lineWidth = 10; // Has to come after beginPath() and before stroke()
    this.context.moveTo(p2.x, p2.y);
    this.context.lineTo(p3.x, p3.y);
    this.context.strokeStyle = 'green'; // Has to come after beginPath() and before stroke()
    this.context.stroke();

    this.context.beginPath();
    this.context.moveTo(p3.x, p3.y);
    this.context.lineTo(p4.x, p4.y);
    this.context.lineTo(p1.x, p1.y); // Multiple lines in a path will be connected
    this.context.strokeStyle = 'red';
    this.context.stroke();
  }
}
