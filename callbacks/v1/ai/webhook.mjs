import { getAIGeminiResponse } from "../../../utils/ai.mjs";
import {
  addResponseToRedis,
  getResponseFromRedis,
} from "../../../utils/redis.mjs";

export async function AILLMResponse(req, res) {
  const body = req.body;
  try {
    const sendPhoneNumber = body["sessionInfo"]["session"]
      .split("/")
      .slice(-1)[0];

    const context = await getResponseFromRedis(sendPhoneNumber);
    const geminiHistory = context
      ?.flatMap((interaction) => [
        {
          role: "user",
          parts: [{ text: interaction?.human ?? "" }],
        },
        {
          role: "model",
          parts: [{ text: interaction?.ai ?? "" }],
        },
      ])
      .slice(-20);

    const query = body.text;
    const response = await getAIGeminiResponse(geminiHistory, query);
    // Saving to Redis
    addResponseToRedis(sendPhoneNumber, { ai: response ?? "", human: query });

    const responseMessage = {
      text: {
        text: [response],
      },
    };

    // Send the response back to Dialogflow CX
    res.status(200).json({
      fulfillmentResponse: {
        messages: [responseMessage],
      },
    });
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ message: "Something went wrong" });
  }
}
