import express from "express";
import { increaseRequestCallBack, statusGetRequestsChatbotCallBack } from "../../../controllers/v1/request/request.controller.js";

const requestRouter = express.Router();

requestRouter.put("/update/:id", increaseRequestCallBack);
requestRouter.get("/status/get", statusGetRequestsChatbotCallBack);

export { requestRouter };
