const express = require('express');
const { createServer } = require('node:http');
const { Server } = require("socket.io");
const { User, Message } = require('./models');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on(`join`, async (username) => {
    try {
        const [user, created] = await User.findOrCreate({
            where: { username }
        });
        socket.data.userId = user.id;
        console.log(`${username} joined the chat`);
    } catch (error) {
        console.error('Error joining chat:', error);
    }
    });

    socket.on(`chat message`, async (msg) => {
        try {
            const userId = socket.data.userId;
            const newMessage = await Message.create({
                content: msg,
                UserId: userId
            });
            const messageWithUser = await Message.findByPk(newMessage.id, {
                include: User
            });
            io.emit(`chat message`, messageWithUser);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });

});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});