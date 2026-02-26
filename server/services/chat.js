const { User, Message } = require("../models");
const {
  generatedText,
  generatedFromImage,
  generateSummary,
} = require("../helpers/geminiAi");

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

    // Check if user wants a summary
    const summarizeMatch = question.match(/^summarize\s*(\d*)$/i);
    
    if (summarizeMatch) {
      // Extract count from command, default to 20
      let messageCount = parseInt(summarizeMatch[1]) || 20;
      
      // Clamp count between 10 and 20
      messageCount = Math.max(10, Math.min(20, messageCount));
      
      // Query recent messages for summarization
      const recentMessages = await Message.findAll({
        limit: messageCount,
        include: [{ model: User, attributes: ["username"] }],
        order: [["createdAt", "DESC"]],
      });
      
      // Reverse to chronological order (oldest first)
      const messagesForSummary = recentMessages.reverse();
      
      aiResponse = await generateSummary(messagesForSummary, messageCount);
    } else if (imageUrl) {
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
