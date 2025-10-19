import MessageModel from "../models/message.model.js";
import UserModel from "../models/user.model.js";

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
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
