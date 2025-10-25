import cloudinary from "../lib/cloudinary.js";
import MessageModel from "../models/message.model.js";
import UserModel from "../models/user.model.js";
import { io, userSocketMap } from "../server.js";

// GET: all users except the logged in user
export const getUsersFroSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const filterUsers = await UserModel.find({ _id: { $ne: userId } }).select(
      "-password"
    );

    // count number of message not seen
    const unseenMessage = {};
    const promises = filterUsers.map(async (user) => {
      const message = await MessageModel.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });

      if (message.length) {
        unseenMessage[user._id] = message.length;
      }
    });
    await Promise.all(promises);

    res.json({ success: true, users: filterUsers, unseenMessage });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// GET: all message for selected user
export const getMessage = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messages = await MessageModel.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });

    await MessageModel.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// api to mark message as seen using message id
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await MessageModel.findByIdAndUpdate(id, { seen: true });
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// send message to selected user
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await MessageModel.create({
      senderId,
      receiverId,
      text,
      image,
      imageUrl,
    });

    // emit the new message to the receiver's socket
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.json({ success: true, newMessage });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
