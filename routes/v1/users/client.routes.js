import express from "express";
import {
  GetAllClients,
  GetAllClientsRequests,
  GetClientInfo,
  GetClientRequests,
  UpdateClientCredits,
  BlockClient,
  UnblockClient,
  SearchClients,
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
clientRouter.get("/search", SearchClients);
clientRouter.get("/requests", GetAllClientsRequests);
clientRouter.get("/:id/requests", GetClientRequests);
clientRouter.get("/:id", GetClientInfo); //client info individual

clientRouter.put("/:id/credits", UpdateClientCredits);
clientRouter.put("/:id/block", BlockClient);
clientRouter.put("/:id/unblock", UnblockClient);

export { clientRouter };
