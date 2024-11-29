import express from "express";
import CheckUserAuthenticity from "../../middleware/UserAuthenticity.js";
import { DialogFlowResponse_Callback } from "../../callbacks/v1/ai/response.js";

const Router = express.Router();

// CheckUserAuthenticity
Router.post("/dialogflow", DialogFlowResponse_Callback);

export default Router;
