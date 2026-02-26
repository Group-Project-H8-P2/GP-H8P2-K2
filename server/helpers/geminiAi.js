const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

async function generatedText(message) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Kamu adalah ai yang membantu semua pertanyaan 
      yang diberikan oleh user, jawab singkat dan jelas.
      user: ${message}`,
    });

    const text =
      response.candidates?.[0]?.content?.parts
        ?.map((part) => part.text)
        .join("") || "Maaf, saya tidak bisa menjawab.";

    return text;
  } catch (error) {
    console.log(error);
    return "Terjadi kesalahan saat generate AI.";
  }
}

async function generatedFromImage(imageUrl, text) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          fileData: {
            fileUri: imageUrl,
            mimeType: "image/jpeg",
          },
        },
        {
          text: `Jawab pertanyaan berikut berdasarkan gambar dan maksimal 20 kata: ${text}`,
        },
      ],
    });

    const aiText =
      response.candidates?.[0]?.content?.parts
        ?.map((part) => part.text)
        .join("") || "Maaf, saya tidak bisa menganalisa gambar.";

    return aiText;
  } catch (error) {
    console.log(error);
    return "Terjadi kesalahan saat analisa gambar.";
  }
}

async function generateSummary(messages, count) {
  try {
    // Format messages as a conversation transcript
    const transcript = messages
      .map((msg) => {
        const username = msg.User?.username || "Unknown";
        const content = msg.imageUrl ? "[sent an image]" : msg.content;
        return `${username}: ${content}`;
      })
      .join("\n");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Kamu adalah ai yang merangkum percakapan chat. 
Berikut adalah ${count} pesan terakhir dari chat:

${transcript}

Buatlah ringkasan singkat dari percakapan di atas dalam 2-3 kalimat yang jelas dan informatif dalam bahasa Indonesia.`,
    });

    const summary =
      response.candidates?.[0]?.content?.parts
        ?.map((part) => part.text)
        .join("") || "Maaf, saya tidak bisa membuat ringkasan.";

    return summary;
  } catch (error) {
    console.log(error);
    return "Terjadi kesalahan saat membuat ringkasan.";
  }
}

module.exports = { generatedText, generatedFromImage, generateSummary };
