import { createServer } from "http";
import { Server } from "socket.io";
import { websocket } from "./dist/websocket.js";
import { handler } from "./build/handler.js";

const { PORT = 3000 } = process.env;
const server = createServer(handler);

websocket(new Server(server));

server.listen(PORT, () => {
  process.stdout.write(`Multiprocessor Simulator running on :${PORT}\n`);
});
