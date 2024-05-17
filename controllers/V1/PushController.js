import express from "express";
import SendNotification_CallBack from "../../callbacks/SendNotification_Callback.js";

const Router = express.Router();

Router.post("/send", SendNotification_CallBack);

export default Router;
