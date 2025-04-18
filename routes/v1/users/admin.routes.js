import express from "express";
import {
  CreateAdmin,
  DeleteAdmin,
  GetAllAdmins,
  UpdateAdmin,
} from "../../../controllers/v1/users/admin.controller.js";

const adminRouter = express.Router();

adminRouter.post("/add", CreateAdmin);
adminRouter.get("/", GetAllAdmins);
adminRouter.delete("/:id", DeleteAdmin);
adminRouter.put("/:id", UpdateAdmin);
adminRouter.get("/test", (req, res) => {
  res.status(200).send({ message: "success" });
});

export { adminRouter };
