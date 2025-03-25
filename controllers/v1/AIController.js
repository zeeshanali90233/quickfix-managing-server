import express from "express";
import { DialogFlowResponse_Callback } from "../../callbacks/v1/ai/response.js";
import { AILLMResponse } from "../../callbacks/v1/ai/webhook.mjs";
import { verifyAuth } from "../../utils/middlewares.mjs";

const Router = express.Router();

// Webhook Enbdpoint
Router.post("/dialogflow/webhook", AILLMResponse);
// CheckUserAuthenticity
Router.post("/dialogflow", verifyAuth, DialogFlowResponse_Callback);

export default Router;
