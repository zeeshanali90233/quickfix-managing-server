import { clientRouter } from "./client.routes.js";
import { technicianRouter } from "./technician.routes.js";
import { adminRouter } from "./admin.routes.js";
import express from "express";

const userRouter = express.Router();

userRouter.use("/clients", clientRouter);
userRouter.use("/technicians", technicianRouter);
userRouter.use("/admins", adminRouter);

export { userRouter };
