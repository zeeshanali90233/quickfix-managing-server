import express from "express";
import PushController from "./PushController.js";
import UserController from "./UserController.js";
import RequestController from "./RequestController.js";
import AIController from "./AIController.js";

const Router = express.Router();

Router.use("/ai", AIController);
Router.use("/push", PushController);
Router.use("/user", UserController);
Router.use("/requests", RequestController);

export default Router;
