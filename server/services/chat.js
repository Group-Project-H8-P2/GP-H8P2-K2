const { User, Message } = require("../models");
const { generatedText, generatedFromImage } = require("../helpers/geminiAi");

async function handleJoin(username) {
  const [user] = await User.findOrCreate({
    where: { username },
  });

  const messages = await Message.findAll({
    limit: 20,
    include: [{ model: User, attributes: ["username"] }],
    order: [["createdAt", "DESC"]],
  });

  return {
    userId: user.id,
    messages: messages.reverse(),
  };
}

async function handleChatMessage(userId, msg) {
  const { text, imageUrl } = msg;

  const newMessage = await Message.create({
    content: text,
    imageUrl: imageUrl || "",
    UserId: userId,
  });

  const messageWithUser = await Message.findByPk(newMessage.id, {
    include: User,
  });

  let botMessageWithUser = null;

  if (text?.includes("@BotAI")) {
    const question = text.replace("@BotAI", "").trim();
    let aiResponse = "";

    if (imageUrl) {
      aiResponse = await generatedFromImage(imageUrl, question);
    } else {
      aiResponse = await generatedText(question);
    }

    const [botUser] = await User.findOrCreate({
      where: { username: "BotAI" },
    });

    const botMessage = await Message.create({
      content: aiResponse,
      UserId: botUser.id,
    });

    botMessageWithUser = await Message.findByPk(botMessage.id, {
      include: User,
    });
  }

  return {
    userMessage: messageWithUser,
    botMessage: botMessageWithUser,
  };
}

module.exports = {
  handleJoin,
  handleChatMessage,
};
