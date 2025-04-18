import express from "express";

import {
  CreateTechnician,
  DeleteTechnician,
  GetAllTechnicians,
  GetTechnicianByID,
  UpdateTechnician,
} from "../../../controllers/v1/users/technician.controller.js";

const technicianRouter = express.Router();

technicianRouter.post("/add", CreateTechnician);
technicianRouter.get("/", GetAllTechnicians);
technicianRouter.get("/:id", GetTechnicianByID);
technicianRouter.put("/:id", UpdateTechnician);
technicianRouter.delete("/:id", DeleteTechnician);
technicianRouter.get("/test", (req, res) => {
  res.status(200).send({ message: "success" });
});

export { technicianRouter };
