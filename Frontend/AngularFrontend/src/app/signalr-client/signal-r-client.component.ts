import { Injectable } from '@angular/core';
//import { FormsModule } from '@angular/forms';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, filter, switchMap, take, tap } from 'rxjs';
//import { AsyncPipe } from '@angular/common';
import { DrawData } from '../models/draw-data-mode';
//import { RandomWordService } from '../random-word-service'; // Import the random word service

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private connection!: HubConnection;
  private playerListSubject: BehaviorSubject<string[]> = new BehaviorSubject<
    string[]
  >([]);
  userId!: string;
  userName!: string;
  inputText!: string;
  isConnectionEstablished = new BehaviorSubject<boolean>(false);
  messages: string[] = [];

  randomWord: string | null = null;

  constructor() {
    // Just generate a random user ID for this example. Possibly add real authentication if you have the time.
    this.userId = this.generateUserId();

    // Absolute URL is necessary when serving with ng serve/npm run start.
    this.connection = new HubConnectionBuilder()
      .withUrl('https://localhost:7054/draw', {
        accessTokenFactory: () => this.userId,
      })
      .withAutomaticReconnect()
      .build();

    this.startConnection();
    this.callHelloWorld();
    this.joinLobby();
  }

  private generateUserId(): string {
    return crypto.randomUUID();
  }

  private callHelloWorld() {
    const methodName = 'HelloWorld';
    this.isConnectionEstablished
      .pipe(
        filter((connected) => connected), // Wait for the connection to be established.
        take(1),
        switchMap(() => this.connection.invoke(methodName)),
        tap((val) =>
          console.log(`Hub method "${methodName}" returned: ${val}`),
        ),
      )
      .subscribe();
  }

  private joinLobby() {
    const methodName = 'JoinLobby';
    this.isConnectionEstablished
      .pipe(
        filter((connected) => connected),
        switchMap(() => this.connection.invoke(methodName)),
      )
      .subscribe();

    this.connection.on('ReceivePlayerList', (players: string[]) => {
      console.log('Received player list:', players);
      this.playerListSubject.next(players);
    });

    this.connection.on('LobbyFullAlert', (message: string) => {
      alert(message);
    });

    this.connection.on('ReceiveRandomWord', (word: string) => {
      console.log('Random Word Received:', word);
      this.randomWord = word;
    });
  }

  private startConnection() {
    this.connection.start().then(() => {
      this.isConnectionEstablished.next(true);
    });
  }

  public sendDrawData(data: DrawData) {
    this.connection
      .invoke('SendDrawData', data)
      .catch((err) => console.error('Error sending draw data: ', err));
  }

  public onDraw(callback: (data: DrawData) => void) {
    this.connection.on('ReceiveDrawData', callback);
  }

  // Expose the player list as an observable
  getPlayerListObservable() {
    return this.playerListSubject.asObservable();
  }

  getRandomWord(): string | null {
    return this.randomWord;
  }

  onRandomWord(callback: (word: string) => void): void {
    this.connection?.on('ReceiveRandomWord', callback);
  }
}
