import * as signalR from "@microsoft/signalr";
import { HubConnection } from "@microsoft/signalr";

export class SignalRClient {
  private sendButton: HTMLInputElement;
  private userInput: HTMLInputElement;
  private messageInput: HTMLInputElement;
  private messageList: HTMLUListElement;

  private connection: HubConnection;

  constructor() {
    this.sendButton = <HTMLInputElement>document.querySelector("#sendButton");
    this.userInput = <HTMLInputElement>document.querySelector("#userInput");
    this.messageInput = <HTMLInputElement>(
      document.querySelector("#messageInput")
    );

    this.messageList = <HTMLUListElement>(
      document.querySelector("#messagesList")
    );
  }

  async start() {
    // Just generate a random user ID for this example. Possibly add real authentication if you have the time.
    const userId = this.generateUserId();

    // This is just an example that shows how to connect to a SignalR hub named "sample".
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("/sample", { accessTokenFactory: () => userId })
      .withAutomaticReconnect()
      .build();

    this.registerMethodListeners();
    await this.startConnection();
    this.addClickHandler();
    await this.callHelloWorld();
  }

  private generateUserId(): string {
    return crypto.randomUUID();
  }

  private async callHelloWorld() {
    const methodName = "HelloWorld";
    const val = await this.connection.invoke(methodName);
    console.log(`Hub method "${methodName}" returned ${val}`);
  }

  private addClickHandler() {
    this.sendButton.addEventListener("click", async (event) => {
      event.preventDefault();
      await this.sendMessage();
    });
  }

  private registerMethodListeners() {
    this.receiveMessages();
    // Register other listeners.
  }

  private receiveMessages() {
    // Listen for the "ReceiveMessage" method and display the message in the list
    this.connection.on("ReceiveMessage", (response) => {
      const li = document.createElement("li");
      li.textContent = `${response.user} says ${response.text}`;
      this.messageList.appendChild(li);
    });
  }

  private async sendMessage() {
    const message = {
      user: this.userInput.value,
      text: this.messageInput.value,
    };
    await this.connection.invoke("SendMessage", message);
  }

  private async startConnection() {
    await this.connection.start();
  }
}
