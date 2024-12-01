import express from "express";
import ResetUserPassword_Callback from "../../callbacks/ResetUserPassword_Callback.js";
import CheckUserAuthenticity from "../../middleware/UserAuthenticity.js";
import DeleteUser_Callback from "../../callbacks/DeleteUser_Callback.js";
import {
  CreateAdmin,
  DeleteAdmin,
  FetchAllAdmins,
} from "../../callbacks/CreateAdmin_Callback.js";
import {
  CreateTechnician,
  DeleteTechnician,
  GetTechnicians,
} from "../../callbacks/AddTechnician_Callback.js";

const Router = express.Router();

Router.post(
  "/reset_password",
  CheckUserAuthenticity,
  ResetUserPassword_Callback
);
Router.delete("/delete", CheckUserAuthenticity, DeleteUser_Callback);

//Admin Routes
Router.post("/admins/add", CreateAdmin);
Router.get("/admins", FetchAllAdmins);
Router.delete("/admins/:id", DeleteAdmin);

//Technician Routes
Router.post("/technicians/add", CreateTechnician);
Router.get("/technicians", GetTechnicians);
Router.delete("/technicians/:id", DeleteTechnician);

export default Router;
