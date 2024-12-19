import { Component, ElementRef, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, map } from 'rxjs/operators';
import { SignalRService } from '../signalr-client/signal-r-client.component';
import { DrawData } from '../models/draw-data-mode';
import { ActivatedRoute } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  @ViewChild('canvas')
  private canvas!: ElementRef<HTMLCanvasElement>;
  private canvasRenderingContext!: CanvasRenderingContext2D;
  userID: string;
  lobbyID: string;
  playerList: string[] = [];
  randomWord: string | null = null;

  constructor(
    private signalRService: SignalRService,
    private route: ActivatedRoute,
  ) {
    this.userID = signalRService.userId;
    this.lobbyID = '';

    // Subscribe to the randomWord property in the service
    /*this.signalRService.getRandomWordObservable().subscribe((word) => {
      this.randomWord = word;
    });*/
  }

  ngOnInit(): void {
    this.signalRService.getPlayerListObservable().subscribe((players) => {
      this.playerList = players;
    });

    this.signalRService.onRandomWord((word: string) => {
      console.log('Received Random Word:', word);
      this.randomWord = word;
    });
  }

  ngAfterViewInit() {
    // Beskriver propertionerne for canvas elementet
    this.canvas.nativeElement.width = 1024;
    this.canvas.nativeElement.height = 576;
    this.canvasRenderingContext = this.canvas.nativeElement.getContext('2d')!;

    // Beskriver de events vi ønsker at subscribe til. Her er det når man holder trykker museknappen ned, flytter musen, og slipper museknappen igen.
    const mouseDownStream = fromEvent<MouseEvent>(
      this.canvas.nativeElement,
      'mousedown',
    );
    const mouseMoveStream = fromEvent<MouseEvent>(
      this.canvas.nativeElement,
      'mousemove',
    );
    const mouseUpStream = fromEvent<MouseEvent>(window, 'mouseup');

    // SwitchMap anvendes til at skifte fra en stream af MouseDown events til MouseMove events, når et MouseDown event (det første) sker.
    const drawStream = mouseDownStream.pipe(
      switchMap((startEvent: MouseEvent) => {
        // Anvendes til at hente canvas (DOMrect) relativ til viewport, så X og Y koordinater er korrekte
        const rect = this.canvas.nativeElement.getBoundingClientRect();
        // Beskriver de koordinater hvor musemarkøren starter
        const startX = startEvent.clientX - rect.left;
        const startY = startEvent.clientY - rect.top;

        // Temp variabler til at gemme tidligere position af musemarkøren
        let prevX = startX;
        let prevY = startY;

        return mouseMoveStream.pipe(
          map((moveEvent: MouseEvent) => {
            // Sørger for at vi konverterer koordinater fra viewport (global) til to koordinater relativt til canvas
            const x = moveEvent.clientX - rect.left;
            const y = moveEvent.clientY - rect.top;

            // Tegner på canvas element ud fra X og Y koordinater
            const drawData = new DrawData(prevX, prevY, x, y);

            // Opdaterer koordinater for tidligere position af musen
            prevX = x;
            prevY = y;

            return drawData;
          }),
          // Værdier bliver emittet indtil et MouseUpEvent sker. Dvs. at stream med MouseMove events stopper når man slipper museknappen.
          takeUntil(mouseUpStream),
        );
      }),
    );

    // Lytter til DrawStream og eksekverer et callback når der sker et event
    drawStream.subscribe((drawData: DrawData) => {
      this.drawOnCanvas(drawData);
      // Sender DrawData til SignalR servicen som kan videresende det til backenden
      this.signalRService.sendDrawData(drawData);
    });

    this.signalRService.onDraw((data) => {
      this.drawOnCanvas(data);
    });
  }

  private drawOnCanvas(data: {
    x: number;
    y: number;
    startX: number;
    startY: number;
  }) {
    this.canvasRenderingContext.beginPath();
    this.canvasRenderingContext.moveTo(data.startX, data.startY);
    this.canvasRenderingContext.lineTo(data.x, data.y);
    this.canvasRenderingContext.stroke();
  }

  clearCanvas() {
    const canvas = this.canvas.nativeElement;
    const canvasContext = canvas.getContext('2d');
    if (canvasContext) {
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
}
