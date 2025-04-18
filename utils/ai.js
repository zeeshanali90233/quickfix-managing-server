import { GoogleGenerativeAI } from "@google/generative-ai";
import { systemPrompt } from "./prompt.js";
import { GEMINI_KEY } from "../config/env.js";

const geminiAI = new GoogleGenerativeAI(GEMINI_KEY);

export const getAIGeminiResponse = async (
  context,
  query,
  successCB = () => {},
  errorCB = () => {}
) => {
  try {
    const generationConfig = {
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
      generationConfig,
    });

    const chat = model.startChat({
      systemInstruction,
      history: [{ role: "user", parts: [{ text: "Hello" }] }, ...context],
    });

    const result = await chat.sendMessage(query);

    if (result?.response?.text) {
      const responseText = result.response.text();
      successCB(responseText);
      return responseText;
    } else if (typeof result?.response === "string") {
      successCB(result.response);
      return result.response;
    } else {
      throw new Error("Unexpected response structure.");
    }
  } catch (err) {
    errorCB(`Gemini AI Error: ${err.message}`);
    return "Something went wrong. Please check your internet connection and try again.";
  }
};
