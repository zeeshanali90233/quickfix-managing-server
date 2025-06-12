import express from "express";
import { sendNotifications } from "../../../controllers/v1/push/notification.controller.js";
import { checkUserAuthToken } from "../../../middleware/checkUserAuthToken.js";

const pushRouter = express.Router();

pushRouter.post("/send", checkUserAuthToken, sendNotifications);

export { pushRouter };
