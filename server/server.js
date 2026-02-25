const { createServer } = require("node:http");
const { Server } = require("socket.io");
const app = require("./app");
const socketHandler = require("./socket/socket");

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

socketHandler(io);

server.listen(3001, () => {
  console.log("server running at http://localhost:3001");
});
