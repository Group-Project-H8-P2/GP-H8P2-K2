require('dotenv').config();
const express = require('express');
const cors = require("cors");
const uploadRoute = require('./routes/upload.route');
const { createServer } = require('node:http');
const { Server } = require("socket.io");
const { User, Message } = require('./models');
const { generatedText,generatedFromImage } = require('./helpers/geminiAi');

const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});
app.use(express.json());
app.use('/upload', uploadRoute);
app.use("/uploads", express.static("uploads"));

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
        const messages = await Message.findAll({
            limit: 20,
            include: [{ model: User, attributes: ['username'] }],
            order: [['createdAt', 'ASC']]
        });
        socket.emit(`chat history`, messages);
    } catch (error) {
        console.error('Error joining chat:', error);
    }
    });

    socket.on(`chat message`, async (msg) => {
        try {
            const userId = socket.data.userId;

            const {text,imageUrl} = msg;
            const newMessage = await Message.create({
                content: text,
                imageUrl: imageUrl ||"",
                UserId: userId
            });
            const messageWithUser = await Message.findByPk(newMessage.id, {
                include: User
            });
            io.emit(`chat message`, messageWithUser);


            if(text?.includes("@BotAI")){
                const question = text.replace("@BotAI", "").trim();
                let aiResponse = "";

                if(imageUrl){
                    aiResponse = await generatedFromImage(imageUrl,question);
                } else {
                    aiResponse = await generatedText(question);
                }

                const [botUser] = await User.findOrCreate({
                    where: { username: "BotAI" }
                });

                const botMessage = await Message.create({
                    content: aiResponse,
                    UserId: botUser.id
                });
              
                const botMessageWithUser = await Message.findByPk(botMessage.id, {
                    include: User
                });
                io.emit(`chat message`, botMessageWithUser);

            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });

});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});