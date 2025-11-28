import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY); 

export async function askGemini(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",  // You can use 1.5-pro if needed
    });

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("Gemini Error:", err);
    return "❌ Gemini API error. Please check your API key.";
  }
}
