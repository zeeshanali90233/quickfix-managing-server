import express from "express";
import ResetUserPassword_Callback from "../../callbacks/ResetUserPassword_Callback.js";
import CheckUserAuthenticity from "../../middleware/UserAuthenticity.js";

const Router = express.Router();

Router.post(
  "/reset_password",
  CheckUserAuthenticity,
  ResetUserPassword_Callback
);

export default Router;
