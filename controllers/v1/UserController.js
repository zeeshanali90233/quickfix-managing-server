import express from "express";
import ResetUserPassword_Callback from "../../callbacks/ResetUserPassword_Callback.js";
import CheckUserAuthenticity from "../../middleware/UserAuthenticity.js";
import DeleteUser_Callback from "../../callbacks/DeleteUser_Callback.js";
import {
  CreateAdmin,
  DeleteAdmin,
  FetchAdmin,
} from "../../callbacks/Admin_Callbacks.js";
// import {
//   CreateTechnician,
//   DeleteTechnician,
//   GetTechnicians,
// } from "../../callbacks/Technician_Callbacks.js";
import {
  CreateClientAnnouncement,
  FetchClientAnnouncements,
  DeleteClientAnnouncement,
} from "../../callbacks/ClientAnnoucement_Callback.js";
import { CreateTechnician, DeleteTechnician, GetTechnicians } from "../../callbacks/Technician_Callbacks.js";

const Router = express.Router();

//Admin Routes
Router.post("/admins/add", CreateAdmin);
Router.get("/admin:id", FetchAdmin);
Router.delete("/admins/:id", DeleteAdmin);

//Technician Routes
Router.post("/technicians/add", CreateTechnician);
Router.get("/technician:id", GetTechnicians);
Router.delete("/technicians/:id", DeleteTechnician);

// Client Announcement Routes
Router.post("/announcements/add", CreateClientAnnouncement);
Router.get("/announcements", FetchClientAnnouncements);
Router.delete("/announcements/:id", DeleteClientAnnouncement);

export default Router;
