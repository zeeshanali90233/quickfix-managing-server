import express from "express";
import { increaseRequestCallBack } from "../../../controllers/v1/request/request.controller.js";

const requestRouter = express.Router();

requestRouter.put("/update/:id", increaseRequestCallBack);

export { requestRouter };
