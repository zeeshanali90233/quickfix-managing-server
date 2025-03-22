import express from "express";
import CheckUserAuthenticity from "../../middleware/UserAuthenticity.js";
import { DialogFlowResponse_Callback } from "../../callbacks/v1/ai/response.js";
import { AILLMResponse } from "../../callbacks/v1/ai/webhook.mjs";

const Router = express.Router();

// Webhook Enbdpoint
Router.post("/dialogflow/webhook",AILLMResponse);
// CheckUserAuthenticity
Router.post("/dialogflow", DialogFlowResponse_Callback);

export default Router;
