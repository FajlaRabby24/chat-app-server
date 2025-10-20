import cors from "cors";
import "dotenv/config";
import express from "express";
import { createServer } from "http";
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

// ------- routes ------------
app.use("/", (req, res) => {
  res.send("quickChat server is running");
});

// auth route
app.use("/api/auth", userRouter);
app.use("/api/message", messageRouter);

// ----- connect db -------
const startServer = async () => {
  await connectDB();
  server.listen(5000, () => console.log(`server is running on port - ${PORT}`));
};

startServer();
