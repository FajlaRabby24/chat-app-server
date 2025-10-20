import express from "express";
import {
  getMessage,
  getUsersFroSidebar,
  markMessageAsSeen,
  sendMessage,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.js";

const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getUsersFroSidebar);
messageRouter.get("/:id", protectRoute, getMessage);
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);
messageRouter.post("/send/:id", protectRoute, sendMessage);

export default messageRouter;
