import cors from "cors";
import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./lib/db.js";
import messageRouter from "./routes/messageRoutes.js";
import userRouter from "./routes/userRoutes.js";
const PORT = process.env.PORT || 5000;

// create expres app and HTTP server
const app = express();
const server = createServer(app);

// middleware
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// intialize socket.io server
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// store online users
export const userSocketMap = {}; // {userId: socketId}

// socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) userSocketMap[userId] = socket.id;

  // Emit online users to al connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// ------- routes ------------

app.use("/api/auth", userRouter);
app.use("/api/message", messageRouter);

app.use("/", (req, res) => {
  res.send("quickChat server is running");
});

// ----- connect db -------
const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => console.log(`server is running on port - ${PORT}`));
};

if (process.env.NODE_ENV !== "production") {
  startServer();
}

// export server for vercel
export default server;
