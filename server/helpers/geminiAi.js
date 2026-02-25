const { GoogleGenAI } = require("@google/genai");
const dotenv = require('dotenv');
dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

async function generatedText(message) {
    try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `Kamu adalah ai yang membantu semua pertanyaan 
          yang diberikan oleh user,jawab singkat dan jelas
          user: ${message}`,
        });
        return (response.text);
        
    } catch (error) {
        console.log(error);
        
    }
}

async function generatedFromImage(imageUrl,text) {
    try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents:[
            {
                fileData: {
                    fileUri: imageUrl,
                    mimeType: "image/jpeg"
                }
            },
            {
                text: `Jawab pertanyaan berikut berdasarkan gambar yang diberikan dan
                maksimal 20 kata: ${text}`
            }
          ]
        });
        return (response.text);
    } catch (error) {
        console.log(error);
        
    }
}

module.exports = { generatedText, generatedFromImage };