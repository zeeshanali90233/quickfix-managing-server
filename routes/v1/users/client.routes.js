import express from "express";
import {
  GetAllClients,
  GetAllClientsRequests,
  GetClientInfo,
  GetClientRequests,
  UpdateClientCredits,
  BlockClient,
  UnblockClient,
} from "../../../controllers/v1/users/client.controller.js";

import {
  CreateClientAnnouncement,
  DeleteClientAnnouncement,
  FetchClientAnnouncements,
} from "../../../controllers/v1/users/announcement.controller.js";

const clientRouter = express.Router();

// Client Announcement Routes
clientRouter.post("/announcements/add", CreateClientAnnouncement);
clientRouter.get("/announcements", FetchClientAnnouncements);
clientRouter.delete("/announcements/:id", DeleteClientAnnouncement);

clientRouter.get("/", GetAllClients);
clientRouter.get("/requests", GetAllClientsRequests);
clientRouter.get("/:id/requests", GetClientRequests);
clientRouter.get("/:id", GetClientInfo); //client info individual
clientRouter.get("/test", (req, res) => {
  res.status(200).send({ message: "success" });
});

clientRouter.put("/:id/credits", UpdateClientCredits);
clientRouter.put("/:id/block", BlockClient);
clientRouter.put("/:id/unblock", UnblockClient);

export { clientRouter };
