const chatService = require("../services/chat");

async function join(io, socket, username) {
  try {
    const data = await chatService.handleJoin(username);

    socket.data.userId = data.userId;
    socket.emit("chat history", data.messages);

    console.log(`${username} joined the chat`);
  } catch (error) {
    console.error("Error joining chat:", error);
  }
}

async function sendMessage(io, socket, msg) {
  try {
    const result = await chatService.handleChatMessage(socket.data.userId, msg);

    io.emit("chat message", result.userMessage);

    if (result.botMessage) {
      io.emit("chat message", result.botMessage);
    }
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

module.exports = {
  join,
  sendMessage,
};
