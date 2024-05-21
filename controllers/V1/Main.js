import express from "express";
import PushController from "./PushController.js";
import UserController from "./UserController.js";

const Router = express.Router();

Router.use("/push", PushController);
Router.use("/user", UserController);

export default Router;
