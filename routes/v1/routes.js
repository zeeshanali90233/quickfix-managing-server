import express from "express";
import { aiRouter } from "./ai/ai.routes.js";
import { pushRouter } from "./push/push.routes.js";
import { userRouter } from "./users/index.js";
import { requestRouter } from "./requests/requests.routes.js";

const Router = express.Router();

Router.use("/ai", aiRouter);
Router.use("/push", pushRouter);
Router.use("/requests", requestRouter);
Router.use("/users", userRouter);

export { Router };
