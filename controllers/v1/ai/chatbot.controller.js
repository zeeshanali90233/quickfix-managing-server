import { getAIGeminiResponse } from "../../../utils/ai.js";
import {
  addResponseToRedis,
  getResponseFromRedis,
} from "../../../config/redis.js";
import { getDialogFlowClient } from "../../../services/dialogflow.js";
import { detectIntentText } from "../../../utils/dialogflow.js";

export const aiResponse = async (req, res) => {
  const body = req.body;
  try {
    const sendPhoneNumber = body["sessionInfo"]["session"]
      .split("/")
      .slice(-1)[0];

    const context = await getResponseFromRedis(
      sendPhoneNumber,
      (s) => console.log(s),
      (e) => console.log(e)
    );
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
    const response = await getAIGeminiResponse(
      geminiHistory,
      query,
      (s) => console.log(s),
      (e) => console.log(e)
    );
    addResponseToRedis(
      sendPhoneNumber,
      { ai: response ?? "", human: query },
      (s) => console.log(s),
      (e) => console.log(e)
    );

    const responseMessage = {
      text: {
        text: [response],
      },
    };

    res.status(200).json({
      fulfillmentResponse: {
        messages: [responseMessage],
      },
    });
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ message: "Something went wrong" });
  }
};

export const dialogFlowResponse = async (req, res) => {
  const { query, sessionId } = req.body;

  try {
    const response = await detectIntentText(
      getDialogFlowClient(
        (s) => console.log(s),
        (e) => console.log(e)
      ),
      sessionId,
      query,
      "en",
      (s) => console.log(s),
      (e) => console.log(e)
    );
    res.status(200).json({
      ok: false,
      message: "Successfull Response Sent",
      response: {
        query: query,
        response: response,
      },
    });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Something went wrong" });
  }
};
