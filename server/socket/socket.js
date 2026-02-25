const chatController = require("../controllers/chat.controller");

function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("join", (username) => {
      chatController.join(io, socket, username);
    });

    socket.on("chat message", (msg) => {
      chatController.sendMessage(io, socket, msg);
    });
  });
}

module.exports = socketHandler;
