import express from "express";
import ResetUserPassword_Callback from "../../callbacks/ResetUserPassword_Callback.js";
import CheckUserAuthenticity from "../../middleware/UserAuthenticity.js";
import DeleteUser_Callback from "../../callbacks/DeleteUser_Callback.js";
import DeleteUserPassword_Callback from "../../callbacks/DeleteUserPassword_Callback.js";

const Router = express.Router();

Router.post(
  "/reset_password",
  CheckUserAuthenticity,
  ResetUserPassword_Callback
);
Router.delete("/delete", CheckUserAuthenticity, DeleteUserPassword_Callback);
Router.delete("/delete", CheckUserAuthenticity, DeleteUser_Callback);

export default Router;
