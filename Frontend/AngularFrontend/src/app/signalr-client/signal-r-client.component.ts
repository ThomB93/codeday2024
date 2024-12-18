import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, filter, switchMap, take, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-signalr-client',
  standalone: true,
  imports: [FormsModule, AsyncPipe],
  templateUrl: './signal-r-client.component.html',
  styleUrl: './signal-r-client.component.scss',
})
export class SignalRClientComponent {
  private connection!: HubConnection;

  userName!: string;
  inputText!: string;
  isConnectionEstablished = new BehaviorSubject<boolean>(false);
  messages: string[] = [];

  constructor() {
    // Just generate a random user ID for this example. Possibly add real authentication if you have the time.
    const userId = this.generateUserId();

    // Absolute URL is necessary when serving with ng serve/npm run start.
    // Relative URL ("/sample") is okay when building with ng build/npm run build and serving
    // the static files from within the ASP.NET Core app.
    this.connection = new HubConnectionBuilder()
      .withUrl('https://localhost:7054/sample', {
        accessTokenFactory: () => userId,
      })
      .withAutomaticReconnect()
      .build();

    this.registerMethodListeners();
    this.startConnection();
    this.callHelloWorld();
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

  sendMessage() {
    const message = { user: this.userName, text: this.inputText };

    this.connection.invoke('SendMessage', message).catch((err) => {
      return console.error(err.toString());
    });
  }

  private startConnection() {
    this.connection.start().then(() => {
      this.isConnectionEstablished.next(true);
    });
  }

  private registerMethodListeners() {
    this.receiveMessages();
  }

  private receiveMessages() {
    this.connection.on('ReceiveMessage', (response) => {
      this.messages.push(`${response.user} says ${response.text}`);
    });
  }
}
