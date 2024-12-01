import express from "express";
import ResetUserPassword_Callback from "../../callbacks/ResetUserPassword_Callback.js";
import CheckUserAuthenticity from "../../middleware/UserAuthenticity.js";
import DeleteUser_Callback from "../../callbacks/DeleteUser_Callback.js";
import {
  CreateAdmin,
  FetchAllAdmins,
  DeleteAdmin,
} from "../../callbacks/CreateAdmin_Callback.js";

import {
  CreateTechnician,
  GetTechnicians,
  DeleteTechnician,
} from "../../callbacks/AddTechnician_Callback.js";

const Router = express.Router();

Router.post(
  "/reset_password",
  CheckUserAuthenticity,
  ResetUserPassword_Callback
);
Router.delete("/delete", CheckUserAuthenticity, DeleteUser_Callback);

Router.post("/admins/add", CreateAdmin);
Router.get("/admins", FetchAllAdmins);
Router.delete("/admins/:id", DeleteAdmin);

//Routes for Technicians
Router.post("/technicians/add", CreateTechnician);
Router.get("/technicians", GetTechnicians);
Router.delete("/technicians/:id", DeleteTechnician);

export default Router;
