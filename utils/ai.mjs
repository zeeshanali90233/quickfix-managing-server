import { GoogleGenerativeAI } from "@google/generative-ai";
import { configDotenv } from "dotenv";
import { systemPrompt } from "../data/prompt.js";

configDotenv();
const geminiAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

export async function getAIGeminiResponse(context, query) {
  try {
    const generation_config = {
      temperature: 1,
      top_p: 0.95,
      top_k: 40,
      max_output_tokens: 1192,
      response_mime_type: "text/plain",
    };

    const systemInstruction = {
      role: "model",
      parts: [
        {
          text: systemPrompt.trim(),
        },
      ],
    };
    const model = geminiAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: generation_config,
    });

    const chat = model.startChat({
      systemInstruction: systemInstruction,
      history: [
        { role: "user", parts: [{ text: "Hello" }] },
        ...context, // Previous interactions
      ],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(query);
    const response = result.response;
    return response.text();
  } catch (err) {
    console.log("Gemini AI Error:", err);
    return "Something went wrong. Please check your internet connection and try again.";
  }
}
