import express from "express";
import { sendNotification } from "../../../controllers/v1/push/notification.controller.js";
import { checkUserAuthToken } from "../../../middleware/checkUserAuthToken.js";

const pushRouter = express.Router();

pushRouter.post("/send", checkUserAuthToken, sendNotification);

export { pushRouter };
