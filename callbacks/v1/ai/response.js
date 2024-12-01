import { dialogFlowClient } from "../../../index.mjs";
import { detectIntentText } from "../../../lib/dialogflow.js";

export async function DialogFlowResponse_Callback(req, res) {
  const { query, sessionId } = req.body;

  try {
    const response = await detectIntentText(
      dialogFlowClient,
      sessionId,
      query,
      "en"
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
}
