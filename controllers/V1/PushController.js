import express from "express";
import SendNotification_CallBack from "../../callbacks/SendNotification_Callback.js";
import CheckUserAuthenticity from "../../middleware/UserAuthenticity.js";

const Router = express.Router();

Router.post("/send", CheckUserAuthenticity, SendNotification_CallBack);

export default Router;
