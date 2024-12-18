import "./css/styles.css";
import { Game } from "./ts/game";
import { SignalRClient } from "./ts/signal-r-client";

const game = new Game();
const signalRClient = new SignalRClient();

game.start();
signalRClient.start();
