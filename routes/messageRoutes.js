import express from "express";
import {
  getMessage,
  getUsersFroSidebar,
  markMessageAsSeen,
} from "../controllers/message.controller";
import { protectRoute } from "../middleware/auth";

const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getUsersFroSidebar);
messageRouter.get("/:id", protectRoute, getMessage);
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);

export default messageRouter;
