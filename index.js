import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { rateLimit } from "express-rate-limit";
import V1_Main from "./controllers/V1/Main.js";
import { Server } from "socket.io";
import CheckSocketClientAuth from "./middleware/SocketUserAuth.js";

dotenv.config();

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

// V1
app.use("/v1", V1_Main);

const server = app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is listening at ${process.env.PORT || 3000}`);
});

app.get("/", async (req, res) => {
  res.status(200).json({ message: "Welcome to Maxcool Sever" });
});

// Socket IO
const io = new Server(server, { cors: { origin: "*" } });
io.use(CheckSocketClientAuth);
io.on("connection", (socket) => {
  socket.join(socket.handshake.query.groupId);

  socket.on("send_message", (packet) => {
    io.to(packet.to).emit("notification", packet.message);
  });
});
