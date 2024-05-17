import express from "express";
import PushController from "./PushController.js";

const Router = express.Router();

Router.use("/push", PushController);

export default Router;
