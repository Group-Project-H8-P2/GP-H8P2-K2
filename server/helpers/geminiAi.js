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

module.exports = { generatedText, generatedFromImage };
