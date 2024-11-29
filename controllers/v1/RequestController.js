import express from "express";
import DeleteUser_Callback from "../../callbacks/DeleteUser_Callback.js";
import { getRequestCallback } from "../../callbacks/v1/requests/getRequest.js";

const Router = express.Router();

Router.delete("/delete/:id", DeleteUser_Callback);
Router.put("/update/:id", DeleteUser_Callback);
Router.post("/save", DeleteUser_Callback);
Router.get("/:id", getRequestCallback);

export default Router;
