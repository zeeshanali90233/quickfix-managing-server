import { Router } from "./v1/routes.js";
export const setupRoutes = (app) => {
  app.use("/v1", Router);

  app.get("/status_check", async (req, res) => {
    res.status(200).json({ message: "Server is working, Are you developer?" });
  });

  app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
  });

  app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  });
};
