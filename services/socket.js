// services/socket.js
import { Server } from "socket.io";
import { checkClientAuthSocket } from "../middleware/checkClientAuthSocket.js";
import { sendPushNotification } from "../utils/fcm.js";

let io;

export function initializeSocketIO(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  io.use(checkClientAuthSocket);

  initializeNotificationNamespace();
  initializeChatNamespace();

  return io;
}

function initializeNotificationNamespace() {
  const notificationNamespace = io.of("/notification");

  notificationNamespace.on("connection", (socket) => {
    const groupId = socket.handshake.query.groupId;
    socket.join(groupId);

    socket.on("send_message", (packet) => {
      notificationNamespace.to(packet.to).emit("notification", packet.message);
    });

    socket.on("send_push_fcm", (packet) => {
      sendPushNotification(packet);
    });

    socket.on("public_announcement", (packet) => {
      socket.broadcast.emit("public_announcement", packet);
    });

    socket.on("disconnect", () => {
      console.log("socket is disconnected for notifications");
    });
  });
}

function initializeChatNamespace() {
  const chatNamespace = io.of("/chat");

  chatNamespace.on("connection", (socket) => {
    const groupId = socket.handshake.query.groupId;
    socket.join(groupId);

    socket.on("send", (packet) => {
      chatNamespace.to(packet.to).emit("receive", packet);
    });

    socket.on("disconnect", () => {
      console.log("socket is disconnected for chat");
    });
  });
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }
  return io;
}
