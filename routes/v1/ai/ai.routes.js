import express from "express";
import { verifyToken } from "../../../middleware/verifyToken.js";
import {
  aiResponse,
  dialogFlowResponse,
} from "../../../controllers/v1/ai/chatbot.controller.js";

const aiRouter = express.Router();

aiRouter.post("/dialogflow/webhook", aiResponse);
aiRouter.post("/dialogflow", verifyToken, dialogFlowResponse);

export { aiRouter };
