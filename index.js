import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { rateLimit } from "express-rate-limit";
import V1_Main from "./controllers/v1/Main.js";
import { Server } from "socket.io";
import CheckSocketClientAuth from "./middleware/SocketUserAuth.js";
import { ConnectMongoDB } from "./lib/mongodb.js";
import { SessionsClient } from "@google-cloud/dialogflow-cx";

dotenv.config();

// Instantiate a client
export const dialogFlowClient = new SessionsClient({
  apiEndpoint: `${process.env.LOCATION}-dialogflow.googleapis.com`,
});

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 50, // Limit each IP to 50 requests per `window` (here, per 10 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: true, // Disable the `X-RateLimit-*` headers.
});

const app = express();

app.use(cors());
app.use(limiter);
app.use(express.json());
app.use("/public", express.static("public"));

ConnectMongoDB();

// V1
app.use("/v1", V1_Main);

app.get("/status_check", async (req, res) => {
  res.status(200).json({ message: "Server is working, Are you developer?" });
});

const server = app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is listening at ${process.env.PORT || 3000}`);
});

// Socket IO
export const io = new Server(server, { cors: { origin: "*" } });
io.use(CheckSocketClientAuth);

const notificationNamespace = io.of("/notification");

notificationNamespace.on("connection", (socket) => {
  socket.join(socket.handshake.query.userId);

  socket.on("send_message", (packet) => {
    notificationNamespace.to(packet.to).emit("notification", packet.message);
  });

  socket.on("public_announcement", (packet) => {
    socket.broadcast.emit("public_announcement", packet);
  });
});

const chatNamespace = io.of("/chat");
chatNamespace.on("connection", (socket) => {
  socket.join(socket.handshake.query.groupId);
  // console.log(socket.handshake.query.groupId);

  socket.on("send", (packet) => {
    chatNamespace.to(packet.to).emit("receive", packet);
  });
});
