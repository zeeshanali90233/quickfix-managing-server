import express from "express";
import cors from "cors";
import { createServer } from "http";
import { PORT } from "./config/env.js";
import { connectToDatabase } from "./database/mongodb.js";
import { limiter } from "./config/rateLimiter.js";
import { setupRoutes } from "./routes/v1.routes.js";
import { initializeSocketIO } from "./services/socket.js";
import { initializeDialogFlow } from "./services/dialogflow.js";

const initializeExpress = () => {
  const app = express();

  app.use(cors());
  app.use(limiter);
  app.use(express.json());
  app.use("/public", express.static("public"));

  setupRoutes(app);

  return app;
};

const startServer = async (successCB = () => {}, errorCB = () => {}) => {
  try {
    const app = initializeExpress();
    const httpServer = createServer(app);

    await connectToDatabase(
      (s) => console.log(`Database: ${s}`),
      (e) => console.error(`Database: ${e}`)
    );

    initializeDialogFlow(
      (s) => console.log(`DialogFlow: ${s}`),
      (e) => console.error(`DialogFlow: ${e}`)
    );

    httpServer.listen(PORT || 8080, () => {
      const msg = `✅ Server running on port ${PORT || 8080}`;
      console.log(msg);
      successCB(msg);
    });

    initializeSocketIO(httpServer);

    process.on("uncaughtException", (e) => {
      console.error("Uncaught Exception:", e);
      errorCB(e);
    });

    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Promise Rejection:", reason);
      errorCB(reason);
    });

    return httpServer;
  } catch (e) {
    console.error("Failed to start server:", e);
    errorCB(e);
    process.exit(1);
  }
};

startServer(
  (s) => console.log("👍 Server Success Callback:", s),
  (e) => console.log("❌ Server Error Callback:", e)
);
