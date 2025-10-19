import cors from "cors";
import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { connectDB } from "./lib/db.js";
const PORT = process.env.PORT || 5000;

// create expres app and HTTP server
const app = express();
const server = createServer(app);

// middleware
app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.use("/", (req, res) => {
  res.send("quickChat server is running");
});

// ----- connect db -------
await connectDB();

server.listen(PORT, () => {
  console.log(`server is running on port - ${PORT}`);
});
